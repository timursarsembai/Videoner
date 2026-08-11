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
  fileCaption: (title: string, sourceUrl: string) => string;
  shareOffer: string;
  shareButton: string;
  shareConfirm: string;
  shareConfirmYes: string;
  shareConfirmNo: string;
  shareDone: string;
  shareCancelled: string;
  shareFailed: string;
  shareExpired: string;
  channelPost: (title: string, url: string) => string;
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
  // Подпись прикрепляется к самому файлу, поэтому уезжает вместе с ним при
  // пересылке — ради этого всё и делается. Заголовок подрезаем: у подписи в
  // Telegram лимит 1024 символа, а название ролика бывает на пол-экрана.
  fileCaption: (title, sourceUrl) =>
    (title ? `🎬 ${title.slice(0, 200)}\n\n` : "") +
    `Источник: ${sourceUrl}\n` +
    "Права на видео принадлежат его автору.\n" +
    "Скачано бесплатно через @VideonerBot",
  shareOffer: "Готово! Если это ваше видео или автор не против — можно поделиться ссылкой в нашем канале.",
  shareButton: "📢 Поделиться в канале",
  shareConfirm:
    "В канал уйдёт только ссылка на исходный пост, без вашего имени.\n\n" +
    "Подтвердите, что вправе ей делиться: это ваше видео либо его автор не возражает против распространения.",
  shareConfirmYes: "Да, публикую",
  shareConfirmNo: "Отмена",
  shareDone: "✅ Ссылка опубликована в канале. Спасибо!",
  shareCancelled: "Хорошо, ничего не публикуем.",
  shareFailed: "Не получилось опубликовать. Попробуйте позже.",
  shareExpired: "Слишком много времени прошло — скачайте видео заново, чтобы поделиться.",
  channelPost: (title, url) =>
    (title ? `🎬 ${title.slice(0, 200)}\n\n` : "") +
    `${url}\n\n` +
    "Скачать это и любое другое видео бесплатно: @VideonerBot",
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
  fileCaption: (title, sourceUrl) =>
    (title ? `🎬 ${title.slice(0, 200)}\n\n` : "") +
    `Source: ${sourceUrl}\n` +
    "All rights to the video belong to its author.\n" +
    "Downloaded for free with @VideonerBot",
  shareOffer: "Done! If this is your video, or its author does not mind, you can share the link in our channel.",
  shareButton: "📢 Share in the channel",
  shareConfirm:
    "Only the link to the original post goes to the channel — your name does not.\n\n" +
    "Please confirm you are entitled to share it: the video is yours, or its author does not object to it being spread.",
  shareConfirmYes: "Yes, publish",
  shareConfirmNo: "Cancel",
  shareDone: "✅ The link is now in the channel. Thank you!",
  shareCancelled: "All right, nothing was published.",
  shareFailed: "Could not publish it. Please try again later.",
  shareExpired: "Too much time has passed — download the video again to share it.",
  channelPost: (title, url) =>
    (title ? `🎬 ${title.slice(0, 200)}\n\n` : "") +
    `${url}\n\n` +
    "Download this and any other video for free: @VideonerBot",
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
