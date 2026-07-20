import "dotenv/config";
import { Bot, InlineKeyboard, InputFile } from "grammy";
import { detectLang, messages, type Lang } from "./i18n.js";

const BOT_TOKEN = process.env.BOT_TOKEN ?? "";
const API_URL = process.env.API_URL ?? "http://localhost:3001";
const API_KEY = process.env.API_KEY ?? "";
// Адрес локального Bot API сервера (поднимает лимит отправки файлов до 2 ГБ).
// Если не задан — используется облачный api.telegram.org с лимитом 50 МБ.
const BOT_API_ROOT = process.env.BOT_API_ROOT || undefined;
const CLOUD_SIZE_LIMIT = 48 * 1024 * 1024;

// HD (720p и выше) отдаём за Telegram Stars, качество до 480p включительно — бесплатно.
const PAID_QUALITY_MIN_HEIGHT = 720;
const STARS_PRICE = 15;

if (!BOT_TOKEN) {
  console.error("BOT_TOKEN не задан. Получите токен у @BotFather и впишите в bot/.env");
  process.exit(1);
}
if (!API_KEY) {
  console.error("API_KEY не задан. Возьмите ключ из вывода seed-скрипта сервера (server/prisma/seed.ts)");
  process.exit(1);
}

const bot = new Bot(BOT_TOKEN, BOT_API_ROOT ? { client: { apiRoot: BOT_API_ROOT } } : undefined);

// Последняя присланная ссылка на чат — callback_data в Telegram ограничена 64 байтами,
// поэтому URL храним здесь, а в кнопке передаём только тип и качество.
const sessions = new Map<number, { url: string }>();

// Ожидающие оплаты HD-скачивания — invoice_payload тоже ограничен, поэтому
// сами данные (ссылка/качество) держим здесь, а в payload кладём только id.
type PendingDownload = { chatId: number; url: string; kind: "v" | "a"; quality: string; extension: string };
const pendingPayments = new Map<string, PendingDownload>();

function isPaidQuality(kind: string, quality: string): boolean {
  if (kind !== "v") return false;
  const height = parseInt(quality, 10);
  return Number.isFinite(height) && height >= PAID_QUALITY_MIN_HEIGHT;
}

async function api<T = any>(path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: body ? "POST" : "GET",
    headers: { "Content-Type": "application/json", "X-API-Key": API_KEY },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = (await res.json()) as any;
  if (!res.ok) {
    throw new Error(Array.isArray(data?.message) ? data.message.join("; ") : data?.message || `API error ${res.status}`);
  }
  return data as T;
}

