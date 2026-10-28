import { localizedHref } from "@/lib/i18n/routing";
import { Language } from "@/lib/i18n/translations";
import { detectPlatform } from "@/lib/validations/url";

// Когда ошибку сервера стоит обойти расширением для браузера. Расширение
// качает Instagram, Facebook, TikTok и Threads прямо в браузере человека, с его
// входом на площадке (extension/page-media.js), — значит, поможет там, где
// площадка не отдала ролик нашему серверу: закрытая запись, «нужен вход» или
// временный отказ нашему адресу. Остальные площадки расширение качает тем же
// сервером, и предлагать его там бессмысленно. Сигналы — те же, что у бота
// (bot/src/helpers.ts friendlyError) и в server/src/lib/error-category.ts.

const BROWSER_PLATFORMS = new Set(["instagram", "facebook", "tiktok", "threads"]);

// Региональная блокировка похожа на «нужен вход», но это про страну, а не
// про аккаунт — проверяется первой, как и у бота.
const REGION_SIGNALS = [
  "status code 10231",
  "cross_border_violation",
  "blocked outside the author's country",
  "not available in your country",
  "not available in your region",
  "not available from your location",
];

const BROWSER_HELPS_SIGNALS = [
  // Площадка отказала нашему серверу.
  "empty media response",
  "without being logged-in",
  "rate-limit reached",
  // Нужен вход.
  "sign in",
  "log in",
  "login required",
  "requires authentication",
  "private",
  "cannot parse data",
  // Threads: медиа поста видно только вошедшим.
  "no video or photo is visible in this threads post",
];

export function browserCanHelp(url: string, message: string): boolean {
  const platform = detectPlatform(url.trim());
  if (!platform || !BROWSER_PLATFORMS.has(platform)) return false;
  const msg = (message || "").toLowerCase();
  if (REGION_SIGNALS.some((s) => msg.includes(s))) return false;
  return BROWSER_HELPS_SIGNALS.some((s) => msg.includes(s));
}

export function extensionPageHref(language: Language, url?: string): string {
  const query = url ? `?url=${encodeURIComponent(url.trim())}` : "";
  return localizedHref(language, `/extension${query}`);
}
