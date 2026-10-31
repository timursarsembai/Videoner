import { Bot, Context, InlineKeyboard } from "grammy";
import { LANGUAGE_NAMES, isLang, messages, type Lang } from "../i18n.js";
import { langOf } from "../language.js";
import { parseFlag, type LinkFlag } from "../flags.js";
import { loadSettings, saveSettings } from "../settings-store.js";
import { applyChatCommands } from "../commands.js";
import {
  ADMIN_TELEGRAM_ID,
  BOT_FILE_LIMIT,
  api,
  checkUserRateLimit,
  extensionLinkFor,
  friendlyError,
  getQuotaInfo,
} from "../helpers.js";
import { extractUrls } from "../queue.js";
import {
  DEFAULT_GROUP_SETTINGS,
  GROUP_LINKS_PER_MESSAGE,
  GroupLimiter,
  isVideoHostUrl,
  nextCaption,
  onlyLinks,
  pickGroupQuality,
  type GroupSettings,
} from "../group.js";
import { performDownload, sendersFor } from "./download.js";
import { parseConnectCode } from "../accounts.js";

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
//
// Админы группы настраивают поведение командой /settings: удалять ли
// сообщение со ссылкой, вид подписи, качество, длинные видео. Настройки
// хранит сервер (/group-settings), бот держит их в памяти (SettingsCache).

// Длиннее — скорее подкаст или фильм, который в чате обсуждают, а не просят
// скачать. Группа, где длинные видео нужны, снимает ограничение в /settings.
const GROUP_MAX_DURATION_SEC = 15 * 60;
const GROUP_HOURLY_LIMIT = Number(process.env.GROUP_HOURLY_LIMIT) || 30;
const limiter = new GroupLimiter(GROUP_HOURLY_LIMIT);

// От имени группы (анонимный администратор) Telegram присылает сообщения от
// этого служебного бота, а настоящий отправитель — сама группа в sender_chat.
const ANONYMOUS_ADMIN_ID = 1087968824;

// Хранилище настроек — settings-store.ts: им пользуется и выбор языка.
export { loadSettings };

export async function isGroupAdmin(ctx: Context): Promise<boolean> {
  const chat = ctx.chat;
  const from = ctx.from;
  if (!chat || !from) return false;
  if (from.id === ANONYMOUS_ADMIN_ID) return ctx.msg?.sender_chat?.id === chat.id;
  try {
    const member = await ctx.api.getChatMember(chat.id, from.id);
    return member.status === "creator" || member.status === "administrator";
  } catch (e: any) {
    console.error(`Группа ${chat.id}: не удалось проверить права ${from.id}:`, e?.message ?? e);
    return false;
  }
}

// Может ли бот удалять чужие сообщения — без этого настройка «удалять
// ссылки» ничего не делает, и в /settings об этом предупреждаем.
//
// Спрашиваем Telegram не на каждую ссылку, а раз в несколько минут; /settings
// спрашивает всегда (fresh) — там админ только что мог выдать права.
const CAN_DELETE_TTL_MS = 5 * 60_000;
const canDeleteCache = new Map<number, { value: boolean; expiresAt: number }>();

async function botCanDelete(ctx: Context, { fresh = false } = {}): Promise<boolean> {
  const chatId = ctx.chat!.id;
  const cached = canDeleteCache.get(chatId);
  if (!fresh && cached && cached.expiresAt > Date.now()) return cached.value;
  let value = false;
  try {
    const me = await ctx.api.getChatMember(chatId, ctx.me.id);
    value = me.status === "administrator" && me.can_delete_messages;
  } catch {
    value = false;
  }
  canDeleteCache.set(chatId, { value, expiresAt: Date.now() + CAN_DELETE_TTL_MS });
  return value;
}

// Ссылки одной группы качаем по очереди, а не все сразу: десяток сообщений
// подряд иначе дал бы десяток одновременных «Скачиваю…» и упёрся бы в лимит
// Telegram на сообщения в группе (~20 в минуту).
const chatChains = new Map<number, Promise<void>>();

