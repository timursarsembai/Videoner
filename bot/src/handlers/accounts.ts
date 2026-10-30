import { readFile, unlink } from "node:fs/promises";
import { Bot, Context, InlineKeyboard } from "grammy";
import { messages, type Lang } from "../i18n.js";
import { langOf, userLang } from "../language.js";
import { api, BOT_API_ROOT } from "../helpers.js";
import { cookieScopeFor, looksLikeCookiesText, parseConnectCode, platformLabel, rejectionReason } from "../accounts.js";
import { isGroupAdmin, loadSettings } from "./group.js";

// Подключённые аккаунты: люди отдают боту свой вход на площадке (куки), и
// бот качает от их аккаунта то, что видно только вошедшим — сторис Instagram,
// закрытые записи. Хранит и применяет куки сервер (modules/user-cookies);
// здесь — как человек их подключает, смотрит и удаляет.
//
// Где действует вход: личка человека (и его инлайн-режим) или одна группа.
// В группе подключать могут админы или все — настройка группы (/settings).
//
// Куки в чат группы не попадают никогда: туда человек отправляет только
// одноразовый код из расширения (/connect КОД). Файл или текст кук
// принимаются только в личке, и сообщение с ними бот сразу удаляет.

// Файл cookies.txt целого браузера бывает большим, но не мегабайтами.
const MAX_COOKIES_FILE = 2 * 1024 * 1024;

interface CookieView {
  id: string;
  scope: string;
  platform: string;
  ownerTelegramId: string;
  ownerName: string | null;
  active: boolean;
}

// lang — для уведомления «вход перестал работать», которое сервер пришлёт
// владельцу в личку: на его языке, а не на языке группы.
async function owner(ctx: Context) {
  const from = ctx.from!;
  return {
    telegramId: from.id,
    name: [from.first_name, from.last_name].filter(Boolean).join(" ") || (from.username ? `@${from.username}` : undefined),
    lang: await userLang(from),
  };
}

function errorText(m: (typeof messages)[Lang], e: any): string {
  switch (rejectionReason(e?.message ?? "")) {
    case "no-session":
      return m.connectRejectedNoSession;
    case "unknown":
      return m.connectRejectedUnknown;
    case "unavailable":
      return m.connectUnavailable;
    case "not-found":
      return m.connectCodeNotFound;
    case "too-large":
      return m.connectFileTooBig;
    default:
      console.error("Подключение аккаунта:", e?.message ?? e);
      return m.connectFailed;
  }
}

// Сообщение с куками (файл, текст, код в группе) — убрать из чата: куки не
// должны оставаться в истории переписки. Не вышло (старое сообщение, нет прав
// в группе) — не страшно, код одноразовый, а в личке видит только сам человек.
async function removeMessage(ctx: Context) {
  await ctx.deleteMessage().catch(() => {});
}

async function privateList(ctx: Context, m: (typeof messages)[Lang]) {
  const rows = await api<CookieView[]>(`/user-cookies/owner/${ctx.from!.id}`);
  const titles = new Map<string, string>();
  const whereOf = async (scope: string) => {
    if (scope.startsWith("user:")) return m.accountsWhereHere;
    if (!titles.has(scope)) {
      const chat = await ctx.api.getChat(Number(scope.slice(5))).catch(() => null);
      titles.set(scope, chat && "title" in chat && chat.title ? chat.title : "?");
    }
    return m.accountsWhereGroup(titles.get(scope)!);
  };
  const lines: string[] = [];
  const kb = new InlineKeyboard();
  for (const r of rows) {
    const where = await whereOf(r.scope);
    lines.push(m.accountsLine(platformLabel(r.platform), where, r.active));
    kb.text(m.accountsDeleteButton(platformLabel(r.platform), where).slice(0, 60), `ac|d|${r.id}`).row();
  }
  if (rows.length) kb.text(m.accountsDeleteAllButton, "ac|all");
  const text = [m.accountsIntro, lines.length ? lines.join("\n") : m.accountsNone, m.accountsHowTo, m.accountsWarning].join("\n\n");
  return { text, keyboard: kb };
}

