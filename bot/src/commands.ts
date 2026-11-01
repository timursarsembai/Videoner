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
  sw: [
    { command: "start", description: "Jinsi ya kutumia bot" },
    { command: "extension", description: "Kiendelezi cha kivinjari" },
    { command: "accounts", description: "Akaunti zako kwa story na machapisho ya faragha" },
    { command: "connect", description: "Unganisha akaunti kwa msimbo kutoka kwenye kiendelezi" },
    { command: "stop", description: "Simamisha upakuaji na foleni" },
    { command: "language", description: "Lugha ya bot" },
  ],
  de: [
    { command: "start", description: "So benutzt du den Bot" },
    { command: "extension", description: "Browser-Erweiterung" },
    { command: "accounts", description: "Deine Konten für Storys und private Beiträge" },
    { command: "connect", description: "Konto mit einem Code aus der Erweiterung verbinden" },
    { command: "stop", description: "Download und Warteschlange stoppen" },
    { command: "language", description: "Sprache des Bots" },
  ],
  fr: [
    { command: "start", description: "Comment utiliser le bot" },
    { command: "extension", description: "Extension pour navigateur" },
    { command: "accounts", description: "Vos comptes pour les stories et publications privées" },
    { command: "connect", description: "Connecter un compte avec un code de l'extension" },
    { command: "stop", description: "Arrêter le téléchargement et la file d'attente" },
    { command: "language", description: "Langue du bot" },
  ],
  it: [
    { command: "start", description: "Come usare il bot" },
    { command: "extension", description: "Estensione per il browser" },
    { command: "accounts", description: "I tuoi account per storie e post privati" },
    { command: "connect", description: "Collega un account con un codice dall'estensione" },
    { command: "stop", description: "Ferma il download e la coda" },
    { command: "language", description: "Lingua del bot" },
  ],
  pt: [
    { command: "start", description: "Como usar o bot" },
    { command: "extension", description: "Extensão para navegador" },
    { command: "accounts", description: "Suas contas para stories e posts privados" },
    { command: "connect", description: "Conectar uma conta com um código da extensão" },
    { command: "stop", description: "Parar o download e a fila" },
    { command: "language", description: "Idioma do bot" },
  ],
  es: [
    { command: "start", description: "Cómo usar el bot" },
    { command: "extension", description: "Extensión para el navegador" },
    { command: "accounts", description: "Tus cuentas para historias y publicaciones privadas" },
    { command: "connect", description: "Conectar una cuenta con un código de la extensión" },
    { command: "stop", description: "Detener la descarga y la cola" },
    { command: "language", description: "Idioma del bot" },
  ],
  uz: [
    { command: "start", description: "Botdan qanday foydalanish" },
    { command: "extension", description: "Brauzer uchun kengaytma" },
    { command: "accounts", description: "Storislar va yopiq postlar uchun akkauntlaringiz" },
    { command: "connect", description: "Kengaytmadagi kod bilan akkauntni ulash" },
    { command: "stop", description: "Yuklab olish va navbatni toʻxtatish" },
    { command: "language", description: "Bot tili" },
  ],
  tr: [
    { command: "start", description: "Bot nasıl kullanılır" },
    { command: "extension", description: "Tarayıcı uzantısı" },
    { command: "accounts", description: "Hikayeler ve gizli gönderiler için hesaplarınız" },
    { command: "connect", description: "Uzantıdan alınan kodla hesap bağlayın" },
    { command: "stop", description: "İndirmeyi ve kuyruğu durdurun" },
    { command: "language", description: "Bot dili" },
  ],
  fa: [
    { command: "start", description: "نحوهٔ استفاده از ربات" },
    { command: "extension", description: "افزونهٔ مرورگر" },
    { command: "accounts", description: "حساب‌های شما برای استوری‌ها و پست‌های خصوصی" },
    { command: "connect", description: "اتصال حساب با کد افزونه" },
    { command: "stop", description: "توقف دانلود و صف" },
    { command: "language", description: "زبان ربات" },
  ],
  vi: [
    { command: "start", description: "Cách dùng bot" },
    { command: "extension", description: "Tiện ích trình duyệt" },
    { command: "accounts", description: "Tài khoản của bạn cho story và bài đăng riêng tư" },
    { command: "connect", description: "Kết nối tài khoản bằng mã từ tiện ích" },
    { command: "stop", description: "Dừng tải và hàng đợi" },
    { command: "language", description: "Ngôn ngữ của bot" },
  ],
  bn: [
    { command: "start", description: "বট কীভাবে ব্যবহার করবেন" },
    { command: "extension", description: "ব্রাউজার এক্সটেনশন" },
    { command: "accounts", description: "স্টোরি ও প্রাইভেট পোস্টের জন্য আপনার অ্যাকাউন্ট" },
    { command: "connect", description: "এক্সটেনশনের কোড দিয়ে অ্যাকাউন্ট যুক্ত করুন" },
    { command: "stop", description: "ডাউনলোড ও সারি থামান" },
    { command: "language", description: "বটের ভাষা" },
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
  sw: [
    { command: "settings", description: "Mipangilio ya bot kwa kikundi hiki (wasimamizi)" },
    { command: "accounts", description: "Akaunti zilizounganishwa na kikundi hiki" },
    { command: "connect", description: "Unganisha akaunti na kikundi hiki kwa msimbo" },
    { command: "language", description: "Lugha ya bot katika kikundi hiki (wasimamizi)" },
    { command: "start", description: "Jinsi bot inavyofanya kazi kwenye kikundi" },
  ],
  de: [
    { command: "settings", description: "Bot-Einstellungen für diese Gruppe (Admins)" },
    { command: "accounts", description: "Mit dieser Gruppe verbundene Konten" },
    { command: "connect", description: "Konto per Code mit dieser Gruppe verbinden" },
    { command: "language", description: "Sprache des Bots in dieser Gruppe (Admins)" },
    { command: "start", description: "So funktioniert der Bot in einer Gruppe" },
  ],
  fr: [
    { command: "settings", description: "Paramètres du bot pour ce groupe (admins)" },
    { command: "accounts", description: "Comptes connectés à ce groupe" },
    { command: "connect", description: "Connecter un compte à ce groupe avec un code" },
    { command: "language", description: "Langue du bot dans ce groupe (admins)" },
    { command: "start", description: "Comment le bot fonctionne dans un groupe" },
  ],
  it: [
    { command: "settings", description: "Impostazioni del bot per questo gruppo (admin)" },
    { command: "accounts", description: "Account collegati a questo gruppo" },
    { command: "connect", description: "Collega un account a questo gruppo con un codice" },
    { command: "language", description: "Lingua del bot in questo gruppo (admin)" },
    { command: "start", description: "Come funziona il bot in un gruppo" },
  ],
  pt: [
    { command: "settings", description: "Configurações do bot neste grupo (admins)" },
    { command: "accounts", description: "Contas conectadas a este grupo" },
    { command: "connect", description: "Conectar uma conta a este grupo com um código" },
    { command: "language", description: "Idioma do bot neste grupo (admins)" },
    { command: "start", description: "Como o bot funciona em um grupo" },
  ],
  es: [
    { command: "settings", description: "Configuración del bot en este grupo (administradores)" },
    { command: "accounts", description: "Cuentas conectadas a este grupo" },
    { command: "connect", description: "Conectar una cuenta a este grupo con un código" },
    { command: "language", description: "Idioma del bot en este grupo (administradores)" },
    { command: "start", description: "Cómo funciona el bot en un grupo" },
  ],
  uz: [
    { command: "settings", description: "Bu guruhdagi bot sozlamalari (adminlar)" },
    { command: "accounts", description: "Bu guruhga ulangan akkauntlar" },
    { command: "connect", description: "Kod bilan bu guruhga akkaunt ulash" },
    { command: "language", description: "Bu guruhdagi bot tili (adminlar)" },
    { command: "start", description: "Bot guruhda qanday ishlaydi" },
  ],
  tr: [
    { command: "settings", description: "Bu gruptaki bot ayarları (yöneticiler)" },
    { command: "accounts", description: "Bu gruba bağlı hesaplar" },
    { command: "connect", description: "Kodla bu gruba hesap bağlayın" },
    { command: "language", description: "Bu gruptaki bot dili (yöneticiler)" },
    { command: "start", description: "Bot grupta nasıl çalışır" },
  ],
  fa: [
    { command: "settings", description: "تنظیمات ربات در این گروه (ادمین‌ها)" },
    { command: "accounts", description: "حساب‌های متصل به این گروه" },
    { command: "connect", description: "اتصال حساب به این گروه با کد" },
    { command: "language", description: "زبان ربات در این گروه (ادمین‌ها)" },
    { command: "start", description: "ربات در گروه چطور کار می‌کند" },
  ],
  vi: [
    { command: "settings", description: "Cài đặt bot trong nhóm này (quản trị viên)" },
    { command: "accounts", description: "Tài khoản đã kết nối với nhóm này" },
    { command: "connect", description: "Kết nối tài khoản với nhóm này bằng mã" },
    { command: "language", description: "Ngôn ngữ của bot trong nhóm này (quản trị viên)" },
    { command: "start", description: "Bot hoạt động trong nhóm như thế nào" },
  ],
  bn: [
    { command: "settings", description: "এই গ্রুপে বটের সেটিংস (অ্যাডমিনদের জন্য)" },
    { command: "accounts", description: "এই গ্রুপে যুক্ত অ্যাকাউন্ট" },
    { command: "connect", description: "কোড দিয়ে এই গ্রুপে অ্যাকাউন্ট যুক্ত করুন" },
    { command: "language", description: "এই গ্রুপে বটের ভাষা (অ্যাডমিনদের জন্য)" },
    { command: "start", description: "গ্রুপে বট কীভাবে কাজ করে" },
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