function inChatOrder(chatId: number, job: () => Promise<void>) {
  // Ошибку ловим здесь: цепочка не должна рваться, и упавшая задача не
  // должна стать unhandledRejection.
  const safe = () => job().catch((e) => console.error(`Группа ${chatId}: задача упала:`, e?.message ?? e));
  const next = (chatChains.get(chatId) ?? Promise.resolve()).then(safe);
  chatChains.set(chatId, next);
  void next.finally(() => {
    if (chatChains.get(chatId) === next) chatChains.delete(chatId);
  });
}

// О суточном лимите говорим человеку один раз в день в каждой группе: иначе
// бот отвечал бы на каждую его ссылку до конца дня.
const limitNoticeSent = new Set<string>();

function firstLimitNoticeToday(chatId: number, userId: number): boolean {
  const key = `${new Date().toISOString().slice(0, 10)}:${chatId}:${userId}`;
  if (limitNoticeSent.has(key)) return false;
  if (limitNoticeSent.size > 10_000) limitNoticeSent.clear();
  limitNoticeSent.add(key);
  return true;
}

// Приветствие в группе — не чаще раза в минуту. Бота, добавленного кнопкой
// «Добавить в группу» (t.me/<бот>?startgroup), Telegram сразу же сам зовёт
// командой /start@<бот> — без этого приветствие приходило дважды подряд.
const WELCOME_COOLDOWN_MS = 60_000;
const lastWelcome = new Map<number, number>();

export async function sendGroupWelcome(ctx: Context) {
  const chatId = ctx.chat!.id;
  const now = Date.now();
  if (now - (lastWelcome.get(chatId) ?? 0) < WELCOME_COOLDOWN_MS) return;
  lastWelcome.set(chatId, now);
  if (lastWelcome.size > 10_000) lastWelcome.clear();
  await ctx
    .reply(messages[await langOf(ctx)].groupWelcome)
    .catch((e) => console.error(`Не удалось поздороваться в группе ${chatId}:`, e?.message ?? e));
}

// Предел Telegram на подпись к файлу.
const CAPTION_LIMIT = 1024;

function settingsKeyboard(m: (typeof messages)[Lang], s: GroupSettings): InlineKeyboard {
  return new InlineKeyboard()
    .text(m.settingsDeleteButton(s.deleteLinks), "gs|del")
    .row()
    .text(m.settingsCaptionButton(s.caption), "gs|cap")
    .row()
    .text(m.settingsQualityButton(s.quality), "gs|q")
    .row()
    .text(m.settingsLongButton(s.longVideos), "gs|long")
    .row()
    .text(m.settingsCookiesButton(s.cookiesBy), "gs|ck")
    .row()
    .text(m.settingsLanguageButton(isLang(s.language) ? LANGUAGE_NAMES[s.language] : null), "gs|lang")
    .row()
    .text(m.settingsDoneButton, "gs|done");
}

// Текст и кнопки /settings — и для возврата из выбора языка (handlers/language.ts).
export async function settingsMessage(ctx: Context, s: GroupSettings) {
  const m = messages[await langOf(ctx)];
  return {
    text: m.groupSettings(s, await botCanDelete(ctx, { fresh: true })),
    reply_markup: settingsKeyboard(m, s),
  };
}

function senderName(ctx: Context): string {
  const from = ctx.from!;
  return [from.first_name, from.last_name].filter(Boolean).join(" ") || (from.username ? `@${from.username}` : "");
}

