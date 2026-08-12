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
  sendingAlbum: (count: number) => string;
  failedPrefix: string;
  fileCaption: (title: string, sourceUrl: string) => string;
  subscribeRequired: (channel: string) => string;
  openChannelButton: string;
  checkSubscriptionButton: string;
  subscribeThanks: string;
  subscribeStillMissing: string;
  channelNotice: (channel: string) => string;
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
  sendingAlbum: (count) => `📤 В посте несколько файлов (${count}) — отправляю альбомом...`,
  failedPrefix: "❌ Не получилось: ",
  // Подпись прикрепляется к самому файлу, поэтому уезжает вместе с ним при
  // пересылке — ради этого всё и делается. Заголовок подрезаем: у подписи в
  // Telegram лимит 1024 символа, а название ролика бывает на пол-экрана.
  fileCaption: (title, sourceUrl) =>
    (title ? `🎬 ${title.slice(0, 200)}\n\n` : "") +
    `Источник: ${sourceUrl}\n` +
    "Права на видео принадлежат его автору.\n" +
    "Скачано бесплатно через @VideonerBot",
  subscribeRequired: (channel) =>
    `Чтобы скачивать, подпишитесь на наш канал ${channel} — это единственное условие, сервис остаётся бесплатным.\n\n` +
    "Подпишитесь и нажмите «Я подписался».",
  openChannelButton: "📣 Открыть канал",
  checkSubscriptionButton: "Я подписался",
  subscribeThanks: "Спасибо! Теперь пришлите ссылку на видео.",
  subscribeStillMissing: "Подписка пока не видна. Подпишитесь и нажмите ещё раз.",
  channelNotice: (channel) => `\n\nСсылка на этот пост появится в канале ${channel} — анонимно, без вашего имени.`,
  channelPost: (title, url) =>
    (title ? `🎬 ${title.slice(0, 200)}\n\n` : "") +
    `${url}\n\n` +
    "Скачать это и любое другое видео бесплатно: @VideonerBot",
  dailyLimitReached: "📅 На сегодня всё: достигнут суточный лимит в 20 скачиваний. Он обновится в течение суток — приходи позже, скачивать снова можно будет бесплатно и в любом качестве.",
  errorLoginRequired:
    "Эта запись недоступна без входа в аккаунт: площадка отдаёт её только " +
    "авторизованным. Так бывает с приватными записями, возрастными ограничениями " +
    "и постами для ограниченного круга.\n\n" +
    "Публичные записи скачиваются без проблем — попробуйте другую ссылку.",
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
  sendingAlbum: (count) => `📤 This post has several files (${count}) — sending them as an album...`,
  failedPrefix: "❌ Failed: ",
  fileCaption: (title, sourceUrl) =>
    (title ? `🎬 ${title.slice(0, 200)}\n\n` : "") +
    `Source: ${sourceUrl}\n` +
    "All rights to the video belong to its author.\n" +
    "Downloaded for free with @VideonerBot",
  subscribeRequired: (channel) =>
    `To download, please subscribe to our channel ${channel} — that is the only condition, the service stays free.\n\n` +
    "Subscribe and press «I subscribed».",
  openChannelButton: "📣 Open the channel",
  checkSubscriptionButton: "I subscribed",
  subscribeThanks: "Thank you! Now send me a link to a video.",
  subscribeStillMissing: "I do not see the subscription yet. Subscribe and press again.",
  channelNotice: (channel) => `\n\nThe link to this post will appear in ${channel} — anonymously, without your name.`,
  channelPost: (title, url) =>
    (title ? `🎬 ${title.slice(0, 200)}\n\n` : "") +
    `${url}\n\n` +
    "Download this and any other video for free: @VideonerBot",
  dailyLimitReached: "📅 That is it for today: you have reached the daily limit of 20 downloads. It refreshes within 24 hours — come back later and download again, free and in any quality.",
  errorLoginRequired:
    "This post is not available without signing in: the platform serves it only to " +
    "logged-in users. That happens with private posts, age-restricted content and " +
    "posts shared with a limited audience.\n\n" +
    "Public posts download without trouble — try another link.",
  errorUnsupportedPlatform:
    "Couldn't recognize that link — make sure it's a direct video link from YouTube, TikTok, Instagram, Facebook, Twitter/X, Vimeo, VK, Rutube, OK.ru, Pinterest, or Threads.",
  errorFormatUnavailable: "That quality isn't available for this video. Send the link again — I'll show the current list.",
  errorNoVideoContent: "This link doesn't have a video to download — the post appears to be photo-only.",
  errorRateLimited: "Too many links in a row — wait a bit and send it again.",
};

export const messages: Record<Lang, Messages> = { ru, en };
