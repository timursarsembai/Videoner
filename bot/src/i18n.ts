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
  errorRateLimited: string;
  subscribeIntro: string;
  subscribeMonthlyButton: string;
  subscribeYearlyButton: string;
  subMonthlyInvoiceTitle: string;
  subMonthlyInvoiceDescription: string;
  subMonthlyInvoiceLabel: string;
  subYearlyInvoiceTitle: string;
  subYearlyInvoiceDescription: string;
  subYearlyInvoiceLabel: string;
  subMonthlyPrompt: string;
  payButton: string;
  subscriptionActivated: (untilDate: string, isMonthly: boolean) => string;
  subscriptionActivationFailed: string;
}

const ru: Messages = {
  start: "Привет! Пришли мне ссылку на видео из YouTube, TikTok, Instagram, Facebook, Twitter/X, Vimeo, VK, Rutube, OK.ru или Pinterest — я помогу его скачать.\n\nКоманда /subscribe — оформить подписку без лимитов и доплат за HD.",
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
  errorRateLimited: "Слишком много ссылок подряд — подожди немного и пришли снова.",
  subscribeIntro:
    "🌟 Подписка Videoner снимает дневной лимит и убирает оплату за HD-качество.\n\n" +
    "📅 Месячная — 150⭐ (~$3), автопродление каждые 30 дней\n" +
    "🎉 Годовая — 1500⭐ (~$30), разовая оплата на 365 дней, экономия ~$6 к месячной\n\n" +
    "Выбери вариант:",
  subscribeMonthlyButton: "📅 Месяц — 150⭐",
  subscribeYearlyButton: "🎉 Год — 1500⭐",
  subMonthlyInvoiceTitle: "Месячная подписка Videoner",
  subMonthlyInvoiceDescription: "Безлимитные скачивания и бесплатное HD на 30 дней, с автопродлением.",
  subMonthlyInvoiceLabel: "Месячная подписка",
  subYearlyInvoiceTitle: "Годовая подписка Videoner",
  subYearlyInvoiceDescription: "Безлимитные скачивания и бесплатное HD на 365 дней. Разовая оплата, без автопродления.",
  subYearlyInvoiceLabel: "Годовая подписка",
  subMonthlyPrompt: "Нажми, чтобы оформить подписку с автопродлением каждые 30 дней:",
  payButton: "💳 Оплатить",
  subscriptionActivated: (untilDate, isMonthly) =>
    `✅ Подписка активна до ${untilDate}.\n\n` +
    (isMonthly
      ? "Она продлится автоматически — списание раз в 30 дней. Отменить можно в Telegram: Настройки → Telegram Stars → Мои подписки."
      : "Она не продлится автоматически — за пару дней до конца я напомню оформить новую через /subscribe."),
  subscriptionActivationFailed:
    "✅ Оплата прошла, но не получилось сохранить статус подписки на сервере. Напиши админу — он включит вручную.",
};

const en: Messages = {
  start: "Hi! Send me a link to a video from YouTube, TikTok, Instagram, Facebook, Twitter/X, Vimeo, VK, Rutube, OK.ru, or Pinterest — I'll help you download it.\n\nUse /subscribe to remove the limit and HD charge.",
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
  errorRateLimited: "Too many links in a row — wait a bit and send it again.",
  subscribeIntro:
    "🌟 A Videoner subscription removes the daily limit and the HD-quality charge.\n\n" +
    "📅 Monthly — 150⭐ (~$3), auto-renews every 30 days\n" +
    "🎉 Yearly — 1500⭐ (~$30), one-time payment for 365 days, saves ~$6 vs monthly\n\n" +
    "Pick one:",
  subscribeMonthlyButton: "📅 Month — 150⭐",
  subscribeYearlyButton: "🎉 Year — 1500⭐",
  subMonthlyInvoiceTitle: "Videoner monthly subscription",
  subMonthlyInvoiceDescription: "Unlimited downloads and free HD for 30 days, auto-renewing.",
  subMonthlyInvoiceLabel: "Monthly subscription",
  subYearlyInvoiceTitle: "Videoner yearly subscription",
  subYearlyInvoiceDescription: "Unlimited downloads and free HD for 365 days. One-time payment, no auto-renewal.",
  subYearlyInvoiceLabel: "Yearly subscription",
  subMonthlyPrompt: "Tap to subscribe — auto-renews every 30 days:",
  payButton: "💳 Pay",
  subscriptionActivated: (untilDate, isMonthly) =>
    `✅ Subscription active until ${untilDate}.\n\n` +
    (isMonthly
      ? "It renews automatically — charged every 30 days. Cancel anytime in Telegram: Settings → Telegram Stars → My Subscriptions."
      : "It won't auto-renew — I'll remind you a few days before it ends to grab a new one via /subscribe."),
  subscriptionActivationFailed:
    "✅ Payment went through, but saving your subscription status failed. Message the admin — they'll enable it manually.",
};

export const messages: Record<Lang, Messages> = { ru, en };
