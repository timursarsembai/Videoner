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
// Кому разрешены /grant и /revoke — свой Telegram ID узнать можно у @userinfobot.
const ADMIN_TELEGRAM_ID = process.env.ADMIN_TELEGRAM_ID
  ? Number(process.env.ADMIN_TELEGRAM_ID)
  : undefined;

// HD (720p и выше) отдаём за Telegram Stars, качество до 480p включительно — бесплатно.
// Исключение: если у видео нет вариантов ниже 720p вообще, 720p тоже бесплатен (см. isPaidQuality).
const PAID_QUALITY_MIN_HEIGHT = 720;
const STARS_PRICE = 15;

// Цены подписок подобраны от цены разового HD-скачивания (15⭐ ≈ $0.30 по курсу
// ~$0.02/⭐ при покупке звёзд в приложении): месяц ≈ $3, год ≈ $30 (экономия
// ~$6 к 12 месячным). Telegram Stars поддерживает автопродление подписки ТОЛЬКО
// с фиксированным периодом 30 дней — годовой автопродляемой подписки в принципе
// не существует, поэтому годовая реализована как разовая покупка на 365 дней
// (см. память security-audit — секция про подписки).
const SUBSCRIPTION_MONTHLY_STARS = 150;
const SUBSCRIPTION_YEARLY_STARS = 1500;
const SUBSCRIPTION_MONTH_SECONDS = 2592000; // фиксированное значение, требуется Telegram API
const SUBSCRIPTION_YEAR_MS = 365 * 24 * 60 * 60 * 1000;

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
// поэтому URL храним здесь, а в кнопке передаём только тип и качество. videoQualities
// нужен, чтобы в callback-обработчике знать, есть ли у видео варианты ниже 720p.
const sessions = new Map<number, { url: string; videoQualities: string[] }>();

// Бот проксирует /info одним shared API-ключом на всех Telegram-пользователей —
// без этого один пользователь, засыпающий ссылками, мог бы выесть общий лимит
// у сервера (запрос HD/платного скачивания и так гасится квотой/оплатой, а вот
// /info дергается на КАЖДУЮ присланную ссылку без такой защиты).
const USER_RATE_LIMIT = 20; // ссылок в минуту на одного пользователя
const userRequests = new Map<number, { count: number; resetAt: number }>();

function checkUserRateLimit(telegramId: number): boolean {
  const now = Date.now();
  const entry = userRequests.get(telegramId);

  if (!entry || entry.resetAt < now) {
    userRequests.set(telegramId, { count: 1, resetAt: now + 60_000 });
    return true;
  }

  if (entry.count >= USER_RATE_LIMIT) {
    return false;
  }

  entry.count++;
  return true;
}

setInterval(() => {
  const now = Date.now();
  for (const [id, entry] of userRequests.entries()) {
    if (entry.resetAt < now) userRequests.delete(id);
  }
}, 60_000);

// Ожидающие оплаты HD-скачивания — invoice_payload тоже ограничен, поэтому
// сами данные (ссылка/качество) держим здесь, а в payload кладём только id.
type PendingDownload = { chatId: number; url: string; kind: "v" | "a"; quality: string; extension: string };
const pendingPayments = new Map<string, PendingDownload>();

// Если у видео вообще нет вариантов ниже 720p (площадка отдаёт 720p как минимум),
// 720p — единственный разумный выбор пользователя, поэтому отдаём его бесплатно.
// Если варианты ниже 720p есть, 720p остаётся платным, как и раньше.
function isPaidQuality(kind: string, quality: string, availableQualities: string[] = []): boolean {
  if (kind !== "v") return false;
  const height = parseInt(quality, 10);
  if (!Number.isFinite(height) || height < PAID_QUALITY_MIN_HEIGHT) return false;

  if (height === PAID_QUALITY_MIN_HEIGHT) {
    const heights = availableQualities
      .map((q) => parseInt(q, 10))
      .filter((h) => Number.isFinite(h));
    const minHeight = heights.length ? Math.min(...heights) : height;
    if (minHeight >= PAID_QUALITY_MIN_HEIGHT) return false;
  }

  return true;
}

// 10 бесплатных скачиваний в сутки на пользователя (см. DAILY_FREE_DOWNLOAD_LIMIT на сервере) —
// сверх лимита действует та же оплата Stars, что и для HD. Падает открыто (не блокирует
// скачивание, remaining = Infinity), если сервер недоступен, чтобы сбой проверки лимита не
// клал бота. unlimited (выдаётся через /grant) снимает и лимит, и оплату HD целиком.
async function getQuotaInfo(telegramId?: number): Promise<{ remaining: number; unlimited: boolean }> {
  if (!telegramId) return { remaining: Infinity, unlimited: false };
  // Админ не должен зависеть от состояния БД (isUnlimited можно случайно
  // сбросить /revoke, БД может быть недоступна и т.п.) — байпас чисто в коде бота.
  if (ADMIN_TELEGRAM_ID && telegramId === ADMIN_TELEGRAM_ID) {
    return { remaining: Infinity, unlimited: true };
  }
  try {
    return await api<{ remaining: number; unlimited: boolean }>(`/download/quota?telegramId=${telegramId}`);
  } catch (e) {
    console.error("Quota check failed:", e);
    return { remaining: Infinity, unlimited: false };
  }
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

  if (msg.includes("no video formats found") || msg.includes("doesn't contain a downloadable video")) {
    return m.errorNoVideoContent;
  }

  return raw;
}