async function downloadInGroup(
  ctx: Context,
  url: string,
  settings: GroupSettings,
  // Сообщение со ссылкой будет удалено — тогда отвечать на него нельзя (ответ
  // повис бы на «удалённом сообщении»), а кто прислал видео, пишем в подписи.
  { replyTo, sender }: { replyTo?: number; sender?: string },
  // «-audio» — звук вместо видео, «-hd» — лучшее качество вместо настройки
  // группы (flags.ts).
  flag: LinkFlag | null = null,
): Promise<boolean> {
  const from = ctx.from!;
  const chatId = ctx.chat!.id;
  const lang = await langOf(ctx);
  const m = messages[lang];
  const meta = {
    telegramId: from.id,
    telegramUsername: from.username,
    telegramLanguageCode: from.language_code,
    // Куки, подключённые к этой группе (handlers/accounts.ts), — только её.
    cookieScope: `chat:${chatId}`,
    // У группы своего входа нет — ссылку того, кто её прислал, можно скачать
    // его личным входом (сервер проверит, что вход именно его).
    cookieFallbackScope: `user:${from.id}`,
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
    const raw = e?.message ?? String(e);
    // Сторис Instagram — исключение из молчания: человек явно хотел её
    // скачать, и без ответа решил бы, что бот сломался. Отвечаем одной
    // строкой и кнопкой на расширение, которое сторис скачает.
    const storyText = friendlyError(raw, lang);
    if (storyText === m.errorInstagramStory || storyText === m.errorStoryNeedsId) {
      const link = storyText === m.errorInstagramStory ? extensionLinkFor(raw, url, lang) : null;
      await ctx
        .reply(`${m.failedPrefix}${storyText}`, {
          ...(replyTo ? { reply_parameters: { message_id: replyTo, allow_sending_without_reply: true } } : {}),
          ...(link ? { reply_markup: new InlineKeyboard().url(m.extensionButton, link) } : {}),
        })
        .catch((err) => console.error(`Группа ${chatId}: не удалось ответить про сторис:`, err?.message ?? err));
      return false;
    }
    // Не видео, закрытый пост, профиль вместо ролика — в чате молчим.
    console.log(`Группа ${chatId}: ссылка пропущена (${raw}): ${url}`);
    return false;
  }
  if (!settings.longVideos && info.duration && info.duration > GROUP_MAX_DURATION_SEC) return false;
  const audio = info.qualities?.audio ?? [];
  const asAudio = flag === "audio" && audio.length > 0;
  const quality = asAudio
    ? audio.includes("128Kbps")
      ? "128Kbps"
      : audio[0]
    : pickGroupQuality(
        info.qualities?.video ?? [],
        info.sizes?.video ?? {},
        BOT_FILE_LIMIT,
        flag === "hd" ? "max" : settings.quality,
      );
  if (!quality) return false;

  // Лимит группы тратим, только когда действительно качаем.
  if (!limiter.take(chatId)) {
    console.log(`Группа ${chatId}: достигнут лимит ${GROUP_HOURLY_LIMIT} скачиваний в час`);
    return false;
  }

  const byline = sender ? m.sentBy(sender) : "";
  const formatCaption = (title: string, sourceUrl: string, shareUrl?: string) => {
    const body =
      settings.caption === "none"
        ? ""
        : settings.caption === "short"
          ? m.fileCaptionShort(title, sourceUrl)
          : m.fileCaption(title, sourceUrl, shareUrl);
    // Имя отправителя добавляется к подписи, которая и так могла быть у самого
    // предела, — режем, иначе Telegram отверг бы файл уже после скачивания.
    return [byline, body].filter(Boolean).join("\n\n").slice(0, CAPTION_LIMIT);
  };

  return performDownload(
    chatId,
    asAudio ? "a" : "v",
    quality,
    asAudio ? "mp3" : "mp4",
    url,
    lang,
    { ...sendersFor(ctx, chatId, { replyTo, publish: false }), formatCaption, quiet: true },
    meta,
    info.title ?? "",
    info.thumbnail,
  );
}