async function groupList(ctx: Context, m: (typeof messages)[Lang]) {
  const rows = await api<CookieView[]>(`/user-cookies/scope/${encodeURIComponent(`chat:${ctx.chat!.id}`)}`);
  const kb = new InlineKeyboard();
  const lines = rows.map((r) => {
    const label = platformLabel(r.platform);
    const who = r.ownerName ?? r.ownerTelegramId;
    kb.text(m.accountsDeleteButton(label, who).slice(0, 60), `ac|d|${r.id}`).row();
    return m.accountsGroupLine(label, who, r.active);
  });
  const text = [m.accountsGroupTitle, lines.length ? lines.join("\n") : m.accountsNone, m.accountsGroupHowTo].join("\n\n");
  return { text, keyboard: kb };
}

async function listFor(ctx: Context, m: (typeof messages)[Lang]) {
  return ctx.chat!.type === "private" ? privateList(ctx, m) : groupList(ctx, m);
}

// Подключить: по коду из расширения или по самим кукам (только личка).
async function connect(
  ctx: Context,
  m: (typeof messages)[Lang],
  how: { code: string } | { raw: string },
) {
  const scope = cookieScopeFor(ctx.chat!, ctx.from!.id);
  const where = ctx.chat!.type === "private" ? m.connectWhereHere : m.connectWhereGroup;
  try {
    const res =
      "code" in how
        ? await api<{ platform: string }>("/user-cookies/claim", { code: how.code, scope, owner: await owner(ctx) })
        : await api<{ platform: string }>("/user-cookies/file", { raw: how.raw, scope, owner: await owner(ctx) });
    await ctx.reply(m.connectDone(platformLabel(res.platform), where));
  } catch (e: any) {
    await ctx.reply(errorText(m, e));
  }
}

// Файл, присланный боту. С локальным Bot API (BOT_API_ROOT) getFile отдаёт
// путь на диске его контейнера — том botapi_data смонтирован боту только на
// чтение (docker-compose.prod.yml); с облачным — скачиваем по ссылке.
//
// Файл с диска Bot API удаляем сразу после чтения: это могут быть куки всего
// браузера в открытом виде (почта, банк), а сервер хранит только куки одной
// площадки и зашифрованными. Том для этого смонтирован с записью.
async function readDocument(ctx: Context): Promise<string> {
  const file = await ctx.getFile();
  const path = file.file_path ?? "";
  if (path.startsWith("/")) {
    try {
      return await readFile(path, "utf8");
    } finally {
      await unlink(path).catch((e) => console.error("Файл кук не удалён с диска Bot API:", e?.message ?? e));
    }
  }
  const root = BOT_API_ROOT ?? "https://api.telegram.org";
  const res = await fetch(`${root}/file/bot${process.env.BOT_TOKEN}/${path}`);
  if (!res.ok) throw new Error(`file download failed: ${res.status}`);
  return res.text();
}

// Список подключений. Его же показывает /start accounts — ссылка «Мои
// подключения» в окошке расширения (t.me/<бот>?start=accounts).
export async function showAccounts(ctx: Context) {
  const m = messages[await langOf(ctx)];
  if (ctx.chat?.type === "channel") return;
  try {
    const { text, keyboard } = await listFor(ctx, m);
    await ctx.reply(text, { reply_markup: keyboard });
  } catch (e: any) {
    await ctx.reply(errorText(m, e));
  }
}