// Диплинк с сайта (t.me/Bot?start=subscribe, кнопка в UserMenu на videoner.download)
// сразу открывает подписку — без этого пользователь бы попал на обычный /start
// и должен был бы ещё сам вспомнить/найти команду /subscribe.
bot.command("start", async (ctx) => {
  const lang = detectLang(ctx.from?.language_code);
  const m = messages[lang];

  if (ctx.match === "subscribe") {
    const kb = addSubscriptionButtons(new InlineKeyboard(), m);
    await ctx.reply(m.subscriptionPitch, { reply_markup: kb });
    return;
  }

  await ctx.reply(m.start);
});

async function setUnlimitedFromCommand(ctx: any, isUnlimited: boolean) {
  if (!ADMIN_TELEGRAM_ID || ctx.from?.id !== ADMIN_TELEGRAM_ID) return;

  const arg = (ctx.match as string)?.trim();
  if (!arg) {
    await ctx.reply("Использование: /grant @username или /grant 123456789 (Telegram ID)");
    return;
  }

  const telegramId = /^\d+$/.test(arg) ? Number(arg) : undefined;
  const username = telegramId ? undefined : arg.replace(/^@/, "");

  try {
    const result = await api<{ telegramId: string; username: string | null }>(
      "/analytics/bot-users/grant",
      { telegramId, username, isUnlimited },
    );
    const label = result.username ? `@${result.username}` : result.telegramId;
    await ctx.reply(isUnlimited ? `Безлимитный доступ выдан: ${label}` : `Безлимитный доступ отозван: ${label}`);
  } catch (e: any) {
    await ctx.reply(`Ошибка: ${e.message}`);
  }
}

// Доступны только ADMIN_TELEGRAM_ID. Пользователь должен хотя бы раз написать боту
// (иначе для него ещё нет записи BotUser, к которой можно привязать флаг).
bot.command("grant", (ctx) => setUnlimitedFromCommand(ctx, true));
bot.command("revoke", (ctx) => setUnlimitedFromCommand(ctx, false));

// Общие кнопки тарифов — переиспользуются и в /subscribe, и как допродажа
// прямо в результате /info (см. bot.on("message:text", ...) ниже), чтобы не
// заставлять пользователя отдельно вспоминать команду /subscribe.
function addSubscriptionButtons(kb: InlineKeyboard, m: (typeof messages)["ru"]): InlineKeyboard {
  return kb.text(m.subscribeMonthlyButton, "sub|month").row().text(m.subscribeYearlyButton, "sub|year");
}

bot.command("subscribe", async (ctx) => {
  const lang = detectLang(ctx.from?.language_code);
  const m = messages[lang];
  const kb = addSubscriptionButtons(new InlineKeyboard(), m);
  await ctx.reply(m.subscriptionPitch, { reply_markup: kb });
});

// Регистрируем ДО общего bot.on("callback_query:data", ...) ниже — grammY идёт
// по обработчикам по порядку и останавливается на первом совпадении, поэтому
// "sub|month"/"sub|year" сюда попадают, а не в generic-обработчик v|/a|-кнопок.
bot.callbackQuery("sub|month", async (ctx) => {
  await ctx.answerCallbackQuery();
  const lang = detectLang(ctx.from?.language_code);
  const m = messages[lang];
  const telegramId = ctx.from.id;

  // subscription_period есть только у createInvoiceLink (не у sendInvoice) —
  // поэтому для настоящей автопродляемой подписки шлём ссылку, а не invoice-карточку.
  const link = await ctx.api.createInvoiceLink(
    m.subMonthlyInvoiceTitle,
    m.subMonthlyInvoiceDescription,
    `sub_month_${telegramId}`,
    "",
    "XTR",
    [{ label: m.subMonthlyInvoiceLabel, amount: SUBSCRIPTION_MONTHLY_STARS }],
    { subscription_period: SUBSCRIPTION_MONTH_SECONDS },
  );
  const kb = new InlineKeyboard().url(m.payButton, link);
  await ctx.reply(m.subMonthlyPrompt, { reply_markup: kb });
});

bot.callbackQuery("sub|year", async (ctx) => {
  await ctx.answerCallbackQuery();
  const lang = detectLang(ctx.from?.language_code);
  const m = messages[lang];
  const telegramId = ctx.from.id;

  // Годовая — обычный разовый invoice (без subscription_period, см. константы выше).
  await ctx.replyWithInvoice(
    m.subYearlyInvoiceTitle,
    m.subYearlyInvoiceDescription,
    `sub_year_${telegramId}`,
    "XTR",
    [{ label: m.subYearlyInvoiceLabel, amount: SUBSCRIPTION_YEARLY_STARS }],
  );
});