export function registerGroupHandlers(bot: Bot) {
  // /settings — ДО bot.chatType(...): grammY ставит групповой блок в цепочку
  // в момент его создания, и всё, что объявлено на bot после, идёт уже за ним.
  // Групповой обработчик текста дальше ничего не передаёт, и команда до
  // своего обработчика не доходила.
  bot.command("settings", async (ctx) => {
    const m = messages[await langOf(ctx)];
    if (ctx.chat.type === "private" || ctx.chat.type === "channel") {
      await ctx.reply(m.settingsGroupsOnly);
      return;
    }
    if (!(await isGroupAdmin(ctx))) {
      await ctx.reply(m.settingsAdminsOnly);
      return;
    }
    const s = await loadSettings(ctx.chat.id);
    await ctx.reply(m.groupSettings(s, await botCanDelete(ctx, { fresh: true })), {
      reply_markup: settingsKeyboard(m, s),
    });
  });

  const groups = bot.chatType(["group", "supergroup"]);

  // Бота добавили в группу — коротко объясняем, как он работает.
  groups.on("my_chat_member", async (ctx) => {
    const { old_chat_member: before, new_chat_member: after } = ctx.myChatMember;
    const wasIn = ["member", "administrator"].includes(before.status);
    const isIn = ["member", "administrator"].includes(after.status);
    // Бота удалили из группы — подключённые к ней аккаунты больше не нужны.
    if (wasIn && !isIn) {
      await api("/user-cookies/scope-delete", { scope: `chat:${ctx.chat.id}` }).catch((e) =>
        console.error(`Группа ${ctx.chat.id}: подключения не удалены:`, e?.message ?? e),
      );
      return;
    }
    if (wasIn || !isIn) return;
    await sendGroupWelcome(ctx);
  });

  // Кнопки /settings. Регистрируются до общего обработчика кнопок лички
  // (handlers/download.ts) — тот ответил бы «сессия устарела».
  groups.callbackQuery(/^gs\|/, async (ctx) => {
    const m = messages[await langOf(ctx)];
    if (!(await isGroupAdmin(ctx))) {
      await ctx.answerCallbackQuery({ text: m.settingsAdminsOnly, show_alert: true });
      return;
    }
    const action = ctx.callbackQuery.data.slice(3);
    if (action === "done") {
      await ctx.answerCallbackQuery();
      await ctx.editMessageReplyMarkup().catch(() => {});
      return;
    }
    const s = await loadSettings(ctx.chat.id);
    const patch: Partial<GroupSettings> =
      action === "del"
        ? { deleteLinks: !s.deleteLinks }
        : action === "cap"
          ? { caption: nextCaption(s.caption) }
          : action === "q"
            ? { quality: s.quality === "max" ? "standard" : "max" }
            : action === "long"
              ? { longVideos: !s.longVideos }
              : action === "ck"
                ? { cookiesBy: s.cookiesBy === "all" ? "admins" : "all" }
                : {};
    let saved: GroupSettings;
    try {
      saved = await saveSettings(ctx.chat.id, patch);
    } catch (e: any) {
      console.error(`Группа ${ctx.chat.id}: настройки не сохранились:`, e?.message ?? e);
      await ctx.answerCallbackQuery({ text: m.settingsFailed, show_alert: true });
      return;
    }
    await ctx.answerCallbackQuery();
    await ctx
      .editMessageText(m.groupSettings(saved, await botCanDelete(ctx, { fresh: true })), {
        reply_markup: settingsKeyboard(m, saved),
      })
      .catch((e) => console.error("Не удалось обновить настройки:", e?.message ?? e));
  });

  // Обработчик НЕ передаёт сообщение дальше: обработчик лички
  // (handlers/download.ts) отвечал бы в группе «это не ссылка» на каждую фразу.
  // Только текст: под пересланным видео подпись часто содержит ссылку на это
  // же видео, и бот прислал бы его второй раз.
  groups.on("message:text", (ctx) => {
    const from = ctx.from;
    // Посты, которые канал сам пересылает в свою группу обсуждения, и
    // сообщения ботов не трогаем: никто из людей не просил их скачивать.
    // Анонимный администратор пишет от служебного бота — его ссылки качаем.
    if (!from || (from.is_bot && from.id !== ANONYMOUS_ADMIN_ID) || ctx.message.is_automatic_forward) return;

    const text = ctx.message.text;
    // Код подключения аккаунта, присланный в общий чат без команды, — уже
    // засвечен: уничтожаем его и убираем сообщение (handlers/accounts.ts).
    const leakedCode = parseConnectCode(text, { strict: true });
    if (leakedCode) {
      void (async () => {
        await api("/user-cookies/burn", { code: leakedCode }).catch(() => {});
        await ctx.deleteMessage().catch(() => {});
        await ctx.reply(messages[await langOf(ctx)].connectCodeInGroup).catch(() => {});
      })();
      return;
    }
    const urls = [...new Set(extractUrls(text).filter(isVideoHostUrl))].slice(0, GROUP_LINKS_PER_MESSAGE);
    if (!urls.length) return;

    if (from.id !== ADMIN_TELEGRAM_ID && !checkUserRateLimit(from.id)) return;

    const chatId = ctx.chat.id;
    const messageId = ctx.message.message_id;

    // Всё, что ходит в сеть, — в фоне: обработчик должен вернуться сразу,
    // иначе бот, пока ждёт сервер, не видит остальных обновлений (см.
    // inBackground в download.ts). Ссылки группы — по очереди (inChatOrder).
    inChatOrder(chatId, async () => {
      // Суточный лимит человека кончился — тут уже ответим: иначе он не
      // поймёт, почему бот молчит именно на его ссылки. Но раз в день.
      const quota = await getQuotaInfo(from.id);
      if (!quota.unlimited && quota.remaining <= 0) {
        if (firstLimitNoticeToday(chatId, from.id)) {
          await ctx
            .reply(messages[await langOf(ctx)].dailyLimitReached, {
              reply_parameters: { message_id: messageId, allow_sending_without_reply: true },
            })
            .catch((e) => console.error(`Группа ${chatId}: не удалось сообщить о лимите:`, e?.message ?? e));
        }
        return;
      }

      const settings = await loadSettings(chatId);
      // Удаляем, только если в сообщении нет ничего, кроме этих ссылок, и
      // бот вправе удалять. Без права отвечаем на сообщение, как обычно, —
      // иначе видео пришло бы без ответа, а ссылка так и осталась бы в чате.
      const willDelete = settings.deleteLinks && onlyLinks(text, urls) && (await botCanDelete(ctx));
      const target = willDelete ? { sender: senderName(ctx) } : { replyTo: messageId };

      let allDelivered = true;
      for (const url of urls) {
        const ok = await downloadInGroup(ctx, url, settings, target, parseFlag(text)).catch((e) => {
          console.error(`Группа ${chatId}: скачивание ${url} упало:`, e?.message ?? e);
          return false;
        });
        allDelivered &&= ok;
      }
      // Удаляем, только если пришло видео по каждой ссылке: иначе вместе с
      // сообщением пропала бы ссылка, которую бот не скачал.
      if (willDelete && allDelivered) {
        await ctx.api
          .deleteMessage(chatId, messageId)
          .catch((e) => console.log(`Группа ${chatId}: сообщение со ссылкой не удалено:`, e?.message ?? e));
      }
    });
  });

  // Обычная группа стала супергруппой (так бывает, например, когда боту
  // выдают права администратора) — у чата новый идентификатор. Переносим
  // настройки, иначе они молча сбросились бы ровно в момент включения
  // «удалять ссылки».
  groups.on("message:migrate_to_chat_id", async (ctx) => {
    const newChatId = ctx.message.migrate_to_chat_id;
    try {
      const old = await api<GroupSettings>(`/group-settings/${ctx.chat.id}`);
      const { deleteLinks, caption, quality, longVideos, cookiesBy, language } = { ...DEFAULT_GROUP_SETTINGS, ...old };
      await saveSettings(newChatId, { deleteLinks, caption, quality, longVideos, cookiesBy, language });
      // Меню команд на языке группы — и у новой супергруппы.
      if (isLang(language)) await applyChatCommands(ctx.api, newChatId, language, true);
    } catch (e: any) {
      console.error(`Группа ${ctx.chat.id} → ${newChatId}: настройки не перенесены:`, e?.message ?? e);
    }
    // Подключённые к группе аккаунты — туда же (handlers/accounts.ts), и
    // независимо от того, удалось ли перенести настройки.
    await api("/user-cookies/migrate", { from: `chat:${ctx.chat.id}`, to: `chat:${newChatId}` }).catch((e) =>
      console.error(`Группа ${ctx.chat.id} → ${newChatId}: подключения не перенесены:`, e?.message ?? e),
    );
  });
}
