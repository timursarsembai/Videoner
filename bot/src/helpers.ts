import { createHmac } from "node:crypto";
import { messages, sitePath, type Lang } from "./i18n.js";

// Раньше весь bot.ts (494 строки) держал это на одном уровне вместе со всеми
// хендлерами — вынесено в отдельный модуль без побочных эффектов при импорте
// (в отличие от bot.ts, который создаёт Bot и в конце вызывает bot.start()),
// чтобы handlers/*.ts могли использовать эти утилиты, не завися от bot.ts.
export const API_URL = process.env.API_URL ?? "http://localhost:3001";
export const API_KEY = process.env.API_KEY ?? "";
// Кому разрешены /grant и /revoke — свой Telegram ID узнать можно у @userinfobot.
export const ADMIN_TELEGRAM_ID = process.env.ADMIN_TELEGRAM_ID
  ? Number(process.env.ADMIN_TELEGRAM_ID)
  : undefined;
// Адрес локального Bot API сервера (поднимает лимит отправки файлов до 2 ГБ).
// Если не задан — используется облачный api.telegram.org с лимитом 50 МБ.
export const BOT_API_ROOT = process.env.BOT_API_ROOT || undefined;
export const CLOUD_SIZE_LIMIT = 48 * 1024 * 1024;
// Сколько Telegram даёт боту отправить через локальный Bot API. Качества
// тяжелее этого бот не предлагает: скачивать их — заведомо зря. Без
// локального сервера не ограничиваем: там файл больше 50 МБ отдаётся
// ссылкой (см. fileTooBig), и вес до 2 ГБ этому не мешает.
export const BOT_FILE_LIMIT = BOT_API_ROOT ? 2000 * 1024 * 1024 : Infinity;

const SIZE_UNITS: Record<Lang, { locale: string; gb: string; mb: string }> = {
  ru: { locale: "ru-RU", gb: "ГБ", mb: "МБ" },
  uk: { locale: "uk-UA", gb: "ГБ", mb: "МБ" },
  kk: { locale: "kk-KZ", gb: "ГБ", mb: "МБ" },
  en: { locale: "en-US", gb: "GB", mb: "MB" },
};

// «850 МБ», «1,2 ГБ» — для подписи на кнопках качества.
export function fmtSize(bytes: number, lang: Lang): string {
  const gb = bytes / 1024 ** 3;
  if (gb >= 1) {
    const value = gb.toLocaleString(SIZE_UNITS[lang].locale, { maximumFractionDigits: 1 });
    return `${value} ${SIZE_UNITS[lang].gb}`;
  }
  const mb = Math.max(1, Math.round(bytes / 1024 ** 2));
  return `${mb} ${SIZE_UNITS[lang].mb}`;
}

// Без таймаута зависший (не 5xx, а именно hang — например под нагрузкой)
// запрос к серверу мог висеть неограниченно, ломая расчётный потолок
// ожидания в performDownload (DOWNLOAD_WAIT_POLLS × 3с) — пользователь
// весь это время видел "⏬ Скачиваю..." без единого сообщения об ошибке.
const API_TIMEOUT_MS = 30_000;

// Подпись «это бот» (server/src/lib/bot-auth.ts): HMAC от токена бота, сам
// токен по сети не ходит. Без неё сервер не даст ни подключённых людьми кук,
// ни путей /user-cookies — ключа API для этого мало, он общий с сайтом.
const BOT_SIGNATURE = process.env.BOT_TOKEN
  ? createHmac("sha256", process.env.BOT_TOKEN).update("videoner-bot-v1").digest("hex")
  : "";

// timeoutMs — для запросов, без которых можно обойтись (язык ответа): бот
// обрабатывает обновления по одному, и зависший сервер не должен держать
// всех по 30 секунд.
export async function api<T = any>(path: string, body?: unknown, { timeoutMs = API_TIMEOUT_MS } = {}): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method: body ? "POST" : "GET",
      headers: { "Content-Type": "application/json", "X-API-Key": API_KEY, "X-Videoner-Bot": BOT_SIGNATURE },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
  } catch (e: any) {
    if (e?.name === "AbortError") {
      throw new Error("Request to server timed out");
    }
    throw e;
  } finally {
    clearTimeout(timeout);
  }
  // Сервер/прокси иногда отдаёт не-JSON тело (HTML со страницей 502/504) —
  // без этого res.json() бросал бы SyntaxError, которая долетала бы до
  // пользователя как есть ("Unexpected token < in JSON..."), минуя friendlyError().
  let data: any;
  try {
    data = await res.json();
  } catch {
    throw new Error(`API error ${res.status}`);
  }
  if (!res.ok) {
    throw new Error(Array.isArray(data?.message) ? data.message.join("; ") : data?.message || `API error ${res.status}`);
  }
  return data as T;
}

