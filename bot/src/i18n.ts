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
  fileTooBig: (mb: string, url: string) => string;
  sendingFile: string;
  failedPrefix: string;
  invoiceTitle: (quality: string) => string;
  invoiceDescription: (quality: string, price: number) => string;
  invoiceLabel: (quality: string) => string;
  invoiceTitleQuotaExceeded: string;
  invoiceDescriptionQuotaExceeded: (price: number) => string;
  invoiceLabelQuotaExceeded: string;
  paymentReceived: string;
  orderExpired: string;
  errorLoginRequired: string;
  errorUnsupportedPlatform: string;
  errorFormatUnavailable: string;
  errorNoVideoContent: string;
}

const ru: Messages = {
  start: "Привет! Пришли мне ссылку на видео из YouTube, TikTok, Instagram, Facebook, Twitter/X, Vimeo, VK, Rutube, OK.ru или Pinterest — я помогу его скачать.",
  notLink: "Это не похоже на ссылку. Пришли ссылку на видео.",
  fetchingInfo: "🔍 Получаю информацию о видео...",
  audioOnlyButton: "🎵 Только аудио (mp3)",
  chooseQuality: (title, duration) => `«${title}»${duration ? `\n⏱ ${duration}` : ""}\n\nВыбери качество:`,
  sessionExpired: "Сессия устарела — пришли ссылку ещё раз",
  downloading: "⏬ Скачиваю, это может занять пару минут...",
  downloadFailed: "загрузка завершилась ошибкой",
  downloadTimeout: "тайм-аут загрузки",
  fileTooBig: (mb, url) =>
    `Файл получился большим (${mb} МБ) — Telegram не даст боту его отправить.\nСкачай по ссылке: ${url}`,
  sendingFile: "📤 Отправляю файл...",
  failedPrefix: "❌ Не получилось: ",
  invoiceTitle: (quality) => `HD-качество ${quality}`,
  invoiceDescription: (quality, price) => `Скачивание видео в качестве ${quality} за ${price} ⭐`,
  invoiceLabel: (quality) => `Видео ${quality}`,
  invoiceTitleQuotaExceeded: "Дневной лимит исчерпан",
  invoiceDescriptionQuotaExceeded: (price) =>
    `Бесплатные скачивания на сегодня закончились — это скачивание за ${price} ⭐`,
  invoiceLabelQuotaExceeded: "Скачивание сверх лимита",
  paymentReceived: "✅ Оплата получена, начинаю скачивание.",
  orderExpired: "Заказ устарел — пришли ссылку ещё раз",
  errorLoginRequired:
    "Это видео закрыто для гостей — платформа показывает его только залогиненным " +
    "пользователям (приватный аккаунт, возрастное или «чувствительное» ограничение).\n\n" +
    "Владельцу бота нужно настроить cookies.txt на сервере, чтобы он заходил под " +
    "авторизованной сессией (см. README проекта, раздел «Cookies для Instagram/Facebook»).",
  errorUnsupportedPlatform:
    "Не распознал ссылку — проверь, что это прямая ссылка на видео с YouTube, TikTok, Instagram, Facebook, Twitter/X, Vimeo, VK, Rutube, OK.ru или Pinterest.",
  errorFormatUnavailable: "Для этого видео нет такого качества. Пришли ссылку ещё раз — покажу актуальный список.",
  errorNoVideoContent: "По этой ссылке нет видео для скачивания — похоже, пост содержит только фото.",
};

const en: Messages = {
  start: "Hi! Send me a link to a video from YouTube, TikTok, Instagram, Facebook, Twitter/X, Vimeo, VK, Rutube, OK.ru, or Pinterest — I'll help you download it.",
  notLink: "That doesn't look like a link. Send me a video link.",
  fetchingInfo: "🔍 Fetching video info...",
  audioOnlyButton: "🎵 Audio only (mp3)",
  chooseQuality: (title, duration) => `"${title}"${duration ? `\n⏱ ${duration}` : ""}\n\nChoose quality:`,
  sessionExpired: "Session expired — send the link again",
  downloading: "⏬ Downloading, this may take a couple of minutes...",
  downloadFailed: "download failed",
  downloadTimeout: "download timed out",
  fileTooBig: (mb, url) =>
    `The file turned out large (${mb} MB) — Telegram won't let the bot send it.\nDownload it here: ${url}`,
  sendingFile: "📤 Sending file...",
  failedPrefix: "❌ Failed: ",
  invoiceTitle: (quality) => `HD quality ${quality}`,
  invoiceDescription: (quality, price) => `Download the video in ${quality} for ${price} ⭐`,
  invoiceLabel: (quality) => `Video ${quality}`,
  invoiceTitleQuotaExceeded: "Daily limit reached",
  invoiceDescriptionQuotaExceeded: (price) =>
    `You're out of free downloads for today — this one costs ${price} ⭐`,
  invoiceLabelQuotaExceeded: "Download over the limit",
  paymentReceived: "✅ Payment received, starting download.",
  orderExpired: "Order expired — send the link again",
  errorLoginRequired:
    "This video is closed to guests — the platform only shows it to logged-in " +
    "users (private account, age-restricted, or \"sensitive\" content).\n\n" +
    "The bot owner needs to set up cookies.txt on the server so it can browse with an " +
    "authenticated session (see the project README, \"Cookies for Instagram/Facebook\" section).",
  errorUnsupportedPlatform:
    "Couldn't recognize that link — make sure it's a direct video link from YouTube, TikTok, Instagram, Facebook, Twitter/X, Vimeo, VK, Rutube, OK.ru, or Pinterest.",
  errorFormatUnavailable: "That quality isn't available for this video. Send the link again — I'll show the current list.",
  errorNoVideoContent: "This link doesn't have a video to download — the post appears to be photo-only.",
};

export const messages: Record<Lang, Messages> = { ru, en };
