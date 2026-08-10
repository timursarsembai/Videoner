export type Lang = "ru" | "en";

export function detectLang(languageCode?: string): Lang {
  return languageCode?.toLowerCase().startsWith("ru") ? "ru" : "en";
}

interface Messages {
  start: string;
  notLink: string;
  fetchingInfo: string;
  audioOnlyButton: string;
  chooseQuality: (title: string, duration: string) => string;
  sessionExpired: string;
  downloading: string;
  downloadFailed: string;
  downloadTimeout: string;
  downloadInterrupted: string;
  fileTooBig: (mb: string, url: string) => string;
  sendingFile: string;
  failedPrefix: string;
  dailyLimitReached: string;
  errorLoginRequired: string;
  errorUnsupportedPlatform: string;
  errorFormatUnavailable: string;
  errorNoVideoContent: string;
  errorRateLimited: string;
}

const ru: Messages = {
  start: "Привет! Пришли мне ссылку на видео из YouTube, TikTok, Instagram, Facebook, Twitter/X, Vimeo, VK, Rutube, OK.ru, Pinterest или Threads — я помогу его скачать.\n\n✨ Качество ничем не ограничено: отдам всё, что есть у площадки, вплоть до 4K и 8K. HD не нужно открывать за деньги — платных функций тут нет вовсе.\n\nПолностью бесплатно: без подписок, без рекламы, без встроенных покупок.",
  notLink: "Это не похоже на ссылку. Пришли ссылку на видео.",
  fetchingInfo: "🔍 Получаю информацию о видео...",
  audioOnlyButton: "🎵 Только аудио (mp3)",
  chooseQuality: (title, duration) => `«${title}»${duration ? `\n⏱ ${duration}` : ""}\n\nВыбери качество:`,
  sessionExpired: "Сессия устарела — пришли ссылку ещё раз",
  downloading: "⏬ Скачиваю, это может занять пару минут...",
  downloadFailed: "загрузка завершилась ошибкой",
  downloadTimeout: "тайм-аут загрузки",
  downloadInterrupted: "⚠️ Бот обновляется и должен перезапуститься — скачивание прервано. Пришли ссылку ещё раз через минуту.",
  fileTooBig: (mb, url) =>
    `Файл получился большим (${mb} МБ) — Telegram не даст боту его отправить.\nСкачай по ссылке: ${url}`,
  sendingFile: "📤 Отправляю файл...",
  failedPrefix: "❌ Не получилось: ",
  dailyLimitReached: "📅 На сегодня всё: достигнут суточный лимит в 20 скачиваний. Он обновится в течение суток — приходи позже, скачивать снова можно будет бесплатно и в любом качестве.",
  errorLoginRequired:
    "Это видео закрыто для гостей — платформа показывает его только залогиненным " +
    "пользователям (приватный аккаунт, возрастное или «чувствительное» ограничение).\n\n" +
    "Владельцу бота нужно настроить cookies.txt на сервере, чтобы он заходил под " +
    "авторизованной сессией (см. README проекта, раздел «Cookies для Instagram/Facebook»).",
  errorUnsupportedPlatform:
    "Не распознал ссылку — проверь, что это прямая ссылка на видео с YouTube, TikTok, Instagram, Facebook, Twitter/X, Vimeo, VK, Rutube, OK.ru, Pinterest или Threads.",
  errorFormatUnavailable: "Для этого видео нет такого качества. Пришли ссылку ещё раз — покажу актуальный список.",
  errorNoVideoContent: "По этой ссылке нет видео для скачивания — похоже, пост содержит только фото.",
  errorRateLimited: "Слишком много ссылок подряд — подожди немного и пришли снова.",
};

const en: Messages = {
  start: "Hi! Send me a link to a video from YouTube, TikTok, Instagram, Facebook, Twitter/X, Vimeo, VK, Rutube, OK.ru, Pinterest, or Threads — I'll help you download it.\n\n✨ No quality limits at all: you get whatever the platform offers, up to 4K and 8K. HD costs nothing to unlock — there are no paid features here.\n\nCompletely free: no subscriptions, no ads, no in-app purchases.",
  notLink: "That doesn't look like a link. Send me a video link.",
  fetchingInfo: "🔍 Fetching video info...",
  audioOnlyButton: "🎵 Audio only (mp3)",
  chooseQuality: (title, duration) => `"${title}"${duration ? `\n⏱ ${duration}` : ""}\n\nChoose quality:`,
  sessionExpired: "Session expired — send the link again",
  downloading: "⏬ Downloading, this may take a couple of minutes...",
  downloadFailed: "download failed",
  downloadTimeout: "download timed out",
  downloadInterrupted: "⚠️ The bot is restarting for an update — your download was interrupted. Please send the link again in a minute.",
  fileTooBig: (mb, url) =>
    `The file turned out large (${mb} MB) — Telegram won't let the bot send it.\nDownload it here: ${url}`,
  sendingFile: "📤 Sending file...",
  failedPrefix: "❌ Failed: ",
  dailyLimitReached: "📅 That is it for today: you have reached the daily limit of 20 downloads. It refreshes within 24 hours — come back later and download again, free and in any quality.",
  errorLoginRequired:
    "This video is closed to guests — the platform only shows it to logged-in " +
    "users (private account, age-restricted, or \"sensitive\" content).\n\n" +
    "The bot owner needs to set up cookies.txt on the server so it can browse with an " +
    "authenticated session (see the project README, \"Cookies for Instagram/Facebook\" section).",
  errorUnsupportedPlatform:
    "Couldn't recognize that link — make sure it's a direct video link from YouTube, TikTok, Instagram, Facebook, Twitter/X, Vimeo, VK, Rutube, OK.ru, Pinterest, or Threads.",
  errorFormatUnavailable: "That quality isn't available for this video. Send the link again — I'll show the current list.",
  errorNoVideoContent: "This link doesn't have a video to download — the post appears to be photo-only.",
  errorRateLimited: "Too many links in a row — wait a bit and send it again.",
};

export const messages: Record<Lang, Messages> = { ru, en };