function fmtDuration(sec?: number): string {
  if (!sec) return "";
  const m = Math.floor(sec / 60);
  const s = Math.round(sec % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

// Переводит сырые ошибки yt-dlp в понятные пользователю объяснения.
// Instagram/Facebook отдают приватные, возрастные и "чувствительные" ролики
// только залогиненным сессиям — без cookies.txt на сервере такие ссылки не скачать.
function friendlyError(raw: string, lang: Lang): string {
  const msg = (raw || "").toLowerCase();
  const m = messages[lang];

  if (
    msg.includes("certain audiences") ||
    msg.includes("age-restricted") ||
    msg.includes("age restricted") ||
    msg.includes("sign in") ||
    msg.includes("log in") ||
    msg.includes("login required") ||
    msg.includes("requires authentication") ||
    msg.includes("private")
  ) {
    return m.errorLoginRequired;
  }

  if (msg.includes("unsupported platform") || msg.includes("invalid url")) {
    return m.errorUnsupportedPlatform;
  }

  if (msg.includes("requested format is not available")) {
    return m.errorFormatUnavailable;
  }

  return raw;
}

bot.command("start", (ctx) => ctx.reply(messages[detectLang(ctx.from?.language_code)].start));

bot.on("message:text", async (ctx) => {
  const lang = detectLang(ctx.from?.language_code);
  const m = messages[lang];
  const url = ctx.message.text.trim();
  if (!/^https?:\/\//i.test(url)) {
    await ctx.reply(m.notLink);
    return;
  }

  const msg = await ctx.reply(m.fetchingInfo);
  try {
    const info = await api<{
      title: string;
      duration?: number;
      qualities: { video: string[]; audio: string[] };
    }>("/info", {
      url,
      telegramId: ctx.from?.id,
      telegramUsername: ctx.from?.username,
      telegramLanguageCode: ctx.from?.language_code,
    });

    sessions.set(ctx.chat.id, { url });

    const kb = new InlineKeyboard();
    for (const q of (info.qualities.video ?? []).slice(0, 6)) {
      const label = isPaidQuality("v", q) ? `🎬 ${q} ⭐${STARS_PRICE}` : `🎬 ${q}`;
      kb.text(label, `v|${q}`).row();
    }
    kb.text(m.audioOnlyButton, "a|128Kbps");

    const dur = fmtDuration(info.duration);
    await ctx.api.editMessageText(ctx.chat.id, msg.message_id, m.chooseQuality(info.title, dur), {
      reply_markup: kb,
    });
  } catch (e: any) {
    await ctx.api.editMessageText(ctx.chat.id, msg.message_id, `${m.failedPrefix}${friendlyError(e.message, lang)}`);
  }
});

type DownloadMeta = {
  telegramId?: number;
  telegramUsername?: string;
  telegramLanguageCode?: string;
  isPaid: boolean;
  starsAmount?: number;
};

async function performDownload(
  chatId: number,
  kind: "v" | "a",
  quality: string,
  extension: string,
  url: string,
  lang: Lang,
  send: {
    reply: (text: string) => Promise<{ message_id: number }>;
    editMessageText: (messageId: number, text: string) => Promise<unknown>;
    replyWithVideo: (file: InputFile) => Promise<unknown>;
    replyWithAudio: (file: InputFile) => Promise<unknown>;
    deleteMessage: (messageId: number) => Promise<unknown>;
  },
  dlMeta: DownloadMeta,
) {
  const m = messages[lang];
  const msg = await send.reply(m.downloading);

  try {
    const started = await api<{ downloadId: string; fileName: string }>(
      kind === "v" ? "/download/video" : "/download/audio",
      { url, quality, extension, source: "BOT", ...dlMeta },
    );

    let status: { status: string; downloadUrl?: string } | undefined;
    for (let i = 0; i < 400; i++) {
      await new Promise((r) => setTimeout(r, 3000));
      status = await api(`/download/${started.downloadId}/status`);
      if (status && (status.status === "COMPLETED" || status.status === "FAILED")) break;
    }
    if (!status || status.status !== "COMPLETED") {
      throw new Error(status?.status === "FAILED" ? m.downloadFailed : m.downloadTimeout);
    }

    const fileName = encodeURIComponent(started.fileName);
    const fileUrl = `${API_URL}/download/${fileName}`;
    const meta = await api<{ size: number }>(`/download/${fileName}/metadata`);

    // Без локального Bot API сервера облачный лимит — 50 МБ на файл от бота
    if (!BOT_API_ROOT && meta.size > CLOUD_SIZE_LIMIT) {
      const mb = (meta.size / 1024 / 1024).toFixed(1);
      await send.editMessageText(msg.message_id, m.fileTooBig(mb, fileUrl));
      return;
    }

    await send.editMessageText(msg.message_id, m.sendingFile);
    const file = new InputFile(new URL(fileUrl));
    if (kind === "v") {
      await send.replyWithVideo(file);
    } else {
      await send.replyWithAudio(file);
    }
    await send.deleteMessage(msg.message_id);
  } catch (e: any) {
    await send.editMessageText(msg.message_id, `${m.failedPrefix}${friendlyError(e.message, lang)}`);
  }
}

bot.on("callback_query:data", async (ctx) => {
  const lang = detectLang(ctx.from?.language_code);
  const m = messages[lang];
  const chatId = ctx.chat?.id;
  const session = chatId ? sessions.get(chatId) : undefined;
  if (!chatId || !session) {
    await ctx.answerCallbackQuery({ text: m.sessionExpired });
    return;
  }

  const [kind, quality] = ctx.callbackQuery.data.split("|") as ["v" | "a", string];
  const extension = kind === "v" ? "mp4" : "mp3";
  await ctx.answerCallbackQuery();

  if (isPaidQuality(kind, quality)) {
    const id = crypto.randomUUID();
    pendingPayments.set(id, { chatId, url: session.url, kind, quality, extension });
    await ctx.replyWithInvoice(
      m.invoiceTitle(quality),
      m.invoiceDescription(quality, STARS_PRICE),
      id,
      "XTR",
      [{ label: m.invoiceLabel(quality), amount: STARS_PRICE }],
    );
    return;
  }

  const send = {
    reply: (text: string) => ctx.reply(text),
    editMessageText: (messageId: number, text: string) => ctx.api.editMessageText(chatId, messageId, text),
    replyWithVideo: (file: InputFile) => ctx.replyWithVideo(file, { supports_streaming: true }),
    replyWithAudio: (file: InputFile) => ctx.replyWithAudio(file),
    deleteMessage: (messageId: number) => ctx.api.deleteMessage(chatId, messageId),
  };
  await performDownload(chatId, kind, quality, extension, session.url, lang, send, {
    telegramId: ctx.from?.id,
    telegramUsername: ctx.from?.username,
    telegramLanguageCode: ctx.from?.language_code,
    isPaid: false,
  });
});

bot.on("pre_checkout_query", async (ctx) => {
  const lang = detectLang(ctx.from?.language_code);
  const pending = pendingPayments.get(ctx.preCheckoutQuery.invoice_payload);
  if (!pending) {
    await ctx.answerPreCheckoutQuery(false, messages[lang].orderExpired);
    return;
  }
  await ctx.answerPreCheckoutQuery(true);
});

bot.on("message:successful_payment", async (ctx) => {
  const lang = detectLang(ctx.from?.language_code);
  const payload = ctx.message.successful_payment.invoice_payload;
  const pending = pendingPayments.get(payload);
  pendingPayments.delete(payload);
  if (!pending) return;

  const { chatId, url, kind, quality, extension } = pending;
  const send = {
    reply: (text: string) => ctx.reply(text),
    editMessageText: (messageId: number, text: string) => ctx.api.editMessageText(chatId, messageId, text),
    replyWithVideo: (file: InputFile) => ctx.replyWithVideo(file, { supports_streaming: true }),
    replyWithAudio: (file: InputFile) => ctx.replyWithAudio(file),
    deleteMessage: (messageId: number) => ctx.api.deleteMessage(chatId, messageId),
  };
  await ctx.reply(messages[lang].paymentReceived);
  await performDownload(chatId, kind, quality, extension, url, lang, send, {
    telegramId: ctx.from?.id,
    telegramUsername: ctx.from?.username,
    telegramLanguageCode: ctx.from?.language_code,
    isPaid: true,
    starsAmount: ctx.message.successful_payment.total_amount,
  });
});

bot.catch((err) => console.error("Bot error:", err.error));

bot.start({
  onStart: (me) => console.log(`Бот @${me.username} запущен${BOT_API_ROOT ? ` (локальный Bot API: ${BOT_API_ROOT})` : " (облачный Bot API, лимит 50 МБ)"}`),
});
