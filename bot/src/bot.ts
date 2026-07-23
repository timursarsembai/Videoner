import "dotenv/config";
import { Bot, InlineKeyboard } from "grammy";
import { detectLang, messages } from "./i18n.js";
import { API_KEY, BOT_API_ROOT } from "./helpers.js";
import { addSubscriptionButtons, registerSubscriptionHandlers } from "./handlers/subscription.js";
import { registerAdminHandlers } from "./handlers/admin.js";
import { registerDownloadHandlers, notifyActiveDownloadsBeforeShutdown } from "./handlers/download.js";

// bot.ts — только создание бота, /start (диплинк на подписку) и подключение
// хендлеров из handlers/*.ts. Раньше это был один файл на 494 строки со всеми
// командами/коллбэками на одном уровне — вынесены: handlers/download.ts
// (message:text + callback_query:data — самая большая и рискованная часть),
// handlers/subscription.ts (/subscribe, sub|month/sub|year, платежи),
// handlers/admin.ts (/grant, /revoke), общие утилиты — в helpers.ts.
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

registerAdminHandlers(bot);
registerSubscriptionHandlers(bot);
// ПОСЛЕДНИМ: содержит generic bot.on("callback_query:data", ...), а
// подписочные sub|month/sub|year уже зарегистрированы конкретными
// callbackQuery-обработчиками выше — grammY стопится на первом совпадении.
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

bot.start({
  onStart: (me) => console.log(`Бот @${me.username} запущен${BOT_API_ROOT ? ` (локальный Bot API: ${BOT_API_ROOT})` : " (облачный Bot API, лимит 50 МБ)"}`),
});
