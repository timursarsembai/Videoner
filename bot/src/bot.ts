import "dotenv/config";
import { Bot, InlineKeyboard } from "grammy";
import { LANGS, messages, sitePath } from "./i18n.js";
import { langOf } from "./language.js";
import { COMMANDS, GROUP_COMMANDS } from "./commands.js";
import { API_KEY, BOT_API_ROOT } from "./helpers.js";
import { registerAdminHandlers } from "./handlers/admin.js";
import { registerMembershipHandlers } from "./handlers/membership.js";
import { registerDownloadHandlers, notifyActiveDownloadsBeforeShutdown, handleLinks } from "./handlers/download.js";
import { registerInlineHandlers } from "./handlers/inline.js";
import { openInvite } from "./handlers/invite.js";
import { registerBlockedHandlers } from "./handlers/blocked.js";
import { registerGroupHandlers, sendGroupWelcome } from "./handlers/group.js";
import { registerAccountHandlers, showAccounts } from "./handlers/accounts.js";
import { registerLanguageHandlers } from "./handlers/language.js";
import { startBlogChannel } from "./blog-channel.js";

// bot.ts — только создание бота, /start и подключение хендлеров из
// handlers/*.ts. Раньше это был один файл на 494 строки со всеми командами и
// коллбэками на одном уровне — вынесены: handlers/download.ts (message:text +
// callback_query:data — самая большая и рискованная часть), handlers/admin.ts
// (/grant, /revoke), общие утилиты — в helpers.ts.
//
// handlers/subscription.ts удалён вместе со всеми платными функциями: сервис
// бесплатный, подписок и оплаты через Stars больше нет.
const BOT_TOKEN = process.env.BOT_TOKEN ?? "";

if (!BOT_TOKEN) {
  console.error("BOT_TOKEN не задан. Получите токен у @BotFather и впишите в bot/.env");
  process.exit(1);
}
if (!API_KEY) {
  console.error("API_KEY не задан. Возьмите ключ из вывода seed-скрипта сервера (server/prisma/seed.ts)");
  process.exit(1);
}

const bot = new Bot(BOT_TOKEN, BOT_API_ROOT ? { client: { apiRoot: BOT_API_ROOT } } : undefined);

bot.command("start", async (ctx) => {
  const lang = await langOf(ctx);
  // В группе — как бот работает там (handlers/group.ts), а не инструкция для лички.
  if (ctx.chat.type !== "private") {
    await sendGroupWelcome(ctx);
    return;
  }
  // t.me/<бот>?start=<код> — человек пришёл по ссылке-приглашению на видео.
  const code = ctx.match.trim();
  // «Мои подключения» из окошка расширения (handlers/accounts.ts).
  if (code === "accounts") {
    await showAccounts(ctx);
    return;
  }
  if (code) {
    await openInvite(ctx, code, lang);
    return;
  }
  // Кнопка открывает в Telegram выбор группы, куда добавить бота (режим для
  // групп — handlers/group.ts).
  await ctx.reply(messages[lang].start, {
    reply_markup: new InlineKeyboard().url(messages[lang].addToGroupButton, `https://t.me/${ctx.me.username}?startgroup=true`),
  });
});

// Страница расширения для браузера на сайте.
bot.command("extension", async (ctx) => {
  const lang = await langOf(ctx);
  const page = `https://videoner.download${sitePath(lang, "/extension")}`;
  await ctx.reply(messages[lang].extensionCommand, {
    reply_markup: new InlineKeyboard().url(messages[lang].extensionPageButton, page),
  });
});

registerAdminHandlers(bot);
// Подключённые аккаунты — ДО групп и лички: /connect и /accounts иначе
// проглотил бы групповой обработчик текста (см. handlers/group.ts про
// порядок), а код или куки, присланные в личку, — обработчик ссылок.
registerAccountHandlers(bot);
// /language и кнопки выбора языка — по той же причине до групп; кнопка
// «Язык» из /settings (gs|lang) — раньше остальных кнопок настроек.
registerLanguageHandlers(bot);
// Группы — ДО обработчика блокировок и обработчика лички: оба слушают те же
// типы обновлений (my_chat_member, message:text), а grammY останавливается на
// первом совпадении. Групповой ловит только сообщения групп и дальше их не
// передаёт.
registerGroupHandlers(bot);
// Свой тип обновлений (my_chat_member) в личке.
registerBlockedHandlers(bot);
// Инлайн-режим («@бот <ссылка>» в любом чате). Слушает СВОИ типы обновлений
// (inline_query, chosen_inline_result), с обработчиками сообщений и коллбэков
// не пересекается, поэтому порядок регистрации здесь роли не играет.
registerInlineHandlers(bot);
// ДО registerDownloadHandlers: там generic bot.on("callback_query:data", ...),
// который иначе перехватил бы и sub|check — grammY останавливается на первом
// совпадении, а generic-обработчик ждёт сессию скачивания и отвечал бы
// «сессия устарела».
registerMembershipHandlers(bot, (ctx, urls) => handleLinks(ctx, urls, { resumed: true }));
// ПОСЛЕДНИМ: содержит generic bot.on("callback_query:data", ...), который
// перехватил бы любые более конкретные обработчики — grammY останавливается
// на первом совпадении.
registerDownloadHandlers(bot);

bot.catch((err) => console.error("Bot error:", err.error));

// docker-compose rm -sf (и обычный docker stop) шлют SIGTERM перед тем, как
// убить процесс — это и есть штатный путь остановки при каждом деплое бота.
// Успеваем явно предупредить всех, у кого сейчас в процессе скачивание,
// вместо того чтобы бросать их с зависшим "⏬ Скачиваю..." навсегда.
async function shutdownGracefully(signal: string) {
  console.log(`Получен ${signal} — начинаю штатную остановку...`);
  await notifyActiveDownloadsBeforeShutdown(bot);
  await bot.stop();
  process.exit(0);
}
process.on("SIGTERM", () => void shutdownGracefully("SIGTERM"));
process.on("SIGINT", () => void shutdownGracefully("SIGINT"));

// Меню команд (кнопка «Меню» в чате). Ставим при каждом запуске — так оно
// всегда совпадает с кодом; сбой не мешает боту работать.
void bot.api.setMyCommands(COMMANDS.en).catch((e) => console.error("setMyCommands:", e?.message ?? e));
for (const lang of LANGS.filter((l) => l !== "en")) {
  void bot.api
    .setMyCommands(COMMANDS[lang], { language_code: lang })
    .catch((e) => console.error(`setMyCommands ${lang}:`, e?.message ?? e));
}
void bot.api
  .setMyCommands(GROUP_COMMANDS.en, { scope: { type: "all_group_chats" } })
  .catch((e) => console.error("setMyCommands groups:", e?.message ?? e));
for (const lang of LANGS.filter((l) => l !== "en")) {
  void bot.api
    .setMyCommands(GROUP_COMMANDS[lang], { scope: { type: "all_group_chats" }, language_code: lang })
    .catch((e) => console.error(`setMyCommands groups ${lang}:`, e?.message ?? e));
}

// Статьи блога → канал новостей (blog-channel.ts).
startBlogChannel(bot.api);

bot.start({
  onStart: (me) => console.log(`Бот @${me.username} запущен${BOT_API_ROOT ? ` (локальный Bot API: ${BOT_API_ROOT})` : " (облачный Bot API, лимит 50 МБ)"}`),
});