bot.on("message:text", async (ctx) => {
  const lang = detectLang(ctx.from?.language_code);
  const m = messages[lang];
  const url = ctx.message.text.trim();
  if (!/^https?:\/\//i.test(url)) {
    await ctx.reply(m.notLink);
    return;
  }

  if (ctx.from && ctx.from.id !== ADMIN_TELEGRAM_ID && !checkUserRateLimit(ctx.from.id)) {
    await ctx.reply(m.errorRateLimited);
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

    const videoQualities = info.qualities.video ?? [];
    sessions.set(ctx.chat.id, { url, videoQualities });

    const quota = await getQuotaInfo(ctx.from?.id);
    const kb = new InlineKeyboard();
    for (const q of videoQualities.slice(0, 6)) {
      const label = isPaidQuality("v", q, videoQualities) && !quota.unlimited ? `🎬 ${q} ⭐${STARS_PRICE}` : `🎬 ${q}`;
      kb.text(label, `v|${q}`).row();
    }
    kb.text(m.audioOnlyButton, "a|128Kbps");

    const dur = fmtDuration(info.duration);
    await ctx.api.editMessageText(ctx.chat.id, msg.message_id, m.chooseQuality(info.title, dur), {
      reply_markup: kb,
    });

    // Допродажа подписки — ОТДЕЛЬНЫМ сообщением следом, а не в той же клавиатуре
    // выбора качества, чтобы не смешивать разные по смыслу действия и дать место
    // под подробное описание. Не показываем тем, у кого и так безлимит (в т.ч.
    // админу — getQuotaInfo() возвращает unlimited: true для него в коде без похода в БД).
    if (!quota.unlimited) {
      const subKb = addSubscriptionButtons(new InlineKeyboard(), m);
      await ctx.reply(m.subscriptionPitch, { reply_markup: subKb });
    }
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

  const quota = await getQuotaInfo(ctx.from?.id);
  const isHdQuality = isPaidQuality(kind, quality, session.videoQualities);
  const requiresPayment = !quota.unlimited && (isHdQuality || quota.remaining <= 0);

  if (requiresPayment) {
    const id = crypto.randomUUID();
    pendingPayments.set(id, { chatId, url: session.url, kind, quality, extension });
    const [title, description, label] = isHdQuality
      ? [m.invoiceTitle(quality), m.invoiceDescription(quality, STARS_PRICE), m.invoiceLabel(quality)]
      : [m.invoiceTitleQuotaExceeded, m.invoiceDescriptionQuotaExceeded(STARS_PRICE), m.invoiceLabelQuotaExceeded];
    await ctx.replyWithInvoice(title, description, id, "XTR", [{ label, amount: STARS_PRICE }]);
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

// Подписочные payload детерминированы (sub_month_<telegramId> / sub_year_<telegramId>),
// а не случайный id из pendingPayments — включая ПОВТОРНЫЕ автосписания месячной
// подписки, для которых Telegram переиспользует тот же payload и снова шлёт
// pre_checkout_query/successful_payment без нового вызова createInvoiceLink.
function isSubscriptionPayload(payload: string): boolean {
  return payload.startsWith("sub_month_") || payload.startsWith("sub_year_");
}

bot.on("pre_checkout_query", async (ctx) => {
  const lang = detectLang(ctx.from?.language_code);
  const payload = ctx.preCheckoutQuery.invoice_payload;
  if (isSubscriptionPayload(payload)) {
    await ctx.answerPreCheckoutQuery(true);
    return;
  }
  const pending = pendingPayments.get(payload);
  if (!pending) {
    await ctx.answerPreCheckoutQuery(false, messages[lang].orderExpired);
    return;
  }
  await ctx.answerPreCheckoutQuery(true);
});

bot.on("message:successful_payment", async (ctx) => {
  const lang = detectLang(ctx.from?.language_code);
  const m = messages[lang];
  const payment = ctx.message.successful_payment;
  const payload = payment.invoice_payload;

  if (isSubscriptionPayload(payload)) {
    const isMonthly = payload.startsWith("sub_month_");
    const until = isMonthly
      ? new Date((payment.subscription_expiration_date ?? Math.floor(Date.now() / 1000) + SUBSCRIPTION_MONTH_SECONDS) * 1000)
      : new Date(Date.now() + SUBSCRIPTION_YEAR_MS);

    try {
      await api("/bot-users/subscription", {
        telegramId: ctx.from.id,
        telegramUsername: ctx.from.username,
        telegramLanguageCode: ctx.from.language_code,
        kind: isMonthly ? "MONTHLY" : "YEARLY",
        until: until.toISOString(),
      });
      const dateStr = until.toLocaleDateString(lang === "ru" ? "ru-RU" : "en-US");
      await ctx.reply(m.subscriptionActivated(dateStr, isMonthly));
    } catch (e: any) {
      console.error("Failed to persist subscription:", e);
      await ctx.reply(m.subscriptionActivationFailed);
    }
    return;
  }

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
