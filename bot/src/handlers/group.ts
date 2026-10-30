import { Bot, Context } from "grammy";
import { detectLang, messages } from "../i18n.js";
import { ADMIN_TELEGRAM_ID, BOT_FILE_LIMIT, api, checkUserRateLimit, getQuotaInfo } from "../helpers.js";
import { extractUrls } from "../queue.js";
import { GROUP_LINKS_PER_MESSAGE, GroupLimiter, isVideoHostUrl, pickGroupQuality } from "../group.js";
import { performDownload, sendersFor } from "./download.js";

// Режим для групп: бот добавлен в чат, видит ссылки на видео и отвечает на
// них самим видео — без кнопок и команд.
//
// Видеть обычные сообщения группы бот может, только если у него в @BotFather
// выключен Group Privacy (или его сделали администратором группы). Иначе
// Telegram присылает ему лишь команды и ответы на его сообщения.
//
// Чем отличается от лички (handlers/download.ts), и почему:
//   - в чате молчим обо всём, что не наше: сообщения без ссылок, ссылки не на
//     видео, ролик, который сервер не разобрал, длинные видео, исчерпанный
//     лимит группы. Каждый такой ответ — спам в чужом чате;
//   - качество бот выбирает сам (pickGroupQuality), выбирать его кнопками в
//     общем чате неудобно всем;
//   - подписку на канал не требуем: бот просил бы подписаться каждого участника;
//   - ссылки в канал не публикуем: группы бывают закрытыми.
// Суточный лимит — по-прежнему на того, кто прислал ссылку.

// Длиннее — скорее подкаст или фильм, который в чате обсуждают, а не просят
// скачать. Такие человек возьмёт в личке, где сам выберет качество.
const GROUP_MAX_DURATION_SEC = 15 * 60;
const GROUP_HOURLY_LIMIT = Number(process.env.GROUP_HOURLY_LIMIT) || 30;
const limiter = new GroupLimiter(GROUP_HOURLY_LIMIT);

async function downloadInGroup(ctx: Context, url: string, replyTo: number) {
  const from = ctx.from!;
  const chatId = ctx.chat!.id;
  const lang = detectLang(from.language_code);
  const m = messages[lang];
  const meta = {
    telegramId: from.id,
    telegramUsername: from.username,
    telegramLanguageCode: from.language_code,
  };

  let info: {
    title?: string;
    duration?: number;
    thumbnail?: string;
    qualities?: { video: string[]; audio: string[] };
    sizes?: { video: Record<string, number> };
  };
  try {
    info = await api("/info", { url, ...meta });
  } catch (e: any) {
    // Не видео, закрытый пост, профиль вместо ролика — в чате молчим.
    console.log(`Группа ${chatId}: ссылка пропущена (${e?.message ?? e}): ${url}`);
    return;
  }
  if (info.duration && info.duration > GROUP_MAX_DURATION_SEC) return;
  const quality = pickGroupQuality(info.qualities?.video ?? [], info.sizes?.video ?? {}, BOT_FILE_LIMIT);
  if (!quality) return;

  // Лимит группы тратим, только когда действительно качаем.
  if (!limiter.take(chatId)) {
    console.log(`Группа ${chatId}: достигнут лимит ${GROUP_HOURLY_LIMIT} скачиваний в час`);
    return;
  }

  await performDownload(
    chatId,
    "v",
    quality,
    "mp4",
    url,
    lang,
    sendersFor(ctx, chatId, { replyTo, publish: false }),
    meta,
    info.title ?? "",
    info.thumbnail,
  );
}

export function registerGroupHandlers(bot: Bot) {
  const groups = bot.chatType(["group", "supergroup"]);

  // Бота добавили в группу — коротко объясняем, как он работает.
  groups.on("my_chat_member", async (ctx) => {
    const { old_chat_member: before, new_chat_member: after } = ctx.myChatMember;
    const wasIn = ["member", "administrator"].includes(before.status);
    const isIn = ["member", "administrator"].includes(after.status);
    if (wasIn || !isIn) return;
    await ctx
      .reply(messages[detectLang(ctx.from?.language_code)].groupWelcome)
      .catch((e) => console.error(`Не удалось поздороваться в группе ${ctx.chat.id}:`, e?.message ?? e));
  });

  // Обработчик НЕ передаёт сообщение дальше: обработчик лички
  // (handlers/download.ts) отвечал бы в группе «это не ссылка» на каждую фразу.
  // Только текст: под пересланным видео подпись часто содержит ссылку на это
  // же видео, и бот прислал бы его второй раз.
  groups.on("message:text", async (ctx) => {
    const from = ctx.from;
    // Посты, которые канал сам пересылает в свою группу обсуждения, и
    // сообщения ботов не трогаем: никто из людей не просил их скачивать.
    if (!from || from.is_bot || ctx.message.is_automatic_forward) return;

    const urls = [...new Set(extractUrls(ctx.message.text).filter(isVideoHostUrl))].slice(0, GROUP_LINKS_PER_MESSAGE);
    if (!urls.length) return;

    if (from.id !== ADMIN_TELEGRAM_ID && !checkUserRateLimit(from.id)) return;

    // Суточный лимит человека кончился — тут уже ответим: иначе он не
    // поймёт, почему бот молчит именно на его ссылки.
    const quota = await getQuotaInfo(from.id);
    if (!quota.unlimited && quota.remaining <= 0) {
      await ctx
        .reply(messages[detectLang(from.language_code)].dailyLimitReached, {
          reply_parameters: { message_id: ctx.message.message_id, allow_sending_without_reply: true },
        })
        .catch((e) => console.error(`Группа ${ctx.chat.id}: не удалось сообщить о лимите:`, e?.message ?? e));
      return;
    }

    const replyTo = ctx.message.message_id;
    // В фоне и по очереди: обработчик должен вернуться сразу (иначе бот
    // перестаёт видеть остальные обновления, см. inBackground в download.ts), а
    // ссылки одного сообщения не должны качаться одновременно.
    void (async () => {
      for (const url of urls) {
        await downloadInGroup(ctx, url, replyTo).catch((e) =>
          console.error(`Группа ${ctx.chat.id}: скачивание ${url} упало:`, e?.message ?? e),
        );
      }
    })();
  });
}
