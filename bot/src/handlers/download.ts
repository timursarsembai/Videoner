import { Bot, InlineKeyboard, InputFile } from "grammy";
import { detectLang, messages, type Lang } from "../i18n.js";
import { isPaidQuality } from "../paid-quality.js";
import {
  api,
  getQuotaInfo,
  fmtDuration,
  friendlyError,
  checkUserRateLimit,
  API_URL,
  BOT_API_ROOT,
  CLOUD_SIZE_LIMIT,
  ADMIN_TELEGRAM_ID,
} from "../helpers.js";
import { addSubscriptionButtons } from "./subscription.js";

// Ссылка на видео — callback_data в Telegram ограничена 64 байтами, поэтому
// URL храним здесь, а в кнопке передаём только тип и качество. videoQualities
// нужен, чтобы в callback-обработчике знать, есть ли у видео варианты ниже 720p.
// Ключ — chatId+messageId сообщения с клавиатурой, а НЕ просто chatId: раньше
// ключом был один chatId на весь чат, и вторая присланная ссылка (в том же
// чате, до клика по первой) молча перезаписывала запись — клик по кнопкам
// ПЕРВОГО сообщения скачивал видео ИЗ ВТОРОГО. В группах это ещё и означало,
// что клик одного участника по чужой ссылке мог расходовать не то, что он
// видел на экране. Привязка к конкретному message_id делает каждую клавиатуру
// независимой от остальных сообщений в том же чате.
function sessionKey(chatId: number, messageId: number): string {
  return `${chatId}:${messageId}`;
}
const sessions = new Map<string, { url: string; videoQualities: string[]; createdAt: number }>();

// Без TTL sessions рос бы пропорционально числу всех когда-либо присланных
// ссылок за всё время жизни процесса (в отличие от userRequests в helpers.ts,
// у которого чистка уже была). Час — с запасом больше, чем реально нужно
// кликнуть по клавиатуре выбора качества после присланной ссылки.
const SESSION_TTL_MS = 60 * 60 * 1000;
setInterval(() => {
  const cutoff = Date.now() - SESSION_TTL_MS;
  for (const [key, entry] of sessions.entries()) {
    if (entry.createdAt < cutoff) sessions.delete(key);
  }
}, 60_000);

type DownloadMeta = {
  telegramId?: number;
  telegramUsername?: string;
  telegramLanguageCode?: string;
};

// Раньше рестарт/редеплой бота (docker-compose rm -sf bot, шлёт SIGTERM) молча
// убивал любой активный performDownload — пользователь навсегда оставался
// смотреть на "⏬ Скачиваю..." без единого сообщения. Полноценное восстановление
// скачивания после рестарта потребовало бы хранить chatId/messageId на сервере
// и переживать пересоздание контейнера — непропорционально для этой находки.
// Вместо этого — трекинг активных загрузок в памяти + явное уведомление при
// штатной остановке (см. notifyActiveDownloadsBeforeShutdown, вызывается из
// bot.ts при SIGTERM/SIGINT), а не полная тишина.
const activeDownloads = new Map<string, { chatId: number; messageId: number; lang: Lang }>();

export async function notifyActiveDownloadsBeforeShutdown(bot: Bot) {
  console.log(`Уведомляю ${activeDownloads.size} активных скачиваний перед остановкой...`);
  await Promise.allSettled(
    Array.from(activeDownloads.values()).map(({ chatId, messageId, lang }) =>
      bot.api
        .editMessageText(chatId, messageId, messages[lang].downloadInterrupted)
        .catch((e) => console.error(`Failed to notify chat ${chatId} about shutdown:`, e)),
    ),
  );
}

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
  const trackingKey = sessionKey(chatId, msg.message_id);
  activeDownloads.set(trackingKey, { chatId, messageId: msg.message_id, lang });

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
  } finally {
    activeDownloads.delete(trackingKey);
  }
}

export function registerDownloadHandlers(bot: Bot) {
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
      sessions.set(sessionKey(ctx.chat.id, msg.message_id), { url, videoQualities, createdAt: Date.now() });

      const quota = await getQuotaInfo(ctx.from?.id);
      const kb = new InlineKeyboard();
      for (const q of videoQualities.slice(0, 6)) {
        const label = isPaidQuality("v", q, videoQualities) && !quota.unlimited ? `🎬 ${q} 🔒` : `🎬 ${q}`;
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

  bot.on("callback_query:data", async (ctx) => {
    const lang = detectLang(ctx.from?.language_code);
    const m = messages[lang];
    const chatId = ctx.chat?.id;
    const messageId = ctx.callbackQuery.message?.message_id;
    const session = chatId && messageId ? sessions.get(sessionKey(chatId, messageId)) : undefined;
    if (!chatId || !messageId || !session) {
      await ctx.answerCallbackQuery({ text: m.sessionExpired });
      return;
    }

    // Раньше это был просто type cast без runtime-проверки — если бы в чате
    // остались inline-кнопки от предыдущей версии бота с другим форматом
    // callback_data (переживший живую сессию редеплой), всё, что не "v",
    // молча трактовалось бы как "a" (аудио) с бессмысленным quality.
    const [kind, quality] = ctx.callbackQuery.data.split("|");
    if ((kind !== "v" && kind !== "a") || !quality) {
      await ctx.answerCallbackQuery({ text: m.sessionExpired });
      return;
    }
    const extension = kind === "v" ? "mp4" : "mp3";
    await ctx.answerCallbackQuery();

    const quota = await getQuotaInfo(ctx.from?.id);
    const isHdQuality = isPaidQuality(kind, quality, session.videoQualities);

    // Ни HD, ни скачивание сверх дневного лимита больше нельзя купить разово —
    // единственный способ снять оба ограничения — подписка.
    if (!quota.unlimited && isHdQuality) {
      const subKb = addSubscriptionButtons(new InlineKeyboard(), m);
      await ctx.reply(m.hdRequiresSubscription(quality), { reply_markup: subKb });
      return;
    }

    if (!quota.unlimited && quota.remaining <= 0) {
      const subKb = addSubscriptionButtons(new InlineKeyboard(), m);
      await ctx.reply(m.dailyLimitReached, { reply_markup: subKb });
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
    });
  });
}