export function registerAccountHandlers(bot: Bot) {
  bot.command("accounts", showAccounts);

  bot.command("connect", async (ctx) => {
    const m = messages[await langOf(ctx)];
    if (ctx.chat.type === "channel" || !ctx.from) return;
    // Регистр не важен: команду с кодом человек набрал сознательно.
    const code = parseConnectCode(ctx.match.toUpperCase());
    if (!code) {
      await ctx.reply(m.connectUsage);
      return;
    }
    if (ctx.chat.type !== "private") {
      // Сообщение с кодом — прочь из чата сразу, до любых проверок: при отказе
      // код иначе остался бы на виду, и любой участник подключил бы чужой вход
      // к себе в личку.
      await removeMessage(ctx);
      const burn = () => api("/user-cookies/burn", { code }).catch(() => {});
      // Анонимный админ пишет от служебного бота — подключения разных админов
      // слились бы в одну запись, и написать «вход не работает» некому.
      if (ctx.from.is_bot) {
        await burn();
        await ctx.reply(m.connectNotAnonymous);
        return;
      }
      const settings = await loadSettings(ctx.chat.id);
      if (settings.cookiesBy !== "all" && !(await isGroupAdmin(ctx))) {
        await burn();
        await ctx.reply(m.connectOnlyAdmins);
        return;
      }
    }
    await connect(ctx, m, { code });
  });

  bot.callbackQuery(/^ac\|/, async (ctx) => {
    const m = messages[await langOf(ctx)];
    const chat = ctx.chat;
    if (!chat) {
      await ctx.answerCallbackQuery();
      return;
    }
    const [, action, id] = ctx.callbackQuery.data.split("|");
    try {
      if (action === "all" && chat.type === "private") {
        const { removed } = await api<{ removed: number }>(`/user-cookies/owner/${ctx.from.id}/delete-all`, {});
        await ctx.answerCallbackQuery({ text: m.accountsDeletedAll(removed) });
      } else if (action === "d" && id) {
        // Админ группы может удалить любое подключение в ней; сервер сверит,
        // что запись и правда из этой группы.
        const adminOfScope = chat.type !== "private" && (await isGroupAdmin(ctx)) ? `chat:${chat.id}` : undefined;
        try {
          await api(`/user-cookies/${id}/delete`, { telegramId: ctx.from.id, adminOfScope });
        } catch {
          await ctx.answerCallbackQuery({ text: m.accountsNotAllowed, show_alert: true });
          return;
        }
        await ctx.answerCallbackQuery({ text: m.accountsDeleted });
      } else {
        await ctx.answerCallbackQuery();
        return;
      }
      const { text, keyboard } = await listFor(ctx, m);
      await ctx.editMessageText(text, { reply_markup: keyboard }).catch(() => {});
    } catch (e: any) {
      await ctx.answerCallbackQuery({ text: errorText(m, e), show_alert: true }).catch(() => {});
    }
  });

  const priv = bot.chatType("private");

  priv.on("message:document", async (ctx, next) => {
    const doc = ctx.message.document;
    const name = (doc.file_name ?? "").toLowerCase();
    // Не файл кук — не наше: пусть его увидят остальные обработчики.
    if (!name.endsWith(".txt") && !name.endsWith(".json") && doc.mime_type !== "text/plain") return next();
    const m = messages[await langOf(ctx)];
    if ((doc.file_size ?? 0) > MAX_COOKIES_FILE) {
      await ctx.reply(m.connectFileTooBig);
      return;
    }
    let raw: string;
    try {
      raw = await readDocument(ctx);
    } catch (e: any) {
      console.error("Файл кук не прочитан:", e?.message ?? e);
      await ctx.reply(m.connectFailed);
      return;
    }
    // Просто текстовый файл, а не куки, — не наш: сообщение не трогаем.
    if (!looksLikeCookiesText(raw)) return next();
    if (raw.length > MAX_COOKIES_FILE) {
      await ctx.reply(m.connectFileTooBig);
      return;
    }
    await removeMessage(ctx);
    await connect(ctx, m, { raw });
  });

  // Код из расширения или текст кук, вставленный сообщением. Остальной текст
  // идёт дальше — к обработчику ссылок (handlers/download.ts).
  priv.on("message:text", async (ctx, next) => {
    const text = ctx.message.text;
    const code = parseConnectCode(text, { strict: true });
    if (!code && !looksLikeCookiesText(text)) return next();
    const m = messages[await langOf(ctx)];
    if (code) {
      await connect(ctx, m, { code });
      return;
    }
    await removeMessage(ctx);
    await connect(ctx, m, { raw: text });
  });
}