// Бот проксирует /info одним shared API-ключом на всех Telegram-пользователей —
// без этого один пользователь, засыпающий ссылками, мог бы выесть общий лимит
// у сервера (запрос HD/платного скачивания и так гасится квотой/оплатой, а вот
// /info дергается на КАЖДУЮ присланную ссылку без такой защиты).
const USER_RATE_LIMIT = 20; // ссылок в минуту на одного пользователя
const userRequests = new Map<number, { count: number; resetAt: number }>();

export function checkUserRateLimit(telegramId: number): boolean {
  const now = Date.now();
  const entry = userRequests.get(telegramId);

  if (!entry || entry.resetAt < now) {
    userRequests.set(telegramId, { count: 1, resetAt: now + 60_000 });
    return true;
  }

  if (entry.count >= USER_RATE_LIMIT) {
    return false;
  }

  entry.count++;
  return true;
}

// unref: таймер уборки не должен держать процесс — иначе тесты, которые
// импортируют этот модуль ради friendlyError, никогда не завершались бы.
setInterval(() => {
  const now = Date.now();
  for (const [id, entry] of userRequests.entries()) {
    if (entry.resetAt < now) userRequests.delete(id);
  }
}, 60_000).unref();

export function fmtDuration(sec?: number): string {
  if (!sec) return "";
  const m = Math.floor(sec / 60);
  const s = Math.round(sec % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

// Переводит сырые ошибки yt-dlp в понятные пользователю объяснения.
// Instagram/Facebook отдают приватные, возрастные и "чувствительные" ролики
// только залогиненным сессиям — без cookies.txt на сервере такие ссылки не скачать.
export function friendlyError(raw: string, lang: Lang): string {
  const msg = (raw || "").toLowerCase();
  const m = messages[lang];

  // Свои, уже переведённые тексты: бот сам бросает их как ошибки
  // (performDownload), и заменять их общим «не удалось» незачем.
  if (raw === m.downloadFailed || raw === m.downloadTimeout) {
    return raw;
  }

  // Раньше проверки на вход: при региональной блокировке площадка отвечает
  // отказом, похожим на «нужна авторизация», но вход тут ничего не даёт —
  // ролик не отдают нашему адресу вообще. Сырой код TikTok (10231) ловим
  // тоже: до бота он доходит причёсанным сервером, но при прямом обращении
  // к /download может прийти и как есть.
  if (
    msg.includes("status code 10231") ||
    msg.includes("cross_border_violation") ||
    msg.includes("blocked outside the author's country") ||
    msg.includes("not available in your country") ||
    msg.includes("not available in your region") ||
    msg.includes("not available from your location")
  ) {
    return m.errorRegionBlocked;
  }

  // Threads не показывает медиа поста без входа — или пост и правда текстовый:
  // по данным площадки это не отличить (см. _NO_MEDIA_MESSAGE в плагине
  // server/ytdlp-plugins/threads). Раньше проверки на вход: в тексте есть
  // «signed-in», и его нельзя принять за обычную закрытую запись.
  if (msg.includes("no video or photo is visible in this threads post")) {
    return m.errorThreadsNoMedia;
  }

  // Сторис Instagram без входа не отдаёт вовсе (yt-dlp: «[instagram:story] …
  // This content is unreachable. Use --cookies…»). Совет войти тут не годится —
  // входить негде; честно говорим, что бот их не качает, а расширение — да.
  // Ссылка /stories/<ник>/ без номера, а профиль Instagram серверу не отдал
  // (server/src/lib/instagram-story.ts) — просим ссылку на конкретную сторис.
  if (msg.includes("story link without an id")) {
    return m.errorStoryNeedsId;
  }
  if (msg.includes("[instagram:story]") || msg.includes("this content is unreachable")) {
    return m.errorInstagramStory;
  }

  // Площадка отказала нашему серверу, а не человеку. Instagram пишет «empty
  // media response ... check if this post is accessible without being
  // logged-in» и по публичным роликам, когда временно ограничивает доступ с
  // нашего адреса (поймано 06.10.2026: человек получил этот текст как есть,
  // по-английски). «Запись недоступна без входа» тут была бы неправдой.
  // Сюда же антибот-проверка YouTube: она про наш сервер, а не про ролик.
  // Стоит раньше проверки на вход — в обоих текстах есть «sign in»/«--cookies».
  if (
    msg.includes("empty media response") ||
    msg.includes("without being logged-in") ||
    msg.includes("rate-limit reached") ||
    msg.includes("confirm you're not a bot") ||
    msg.includes("confirm you’re not a bot")
  ) {
    return m.errorPlatformRefused;
  }

  if (
    msg.includes("certain audiences") ||
    msg.includes("age-restricted") ||
    msg.includes("age restricted") ||
    msg.includes("sign in") ||
    msg.includes("log in") ||
    msg.includes("login required") ||
    msg.includes("requires authentication") ||
    msg.includes("private") ||
    // См. комментарий в server/src/lib/error-category.ts: у Meta закрытая
    // запись выглядит как ошибка разбора страницы, а не как «нужен вход».
    msg.includes("cannot parse data")
  ) {
    return m.errorLoginRequired;
  }

  if (msg.includes("unsupported platform") || msg.includes("invalid url")) {
    return m.errorUnsupportedPlatform;
  }

  // Сервер отказал заранее (см. server/src/lib/file-size.ts) или Telegram не
  // принял файл: обоим нужен один совет — качество пониже.
  if (
    msg.includes("file too large") ||
    msg.includes("request entity too large") ||
    msg.includes("file is too big")
  ) {
    return m.errorFileTooLarge;
  }

  if (msg.includes("requested format is not available")) {
    return m.errorFormatUnavailable;
  }

  if (msg.includes("no video formats found") || msg.includes("doesn't contain a downloadable video")) {
    return m.errorNoVideoContent;
  }

  // Предел длительности ролика у API-ключа (DownloadService.checkDurationLimit).
  if (msg.includes("exceeds the allowed limit")) {
    return m.errorTooLong;
  }

  if (msg.includes("rate limit exceeded") || msg.includes("too many requests")) {
    return m.errorRateLimited;
  }

  // Всё нераспознанное — общим понятным текстом на языке человека. Раньше
  // сюда возвращался сырой текст yt-dlp: английский, с флагами вроде
  // --cookies, которые человеку ничего не говорят. Сам текст — в лог, чтобы
  // по нему добавлять новые случаи выше.
  console.error("Ошибка без перевода, показан общий текст:", raw);
  return m.errorUnknown;
}

// Страница расширения для браузера на сайте (web/app/[locale]/extension).
const EXTENSION_PAGE_BASE = (process.env.EXTENSION_PAGE_BASE ?? "https://videoner.download").replace(/\/+$/, "");

// Площадки, которые расширение качает прямо в браузере, под входом человека
// (extension/page-media.js). Остальные оно качает тем же сервером — там
// предлагать его бессмысленно.
const BROWSER_HOSTS = /(^|\.)(instagram\.com|facebook\.com|fb\.watch|tiktok\.com|threads\.(net|com))$/i;

/**
 * Ссылка на страницу расширения для ошибки, которую расширение обойдёт:
 * площадка не отдала ролик нашему серверу (нужен вход, закрытая запись,
 * временный отказ нашему адресу). Иначе null. Та же логика на сайте —
 * web/lib/extension-hint.ts.
 */
export function extensionLinkFor(raw: string, url: string, lang: Lang): string | null {
  let host: string;
  try {
    host = new URL(url).hostname;
  } catch {
    return null;
  }
  if (!BROWSER_HOSTS.test(host)) return null;
  const m = messages[lang];
  const text = friendlyError(raw, lang);
  if (
    text !== m.errorLoginRequired &&
    text !== m.errorPlatformRefused &&
    text !== m.errorThreadsNoMedia &&
    text !== m.errorInstagramStory
  ) {
    return null;
  }
  return `${EXTENSION_PAGE_BASE}${sitePath(lang, "/extension")}?url=${encodeURIComponent(url)}`;
}
