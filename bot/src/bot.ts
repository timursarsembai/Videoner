import "dotenv/config";
import { Bot, InlineKeyboard } from "grammy";
import { detectLang, messages } from "./i18n.js";
import { API_KEY, BOT_API_ROOT } from "./helpers.js";
import { registerAdminHandlers } from "./handlers/admin.js";
import { registerMembershipHandlers } from "./handlers/membership.js";
import { registerDownloadHandlers, notifyActiveDownloadsBeforeShutdown, handleLinks } from "./handlers/download.js";
import { registerInlineHandlers } from "./handlers/inline.js";
import { openInvite } from "./handlers/invite.js";
import { registerBlockedHandlers } from "./handlers/blocked.js";
import { registerGroupHandlers } from "./handlers/group.js";

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
  const lang = detectLang(ctx.from?.language_code);
  // В группе — как бот работает там (handlers/group.ts), а не инструкция для лички.
  if (ctx.chat.type !== "private") {
    await ctx.reply(messages[lang].groupWelcome);
    return;
  }
  // t.me/<бот>?start=<код> — человек пришёл по ссылке-приглашению на видео.
  const code = ctx.match.trim();
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
  const lang = detectLang(ctx.from?.language_code);
  const page = lang === "ru" ? "https://videoner.download/ru/extension" : "https://videoner.download/extension";
  await ctx.reply(messages[lang].extensionCommand, {
    reply_markup: new InlineKeyboard().url(messages[lang].extensionPageButton, page),
  });
});

registerAdminHandlers(bot);
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
const COMMANDS = {
  ru: [
    { command: "start", description: "Как пользоваться ботом" },
    { command: "extension", description: "Расширение для браузера" },
  ],
  en: [
    { command: "start", description: "How to use the bot" },
    { command: "extension", description: "Browser extension" },
  ],
};
void bot.api.setMyCommands(COMMANDS.en).catch((e) => console.error("setMyCommands:", e?.message ?? e));
void bot.api
  .setMyCommands(COMMANDS.ru, { language_code: "ru" })
  .catch((e) => console.error("setMyCommands ru:", e?.message ?? e));

bot.start({
  onStart: (me) => console.log(`Бот @${me.username} запущен${BOT_API_ROOT ? ` (локальный Bot API: ${BOT_API_ROOT})` : " (облачный Bot API, лимит 50 МБ)"}`),
});
