import type { Api } from "grammy";
import type { Lang } from "./i18n.js";

// Меню команд (кнопка «Меню» в чате). Общее меню — по языку Telegram
// (bot.ts); кто выбрал язык сам (/language), получает меню своего чата на
// выбранном языке (applyChatCommands).
export const COMMANDS: Record<Lang, { command: string; description: string }[]> = {
  ru: [
    { command: "start", description: "Как пользоваться ботом" },
    { command: "extension", description: "Расширение для браузера" },
    { command: "accounts", description: "Свои аккаунты для сторис и закрытых записей" },
    { command: "connect", description: "Подключить аккаунт по коду из расширения" },
    { command: "stop", description: "Остановить скачивание и очередь" },
    { command: "language", description: "Язык бота" },
  ],
  uk: [
    { command: "start", description: "Як користуватися ботом" },
    { command: "extension", description: "Розширення для браузера" },
    { command: "accounts", description: "Свої акаунти для сторіс і закритих дописів" },
    { command: "connect", description: "Підключити акаунт за кодом із розширення" },
    { command: "stop", description: "Зупинити завантаження й чергу" },
    { command: "language", description: "Мова бота" },
  ],
  kk: [
    { command: "start", description: "Ботты қалай пайдалану керек" },
    { command: "extension", description: "Браузерге арналған кеңейтім" },
    { command: "accounts", description: "Сторис пен жабық жазбаларға арналған өз аккаунттарыңыз" },
    { command: "connect", description: "Кеңейтімдегі код арқылы аккаунт қосу" },
    { command: "stop", description: "Жүктеу мен кезекті тоқтату" },
    { command: "language", description: "Бот тілі" },
  ],
  en: [
    { command: "start", description: "How to use the bot" },
    { command: "extension", description: "Browser extension" },
    { command: "accounts", description: "Your accounts for stories and private posts" },
    { command: "connect", description: "Connect an account with a code from the extension" },
    { command: "stop", description: "Stop the download and the queue" },
    { command: "language", description: "Bot language" },
  ],
};

// В группах — своё меню: там бот работает сам, а админам нужна /settings
// (handlers/group.ts).
export const GROUP_COMMANDS: Record<Lang, { command: string; description: string }[]> = {
  ru: [
    { command: "settings", description: "Настройки бота в группе (для админов)" },
    { command: "accounts", description: "Аккаунты, подключённые к группе" },
    { command: "connect", description: "Подключить аккаунт к группе по коду" },
    { command: "language", description: "Язык бота в группе (для админов)" },
    { command: "start", description: "Как бот работает в группе" },
  ],
  uk: [
    { command: "settings", description: "Налаштування бота в групі (для адмінів)" },
    { command: "accounts", description: "Акаунти, підключені до групи" },
    { command: "connect", description: "Підключити акаунт до групи за кодом" },
    { command: "language", description: "Мова бота в групі (для адмінів)" },
    { command: "start", description: "Як бот працює в групі" },
  ],
  kk: [
    { command: "settings", description: "Топтағы бот баптаулары (әкімшілерге)" },
    { command: "accounts", description: "Топқа қосылған аккаунттар" },
    { command: "connect", description: "Код арқылы топқа аккаунт қосу" },
    { command: "language", description: "Топтағы бот тілі (әкімшілерге)" },
    { command: "start", description: "Бот топта қалай жұмыс істейді" },
  ],
  en: [
    { command: "settings", description: "Bot settings for this group (admins)" },
    { command: "accounts", description: "Accounts connected to this group" },
    { command: "connect", description: "Connect an account to this group with a code" },
    { command: "language", description: "Bot language in this group (admins)" },
    { command: "start", description: "How the bot works in a group" },
  ],
};

// Меню одного чата на выбранном языке; lang null — снова общее меню по языку
// Telegram. Сбой не мешает: язык сообщений от меню не зависит.
export async function applyChatCommands(api: Api, chatId: number, lang: Lang | null, group: boolean) {
  const scope = { type: "chat" as const, chat_id: chatId };
  try {
    if (lang) await api.setMyCommands((group ? GROUP_COMMANDS : COMMANDS)[lang], { scope });
    else await api.deleteMyCommands({ scope });
  } catch (e: any) {
    console.error(`Меню команд чата ${chatId}:`, e?.message ?? e);
  }
}
