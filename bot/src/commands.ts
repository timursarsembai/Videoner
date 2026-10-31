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
  ar: [
    { command: "start", description: "طريقة استخدام البوت" },
    { command: "extension", description: "إضافة المتصفح" },
    { command: "accounts", description: "حساباتك للقصص والمنشورات الخاصة" },
    { command: "connect", description: "ربط حساب برمز من الإضافة" },
    { command: "stop", description: "إيقاف التنزيل وقائمة الانتظار" },
    { command: "language", description: "لغة البوت" },
  ],
  zh: [
    { command: "start", description: "如何使用机器人" },
    { command: "extension", description: "浏览器扩展" },
    { command: "accounts", description: "用于快拍和私密帖子的个人账号" },
    { command: "connect", description: "用扩展中的代码连接账号" },
    { command: "stop", description: "停止下载和队列" },
    { command: "language", description: "机器人语言" },
  ],
  hi: [
    { command: "start", description: "बॉट का इस्तेमाल कैसे करें" },
    { command: "extension", description: "ब्राउज़र एक्सटेंशन" },
    { command: "accounts", description: "स्टोरीज़ और प्राइवेट पोस्ट के लिए आपके खाते" },
    { command: "connect", description: "एक्सटेंशन के कोड से खाता कनेक्ट करें" },
    { command: "stop", description: "डाउनलोड और कतार रोकें" },
    { command: "language", description: "बॉट की भाषा" },
  ],
  id: [
    { command: "start", description: "Cara menggunakan bot" },
    { command: "extension", description: "Ekstensi browser" },
    { command: "accounts", description: "Akun Anda untuk story dan postingan privat" },
    { command: "connect", description: "Hubungkan akun dengan kode dari ekstensi" },
    { command: "stop", description: "Hentikan unduhan dan antrean" },
    { command: "language", description: "Bahasa bot" },
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
  ar: [
    { command: "settings", description: "إعدادات البوت في المجموعة (للمشرفين)" },
    { command: "accounts", description: "الحسابات المرتبطة بالمجموعة" },
    { command: "connect", description: "ربط حساب بالمجموعة برمز" },
    { command: "language", description: "لغة البوت في المجموعة (للمشرفين)" },
    { command: "start", description: "كيف يعمل البوت في المجموعة" },
  ],
  zh: [
    { command: "settings", description: "本群的机器人设置（管理员）" },
    { command: "accounts", description: "已连接到本群的账号" },
    { command: "connect", description: "用代码为本群连接账号" },
    { command: "language", description: "机器人在本群的语言（管理员）" },
    { command: "start", description: "机器人在群组中如何工作" },
  ],
  hi: [
    { command: "settings", description: "इस ग्रुप में बॉट की सेटिंग्स (एडमिन के लिए)" },
    { command: "accounts", description: "इस ग्रुप से कनेक्ट किए गए खाते" },
    { command: "connect", description: "कोड से इस ग्रुप में खाता कनेक्ट करें" },
    { command: "language", description: "इस ग्रुप में बॉट की भाषा (एडमिन के लिए)" },
    { command: "start", description: "ग्रुप में बॉट कैसे काम करता है" },
  ],
  id: [
    { command: "settings", description: "Pengaturan bot di grup ini (admin)" },
    { command: "accounts", description: "Akun yang terhubung ke grup ini" },
    { command: "connect", description: "Hubungkan akun ke grup ini dengan kode" },
    { command: "language", description: "Bahasa bot di grup ini (admin)" },
    { command: "start", description: "Cara kerja bot di grup" },
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
