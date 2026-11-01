import { clip, splitTitle } from "./caption.js";

export type Lang = "ru" | "uk" | "kk" | "en" | "ar" | "zh" | "hi" | "id" | "sw" | "de" | "fr" | "it" | "pt" | "es" | "uz" | "tr" | "fa" | "vi" | "bn" | "ur" | "pl" | "ja" | "ko" | "th" | "tl" | "am" | "om" | "ha" | "so" | "az" | "ky" | "tg" | "ms" | "nl" | "ro" | "ps" | "ckb";

export function detectLang(languageCode?: string): Lang {
  const code = languageCode?.toLowerCase().split("-")[0];
  // «in» — старый код индонезийского, некоторые клиенты шлют его до сих пор;
  // «fil» — филиппинский (тагальский), так его называют браузеры и часть клиентов.
  const base = code === "in" ? "id" : code === "fil" ? "tl" : code;
  return isLang(base) ? base : "en";
}

// Канал новостей проекта: ссылка на него — в подписи к каждому файлу
// (fileCaption), туда же уходят статьи блога (blog-channel.ts).
export const NEWS_CHANNEL = "@videonerdownload";

// Языки, которые можно выбрать вручную (/language), в порядке кнопок: по названию
// языка на нём самом — латиница по алфавиту, затем кириллица, затем остальные.
// Тот же порядок на сайте (web LANGUAGES) и в расширении (shared.js LANG_NAMES).
export const LANGS: Lang[] = ["om", "az", "id", "ms", "de", "en", "es", "fr", "ha", "it", "sw", "nl", "uz", "pl", "pt", "ro", "so", "tl", "vi", "tr", "kk", "ky", "ru", "tg", "uk", "ar", "ur", "fa", "ps", "ckb", "hi", "bn", "th", "am", "zh", "ja", "ko"];
// Название языка на нём самом — так его узнает и тот, кто других не читает.
export const LANGUAGE_NAMES: Record<Lang, string> = { ru: "Русский", uk: "Українська", kk: "Қазақша", en: "English", ar: "العربية", zh: "中文", hi: "हिन्दी", id: "Bahasa Indonesia", sw: "Kiswahili", de: "Deutsch", fr: "Français", it: "Italiano", pt: "Português", es: "Español", uz: "Oʻzbekcha", tr: "Türkçe", fa: "فارسی", vi: "Tiếng Việt", bn: "বাংলা", ur: "اردو", pl: "Polski", ja: "日本語", ko: "한국어", th: "ไทย", tl: "Tagalog", am: "አማርኛ", om: "Afaan Oromoo", ha: "Hausa", so: "Soomaali", az: "Azərbaycanca", ky: "Кыргызча", tg: "Тоҷикӣ", ms: "Bahasa Melayu", nl: "Nederlands", ro: "Română", ps: "پښتو", ckb: "کوردی (سۆرانی)" };

export function isLang(value: unknown): value is Lang {
  return typeof value === "string" && (LANGS as string[]).includes(value);
}

// Путь страниц сайта на этом языке: английский — без префикса.
export function sitePath(lang: Lang, path: string): string {
  return lang === "en" ? path : `/${lang}${path}`;
}

interface Messages {
  start: string;
  notLink: string;
  // Приход по ссылке-приглашению (handlers/invite.ts).
  inviteGreeting: string;
  inviteNotFound: string;
  inviteUnavailable: string;
  fetchingInfo: string;
  audioOnlyButton: string;
  photoButton: string;
  // Пост из нескольких фото: видео-слайдшоу без звука и «всё вместе».
  slideshowButton: string;
  galleryButton: string;
  chooseQuality: (title: string, duration: string) => string;
  sessionExpired: string;
  downloading: string;
  downloadFailed: string;
  downloadTimeout: string;
  downloadProgress: (percent: number, eta: string, done: string) => string;
  downloadFinishing: string;
  converting: (percent: number) => string;
  etaUnderMinute: string;
  etaMinutes: (minutes: number) => string;
  etaHours: (hours: number, minutes: number) => string;
  downloadInterrupted: string;
  fileTooBig: (mb: string, url: string) => string;
  sendingFile: string;
  sendingAlbum: (count: number) => string;
  failedPrefix: string;
  fileCaption: (title: string, sourceUrl: string, shareUrl?: string, description?: string) => string;
  // Инлайн-режим: «@бот <ссылка>» в любом чате (см. handlers/inline.ts).
  inlineHintButton: string;
  inlineResultTitle: string;
  inlineResultDescription: string;
  inlinePlaceholder: string;
  inlineOpenBot: string;
  inlineOnlySingleVideo: string;
  inlineSubscribeRequired: (channel: string) => string;
  inlineRateLimited: string;
  subscribeRequired: (channel: string) => string;
  openChannelButton: string;
  checkSubscriptionButton: string;
  subscribeThanks: string;
  subscribeThanksResuming: string;
  subscribeStillMissing: string;
  channelNotice: (channel: string) => string;
  channelPost: (title: string, url: string) => string;
  errorFileTooLarge: string;
  // Файл тяжелее предела Telegram: кнопка на сайт (и extensionButton).
  siteButton: string;
  qualitiesHiddenBySize: (limit: string) => string;
  videoTooBigForTelegram: (smallest: string) => string;
  errorLoginRequired: string;
  // Сторис Instagram: их видно только вошедшим, сервер их не получит.
  errorInstagramStory: string;
  errorStoryNeedsId: string;
  errorUnsupportedPlatform: string;
  errorFormatUnavailable: string;
  errorNoVideoContent: string;
  errorRegionBlocked: string;
  errorRateLimited: string;
  // Суточный лимит трафика YouTube на человека (server enforceYoutubeTrafficForBotUser).
  errorYoutubeDailyLimit: (gb: number) => string;
  // Плейлист остановлен из-за этого лимита; dropped — сколько видео не скачано.
  playlistStoppedByLimit: (dropped: number) => string;
  errorPlatformRefused: string;
  errorThreadsNoMedia: string;
  // Площадка не отдала ролик серверу, а расширение для браузера скачает его
  // под входом человека (см. extensionLinkFor в helpers.ts).
  extensionHint: string;
  // Закрытая запись, а к площадке можно подключить свой аккаунт
  // (handlers/download.ts failureMessage). withExtension — есть ещё и кнопка
  // расширения.
  privateConnectHint: (platform: string, withExtension: boolean) => string;
  // Аккаунт этой площадки уже подключён, а запись всё равно не открылась.
  privateReconnectHint: (platform: string, withExtension: boolean) => string;
  connectAccountButton: string;
  reconnectAccountButton: string;
  extensionButton: string;
  // Команда /extension (меню бота).
  extensionCommand: string;
  extensionPageButton: string;
  // Режим для групп (handlers/group.ts): приветствие при добавлении в группу
  // и ответ на /start там же.
  groupWelcome: string;
  // Кнопка под /start в личке: добавить бота в группу (t.me/<бот>?startgroup).
  addToGroupButton: string;
  // Кнопка под /start: канал новостей проекта.
  newsButton: string;
  // Настройки группы (/settings, handlers/group.ts).
  fileCaptionShort: (title: string, sourceUrl: string) => string;
  sentBy: (name: string) => string;
  groupSettings: (
    s: {
      deleteLinks: boolean;
      caption: string;
      quality: string;
      longVideos: boolean;
      cookiesBy: string;
      language: string | null;
    },
    canDelete: boolean,
  ) => string;
  settingsDeleteButton: (on: boolean) => string;
  settingsCaptionButton: (style: string) => string;
  settingsQualityButton: (mode: string) => string;
  settingsLongButton: (on: boolean) => string;
  settingsDoneButton: string;
  settingsAdminsOnly: string;
  settingsGroupsOnly: string;
  settingsFailed: string;
  settingsCookiesButton: (by: string) => string;
  // Подключённые аккаунты (куки людей): handlers/accounts.ts.
  accountsIntro: string;
  accountsHowTo: string;
  accountsWarning: string;
  accountsNone: string;
  accountsGroupTitle: string;
  accountsGroupHowTo: string;
  accountsLine: (platform: string, where: string, active: boolean) => string;
  accountsGroupLine: (platform: string, owner: string, active: boolean) => string;
  accountsWhereHere: string;
  accountsWhereGroup: (title: string) => string;
  accountsDeleteButton: (platform: string, where: string) => string;
  accountsDeleteAllButton: string;
  accountsDeleted: string;
  accountsDeletedAll: (n: number) => string;
  accountsNotAllowed: string;
  connectUsage: string;
  connectOnlyAdmins: string;
  connectDone: (platform: string, where: string) => string;
  connectWhereGroup: string;
  connectWhereHere: string;
  connectCodeNotFound: string;
  connectRejectedNoSession: string;
  connectRejectedUnknown: string;
  connectUnavailable: string;
  connectFailed: string;
  connectFileTooBig: string;
  connectNotAnonymous: string;
  connectCodeInGroup: string;
  errorTooLong: string;
  errorUnknown: string;
  // Очередь ссылок (см. queue.ts): выбор качества — только у текущей.
  queueRest: (count: number) => string;
  queuedOne: (position: number) => string;
  queuedMany: (added: number, waiting: number) => string;
  queueDuplicates: (count: number) => string;
  queueFull: (limit: number, rejected: number) => string;
  skipButton: string;
  skipped: string;
  chooseTimedOut: string;
  queueLostOnRestart: (count: number) => string;
  // Субтитры YouTube (см. subtitles.ts).
  subtitlesButton: string;
  subtitlesBack: string;
  subtitlesAuto: string;
  subtitlesChoose: string;
  subtitlesPreparing: string;
  subtitlesFailed: string;
  subtitlesBusy: string;
  // Плейлисты YouTube и остановка (handlers/download.ts).
  playlistFound: (title: string, count: number) => string;
  playlistStdButton: string;
  playlistHdButton: string;
  playlistAudioButton: string;
  playlistNoButton: string;
  playlistQueued: (count: number) => string;
  playlistFailed: string;
  stopButton: string;
  stopped: (dropped: number) => string;
  nothingToStop: string;
  // Выбор языка (handlers/language.ts).
  languageChoose: string;
  languageChooseGroup: string;
  languageAuto: string;
  languageAutoGroup: string;
  languageSaved: (name: string) => string;
  languageSavedAuto: string;
  settingsLanguageButton: (name: string | null) => string;
  settingsBack: string;
}

function langName(code: string): string {
  return isLang(code) ? LANGUAGE_NAMES[code] : code;
}

// Необязательные строки подписи (канал новостей, «Поделиться») — только если
// влезают в лимит подписи Telegram (1024 символа): ссылка на источник не
// обрезается и бывает очень длинной, и из-за необязательной строки файл не
// должен перестать отправляться. Каждая следующая добавляется, только если
// влезли предыдущие.
const CAPTION_LIMIT = 1024;
function withOptionalLines(caption: string, newsLine: string, shareLine: string | undefined): string {
  let out = caption;
  for (const [line, sep] of [
    [newsLine, "\n"],
    [shareLine, "\n\n"],
  ] as const) {
    if (!line) continue;
    if (`${out}${sep}${line}`.length > CAPTION_LIMIT) break;
    out = `${out}${sep}${line}`;
  }
  return out;
}

// Подпись к файлу: 🎬 название, текст поста (caption.ts), основная часть
// (источник, права, бот), затем необязательные строки. Текст поста — сколько
// влезет, но не больше DESCRIPTION_MAX: подпись не должна превращаться в
// простыню, а строка канала новостей — терять место.
const DESCRIPTION_MAX = 600;
function composeCaption(
  title: string,
  description: string | undefined,
  body: string,
  newsLine: string,
  shareLine: string | undefined,
): string {
  const { head, extra } = splitTitle(title, description);
  const headText = head ? `🎬 ${clip(head, 200)}` : "";
  const base = [headText, body].filter(Boolean).join("\n\n");
  const room = CAPTION_LIMIT - base.length - 2 - (newsLine.length + 1);
  const desc = extra ? clip(extra, Math.min(room, DESCRIPTION_MAX)) : "";
  return withOptionalLines([headText, desc, body].filter(Boolean).join("\n\n"), newsLine, shareLine);
}

const ru: Messages = {
  start: "Привет! Пришли мне ссылку на видео из YouTube, TikTok, Instagram, Facebook, Twitter/X, Vimeo, VK, Rutube, OK.ru, Pinterest или Threads — я помогу его скачать.\n\n✨ Качество ничем не ограничено: отдам всё, что есть у площадки, вплоть до 4K — лишь бы файл уложился в 2 ГБ, больше Telegram боту отправить не даёт. Платных функций тут нет вовсе.\n\nПолностью бесплатно: без подписок, без рекламы, без встроенных покупок.\n\n🧩 Качаете на компьютере? Поставьте расширение для браузера — кнопка «Скачать» появится прямо на странице видео: videoner.download/ru/extension\n\n👥 Добавьте меня в группу — буду сам присылать видео по ссылкам, которые там публикуют.\n\n⚡ Без выбора качества: допишите после ссылки -audio — пришлю звук (mp3), -hd — видео в лучшем качестве.\n\n📣 Новости проекта: @videonerdownload\n\n🌐 Язык бота: /language",
  notLink: "Это не похоже на ссылку. Пришли ссылку на видео.",
  inviteGreeting: "Привет! Я Videoner — бесплатно скачиваю видео из YouTube, TikTok, Instagram и других площадок. Сейчас подготовлю видео, которым с тобой поделились 👇",
  inviteNotFound: "Не нашёл видео по этой ссылке-приглашению. Пришли мне ссылку на видео — и я его скачаю.",
  inviteUnavailable: "Не получилось открыть видео по ссылке — сервис сейчас не отвечает. Открой ту же ссылку ещё раз через минуту.",
  fetchingInfo: "🔍 Получаю информацию о видео...",
  audioOnlyButton: "🎵 Только аудио (mp3)",
  photoButton: "📷 Скачать фото",
  slideshowButton: "🎞 Слайдшоу (видео)",
  galleryButton: "📷+🎞 Фото и слайдшоу",
  chooseQuality: (title, duration) => `«${title}»${duration ? `\n⏱ ${duration}` : ""}\n\nВыбери качество:`,
  sessionExpired: "Сессия устарела — пришли ссылку ещё раз",
  downloading: "⏬ Скачиваю, это может занять пару минут...",
  downloadFailed: "загрузка завершилась ошибкой",
  downloadProgress: (percent, eta, done) =>
    `⏬ Скачиваю: ${percent}%${eta ? ` · осталось ${eta}` : ""}${done ? `\n${done}` : ""}`,
  downloadFinishing: "⚙️ Почти готово — собираю файл...",
  converting: (percent) => `⚙️ Конвертирую: ${percent}%`,
  etaUnderMinute: "меньше минуты",
  etaMinutes: (minutes) => `~${minutes} мин`,
  etaHours: (hours, minutes) => `~${hours} ч${minutes ? ` ${minutes} мин` : ""}`,
  downloadTimeout: "загрузка идёт слишком долго — видео, похоже, очень тяжёлое. Попробуй качество пониже.",
  downloadInterrupted: "⚠️ Бот обновляется и должен перезапуститься — скачивание прервано. Пришли ссылку ещё раз через минуту.",
  fileTooBig: (mb, url) =>
    `Файл получился большим (${mb} МБ) — Telegram не даст боту его отправить.\nСкачай по ссылке: ${url}`,
  sendingFile: "📤 Отправляю файл...",
  sendingAlbum: (count) => `📤 В посте несколько файлов (${count}) — отправляю альбомом...`,
  failedPrefix: "❌ Не получилось: ",
  // Подпись прикрепляется к самому файлу, поэтому уезжает вместе с ним при
  // пересылке — ради этого всё и делается. Заголовок подрезаем: у подписи в
  // Telegram лимит 1024 символа, а название ролика бывает на пол-экрана.
  // shareUrl — ссылка-приглашение: кто её откроет, сразу получит этот же
  // ролик в боте (handlers/invite.ts).
  fileCaption: (title, sourceUrl, shareUrl, description) =>
    composeCaption(
      title,
      description,
      `Источник: ${sourceUrl}\n` +
        "Права на видео принадлежат его автору.\n" +
        "Скачано бесплатно через @VideonerBot",
      `📣 Новости проекта: ${NEWS_CHANNEL}`,
      shareUrl && `🔗 Поделиться: ${shareUrl}`,
    ),
  subscribeRequired: (channel) =>
    `Чтобы скачивать, подпишитесь на наш канал ${channel} — это единственное условие, сервис остаётся бесплатным.\n\n` +
    "Подпишитесь и нажмите «Я подписался».",
  openChannelButton: "📣 Открыть канал",
  checkSubscriptionButton: "Я подписался",
  subscribeThanks: "Спасибо! Теперь пришлите ссылку на видео.",
  subscribeThanksResuming: "Спасибо! Продолжаю с вашей ссылкой.",
  subscribeStillMissing: "Подписка пока не видна. Подпишитесь и нажмите ещё раз.",
  channelNotice: (channel) => `\n\nСсылка на этот пост появится в канале ${channel} — анонимно, без вашего имени.`,
  channelPost: (title, url) =>
    (title ? `🎬 ${title.slice(0, 200)}\n\n` : "") +
    `${url}\n\n` +
    "Скачать это и любое другое видео бесплатно: @VideonerBot",
  errorStoryNeedsId:
    "пришлите ссылку на конкретную сторис: в приложении Instagram откройте её и нажмите «Поделиться» → «Копировать ссылку».",
  errorInstagramStory:
    "сторис Instagram видны только тем, кто вошёл в аккаунт.",
  errorLoginRequired:
    "Эта запись недоступна без входа в аккаунт: площадка отдаёт её только " +
    "авторизованным. Так бывает с приватными записями, возрастными ограничениями " +
    "и постами для ограниченного круга.\n\n" +
    "Публичные записи скачиваются без проблем — попробуйте другую ссылку.",
  errorUnsupportedPlatform:
    "Не распознал ссылку — проверь, что это прямая ссылка на видео с YouTube, TikTok, Instagram, Facebook, Twitter/X, Vimeo, VK, Rutube, OK.ru, Pinterest или Threads.",
  errorFileTooLarge: "файл получился тяжелее 2 ГБ — больше Telegram не даёт ботам отправлять. Скачайте его на сайте или через расширение для браузера — кнопки ниже. Или пришлите ссылку ещё раз и выберите качество пониже.",
  siteButton: "🌐 Скачать на сайте",
  qualitiesHiddenBySize: (limit) =>
    `\n\n⚖️ Качества тяжелее ${limit} не показаны: файлы больше Telegram не даёт ботам отправлять. Их можно скачать на сайте или через расширение для браузера — кнопки ниже.`,
  videoTooBigForTelegram: (smallest) =>
    `\n\n⚖️ Видео слишком тяжёлое для Telegram даже в самом низком качестве (~${smallest}): больше 2 ГБ Telegram не даёт ботам отправлять. Здесь можно скачать только звук, а видео — на сайте или через расширение для браузера (кнопки ниже).`,
  errorFormatUnavailable: "Для этого видео нет такого качества. Пришли ссылку ещё раз — покажу актуальный список.",
  errorNoVideoContent: "По этой ссылке нет видео для скачивания — похоже, пост содержит только фото.",
  errorRegionBlocked:
    "Это видео закрыто для просмотра за пределами страны автора — площадка не " +
    "отдаёт его нашему серверу. Обойти это нельзя: ограничение стоит на стороне " +
    "площадки.\n\nОстальные ссылки скачиваются как обычно.",
  errorRateLimited: "Слишком много ссылок подряд — подожди немного и пришли снова.",
  errorYoutubeDailyLimit: (gb) => `за последние сутки вы скачали с YouTube больше ${gb} ГБ — это суточный лимит бота на человека. Лимит считается за последние 24 часа: новые видео с YouTube можно будет скачать позже. Другие площадки работают как обычно.`,
  playlistStoppedByLimit: (dropped) => `⏹ Плейлист остановлен: достигнут суточный лимит YouTube. Не скачано видео: ${dropped}. Пришлите ссылку на плейлист позже.`,
  errorPlatformRefused:
    "площадка не отдала это видео нашему серверу. Так бывает с закрытыми и " +
    "возрастными публикациями, а иногда площадка просто временно ограничивает " +
    "доступ. Попробуй ещё раз через несколько минут.",
  errorThreadsNoMedia:
    "в этом посте Threads не видно ни видео, ни фото. Либо это текстовый пост, либо " +
    "Threads показывает его медиа только тем, кто вошёл в аккаунт, — такие посты без входа скачать нельзя.",
  extensionHint:
    "\n\n💻 Такое видео можно скачать расширением Videoner для браузера на компьютере: " +
    "оно качает под вашим входом на площадке, пароль и куки никуда не передаются.",
  privateConnectHint: (platform, withExtension) =>
    `\n\n🔑 Чтобы скачать такую запись, подключите к боту свой аккаунт ${platform} — один раз. Дальше бот сам скачивает то, что видно вам: закрытые посты, рилсы и сторис, в том числе с телефона. Кнопка ниже покажет, как это сделать.${withExtension ? "\n\n💻 Или скачайте эту запись расширением Videoner для браузера на компьютере." : ""}`,
  privateReconnectHint: (platform, withExtension) =>
    `\n\n⚠️ Ваш подключённый аккаунт ${platform} не открыл эту запись. Возможно, вход перестал работать — подключите аккаунт заново. Или у этого аккаунта нет доступа к записи.${withExtension ? "\n\n💻 Можно также скачать её расширением Videoner для браузера на компьютере." : ""}`,
  connectAccountButton: "🔑 Подключить аккаунт",
  reconnectAccountButton: "🔑 Подключить заново",
  extensionButton: "🧩 Скачать через расширение",
  extensionCommand:
    "🧩 Videoner для браузера: кнопка «Скачать» прямо на странице видео — YouTube, Instagram, TikTok, VK, закрытые видео из вашего аккаунта и уроки GetCourse.\n\nДля Chrome, Яндекс Браузера, Edge, Opera и Firefox на компьютере.",
  extensionPageButton: "🧩 Установить расширение",
  addToGroupButton: "👥 Добавить в группу",
  newsButton: "📣 Новости проекта",
  fileCaptionShort: (title, sourceUrl) =>
    withOptionalLines((title ? `🎬 ${title.slice(0, 200)}\n\n` : "") + sourceUrl, `📣 Новости проекта: ${NEWS_CHANNEL}`, undefined),
  sentBy: (name) => `👤 ${name}`,
  groupSettings: (s, canDelete) =>
    "⚙️ Настройки бота в этой группе\n\n" +
    `🗑 Удалять сообщение со ссылкой: ${s.deleteLinks ? "да" : "нет"}\n` +
    "Когда видео отправлено, сообщение, где была только ссылка, удаляется — в чате остаётся одно видео с именем того, кто его прислал.\n" +
    (s.deleteLinks && !canDelete
      ? "⚠️ Сейчас я не могу удалять сообщения: сделайте меня администратором с правом «Удаление сообщений».\n"
      : "") +
    `\n✍️ Подпись под видео: ${{ full: "полная", short: "название и источник", none: "без подписи" }[s.caption] ?? s.caption}\n` +
    `\n🎞 Качество: ${s.quality === "max" ? "максимальное, которое пропускает Telegram" : "обычное (720p)"}\n` +
    `\n⏱ Длинные видео: ${s.longVideos ? "качаю любой длины" : "только до 15 минут"}\n` +
    `\n🔑 Подключать свои аккаунты (для сторис и закрытых записей): ${s.cookiesBy === "all" ? "любой участник" : "только администраторы"}\n` +
    `\n🌐 Язык ответов: ${s.language ? langName(s.language) : "каждому — на его языке"}\n` +
    "\nМенять настройки могут только администраторы группы.",
  settingsDeleteButton: (on) => `🗑 Удалять ссылки: ${on ? "да" : "нет"}`,
  settingsCaptionButton: (style) =>
    `✍️ Подпись: ${{ full: "полная", short: "короткая", none: "нет" }[style] ?? style}`,
  settingsQualityButton: (mode) => `🎞 Качество: ${mode === "max" ? "максимальное" : "720p"}`,
  settingsLongButton: (on) => `⏱ Длинные видео: ${on ? "да" : "до 15 мин"}`,
  settingsDoneButton: "✅ Готово",
  settingsAdminsOnly: "Настройки меняют только администраторы группы.",
  settingsGroupsOnly: "Настройки — для групп: добавьте меня в группу и отправьте там /settings.",
  settingsFailed: "Не получилось сохранить настройки, попробуйте ещё раз.",
  settingsCookiesButton: (by) => `🔑 Подключать аккаунты: ${by === "all" ? "все" : "админы"}`,
  accountsIntro:
    "🔑 Подключённые аккаунты\n\nБот может скачивать то, что видно только вошедшим (сторис Instagram, закрытые записи), — от вашего аккаунта. Вход работает там, куда вы его подключили: в личке — для ваших скачиваний, и в группах — для ваших собственных ссылок, если к группе свой аккаунт не подключён. Подключённый к группе — для всех её участников.",
  accountsHowTo:
    "Как подключить:\n1. Проще всего — расширение Videoner на компьютере: войдите на сайт площадки, откройте окошко Videoner, нажмите «Подключить аккаунт» и пришлите мне код. Для группы — отправьте в группе /connect КОД.\n2. Или пришлите мне файл cookies.txt (экспорт кук из браузера) — или вставьте его текст сообщением.\n3. С телефона Android — через Firefox и дополнение Cookie-Editor: https://videoner.download/ru/blog/android-firefox",
  accountsWarning:
    "⚠️ Площадки не любят автоматические скачивания и могут ограничить или заблокировать аккаунт. Лучше подключать отдельный, не основной аккаунт. Куки хранятся зашифрованными, используются только для скачиваний и удаляются кнопкой ниже.",
  accountsNone: "Пока ничего не подключено.",
  accountsGroupTitle: "🔑 Аккаунты, подключённые к этой группе",
  accountsGroupHowTo:
    "Подключить для всей группы: получите код кнопкой «Подключить аккаунт» в расширении Videoner и отправьте здесь /connect КОД. Если аккаунт подключён только у вас в личке, бот скачает им ваши собственные ссылки и здесь. Свои подключения — в личке у @VideonerBot: /accounts.",
  accountsLine: (platform, where, active) => `• ${platform} — ${where}${active ? "" : " (⚠️ вход не работает)"}`,
  accountsGroupLine: (platform, owner, active) => `• ${platform} — ${owner}${active ? "" : " (⚠️ вход не работает)"}`,
  accountsWhereHere: "в личке",
  accountsWhereGroup: (title) => `группа «${title}»`,
  accountsDeleteButton: (platform, where) => `🗑 ${platform} · ${where}`,
  accountsDeleteAllButton: "🗑 Удалить все мои подключения",
  accountsDeleted: "Удалено.",
  accountsDeletedAll: (n) => `Удалено подключений: ${n}.`,
  accountsNotAllowed: "Удалить может только тот, кто подключил, или администратор группы.",
  connectUsage:
    "Отправьте /connect КОД. Код даёт кнопка «Подключить аккаунт» в расширении Videoner на компьютере. Список подключений — /accounts.",
  connectOnlyAdmins: "Подключать аккаунты к этой группе могут только администраторы (настройка в /settings).",
  connectDone: (platform, where) =>
    `✅ ${platform} подключён ${where}. Теперь бот скачивает и то, что видно только вошедшим. Посмотреть или удалить — /accounts.\n\n⚠️ Площадка может ограничить аккаунт за автоматические скачивания — лучше подключать не основной.`,
  connectWhereGroup: "к этой группе",
  connectWhereHere: "для ваших скачиваний в личке и инлайн-режиме",
  connectCodeNotFound: "Код не найден или уже устарел (он живёт 10 минут). Получите новый в расширении Videoner.",
  connectRejectedNoSession: "В этих куках нет входа в аккаунт. Войдите на сайте площадки и выгрузите куки заново.",
  connectRejectedUnknown: "Не нашёл куки поддерживаемых площадок: Instagram, Facebook, YouTube, X, VK, TikTok.",
  connectUnavailable: "Подключение аккаунтов пока недоступно.",
  connectFailed: "Не получилось подключить, попробуйте ещё раз.",
  connectFileTooBig: "Файл слишком большой — выгрузите куки только нужного сайта.",
  connectNotAnonymous: "Подключайте аккаунт от своего имени, а не анонимно от имени группы: иначе подключения админов перепутаются. Код я уничтожил — получите новый.",
  connectCodeInGroup:
    "Код подключения в общем чате могут подсмотреть — я его уничтожил и убрал сообщение. Получите новый и отправьте командой /connect КОД: сообщение с командой я удаляю сразу.",
  groupWelcome:
    "👋 Привет! Присылайте в чат ссылки на видео из TikTok, Instagram, YouTube, VK и других площадок — я отвечу самим видео.\n\n" +
    "Ролики до 15 минут скачиваю сам, без команд. На остальные сообщения не отвечаю.\n\n⚙️ Админы группы могут настроить меня командой /settings: удалять сообщения со ссылками, вид подписи, качество, длинные видео и язык.\n\n⚡ После ссылки можно дописать -audio — пришлю звук, -hd — лучшее качество.\n\n📣 Новости проекта: @videonerdownload",
  errorTooLong: "видео слишком длинное — такие мы пока не скачиваем.",
  errorUnknown: "не удалось скачать это видео. Попробуй ещё раз чуть позже или пришли другую ссылку.",
  inlineHintButton: "Отправьте ссылку боту",
  inlineResultTitle: "⬇️ Скачать видео",
  inlineResultDescription: "Видео придёт прямо в этот чат",
  inlinePlaceholder: "⏬ Скачиваю видео, это может занять пару минут...",
  inlineOpenBot: "Открыть бота",
  inlineOnlySingleVideo:
    "В этом режиме отправляется одно видео. Пост из нескольких файлов или фотографии — пришлите ссылку боту в личные сообщения.",
  inlineSubscribeRequired: (channel: string) =>
    `Чтобы скачивать, подпишитесь на ${channel} и попробуйте снова.`,
  inlineRateLimited: "Слишком много запросов подряд. Подождите минуту и попробуйте снова.",
  queueRest: (count) => `\n\n📋 В очереди ещё ссылок: ${count}. Покажу их по одной, когда закончим с этой.`,
  queuedOne: (position) =>
    `📋 Ссылка в очереди, ${position}-я. Сначала закончим с текущей — потом покажу выбор качества для неё.`,
  queuedMany: (added, waiting) =>
    `📋 Добавил в очередь ссылок: ${added}. Всего ждут: ${waiting}. Покажу их по одной, когда закончим с текущей.`,
  queueDuplicates: (count) =>
    count === 1
      ? "Эта ссылка уже в очереди — второй раз не добавляю."
      : `Ссылки, которые уже в очереди, второй раз не добавляю (повторов: ${count}).`,
  queueFull: (limit, rejected) =>
    `В очереди может быть не больше ${limit} ссылок — лишние не добавил (${rejected}). Пришлите их, когда очередь продвинется.`,
  skipButton: "✖️ Не скачивать",
  skipped: "⏭ Эту ссылку пропустил.",
  chooseTimedOut: "⌛ Качество не выбрано за 30 минут — эту ссылку пропускаю.",
  queueLostOnRestart: (count) =>
    `⚠️ Бот перезапускается для обновления — очередь сброшена (ссылок: ${count}). Пришлите их снова через минуту.`,
  subtitlesButton: "📝 Субтитры",
  subtitlesBack: "⬅️ Назад к качеству",
  subtitlesAuto: "авто",
  subtitlesChoose: "Выберите язык субтитров",
  subtitlesPreparing: "📝 Готовлю субтитры...",
  subtitlesFailed: "Не получилось скачать субтитры на этом языке. Попробуйте другой язык.",
  subtitlesBusy: "YouTube сейчас не отдаёт субтитры — попробуйте через несколько минут.",
  playlistFound: (title, count) =>
    `📃 Плейлист${title ? ` «${title.slice(0, 150)}»` : ""}: ${count} видео.\nСкачаю их по одному, по очереди. Как качать?`,
  playlistStdButton: "🎬 720p",
  playlistHdButton: "🎬 Лучшее качество",
  playlistAudioButton: "🎵 Только звук (mp3)",
  playlistNoButton: "✖️ Не надо",
  playlistQueued: (count) =>
    `📃 Поставил в очередь видео из плейлиста: ${count}. Пришлю по одному. Остановить — кнопкой ниже или командой /stop.`,
  playlistFailed: "Не получилось открыть плейлист — возможно, он закрытый. Пришлите ссылку на отдельное видео.",
  stopButton: "⏹ Остановить",
  stopped: (dropped) => `⏹ Остановил.${dropped ? ` Отменено ссылок в очереди: ${dropped}.` : ""}`,
  nothingToStop: "Сейчас ничего не скачивается.",
  languageChoose: "🌐 Выберите язык бота. «Авто» — как в вашем Telegram.",
  languageChooseGroup: "🌐 Язык ответов бота в этой группе. «Авто» — каждому на языке его Telegram.",
  languageAuto: "Авто — как в Telegram",
  languageAutoGroup: "Авто — каждому на его языке",
  languageSaved: (name) => `✅ Язык бота: ${name}. Сменить — /language.`,
  languageSavedAuto: "✅ Язык бота — как в вашем Telegram. Сменить — /language.",
  settingsLanguageButton: (name) => `🌐 Язык: ${name ?? "авто"}`,
  settingsBack: "⬅️ Назад к настройкам",
};

const en: Messages = {
  start: "Hi! Send me a link to a video from YouTube, TikTok, Instagram, Facebook, Twitter/X, Vimeo, VK, Rutube, OK.ru, Pinterest, or Threads — I'll help you download it.\n\n✨ No quality limits: you get whatever the platform offers, up to 4K — as long as the file fits in 2 GB, Telegram's limit for bots. There are no paid features here.\n\nCompletely free: no subscriptions, no ads, no in-app purchases.\n\n🧩 Downloading on a computer? Install the browser extension — a Download button appears right on the video page: videoner.download/extension\n\n👥 Add me to a group and I'll post the videos for the links people share there.\n\n⚡ Skip the quality choice: add -audio after the link for sound only (mp3), or -hd for the best quality.\n\n📣 Project news: @videonerdownload\n\n🌐 Bot language: /language",
  notLink: "That doesn't look like a link. Send me a video link.",
  inviteGreeting: "Hi! I'm Videoner — I download videos from YouTube, TikTok, Instagram and other platforms for free. Getting the video someone shared with you ready 👇",
  inviteNotFound: "I couldn't find a video for this invite link. Send me a video link and I'll download it.",
  inviteUnavailable: "I couldn't open the video from this link — the service isn't responding right now. Open the same link again in a minute.",
  fetchingInfo: "🔍 Fetching video info...",
  audioOnlyButton: "🎵 Audio only (mp3)",
  photoButton: "📷 Download photos",
  slideshowButton: "🎞 Slideshow (video)",
  galleryButton: "📷+🎞 Photos and slideshow",
  chooseQuality: (title, duration) => `"${title}"${duration ? `\n⏱ ${duration}` : ""}\n\nChoose quality:`,
  sessionExpired: "Session expired — send the link again",
  downloading: "⏬ Downloading, this may take a couple of minutes...",
  downloadFailed: "download failed",
  downloadProgress: (percent, eta, done) =>
    `⏬ Downloading: ${percent}%${eta ? ` · ${eta} left` : ""}${done ? `\n${done}` : ""}`,
  downloadFinishing: "⚙️ Almost done — putting the file together...",
  converting: (percent) => `⚙️ Converting: ${percent}%`,
  etaUnderMinute: "under a minute",
  etaMinutes: (minutes) => `~${minutes} min`,
  etaHours: (hours, minutes) => `~${hours} h${minutes ? ` ${minutes} min` : ""}`,
  downloadTimeout: "the download is taking too long — the video seems very heavy. Try a lower quality.",
  downloadInterrupted: "⚠️ The bot is restarting for an update — your download was interrupted. Please send the link again in a minute.",
  fileTooBig: (mb, url) =>
    `The file turned out large (${mb} MB) — Telegram won't let the bot send it.\nDownload it here: ${url}`,
  sendingFile: "📤 Sending file...",
  sendingAlbum: (count) => `📤 This post has several files (${count}) — sending them as an album...`,
  failedPrefix: "❌ Failed: ",
  fileCaption: (title, sourceUrl, shareUrl, description) =>
    composeCaption(
      title,
      description,
      `Source: ${sourceUrl}\n` +
        "All rights to the video belong to its author.\n" +
        "Downloaded for free with @VideonerBot",
      `📣 Project news: ${NEWS_CHANNEL}`,
      shareUrl && `🔗 Share: ${shareUrl}`,
    ),
  subscribeRequired: (channel) =>
    `To download, please subscribe to our channel ${channel} — that is the only condition, the service stays free.\n\n` +
    "Subscribe and press «I subscribed».",
  openChannelButton: "📣 Open the channel",
  checkSubscriptionButton: "I subscribed",
  subscribeThanks: "Thank you! Now send me a link to a video.",
  subscribeThanksResuming: "Thank you! Picking up your link now.",
  subscribeStillMissing: "I do not see the subscription yet. Subscribe and press again.",
  channelNotice: (channel) => `\n\nThe link to this post will appear in ${channel} — anonymously, without your name.`,
  channelPost: (title, url) =>
    (title ? `🎬 ${title.slice(0, 200)}\n\n` : "") +
    `${url}\n\n` +
    "Download this and any other video for free: @VideonerBot",
  errorStoryNeedsId:
    "send a link to a specific story: open it in the Instagram app and tap Share → Copy link.",
  errorInstagramStory:
    "Instagram stories are visible only to people who are signed in.",
  errorLoginRequired:
    "This post is not available without signing in: the platform serves it only to " +
    "logged-in users. That happens with private posts, age-restricted content and " +
    "posts shared with a limited audience.\n\n" +
    "Public posts download without trouble — try another link.",
  errorUnsupportedPlatform:
    "Couldn't recognize that link — make sure it's a direct video link from YouTube, TikTok, Instagram, Facebook, Twitter/X, Vimeo, VK, Rutube, OK.ru, Pinterest, or Threads.",
  errorFileTooLarge: "the file is larger than 2 GB — Telegram doesn't let bots send bigger files. Download it on the website or with the browser extension — buttons below. Or send the link again and pick a lower quality.",
  siteButton: "🌐 Download on the website",
  qualitiesHiddenBySize: (limit) =>
    `\n\n⚖️ Qualities heavier than ${limit} are hidden: Telegram doesn't let bots send larger files. You can download them on the website or with the browser extension — buttons below.`,
  videoTooBigForTelegram: (smallest) =>
    `\n\n⚖️ This video is too heavy for Telegram even in the lowest quality (~${smallest}): Telegram doesn't let bots send files over 2 GB. Here you can get the audio only; the video — on the website or with the browser extension (buttons below).`,
  errorFormatUnavailable: "That quality isn't available for this video. Send the link again — I'll show the current list.",
  errorNoVideoContent: "This link doesn't have a video to download — the post appears to be photo-only.",
  errorRegionBlocked:
    "This video is blocked outside the author's country — the platform won't serve " +
    "it to our server. There's no way around it: the restriction is on their side." +
    "\n\nOther links download as usual.",
  errorRateLimited: "Too many links in a row — wait a bit and send it again.",
  errorYoutubeDailyLimit: (gb) => `you downloaded more than ${gb} GB from YouTube in the last 24 hours — that is the bot's daily limit per person. It counts the last 24 hours, so you can download new YouTube videos a bit later. Other platforms work as usual.`,
  playlistStoppedByLimit: (dropped) => `⏹ Playlist stopped: the daily YouTube limit is reached. Videos not downloaded: ${dropped}. Send the playlist link again later.`,
  errorPlatformRefused:
    "the platform didn't give this video to our server. This happens with private " +
    "or age-restricted posts, and sometimes the platform just limits access for a " +
    "while. Try again in a few minutes.",
  errorThreadsNoMedia:
    "no video or photo is visible in this Threads post. Either it is a text-only post, or " +
    "Threads shows its media only to signed-in users — such posts can't be downloaded without logging in.",
  extensionHint:
    "\n\n💻 You can download it with the Videoner browser extension on a computer: " +
    "it downloads using your own sign-in on the platform, and no password or cookies leave your browser.",
  privateConnectHint: (platform, withExtension) =>
    `\n\n🔑 To download posts like this, connect your ${platform} account to the bot — once. After that the bot downloads whatever you can see: private posts, reels and stories, from your phone too. The button below shows how.${withExtension ? "\n\n💻 Or download it with the Videoner browser extension on a computer." : ""}`,
  privateReconnectHint: (platform, withExtension) =>
    `\n\n⚠️ Your connected ${platform} account couldn't open this post. The login may have stopped working — connect the account again. Or this account has no access to the post.${withExtension ? "\n\n💻 You can also download it with the Videoner browser extension on a computer." : ""}`,
  connectAccountButton: "🔑 Connect account",
  reconnectAccountButton: "🔑 Reconnect",
  extensionButton: "🧩 Download with the extension",
  extensionCommand:
    "🧩 Videoner for your browser: a Download button right on the video page — YouTube, Instagram, TikTok, VK, private videos from your account and GetCourse lessons.\n\nFor Chrome, Edge, Opera, Yandex Browser and Firefox on a computer.",
  extensionPageButton: "🧩 Install the extension",
  addToGroupButton: "👥 Add to a group",
  newsButton: "📣 Project news",
  fileCaptionShort: (title, sourceUrl) =>
    withOptionalLines((title ? `🎬 ${title.slice(0, 200)}\n\n` : "") + sourceUrl, `📣 Project news: ${NEWS_CHANNEL}`, undefined),
  sentBy: (name) => `👤 ${name}`,
  groupSettings: (s, canDelete) =>
    "⚙️ Bot settings for this group\n\n" +
    `🗑 Delete the message with the link: ${s.deleteLinks ? "yes" : "no"}\n` +
    "Once the video is sent, a message that contained only the link is deleted — the chat keeps just the video with the name of whoever shared it.\n" +
    (s.deleteLinks && !canDelete
      ? "⚠️ I can't delete messages right now: make me an admin with the \"Delete messages\" right.\n"
      : "") +
    `\n✍️ Caption under the video: ${{ full: "full", short: "title and source", none: "no caption" }[s.caption] ?? s.caption}\n` +
    `\n🎞 Quality: ${s.quality === "max" ? "the highest Telegram accepts" : "standard (720p)"}\n` +
    `\n⏱ Long videos: ${s.longVideos ? "any length" : "up to 15 minutes only"}\n` +
    `\n🔑 Who can connect their accounts (for stories and private posts): ${s.cookiesBy === "all" ? "any member" : "admins only"}\n` +
    `\n🌐 Reply language: ${s.language ? langName(s.language) : "each member's own"}\n` +
    "\nOnly group admins can change the settings.",
  settingsDeleteButton: (on) => `🗑 Delete links: ${on ? "yes" : "no"}`,
  settingsCaptionButton: (style) => `✍️ Caption: ${{ full: "full", short: "short", none: "none" }[style] ?? style}`,
  settingsQualityButton: (mode) => `🎞 Quality: ${mode === "max" ? "highest" : "720p"}`,
  settingsLongButton: (on) => `⏱ Long videos: ${on ? "yes" : "up to 15 min"}`,
  settingsDoneButton: "✅ Done",
  settingsAdminsOnly: "Only group admins can change the settings.",
  settingsGroupsOnly: "Settings are for groups: add me to a group and send /settings there.",
  settingsFailed: "Couldn't save the settings, please try again.",
  settingsCookiesButton: (by) => `🔑 Connecting accounts: ${by === "all" ? "everyone" : "admins"}`,
  accountsIntro:
    "🔑 Connected accounts\n\nThe bot can download what only signed-in people see (Instagram stories, private posts) — using your account. A login works where you connected it: one in the private chat serves your downloads, including your own links in groups that have no account of their own; one connected to a group serves all its members.",
  accountsHowTo:
    "How to connect:\n1. Easiest: the Videoner extension on a computer — sign in on the platform's site, open the Videoner popup, press \"Connect account\" and send me the code. For a group, send /connect CODE in that group.\n2. Or send me a cookies.txt file (cookies exported from the browser), or paste its text as a message.\n3. From an Android phone — with Firefox and the Cookie-Editor add-on: https://videoner.download/blog/android-firefox",
  accountsWarning:
    "⚠️ Platforms dislike automated downloads and may restrict or ban the account. Better connect a secondary account, not your main one. Cookies are stored encrypted, used only for downloads, and removed with the buttons below.",
  accountsNone: "Nothing is connected yet.",
  accountsGroupTitle: "🔑 Accounts connected to this group",
  accountsGroupHowTo:
    "To connect one for the whole group: get a code with the \"Connect account\" button in the Videoner extension and send /connect CODE here. If you connected an account only in your private chat, the bot uses it here for your own links. Your connections: /accounts in a private chat with @VideonerBot.",
  accountsLine: (platform, where, active) => `• ${platform} — ${where}${active ? "" : " (⚠️ login not working)"}`,
  accountsGroupLine: (platform, owner, active) => `• ${platform} — ${owner}${active ? "" : " (⚠️ login not working)"}`,
  accountsWhereHere: "private chat",
  accountsWhereGroup: (title) => `group "${title}"`,
  accountsDeleteButton: (platform, where) => `🗑 ${platform} · ${where}`,
  accountsDeleteAllButton: "🗑 Remove all my connections",
  accountsDeleted: "Removed.",
  accountsDeletedAll: (n) => `Connections removed: ${n}.`,
  accountsNotAllowed: "Only the person who connected it or a group admin can remove it.",
  connectUsage:
    "Send /connect CODE. The \"Connect account\" button in the Videoner extension on a computer gives you the code. Your connections: /accounts.",
  connectOnlyAdmins: "Only admins can connect accounts to this group (see /settings).",
  connectDone: (platform, where) =>
    `✅ ${platform} connected ${where}. The bot now also downloads what only signed-in people see. View or remove: /accounts.\n\n⚠️ The platform may restrict the account for automated downloads — better use a secondary one.`,
  connectWhereGroup: "to this group",
  connectWhereHere: "for your downloads in the private chat and inline mode",
  connectCodeNotFound: "Code not found or expired (codes live 10 minutes). Get a new one in the Videoner extension.",
  connectRejectedNoSession: "These cookies have no login. Sign in on the platform's site and export the cookies again.",
  connectRejectedUnknown: "No cookies of supported platforms found: Instagram, Facebook, YouTube, X, VK, TikTok.",
  connectUnavailable: "Connecting accounts isn't available yet.",
  connectFailed: "Couldn't connect, please try again.",
  connectFileTooBig: "The file is too large — export cookies of the needed site only.",
  connectNotAnonymous: "Connect the account as yourself, not anonymously as the group: otherwise admins' connections get mixed up. I destroyed the code — get a new one.",
  connectCodeInGroup:
    "A connection code posted in the group chat can be seen by others — I destroyed it and removed the message. Get a new one and send it with /connect CODE: I delete that command message right away.",
  groupWelcome:
    "👋 Hi! Post links to videos from TikTok, Instagram, YouTube, VK and other platforms in this chat — I'll reply with the video itself.\n\n" +
    "I download clips up to 15 minutes on my own, no commands needed, and stay quiet otherwise.\n\n⚙️ Group admins can tune me with /settings: delete link messages, caption style, quality, long videos and language.\n\n⚡ Add -audio after a link to get the sound, or -hd for the best quality.\n\n📣 Project news: @videonerdownload",
  errorTooLong: "the video is too long — we can't download videos that long yet.",
  errorUnknown: "couldn't download this video. Try again a bit later or send another link.",
  inlineHintButton: "Send a link to the bot",
  inlineResultTitle: "⬇️ Download video",
  inlineResultDescription: "The video will be posted right in this chat",
  inlinePlaceholder: "⏬ Downloading, this may take a couple of minutes...",
  inlineOpenBot: "Open the bot",
  inlineOnlySingleVideo:
    "This mode sends a single video. For multi-file posts or photos, send the link to the bot in a private chat.",
  inlineSubscribeRequired: (channel: string) =>
    `To download, subscribe to ${channel} and try again.`,
  inlineRateLimited: "Too many requests in a row. Wait a minute and try again.",
  queueRest: (count) => `\n\n📋 Links still in the queue: ${count}. I'll show them one by one after this one.`,
  queuedOne: (position) =>
    `📋 Link queued, #${position}. Let's finish the current one first — then I'll show the quality choice for it.`,
  queuedMany: (added, waiting) =>
    `📋 Added links to the queue: ${added}. Waiting in total: ${waiting}. I'll show them one by one after the current one.`,
  queueDuplicates: (count) =>
    count === 1
      ? "This link is already in the queue — not adding it twice."
      : `Links already in the queue are not added twice (repeats: ${count}).`,
  queueFull: (limit, rejected) =>
    `The queue holds at most ${limit} links — the extra ones were not added (${rejected}). Send them once the queue moves on.`,
  skipButton: "✖️ Don't download",
  skipped: "⏭ Skipped this link.",
  chooseTimedOut: "⌛ No quality chosen within 30 minutes — skipping this link.",
  queueLostOnRestart: (count) =>
    `⚠️ The bot is restarting for an update — the queue was reset (links: ${count}). Please send them again in a minute.`,
  subtitlesButton: "📝 Subtitles",
  subtitlesBack: "⬅️ Back to quality",
  subtitlesAuto: "auto",
  subtitlesChoose: "Choose the subtitle language",
  subtitlesPreparing: "📝 Preparing subtitles...",
  subtitlesFailed: "Couldn't download subtitles in this language. Try another language.",
  subtitlesBusy: "YouTube is not serving subtitles right now — try again in a few minutes.",
  playlistFound: (title, count) =>
    `📃 Playlist${title ? ` "${title.slice(0, 150)}"` : ""}: ${count} videos.\nI'll download them one by one. Which format?`,
  playlistStdButton: "🎬 720p",
  playlistHdButton: "🎬 Best quality",
  playlistAudioButton: "🎵 Audio only (mp3)",
  playlistNoButton: "✖️ No, thanks",
  playlistQueued: (count) =>
    `📃 Queued videos from the playlist: ${count}. I'll send them one by one. Stop with the button below or /stop.`,
  playlistFailed: "Couldn't open the playlist — it may be private. Send a link to a single video.",
  stopButton: "⏹ Stop",
  stopped: (dropped) => `⏹ Stopped.${dropped ? ` Links removed from the queue: ${dropped}.` : ""}`,
  nothingToStop: "Nothing is downloading right now.",
  languageChoose: "🌐 Choose the bot's language. \"Auto\" follows your Telegram.",
  languageChooseGroup: "🌐 The bot's reply language in this group. \"Auto\" — each member's Telegram language.",
  languageAuto: "Auto — as in Telegram",
  languageAutoGroup: "Auto — each member's own",
  languageSaved: (name) => `✅ Bot language: ${name}. Change it with /language.`,
  languageSavedAuto: "✅ The bot follows your Telegram language. Change it with /language.",
  settingsLanguageButton: (name) => `🌐 Language: ${name ?? "auto"}`,
  settingsBack: "⬅️ Back to settings",
};

const ar: Messages = {
  start: "مرحبًا! أرسل لي رابط فيديو من YouTube أو TikTok أو Instagram أو Facebook أو Twitter/X أو Vimeo أو VK أو Rutube أو OK.ru أو Pinterest أو Threads — وسأساعدك على تنزيله.\n\n✨ بلا قيود على الجودة: تحصل على ما تتيحه المنصة، حتى 4K — ما دام الملف لا يتجاوز 2 GB، وهو حد Telegram للبوتات. لا توجد هنا ميزات مدفوعة.\n\nمجاني تمامًا: بلا اشتراكات ولا إعلانات ولا مشتريات داخل التطبيق.\n\n🧩 تنزّل على الكمبيوتر؟ ثبّت إضافة المتصفح — سيظهر زر التنزيل مباشرة في صفحة الفيديو: videoner.download/ar/extension\n\n👥 أضفني إلى مجموعة وسأنشر مقاطع الفيديو من الروابط التي يشاركها الأعضاء هناك.\n\n⚡ تخطَّ اختيار الجودة: أضف -audio بعد الرابط للصوت فقط (mp3)، أو -hd لأفضل جودة.\n\n📣 أخبار المشروع: ‎@videonerdownload\n\n🌐 لغة البوت: ‎/language",
  notLink: "لا يبدو هذا رابطًا. أرسل لي رابط فيديو.",
  inviteGreeting: "مرحبًا! أنا Videoner — أنزّل مقاطع الفيديو من YouTube وTikTok وInstagram ومنصات أخرى مجانًا. أجهّز لك الفيديو الذي شاركه أحدهم معك 👇",
  inviteNotFound: "لم أجد فيديو لرابط الدعوة هذا. أرسل لي رابط فيديو وسأنزّله.",
  inviteUnavailable: "تعذّر فتح الفيديو من هذا الرابط — الخدمة لا تستجيب الآن. افتح الرابط نفسه مرة أخرى بعد دقيقة.",
  fetchingInfo: "🔍 جارٍ جلب معلومات الفيديو...",
  audioOnlyButton: "🎵 الصوت فقط (mp3)",
  photoButton: "📷 تنزيل الصور",
  slideshowButton: "🎞 عرض شرائح (فيديو)",
  galleryButton: "📷+🎞 الصور وعرض الشرائح",
  chooseQuality: (title, duration) => `"${title}"${duration ? `\n⏱ ${duration}` : ""}\n\nاختر الجودة:`,
  sessionExpired: "انتهت الجلسة — أرسل الرابط مرة أخرى",
  downloading: "⏬ جارٍ التنزيل، قد يستغرق ذلك دقيقتين...",
  downloadFailed: "فشل التنزيل",
  downloadProgress: (percent, eta, done) =>
    `⏬ جارٍ التنزيل: ${percent}%${eta ? ` · متبقٍّ ${eta}` : ""}${done ? `\n${done}` : ""}`,
  downloadFinishing: "⚙️ أوشكنا على الانتهاء — جارٍ تجميع الملف...",
  converting: (percent) => `⚙️ جارٍ التحويل: ${percent}%`,
  etaUnderMinute: "أقل من دقيقة",
  etaMinutes: (minutes) => `~${minutes} د`,
  etaHours: (hours, minutes) => `~${hours} س${minutes ? ` ${minutes} د` : ""}`,
  downloadTimeout: "التنزيل يستغرق وقتًا طويلًا جدًا — يبدو أن الفيديو ثقيل جدًا. جرّب جودة أقل.",
  downloadInterrupted: "⚠️ يُعاد تشغيل البوت للتحديث — انقطع تنزيلك. يُرجى إرسال الرابط مرة أخرى بعد دقيقة.",
  fileTooBig: (mb, url) =>
    `تبيّن أن الملف كبير (${mb} MB) — لا يسمح Telegram للبوت بإرساله.\nنزّله من هنا: ${url}`,
  sendingFile: "📤 جارٍ إرسال الملف...",
  sendingAlbum: (count) => `📤 يحتوي هذا المنشور على عدة ملفات (${count}) — أرسلها كألبوم...`,
  failedPrefix: "❌ فشل: ",
  fileCaption: (title, sourceUrl, shareUrl, description) =>
    composeCaption(
      title,
      description,
      `المصدر: ${sourceUrl}\n` +
        "جميع حقوق الفيديو محفوظة لصاحبه.\n" +
        "نُزّل مجانًا عبر ‎@VideonerBot",
      `📣 أخبار المشروع: ${NEWS_CHANNEL}`,
      shareUrl && `🔗 مشاركة: ${shareUrl}`,
    ),
  subscribeRequired: (channel) =>
    `للتنزيل، يُرجى الاشتراك في قناتنا ${channel} — هذا هو الشرط الوحيد، والخدمة تبقى مجانية.\n\n` +
    "اشترك ثم اضغط «اشتركت».",
  openChannelButton: "📣 فتح القناة",
  checkSubscriptionButton: "اشتركت",
  subscribeThanks: "شكرًا لك! أرسل لي الآن رابط فيديو.",
  subscribeThanksResuming: "شكرًا لك! أعالج رابطك الآن.",
  subscribeStillMissing: "لا أرى الاشتراك بعد. اشترك ثم اضغط مرة أخرى.",
  channelNotice: (channel) => `\n\nسيظهر رابط هذا المنشور في ${channel} — بشكل مجهول، دون اسمك.`,
  channelPost: (title, url) =>
    (title ? `🎬 ${title.slice(0, 200)}\n\n` : "") +
    `${url}\n\n` +
    "نزّل هذا الفيديو وأي فيديو آخر مجانًا: ‎@VideonerBot",
  errorStoryNeedsId:
    "أرسل رابط قصة محددة: افتحها في تطبيق Instagram واضغط مشاركة ← نسخ الرابط.",
  errorInstagramStory:
    "قصص Instagram مرئية فقط لمن سجّلوا الدخول إلى حساباتهم.",
  errorLoginRequired:
    "هذا المنشور غير متاح دون تسجيل الدخول: تعرضه المنصة فقط " +
    "للمستخدمين المسجّلين. يحدث ذلك مع المنشورات الخاصة والمحتوى المقيّد بالعمر " +
    "والمنشورات المشاركة مع جمهور محدود.\n\n" +
    "المنشورات العامة تُنزَّل دون مشكلة — جرّب رابطًا آخر.",
  errorUnsupportedPlatform:
    "تعذّر التعرّف على هذا الرابط — تأكد أنه رابط فيديو مباشر من YouTube أو TikTok أو Instagram أو Facebook أو Twitter/X أو Vimeo أو VK أو Rutube أو OK.ru أو Pinterest أو Threads.",
  errorFileTooLarge: "الملف أكبر من 2 GB — لا يسمح Telegram للبوتات بإرسال ملفات أكبر. نزّله من الموقع أو بإضافة المتصفح — الأزرار بالأسفل. أو أرسل الرابط مرة أخرى واختر جودة أقل.",
  siteButton: "🌐 التنزيل من الموقع",
  qualitiesHiddenBySize: (limit) =>
    `\n\n⚖️ أُخفيت الجودات الأثقل من ${limit}: لا يسمح Telegram للبوتات بإرسال ملفات أكبر. يمكنك تنزيلها من الموقع أو بإضافة المتصفح — الأزرار بالأسفل.`,
  videoTooBigForTelegram: (smallest) =>
    `\n\n⚖️ هذا الفيديو ثقيل جدًا على Telegram حتى بأقل جودة (~${smallest}): لا يسمح Telegram للبوتات بإرسال ملفات أكبر من 2 GB. يمكنك هنا الحصول على الصوت فقط؛ أما الفيديو — فمن الموقع أو بإضافة المتصفح (الأزرار بالأسفل).`,
  errorFormatUnavailable: "هذه الجودة غير متاحة لهذا الفيديو. أرسل الرابط مرة أخرى — سأعرض القائمة الحالية.",
  errorNoVideoContent: "لا يحتوي هذا الرابط على فيديو للتنزيل — يبدو أن المنشور صور فقط.",
  errorRegionBlocked:
    "هذا الفيديو محجوب خارج بلد صاحبه — المنصة لا تعطيه " +
    "لخادمنا. لا سبيل للالتفاف على ذلك: القيد من جهتها." +
    "\n\nالروابط الأخرى تُنزَّل كالمعتاد.",
  errorRateLimited: "روابط كثيرة متتالية — انتظر قليلًا ثم أرسله مرة أخرى.",
  errorYoutubeDailyLimit: (gb) => `لقد نزّلت أكثر من ${gb} GB من YouTube خلال آخر 24 ساعة — وهذا هو الحد اليومي للبوت لكل شخص. يُحسب على آخر 24 ساعة، لذا يمكنك تنزيل مقاطع YouTube جديدة بعد قليل. المنصات الأخرى تعمل كالمعتاد.`,
  playlistStoppedByLimit: (dropped) => `⏹ توقفت قائمة التشغيل: بلغت الحد اليومي لـ YouTube. مقاطع لم تُنزَّل: ${dropped}. أرسل رابط قائمة التشغيل مرة أخرى لاحقًا.`,
  errorPlatformRefused:
    "لم تعطِ المنصة هذا الفيديو لخادمنا. يحدث ذلك مع المنشورات الخاصة " +
    "أو المقيّدة بالعمر، وأحيانًا تقيّد المنصة الوصول ببساطة " +
    "لبعض الوقت. حاول مرة أخرى بعد بضع دقائق.",
  errorThreadsNoMedia:
    "لا يظهر فيديو أو صورة في منشور Threads هذا. إما أنه منشور نصي فقط، أو " +
    "أن Threads يعرض وسائطه فقط للمسجّلين — ولا يمكن تنزيل مثل هذه المنشورات دون تسجيل الدخول.",
  extensionHint:
    "\n\n💻 يمكنك تنزيله بإضافة Videoner للمتصفح على الكمبيوتر: " +
    "فهي تنزّل باستخدام تسجيل دخولك أنت على المنصة، ولا تغادر أي كلمة مرور أو ملفات cookies متصفحك.",
  privateConnectHint: (platform, withExtension) =>
    `\n\n🔑 لتنزيل منشورات كهذه، اربط حسابك على ${platform} بالبوت — مرة واحدة فقط. بعدها سيحمّل البوت كل ما تستطيع رؤيته: المنشورات الخاصة والريلز والقصص، ومن هاتفك أيضًا. الزر أدناه يشرح الطريقة.${withExtension ? "\n\n💻 أو حمّلها بإضافة Videoner للمتصفح على الكمبيوتر." : ""}`,
  privateReconnectHint: (platform, withExtension) =>
    `\n\n⚠️ لم يتمكن حسابك المرتبط على ${platform} من فتح هذا المنشور. ربما توقف تسجيل الدخول عن العمل — اربط الحساب من جديد. أو أن هذا الحساب لا يملك صلاحية الوصول إلى المنشور.${withExtension ? "\n\n💻 يمكنك أيضًا تحميله بإضافة Videoner للمتصفح على الكمبيوتر." : ""}`,
  connectAccountButton: "🔑 ربط الحساب",
  reconnectAccountButton: "🔑 إعادة الربط",
  extensionButton: "🧩 التنزيل بالإضافة",
  extensionCommand:
    "🧩 Videoner لمتصفحك: زر تنزيل مباشرة في صفحة الفيديو — YouTube وInstagram وTikTok وVK، ومقاطع خاصة من حسابك، ودروس GetCourse.\n\nلـ Chrome وEdge وOpera وYandex Browser وFirefox على الكمبيوتر.",
  extensionPageButton: "🧩 تثبيت الإضافة",
  addToGroupButton: "👥 إضافة إلى مجموعة",
  newsButton: "📣 أخبار المشروع",
  fileCaptionShort: (title, sourceUrl) =>
    withOptionalLines((title ? `🎬 ${title.slice(0, 200)}\n\n` : "") + sourceUrl, `📣 أخبار المشروع: ${NEWS_CHANNEL}`, undefined),
  sentBy: (name) => `👤 ${name}`,
  groupSettings: (s, canDelete) =>
    "⚙️ إعدادات البوت لهذه المجموعة\n\n" +
    `🗑 حذف الرسالة التي تحتوي الرابط: ${s.deleteLinks ? "نعم" : "لا"}\n` +
    "بعد إرسال الفيديو، تُحذف الرسالة التي احتوت الرابط فقط — ويبقى في الدردشة الفيديو مع اسم من شاركه.\n" +
    (s.deleteLinks && !canDelete
      ? "⚠️ لا أستطيع حذف الرسائل الآن: اجعلني مشرفًا بصلاحية \"حذف الرسائل\".\n"
      : "") +
    `\n✍️ التعليق تحت الفيديو: ${{ full: "كامل", short: "العنوان والمصدر", none: "بلا تعليق" }[s.caption] ?? s.caption}\n` +
    `\n🎞 الجودة: ${s.quality === "max" ? "أعلى ما يقبله Telegram" : "قياسية (720p)"}\n` +
    `\n⏱ المقاطع الطويلة: ${s.longVideos ? "بأي طول" : "حتى 15 دقيقة فقط"}\n` +
    `\n🔑 من يمكنه ربط حساباته (للقصص والمنشورات الخاصة): ${s.cookiesBy === "all" ? "أي عضو" : "المشرفون فقط"}\n` +
    `\n🌐 لغة الردود: ${s.language ? langName(s.language) : "لغة كل عضو"}\n` +
    "\nلا يمكن تغيير الإعدادات إلا لمشرفي المجموعة.",
  settingsDeleteButton: (on) => `🗑 حذف الروابط: ${on ? "نعم" : "لا"}`,
  settingsCaptionButton: (style) => `✍️ التعليق: ${{ full: "كامل", short: "مختصر", none: "بلا" }[style] ?? style}`,
  settingsQualityButton: (mode) => `🎞 الجودة: ${mode === "max" ? "الأعلى" : "720p"}`,
  settingsLongButton: (on) => `⏱ المقاطع الطويلة: ${on ? "نعم" : "حتى 15 د"}`,
  settingsDoneButton: "✅ تم",
  settingsAdminsOnly: "لا يمكن تغيير الإعدادات إلا لمشرفي المجموعة.",
  settingsGroupsOnly: "الإعدادات خاصة بالمجموعات: أضفني إلى مجموعة وأرسل ‎/settings هناك.",
  settingsFailed: "تعذّر حفظ الإعدادات، يُرجى المحاولة مرة أخرى.",
  settingsCookiesButton: (by) => `🔑 ربط الحسابات: ${by === "all" ? "الجميع" : "المشرفون"}`,
  accountsIntro:
    "🔑 الحسابات المرتبطة\n\nيستطيع البوت تنزيل ما لا يراه إلا المسجّلون (قصص Instagram، المنشورات الخاصة) — باستخدام حسابك. يعمل تسجيل الدخول حيث ربطته: المرتبط في الدردشة الخاصة يخدم تنزيلاتك، بما فيها روابطك أنت في المجموعات التي ليس لها حساب خاص بها؛ والمرتبط بمجموعة يخدم جميع أعضائها.",
  accountsHowTo:
    "طريقة الربط:\n1. الأسهل: إضافة Videoner على الكمبيوتر — سجّل الدخول في موقع المنصة، وافتح نافذة Videoner، واضغط \"ربط الحساب\" وأرسل لي الرمز. للمجموعة، أرسل ‎/connect CODE في تلك المجموعة.\n2. أو أرسل لي ملف cookies.txt (ملفات cookies مصدّرة من المتصفح)، أو الصق نصه في رسالة.\n3. من هاتف Android — عبر Firefox وإضافة Cookie-Editor: https://videoner.download/ar/blog/android-firefox",
  accountsWarning:
    "⚠️ لا تحب المنصات التنزيل الآلي وقد تقيّد الحساب أو تحظره. الأفضل ربط حساب ثانوي، لا حسابك الرئيسي. تُخزَّن ملفات cookies مشفّرة، وتُستخدم للتنزيل فقط، وتُحذف بالأزرار أدناه.",
  accountsNone: "لا يوجد شيء مرتبط بعد.",
  accountsGroupTitle: "🔑 الحسابات المرتبطة بهذه المجموعة",
  accountsGroupHowTo:
    "لربط حساب للمجموعة كلها: احصل على رمز بزر \"ربط الحساب\" في إضافة Videoner وأرسل ‎/connect CODE هنا. إذا ربطت حسابًا في دردشتك الخاصة فقط، يستخدمه البوت هنا لروابطك أنت. حساباتك المرتبطة: ‎/accounts في دردشة خاصة مع ‎@VideonerBot.",
  accountsLine: (platform, where, active) => `• ${platform} — ${where}${active ? "" : " (⚠️ تسجيل الدخول لا يعمل)"}`,
  accountsGroupLine: (platform, owner, active) => `• ${platform} — ${owner}${active ? "" : " (⚠️ تسجيل الدخول لا يعمل)"}`,
  accountsWhereHere: "الدردشة الخاصة",
  accountsWhereGroup: (title) => `المجموعة "${title}"`,
  accountsDeleteButton: (platform, where) => `🗑 ${platform} · ${where}`,
  accountsDeleteAllButton: "🗑 إزالة كل حساباتي المرتبطة",
  accountsDeleted: "تمت الإزالة.",
  accountsDeletedAll: (n) => `أُزيلت الحسابات المرتبطة: ${n}.`,
  accountsNotAllowed: "لا يمكن الإزالة إلا لمن ربط الحساب أو لمشرف المجموعة.",
  connectUsage:
    "أرسل ‎/connect CODE. ستحصل على الرمز من زر \"ربط الحساب\" في إضافة Videoner على الكمبيوتر. حساباتك المرتبطة: ‎/accounts.",
  connectOnlyAdmins: "لا يمكن ربط الحسابات بهذه المجموعة إلا للمشرفين (انظر ‎/settings).",
  connectDone: (platform, where) =>
    `✅ رُبط ${platform} ${where}. أصبح البوت ينزّل أيضًا ما لا يراه إلا المسجّلون. للعرض أو الإزالة: ‎/accounts.\n\n⚠️ قد تقيّد المنصة الحساب بسبب التنزيل الآلي — الأفضل استخدام حساب ثانوي.`,
  connectWhereGroup: "بهذه المجموعة",
  connectWhereHere: "لتنزيلاتك في الدردشة الخاصة والوضع المضمّن",
  connectCodeNotFound: "الرمز غير موجود أو منتهي الصلاحية (الرموز صالحة 10 دقائق). احصل على رمز جديد من إضافة Videoner.",
  connectRejectedNoSession: "ملفات cookies هذه لا تحتوي تسجيل دخول. سجّل الدخول في موقع المنصة وصدّر ملفات cookies مرة أخرى.",
  connectRejectedUnknown: "لم يُعثر على ملفات cookies لمنصات مدعومة: Instagram وFacebook وYouTube وX وVK وTikTok.",
  connectUnavailable: "ربط الحسابات غير متاح بعد.",
  connectFailed: "تعذّر الربط، يُرجى المحاولة مرة أخرى.",
  connectFileTooBig: "الملف كبير جدًا — صدّر ملفات cookies للموقع المطلوب فقط.",
  connectNotAnonymous: "اربط الحساب باسمك أنت، لا بشكل مجهول باسم المجموعة: وإلا اختلطت حسابات المشرفين. أتلفتُ الرمز — احصل على رمز جديد.",
  connectCodeInGroup:
    "رمز الربط المنشور في دردشة المجموعة قد يراه الآخرون — أتلفتُه وحذفت الرسالة. احصل على رمز جديد وأرسله بـ ‎/connect CODE: أحذف رسالة هذا الأمر فورًا.",
  groupWelcome:
    "👋 مرحبًا! انشروا في هذه الدردشة روابط فيديو من TikTok وInstagram وYouTube وVK ومنصات أخرى — وسأرد بالفيديو نفسه.\n\n" +
    "أنزّل المقاطع حتى 15 دقيقة تلقائيًا، دون أوامر، وألتزم الصمت فيما عدا ذلك.\n\n⚙️ يمكن لمشرفي المجموعة ضبطي عبر ‎/settings: حذف رسائل الروابط، ونمط التعليق، والجودة، والمقاطع الطويلة، واللغة.\n\n⚡ أضف -audio بعد الرابط للحصول على الصوت، أو -hd لأفضل جودة.\n\n📣 أخبار المشروع: ‎@videonerdownload",
  errorTooLong: "الفيديو طويل جدًا — لا نستطيع تنزيل مقاطع بهذا الطول بعد.",
  errorUnknown: "تعذّر تنزيل هذا الفيديو. حاول مرة أخرى لاحقًا أو أرسل رابطًا آخر.",
  inlineHintButton: "أرسل رابطًا إلى البوت",
  inlineResultTitle: "⬇️ تنزيل الفيديو",
  inlineResultDescription: "سيُنشر الفيديو مباشرة في هذه الدردشة",
  inlinePlaceholder: "⏬ جارٍ التنزيل، قد يستغرق ذلك دقيقتين...",
  inlineOpenBot: "فتح البوت",
  inlineOnlySingleVideo:
    "يرسل هذا الوضع فيديو واحدًا. للمنشورات متعددة الملفات أو الصور، أرسل الرابط إلى البوت في دردشة خاصة.",
  inlineSubscribeRequired: (channel: string) =>
    `للتنزيل، اشترك في ${channel} ثم حاول مرة أخرى.`,
  inlineRateLimited: "طلبات كثيرة متتالية. انتظر دقيقة ثم حاول مرة أخرى.",
  queueRest: (count) => `\n\n📋 روابط لا تزال في قائمة الانتظار: ${count}. سأعرضها واحدًا تلو الآخر بعد هذا.`,
  queuedOne: (position) =>
    `📋 أُضيف الرابط إلى قائمة الانتظار، رقم ${position}. لننهِ الحالي أولًا — ثم أعرض لك اختيار الجودة له.`,
  queuedMany: (added, waiting) =>
    `📋 أُضيفت روابط إلى قائمة الانتظار: ${added}. المنتظرة إجمالًا: ${waiting}. سأعرضها واحدًا تلو الآخر بعد الحالي.`,
  queueDuplicates: (count) =>
    count === 1
      ? "هذا الرابط موجود بالفعل في قائمة الانتظار — لن أضيفه مرتين."
      : `الروابط الموجودة بالفعل في قائمة الانتظار لا تُضاف مرتين (المكررة: ${count}).`,
  queueFull: (limit, rejected) =>
    `تتسع قائمة الانتظار لـ ${limit} روابط كحد أقصى — لم تُضف الروابط الزائدة (${rejected}). أرسلها عندما تتقدم القائمة.`,
  skipButton: "✖️ لا تنزّل",
  skipped: "⏭ تم تخطي هذا الرابط.",
  chooseTimedOut: "⌛ لم تُختر جودة خلال 30 دقيقة — تخطيت هذا الرابط.",
  queueLostOnRestart: (count) =>
    `⚠️ يُعاد تشغيل البوت للتحديث — أُعيد ضبط قائمة الانتظار (الروابط: ${count}). يُرجى إرسالها مرة أخرى بعد دقيقة.`,
  subtitlesButton: "📝 الترجمة",
  subtitlesBack: "⬅️ العودة إلى الجودة",
  subtitlesAuto: "تلقائية",
  subtitlesChoose: "اختر لغة الترجمة",
  subtitlesPreparing: "📝 جارٍ تجهيز الترجمة...",
  subtitlesFailed: "تعذّر تنزيل الترجمة بهذه اللغة. جرّب لغة أخرى.",
  subtitlesBusy: "لا يقدّم YouTube الترجمة الآن — حاول مرة أخرى بعد بضع دقائق.",
  playlistFound: (title, count) =>
    `📃 قائمة تشغيل${title ? ` "${title.slice(0, 150)}"` : ""}: ${count} فيديو.\nسأنزّلها واحدًا تلو الآخر. بأي صيغة؟`,
  playlistStdButton: "🎬 720p",
  playlistHdButton: "🎬 أفضل جودة",
  playlistAudioButton: "🎵 الصوت فقط (mp3)",
  playlistNoButton: "✖️ لا، شكرًا",
  playlistQueued: (count) =>
    `📃 أُضيفت مقاطع من قائمة التشغيل إلى الانتظار: ${count}. سأرسلها واحدًا تلو الآخر. للإيقاف استخدم الزر أدناه أو ‎/stop.`,
  playlistFailed: "تعذّر فتح قائمة التشغيل — ربما تكون خاصة. أرسل رابط فيديو واحد.",
  stopButton: "⏹ إيقاف",
  stopped: (dropped) => `⏹ تم الإيقاف.${dropped ? ` روابط أُزيلت من قائمة الانتظار: ${dropped}.` : ""}`,
  nothingToStop: "لا يوجد تنزيل جارٍ الآن.",
  languageChoose: "🌐 اختر لغة البوت. \"تلقائي\" يتبع لغة Telegram لديك.",
  languageChooseGroup: "🌐 لغة ردود البوت في هذه المجموعة. \"تلقائي\" — لغة Telegram لكل عضو.",
  languageAuto: "تلقائي — كما في Telegram",
  languageAutoGroup: "تلقائي — لغة كل عضو",
  languageSaved: (name) => `✅ لغة البوت: ${name}. يمكنك تغييرها عبر ‎/language.`,
  languageSavedAuto: "✅ يتبع البوت لغة Telegram لديك. يمكنك تغييرها عبر ‎/language.",
  settingsLanguageButton: (name) => `🌐 اللغة: ${name ?? "تلقائي"}`,
  settingsBack: "⬅️ العودة إلى الإعدادات",
};

const zh: Messages = {
  start: "你好！把 YouTube、TikTok、Instagram、Facebook、Twitter/X、Vimeo、VK、Rutube、OK.ru、Pinterest 或 Threads 的视频链接发给我，我来帮你下载。\n\n✨ 画质不设限：平台提供什么画质，你就能拿到什么画质，最高 4K——只要文件不超过 2 GB（这是 Telegram 对机器人的限制）。这里没有任何付费功能。\n\n完全免费：没有订阅，没有广告，也没有应用内购买。\n\n🧩 在电脑上下载？安装浏览器扩展，视频页面上会直接出现下载按钮：videoner.download/zh/extension\n\n👥 把我加进群组，群成员分享的链接我都会把视频发出来。\n\n⚡ 跳过画质选择：在链接后加上 -audio 只下载音频（mp3），加上 -hd 下载最佳画质。\n\n📣 项目动态：@videonerdownload\n\n🌐 机器人语言：/language",
  notLink: "这看起来不像链接。请发送视频链接。",
  inviteGreeting: "你好！我是 Videoner，可以免费下载 YouTube、TikTok、Instagram 等平台的视频。正在准备别人分享给你的视频 👇",
  inviteNotFound: "没有找到这个邀请链接对应的视频。把视频链接发给我，我来下载。",
  inviteUnavailable: "无法打开这个链接中的视频——服务暂时没有响应。请过一分钟再打开同一个链接。",
  fetchingInfo: "🔍 正在获取视频信息……",
  audioOnlyButton: "🎵 仅音频（mp3）",
  photoButton: "📷 下载图片",
  slideshowButton: "🎞 幻灯片（视频）",
  galleryButton: "📷+🎞 图片和幻灯片",
  chooseQuality: (title, duration) => `「${title}」${duration ? `\n⏱ ${duration}` : ""}\n\n请选择画质：`,
  sessionExpired: "会话已过期，请重新发送链接",
  downloading: "⏬ 正在下载，可能需要几分钟……",
  downloadFailed: "下载失败",
  downloadProgress: (percent, eta, done) =>
    `⏬ 正在下载：${percent}%${eta ? ` · 剩余 ${eta}` : ""}${done ? `\n${done}` : ""}`,
  downloadFinishing: "⚙️ 马上就好，正在合成文件……",
  converting: (percent) => `⚙️ 正在转换：${percent}%`,
  etaUnderMinute: "不到一分钟",
  etaMinutes: (minutes) => `约 ${minutes} 分钟`,
  etaHours: (hours, minutes) => `约 ${hours} 小时${minutes ? ` ${minutes} 分钟` : ""}`,
  downloadTimeout: "下载耗时太长——这个视频似乎非常大。请试试更低的画质。",
  downloadInterrupted: "⚠️ 机器人正在重启更新，你的下载被中断了。请过一分钟重新发送链接。",
  fileTooBig: (mb, url) =>
    `文件比较大（${mb} MB），Telegram 不允许机器人发送。\n请在这里下载：${url}`,
  sendingFile: "📤 正在发送文件……",
  sendingAlbum: (count) => `📤 这条帖子包含多个文件（${count} 个），将以相册形式发送……`,
  failedPrefix: "❌ 失败：",
  fileCaption: (title, sourceUrl, shareUrl, description) =>
    composeCaption(
      title,
      description,
      `来源：${sourceUrl}\n` +
        "视频的所有权利归原作者所有。\n" +
        "通过 @VideonerBot 免费下载",
      `📣 项目动态：${NEWS_CHANNEL}`,
      shareUrl && `🔗 分享：${shareUrl}`,
    ),
  subscribeRequired: (channel) =>
    `下载前请先关注我们的频道 ${channel}——这是唯一的条件，服务依然免费。\n\n` +
    "关注后请点击「我已关注」。",
  openChannelButton: "📣 打开频道",
  checkSubscriptionButton: "我已关注",
  subscribeThanks: "谢谢！现在把视频链接发给我吧。",
  subscribeThanksResuming: "谢谢！正在处理你的链接。",
  subscribeStillMissing: "暂时还没看到你的关注。请先关注，然后再点一次。",
  channelNotice: (channel) => `\n\n这条帖子的链接会出现在 ${channel} 中——匿名发布，不显示你的名字。`,
  channelPost: (title, url) =>
    (title ? `🎬 ${title.slice(0, 200)}\n\n` : "") +
    `${url}\n\n` +
    "免费下载这个视频和其他任何视频：@VideonerBot",
  errorStoryNeedsId:
    "请发送某一条快拍的链接：在 Instagram 应用中打开它，点击「分享」→「复制链接」。",
  errorInstagramStory:
    "Instagram 快拍只有登录用户才能看到。",
  errorLoginRequired:
    "这条帖子需要登录才能查看：平台只向已登录的用户提供它。" +
    "私密帖子、有年龄限制的内容" +
    "以及仅限部分人可见的帖子都会这样。\n\n" +
    "公开帖子可以正常下载——请换一个链接试试。",
  errorUnsupportedPlatform:
    "无法识别这个链接——请确认它是来自 YouTube、TikTok、Instagram、Facebook、Twitter/X、Vimeo、VK、Rutube、OK.ru、Pinterest 或 Threads 的视频直链。",
  errorFileTooLarge: "文件超过 2 GB——Telegram 不允许机器人发送更大的文件。请在网站上或用浏览器扩展下载（按钮在下方），或者重新发送链接并选择更低的画质。",
  siteButton: "🌐 在网站上下载",
  qualitiesHiddenBySize: (limit) =>
    `\n\n⚖️ 超过 ${limit} 的画质已隐藏：Telegram 不允许机器人发送更大的文件。你可以在网站上或用浏览器扩展下载它们（按钮在下方）。`,
  videoTooBigForTelegram: (smallest) =>
    `\n\n⚖️ 这个视频即使选最低画质（约 ${smallest}）对 Telegram 来说也太大了：Telegram 不允许机器人发送超过 2 GB 的文件。这里可以只下载音频；视频请在网站上或用浏览器扩展下载（按钮在下方）。`,
  errorFormatUnavailable: "这个视频没有该画质。请重新发送链接，我会显示最新的画质列表。",
  errorNoVideoContent: "这个链接里没有可下载的视频——这条帖子似乎只有图片。",
  errorRegionBlocked:
    "这个视频在作者所在国家/地区以外被屏蔽——平台不向我们的服务器提供" +
    "它。这无法绕过：限制来自平台方。" +
    "\n\n其他链接可以照常下载。",
  errorRateLimited: "连续发送的链接太多了——请稍等一下再发送。",
  errorYoutubeDailyLimit: (gb) => `你在过去 24 小时内从 YouTube 下载了超过 ${gb} GB——这是机器人对每个人的每日限额。限额按最近 24 小时计算，稍后就可以继续下载新的 YouTube 视频。其他平台照常可用。`,
  playlistStoppedByLimit: (dropped) => `⏹ 播放列表已停止：已达到 YouTube 每日限额。未下载的视频：${dropped} 个。请稍后重新发送播放列表链接。`,
  errorPlatformRefused:
    "平台没有把这个视频提供给我们的服务器。私密帖子或有年龄限制的帖子" +
    "会出现这种情况，有时平台也只是暂时限制访问。" +
    "请过几分钟再试。",
  errorThreadsNoMedia:
    "这条 Threads 帖子里看不到视频或图片。可能是纯文字帖子，" +
    "也可能 Threads 只向已登录用户显示其中的媒体——这类帖子不登录就无法下载。",
  extensionHint:
    "\n\n💻 你可以在电脑上用 Videoner 浏览器扩展下载：" +
    "它使用你自己在平台上的登录状态下载，密码和 cookies 都不会离开你的浏览器。",
  privateConnectHint: (platform, withExtension) =>
    `\n\n🔑 要下载这类帖子，请把你的 ${platform} 账号连接到机器人——只需一次。之后机器人就能下载你能看到的一切：私密帖子、Reels 和快拍，在手机上也可以。点击下方按钮查看操作方法。${withExtension ? "\n\n💻 也可以在电脑上用 Videoner 浏览器扩展下载。" : ""}`,
  privateReconnectHint: (platform, withExtension) =>
    `\n\n⚠️ 你连接的 ${platform} 账号无法打开这条帖子。可能是登录已失效——请重新连接账号。也可能这个账号没有查看该帖子的权限。${withExtension ? "\n\n💻 你也可以在电脑上用 Videoner 浏览器扩展下载。" : ""}`,
  connectAccountButton: "🔑 连接账号",
  reconnectAccountButton: "🔑 重新连接",
  extensionButton: "🧩 用扩展下载",
  extensionCommand:
    "🧩 Videoner 浏览器扩展：在视频页面上直接显示下载按钮——支持 YouTube、Instagram、TikTok、VK、你账号中的私密视频以及 GetCourse 课程。\n\n适用于电脑上的 Chrome、Edge、Opera、Yandex Browser 和 Firefox。",
  extensionPageButton: "🧩 安装扩展",
  addToGroupButton: "👥 添加到群组",
  newsButton: "📣 项目动态",
  fileCaptionShort: (title, sourceUrl) =>
    withOptionalLines((title ? `🎬 ${title.slice(0, 200)}\n\n` : "") + sourceUrl, `📣 项目动态：${NEWS_CHANNEL}`, undefined),
  sentBy: (name) => `👤 ${name}`,
  groupSettings: (s, canDelete) =>
    "⚙️ 本群的机器人设置\n\n" +
    `🗑 删除包含链接的消息：${s.deleteLinks ? "是" : "否"}\n` +
    "视频发送后，只包含链接的消息会被删除——聊天中只保留视频和分享者的名字。\n" +
    (s.deleteLinks && !canDelete
      ? "⚠️ 我目前无法删除消息：请把我设为管理员，并授予「删除消息」权限。\n"
      : "") +
    `\n✍️ 视频说明文字：${{ full: "完整", short: "标题和来源", none: "无说明" }[s.caption] ?? s.caption}\n` +
    `\n🎞 画质：${s.quality === "max" ? "Telegram 可接受的最高画质" : "标准（720p）"}\n` +
    `\n⏱ 长视频：${s.longVideos ? "不限时长" : "仅限 15 分钟以内"}\n` +
    `\n🔑 谁可以连接自己的账号（用于快拍和私密帖子）：${s.cookiesBy === "all" ? "任何成员" : "仅管理员"}\n` +
    `\n🌐 回复语言：${s.language ? langName(s.language) : "跟随每位成员自己的语言"}\n` +
    "\n只有群管理员可以修改设置。",
  settingsDeleteButton: (on) => `🗑 删除链接：${on ? "是" : "否"}`,
  settingsCaptionButton: (style) => `✍️ 说明文字：${{ full: "完整", short: "简短", none: "无" }[style] ?? style}`,
  settingsQualityButton: (mode) => `🎞 画质：${mode === "max" ? "最高" : "720p"}`,
  settingsLongButton: (on) => `⏱ 长视频：${on ? "是" : "15 分钟以内"}`,
  settingsDoneButton: "✅ 完成",
  settingsAdminsOnly: "只有群管理员可以修改设置。",
  settingsGroupsOnly: "设置仅适用于群组：把我加进群组，然后在群里发送 /settings。",
  settingsFailed: "设置保存失败，请重试。",
  settingsCookiesButton: (by) => `🔑 连接账号：${by === "all" ? "所有人" : "管理员"}`,
  accountsIntro:
    "🔑 已连接的账号\n\n机器人可以借助你的账号下载只有登录用户才能看到的内容（Instagram 快拍、私密帖子）。登录在哪里连接就在哪里生效：在私聊中连接的账号用于你自己的下载，包括你在没有连接账号的群组里发的链接；连接到群组的账号则供该群所有成员使用。",
  accountsHowTo:
    "连接方法：\n1. 最简单：在电脑上使用 Videoner 扩展——先在平台网站上登录，打开 Videoner 弹窗，点击「🔑 将你的 … 账号连接到机器人」，然后把代码发给我。如果是群组，请在该群中发送 /connect CODE。\n2. 或者把 cookies.txt 文件（从浏览器导出的 cookies）发给我，也可以把文件内容作为消息粘贴发送。\n3. 在 Android 手机上——使用 Firefox 和 Cookie-Editor 附加组件：https://videoner.download/zh/blog/android-firefox",
  accountsWarning:
    "⚠️ 平台不喜欢自动下载，可能会限制或封禁账号。建议连接小号，而不是主账号。Cookies 加密存储，仅用于下载，可通过下方按钮删除。",
  accountsNone: "还没有连接任何账号。",
  accountsGroupTitle: "🔑 已连接到本群的账号",
  accountsGroupHowTo:
    "为整个群组连接账号：在 Videoner 扩展中点击「🔑 将你的 … 账号连接到机器人」获取代码，然后在这里发送 /connect CODE。如果你只在私聊中连接了账号，机器人会在这里用它处理你自己发的链接。查看你的连接：在与 @VideonerBot 的私聊中发送 /accounts。",
  accountsLine: (platform, where, active) => `• ${platform} — ${where}${active ? "" : "（⚠️ 登录已失效）"}`,
  accountsGroupLine: (platform, owner, active) => `• ${platform} — ${owner}${active ? "" : "（⚠️ 登录已失效）"}`,
  accountsWhereHere: "私聊",
  accountsWhereGroup: (title) => `群组「${title}」`,
  accountsDeleteButton: (platform, where) => `🗑 ${platform} · ${where}`,
  accountsDeleteAllButton: "🗑 删除我的所有连接",
  accountsDeleted: "已删除。",
  accountsDeletedAll: (n) => `已删除的连接：${n} 个。`,
  accountsNotAllowed: "只有连接者本人或群管理员可以删除。",
  connectUsage:
    "请发送 /connect CODE。代码可以在电脑上的 Videoner 扩展中点击「🔑 将你的 … 账号连接到机器人」获取。查看你的连接：/accounts。",
  connectOnlyAdmins: "只有管理员可以为本群连接账号（见 /settings）。",
  connectDone: (platform, where) =>
    `✅ ${platform} 已连接${where}。现在机器人也能下载只有登录用户才能看到的内容了。查看或删除：/accounts。\n\n⚠️ 平台可能会因自动下载而限制账号——建议使用小号。`,
  connectWhereGroup: "到本群",
  connectWhereHere: "，用于你在私聊和内联模式中的下载",
  connectCodeNotFound: "代码不存在或已过期（代码有效期为 10 分钟）。请在 Videoner 扩展中获取新代码。",
  connectRejectedNoSession: "这些 cookies 中没有登录信息。请在平台网站上登录，然后重新导出 cookies。",
  connectRejectedUnknown: "没有找到受支持平台的 cookies：Instagram、Facebook、YouTube、X、VK、TikTok。",
  connectUnavailable: "暂时还不能连接账号。",
  connectFailed: "连接失败，请重试。",
  connectFileTooBig: "文件太大——请只导出所需网站的 cookies。",
  connectNotAnonymous: "请以你本人身份连接账号，不要以群组身份匿名连接，否则管理员们的连接会混在一起。我已作废这个代码，请重新获取。",
  connectCodeInGroup:
    "发在群聊里的连接代码其他人也能看到——我已作废该代码并删除了这条消息。请获取新代码并用 /connect CODE 发送：我会立即删除这条命令消息。",
  groupWelcome:
    "👋 你好！在这个聊天里发送 TikTok、Instagram、YouTube、VK 等平台的视频链接，我会直接回复视频。\n\n" +
    "15 分钟以内的视频我会自动下载，无需任何命令；其他时候我不会打扰大家。\n\n⚙️ 群管理员可以用 /settings 调整我：删除链接消息、说明文字样式、画质、长视频和语言。\n\n⚡ 在链接后加上 -audio 获取音频，加上 -hd 获取最佳画质。\n\n📣 项目动态：@videonerdownload",
  errorTooLong: "视频太长了——暂时还无法下载这么长的视频。",
  errorUnknown: "无法下载这个视频。请稍后再试，或发送其他链接。",
  inlineHintButton: "把链接发给机器人",
  inlineResultTitle: "⬇️ 下载视频",
  inlineResultDescription: "视频会直接发到这个聊天中",
  inlinePlaceholder: "⏬ 正在下载，可能需要几分钟……",
  inlineOpenBot: "打开机器人",
  inlineOnlySingleVideo:
    "此模式只能发送单个视频。如果帖子包含多个文件或图片，请在私聊中把链接发给机器人。",
  inlineSubscribeRequired: (channel: string) =>
    `下载前请先关注 ${channel}，然后再试一次。`,
  inlineRateLimited: "连续请求太多了。请等一分钟再试。",
  queueRest: (count) => `\n\n📋 队列中还有链接：${count} 个。这个完成后我会逐个显示。`,
  queuedOne: (position) =>
    `📋 链接已加入队列，第 ${position} 位。先完成当前这个，然后我会为它显示画质选择。`,
  queuedMany: (added, waiting) =>
    `📋 已加入队列的链接：${added} 个。共有 ${waiting} 个在等待。当前这个完成后我会逐个显示。`,
  queueDuplicates: (count) =>
    count === 1
      ? "这个链接已经在队列中了，不会重复添加。"
      : `已在队列中的链接不会重复添加（重复：${count} 个）。`,
  queueFull: (limit, rejected) =>
    `队列最多容纳 ${limit} 个链接，多出的没有添加（${rejected} 个）。等队列往前走后再发送它们。`,
  skipButton: "✖️ 不下载",
  skipped: "⏭ 已跳过这个链接。",
  chooseTimedOut: "⌛ 30 分钟内没有选择画质，已跳过这个链接。",
  queueLostOnRestart: (count) =>
    `⚠️ 机器人正在重启更新，队列已被清空（链接：${count} 个）。请过一分钟重新发送。`,
  subtitlesButton: "📝 字幕",
  subtitlesBack: "⬅️ 返回画质选择",
  subtitlesAuto: "自动",
  subtitlesChoose: "请选择字幕语言",
  subtitlesPreparing: "📝 正在准备字幕……",
  subtitlesFailed: "无法下载该语言的字幕。请换一种语言试试。",
  subtitlesBusy: "YouTube 暂时不提供字幕——请过几分钟再试。",
  playlistFound: (title, count) =>
    `📃 播放列表${title ? `「${title.slice(0, 150)}」` : ""}：${count} 个视频。\n我会逐个下载。选择哪种格式？`,
  playlistStdButton: "🎬 720p",
  playlistHdButton: "🎬 最佳画质",
  playlistAudioButton: "🎵 仅音频（mp3）",
  playlistNoButton: "✖️ 不用了，谢谢",
  playlistQueued: (count) =>
    `📃 已从播放列表加入队列的视频：${count} 个。我会逐个发送。可用下方按钮或 /stop 停止。`,
  playlistFailed: "无法打开播放列表——它可能是私密的。请发送单个视频的链接。",
  stopButton: "⏹ 停止",
  stopped: (dropped) => `⏹ 已停止。${dropped ? `已从队列中移除的链接：${dropped} 个。` : ""}`,
  nothingToStop: "当前没有正在进行的下载。",
  languageChoose: "🌐 请选择机器人语言。「自动」将跟随你的 Telegram 语言。",
  languageChooseGroup: "🌐 机器人在本群的回复语言。「自动」即使用每位成员的 Telegram 语言。",
  languageAuto: "自动——跟随 Telegram",
  languageAutoGroup: "自动——跟随每位成员",
  languageSaved: (name) => `✅ 机器人语言：${name}。可用 /language 更改。`,
  languageSavedAuto: "✅ 机器人将跟随你的 Telegram 语言。可用 /language 更改。",
  settingsLanguageButton: (name) => `🌐 语言：${name ?? "自动"}`,
  settingsBack: "⬅️ 返回设置",
};

const hi: Messages = {
  start: "नमस्ते! मुझे YouTube, TikTok, Instagram, Facebook, Twitter/X, Vimeo, VK, Rutube, OK.ru, Pinterest या Threads के किसी वीडियो का लिंक भेजें — मैं उसे डाउनलोड करने में आपकी मदद करूँगा।\n\n✨ क्वालिटी की कोई सीमा नहीं: प्लेटफ़ॉर्म जो भी क्वालिटी देता है, 4K तक, वही आपको मिलती है — बस फ़ाइल 2 GB में आ जाए, जो बॉट्स के लिए Telegram की सीमा है। यहाँ कोई पेड फ़ीचर नहीं है।\n\nपूरी तरह मुफ़्त: न सब्सक्रिप्शन, न विज्ञापन, न ऐप में खरीदारी।\n\n🧩 कंप्यूटर पर डाउनलोड कर रहे हैं? ब्राउज़र एक्सटेंशन इंस्टॉल करें — वीडियो पेज पर ही डाउनलोड बटन आ जाएगा: videoner.download/hi/extension\n\n👥 मुझे किसी ग्रुप में जोड़ें, और वहाँ लोग जो लिंक शेयर करेंगे, उनके वीडियो मैं पोस्ट कर दूँगा।\n\n⚡ क्वालिटी चुनना छोड़ें: सिर्फ़ आवाज़ (mp3) के लिए लिंक के बाद -audio जोड़ें, या सबसे अच्छी क्वालिटी के लिए -hd।\n\n📣 प्रोजेक्ट की खबरें: @videonerdownload\n\n🌐 बॉट की भाषा: /language",
  notLink: "यह लिंक जैसा नहीं लग रहा। मुझे वीडियो का लिंक भेजें।",
  inviteGreeting: "नमस्ते! मैं Videoner हूँ — YouTube, TikTok, Instagram और दूसरे प्लेटफ़ॉर्म से वीडियो मुफ़्त में डाउनलोड करता हूँ। जो वीडियो आपके साथ शेयर किया गया है, उसे तैयार कर रहा हूँ 👇",
  inviteNotFound: "इस इनवाइट लिंक के लिए कोई वीडियो नहीं मिला। मुझे वीडियो का लिंक भेजें, मैं उसे डाउनलोड कर दूँगा।",
  inviteUnavailable: "इस लिंक से वीडियो नहीं खुल सका — सर्विस अभी जवाब नहीं दे रही। एक मिनट बाद यही लिंक फिर से खोलें।",
  fetchingInfo: "🔍 वीडियो की जानकारी ली जा रही है...",
  audioOnlyButton: "🎵 सिर्फ़ ऑडियो (mp3)",
  photoButton: "📷 फ़ोटो डाउनलोड करें",
  slideshowButton: "🎞 स्लाइडशो (वीडियो)",
  galleryButton: "📷+🎞 फ़ोटो और स्लाइडशो",
  chooseQuality: (title, duration) => `"${title}"${duration ? `\n⏱ ${duration}` : ""}\n\nक्वालिटी चुनें:`,
  sessionExpired: "सेशन खत्म हो गया — लिंक फिर से भेजें",
  downloading: "⏬ डाउनलोड हो रहा है, इसमें कुछ मिनट लग सकते हैं...",
  downloadFailed: "डाउनलोड नहीं हो सका",
  downloadProgress: (percent, eta, done) =>
    `⏬ डाउनलोड हो रहा है: ${percent}%${eta ? ` · ${eta} बाकी` : ""}${done ? `\n${done}` : ""}`,
  downloadFinishing: "⚙️ बस हो गया — फ़ाइल तैयार की जा रही है...",
  converting: (percent) => `⚙️ कन्वर्ट हो रहा है: ${percent}%`,
  etaUnderMinute: "एक मिनट से कम",
  etaMinutes: (minutes) => `~${minutes} मिनट`,
  etaHours: (hours, minutes) => `~${hours} घंटे${minutes ? ` ${minutes} मिनट` : ""}`,
  downloadTimeout: "डाउनलोड में बहुत ज़्यादा समय लग रहा है — वीडियो काफ़ी भारी लगता है। कम क्वालिटी आज़माएँ।",
  downloadInterrupted: "⚠️ अपडेट के लिए बॉट रीस्टार्ट हो रहा है — आपका डाउनलोड रुक गया। कृपया एक मिनट बाद लिंक फिर से भेजें।",
  fileTooBig: (mb, url) =>
    `फ़ाइल बड़ी निकली (${mb} MB) — Telegram बॉट को इसे भेजने नहीं देता।\nयहाँ से डाउनलोड करें: ${url}`,
  sendingFile: "📤 फ़ाइल भेजी जा रही है...",
  sendingAlbum: (count) => `📤 इस पोस्ट में कई फ़ाइलें हैं (${count}) — इन्हें एल्बम के रूप में भेज रहा हूँ...`,
  failedPrefix: "❌ नहीं हो सका: ",
  fileCaption: (title, sourceUrl, shareUrl, description) =>
    composeCaption(
      title,
      description,
      `स्रोत: ${sourceUrl}\n` +
        "वीडियो के सभी अधिकार उसके लेखक के हैं।\n" +
        "@VideonerBot से मुफ़्त में डाउनलोड किया गया",
      `📣 प्रोजेक्ट की खबरें: ${NEWS_CHANNEL}`,
      shareUrl && `🔗 शेयर करें: ${shareUrl}`,
    ),
  subscribeRequired: (channel) =>
    `डाउनलोड करने के लिए कृपया हमारे चैनल ${channel} को सब्सक्राइब करें — बस यही एक शर्त है, सर्विस मुफ़्त ही रहेगी।\n\n` +
    "सब्सक्राइब करें और «मैंने सब्सक्राइब कर लिया» दबाएँ।",
  openChannelButton: "📣 चैनल खोलें",
  checkSubscriptionButton: "मैंने सब्सक्राइब कर लिया",
  subscribeThanks: "धन्यवाद! अब मुझे किसी वीडियो का लिंक भेजें।",
  subscribeThanksResuming: "धन्यवाद! आपका लिंक अभी ले रहा हूँ।",
  subscribeStillMissing: "मुझे अभी सब्सक्रिप्शन नहीं दिख रहा। सब्सक्राइब करें और फिर से दबाएँ।",
  channelNotice: (channel) => `\n\nइस पोस्ट का लिंक ${channel} में दिखेगा — गुमनाम रूप से, आपके नाम के बिना।`,
  channelPost: (title, url) =>
    (title ? `🎬 ${title.slice(0, 200)}\n\n` : "") +
    `${url}\n\n` +
    "यह और कोई भी दूसरा वीडियो मुफ़्त में डाउनलोड करें: @VideonerBot",
  errorStoryNeedsId:
    "किसी खास स्टोरी का लिंक भेजें: उसे Instagram ऐप में खोलें और Share → Copy link दबाएँ।",
  errorInstagramStory:
    "Instagram स्टोरीज़ सिर्फ़ साइन-इन किए हुए लोगों को दिखती हैं।",
  errorLoginRequired:
    "यह पोस्ट साइन-इन किए बिना उपलब्ध नहीं है: प्लेटफ़ॉर्म इसे सिर्फ़ " +
    "लॉग-इन किए हुए यूज़र्स को दिखाता है। ऐसा प्राइवेट पोस्ट, उम्र-सीमा वाले कंटेंट और " +
    "सीमित ऑडियंस के साथ शेयर की गई पोस्ट के साथ होता है।\n\n" +
    "पब्लिक पोस्ट बिना किसी दिक्कत के डाउनलोड होती हैं — कोई दूसरा लिंक आज़माएँ।",
  errorUnsupportedPlatform:
    "यह लिंक पहचान में नहीं आया — पक्का करें कि यह YouTube, TikTok, Instagram, Facebook, Twitter/X, Vimeo, VK, Rutube, OK.ru, Pinterest या Threads के वीडियो का सीधा लिंक है।",
  errorFileTooLarge: "फ़ाइल 2 GB से बड़ी है — Telegram बॉट्स को इससे बड़ी फ़ाइलें भेजने नहीं देता। इसे वेबसाइट पर या ब्राउज़र एक्सटेंशन से डाउनलोड करें — बटन नीचे हैं। या लिंक फिर से भेजें और कम क्वालिटी चुनें।",
  siteButton: "🌐 वेबसाइट पर डाउनलोड करें",
  qualitiesHiddenBySize: (limit) =>
    `\n\n⚖️ ${limit} से भारी क्वालिटी छिपा दी गई हैं: Telegram बॉट्स को इससे बड़ी फ़ाइलें भेजने नहीं देता। आप इन्हें वेबसाइट पर या ब्राउज़र एक्सटेंशन से डाउनलोड कर सकते हैं — बटन नीचे हैं।`,
  videoTooBigForTelegram: (smallest) =>
    `\n\n⚖️ यह वीडियो सबसे कम क्वालिटी में भी Telegram के लिए बहुत भारी है (~${smallest}): Telegram बॉट्स को 2 GB से बड़ी फ़ाइलें भेजने नहीं देता। यहाँ आप सिर्फ़ ऑडियो ले सकते हैं; वीडियो — वेबसाइट पर या ब्राउज़र एक्सटेंशन से (बटन नीचे हैं)।`,
  errorFormatUnavailable: "इस वीडियो के लिए यह क्वालिटी उपलब्ध नहीं है। लिंक फिर से भेजें — मैं मौजूदा लिस्ट दिखा दूँगा।",
  errorNoVideoContent: "इस लिंक में डाउनलोड करने लायक कोई वीडियो नहीं है — लगता है पोस्ट में सिर्फ़ फ़ोटो हैं।",
  errorRegionBlocked:
    "यह वीडियो लेखक के देश के बाहर ब्लॉक है — प्लेटफ़ॉर्म इसे हमारे सर्वर " +
    "को नहीं देता। इसका कोई रास्ता नहीं है: पाबंदी उनकी तरफ़ से है।" +
    "\n\nदूसरे लिंक हमेशा की तरह डाउनलोड होते हैं।",
  errorRateLimited: "एक साथ बहुत ज़्यादा लिंक — थोड़ा रुकें और फिर से भेजें।",
  errorYoutubeDailyLimit: (gb) => `आपने पिछले 24 घंटों में YouTube से ${gb} GB से ज़्यादा डाउनलोड किया है — यह हर व्यक्ति के लिए बॉट की रोज़ की सीमा है। गिनती पिछले 24 घंटों की होती है, इसलिए थोड़ी देर बाद आप YouTube के नए वीडियो डाउनलोड कर सकेंगे। दूसरे प्लेटफ़ॉर्म हमेशा की तरह काम करते हैं।`,
  playlistStoppedByLimit: (dropped) => `⏹ प्लेलिस्ट रोक दी गई: YouTube की रोज़ की सीमा पूरी हो गई। जो वीडियो डाउनलोड नहीं हुए: ${dropped}। प्लेलिस्ट का लिंक बाद में फिर से भेजें।`,
  errorPlatformRefused:
    "प्लेटफ़ॉर्म ने यह वीडियो हमारे सर्वर को नहीं दिया। ऐसा प्राइवेट " +
    "या उम्र-सीमा वाली पोस्ट के साथ होता है, और कभी-कभी प्लेटफ़ॉर्म कुछ समय के लिए " +
    "एक्सेस सीमित कर देता है। कुछ मिनट बाद फिर से कोशिश करें।",
  errorThreadsNoMedia:
    "इस Threads पोस्ट में कोई वीडियो या फ़ोटो नहीं दिख रहा। या तो यह सिर्फ़ टेक्स्ट वाली पोस्ट है, या " +
    "Threads इसका मीडिया सिर्फ़ साइन-इन किए हुए यूज़र्स को दिखाता है — ऐसी पोस्ट लॉग-इन किए बिना डाउनलोड नहीं हो सकतीं।",
  extensionHint:
    "\n\n💻 आप इसे कंप्यूटर पर Videoner ब्राउज़र एक्सटेंशन से डाउनलोड कर सकते हैं: " +
    "यह प्लेटफ़ॉर्म पर आपके अपने साइन-इन से डाउनलोड करता है, और कोई पासवर्ड या कुकीज़ आपके ब्राउज़र से बाहर नहीं जातीं।",
  privateConnectHint: (platform, withExtension) =>
    `\n\n🔑 ऐसी पोस्ट डाउनलोड करने के लिए अपना ${platform} खाता बॉट से कनेक्ट करें — सिर्फ़ एक बार। इसके बाद बॉट वह सब डाउनलोड करेगा जो आपको दिखता है: प्राइवेट पोस्ट, रील्स और स्टोरीज़, फ़ोन से भी। कैसे करें, यह नीचे वाला बटन बताएगा।${withExtension ? "\n\n💻 या इसे कंप्यूटर पर Videoner ब्राउज़र एक्सटेंशन से डाउनलोड करें।" : ""}`,
  privateReconnectHint: (platform, withExtension) =>
    `\n\n⚠️ आपका कनेक्ट किया हुआ ${platform} खाता यह पोस्ट नहीं खोल सका। हो सकता है लॉग-इन ने काम करना बंद कर दिया हो — खाता फिर से कनेक्ट करें। या इस खाते के पास पोस्ट का एक्सेस नहीं है।${withExtension ? "\n\n💻 आप इसे कंप्यूटर पर Videoner ब्राउज़र एक्सटेंशन से भी डाउनलोड कर सकते हैं।" : ""}`,
  connectAccountButton: "🔑 खाता कनेक्ट करें",
  reconnectAccountButton: "🔑 फिर से कनेक्ट करें",
  extensionButton: "🧩 एक्सटेंशन से डाउनलोड करें",
  extensionCommand:
    "🧩 आपके ब्राउज़र के लिए Videoner: वीडियो पेज पर ही डाउनलोड बटन — YouTube, Instagram, TikTok, VK, आपके खाते के प्राइवेट वीडियो और GetCourse के लेसन।\n\nकंप्यूटर पर Chrome, Edge, Opera, Yandex Browser और Firefox के लिए।",
  extensionPageButton: "🧩 एक्सटेंशन इंस्टॉल करें",
  addToGroupButton: "👥 ग्रुप में जोड़ें",
  newsButton: "📣 प्रोजेक्ट की खबरें",
  fileCaptionShort: (title, sourceUrl) =>
    withOptionalLines((title ? `🎬 ${title.slice(0, 200)}\n\n` : "") + sourceUrl, `📣 प्रोजेक्ट की खबरें: ${NEWS_CHANNEL}`, undefined),
  sentBy: (name) => `👤 ${name}`,
  groupSettings: (s, canDelete) =>
    "⚙️ इस ग्रुप के लिए बॉट की सेटिंग्स\n\n" +
    `🗑 लिंक वाला मैसेज डिलीट करें: ${s.deleteLinks ? "हाँ" : "नहीं"}\n` +
    "वीडियो भेजे जाने के बाद, जिस मैसेज में सिर्फ़ लिंक था वह डिलीट हो जाता है — चैट में सिर्फ़ वीडियो रहता है, शेयर करने वाले के नाम के साथ।\n" +
    (s.deleteLinks && !canDelete
      ? "⚠️ मैं अभी मैसेज डिलीट नहीं कर सकता: मुझे \"Delete messages\" अधिकार के साथ एडमिन बनाएँ।\n"
      : "") +
    `\n✍️ वीडियो के नीचे कैप्शन: ${{ full: "पूरा", short: "शीर्षक और स्रोत", none: "कोई कैप्शन नहीं" }[s.caption] ?? s.caption}\n` +
    `\n🎞 क्वालिटी: ${s.quality === "max" ? "Telegram जितनी सबसे ज़्यादा स्वीकार करता है" : "स्टैंडर्ड (720p)"}\n` +
    `\n⏱ लंबे वीडियो: ${s.longVideos ? "किसी भी लंबाई के" : "सिर्फ़ 15 मिनट तक के"}\n` +
    `\n🔑 कौन अपने खाते कनेक्ट कर सकता है (स्टोरीज़ और प्राइवेट पोस्ट के लिए): ${s.cookiesBy === "all" ? "कोई भी सदस्य" : "सिर्फ़ एडमिन"}\n` +
    `\n🌐 जवाब की भाषा: ${s.language ? langName(s.language) : "हर सदस्य की अपनी"}\n` +
    "\nसिर्फ़ ग्रुप के एडमिन सेटिंग्स बदल सकते हैं।",
  settingsDeleteButton: (on) => `🗑 लिंक डिलीट करें: ${on ? "हाँ" : "नहीं"}`,
  settingsCaptionButton: (style) => `✍️ कैप्शन: ${{ full: "पूरा", short: "छोटा", none: "कोई नहीं" }[style] ?? style}`,
  settingsQualityButton: (mode) => `🎞 क्वालिटी: ${mode === "max" ? "सबसे ज़्यादा" : "720p"}`,
  settingsLongButton: (on) => `⏱ लंबे वीडियो: ${on ? "हाँ" : "15 मिनट तक"}`,
  settingsDoneButton: "✅ हो गया",
  settingsAdminsOnly: "सिर्फ़ ग्रुप के एडमिन सेटिंग्स बदल सकते हैं।",
  settingsGroupsOnly: "सेटिंग्स ग्रुप्स के लिए हैं: मुझे किसी ग्रुप में जोड़ें और वहाँ /settings भेजें।",
  settingsFailed: "सेटिंग्स सेव नहीं हो सकीं, कृपया फिर से कोशिश करें।",
  settingsCookiesButton: (by) => `🔑 खाते कनेक्ट करना: ${by === "all" ? "सभी" : "एडमिन"}`,
  accountsIntro:
    "🔑 कनेक्ट किए गए खाते\n\nबॉट वह भी डाउनलोड कर सकता है जो सिर्फ़ साइन-इन किए हुए लोगों को दिखता है (Instagram स्टोरीज़, प्राइवेट पोस्ट) — आपके खाते से। लॉग-इन वहीं काम करता है जहाँ आपने उसे कनेक्ट किया है: प्राइवेट चैट में कनेक्ट किया गया लॉग-इन आपके डाउनलोड के लिए है, जिसमें उन ग्रुप्स में आपके अपने लिंक भी शामिल हैं जिनका अपना कोई खाता नहीं है; ग्रुप से कनेक्ट किया गया लॉग-इन उसके सभी सदस्यों के काम आता है।",
  accountsHowTo:
    "कनेक्ट कैसे करें:\n1. सबसे आसान: कंप्यूटर पर Videoner एक्सटेंशन — प्लेटफ़ॉर्म की साइट पर साइन-इन करें, Videoner पॉपअप खोलें, «🔑 अपना … खाता बॉट से कनेक्ट करें» दबाएँ और कोड मुझे भेजें। ग्रुप के लिए, उसी ग्रुप में /connect CODE भेजें।\n2. या मुझे cookies.txt फ़ाइल भेजें (ब्राउज़र से एक्सपोर्ट की गई कुकीज़), या उसका टेक्स्ट मैसेज में पेस्ट करें।\n3. Android फ़ोन से — Firefox और Cookie-Editor ऐड-ऑन के साथ: https://videoner.download/hi/blog/android-firefox",
  accountsWarning:
    "⚠️ प्लेटफ़ॉर्म ऑटोमैटिक डाउनलोड पसंद नहीं करते और खाते पर रोक लगा सकते हैं या उसे बैन कर सकते हैं। बेहतर है कि मुख्य खाता नहीं, बल्कि कोई दूसरा खाता कनेक्ट करें। कुकीज़ एन्क्रिप्ट करके रखी जाती हैं, सिर्फ़ डाउनलोड के लिए इस्तेमाल होती हैं, और नीचे दिए बटनों से हटाई जा सकती हैं।",
  accountsNone: "अभी कुछ भी कनेक्ट नहीं है।",
  accountsGroupTitle: "🔑 इस ग्रुप से कनेक्ट किए गए खाते",
  accountsGroupHowTo:
    "पूरे ग्रुप के लिए खाता कनेक्ट करने के लिए: Videoner एक्सटेंशन में «🔑 अपना … खाता बॉट से कनेक्ट करें» बटन से कोड लें और यहाँ /connect CODE भेजें। अगर आपने खाता सिर्फ़ अपनी प्राइवेट चैट में कनेक्ट किया है, तो बॉट यहाँ आपके अपने लिंक के लिए उसका इस्तेमाल करता है। आपके कनेक्शन: @VideonerBot के साथ प्राइवेट चैट में /accounts।",
  accountsLine: (platform, where, active) => `• ${platform} — ${where}${active ? "" : " (⚠️ लॉग-इन काम नहीं कर रहा)"}`,
  accountsGroupLine: (platform, owner, active) => `• ${platform} — ${owner}${active ? "" : " (⚠️ लॉग-इन काम नहीं कर रहा)"}`,
  accountsWhereHere: "प्राइवेट चैट",
  accountsWhereGroup: (title) => `ग्रुप "${title}"`,
  accountsDeleteButton: (platform, where) => `🗑 ${platform} · ${where}`,
  accountsDeleteAllButton: "🗑 मेरे सभी कनेक्शन हटाएँ",
  accountsDeleted: "हटा दिया गया।",
  accountsDeletedAll: (n) => `हटाए गए कनेक्शन: ${n}।`,
  accountsNotAllowed: "इसे सिर्फ़ वही व्यक्ति हटा सकता है जिसने इसे कनेक्ट किया, या ग्रुप का एडमिन।",
  connectUsage:
    "/connect CODE भेजें। कोड आपको कंप्यूटर पर Videoner एक्सटेंशन के «🔑 अपना … खाता बॉट से कनेक्ट करें» बटन से मिलेगा। आपके कनेक्शन: /accounts।",
  connectOnlyAdmins: "इस ग्रुप से सिर्फ़ एडमिन ही खाते कनेक्ट कर सकते हैं (देखें /settings)।",
  connectDone: (platform, where) =>
    `✅ ${platform} कनेक्ट हो गया — ${where}। अब बॉट वह भी डाउनलोड करता है जो सिर्फ़ साइन-इन किए हुए लोगों को दिखता है। देखें या हटाएँ: /accounts।\n\n⚠️ ऑटोमैटिक डाउनलोड की वजह से प्लेटफ़ॉर्म खाते पर रोक लगा सकता है — बेहतर है कोई दूसरा खाता इस्तेमाल करें।`,
  connectWhereGroup: "इस ग्रुप के लिए",
  connectWhereHere: "प्राइवेट चैट और इनलाइन मोड में आपके डाउनलोड के लिए",
  connectCodeNotFound: "कोड नहीं मिला या उसकी मियाद खत्म हो गई (कोड 10 मिनट तक चलते हैं)। Videoner एक्सटेंशन में नया कोड लें।",
  connectRejectedNoSession: "इन कुकीज़ में कोई लॉग-इन नहीं है। प्लेटफ़ॉर्म की साइट पर साइन-इन करें और कुकीज़ फिर से एक्सपोर्ट करें।",
  connectRejectedUnknown: "समर्थित प्लेटफ़ॉर्म की कोई कुकीज़ नहीं मिलीं: Instagram, Facebook, YouTube, X, VK, TikTok।",
  connectUnavailable: "खाते कनेक्ट करने की सुविधा अभी उपलब्ध नहीं है।",
  connectFailed: "कनेक्ट नहीं हो सका, कृपया फिर से कोशिश करें।",
  connectFileTooBig: "फ़ाइल बहुत बड़ी है — सिर्फ़ ज़रूरी साइट की कुकीज़ एक्सपोर्ट करें।",
  connectNotAnonymous: "खाता अपने नाम से कनेक्ट करें, ग्रुप की तरफ़ से गुमनाम रूप से नहीं: वरना एडमिन्स के कनेक्शन आपस में मिल जाते हैं। मैंने कोड रद्द कर दिया है — नया कोड लें।",
  connectCodeInGroup:
    "ग्रुप चैट में डाला गया कनेक्शन कोड दूसरे लोग देख सकते हैं — मैंने उसे रद्द कर दिया और मैसेज हटा दिया। नया कोड लें और उसे /connect CODE के साथ भेजें: वह कमांड वाला मैसेज मैं तुरंत डिलीट कर देता हूँ।",
  groupWelcome:
    "👋 नमस्ते! इस चैट में TikTok, Instagram, YouTube, VK और दूसरे प्लेटफ़ॉर्म के वीडियो लिंक डालें — मैं जवाब में वीडियो ही भेज दूँगा।\n\n" +
    "15 मिनट तक के वीडियो मैं खुद डाउनलोड करता हूँ, किसी कमांड की ज़रूरत नहीं, और बाकी समय चुप रहता हूँ।\n\n⚙️ ग्रुप के एडमिन /settings से मुझे सेट कर सकते हैं: लिंक वाले मैसेज डिलीट करना, कैप्शन का स्टाइल, क्वालिटी, लंबे वीडियो और भाषा।\n\n⚡ आवाज़ के लिए लिंक के बाद -audio जोड़ें, या सबसे अच्छी क्वालिटी के लिए -hd।\n\n📣 प्रोजेक्ट की खबरें: @videonerdownload",
  errorTooLong: "वीडियो बहुत लंबा है — इतने लंबे वीडियो हम अभी डाउनलोड नहीं कर सकते।",
  errorUnknown: "यह वीडियो डाउनलोड नहीं हो सका। थोड़ी देर बाद फिर से कोशिश करें या कोई दूसरा लिंक भेजें।",
  inlineHintButton: "बॉट को लिंक भेजें",
  inlineResultTitle: "⬇️ वीडियो डाउनलोड करें",
  inlineResultDescription: "वीडियो इसी चैट में पोस्ट हो जाएगा",
  inlinePlaceholder: "⏬ डाउनलोड हो रहा है, इसमें कुछ मिनट लग सकते हैं...",
  inlineOpenBot: "बॉट खोलें",
  inlineOnlySingleVideo:
    "इस मोड में एक ही वीडियो भेजा जाता है। कई फ़ाइलों वाली पोस्ट या फ़ोटो के लिए, लिंक बॉट को प्राइवेट चैट में भेजें।",
  inlineSubscribeRequired: (channel: string) =>
    `डाउनलोड करने के लिए ${channel} को सब्सक्राइब करें और फिर से कोशिश करें।`,
  inlineRateLimited: "एक साथ बहुत ज़्यादा रिक्वेस्ट। एक मिनट रुकें और फिर से कोशिश करें।",
  queueRest: (count) => `\n\n📋 कतार में बाकी लिंक: ${count}। इसके बाद मैं उन्हें एक-एक करके दिखाऊँगा।`,
  queuedOne: (position) =>
    `📋 लिंक कतार में जोड़ दिया गया, #${position}। पहले मौजूदा लिंक पूरा कर लेते हैं — फिर मैं इसके लिए क्वालिटी चुनने का विकल्प दिखाऊँगा।`,
  queuedMany: (added, waiting) =>
    `📋 कतार में जोड़े गए लिंक: ${added}। कुल इंतज़ार में: ${waiting}। मौजूदा लिंक के बाद मैं उन्हें एक-एक करके दिखाऊँगा।`,
  queueDuplicates: (count) =>
    count === 1
      ? "यह लिंक पहले से कतार में है — इसे दोबारा नहीं जोड़ रहा।"
      : `जो लिंक पहले से कतार में हैं, उन्हें दोबारा नहीं जोड़ा जाता (दोहराए गए: ${count})।`,
  queueFull: (limit, rejected) =>
    `कतार में ज़्यादा से ज़्यादा ${limit} लिंक आ सकते हैं — बाकी नहीं जोड़े गए (${rejected})। कतार आगे बढ़ने पर उन्हें भेजें।`,
  skipButton: "✖️ डाउनलोड न करें",
  skipped: "⏭ यह लिंक छोड़ दिया।",
  chooseTimedOut: "⌛ 30 मिनट में कोई क्वालिटी नहीं चुनी गई — यह लिंक छोड़ रहा हूँ।",
  queueLostOnRestart: (count) =>
    `⚠️ अपडेट के लिए बॉट रीस्टार्ट हो रहा है — कतार खाली हो गई (लिंक: ${count})। कृपया एक मिनट बाद उन्हें फिर से भेजें।`,
  subtitlesButton: "📝 सबटाइटल",
  subtitlesBack: "⬅️ क्वालिटी पर वापस",
  subtitlesAuto: "ऑटो",
  subtitlesChoose: "सबटाइटल की भाषा चुनें",
  subtitlesPreparing: "📝 सबटाइटल तैयार किए जा रहे हैं...",
  subtitlesFailed: "इस भाषा में सबटाइटल डाउनलोड नहीं हो सके। कोई दूसरी भाषा आज़माएँ।",
  subtitlesBusy: "YouTube अभी सबटाइटल नहीं दे रहा — कुछ मिनट बाद फिर से कोशिश करें।",
  playlistFound: (title, count) =>
    `📃 प्लेलिस्ट${title ? ` "${title.slice(0, 150)}"` : ""}: ${count} वीडियो।\nमैं उन्हें एक-एक करके डाउनलोड करूँगा। कौन-सा फ़ॉर्मेट?`,
  playlistStdButton: "🎬 720p",
  playlistHdButton: "🎬 सबसे अच्छी क्वालिटी",
  playlistAudioButton: "🎵 सिर्फ़ ऑडियो (mp3)",
  playlistNoButton: "✖️ नहीं, धन्यवाद",
  playlistQueued: (count) =>
    `📃 प्लेलिस्ट से कतार में जोड़े गए वीडियो: ${count}। मैं उन्हें एक-एक करके भेजूँगा। नीचे दिए बटन या /stop से रोकें।`,
  playlistFailed: "प्लेलिस्ट नहीं खुल सकी — शायद यह प्राइवेट है। किसी एक वीडियो का लिंक भेजें।",
  stopButton: "⏹ रोकें",
  stopped: (dropped) => `⏹ रोक दिया।${dropped ? ` कतार से हटाए गए लिंक: ${dropped}।` : ""}`,
  nothingToStop: "अभी कुछ भी डाउनलोड नहीं हो रहा।",
  languageChoose: "🌐 बॉट की भाषा चुनें। \"ऑटो\" आपके Telegram की भाषा के हिसाब से चलता है।",
  languageChooseGroup: "🌐 इस ग्रुप में बॉट के जवाब की भाषा। \"ऑटो\" — हर सदस्य के Telegram की भाषा।",
  languageAuto: "ऑटो — Telegram जैसी",
  languageAutoGroup: "ऑटो — हर सदस्य की अपनी",
  languageSaved: (name) => `✅ बॉट की भाषा: ${name}। इसे /language से बदलें।`,
  languageSavedAuto: "✅ बॉट आपके Telegram की भाषा के हिसाब से चलेगा। इसे /language से बदलें।",
  settingsLanguageButton: (name) => `🌐 भाषा: ${name ?? "ऑटो"}`,
  settingsBack: "⬅️ सेटिंग्स पर वापस",
};

const indonesian: Messages = {
  start: "Halo! Kirimkan tautan video dari YouTube, TikTok, Instagram, Facebook, Twitter/X, Vimeo, VK, Rutube, OK.ru, Pinterest, atau Threads — saya akan membantu Anda mengunduhnya.\n\n✨ Tanpa batasan kualitas: Anda mendapatkan apa pun yang disediakan platform, hingga 4K — selama ukuran file tidak melebihi 2 GB, batas Telegram untuk bot. Tidak ada fitur berbayar di sini.\n\nSepenuhnya gratis: tanpa langganan, tanpa iklan, tanpa pembelian dalam aplikasi.\n\n🧩 Mengunduh di komputer? Pasang ekstensi browser — tombol Unduh akan muncul langsung di halaman video: videoner.download/id/extension\n\n👥 Tambahkan saya ke grup, dan saya akan mengirimkan video dari tautan yang dibagikan di sana.\n\n⚡ Lewati pemilihan kualitas: tambahkan -audio setelah tautan untuk suara saja (mp3), atau -hd untuk kualitas terbaik.\n\n📣 Berita proyek: @videonerdownload\n\n🌐 Bahasa bot: /language",
  notLink: "Sepertinya itu bukan tautan. Kirimkan tautan video.",
  inviteGreeting: "Halo! Saya Videoner — saya mengunduh video dari YouTube, TikTok, Instagram, dan platform lain secara gratis. Sedang menyiapkan video yang dibagikan kepada Anda 👇",
  inviteNotFound: "Saya tidak menemukan video untuk tautan undangan ini. Kirimkan tautan video, dan saya akan mengunduhnya.",
  inviteUnavailable: "Saya tidak dapat membuka video dari tautan ini — layanan sedang tidak merespons. Buka lagi tautan yang sama dalam satu menit.",
  fetchingInfo: "🔍 Mengambil info video...",
  audioOnlyButton: "🎵 Audio saja (mp3)",
  photoButton: "📷 Unduh foto",
  slideshowButton: "🎞 Slideshow (video)",
  galleryButton: "📷+🎞 Foto dan slideshow",
  chooseQuality: (title, duration) => `"${title}"${duration ? `\n⏱ ${duration}` : ""}\n\nPilih kualitas:`,
  sessionExpired: "Sesi berakhir — kirim tautannya lagi",
  downloading: "⏬ Mengunduh, ini bisa memakan waktu beberapa menit...",
  downloadFailed: "pengunduhan gagal",
  downloadProgress: (percent, eta, done) =>
    `⏬ Mengunduh: ${percent}%${eta ? ` · sisa ${eta}` : ""}${done ? `\n${done}` : ""}`,
  downloadFinishing: "⚙️ Hampir selesai — sedang menyusun file...",
  converting: (percent) => `⚙️ Mengonversi: ${percent}%`,
  etaUnderMinute: "kurang dari satu menit",
  etaMinutes: (minutes) => `~${minutes} mnt`,
  etaHours: (hours, minutes) => `~${hours} jam${minutes ? ` ${minutes} mnt` : ""}`,
  downloadTimeout: "pengunduhan terlalu lama — videonya tampaknya sangat besar. Coba kualitas yang lebih rendah.",
  downloadInterrupted: "⚠️ Bot sedang dimulai ulang untuk pembaruan — pengunduhan Anda terputus. Silakan kirim tautannya lagi dalam satu menit.",
  fileTooBig: (mb, url) =>
    `Filenya ternyata besar (${mb} MB) — Telegram tidak mengizinkan bot mengirimnya.\nUnduh di sini: ${url}`,
  sendingFile: "📤 Mengirim file...",
  sendingAlbum: (count) => `📤 Postingan ini berisi beberapa file (${count}) — mengirimnya sebagai album...`,
  failedPrefix: "❌ Gagal: ",
  fileCaption: (title, sourceUrl, shareUrl, description) =>
    composeCaption(
      title,
      description,
      `Sumber: ${sourceUrl}\n` +
        "Semua hak atas video ini milik pembuatnya.\n" +
        "Diunduh gratis dengan @VideonerBot",
      `📣 Berita proyek: ${NEWS_CHANNEL}`,
      shareUrl && `🔗 Bagikan: ${shareUrl}`,
    ),
  subscribeRequired: (channel) =>
    `Untuk mengunduh, silakan berlangganan saluran kami ${channel} — hanya itu syaratnya, layanan tetap gratis.\n\n` +
    "Berlangganan, lalu tekan «Saya sudah berlangganan».",
  openChannelButton: "📣 Buka saluran",
  checkSubscriptionButton: "Saya sudah berlangganan",
  subscribeThanks: "Terima kasih! Sekarang kirimkan tautan video.",
  subscribeThanksResuming: "Terima kasih! Sekarang saya proses tautan Anda.",
  subscribeStillMissing: "Saya belum melihat langganan Anda. Berlangganan, lalu tekan lagi.",
  channelNotice: (channel) => `\n\nTautan ke postingan ini akan muncul di ${channel} — secara anonim, tanpa nama Anda.`,
  channelPost: (title, url) =>
    (title ? `🎬 ${title.slice(0, 200)}\n\n` : "") +
    `${url}\n\n` +
    "Unduh video ini dan video lainnya secara gratis: @VideonerBot",
  errorStoryNeedsId:
    "kirimkan tautan ke story tertentu: buka di aplikasi Instagram, lalu ketuk Bagikan → Salin tautan.",
  errorInstagramStory:
    "Story Instagram hanya dapat dilihat oleh orang yang sudah masuk.",
  errorLoginRequired:
    "Postingan ini tidak tersedia tanpa masuk: platform hanya menampilkannya kepada " +
    "pengguna yang sudah login. Ini terjadi pada postingan privat, konten dengan batasan usia, dan " +
    "postingan yang dibagikan ke audiens terbatas.\n\n" +
    "Postingan publik bisa diunduh tanpa masalah — coba tautan lain.",
  errorUnsupportedPlatform:
    "Tautan tidak dikenali — pastikan itu tautan langsung ke video dari YouTube, TikTok, Instagram, Facebook, Twitter/X, Vimeo, VK, Rutube, OK.ru, Pinterest, atau Threads.",
  errorFileTooLarge: "file lebih besar dari 2 GB — Telegram tidak mengizinkan bot mengirim file yang lebih besar. Unduh di situs web atau dengan ekstensi browser — tombolnya ada di bawah. Atau kirim tautannya lagi dan pilih kualitas yang lebih rendah.",
  siteButton: "🌐 Unduh di situs web",
  qualitiesHiddenBySize: (limit) =>
    `\n\n⚖️ Kualitas yang lebih besar dari ${limit} disembunyikan: Telegram tidak mengizinkan bot mengirim file yang lebih besar. Anda bisa mengunduhnya di situs web atau dengan ekstensi browser — tombolnya ada di bawah.`,
  videoTooBigForTelegram: (smallest) =>
    `\n\n⚖️ Video ini terlalu besar untuk Telegram, bahkan dalam kualitas terendah (~${smallest}): Telegram tidak mengizinkan bot mengirim file lebih dari 2 GB. Di sini Anda hanya bisa mendapatkan audionya; videonya — di situs web atau dengan ekstensi browser (tombol di bawah).`,
  errorFormatUnavailable: "Kualitas tersebut tidak tersedia untuk video ini. Kirim tautannya lagi — saya akan menampilkan daftar terbaru.",
  errorNoVideoContent: "Tautan ini tidak berisi video untuk diunduh — sepertinya postingan ini hanya berisi foto.",
  errorRegionBlocked:
    "Video ini diblokir di luar negara pembuatnya — platform tidak memberikannya " +
    "ke server kami. Tidak ada cara untuk mengatasinya: pembatasan ada di pihak mereka." +
    "\n\nTautan lain tetap bisa diunduh seperti biasa.",
  errorRateLimited: "Terlalu banyak tautan berturut-turut — tunggu sebentar, lalu kirim lagi.",
  errorYoutubeDailyLimit: (gb) => `Anda telah mengunduh lebih dari ${gb} GB dari YouTube dalam 24 jam terakhir — itu batas harian bot per orang. Batas dihitung untuk 24 jam terakhir, jadi Anda bisa mengunduh video YouTube baru sedikit nanti. Platform lain berfungsi seperti biasa.`,
  playlistStoppedByLimit: (dropped) => `⏹ Playlist dihentikan: batas harian YouTube telah tercapai. Video yang tidak diunduh: ${dropped}. Kirim lagi tautan playlist nanti.`,
  errorPlatformRefused:
    "platform tidak memberikan video ini ke server kami. Ini terjadi pada postingan privat " +
    "atau dengan batasan usia, dan terkadang platform membatasi akses untuk " +
    "sementara. Coba lagi dalam beberapa menit.",
  errorThreadsNoMedia:
    "tidak ada video atau foto yang terlihat di postingan Threads ini. Mungkin ini postingan teks saja, atau " +
    "Threads hanya menampilkan medianya kepada pengguna yang sudah masuk — postingan seperti itu tidak bisa diunduh tanpa login.",
  extensionHint:
    "\n\n💻 Anda bisa mengunduhnya dengan ekstensi browser Videoner di komputer: " +
    "ekstensi mengunduh menggunakan login Anda sendiri di platform, dan tidak ada kata sandi atau cookies yang keluar dari browser Anda.",
  privateConnectHint: (platform, withExtension) =>
    `\n\n🔑 Untuk mengunduh postingan seperti ini, hubungkan akun ${platform} Anda ke bot — cukup sekali. Setelah itu bot mengunduh apa pun yang bisa Anda lihat: postingan privat, reels, dan story, juga dari ponsel Anda. Tombol di bawah menunjukkan caranya.${withExtension ? "\n\n💻 Atau unduh dengan ekstensi browser Videoner di komputer." : ""}`,
  privateReconnectHint: (platform, withExtension) =>
    `\n\n⚠️ Akun ${platform} yang Anda hubungkan tidak dapat membuka postingan ini. Login mungkin sudah tidak berfungsi — hubungkan akun lagi. Atau akun ini tidak memiliki akses ke postingan tersebut.${withExtension ? "\n\n💻 Anda juga bisa mengunduhnya dengan ekstensi browser Videoner di komputer." : ""}`,
  connectAccountButton: "🔑 Hubungkan akun",
  reconnectAccountButton: "🔑 Hubungkan ulang",
  extensionButton: "🧩 Unduh dengan ekstensi",
  extensionCommand:
    "🧩 Videoner untuk browser Anda: tombol Unduh langsung di halaman video — YouTube, Instagram, TikTok, VK, video privat dari akun Anda, dan pelajaran GetCourse.\n\nUntuk Chrome, Edge, Opera, Yandex Browser, dan Firefox di komputer.",
  extensionPageButton: "🧩 Pasang ekstensi",
  addToGroupButton: "👥 Tambahkan ke grup",
  newsButton: "📣 Berita proyek",
  fileCaptionShort: (title, sourceUrl) =>
    withOptionalLines((title ? `🎬 ${title.slice(0, 200)}\n\n` : "") + sourceUrl, `📣 Berita proyek: ${NEWS_CHANNEL}`, undefined),
  sentBy: (name) => `👤 ${name}`,
  groupSettings: (s, canDelete) =>
    "⚙️ Pengaturan bot untuk grup ini\n\n" +
    `🗑 Hapus pesan berisi tautan: ${s.deleteLinks ? "ya" : "tidak"}\n` +
    "Setelah video terkirim, pesan yang hanya berisi tautan akan dihapus — di obrolan hanya tersisa video dengan nama orang yang membagikannya.\n" +
    (s.deleteLinks && !canDelete
      ? "⚠️ Saat ini saya tidak bisa menghapus pesan: jadikan saya admin dengan hak \"Hapus pesan\".\n"
      : "") +
    `\n✍️ Keterangan di bawah video: ${{ full: "lengkap", short: "judul dan sumber", none: "tanpa keterangan" }[s.caption] ?? s.caption}\n` +
    `\n🎞 Kualitas: ${s.quality === "max" ? "tertinggi yang diterima Telegram" : "standar (720p)"}\n` +
    `\n⏱ Video panjang: ${s.longVideos ? "durasi berapa pun" : "hanya hingga 15 menit"}\n` +
    `\n🔑 Siapa yang boleh menghubungkan akun (untuk story dan postingan privat): ${s.cookiesBy === "all" ? "semua anggota" : "hanya admin"}\n` +
    `\n🌐 Bahasa balasan: ${s.language ? langName(s.language) : "bahasa masing-masing anggota"}\n` +
    "\nHanya admin grup yang dapat mengubah pengaturan.",
  settingsDeleteButton: (on) => `🗑 Hapus tautan: ${on ? "ya" : "tidak"}`,
  settingsCaptionButton: (style) => `✍️ Keterangan: ${{ full: "lengkap", short: "singkat", none: "tidak ada" }[style] ?? style}`,
  settingsQualityButton: (mode) => `🎞 Kualitas: ${mode === "max" ? "tertinggi" : "720p"}`,
  settingsLongButton: (on) => `⏱ Video panjang: ${on ? "ya" : "hingga 15 mnt"}`,
  settingsDoneButton: "✅ Selesai",
  settingsAdminsOnly: "Hanya admin grup yang dapat mengubah pengaturan.",
  settingsGroupsOnly: "Pengaturan berlaku untuk grup: tambahkan saya ke grup dan kirim /settings di sana.",
  settingsFailed: "Gagal menyimpan pengaturan, silakan coba lagi.",
  settingsCookiesButton: (by) => `🔑 Menghubungkan akun: ${by === "all" ? "semua orang" : "admin"}`,
  accountsIntro:
    "🔑 Akun yang terhubung\n\nBot dapat mengunduh konten yang hanya terlihat oleh orang yang sudah masuk (story Instagram, postingan privat) — menggunakan akun Anda. Login berlaku di tempat Anda menghubungkannya: login di obrolan pribadi melayani unduhan Anda, termasuk tautan Anda sendiri di grup yang tidak memiliki akun sendiri; login yang dihubungkan ke grup melayani semua anggotanya.",
  accountsHowTo:
    "Cara menghubungkan:\n1. Paling mudah: ekstensi Videoner di komputer — masuk di situs platform, buka jendela Videoner, tekan «🔑 Hubungkan akun … Anda ke bot», lalu kirimkan kodenya kepada saya. Untuk grup, kirim /connect KODE di grup tersebut.\n2. Atau kirimkan file cookies.txt (cookies yang diekspor dari browser), atau tempelkan isinya sebagai pesan.\n3. Dari ponsel Android — dengan Firefox dan add-on Cookie-Editor: https://videoner.download/id/blog/android-firefox",
  accountsWarning:
    "⚠️ Platform tidak menyukai pengunduhan otomatis dan dapat membatasi atau memblokir akun. Sebaiknya hubungkan akun cadangan, bukan akun utama Anda. Cookies disimpan dalam bentuk terenkripsi, hanya digunakan untuk mengunduh, dan dapat dihapus dengan tombol di bawah.",
  accountsNone: "Belum ada yang terhubung.",
  accountsGroupTitle: "🔑 Akun yang terhubung ke grup ini",
  accountsGroupHowTo:
    "Untuk menghubungkan akun bagi seluruh grup: dapatkan kode dengan tombol «🔑 Hubungkan akun … Anda ke bot» di ekstensi Videoner, lalu kirim /connect KODE di sini. Jika Anda menghubungkan akun hanya di obrolan pribadi, bot menggunakannya di sini untuk tautan Anda sendiri. Koneksi Anda: /accounts di obrolan pribadi dengan @VideonerBot.",
  accountsLine: (platform, where, active) => `• ${platform} — ${where}${active ? "" : " (⚠️ login tidak berfungsi)"}`,
  accountsGroupLine: (platform, owner, active) => `• ${platform} — ${owner}${active ? "" : " (⚠️ login tidak berfungsi)"}`,
  accountsWhereHere: "obrolan pribadi",
  accountsWhereGroup: (title) => `grup "${title}"`,
  accountsDeleteButton: (platform, where) => `🗑 ${platform} · ${where}`,
  accountsDeleteAllButton: "🗑 Hapus semua koneksi saya",
  accountsDeleted: "Dihapus.",
  accountsDeletedAll: (n) => `Koneksi dihapus: ${n}.`,
  accountsNotAllowed: "Hanya orang yang menghubungkannya atau admin grup yang dapat menghapusnya.",
  connectUsage:
    "Kirim /connect KODE. Kode didapat dari tombol «🔑 Hubungkan akun … Anda ke bot» di ekstensi Videoner di komputer. Koneksi Anda: /accounts.",
  connectOnlyAdmins: "Hanya admin yang dapat menghubungkan akun ke grup ini (lihat /settings).",
  connectDone: (platform, where) =>
    `✅ ${platform} terhubung ${where}. Kini bot juga mengunduh konten yang hanya terlihat oleh orang yang sudah masuk. Lihat atau hapus: /accounts.\n\n⚠️ Platform dapat membatasi akun karena pengunduhan otomatis — sebaiknya gunakan akun cadangan.`,
  connectWhereGroup: "ke grup ini",
  connectWhereHere: "untuk unduhan Anda di obrolan pribadi dan mode inline",
  connectCodeNotFound: "Kode tidak ditemukan atau sudah kedaluwarsa (kode berlaku 10 menit). Dapatkan kode baru di ekstensi Videoner.",
  connectRejectedNoSession: "Cookies ini tidak berisi login. Masuk di situs platform, lalu ekspor cookies lagi.",
  connectRejectedUnknown: "Tidak ditemukan cookies dari platform yang didukung: Instagram, Facebook, YouTube, X, VK, TikTok.",
  connectUnavailable: "Fitur menghubungkan akun belum tersedia.",
  connectFailed: "Gagal menghubungkan, silakan coba lagi.",
  connectFileTooBig: "File terlalu besar — ekspor cookies dari situs yang diperlukan saja.",
  connectNotAnonymous: "Hubungkan akun atas nama Anda sendiri, bukan secara anonim sebagai grup: jika tidak, koneksi para admin akan tercampur. Kode sudah saya hapus — dapatkan kode baru.",
  connectCodeInGroup:
    "Kode koneksi yang diposting di obrolan grup dapat dilihat orang lain — kode sudah saya hapus beserta pesannya. Dapatkan kode baru dan kirim dengan /connect KODE: pesan perintah itu langsung saya hapus.",
  groupWelcome:
    "👋 Halo! Kirim tautan video dari TikTok, Instagram, YouTube, VK, dan platform lain di obrolan ini — saya akan membalas dengan videonya.\n\n" +
    "Saya mengunduh klip hingga 15 menit secara otomatis, tanpa perintah, dan selain itu saya diam saja.\n\n⚙️ Admin grup dapat mengatur saya dengan /settings: menghapus pesan tautan, gaya keterangan, kualitas, video panjang, dan bahasa.\n\n⚡ Tambahkan -audio setelah tautan untuk mendapatkan suaranya, atau -hd untuk kualitas terbaik.\n\n📣 Berita proyek: @videonerdownload",
  errorTooLong: "videonya terlalu panjang — kami belum bisa mengunduh video sepanjang itu.",
  errorUnknown: "tidak dapat mengunduh video ini. Coba lagi nanti atau kirim tautan lain.",
  inlineHintButton: "Kirim tautan ke bot",
  inlineResultTitle: "⬇️ Unduh video",
  inlineResultDescription: "Video akan dikirim langsung di obrolan ini",
  inlinePlaceholder: "⏬ Mengunduh, ini bisa memakan waktu beberapa menit...",
  inlineOpenBot: "Buka bot",
  inlineOnlySingleVideo:
    "Mode ini mengirim satu video. Untuk postingan berisi beberapa file atau foto, kirim tautannya ke bot di obrolan pribadi.",
  inlineSubscribeRequired: (channel: string) =>
    `Untuk mengunduh, berlangganan ${channel}, lalu coba lagi.`,
  inlineRateLimited: "Terlalu banyak permintaan berturut-turut. Tunggu sebentar, lalu coba lagi.",
  queueRest: (count) => `\n\n📋 Tautan yang masih dalam antrean: ${count}. Saya akan menampilkannya satu per satu setelah yang ini.`,
  queuedOne: (position) =>
    `📋 Tautan masuk antrean, #${position}. Kita selesaikan yang sekarang dulu — lalu saya tampilkan pilihan kualitasnya.`,
  queuedMany: (added, waiting) =>
    `📋 Tautan yang ditambahkan ke antrean: ${added}. Total menunggu: ${waiting}. Saya akan menampilkannya satu per satu setelah yang sekarang.`,
  queueDuplicates: (count) =>
    count === 1
      ? "Tautan ini sudah ada di antrean — tidak ditambahkan dua kali."
      : `Tautan yang sudah ada di antrean tidak ditambahkan dua kali (duplikat: ${count}).`,
  queueFull: (limit, rejected) =>
    `Antrean menampung paling banyak ${limit} tautan — sisanya tidak ditambahkan (${rejected}). Kirim lagi setelah antrean berjalan.`,
  skipButton: "✖️ Jangan unduh",
  skipped: "⏭ Tautan ini dilewati.",
  chooseTimedOut: "⌛ Tidak ada kualitas yang dipilih dalam 30 menit — tautan ini dilewati.",
  queueLostOnRestart: (count) =>
    `⚠️ Bot sedang dimulai ulang untuk pembaruan — antrean diatur ulang (tautan: ${count}). Silakan kirim lagi dalam satu menit.`,
  subtitlesButton: "📝 Subtitle",
  subtitlesBack: "⬅️ Kembali ke kualitas",
  subtitlesAuto: "otomatis",
  subtitlesChoose: "Pilih bahasa subtitle",
  subtitlesPreparing: "📝 Menyiapkan subtitle...",
  subtitlesFailed: "Gagal mengunduh subtitle dalam bahasa ini. Coba bahasa lain.",
  subtitlesBusy: "YouTube sedang tidak memberikan subtitle — coba lagi dalam beberapa menit.",
  playlistFound: (title, count) =>
    `📃 Playlist${title ? ` "${title.slice(0, 150)}"` : ""}: ${count} video.\nSaya akan mengunduhnya satu per satu. Format apa?`,
  playlistStdButton: "🎬 720p",
  playlistHdButton: "🎬 Kualitas terbaik",
  playlistAudioButton: "🎵 Audio saja (mp3)",
  playlistNoButton: "✖️ Tidak, terima kasih",
  playlistQueued: (count) =>
    `📃 Video dari playlist yang masuk antrean: ${count}. Saya akan mengirimnya satu per satu. Hentikan dengan tombol di bawah atau /stop.`,
  playlistFailed: "Gagal membuka playlist — mungkin playlist ini privat. Kirim tautan ke satu video.",
  stopButton: "⏹ Hentikan",
  stopped: (dropped) => `⏹ Dihentikan.${dropped ? ` Tautan yang dihapus dari antrean: ${dropped}.` : ""}`,
  nothingToStop: "Tidak ada yang sedang diunduh.",
  languageChoose: "🌐 Pilih bahasa bot. \"Otomatis\" mengikuti Telegram Anda.",
  languageChooseGroup: "🌐 Bahasa balasan bot di grup ini. \"Otomatis\" — bahasa Telegram masing-masing anggota.",
  languageAuto: "Otomatis — sesuai Telegram",
  languageAutoGroup: "Otomatis — bahasa masing-masing anggota",
  languageSaved: (name) => `✅ Bahasa bot: ${name}. Ubah dengan /language.`,
  languageSavedAuto: "✅ Bot mengikuti bahasa Telegram Anda. Ubah dengan /language.",
  settingsLanguageButton: (name) => `🌐 Bahasa: ${name ?? "otomatis"}`,
  settingsBack: "⬅️ Kembali ke pengaturan",
};

const sw: Messages = {
  start: "Habari! Nitumie linki ya video kutoka YouTube, TikTok, Instagram, Facebook, Twitter/X, Vimeo, VK, Rutube, OK.ru, Pinterest au Threads — nitakusaidia kuipakua.\n\n✨ Hakuna kikomo cha ubora: unapata chochote ambacho jukwaa linatoa, hadi 4K — mradi faili haizidi 2 GB, kikomo cha Telegram kwa bot. Hapa hakuna huduma za kulipia.\n\nNi bure kabisa: hakuna usajili wa kulipia, hakuna matangazo, hakuna ununuzi ndani ya programu.\n\n🧩 Unapakua kwenye kompyuta? Sakinisha kiendelezi cha kivinjari — kitufe cha Pakua kitaonekana moja kwa moja kwenye ukurasa wa video: videoner.download/sw/extension\n\n👥 Niongeze kwenye kikundi, nami nitatuma video za linki ambazo watu wanashiriki humo.\n\n⚡ Ruka uchaguzi wa ubora: ongeza -audio baada ya linki upate sauti pekee (mp3), au -hd upate ubora bora zaidi.\n\n📣 Habari za mradi: @videonerdownload\n\n🌐 Lugha ya bot: /language",
  notLink: "Hii haionekani kuwa linki. Nitumie linki ya video.",
  inviteGreeting: "Habari! Mimi ni Videoner — napakua video kutoka YouTube, TikTok, Instagram na majukwaa mengine bila malipo. Ninaandaa video uliyotumiwa 👇",
  inviteNotFound: "Sikupata video ya linki hii ya mwaliko. Nitumie linki ya video nami nitaipakua.",
  inviteUnavailable: "Sikuweza kufungua video kutoka linki hii — huduma haijibu kwa sasa. Fungua linki hiyo hiyo tena baada ya dakika moja.",
  fetchingInfo: "🔍 Ninapata taarifa za video...",
  audioOnlyButton: "🎵 Sauti pekee (mp3)",
  photoButton: "📷 Pakua picha",
  slideshowButton: "🎞 Onyesho la slaidi (video)",
  galleryButton: "📷+🎞 Picha na onyesho la slaidi",
  chooseQuality: (title, duration) => `"${title}"${duration ? `\n⏱ ${duration}` : ""}\n\nChagua ubora:`,
  sessionExpired: "Muda wa kipindi umeisha — tuma linki tena",
  downloading: "⏬ Ninapakua, huenda ikachukua dakika kadhaa...",
  downloadFailed: "upakuaji umeshindikana",
  downloadProgress: (percent, eta, done) =>
    `⏬ Ninapakua: ${percent}%${eta ? ` · zimebaki ${eta}` : ""}${done ? `\n${done}` : ""}`,
  downloadFinishing: "⚙️ Karibu kumaliza — ninaunganisha faili...",
  converting: (percent) => `⚙️ Ninabadilisha: ${percent}%`,
  etaUnderMinute: "chini ya dakika moja",
  etaMinutes: (minutes) => `~dak ${minutes}`,
  etaHours: (hours, minutes) => `~saa ${hours}${minutes ? ` dak ${minutes}` : ""}`,
  downloadTimeout: "upakuaji unachukua muda mrefu mno — video inaonekana kuwa nzito sana. Jaribu ubora wa chini zaidi.",
  downloadInterrupted: "⚠️ Bot inaanzishwa upya kwa ajili ya sasisho — upakuaji wako umekatizwa. Tafadhali tuma linki tena baada ya dakika moja.",
  fileTooBig: (mb, url) =>
    `Faili imekuwa kubwa (${mb} MB) — Telegram hairuhusu bot kuituma.\nIpakue hapa: ${url}`,
  sendingFile: "📤 Ninatuma faili...",
  sendingAlbum: (count) => `📤 Chapisho hili lina faili kadhaa (${count}) — ninazituma kama albamu...`,
  failedPrefix: "❌ Imeshindikana: ",
  fileCaption: (title, sourceUrl, shareUrl, description) =>
    composeCaption(
      title,
      description,
      `Chanzo: ${sourceUrl}\n` +
        "Haki zote za video ni za mwandishi wake.\n" +
        "Imepakuliwa bila malipo kwa @VideonerBot",
      `📣 Habari za mradi: ${NEWS_CHANNEL}`,
      shareUrl && `🔗 Shiriki: ${shareUrl}`,
    ),
  subscribeRequired: (channel) =>
    `Ili kupakua, tafadhali jiunge na chaneli yetu ${channel} — hilo ndilo sharti pekee, huduma inabaki bure.\n\n` +
    "Jiunge kisha ubonyeze «Nimejiunga».",
  openChannelButton: "📣 Fungua chaneli",
  checkSubscriptionButton: "Nimejiunga",
  subscribeThanks: "Asante! Sasa nitumie linki ya video.",
  subscribeThanksResuming: "Asante! Ninashughulikia linki yako sasa.",
  subscribeStillMissing: "Bado sioni kwamba umejiunga. Jiunge kisha ubonyeze tena.",
  channelNotice: (channel) => `\n\nLinki ya chapisho hili itaonekana kwenye ${channel} — bila kutaja jina lako.`,
  channelPost: (title, url) =>
    (title ? `🎬 ${title.slice(0, 200)}\n\n` : "") +
    `${url}\n\n` +
    "Pakua video hii na nyingine yoyote bila malipo: @VideonerBot",
  errorStoryNeedsId:
    "tuma linki ya story mahususi: ifungue kwenye programu ya Instagram kisha ugonge Shiriki → Nakili linki.",
  errorInstagramStory:
    "Story za Instagram zinaonekana tu kwa watu walioingia kwenye akaunti.",
  errorLoginRequired:
    "Chapisho hili halipatikani bila kuingia kwenye akaunti: jukwaa linalitoa tu kwa " +
    "watumiaji walioingia. Hilo hutokea kwa machapisho ya faragha, maudhui yenye kikomo cha umri na " +
    "machapisho yaliyoshirikiwa na hadhira finyu.\n\n" +
    "Machapisho ya umma hupakuliwa bila shida — jaribu linki nyingine.",
  errorUnsupportedPlatform:
    "Sikuweza kutambua linki hii — hakikisha ni linki ya moja kwa moja ya video kutoka YouTube, TikTok, Instagram, Facebook, Twitter/X, Vimeo, VK, Rutube, OK.ru, Pinterest au Threads.",
  errorFileTooLarge: "faili ni kubwa kuliko 2 GB — Telegram hairuhusu bot kutuma faili kubwa zaidi. Ipakue kwenye tovuti au kwa kiendelezi cha kivinjari — vitufe viko hapa chini. Au tuma linki tena uchague ubora wa chini zaidi.",
  siteButton: "🌐 Pakua kwenye tovuti",
  qualitiesHiddenBySize: (limit) =>
    `\n\n⚖️ Ubora mzito kuliko ${limit} umefichwa: Telegram hairuhusu bot kutuma faili kubwa zaidi. Unaweza kuupakua kwenye tovuti au kwa kiendelezi cha kivinjari — vitufe viko hapa chini.`,
  videoTooBigForTelegram: (smallest) =>
    `\n\n⚖️ Video hii ni nzito mno kwa Telegram hata kwa ubora wa chini kabisa (~${smallest}): Telegram hairuhusu bot kutuma faili zinazozidi 2 GB. Hapa unaweza kupata sauti pekee; video — kwenye tovuti au kwa kiendelezi cha kivinjari (vitufe viko hapa chini).`,
  errorFormatUnavailable: "Ubora huo haupatikani kwa video hii. Tuma linki tena — nitakuonyesha orodha ya sasa.",
  errorNoVideoContent: "Linki hii haina video ya kupakua — chapisho linaonekana kuwa na picha pekee.",
  errorRegionBlocked:
    "Video hii imezuiwa nje ya nchi ya mwandishi — jukwaa haliitoi " +
    "kwa seva yetu. Hakuna njia ya kukwepa: kizuizi kiko upande wao." +
    "\n\nLinki nyingine zinapakuliwa kama kawaida.",
  errorRateLimited: "Linki nyingi mno mfululizo — subiri kidogo kisha uitume tena.",
  errorYoutubeDailyLimit: (gb) => `umepakua zaidi ya ${gb} GB kutoka YouTube katika saa 24 zilizopita — hicho ndicho kikomo cha kila siku cha bot kwa kila mtu. Kinahesabu saa 24 zilizopita, kwa hivyo utaweza kupakua video mpya za YouTube baadaye kidogo. Majukwaa mengine yanafanya kazi kama kawaida.`,
  playlistStoppedByLimit: (dropped) => `⏹ Orodha ya kucheza imesimamishwa: kikomo cha kila siku cha YouTube kimefikiwa. Video ambazo hazijapakuliwa: ${dropped}. Tuma linki ya orodha ya kucheza tena baadaye.`,
  errorPlatformRefused:
    "jukwaa halikutoa video hii kwa seva yetu. Hili hutokea kwa machapisho ya faragha " +
    "au yenye kikomo cha umri, na wakati mwingine jukwaa huzuia ufikiaji kwa " +
    "muda tu. Jaribu tena baada ya dakika chache.",
  errorThreadsNoMedia:
    "hakuna video wala picha inayoonekana kwenye chapisho hili la Threads. Huenda ni chapisho la maandishi pekee, au " +
    "Threads huonyesha maudhui yake kwa watumiaji walioingia tu — machapisho kama hayo hayawezi kupakuliwa bila kuingia.",
  extensionHint:
    "\n\n💻 Unaweza kuipakua kwa kiendelezi cha kivinjari cha Videoner kwenye kompyuta: " +
    "kinapakua kwa kutumia akaunti yako mwenyewe kwenye jukwaa, na hakuna nenosiri wala cookies zinazotoka kwenye kivinjari chako.",
  privateConnectHint: (platform, withExtension) =>
    `\n\n🔑 Ili kupakua machapisho kama haya, unganisha akaunti yako ya ${platform} na bot — mara moja tu. Baada ya hapo bot itapakua chochote unachoweza kuona: machapisho ya faragha, reels na story, hata kutoka kwenye simu yako. Kitufe kilicho hapa chini kinaonyesha jinsi ya kufanya.${withExtension ? "\n\n💻 Au ipakue kwa kiendelezi cha kivinjari cha Videoner kwenye kompyuta." : ""}`,
  privateReconnectHint: (platform, withExtension) =>
    `\n\n⚠️ Akaunti yako ya ${platform} iliyounganishwa haikuweza kufungua chapisho hili. Huenda kuingia kumeacha kufanya kazi — unganisha akaunti tena. Au akaunti hii haina ruhusa ya kuona chapisho.${withExtension ? "\n\n💻 Unaweza pia kuipakua kwa kiendelezi cha kivinjari cha Videoner kwenye kompyuta." : ""}`,
  connectAccountButton: "🔑 Unganisha akaunti",
  reconnectAccountButton: "🔑 Unganisha upya",
  extensionButton: "🧩 Pakua kwa kiendelezi",
  extensionCommand:
    "🧩 Videoner kwa kivinjari chako: kitufe cha Pakua moja kwa moja kwenye ukurasa wa video — YouTube, Instagram, TikTok, VK, video za faragha kutoka kwenye akaunti yako na masomo ya GetCourse.\n\nKwa Chrome, Edge, Opera, Yandex Browser na Firefox kwenye kompyuta.",
  extensionPageButton: "🧩 Sakinisha kiendelezi",
  addToGroupButton: "👥 Ongeza kwenye kikundi",
  newsButton: "📣 Habari za mradi",
  fileCaptionShort: (title, sourceUrl) =>
    withOptionalLines((title ? `🎬 ${title.slice(0, 200)}\n\n` : "") + sourceUrl, `📣 Habari za mradi: ${NEWS_CHANNEL}`, undefined),
  sentBy: (name) => `👤 ${name}`,
  groupSettings: (s, canDelete) =>
    "⚙️ Mipangilio ya bot kwa kikundi hiki\n\n" +
    `🗑 Futa ujumbe wenye linki: ${s.deleteLinks ? "ndiyo" : "hapana"}\n` +
    "Video ikishatumwa, ujumbe uliokuwa na linki pekee unafutwa — gumzo linabaki na video tu pamoja na jina la aliyeishiriki.\n" +
    (s.deleteLinks && !canDelete
      ? "⚠️ Siwezi kufuta ujumbe kwa sasa: nifanye msimamizi mwenye ruhusa ya \"Kufuta ujumbe\".\n"
      : "") +
    `\n✍️ Maelezo chini ya video: ${{ full: "kamili", short: "kichwa na chanzo", none: "bila maelezo" }[s.caption] ?? s.caption}\n` +
    `\n🎞 Ubora: ${s.quality === "max" ? "wa juu kabisa ambao Telegram inakubali" : "wa kawaida (720p)"}\n` +
    `\n⏱ Video ndefu: ${s.longVideos ? "urefu wowote" : "hadi dakika 15 tu"}\n` +
    `\n🔑 Nani anaweza kuunganisha akaunti zao (kwa story na machapisho ya faragha): ${s.cookiesBy === "all" ? "mwanachama yeyote" : "wasimamizi tu"}\n` +
    `\n🌐 Lugha ya majibu: ${s.language ? langName(s.language) : "ya kila mwanachama"}\n` +
    "\nWasimamizi wa kikundi pekee ndio wanaoweza kubadilisha mipangilio.",
  settingsDeleteButton: (on) => `🗑 Futa linki: ${on ? "ndiyo" : "hapana"}`,
  settingsCaptionButton: (style) => `✍️ Maelezo: ${{ full: "kamili", short: "mafupi", none: "hakuna" }[style] ?? style}`,
  settingsQualityButton: (mode) => `🎞 Ubora: ${mode === "max" ? "wa juu kabisa" : "720p"}`,
  settingsLongButton: (on) => `⏱ Video ndefu: ${on ? "ndiyo" : "hadi dak 15"}`,
  settingsDoneButton: "✅ Imekamilika",
  settingsAdminsOnly: "Wasimamizi wa kikundi pekee ndio wanaoweza kubadilisha mipangilio.",
  settingsGroupsOnly: "Mipangilio ni ya vikundi: niongeze kwenye kikundi kisha utume /settings humo.",
  settingsFailed: "Sikuweza kuhifadhi mipangilio, tafadhali jaribu tena.",
  settingsCookiesButton: (by) => `🔑 Kuunganisha akaunti: ${by === "all" ? "kila mtu" : "wasimamizi"}`,
  accountsIntro:
    "🔑 Akaunti zilizounganishwa\n\nBot inaweza kupakua maudhui ambayo yanaonekana tu kwa watu walioingia (story za Instagram, machapisho ya faragha) — kwa kutumia akaunti yako. Kuingia kunafanya kazi pale ulipokiunganisha: kilichounganishwa kwenye gumzo la faragha kinahudumia upakuaji wako, pamoja na linki zako mwenyewe katika vikundi visivyo na akaunti yao; kilichounganishwa na kikundi kinahudumia wanachama wake wote.",
  accountsHowTo:
    "Jinsi ya kuunganisha:\n1. Rahisi zaidi: kiendelezi cha Videoner kwenye kompyuta — ingia kwenye tovuti ya jukwaa, fungua dirisha la Videoner, bonyeza «🔑 Unganisha akaunti yako ya … na bot» kisha unitumie msimbo. Kwa kikundi, tuma /connect MSIMBO katika kikundi hicho.\n2. Au nitumie faili ya cookies.txt (cookies zilizohamishwa kutoka kwenye kivinjari), au bandika maandishi yake kama ujumbe.\n3. Kutoka kwenye simu ya Android — kwa Firefox na kiongezi cha Cookie-Editor: https://videoner.download/sw/blog/android-firefox",
  accountsWarning:
    "⚠️ Majukwaa hayapendi upakuaji wa kiotomatiki na yanaweza kuzuia au kufungia akaunti. Ni bora kuunganisha akaunti ya ziada, si akaunti yako kuu. Cookies huhifadhiwa zikiwa zimesimbwa, hutumika kwa upakuaji pekee, na huondolewa kwa vitufe vilivyo hapa chini.",
  accountsNone: "Bado hakuna kilichounganishwa.",
  accountsGroupTitle: "🔑 Akaunti zilizounganishwa na kikundi hiki",
  accountsGroupHowTo:
    "Ili kuunganisha akaunti kwa kikundi kizima: pata msimbo kwa kitufe cha «🔑 Unganisha akaunti yako ya … na bot» kwenye kiendelezi cha Videoner kisha utume /connect MSIMBO hapa. Ikiwa uliunganisha akaunti kwenye gumzo lako la faragha pekee, bot inaitumia hapa kwa linki zako mwenyewe. Miunganisho yako: /accounts kwenye gumzo la faragha na @VideonerBot.",
  accountsLine: (platform, where, active) => `• ${platform} — ${where}${active ? "" : " (⚠️ kuingia hakufanyi kazi)"}`,
  accountsGroupLine: (platform, owner, active) => `• ${platform} — ${owner}${active ? "" : " (⚠️ kuingia hakufanyi kazi)"}`,
  accountsWhereHere: "gumzo la faragha",
  accountsWhereGroup: (title) => `kikundi "${title}"`,
  accountsDeleteButton: (platform, where) => `🗑 ${platform} · ${where}`,
  accountsDeleteAllButton: "🗑 Ondoa miunganisho yangu yote",
  accountsDeleted: "Imeondolewa.",
  accountsDeletedAll: (n) => `Miunganisho iliyoondolewa: ${n}.`,
  accountsNotAllowed: "Ni aliyeiunganisha tu au msimamizi wa kikundi anayeweza kuiondoa.",
  connectUsage:
    "Tuma /connect MSIMBO. Msimbo unaupata kwa kitufe cha «🔑 Unganisha akaunti yako ya … na bot» kwenye kiendelezi cha Videoner kwenye kompyuta. Miunganisho yako: /accounts.",
  connectOnlyAdmins: "Wasimamizi pekee ndio wanaoweza kuunganisha akaunti na kikundi hiki (tazama /settings).",
  connectDone: (platform, where) =>
    `✅ ${platform} imeunganishwa ${where}. Sasa bot inapakua pia maudhui yanayoonekana tu kwa watu walioingia. Tazama au ondoa: /accounts.\n\n⚠️ Jukwaa linaweza kuzuia akaunti kwa sababu ya upakuaji wa kiotomatiki — ni bora kutumia akaunti ya ziada.`,
  connectWhereGroup: "na kikundi hiki",
  connectWhereHere: "kwa upakuaji wako kwenye gumzo la faragha na hali ya inline",
  connectCodeNotFound: "Msimbo haukupatikana au muda wake umeisha (misimbo hudumu dakika 10). Pata mpya kwenye kiendelezi cha Videoner.",
  connectRejectedNoSession: "Cookies hizi hazina kuingia. Ingia kwenye tovuti ya jukwaa kisha uhamishe cookies tena.",
  connectRejectedUnknown: "Hakuna cookies za majukwaa yanayotumika zilizopatikana: Instagram, Facebook, YouTube, X, VK, TikTok.",
  connectUnavailable: "Kuunganisha akaunti bado hakupatikani.",
  connectFailed: "Sikuweza kuunganisha, tafadhali jaribu tena.",
  connectFileTooBig: "Faili ni kubwa mno — hamisha cookies za tovuti inayohitajika pekee.",
  connectNotAnonymous: "Unganisha akaunti kama wewe mwenyewe, si bila kujitambulisha kama kikundi: vinginevyo miunganisho ya wasimamizi itachanganyika. Nimeuharibu msimbo — pata mpya.",
  connectCodeInGroup:
    "Msimbo wa kuunganisha uliotumwa kwenye gumzo la kikundi unaweza kuonwa na wengine — nimeuharibu na kuondoa ujumbe. Pata mpya kisha uutume kwa /connect MSIMBO: ninafuta ujumbe wa amri hiyo papo hapo.",
  groupWelcome:
    "👋 Habari! Tumeni linki za video kutoka TikTok, Instagram, YouTube, VK na majukwaa mengine kwenye gumzo hili — nitajibu kwa video yenyewe.\n\n" +
    "Napakua klipu za hadi dakika 15 mwenyewe, bila amri yoyote, na vinginevyo nakaa kimya.\n\n⚙️ Wasimamizi wa kikundi wanaweza kunirekebisha kwa /settings: kufuta ujumbe wenye linki, mtindo wa maelezo, ubora, video ndefu na lugha.\n\n⚡ Ongeza -audio baada ya linki upate sauti, au -hd upate ubora bora zaidi.\n\n📣 Habari za mradi: @videonerdownload",
  errorTooLong: "video ni ndefu mno — bado hatuwezi kupakua video ndefu kiasi hicho.",
  errorUnknown: "sikuweza kupakua video hii. Jaribu tena baadaye kidogo au tuma linki nyingine.",
  inlineHintButton: "Tuma linki kwa bot",
  inlineResultTitle: "⬇️ Pakua video",
  inlineResultDescription: "Video itatumwa moja kwa moja kwenye gumzo hili",
  inlinePlaceholder: "⏬ Ninapakua, huenda ikachukua dakika kadhaa...",
  inlineOpenBot: "Fungua bot",
  inlineOnlySingleVideo:
    "Hali hii inatuma video moja tu. Kwa machapisho yenye faili nyingi au picha, tuma linki kwa bot kwenye gumzo la faragha.",
  inlineSubscribeRequired: (channel: string) =>
    `Ili kupakua, jiunge na ${channel} kisha ujaribu tena.`,
  inlineRateLimited: "Maombi mengi mno mfululizo. Subiri dakika moja kisha ujaribu tena.",
  queueRest: (count) => `\n\n📋 Linki zilizobaki kwenye foleni: ${count}. Nitazionyesha moja baada ya nyingine baada ya hii.`,
  queuedOne: (position) =>
    `📋 Linki imewekwa kwenye foleni, #${position}. Tumalize ya sasa kwanza — kisha nitakuonyesha uchaguzi wa ubora wake.`,
  queuedMany: (added, waiting) =>
    `📋 Linki zilizoongezwa kwenye foleni: ${added}. Zinazosubiri kwa jumla: ${waiting}. Nitazionyesha moja baada ya nyingine baada ya ya sasa.`,
  queueDuplicates: (count) =>
    count === 1
      ? "Linki hii tayari iko kwenye foleni — siiongezi mara mbili."
      : `Linki zilizo tayari kwenye foleni haziongezwi mara mbili (marudio: ${count}).`,
  queueFull: (limit, rejected) =>
    `Foleni inabeba linki ${limit} tu kwa juu — zilizozidi hazikuongezwa (${rejected}). Zitume foleni ikishasonga.`,
  skipButton: "✖️ Usipakue",
  skipped: "⏭ Nimeiruka linki hii.",
  chooseTimedOut: "⌛ Hakuna ubora uliochaguliwa ndani ya dakika 30 — ninairuka linki hii.",
  queueLostOnRestart: (count) =>
    `⚠️ Bot inaanzishwa upya kwa ajili ya sasisho — foleni imefutwa (linki: ${count}). Tafadhali zitume tena baada ya dakika moja.`,
  subtitlesButton: "📝 Manukuu",
  subtitlesBack: "⬅️ Rudi kwenye ubora",
  subtitlesAuto: "otomatiki",
  subtitlesChoose: "Chagua lugha ya manukuu",
  subtitlesPreparing: "📝 Ninaandaa manukuu...",
  subtitlesFailed: "Sikuweza kupakua manukuu kwa lugha hii. Jaribu lugha nyingine.",
  subtitlesBusy: "YouTube haitoi manukuu kwa sasa — jaribu tena baada ya dakika chache.",
  playlistFound: (title, count) =>
    `📃 Orodha ya kucheza${title ? ` "${title.slice(0, 150)}"` : ""}: video ${count}.\nNitazipakua moja baada ya nyingine. Muundo gani?`,
  playlistStdButton: "🎬 720p",
  playlistHdButton: "🎬 Ubora bora zaidi",
  playlistAudioButton: "🎵 Sauti pekee (mp3)",
  playlistNoButton: "✖️ Hapana, asante",
  playlistQueued: (count) =>
    `📃 Video za orodha ya kucheza zilizowekwa kwenye foleni: ${count}. Nitazituma moja baada ya nyingine. Simamisha kwa kitufe kilicho hapa chini au /stop.`,
  playlistFailed: "Sikuweza kufungua orodha ya kucheza — huenda ni ya faragha. Tuma linki ya video moja.",
  stopButton: "⏹ Simamisha",
  stopped: (dropped) => `⏹ Imesimamishwa.${dropped ? ` Linki zilizoondolewa kwenye foleni: ${dropped}.` : ""}`,
  nothingToStop: "Hakuna kinachopakuliwa kwa sasa.",
  languageChoose: "🌐 Chagua lugha ya bot. \"Otomatiki\" inafuata Telegram yako.",
  languageChooseGroup: "🌐 Lugha ya majibu ya bot katika kikundi hiki. \"Otomatiki\" — lugha ya Telegram ya kila mwanachama.",
  languageAuto: "Otomatiki — kama kwenye Telegram",
  languageAutoGroup: "Otomatiki — ya kila mwanachama",
  languageSaved: (name) => `✅ Lugha ya bot: ${name}. Ibadilishe kwa /language.`,
  languageSavedAuto: "✅ Bot inafuata lugha yako ya Telegram. Ibadilishe kwa /language.",
  settingsLanguageButton: (name) => `🌐 Lugha: ${name ?? "otomatiki"}`,
  settingsBack: "⬅️ Rudi kwenye mipangilio",
};

const de: Messages = {
  start: "Hi! Schick mir einen Link zu einem Video von YouTube, TikTok, Instagram, Facebook, Twitter/X, Vimeo, VK, Rutube, OK.ru, Pinterest oder Threads — ich helfe dir, es herunterzuladen.\n\n✨ Keine Qualitätsgrenzen: Du bekommst alles, was die Plattform anbietet, bis zu 4K — solange die Datei in 2 GB passt, das Telegram-Limit für Bots. Kostenpflichtige Funktionen gibt es hier nicht.\n\nKomplett kostenlos: keine Abos, keine Werbung, keine In-App-Käufe.\n\n🧩 Lädst du am Computer herunter? Installiere die Browser-Erweiterung — direkt auf der Videoseite erscheint ein Download-Button: videoner.download/de/extension\n\n👥 Füg mich zu einer Gruppe hinzu, dann poste ich die Videos zu den Links, die dort geteilt werden.\n\n⚡ Ohne Qualitätsauswahl: Schreib -audio hinter den Link für nur den Ton (mp3) oder -hd für die beste Qualität.\n\n📣 Projekt-News: @videonerdownload\n\n🌐 Sprache des Bots: /language",
  notLink: "Das sieht nicht nach einem Link aus. Schick mir einen Videolink.",
  inviteGreeting: "Hi! Ich bin Videoner — ich lade kostenlos Videos von YouTube, TikTok, Instagram und anderen Plattformen herunter. Ich mache das Video bereit, das dir geschickt wurde 👇",
  inviteNotFound: "Zu diesem Einladungslink habe ich kein Video gefunden. Schick mir einen Videolink, und ich lade es herunter.",
  inviteUnavailable: "Ich konnte das Video über diesen Link nicht öffnen — der Dienst antwortet gerade nicht. Öffne denselben Link in einer Minute noch einmal.",
  fetchingInfo: "🔍 Videoinfos werden abgerufen...",
  audioOnlyButton: "🎵 Nur Audio (mp3)",
  photoButton: "📷 Fotos herunterladen",
  slideshowButton: "🎞 Diashow (Video)",
  galleryButton: "📷+🎞 Fotos und Diashow",
  chooseQuality: (title, duration) => `„${title}“${duration ? `\n⏱ ${duration}` : ""}\n\nWähle die Qualität:`,
  sessionExpired: "Sitzung abgelaufen — schick den Link noch einmal",
  downloading: "⏬ Wird heruntergeladen, das kann ein paar Minuten dauern...",
  downloadFailed: "Download fehlgeschlagen",
  downloadProgress: (percent, eta, done) =>
    `⏬ Download: ${percent}%${eta ? ` · noch ${eta}` : ""}${done ? `\n${done}` : ""}`,
  downloadFinishing: "⚙️ Fast fertig — die Datei wird zusammengesetzt...",
  converting: (percent) => `⚙️ Konvertierung: ${percent}%`,
  etaUnderMinute: "unter einer Minute",
  etaMinutes: (minutes) => `~${minutes} Min.`,
  etaHours: (hours, minutes) => `~${hours} Std.${minutes ? ` ${minutes} Min.` : ""}`,
  downloadTimeout: "der Download dauert zu lange — das Video scheint sehr groß zu sein. Versuch eine niedrigere Qualität.",
  downloadInterrupted: "⚠️ Der Bot startet für ein Update neu — dein Download wurde unterbrochen. Schick den Link bitte in einer Minute noch einmal.",
  fileTooBig: (mb, url) =>
    `Die Datei ist ziemlich groß geworden (${mb} MB) — Telegram lässt den Bot sie nicht senden.\nHier kannst du sie herunterladen: ${url}`,
  sendingFile: "📤 Datei wird gesendet...",
  sendingAlbum: (count) => `📤 Dieser Beitrag enthält mehrere Dateien (${count}) — ich sende sie als Album...`,
  failedPrefix: "❌ Fehlgeschlagen: ",
  fileCaption: (title, sourceUrl, shareUrl, description) =>
    composeCaption(
      title,
      description,
      `Quelle: ${sourceUrl}\n` +
        "Alle Rechte am Video liegen bei der Urheberin oder dem Urheber.\n" +
        "Kostenlos heruntergeladen mit @VideonerBot",
      `📣 Projekt-News: ${NEWS_CHANNEL}`,
      shareUrl && `🔗 Teilen: ${shareUrl}`,
    ),
  subscribeRequired: (channel) =>
    `Um herunterzuladen, abonniere bitte unseren Kanal ${channel} — das ist die einzige Bedingung, der Dienst bleibt kostenlos.\n\n` +
    "Abonniere ihn und tippe auf „Ich habe abonniert“.",
  openChannelButton: "📣 Kanal öffnen",
  checkSubscriptionButton: "Ich habe abonniert",
  subscribeThanks: "Danke! Schick mir jetzt einen Link zu einem Video.",
  subscribeThanksResuming: "Danke! Ich kümmere mich jetzt um deinen Link.",
  subscribeStillMissing: "Ich sehe das Abo noch nicht. Abonniere den Kanal und tippe noch einmal.",
  channelNotice: (channel) => `\n\nDer Link zu diesem Beitrag erscheint in ${channel} — anonym, ohne deinen Namen.`,
  channelPost: (title, url) =>
    (title ? `🎬 ${title.slice(0, 200)}\n\n` : "") +
    `${url}\n\n` +
    "Dieses und jedes andere Video kostenlos herunterladen: @VideonerBot",
  errorStoryNeedsId:
    "schick einen Link zu einer bestimmten Story: Öffne sie in der Instagram-App und tippe auf Teilen → Link kopieren.",
  errorInstagramStory:
    "Instagram-Storys sind nur für angemeldete Nutzer sichtbar.",
  errorLoginRequired:
    "Dieser Beitrag ist ohne Anmeldung nicht verfügbar: Die Plattform zeigt ihn nur " +
    "angemeldeten Nutzern. Das betrifft private Beiträge, Inhalte mit Altersbeschränkung und " +
    "Beiträge, die nur mit einem eingeschränkten Publikum geteilt wurden.\n\n" +
    "Öffentliche Beiträge lassen sich problemlos herunterladen — versuch einen anderen Link.",
  errorUnsupportedPlatform:
    "Diesen Link konnte ich nicht erkennen — stell sicher, dass es ein direkter Videolink von YouTube, TikTok, Instagram, Facebook, Twitter/X, Vimeo, VK, Rutube, OK.ru, Pinterest oder Threads ist.",
  errorFileTooLarge: "die Datei ist größer als 2 GB — größere Dateien dürfen Bots bei Telegram nicht senden. Lade sie auf der Website oder mit der Browser-Erweiterung herunter — Buttons unten. Oder schick den Link noch einmal und wähle eine niedrigere Qualität.",
  siteButton: "🌐 Auf der Website herunterladen",
  qualitiesHiddenBySize: (limit) =>
    `\n\n⚖️ Qualitäten über ${limit} sind ausgeblendet: Telegram lässt Bots keine größeren Dateien senden. Du kannst sie auf der Website oder mit der Browser-Erweiterung herunterladen — Buttons unten.`,
  videoTooBigForTelegram: (smallest) =>
    `\n\n⚖️ Dieses Video ist selbst in der niedrigsten Qualität zu groß für Telegram (~${smallest}): Telegram lässt Bots keine Dateien über 2 GB senden. Hier bekommst du nur den Ton; das Video — auf der Website oder mit der Browser-Erweiterung (Buttons unten).`,
  errorFormatUnavailable: "Diese Qualität ist für dieses Video nicht verfügbar. Schick den Link noch einmal — ich zeige dir die aktuelle Liste.",
  errorNoVideoContent: "Unter diesem Link gibt es kein Video zum Herunterladen — der Beitrag scheint nur Fotos zu enthalten.",
  errorRegionBlocked:
    "Dieses Video ist außerhalb des Landes der Urheberin oder des Urhebers gesperrt — die Plattform gibt es " +
    "unserem Server nicht heraus. Daran lässt sich nichts ändern: Die Sperre liegt bei der Plattform." +
    "\n\nAndere Links werden wie gewohnt heruntergeladen.",
  errorRateLimited: "Zu viele Links hintereinander — warte kurz und schick ihn noch einmal.",
  errorYoutubeDailyLimit: (gb) => `du hast in den letzten 24 Stunden mehr als ${gb} GB von YouTube heruntergeladen — das ist das Tageslimit des Bots pro Person. Gezählt werden die letzten 24 Stunden, also kannst du neue YouTube-Videos etwas später herunterladen. Andere Plattformen funktionieren wie gewohnt.`,
  playlistStoppedByLimit: (dropped) => `⏹ Playlist gestoppt: Das tägliche YouTube-Limit ist erreicht. Nicht heruntergeladene Videos: ${dropped}. Schick den Playlist-Link später noch einmal.`,
  errorPlatformRefused:
    "die Plattform hat dieses Video unserem Server nicht herausgegeben. Das passiert bei privaten " +
    "Beiträgen oder Inhalten mit Altersbeschränkung, und manchmal schränkt die Plattform den Zugriff einfach " +
    "vorübergehend ein. Versuch es in ein paar Minuten noch einmal.",
  errorThreadsNoMedia:
    "in diesem Threads-Beitrag ist kein Video und kein Foto zu sehen. Entweder ist es ein reiner Textbeitrag, oder " +
    "Threads zeigt die Medien nur angemeldeten Nutzern — solche Beiträge lassen sich ohne Anmeldung nicht herunterladen.",
  extensionHint:
    "\n\n💻 Du kannst es am Computer mit der Browser-Erweiterung von Videoner herunterladen: " +
    "Sie lädt mit deiner eigenen Anmeldung auf der Plattform herunter, und weder Passwort noch Cookies verlassen deinen Browser.",
  privateConnectHint: (platform, withExtension) =>
    `\n\n🔑 Um solche Beiträge herunterzuladen, verbinde dein ${platform}-Konto mit dem Bot — nur einmal. Danach lädt der Bot alles herunter, was du sehen kannst: private Beiträge, Reels und Storys, auch vom Handy aus. Der Button unten zeigt, wie es geht.${withExtension ? "\n\n💻 Oder lade es am Computer mit der Browser-Erweiterung von Videoner herunter." : ""}`,
  privateReconnectHint: (platform, withExtension) =>
    `\n\n⚠️ Dein verbundenes ${platform}-Konto konnte diesen Beitrag nicht öffnen. Vielleicht funktioniert die Anmeldung nicht mehr — verbinde das Konto erneut. Oder dieses Konto hat keinen Zugriff auf den Beitrag.${withExtension ? "\n\n💻 Du kannst es auch am Computer mit der Browser-Erweiterung von Videoner herunterladen." : ""}`,
  connectAccountButton: "🔑 Konto verbinden",
  reconnectAccountButton: "🔑 Erneut verbinden",
  extensionButton: "🧩 Mit der Erweiterung herunterladen",
  extensionCommand:
    "🧩 Videoner für deinen Browser: ein Download-Button direkt auf der Videoseite — YouTube, Instagram, TikTok, VK, private Videos aus deinem Konto und GetCourse-Lektionen.\n\nFür Chrome, Edge, Opera, Yandex Browser und Firefox am Computer.",
  extensionPageButton: "🧩 Erweiterung installieren",
  addToGroupButton: "👥 Zu einer Gruppe hinzufügen",
  newsButton: "📣 Projekt-News",
  fileCaptionShort: (title, sourceUrl) =>
    withOptionalLines((title ? `🎬 ${title.slice(0, 200)}\n\n` : "") + sourceUrl, `📣 Projekt-News: ${NEWS_CHANNEL}`, undefined),
  sentBy: (name) => `👤 ${name}`,
  groupSettings: (s, canDelete) =>
    "⚙️ Bot-Einstellungen für diese Gruppe\n\n" +
    `🗑 Nachricht mit dem Link löschen: ${s.deleteLinks ? "ja" : "nein"}\n` +
    "Sobald das Video gesendet ist, wird eine Nachricht, die nur den Link enthielt, gelöscht — im Chat bleibt nur das Video mit dem Namen der Person, die es geteilt hat.\n" +
    (s.deleteLinks && !canDelete
      ? "⚠️ Ich kann gerade keine Nachrichten löschen: Mach mich zum Admin mit dem Recht „Nachrichten löschen“.\n"
      : "") +
    `\n✍️ Beschriftung unter dem Video: ${{ full: "vollständig", short: "Titel und Quelle", none: "keine Beschriftung" }[s.caption] ?? s.caption}\n` +
    `\n🎞 Qualität: ${s.quality === "max" ? "die höchste, die Telegram annimmt" : "Standard (720p)"}\n` +
    `\n⏱ Lange Videos: ${s.longVideos ? "beliebige Länge" : "nur bis 15 Minuten"}\n` +
    `\n🔑 Wer eigene Konten verbinden darf (für Storys und private Beiträge): ${s.cookiesBy === "all" ? "jedes Mitglied" : "nur Admins"}\n` +
    `\n🌐 Antwortsprache: ${s.language ? langName(s.language) : "die eigene jedes Mitglieds"}\n` +
    "\nNur Gruppen-Admins können die Einstellungen ändern.",
  settingsDeleteButton: (on) => `🗑 Links löschen: ${on ? "ja" : "nein"}`,
  settingsCaptionButton: (style) => `✍️ Beschriftung: ${{ full: "vollständig", short: "kurz", none: "keine" }[style] ?? style}`,
  settingsQualityButton: (mode) => `🎞 Qualität: ${mode === "max" ? "höchste" : "720p"}`,
  settingsLongButton: (on) => `⏱ Lange Videos: ${on ? "ja" : "bis 15 Min."}`,
  settingsDoneButton: "✅ Fertig",
  settingsAdminsOnly: "Nur Gruppen-Admins können die Einstellungen ändern.",
  settingsGroupsOnly: "Die Einstellungen gelten für Gruppen: Füg mich zu einer Gruppe hinzu und schick dort /settings.",
  settingsFailed: "Die Einstellungen konnten nicht gespeichert werden, bitte versuch es noch einmal.",
  settingsCookiesButton: (by) => `🔑 Konten verbinden: ${by === "all" ? "alle" : "Admins"}`,
  accountsIntro:
    "🔑 Verbundene Konten\n\nDer Bot kann herunterladen, was nur angemeldete Personen sehen (Instagram-Storys, private Beiträge) — über dein Konto. Eine Anmeldung gilt dort, wo du sie verbunden hast: eine im privaten Chat für deine Downloads, auch für deine eigenen Links in Gruppen ohne eigenes Konto; eine mit einer Gruppe verbundene für alle ihre Mitglieder.",
  accountsHowTo:
    "So verbindest du ein Konto:\n1. Am einfachsten: die Videoner-Erweiterung am Computer — melde dich auf der Website der Plattform an, öffne das Videoner-Fenster, tippe auf «🔑 Dein …-Konto mit dem Bot verbinden» und schick mir den Code. Für eine Gruppe schick /connect CODE in dieser Gruppe.\n2. Oder schick mir eine cookies.txt-Datei (aus dem Browser exportierte Cookies) oder füge ihren Text als Nachricht ein.\n3. Vom Android-Handy aus — mit Firefox und dem Add-on Cookie-Editor: https://videoner.download/de/blog/android-firefox",
  accountsWarning:
    "⚠️ Plattformen mögen keine automatisierten Downloads und können das Konto einschränken oder sperren. Verbinde lieber ein Zweitkonto, nicht dein Hauptkonto. Cookies werden verschlüsselt gespeichert, nur für Downloads verwendet und mit den Buttons unten gelöscht.",
  accountsNone: "Noch nichts verbunden.",
  accountsGroupTitle: "🔑 Mit dieser Gruppe verbundene Konten",
  accountsGroupHowTo:
    "Um ein Konto für die ganze Gruppe zu verbinden: Hol dir mit dem Button «🔑 Dein …-Konto mit dem Bot verbinden» in der Videoner-Erweiterung einen Code und schick hier /connect CODE. Wenn du ein Konto nur in deinem privaten Chat verbunden hast, nutzt der Bot es hier für deine eigenen Links. Deine Verbindungen: /accounts im privaten Chat mit @VideonerBot.",
  accountsLine: (platform, where, active) => `• ${platform} — ${where}${active ? "" : " (⚠️ Anmeldung funktioniert nicht)"}`,
  accountsGroupLine: (platform, owner, active) => `• ${platform} — ${owner}${active ? "" : " (⚠️ Anmeldung funktioniert nicht)"}`,
  accountsWhereHere: "privater Chat",
  accountsWhereGroup: (title) => `Gruppe „${title}“`,
  accountsDeleteButton: (platform, where) => `🗑 ${platform} · ${where}`,
  accountsDeleteAllButton: "🗑 Alle meine Verbindungen entfernen",
  accountsDeleted: "Entfernt.",
  accountsDeletedAll: (n) => `Entfernte Verbindungen: ${n}.`,
  accountsNotAllowed: "Entfernen kann nur die Person, die es verbunden hat, oder ein Gruppen-Admin.",
  connectUsage:
    "Schick /connect CODE. Den Code bekommst du über den Button «🔑 Dein …-Konto mit dem Bot verbinden» in der Videoner-Erweiterung am Computer. Deine Verbindungen: /accounts.",
  connectOnlyAdmins: "Nur Admins können Konten mit dieser Gruppe verbinden (siehe /settings).",
  connectDone: (platform, where) =>
    `✅ ${platform} ${where} verbunden. Der Bot lädt jetzt auch herunter, was nur angemeldete Personen sehen. Ansehen oder entfernen: /accounts.\n\n⚠️ Die Plattform kann das Konto wegen automatisierter Downloads einschränken — nimm lieber ein Zweitkonto.`,
  connectWhereGroup: "mit dieser Gruppe",
  connectWhereHere: "für deine Downloads im privaten Chat und im Inline-Modus",
  connectCodeNotFound: "Code nicht gefunden oder abgelaufen (Codes gelten 10 Minuten). Hol dir einen neuen in der Videoner-Erweiterung.",
  connectRejectedNoSession: "In diesen Cookies ist keine Anmeldung enthalten. Melde dich auf der Website der Plattform an und exportiere die Cookies noch einmal.",
  connectRejectedUnknown: "Keine Cookies unterstützter Plattformen gefunden: Instagram, Facebook, YouTube, X, VK, TikTok.",
  connectUnavailable: "Das Verbinden von Konten ist noch nicht verfügbar.",
  connectFailed: "Verbinden fehlgeschlagen, bitte versuch es noch einmal.",
  connectFileTooBig: "Die Datei ist zu groß — exportiere nur die Cookies der benötigten Website.",
  connectNotAnonymous: "Verbinde das Konto als du selbst, nicht anonym im Namen der Gruppe: Sonst geraten die Verbindungen der Admins durcheinander. Den Code habe ich gelöscht — hol dir einen neuen.",
  connectCodeInGroup:
    "Einen im Gruppenchat geposteten Verbindungscode können andere sehen — ich habe ihn ungültig gemacht und die Nachricht entfernt. Hol dir einen neuen und schick ihn mit /connect CODE: Die Nachricht mit dem Befehl lösche ich sofort.",
  groupWelcome:
    "👋 Hi! Postet in diesem Chat Links zu Videos von TikTok, Instagram, YouTube, VK und anderen Plattformen — ich antworte mit dem Video selbst.\n\n" +
    "Clips bis 15 Minuten lade ich von selbst herunter, ganz ohne Befehle, und sonst halte ich mich zurück.\n\n⚙️ Gruppen-Admins können mich mit /settings anpassen: Link-Nachrichten löschen, Beschriftung, Qualität, lange Videos und Sprache.\n\n⚡ Schreib -audio hinter einen Link, um nur den Ton zu bekommen, oder -hd für die beste Qualität.\n\n📣 Projekt-News: @videonerdownload",
  errorTooLong: "das Video ist zu lang — so lange Videos können wir noch nicht herunterladen.",
  errorUnknown: "dieses Video konnte nicht heruntergeladen werden. Versuch es etwas später noch einmal oder schick einen anderen Link.",
  inlineHintButton: "Link an den Bot schicken",
  inlineResultTitle: "⬇️ Video herunterladen",
  inlineResultDescription: "Das Video wird direkt in diesem Chat gepostet",
  inlinePlaceholder: "⏬ Wird heruntergeladen, das kann ein paar Minuten dauern...",
  inlineOpenBot: "Bot öffnen",
  inlineOnlySingleVideo:
    "In diesem Modus wird ein einzelnes Video gesendet. Für Beiträge mit mehreren Dateien oder Fotos schick den Link im privaten Chat an den Bot.",
  inlineSubscribeRequired: (channel: string) =>
    `Um herunterzuladen, abonniere ${channel} und versuch es noch einmal.`,
  inlineRateLimited: "Zu viele Anfragen hintereinander. Warte eine Minute und versuch es noch einmal.",
  queueRest: (count) => `\n\n📋 Noch in der Warteschlange: ${count}. Ich zeige sie dir nach diesem nacheinander.`,
  queuedOne: (position) =>
    `📋 Link in die Warteschlange gestellt, Nr. ${position}. Erst machen wir den aktuellen fertig — dann zeige ich dir die Qualitätsauswahl dafür.`,
  queuedMany: (added, waiting) =>
    `📋 Links zur Warteschlange hinzugefügt: ${added}. Insgesamt wartend: ${waiting}. Ich zeige sie dir nach dem aktuellen nacheinander.`,
  queueDuplicates: (count) =>
    count === 1
      ? "Dieser Link ist schon in der Warteschlange — ich füge ihn nicht doppelt hinzu."
      : `Links, die schon in der Warteschlange sind, werden nicht doppelt hinzugefügt (Wiederholungen: ${count}).`,
  queueFull: (limit, rejected) =>
    `In die Warteschlange passen höchstens ${limit} Links — die übrigen wurden nicht hinzugefügt (${rejected}). Schick sie, sobald es weitergeht.`,
  skipButton: "✖️ Nicht herunterladen",
  skipped: "⏭ Link übersprungen.",
  chooseTimedOut: "⌛ Innerhalb von 30 Minuten wurde keine Qualität gewählt — ich überspringe diesen Link.",
  queueLostOnRestart: (count) =>
    `⚠️ Der Bot startet für ein Update neu — die Warteschlange wurde zurückgesetzt (Links: ${count}). Schick sie bitte in einer Minute noch einmal.`,
  subtitlesButton: "📝 Untertitel",
  subtitlesBack: "⬅️ Zurück zur Qualität",
  subtitlesAuto: "automatisch",
  subtitlesChoose: "Wähle die Sprache der Untertitel",
  subtitlesPreparing: "📝 Untertitel werden vorbereitet...",
  subtitlesFailed: "Untertitel in dieser Sprache konnten nicht heruntergeladen werden. Versuch eine andere Sprache.",
  subtitlesBusy: "YouTube liefert gerade keine Untertitel — versuch es in ein paar Minuten noch einmal.",
  playlistFound: (title, count) =>
    `📃 Playlist${title ? ` „${title.slice(0, 150)}“` : ""}: ${count} Videos.\nIch lade sie nacheinander herunter. In welchem Format?`,
  playlistStdButton: "🎬 720p",
  playlistHdButton: "🎬 Beste Qualität",
  playlistAudioButton: "🎵 Nur Audio (mp3)",
  playlistNoButton: "✖️ Nein, danke",
  playlistQueued: (count) =>
    `📃 Videos aus der Playlist in der Warteschlange: ${count}. Ich schicke sie nacheinander. Stoppen mit dem Button unten oder /stop.`,
  playlistFailed: "Die Playlist konnte nicht geöffnet werden — vielleicht ist sie privat. Schick einen Link zu einem einzelnen Video.",
  stopButton: "⏹ Stopp",
  stopped: (dropped) => `⏹ Gestoppt.${dropped ? ` Aus der Warteschlange entfernte Links: ${dropped}.` : ""}`,
  nothingToStop: "Gerade wird nichts heruntergeladen.",
  languageChoose: "🌐 Wähle die Sprache des Bots. „Automatisch“ folgt deinem Telegram.",
  languageChooseGroup: "🌐 Antwortsprache des Bots in dieser Gruppe. „Automatisch“ — die Telegram-Sprache jedes Mitglieds.",
  languageAuto: "Automatisch — wie in Telegram",
  languageAutoGroup: "Automatisch — die eigene jedes Mitglieds",
  languageSaved: (name) => `✅ Sprache des Bots: ${name}. Ändern mit /language.`,
  languageSavedAuto: "✅ Der Bot folgt deiner Telegram-Sprache. Ändern mit /language.",
  settingsLanguageButton: (name) => `🌐 Sprache: ${name ?? "automatisch"}`,
  settingsBack: "⬅️ Zurück zu den Einstellungen",
};

const fr: Messages = {
  start: "Bonjour ! Envoyez-moi le lien d'une vidéo YouTube, TikTok, Instagram, Facebook, Twitter/X, Vimeo, VK, Rutube, OK.ru, Pinterest ou Threads — je vous aide à la télécharger.\n\n✨ Aucune limite de qualité : vous obtenez tout ce que propose la plateforme, jusqu'en 4K — tant que le fichier tient dans 2 Go, la limite de Telegram pour les bots. Il n'y a aucune fonction payante ici.\n\nEntièrement gratuit : pas d'abonnement, pas de publicité, pas d'achats intégrés.\n\n🧩 Vous téléchargez sur ordinateur ? Installez l'extension pour navigateur — un bouton Télécharger apparaît directement sur la page de la vidéo : videoner.download/fr/extension\n\n👥 Ajoutez-moi à un groupe et je publierai les vidéos des liens qui y sont partagés.\n\n⚡ Sans choisir la qualité : ajoutez -audio après le lien pour le son seul (mp3), ou -hd pour la meilleure qualité.\n\n📣 Actualités du projet : @videonerdownload\n\n🌐 Langue du bot : /language",
  notLink: "Cela ne ressemble pas à un lien. Envoyez-moi le lien d'une vidéo.",
  inviteGreeting: "Bonjour ! Je suis Videoner — je télécharge gratuitement des vidéos YouTube, TikTok, Instagram et d'autres plateformes. Je prépare la vidéo qu'on vous a partagée 👇",
  inviteNotFound: "Je n'ai pas trouvé de vidéo pour ce lien d'invitation. Envoyez-moi le lien d'une vidéo et je la téléchargerai.",
  inviteUnavailable: "Je n'ai pas pu ouvrir la vidéo de ce lien — le service ne répond pas pour le moment. Rouvrez le même lien dans une minute.",
  fetchingInfo: "🔍 Récupération des infos de la vidéo...",
  audioOnlyButton: "🎵 Audio seul (mp3)",
  photoButton: "📷 Télécharger les photos",
  slideshowButton: "🎞 Diaporama (vidéo)",
  galleryButton: "📷+🎞 Photos et diaporama",
  chooseQuality: (title, duration) => `« ${title} »${duration ? `\n⏱ ${duration}` : ""}\n\nChoisissez la qualité :`,
  sessionExpired: "Session expirée — renvoyez le lien",
  downloading: "⏬ Téléchargement en cours, cela peut prendre quelques minutes...",
  downloadFailed: "le téléchargement a échoué",
  downloadProgress: (percent, eta, done) =>
    `⏬ Téléchargement : ${percent} %${eta ? ` · encore ${eta}` : ""}${done ? `\n${done}` : ""}`,
  downloadFinishing: "⚙️ Presque fini — assemblage du fichier...",
  converting: (percent) => `⚙️ Conversion : ${percent} %`,
  etaUnderMinute: "moins d'une minute",
  etaMinutes: (minutes) => `~${minutes} min`,
  etaHours: (hours, minutes) => `~${hours} h${minutes ? ` ${minutes} min` : ""}`,
  downloadTimeout: "le téléchargement prend trop de temps — la vidéo semble très lourde. Essayez une qualité inférieure.",
  downloadInterrupted: "⚠️ Le bot redémarre pour une mise à jour — votre téléchargement a été interrompu. Renvoyez le lien dans une minute.",
  fileTooBig: (mb, url) =>
    `Le fichier est trop lourd (${mb} Mo) — Telegram ne permet pas au bot de l'envoyer.\nTéléchargez-le ici : ${url}`,
  sendingFile: "📤 Envoi du fichier...",
  sendingAlbum: (count) => `📤 Cette publication contient plusieurs fichiers (${count}) — je les envoie sous forme d'album...`,
  failedPrefix: "❌ Échec : ",
  fileCaption: (title, sourceUrl, shareUrl, description) =>
    composeCaption(
      title,
      description,
      `Source : ${sourceUrl}\n` +
        "Tous les droits sur la vidéo appartiennent à son auteur.\n" +
        "Téléchargée gratuitement avec @VideonerBot",
      `📣 Actualités du projet : ${NEWS_CHANNEL}`,
      shareUrl && `🔗 Partager : ${shareUrl}`,
    ),
  subscribeRequired: (channel) =>
    `Pour télécharger, abonnez-vous à notre chaîne ${channel} — c'est la seule condition, le service reste gratuit.\n\n` +
    "Abonnez-vous puis appuyez sur « Je suis abonné ».",
  openChannelButton: "📣 Ouvrir la chaîne",
  checkSubscriptionButton: "Je suis abonné",
  subscribeThanks: "Merci ! Envoyez-moi maintenant le lien d'une vidéo.",
  subscribeThanksResuming: "Merci ! Je reprends votre lien.",
  subscribeStillMissing: "Je ne vois pas encore l'abonnement. Abonnez-vous et appuyez à nouveau.",
  channelNotice: (channel) => `\n\nLe lien vers cette publication apparaîtra dans ${channel} — anonymement, sans votre nom.`,
  channelPost: (title, url) =>
    (title ? `🎬 ${title.slice(0, 200)}\n\n` : "") +
    `${url}\n\n` +
    "Téléchargez cette vidéo et toutes les autres gratuitement : @VideonerBot",
  errorStoryNeedsId:
    "envoyez le lien d'une story précise : ouvrez-la dans l'application Instagram et appuyez sur Partager → Copier le lien.",
  errorInstagramStory:
    "Les stories Instagram ne sont visibles que par les personnes connectées.",
  errorLoginRequired:
    "Cette publication n'est pas accessible sans connexion : la plateforme ne la montre qu'aux " +
    "utilisateurs connectés. C'est le cas des publications privées, des contenus soumis à une limite d'âge et " +
    "des publications partagées avec un public restreint.\n\n" +
    "Les publications publiques se téléchargent sans problème — essayez un autre lien.",
  errorUnsupportedPlatform:
    "Je n'ai pas reconnu ce lien — vérifiez qu'il s'agit d'un lien direct vers une vidéo YouTube, TikTok, Instagram, Facebook, Twitter/X, Vimeo, VK, Rutube, OK.ru, Pinterest ou Threads.",
  errorFileTooLarge: "le fichier dépasse 2 Go — Telegram ne permet pas aux bots d'envoyer des fichiers plus lourds. Téléchargez-le sur le site ou avec l'extension pour navigateur — boutons ci-dessous. Ou renvoyez le lien et choisissez une qualité inférieure.",
  siteButton: "🌐 Télécharger sur le site",
  qualitiesHiddenBySize: (limit) =>
    `\n\n⚖️ Les qualités plus lourdes que ${limit} sont masquées : Telegram ne permet pas aux bots d'envoyer des fichiers plus volumineux. Vous pouvez les télécharger sur le site ou avec l'extension pour navigateur — boutons ci-dessous.`,
  videoTooBigForTelegram: (smallest) =>
    `\n\n⚖️ Cette vidéo est trop lourde pour Telegram, même dans la qualité la plus basse (~${smallest}) : Telegram ne permet pas aux bots d'envoyer des fichiers de plus de 2 Go. Ici, vous pouvez obtenir l'audio seul ; la vidéo — sur le site ou avec l'extension pour navigateur (boutons ci-dessous).`,
  errorFormatUnavailable: "Cette qualité n'est pas disponible pour cette vidéo. Renvoyez le lien — je vous montrerai la liste à jour.",
  errorNoVideoContent: "Ce lien ne contient aucune vidéo à télécharger — la publication semble ne contenir que des photos.",
  errorRegionBlocked:
    "Cette vidéo est bloquée en dehors du pays de l'auteur — la plateforme refuse de la " +
    "fournir à notre serveur. Impossible de contourner cela : la restriction vient de leur côté." +
    "\n\nLes autres liens se téléchargent normalement.",
  errorRateLimited: "Trop de liens d'affilée — patientez un peu et renvoyez-le.",
  errorYoutubeDailyLimit: (gb) => `vous avez téléchargé plus de ${gb} Go depuis YouTube au cours des dernières 24 heures — c'est la limite quotidienne du bot par personne. Le calcul porte sur les 24 dernières heures, vous pourrez donc télécharger de nouvelles vidéos YouTube un peu plus tard. Les autres plateformes fonctionnent normalement.`,
  playlistStoppedByLimit: (dropped) => `⏹ Playlist arrêtée : la limite quotidienne YouTube est atteinte. Vidéos non téléchargées : ${dropped}. Renvoyez le lien de la playlist plus tard.`,
  errorPlatformRefused:
    "la plateforme n'a pas fourni cette vidéo à notre serveur. Cela arrive avec les publications " +
    "privées ou soumises à une limite d'âge, et parfois la plateforme limite simplement l'accès " +
    "pendant un moment. Réessayez dans quelques minutes.",
  errorThreadsNoMedia:
    "aucune vidéo ni photo n'est visible dans cette publication Threads. Soit c'est une publication uniquement textuelle, soit " +
    "Threads n'affiche ses médias qu'aux utilisateurs connectés — ce type de publication ne peut pas être téléchargé sans connexion.",
  extensionHint:
    "\n\n💻 Vous pouvez la télécharger avec l'extension Videoner pour navigateur sur ordinateur : " +
    "elle télécharge avec votre propre connexion à la plateforme, et aucun mot de passe ni cookie ne quitte votre navigateur.",
  privateConnectHint: (platform, withExtension) =>
    `\n\n🔑 Pour télécharger ce type de publication, connectez votre compte ${platform} au bot — une seule fois. Ensuite, le bot télécharge tout ce que vous pouvez voir : publications privées, reels et stories, y compris depuis votre téléphone. Le bouton ci-dessous explique comment faire.${withExtension ? "\n\n💻 Ou téléchargez-la avec l'extension Videoner pour navigateur sur ordinateur." : ""}`,
  privateReconnectHint: (platform, withExtension) =>
    `\n\n⚠️ Votre compte ${platform} connecté n'a pas pu ouvrir cette publication. La connexion ne fonctionne peut-être plus — reconnectez le compte. Ou ce compte n'a pas accès à la publication.${withExtension ? "\n\n💻 Vous pouvez aussi la télécharger avec l'extension Videoner pour navigateur sur ordinateur." : ""}`,
  connectAccountButton: "🔑 Connecter un compte",
  reconnectAccountButton: "🔑 Reconnecter",
  extensionButton: "🧩 Télécharger avec l'extension",
  extensionCommand:
    "🧩 Videoner pour votre navigateur : un bouton Télécharger directement sur la page de la vidéo — YouTube, Instagram, TikTok, VK, vidéos privées de votre compte et cours GetCourse.\n\nPour Chrome, Edge, Opera, Yandex Browser et Firefox sur ordinateur.",
  extensionPageButton: "🧩 Installer l'extension",
  addToGroupButton: "👥 Ajouter à un groupe",
  newsButton: "📣 Actualités du projet",
  fileCaptionShort: (title, sourceUrl) =>
    withOptionalLines((title ? `🎬 ${title.slice(0, 200)}\n\n` : "") + sourceUrl, `📣 Actualités du projet : ${NEWS_CHANNEL}`, undefined),
  sentBy: (name) => `👤 ${name}`,
  groupSettings: (s, canDelete) =>
    "⚙️ Paramètres du bot pour ce groupe\n\n" +
    `🗑 Supprimer le message contenant le lien : ${s.deleteLinks ? "oui" : "non"}\n` +
    "Une fois la vidéo envoyée, le message qui ne contenait que le lien est supprimé — le chat ne garde que la vidéo avec le nom de la personne qui l'a partagée.\n" +
    (s.deleteLinks && !canDelete
      ? "⚠️ Je ne peux pas supprimer de messages pour le moment : faites de moi un administrateur avec le droit « Supprimer des messages ».\n"
      : "") +
    `\n✍️ Légende sous la vidéo : ${{ full: "complète", short: "titre et source", none: "aucune légende" }[s.caption] ?? s.caption}\n` +
    `\n🎞 Qualité : ${s.quality === "max" ? "la plus élevée acceptée par Telegram" : "standard (720p)"}\n` +
    `\n⏱ Vidéos longues : ${s.longVideos ? "toute durée" : "15 minutes maximum"}\n` +
    `\n🔑 Qui peut connecter ses comptes (pour les stories et publications privées) : ${s.cookiesBy === "all" ? "tous les membres" : "administrateurs uniquement"}\n` +
    `\n🌐 Langue des réponses : ${s.language ? langName(s.language) : "celle de chaque membre"}\n` +
    "\nSeuls les administrateurs du groupe peuvent modifier les paramètres.",
  settingsDeleteButton: (on) => `🗑 Supprimer les liens : ${on ? "oui" : "non"}`,
  settingsCaptionButton: (style) => `✍️ Légende : ${{ full: "complète", short: "courte", none: "aucune" }[style] ?? style}`,
  settingsQualityButton: (mode) => `🎞 Qualité : ${mode === "max" ? "maximale" : "720p"}`,
  settingsLongButton: (on) => `⏱ Vidéos longues : ${on ? "oui" : "15 min max"}`,
  settingsDoneButton: "✅ Terminé",
  settingsAdminsOnly: "Seuls les administrateurs du groupe peuvent modifier les paramètres.",
  settingsGroupsOnly: "Les paramètres concernent les groupes : ajoutez-moi à un groupe et envoyez-y /settings.",
  settingsFailed: "Impossible d'enregistrer les paramètres, réessayez.",
  settingsCookiesButton: (by) => `🔑 Connexion des comptes : ${by === "all" ? "tout le monde" : "admins"}`,
  accountsIntro:
    "🔑 Comptes connectés\n\nLe bot peut télécharger ce que seules les personnes connectées voient (stories Instagram, publications privées) — avec votre compte. Une connexion fonctionne là où vous l'avez faite : celle du chat privé sert à vos téléchargements, y compris vos propres liens dans les groupes qui n'ont pas de compte à eux ; celle d'un groupe sert à tous ses membres.",
  accountsHowTo:
    "Comment connecter un compte :\n1. Le plus simple : l'extension Videoner sur ordinateur — connectez-vous sur le site de la plateforme, ouvrez la fenêtre Videoner, appuyez sur «🔑 Connecter votre compte … au bot» et envoyez-moi le code. Pour un groupe, envoyez /connect CODE dans ce groupe.\n2. Ou envoyez-moi un fichier cookies.txt (cookies exportés depuis le navigateur), ou collez son texte dans un message.\n3. Depuis un téléphone Android — avec Firefox et le module Cookie-Editor : https://videoner.download/fr/blog/android-firefox",
  accountsWarning:
    "⚠️ Les plateformes n'aiment pas les téléchargements automatisés et peuvent restreindre ou bannir le compte. Mieux vaut connecter un compte secondaire plutôt que votre compte principal. Les cookies sont stockés chiffrés, servent uniquement aux téléchargements et se suppriment avec les boutons ci-dessous.",
  accountsNone: "Rien n'est encore connecté.",
  accountsGroupTitle: "🔑 Comptes connectés à ce groupe",
  accountsGroupHowTo:
    "Pour connecter un compte pour tout le groupe : obtenez un code avec le bouton «🔑 Connecter votre compte … au bot» dans l'extension Videoner et envoyez ici /connect CODE. Si vous avez connecté un compte uniquement dans votre chat privé, le bot l'utilise ici pour vos propres liens. Vos connexions : /accounts dans un chat privé avec @VideonerBot.",
  accountsLine: (platform, where, active) => `• ${platform} — ${where}${active ? "" : " (⚠️ la connexion ne fonctionne pas)"}`,
  accountsGroupLine: (platform, owner, active) => `• ${platform} — ${owner}${active ? "" : " (⚠️ la connexion ne fonctionne pas)"}`,
  accountsWhereHere: "chat privé",
  accountsWhereGroup: (title) => `groupe « ${title} »`,
  accountsDeleteButton: (platform, where) => `🗑 ${platform} · ${where}`,
  accountsDeleteAllButton: "🗑 Supprimer toutes mes connexions",
  accountsDeleted: "Supprimé.",
  accountsDeletedAll: (n) => `Connexions supprimées : ${n}.`,
  accountsNotAllowed: "Seule la personne qui l'a connecté ou un administrateur du groupe peut le supprimer.",
  connectUsage:
    "Envoyez /connect CODE. Le bouton «🔑 Connecter votre compte … au bot» de l'extension Videoner sur ordinateur vous donne le code. Vos connexions : /accounts.",
  connectOnlyAdmins: "Seuls les administrateurs peuvent connecter des comptes à ce groupe (voir /settings).",
  connectDone: (platform, where) =>
    `✅ ${platform} connecté ${where}. Le bot télécharge désormais aussi ce que seules les personnes connectées voient. Voir ou supprimer : /accounts.\n\n⚠️ La plateforme peut restreindre le compte pour téléchargements automatisés — mieux vaut utiliser un compte secondaire.`,
  connectWhereGroup: "à ce groupe",
  connectWhereHere: "pour vos téléchargements dans le chat privé et en mode inline",
  connectCodeNotFound: "Code introuvable ou expiré (les codes sont valables 10 minutes). Obtenez-en un nouveau dans l'extension Videoner.",
  connectRejectedNoSession: "Ces cookies ne contiennent pas de connexion. Connectez-vous sur le site de la plateforme et exportez à nouveau les cookies.",
  connectRejectedUnknown: "Aucun cookie des plateformes prises en charge : Instagram, Facebook, YouTube, X, VK, TikTok.",
  connectUnavailable: "La connexion de comptes n'est pas encore disponible.",
  connectFailed: "Impossible de connecter le compte, réessayez.",
  connectFileTooBig: "Le fichier est trop volumineux — exportez uniquement les cookies du site concerné.",
  connectNotAnonymous: "Connectez le compte en votre nom, et non anonymement au nom du groupe : sinon les connexions des administrateurs se mélangent. J'ai détruit le code — obtenez-en un nouveau.",
  connectCodeInGroup:
    "Un code de connexion publié dans le chat du groupe peut être vu par d'autres — je l'ai détruit et j'ai supprimé le message. Obtenez-en un nouveau et envoyez-le avec /connect CODE : je supprime ce message de commande immédiatement.",
  groupWelcome:
    "👋 Bonjour ! Publiez dans ce chat des liens vers des vidéos TikTok, Instagram, YouTube, VK et d'autres plateformes — je répondrai avec la vidéo elle-même.\n\n" +
    "Je télécharge seul les vidéos de 15 minutes maximum, sans commande, et je reste silencieux le reste du temps.\n\n⚙️ Les administrateurs du groupe peuvent me régler avec /settings : suppression des messages avec lien, style de légende, qualité, vidéos longues et langue.\n\n⚡ Ajoutez -audio après un lien pour obtenir le son, ou -hd pour la meilleure qualité.\n\n📣 Actualités du projet : @videonerdownload",
  errorTooLong: "la vidéo est trop longue — nous ne pouvons pas encore télécharger des vidéos aussi longues.",
  errorUnknown: "impossible de télécharger cette vidéo. Réessayez un peu plus tard ou envoyez un autre lien.",
  inlineHintButton: "Envoyer un lien au bot",
  inlineResultTitle: "⬇️ Télécharger la vidéo",
  inlineResultDescription: "La vidéo sera publiée directement dans ce chat",
  inlinePlaceholder: "⏬ Téléchargement en cours, cela peut prendre quelques minutes...",
  inlineOpenBot: "Ouvrir le bot",
  inlineOnlySingleVideo:
    "Ce mode envoie une seule vidéo. Pour les publications à plusieurs fichiers ou les photos, envoyez le lien au bot dans un chat privé.",
  inlineSubscribeRequired: (channel: string) =>
    `Pour télécharger, abonnez-vous à ${channel} et réessayez.`,
  inlineRateLimited: "Trop de requêtes d'affilée. Patientez une minute et réessayez.",
  queueRest: (count) => `\n\n📋 Liens encore en file d'attente : ${count}. Je les afficherai un par un après celui-ci.`,
  queuedOne: (position) =>
    `📋 Lien ajouté à la file d'attente, n° ${position}. Terminons d'abord le lien en cours — ensuite je vous proposerai le choix de qualité pour celui-ci.`,
  queuedMany: (added, waiting) =>
    `📋 Liens ajoutés à la file d'attente : ${added}. En attente au total : ${waiting}. Je les afficherai un par un après le lien en cours.`,
  queueDuplicates: (count) =>
    count === 1
      ? "Ce lien est déjà dans la file d'attente — je ne l'ajoute pas deux fois."
      : `Les liens déjà dans la file d'attente ne sont pas ajoutés deux fois (doublons : ${count}).`,
  queueFull: (limit, rejected) =>
    `La file d'attente contient au maximum ${limit} liens — les liens en trop n'ont pas été ajoutés (${rejected}). Renvoyez-les quand la file aura avancé.`,
  skipButton: "✖️ Ne pas télécharger",
  skipped: "⏭ Lien ignoré.",
  chooseTimedOut: "⌛ Aucune qualité choisie en 30 minutes — ce lien est ignoré.",
  queueLostOnRestart: (count) =>
    `⚠️ Le bot redémarre pour une mise à jour — la file d'attente a été réinitialisée (liens : ${count}). Renvoyez-les dans une minute.`,
  subtitlesButton: "📝 Sous-titres",
  subtitlesBack: "⬅️ Retour à la qualité",
  subtitlesAuto: "auto",
  subtitlesChoose: "Choisissez la langue des sous-titres",
  subtitlesPreparing: "📝 Préparation des sous-titres...",
  subtitlesFailed: "Impossible de télécharger les sous-titres dans cette langue. Essayez une autre langue.",
  subtitlesBusy: "YouTube ne fournit pas les sous-titres pour le moment — réessayez dans quelques minutes.",
  playlistFound: (title, count) =>
    `📃 Playlist${title ? ` « ${title.slice(0, 150)} »` : ""} : ${count} vidéos.\nJe vais les télécharger une par une. Quel format ?`,
  playlistStdButton: "🎬 720p",
  playlistHdButton: "🎬 Meilleure qualité",
  playlistAudioButton: "🎵 Audio seul (mp3)",
  playlistNoButton: "✖️ Non, merci",
  playlistQueued: (count) =>
    `📃 Vidéos de la playlist ajoutées à la file d'attente : ${count}. Je les enverrai une par une. Arrêtez avec le bouton ci-dessous ou /stop.`,
  playlistFailed: "Impossible d'ouvrir la playlist — elle est peut-être privée. Envoyez le lien d'une seule vidéo.",
  stopButton: "⏹ Arrêter",
  stopped: (dropped) => `⏹ Arrêté.${dropped ? ` Liens retirés de la file d'attente : ${dropped}.` : ""}`,
  nothingToStop: "Aucun téléchargement en cours.",
  languageChoose: "🌐 Choisissez la langue du bot. « Auto » suit votre Telegram.",
  languageChooseGroup: "🌐 La langue des réponses du bot dans ce groupe. « Auto » — la langue Telegram de chaque membre.",
  languageAuto: "Auto — comme dans Telegram",
  languageAutoGroup: "Auto — celle de chaque membre",
  languageSaved: (name) => `✅ Langue du bot : ${name}. Modifiez-la avec /language.`,
  languageSavedAuto: "✅ Le bot suit la langue de votre Telegram. Modifiez-la avec /language.",
  settingsLanguageButton: (name) => `🌐 Langue : ${name ?? "auto"}`,
  settingsBack: "⬅️ Retour aux paramètres",
};

const it: Messages = {
  start: "Ciao! Mandami il link di un video da YouTube, TikTok, Instagram, Facebook, Twitter/X, Vimeo, VK, Rutube, OK.ru, Pinterest o Threads — ti aiuto a scaricarlo.\n\n✨ Nessun limite di qualità: ottieni tutto quello che offre la piattaforma, fino al 4K — purché il file stia nei 2 GB, il limite di Telegram per i bot. Qui non ci sono funzioni a pagamento.\n\nCompletamente gratis: niente abbonamenti, niente pubblicità, niente acquisti in-app.\n\n🧩 Scarichi dal computer? Installa l'estensione per il browser — un pulsante Scarica compare direttamente nella pagina del video: videoner.download/it/extension\n\n👥 Aggiungimi a un gruppo e pubblicherò i video dei link condivisi lì.\n\n⚡ Salta la scelta della qualità: aggiungi -audio dopo il link per il solo audio (mp3), oppure -hd per la qualità migliore.\n\n📣 Novità del progetto: @videonerdownload\n\n🌐 Lingua del bot: /language",
  notLink: "Questo non sembra un link. Mandami il link di un video.",
  inviteGreeting: "Ciao! Sono Videoner — scarico gratis video da YouTube, TikTok, Instagram e altre piattaforme. Sto preparando il video che ti hanno condiviso 👇",
  inviteNotFound: "Non ho trovato nessun video per questo link d'invito. Mandami il link di un video e lo scarico.",
  inviteUnavailable: "Non sono riuscito ad aprire il video da questo link — il servizio al momento non risponde. Riapri lo stesso link tra un minuto.",
  fetchingInfo: "🔍 Recupero le info del video...",
  audioOnlyButton: "🎵 Solo audio (mp3)",
  photoButton: "📷 Scarica le foto",
  slideshowButton: "🎞 Slideshow (video)",
  galleryButton: "📷+🎞 Foto e slideshow",
  chooseQuality: (title, duration) => `«${title}»${duration ? `\n⏱ ${duration}` : ""}\n\nScegli la qualità:`,
  sessionExpired: "Sessione scaduta — rimanda il link",
  downloading: "⏬ Download in corso, potrebbe volerci qualche minuto...",
  downloadFailed: "download non riuscito",
  downloadProgress: (percent, eta, done) =>
    `⏬ Download: ${percent}%${eta ? ` · ancora ${eta}` : ""}${done ? `\n${done}` : ""}`,
  downloadFinishing: "⚙️ Quasi fatto — sto assemblando il file...",
  converting: (percent) => `⚙️ Conversione: ${percent}%`,
  etaUnderMinute: "meno di un minuto",
  etaMinutes: (minutes) => `~${minutes} min`,
  etaHours: (hours, minutes) => `~${hours} h${minutes ? ` ${minutes} min` : ""}`,
  downloadTimeout: "il download sta durando troppo — il video sembra molto pesante. Prova una qualità più bassa.",
  downloadInterrupted: "⚠️ Il bot si sta riavviando per un aggiornamento — il tuo download è stato interrotto. Rimanda il link tra un minuto.",
  fileTooBig: (mb, url) =>
    `Il file è troppo grande (${mb} MB) — Telegram non permette al bot di inviarlo.\nScaricalo qui: ${url}`,
  sendingFile: "📤 Invio del file...",
  sendingAlbum: (count) => `📤 Questo post contiene più file (${count}) — li invio come album...`,
  failedPrefix: "❌ Errore: ",
  fileCaption: (title, sourceUrl, shareUrl, description) =>
    composeCaption(
      title,
      description,
      `Fonte: ${sourceUrl}\n` +
        "Tutti i diritti sul video appartengono al suo autore.\n" +
        "Scaricato gratis con @VideonerBot",
      `📣 Novità del progetto: ${NEWS_CHANNEL}`,
      shareUrl && `🔗 Condividi: ${shareUrl}`,
    ),
  subscribeRequired: (channel) =>
    `Per scaricare, iscriviti al nostro canale ${channel} — è l'unica condizione, il servizio resta gratuito.\n\n` +
    "Iscriviti e premi «Mi sono iscritto».",
  openChannelButton: "📣 Apri il canale",
  checkSubscriptionButton: "Mi sono iscritto",
  subscribeThanks: "Grazie! Ora mandami il link di un video.",
  subscribeThanksResuming: "Grazie! Riprendo subito il tuo link.",
  subscribeStillMissing: "Non vedo ancora l'iscrizione. Iscriviti e premi di nuovo.",
  channelNotice: (channel) => `\n\nIl link a questo post comparirà in ${channel} — in forma anonima, senza il tuo nome.`,
  channelPost: (title, url) =>
    (title ? `🎬 ${title.slice(0, 200)}\n\n` : "") +
    `${url}\n\n` +
    "Scarica gratis questo e qualsiasi altro video: @VideonerBot",
  errorStoryNeedsId:
    "manda il link di una storia specifica: aprila nell'app Instagram e tocca Condividi → Copia link.",
  errorInstagramStory:
    "Le storie di Instagram sono visibili solo a chi ha effettuato l'accesso.",
  errorLoginRequired:
    "Questo post non è disponibile senza accesso: la piattaforma lo mostra solo agli " +
    "utenti che hanno effettuato l'accesso. Succede con i post privati, i contenuti con limiti di età e " +
    "i post condivisi con un pubblico ristretto.\n\n" +
    "I post pubblici si scaricano senza problemi — prova un altro link.",
  errorUnsupportedPlatform:
    "Non ho riconosciuto questo link — assicurati che sia un link diretto a un video di YouTube, TikTok, Instagram, Facebook, Twitter/X, Vimeo, VK, Rutube, OK.ru, Pinterest o Threads.",
  errorFileTooLarge: "il file supera i 2 GB — Telegram non permette ai bot di inviare file più grandi. Scaricalo dal sito o con l'estensione per il browser — pulsanti qui sotto. Oppure rimanda il link e scegli una qualità più bassa.",
  siteButton: "🌐 Scarica dal sito",
  qualitiesHiddenBySize: (limit) =>
    `\n\n⚖️ Le qualità più pesanti di ${limit} sono nascoste: Telegram non permette ai bot di inviare file più grandi. Puoi scaricarle dal sito o con l'estensione per il browser — pulsanti qui sotto.`,
  videoTooBigForTelegram: (smallest) =>
    `\n\n⚖️ Questo video è troppo pesante per Telegram anche nella qualità più bassa (~${smallest}): Telegram non permette ai bot di inviare file oltre i 2 GB. Qui puoi ottenere solo l'audio; il video — dal sito o con l'estensione per il browser (pulsanti qui sotto).`,
  errorFormatUnavailable: "Questa qualità non è disponibile per questo video. Rimanda il link — ti mostro l'elenco aggiornato.",
  errorNoVideoContent: "In questo link non c'è nessun video da scaricare — il post sembra contenere solo foto.",
  errorRegionBlocked:
    "Questo video è bloccato fuori dal paese dell'autore — la piattaforma si rifiuta di " +
    "fornirlo al nostro server. Non c'è modo di aggirarlo: la restrizione è dalla loro parte." +
    "\n\nGli altri link si scaricano normalmente.",
  errorRateLimited: "Troppi link di fila — aspetta un po' e rimandalo.",
  errorYoutubeDailyLimit: (gb) => `hai scaricato più di ${gb} GB da YouTube nelle ultime 24 ore — è il limite giornaliero del bot per persona. Il conteggio riguarda le ultime 24 ore, quindi potrai scaricare nuovi video da YouTube un po' più tardi. Le altre piattaforme funzionano normalmente.`,
  playlistStoppedByLimit: (dropped) => `⏹ Playlist interrotta: è stato raggiunto il limite giornaliero di YouTube. Video non scaricati: ${dropped}. Rimanda il link della playlist più tardi.`,
  errorPlatformRefused:
    "la piattaforma non ha fornito questo video al nostro server. Succede con i post privati " +
    "o con limiti di età, e a volte la piattaforma limita semplicemente l'accesso per un " +
    "po'. Riprova tra qualche minuto.",
  errorThreadsNoMedia:
    "in questo post di Threads non si vedono né video né foto. O è un post di solo testo, oppure " +
    "Threads mostra i suoi contenuti multimediali solo a chi ha effettuato l'accesso — questi post non si possono scaricare senza accesso.",
  extensionHint:
    "\n\n💻 Puoi scaricarlo con l'estensione Videoner per il browser sul computer: " +
    "scarica usando il tuo accesso alla piattaforma, e nessuna password né cookie lascia il tuo browser.",
  privateConnectHint: (platform, withExtension) =>
    `\n\n🔑 Per scaricare post come questo, collega il tuo account ${platform} al bot — una volta sola. Dopo, il bot scarica tutto quello che puoi vedere tu: post privati, reel e storie, anche dal telefono. Il pulsante qui sotto spiega come fare.${withExtension ? "\n\n💻 Oppure scaricalo con l'estensione Videoner per il browser sul computer." : ""}`,
  privateReconnectHint: (platform, withExtension) =>
    `\n\n⚠️ Il tuo account ${platform} collegato non è riuscito ad aprire questo post. L'accesso potrebbe non funzionare più — ricollega l'account. Oppure questo account non ha accesso al post.${withExtension ? "\n\n💻 Puoi anche scaricarlo con l'estensione Videoner per il browser sul computer." : ""}`,
  connectAccountButton: "🔑 Collega account",
  reconnectAccountButton: "🔑 Ricollega",
  extensionButton: "🧩 Scarica con l'estensione",
  extensionCommand:
    "🧩 Videoner per il tuo browser: un pulsante Scarica direttamente nella pagina del video — YouTube, Instagram, TikTok, VK, video privati del tuo account e lezioni GetCourse.\n\nPer Chrome, Edge, Opera, Yandex Browser e Firefox sul computer.",
  extensionPageButton: "🧩 Installa l'estensione",
  addToGroupButton: "👥 Aggiungi a un gruppo",
  newsButton: "📣 Novità del progetto",
  fileCaptionShort: (title, sourceUrl) =>
    withOptionalLines((title ? `🎬 ${title.slice(0, 200)}\n\n` : "") + sourceUrl, `📣 Novità del progetto: ${NEWS_CHANNEL}`, undefined),
  sentBy: (name) => `👤 ${name}`,
  groupSettings: (s, canDelete) =>
    "⚙️ Impostazioni del bot per questo gruppo\n\n" +
    `🗑 Elimina il messaggio con il link: ${s.deleteLinks ? "sì" : "no"}\n` +
    "Una volta inviato il video, il messaggio che conteneva solo il link viene eliminato — nella chat resta solo il video con il nome di chi l'ha condiviso.\n" +
    (s.deleteLinks && !canDelete
      ? "⚠️ Al momento non posso eliminare messaggi: rendimi amministratore con il permesso «Elimina messaggi».\n"
      : "") +
    `\n✍️ Didascalia sotto il video: ${{ full: "completa", short: "titolo e fonte", none: "nessuna didascalia" }[s.caption] ?? s.caption}\n` +
    `\n🎞 Qualità: ${s.quality === "max" ? "la più alta accettata da Telegram" : "standard (720p)"}\n` +
    `\n⏱ Video lunghi: ${s.longVideos ? "qualsiasi durata" : "solo fino a 15 minuti"}\n` +
    `\n🔑 Chi può collegare i propri account (per storie e post privati): ${s.cookiesBy === "all" ? "tutti i membri" : "solo gli amministratori"}\n` +
    `\n🌐 Lingua delle risposte: ${s.language ? langName(s.language) : "quella di ciascun membro"}\n` +
    "\nSolo gli amministratori del gruppo possono modificare le impostazioni.",
  settingsDeleteButton: (on) => `🗑 Elimina i link: ${on ? "sì" : "no"}`,
  settingsCaptionButton: (style) => `✍️ Didascalia: ${{ full: "completa", short: "breve", none: "nessuna" }[style] ?? style}`,
  settingsQualityButton: (mode) => `🎞 Qualità: ${mode === "max" ? "massima" : "720p"}`,
  settingsLongButton: (on) => `⏱ Video lunghi: ${on ? "sì" : "fino a 15 min"}`,
  settingsDoneButton: "✅ Fatto",
  settingsAdminsOnly: "Solo gli amministratori del gruppo possono modificare le impostazioni.",
  settingsGroupsOnly: "Le impostazioni valgono per i gruppi: aggiungimi a un gruppo e invia lì /settings.",
  settingsFailed: "Non sono riuscito a salvare le impostazioni, riprova.",
  settingsCookiesButton: (by) => `🔑 Collegamento account: ${by === "all" ? "tutti" : "admin"}`,
  accountsIntro:
    "🔑 Account collegati\n\nIl bot può scaricare ciò che vede solo chi ha effettuato l'accesso (storie di Instagram, post privati) — usando il tuo account. Un collegamento funziona dove l'hai fatto: quello nella chat privata serve per i tuoi download, compresi i tuoi link nei gruppi che non hanno un account proprio; quello collegato a un gruppo serve a tutti i suoi membri.",
  accountsHowTo:
    "Come collegare un account:\n1. Il modo più semplice: l'estensione Videoner sul computer — accedi al sito della piattaforma, apri la finestra di Videoner, premi «🔑 Collega il tuo account … al bot» e mandami il codice. Per un gruppo, invia /connect CODICE in quel gruppo.\n2. Oppure mandami un file cookies.txt (cookie esportati dal browser), o incolla il suo testo in un messaggio.\n3. Da un telefono Android — con Firefox e il componente aggiuntivo Cookie-Editor: https://videoner.download/it/blog/android-firefox",
  accountsWarning:
    "⚠️ Le piattaforme non amano i download automatici e possono limitare o bannare l'account. Meglio collegare un account secondario, non quello principale. I cookie sono salvati cifrati, usati solo per i download e si eliminano con i pulsanti qui sotto.",
  accountsNone: "Non c'è ancora niente di collegato.",
  accountsGroupTitle: "🔑 Account collegati a questo gruppo",
  accountsGroupHowTo:
    "Per collegarne uno per tutto il gruppo: ottieni un codice con il pulsante «🔑 Collega il tuo account … al bot» nell'estensione Videoner e invia qui /connect CODICE. Se hai collegato un account solo nella tua chat privata, il bot lo usa qui per i tuoi link. I tuoi collegamenti: /accounts in una chat privata con @VideonerBot.",
  accountsLine: (platform, where, active) => `• ${platform} — ${where}${active ? "" : " (⚠️ l'accesso non funziona)"}`,
  accountsGroupLine: (platform, owner, active) => `• ${platform} — ${owner}${active ? "" : " (⚠️ l'accesso non funziona)"}`,
  accountsWhereHere: "chat privata",
  accountsWhereGroup: (title) => `gruppo «${title}»`,
  accountsDeleteButton: (platform, where) => `🗑 ${platform} · ${where}`,
  accountsDeleteAllButton: "🗑 Rimuovi tutti i miei collegamenti",
  accountsDeleted: "Rimosso.",
  accountsDeletedAll: (n) => `Collegamenti rimossi: ${n}.`,
  accountsNotAllowed: "Solo chi l'ha collegato o un amministratore del gruppo può rimuoverlo.",
  connectUsage:
    "Invia /connect CODICE. Il codice te lo dà il pulsante «🔑 Collega il tuo account … al bot» nell'estensione Videoner sul computer. I tuoi collegamenti: /accounts.",
  connectOnlyAdmins: "Solo gli amministratori possono collegare account a questo gruppo (vedi /settings).",
  connectDone: (platform, where) =>
    `✅ ${platform} collegato ${where}. Ora il bot scarica anche ciò che vede solo chi ha effettuato l'accesso. Vedi o rimuovi: /accounts.\n\n⚠️ La piattaforma può limitare l'account per i download automatici — meglio usarne uno secondario.`,
  connectWhereGroup: "a questo gruppo",
  connectWhereHere: "per i tuoi download nella chat privata e in modalità inline",
  connectCodeNotFound: "Codice non trovato o scaduto (i codici valgono 10 minuti). Ottienine uno nuovo nell'estensione Videoner.",
  connectRejectedNoSession: "Questi cookie non contengono un accesso. Accedi al sito della piattaforma ed esporta di nuovo i cookie.",
  connectRejectedUnknown: "Nessun cookie delle piattaforme supportate: Instagram, Facebook, YouTube, X, VK, TikTok.",
  connectUnavailable: "Il collegamento degli account non è ancora disponibile.",
  connectFailed: "Non sono riuscito a collegare l'account, riprova.",
  connectFileTooBig: "Il file è troppo grande — esporta solo i cookie del sito che ti serve.",
  connectNotAnonymous: "Collega l'account a tuo nome, non in modo anonimo a nome del gruppo: altrimenti i collegamenti degli amministratori si mescolano. Ho annullato il codice — ottienine uno nuovo.",
  connectCodeInGroup:
    "Un codice di collegamento pubblicato nella chat del gruppo può essere visto da altri — l'ho annullato e ho eliminato il messaggio. Ottienine uno nuovo e invialo con /connect CODICE: elimino subito quel messaggio con il comando.",
  groupWelcome:
    "👋 Ciao! Pubblica in questa chat i link ai video di TikTok, Instagram, YouTube, VK e altre piattaforme — risponderò con il video stesso.\n\n" +
    "Scarico da solo i video fino a 15 minuti, senza bisogno di comandi, e per il resto sto zitto.\n\n⚙️ Gli amministratori del gruppo possono configurarmi con /settings: eliminazione dei messaggi con link, stile della didascalia, qualità, video lunghi e lingua.\n\n⚡ Aggiungi -audio dopo un link per avere l'audio, oppure -hd per la qualità migliore.\n\n📣 Novità del progetto: @videonerdownload",
  errorTooLong: "il video è troppo lungo — per ora non riusciamo a scaricare video così lunghi.",
  errorUnknown: "non sono riuscito a scaricare questo video. Riprova un po' più tardi o manda un altro link.",
  inlineHintButton: "Manda un link al bot",
  inlineResultTitle: "⬇️ Scarica il video",
  inlineResultDescription: "Il video verrà pubblicato direttamente in questa chat",
  inlinePlaceholder: "⏬ Download in corso, potrebbe volerci qualche minuto...",
  inlineOpenBot: "Apri il bot",
  inlineOnlySingleVideo:
    "Questa modalità invia un solo video. Per i post con più file o le foto, manda il link al bot in una chat privata.",
  inlineSubscribeRequired: (channel: string) =>
    `Per scaricare, iscriviti a ${channel} e riprova.`,
  inlineRateLimited: "Troppe richieste di fila. Aspetta un minuto e riprova.",
  queueRest: (count) => `\n\n📋 Link ancora in coda: ${count}. Te li mostrerò uno alla volta dopo questo.`,
  queuedOne: (position) =>
    `📋 Link aggiunto alla coda, n. ${position}. Prima finiamo quello in corso — poi ti mostro la scelta della qualità per questo.`,
  queuedMany: (added, waiting) =>
    `📋 Link aggiunti alla coda: ${added}. In attesa in totale: ${waiting}. Te li mostrerò uno alla volta dopo quello in corso.`,
  queueDuplicates: (count) =>
    count === 1
      ? "Questo link è già in coda — non lo aggiungo due volte."
      : `I link già in coda non vengono aggiunti due volte (doppioni: ${count}).`,
  queueFull: (limit, rejected) =>
    `La coda contiene al massimo ${limit} link — quelli in più non sono stati aggiunti (${rejected}). Rimandali quando la coda sarà andata avanti.`,
  skipButton: "✖️ Non scaricare",
  skipped: "⏭ Link saltato.",
  chooseTimedOut: "⌛ Nessuna qualità scelta entro 30 minuti — salto questo link.",
  queueLostOnRestart: (count) =>
    `⚠️ Il bot si sta riavviando per un aggiornamento — la coda è stata azzerata (link: ${count}). Rimandali tra un minuto.`,
  subtitlesButton: "📝 Sottotitoli",
  subtitlesBack: "⬅️ Torna alla qualità",
  subtitlesAuto: "auto",
  subtitlesChoose: "Scegli la lingua dei sottotitoli",
  subtitlesPreparing: "📝 Preparo i sottotitoli...",
  subtitlesFailed: "Non sono riuscito a scaricare i sottotitoli in questa lingua. Prova un'altra lingua.",
  subtitlesBusy: "Al momento YouTube non fornisce i sottotitoli — riprova tra qualche minuto.",
  playlistFound: (title, count) =>
    `📃 Playlist${title ? ` «${title.slice(0, 150)}»` : ""}: ${count} video.\nLi scaricherò uno alla volta. Quale formato?`,
  playlistStdButton: "🎬 720p",
  playlistHdButton: "🎬 Qualità migliore",
  playlistAudioButton: "🎵 Solo audio (mp3)",
  playlistNoButton: "✖️ No, grazie",
  playlistQueued: (count) =>
    `📃 Video della playlist aggiunti alla coda: ${count}. Te li invierò uno alla volta. Fermali con il pulsante qui sotto o con /stop.`,
  playlistFailed: "Non sono riuscito ad aprire la playlist — forse è privata. Manda il link di un singolo video.",
  stopButton: "⏹ Interrompi",
  stopped: (dropped) => `⏹ Fermato.${dropped ? ` Link rimossi dalla coda: ${dropped}.` : ""}`,
  nothingToStop: "Al momento non c'è nessun download in corso.",
  languageChoose: "🌐 Scegli la lingua del bot. «Auto» segue il tuo Telegram.",
  languageChooseGroup: "🌐 La lingua delle risposte del bot in questo gruppo. «Auto» — la lingua di Telegram di ciascun membro.",
  languageAuto: "Auto — come in Telegram",
  languageAutoGroup: "Auto — quella di ciascun membro",
  languageSaved: (name) => `✅ Lingua del bot: ${name}. Puoi cambiarla con /language.`,
  languageSavedAuto: "✅ Il bot segue la lingua del tuo Telegram. Puoi cambiarla con /language.",
  settingsLanguageButton: (name) => `🌐 Lingua: ${name ?? "auto"}`,
  settingsBack: "⬅️ Torna alle impostazioni",
};

const pt: Messages = {
  start: "Oi! Me mande o link de um vídeo do YouTube, TikTok, Instagram, Facebook, Twitter/X, Vimeo, VK, Rutube, OK.ru, Pinterest ou Threads — eu te ajudo a baixá-lo.\n\n✨ Sem limite de qualidade: você recebe tudo o que a plataforma oferece, até 4K — desde que o arquivo caiba em 2 GB, o limite do Telegram para bots. Aqui não existe nenhum recurso pago.\n\nTotalmente grátis: sem assinaturas, sem anúncios, sem compras no app.\n\n🧩 Baixando no computador? Instale a extensão para navegador — um botão Baixar aparece direto na página do vídeo: videoner.download/pt/extension\n\n👥 Me adicione a um grupo e eu vou postar os vídeos dos links compartilhados lá.\n\n⚡ Pule a escolha de qualidade: adicione -audio depois do link para receber só o áudio (mp3), ou -hd para a melhor qualidade.\n\n📣 Novidades do projeto: @videonerdownload\n\n🌐 Idioma do bot: /language",
  notLink: "Isso não parece um link. Me mande o link de um vídeo.",
  inviteGreeting: "Oi! Eu sou o Videoner — baixo vídeos do YouTube, TikTok, Instagram e outras plataformas de graça. Já estou preparando o vídeo que compartilharam com você 👇",
  inviteNotFound: "Não encontrei nenhum vídeo para este link de convite. Me mande o link de um vídeo e eu baixo para você.",
  inviteUnavailable: "Não consegui abrir o vídeo deste link — o serviço não está respondendo agora. Abra o mesmo link de novo daqui a um minuto.",
  fetchingInfo: "🔍 Buscando informações do vídeo...",
  audioOnlyButton: "🎵 Só áudio (mp3)",
  photoButton: "📷 Baixar fotos",
  slideshowButton: "🎞 Slideshow (vídeo)",
  galleryButton: "📷+🎞 Fotos e slideshow",
  chooseQuality: (title, duration) => `“${title}”${duration ? `\n⏱ ${duration}` : ""}\n\nEscolha a qualidade:`,
  sessionExpired: "A sessão expirou — mande o link de novo",
  downloading: "⏬ Baixando, isso pode levar alguns minutos...",
  downloadFailed: "falha no download",
  downloadProgress: (percent, eta, done) =>
    `⏬ Baixando: ${percent}%${eta ? ` · faltam ${eta}` : ""}${done ? `\n${done}` : ""}`,
  downloadFinishing: "⚙️ Quase pronto — montando o arquivo...",
  converting: (percent) => `⚙️ Convertendo: ${percent}%`,
  etaUnderMinute: "menos de um minuto",
  etaMinutes: (minutes) => `~${minutes} min`,
  etaHours: (hours, minutes) => `~${hours} h${minutes ? ` ${minutes} min` : ""}`,
  downloadTimeout: "o download está demorando demais — o vídeo parece ser muito pesado. Tente uma qualidade menor.",
  downloadInterrupted: "⚠️ O bot está reiniciando para uma atualização — seu download foi interrompido. Mande o link de novo daqui a um minuto.",
  fileTooBig: (mb, url) =>
    `O arquivo ficou grande (${mb} MB) — o Telegram não deixa o bot enviá-lo.\nBaixe aqui: ${url}`,
  sendingFile: "📤 Enviando o arquivo...",
  sendingAlbum: (count) => `📤 Este post tem vários arquivos (${count}) — vou enviá-los como álbum...`,
  failedPrefix: "❌ Falhou: ",
  fileCaption: (title, sourceUrl, shareUrl, description) =>
    composeCaption(
      title,
      description,
      `Fonte: ${sourceUrl}\n` +
        "Todos os direitos do vídeo pertencem ao seu autor.\n" +
        "Baixado de graça com @VideonerBot",
      `📣 Novidades do projeto: ${NEWS_CHANNEL}`,
      shareUrl && `🔗 Compartilhar: ${shareUrl}`,
    ),
  subscribeRequired: (channel) =>
    `Para baixar, inscreva-se no nosso canal ${channel} — essa é a única condição, o serviço continua grátis.\n\n` +
    "Inscreva-se e toque em “Já me inscrevi”.",
  openChannelButton: "📣 Abrir o canal",
  checkSubscriptionButton: "Já me inscrevi",
  subscribeThanks: "Obrigado! Agora me mande o link de um vídeo.",
  subscribeThanksResuming: "Obrigado! Já estou retomando o seu link.",
  subscribeStillMissing: "Ainda não estou vendo a inscrição. Inscreva-se e toque de novo.",
  channelNotice: (channel) => `\n\nO link deste post vai aparecer em ${channel} — de forma anônima, sem o seu nome.`,
  channelPost: (title, url) =>
    (title ? `🎬 ${title.slice(0, 200)}\n\n` : "") +
    `${url}\n\n` +
    "Baixe este e qualquer outro vídeo de graça: @VideonerBot",
  errorStoryNeedsId:
    "mande o link de um story específico: abra-o no app do Instagram e toque em Compartilhar → Copiar link.",
  errorInstagramStory:
    "Os stories do Instagram só ficam visíveis para quem está logado.",
  errorLoginRequired:
    "Este post não está disponível sem login: a plataforma só o mostra para " +
    "usuários logados. Isso acontece com posts privados, conteúdo com restrição de idade e " +
    "posts compartilhados com um público limitado.\n\n" +
    "Posts públicos baixam sem problemas — tente outro link.",
  errorUnsupportedPlatform:
    "Não consegui reconhecer esse link — confira se é um link direto de vídeo do YouTube, TikTok, Instagram, Facebook, Twitter/X, Vimeo, VK, Rutube, OK.ru, Pinterest ou Threads.",
  errorFileTooLarge: "o arquivo tem mais de 2 GB — o Telegram não deixa bots enviarem arquivos maiores. Baixe pelo site ou com a extensão para navegador — botões abaixo. Ou mande o link de novo e escolha uma qualidade menor.",
  siteButton: "🌐 Baixar pelo site",
  qualitiesHiddenBySize: (limit) =>
    `\n\n⚖️ Qualidades mais pesadas que ${limit} estão ocultas: o Telegram não deixa bots enviarem arquivos maiores. Você pode baixá-las pelo site ou com a extensão para navegador — botões abaixo.`,
  videoTooBigForTelegram: (smallest) =>
    `\n\n⚖️ Este vídeo é pesado demais para o Telegram mesmo na menor qualidade (~${smallest}): o Telegram não deixa bots enviarem arquivos com mais de 2 GB. Aqui você pode pegar só o áudio; o vídeo — pelo site ou com a extensão para navegador (botões abaixo).`,
  errorFormatUnavailable: "Essa qualidade não está disponível para este vídeo. Mande o link de novo — eu mostro a lista atualizada.",
  errorNoVideoContent: "Este link não tem vídeo para baixar — parece que o post tem só fotos.",
  errorRegionBlocked:
    "Este vídeo está bloqueado fora do país do autor — a plataforma não o entrega " +
    "ao nosso servidor. Não tem como contornar: a restrição é do lado deles." +
    "\n\nOutros links baixam normalmente.",
  errorRateLimited: "Muitos links seguidos — espere um pouco e mande de novo.",
  errorYoutubeDailyLimit: (gb) => `você baixou mais de ${gb} GB do YouTube nas últimas 24 horas — esse é o limite diário do bot por pessoa. A contagem considera as últimas 24 horas, então daqui a pouco você poderá baixar novos vídeos do YouTube. As outras plataformas funcionam normalmente.`,
  playlistStoppedByLimit: (dropped) => `⏹ Playlist interrompida: o limite diário do YouTube foi atingido. Vídeos não baixados: ${dropped}. Mande o link da playlist de novo mais tarde.`,
  errorPlatformRefused:
    "a plataforma não entregou este vídeo ao nosso servidor. Isso acontece com posts privados " +
    "ou com restrição de idade, e às vezes a plataforma simplesmente limita o acesso por um " +
    "tempo. Tente de novo daqui a alguns minutos.",
  errorThreadsNoMedia:
    "não há vídeo nem foto visível neste post do Threads. Ou é um post só de texto, ou " +
    "o Threads mostra a mídia dele apenas para usuários logados — esses posts não podem ser baixados sem login.",
  extensionHint:
    "\n\n💻 Você pode baixá-lo com a extensão Videoner para navegador no computador: " +
    "ela baixa usando o seu próprio login na plataforma, e nenhuma senha ou cookie sai do seu navegador.",
  privateConnectHint: (platform, withExtension) =>
    `\n\n🔑 Para baixar posts como este, conecte sua conta do ${platform} ao bot — uma única vez. Depois disso, o bot baixa tudo o que você consegue ver: posts privados, reels e stories, inclusive pelo celular. O botão abaixo mostra como.${withExtension ? "\n\n💻 Ou baixe com a extensão Videoner para navegador no computador." : ""}`,
  privateReconnectHint: (platform, withExtension) =>
    `\n\n⚠️ Sua conta do ${platform} conectada não conseguiu abrir este post. O login pode ter parado de funcionar — conecte a conta de novo. Ou essa conta não tem acesso ao post.${withExtension ? "\n\n💻 Você também pode baixá-lo com a extensão Videoner para navegador no computador." : ""}`,
  connectAccountButton: "🔑 Conectar conta",
  reconnectAccountButton: "🔑 Conectar de novo",
  extensionButton: "🧩 Baixar com a extensão",
  extensionCommand:
    "🧩 Videoner para o seu navegador: um botão Baixar direto na página do vídeo — YouTube, Instagram, TikTok, VK, vídeos privados da sua conta e aulas do GetCourse.\n\nPara Chrome, Edge, Opera, Yandex Browser e Firefox no computador.",
  extensionPageButton: "🧩 Instalar a extensão",
  addToGroupButton: "👥 Adicionar a um grupo",
  newsButton: "📣 Novidades do projeto",
  fileCaptionShort: (title, sourceUrl) =>
    withOptionalLines((title ? `🎬 ${title.slice(0, 200)}\n\n` : "") + sourceUrl, `📣 Novidades do projeto: ${NEWS_CHANNEL}`, undefined),
  sentBy: (name) => `👤 ${name}`,
  groupSettings: (s, canDelete) =>
    "⚙️ Configurações do bot neste grupo\n\n" +
    `🗑 Apagar a mensagem com o link: ${s.deleteLinks ? "sim" : "não"}\n` +
    "Depois que o vídeo é enviado, a mensagem que tinha só o link é apagada — no chat fica apenas o vídeo com o nome de quem compartilhou.\n" +
    (s.deleteLinks && !canDelete
      ? "⚠️ No momento não consigo apagar mensagens: me torne administrador com a permissão “Apagar mensagens”.\n"
      : "") +
    `\n✍️ Legenda do vídeo: ${{ full: "completa", short: "título e fonte", none: "sem legenda" }[s.caption] ?? s.caption}\n` +
    `\n🎞 Qualidade: ${s.quality === "max" ? "a mais alta que o Telegram aceita" : "padrão (720p)"}\n` +
    `\n⏱ Vídeos longos: ${s.longVideos ? "qualquer duração" : "só até 15 minutos"}\n` +
    `\n🔑 Quem pode conectar suas contas (para stories e posts privados): ${s.cookiesBy === "all" ? "qualquer membro" : "só administradores"}\n` +
    `\n🌐 Idioma das respostas: ${s.language ? langName(s.language) : "o de cada membro"}\n` +
    "\nSó os administradores do grupo podem mudar as configurações.",
  settingsDeleteButton: (on) => `🗑 Apagar links: ${on ? "sim" : "não"}`,
  settingsCaptionButton: (style) => `✍️ Legenda: ${{ full: "completa", short: "curta", none: "nenhuma" }[style] ?? style}`,
  settingsQualityButton: (mode) => `🎞 Qualidade: ${mode === "max" ? "máxima" : "720p"}`,
  settingsLongButton: (on) => `⏱ Vídeos longos: ${on ? "sim" : "até 15 min"}`,
  settingsDoneButton: "✅ Pronto",
  settingsAdminsOnly: "Só os administradores do grupo podem mudar as configurações.",
  settingsGroupsOnly: "As configurações são para grupos: me adicione a um grupo e mande /settings lá.",
  settingsFailed: "Não consegui salvar as configurações, tente de novo.",
  settingsCookiesButton: (by) => `🔑 Conectar contas: ${by === "all" ? "todos" : "admins"}`,
  accountsIntro:
    "🔑 Contas conectadas\n\nO bot consegue baixar o que só quem está logado vê (stories do Instagram, posts privados) — usando a sua conta. Um login vale onde você o conectou: o do chat privado serve para os seus downloads, inclusive para os seus próprios links em grupos que não têm conta própria; o conectado a um grupo serve para todos os membros dele.",
  accountsHowTo:
    "Como conectar:\n1. O jeito mais fácil: a extensão Videoner no computador — faça login no site da plataforma, abra a janela do Videoner, toque em «🔑 Conectar sua conta do … ao bot» e me mande o código. Para um grupo, mande /connect CÓDIGO nesse grupo.\n2. Ou me mande um arquivo cookies.txt (cookies exportados do navegador), ou cole o texto dele em uma mensagem.\n3. Pelo celular Android — com o Firefox e o complemento Cookie-Editor: https://videoner.download/pt/blog/android-firefox",
  accountsWarning:
    "⚠️ As plataformas não gostam de downloads automáticos e podem restringir ou banir a conta. É melhor conectar uma conta secundária, não a principal. Os cookies ficam guardados criptografados, são usados só para downloads e podem ser removidos com os botões abaixo.",
  accountsNone: "Nada conectado ainda.",
  accountsGroupTitle: "🔑 Contas conectadas a este grupo",
  accountsGroupHowTo:
    "Para conectar uma conta para o grupo inteiro: pegue um código com o botão «🔑 Conectar sua conta do … ao bot» na extensão Videoner e mande /connect CÓDIGO aqui. Se você conectou uma conta só no seu chat privado, o bot a usa aqui para os seus próprios links. Suas conexões: /accounts no chat privado com @VideonerBot.",
  accountsLine: (platform, where, active) => `• ${platform} — ${where}${active ? "" : " (⚠️ login não funciona)"}`,
  accountsGroupLine: (platform, owner, active) => `• ${platform} — ${owner}${active ? "" : " (⚠️ login não funciona)"}`,
  accountsWhereHere: "chat privado",
  accountsWhereGroup: (title) => `grupo “${title}”`,
  accountsDeleteButton: (platform, where) => `🗑 ${platform} · ${where}`,
  accountsDeleteAllButton: "🗑 Remover todas as minhas conexões",
  accountsDeleted: "Removido.",
  accountsDeletedAll: (n) => `Conexões removidas: ${n}.`,
  accountsNotAllowed: "Só quem conectou ou um administrador do grupo pode remover.",
  connectUsage:
    "Mande /connect CÓDIGO. O código é gerado pelo botão «🔑 Conectar sua conta do … ao bot» na extensão Videoner no computador. Suas conexões: /accounts.",
  connectOnlyAdmins: "Só administradores podem conectar contas a este grupo (veja /settings).",
  connectDone: (platform, where) =>
    `✅ ${platform} conectado ${where}. Agora o bot também baixa o que só quem está logado vê. Ver ou remover: /accounts.\n\n⚠️ A plataforma pode restringir a conta por downloads automáticos — é melhor usar uma secundária.`,
  connectWhereGroup: "a este grupo",
  connectWhereHere: "para os seus downloads no chat privado e no modo inline",
  connectCodeNotFound: "Código não encontrado ou expirado (os códigos valem 10 minutos). Pegue um novo na extensão Videoner.",
  connectRejectedNoSession: "Esses cookies não têm login. Faça login no site da plataforma e exporte os cookies de novo.",
  connectRejectedUnknown: "Não encontrei cookies das plataformas suportadas: Instagram, Facebook, YouTube, X, VK, TikTok.",
  connectUnavailable: "A conexão de contas ainda não está disponível.",
  connectFailed: "Não consegui conectar, tente de novo.",
  connectFileTooBig: "O arquivo é grande demais — exporte só os cookies do site necessário.",
  connectNotAnonymous: "Conecte a conta em seu próprio nome, não anonimamente como o grupo: senão as conexões dos administradores se misturam. Anulei o código — pegue um novo.",
  connectCodeInGroup:
    "Um código de conexão postado no chat do grupo pode ser visto por outras pessoas — anulei o código e apaguei a mensagem. Pegue um novo e mande com /connect CÓDIGO: eu apago essa mensagem com o comando na hora.",
  groupWelcome:
    "👋 Oi! Postem neste chat links de vídeos do TikTok, Instagram, YouTube, VK e outras plataformas — eu respondo com o próprio vídeo.\n\n" +
    "Baixo sozinho vídeos de até 15 minutos, sem precisar de comandos, e fora isso fico quieto.\n\n⚙️ Os administradores do grupo podem me ajustar com /settings: apagar mensagens com links, estilo da legenda, qualidade, vídeos longos e idioma.\n\n⚡ Adicione -audio depois de um link para receber o áudio, ou -hd para a melhor qualidade.\n\n📣 Novidades do projeto: @videonerdownload",
  errorTooLong: "o vídeo é longo demais — ainda não conseguimos baixar vídeos tão longos.",
  errorUnknown: "não consegui baixar este vídeo. Tente de novo daqui a pouco ou mande outro link.",
  inlineHintButton: "Mande um link para o bot",
  inlineResultTitle: "⬇️ Baixar vídeo",
  inlineResultDescription: "O vídeo será postado direto neste chat",
  inlinePlaceholder: "⏬ Baixando, isso pode levar alguns minutos...",
  inlineOpenBot: "Abrir o bot",
  inlineOnlySingleVideo:
    "Este modo envia um único vídeo. Para posts com vários arquivos ou fotos, mande o link para o bot no chat privado.",
  inlineSubscribeRequired: (channel: string) =>
    `Para baixar, inscreva-se em ${channel} e tente de novo.`,
  inlineRateLimited: "Muitos pedidos seguidos. Espere um minuto e tente de novo.",
  queueRest: (count) => `\n\n📋 Links ainda na fila: ${count}. Vou mostrá-los um por um depois deste.`,
  queuedOne: (position) =>
    `📋 Link na fila, nº ${position}. Primeiro vamos terminar o atual — depois mostro a escolha de qualidade para ele.`,
  queuedMany: (added, waiting) =>
    `📋 Links adicionados à fila: ${added}. Aguardando no total: ${waiting}. Vou mostrá-los um por um depois do atual.`,
  queueDuplicates: (count) =>
    count === 1
      ? "Este link já está na fila — não vou adicioná-lo duas vezes."
      : `Links que já estão na fila não são adicionados duas vezes (repetidos: ${count}).`,
  queueFull: (limit, rejected) =>
    `A fila comporta no máximo ${limit} links — os excedentes não foram adicionados (${rejected}). Mande-os quando a fila andar.`,
  skipButton: "✖️ Não baixar",
  skipped: "⏭ Pulei este link.",
  chooseTimedOut: "⌛ Nenhuma qualidade escolhida em 30 minutos — pulando este link.",
  queueLostOnRestart: (count) =>
    `⚠️ O bot está reiniciando para uma atualização — a fila foi zerada (links: ${count}). Mande-os de novo daqui a um minuto.`,
  subtitlesButton: "📝 Legendas",
  subtitlesBack: "⬅️ Voltar à qualidade",
  subtitlesAuto: "automáticas",
  subtitlesChoose: "Escolha o idioma das legendas",
  subtitlesPreparing: "📝 Preparando as legendas...",
  subtitlesFailed: "Não consegui baixar as legendas neste idioma. Tente outro idioma.",
  subtitlesBusy: "O YouTube não está entregando legendas agora — tente de novo daqui a alguns minutos.",
  playlistFound: (title, count) =>
    `📃 Playlist${title ? ` “${title.slice(0, 150)}”` : ""}: ${count} vídeos.\nVou baixá-los um por um. Qual formato?`,
  playlistStdButton: "🎬 720p",
  playlistHdButton: "🎬 Melhor qualidade",
  playlistAudioButton: "🎵 Só áudio (mp3)",
  playlistNoButton: "✖️ Não, obrigado",
  playlistQueued: (count) =>
    `📃 Vídeos da playlist na fila: ${count}. Vou enviá-los um por um. Pare com o botão abaixo ou com /stop.`,
  playlistFailed: "Não consegui abrir a playlist — talvez ela seja privada. Mande o link de um único vídeo.",
  stopButton: "⏹ Parar",
  stopped: (dropped) => `⏹ Parado.${dropped ? ` Links removidos da fila: ${dropped}.` : ""}`,
  nothingToStop: "Nada está sendo baixado agora.",
  languageChoose: "🌐 Escolha o idioma do bot. “Automático” segue o seu Telegram.",
  languageChooseGroup: "🌐 O idioma das respostas do bot neste grupo. “Automático” — o idioma do Telegram de cada membro.",
  languageAuto: "Automático — como no Telegram",
  languageAutoGroup: "Automático — o de cada membro",
  languageSaved: (name) => `✅ Idioma do bot: ${name}. Mude com /language.`,
  languageSavedAuto: "✅ O bot segue o idioma do seu Telegram. Mude com /language.",
  settingsLanguageButton: (name) => `🌐 Idioma: ${name ?? "automático"}`,
  settingsBack: "⬅️ Voltar às configurações",
};

const es: Messages = {
  start: "¡Hola! Envíame el enlace de un video de YouTube, TikTok, Instagram, Facebook, Twitter/X, Vimeo, VK, Rutube, OK.ru, Pinterest o Threads — te ayudo a descargarlo.\n\n✨ Sin límites de calidad: recibes todo lo que ofrece la plataforma, hasta 4K — siempre que el archivo quepa en 2 GB, el límite de Telegram para bots. Aquí no hay funciones de pago.\n\nTotalmente gratis: sin suscripciones, sin anuncios, sin compras dentro de la app.\n\n🧩 ¿Descargas en un ordenador? Instala la extensión para el navegador — aparece un botón Descargar directamente en la página del video: videoner.download/es/extension\n\n👥 Agrégame a un grupo y publicaré los videos de los enlaces que se compartan allí.\n\n⚡ Sáltate la elección de calidad: añade -audio después del enlace para recibir solo el sonido (mp3), o -hd para la mejor calidad.\n\n📣 Novedades del proyecto: @videonerdownload\n\n🌐 Idioma del bot: /language",
  notLink: "Eso no parece un enlace. Envíame el enlace de un video.",
  inviteGreeting: "¡Hola! Soy Videoner — descargo videos de YouTube, TikTok, Instagram y otras plataformas gratis. Preparando el video que te compartieron 👇",
  inviteNotFound: "No encontré ningún video para este enlace de invitación. Envíame el enlace de un video y lo descargo.",
  inviteUnavailable: "No pude abrir el video de este enlace — el servicio no responde en este momento. Vuelve a abrir el mismo enlace dentro de un minuto.",
  fetchingInfo: "🔍 Obteniendo información del video...",
  audioOnlyButton: "🎵 Solo audio (mp3)",
  photoButton: "📷 Descargar fotos",
  slideshowButton: "🎞 Presentación (video)",
  galleryButton: "📷+🎞 Fotos y presentación",
  chooseQuality: (title, duration) => `«${title}»${duration ? `\n⏱ ${duration}` : ""}\n\nElige la calidad:`,
  sessionExpired: "La sesión expiró — envía el enlace de nuevo",
  downloading: "⏬ Descargando, puede tardar un par de minutos...",
  downloadFailed: "la descarga falló",
  downloadProgress: (percent, eta, done) =>
    `⏬ Descargando: ${percent}%${eta ? ` · quedan ${eta}` : ""}${done ? `\n${done}` : ""}`,
  downloadFinishing: "⚙️ Casi listo — armando el archivo...",
  converting: (percent) => `⚙️ Convirtiendo: ${percent}%`,
  etaUnderMinute: "menos de un minuto",
  etaMinutes: (minutes) => `~${minutes} min`,
  etaHours: (hours, minutes) => `~${hours} h${minutes ? ` ${minutes} min` : ""}`,
  downloadTimeout: "la descarga está tardando demasiado — el video parece muy pesado. Prueba con una calidad más baja.",
  downloadInterrupted: "⚠️ El bot se está reiniciando por una actualización — tu descarga se interrumpió. Envía el enlace de nuevo dentro de un minuto.",
  fileTooBig: (mb, url) =>
    `El archivo resultó grande (${mb} MB) — Telegram no deja que el bot lo envíe.\nDescárgalo aquí: ${url}`,
  sendingFile: "📤 Enviando el archivo...",
  sendingAlbum: (count) => `📤 Esta publicación tiene varios archivos (${count}) — los envío como álbum...`,
  failedPrefix: "❌ Error: ",
  fileCaption: (title, sourceUrl, shareUrl, description) =>
    composeCaption(
      title,
      description,
      `Fuente: ${sourceUrl}\n` +
        "Todos los derechos del video pertenecen a su autor.\n" +
        "Descargado gratis con @VideonerBot",
      `📣 Novedades del proyecto: ${NEWS_CHANNEL}`,
      shareUrl && `🔗 Compartir: ${shareUrl}`,
    ),
  subscribeRequired: (channel) =>
    `Para descargar, suscríbete a nuestro canal ${channel} — es la única condición, el servicio sigue siendo gratis.\n\n` +
    "Suscríbete y pulsa «Ya me suscribí».",
  openChannelButton: "📣 Abrir el canal",
  checkSubscriptionButton: "Ya me suscribí",
  subscribeThanks: "¡Gracias! Ahora envíame el enlace de un video.",
  subscribeThanksResuming: "¡Gracias! Retomo tu enlace ahora mismo.",
  subscribeStillMissing: "Todavía no veo la suscripción. Suscríbete y pulsa de nuevo.",
  channelNotice: (channel) => `\n\nEl enlace a esta publicación aparecerá en ${channel} — de forma anónima, sin tu nombre.`,
  channelPost: (title, url) =>
    (title ? `🎬 ${title.slice(0, 200)}\n\n` : "") +
    `${url}\n\n` +
    "Descarga este y cualquier otro video gratis: @VideonerBot",
  errorStoryNeedsId:
    "envía el enlace de una historia concreta: ábrela en la app de Instagram y toca Compartir → Copiar enlace.",
  errorInstagramStory:
    "Las historias de Instagram solo son visibles para quienes han iniciado sesión.",
  errorLoginRequired:
    "Esta publicación no está disponible sin iniciar sesión: la plataforma solo la muestra a " +
    "usuarios con sesión iniciada. Pasa con publicaciones privadas, contenido con restricción de edad y " +
    "publicaciones compartidas con un público limitado.\n\n" +
    "Las publicaciones públicas se descargan sin problemas — prueba con otro enlace.",
  errorUnsupportedPlatform:
    "No pude reconocer ese enlace — asegúrate de que sea un enlace directo a un video de YouTube, TikTok, Instagram, Facebook, Twitter/X, Vimeo, VK, Rutube, OK.ru, Pinterest o Threads.",
  errorFileTooLarge: "el archivo pesa más de 2 GB — Telegram no deja que los bots envíen archivos más grandes. Descárgalo en el sitio web o con la extensión para el navegador — botones abajo. O envía el enlace de nuevo y elige una calidad más baja.",
  siteButton: "🌐 Descargar en el sitio web",
  qualitiesHiddenBySize: (limit) =>
    `\n\n⚖️ Las calidades de más de ${limit} están ocultas: Telegram no deja que los bots envíen archivos más grandes. Puedes descargarlas en el sitio web o con la extensión para el navegador — botones abajo.`,
  videoTooBigForTelegram: (smallest) =>
    `\n\n⚖️ Este video es demasiado pesado para Telegram incluso en la calidad más baja (~${smallest}): Telegram no deja que los bots envíen archivos de más de 2 GB. Aquí puedes obtener solo el audio; el video — en el sitio web o con la extensión para el navegador (botones abajo).`,
  errorFormatUnavailable: "Esa calidad no está disponible para este video. Envía el enlace de nuevo — te mostraré la lista actual.",
  errorNoVideoContent: "Este enlace no tiene ningún video para descargar — parece que la publicación solo tiene fotos.",
  errorRegionBlocked:
    "Este video está bloqueado fuera del país del autor — la plataforma no se lo " +
    "entrega a nuestro servidor. No hay forma de evitarlo: la restricción es de su lado." +
    "\n\nLos demás enlaces se descargan como siempre.",
  errorRateLimited: "Demasiados enlaces seguidos — espera un poco y envíalo de nuevo.",
  errorYoutubeDailyLimit: (gb) => `descargaste más de ${gb} GB de YouTube en las últimas 24 horas — es el límite diario del bot por persona. Se cuentan las últimas 24 horas, así que podrás descargar nuevos videos de YouTube un poco más tarde. Las demás plataformas funcionan como siempre.`,
  playlistStoppedByLimit: (dropped) => `⏹ Lista detenida: se alcanzó el límite diario de YouTube. Videos sin descargar: ${dropped}. Envía de nuevo el enlace de la lista más tarde.`,
  errorPlatformRefused:
    "la plataforma no le entregó este video a nuestro servidor. Pasa con publicaciones " +
    "privadas o con restricción de edad, y a veces la plataforma simplemente limita el acceso " +
    "por un tiempo. Inténtalo de nuevo en unos minutos.",
  errorThreadsNoMedia:
    "en esta publicación de Threads no se ve ningún video ni foto. O es una publicación solo de texto, o " +
    "Threads muestra sus archivos solo a usuarios con sesión iniciada — esas publicaciones no se pueden descargar sin iniciar sesión.",
  extensionHint:
    "\n\n💻 Puedes descargarlo con la extensión de Videoner para el navegador en un ordenador: " +
    "descarga con tu propia sesión en la plataforma, y ninguna contraseña ni cookie sale de tu navegador.",
  privateConnectHint: (platform, withExtension) =>
    `\n\n🔑 Para descargar publicaciones como esta, conecta tu cuenta de ${platform} al bot — una sola vez. Después el bot descarga todo lo que tú puedes ver: publicaciones privadas, reels e historias, también desde el móvil. El botón de abajo muestra cómo.${withExtension ? "\n\n💻 O descárgalo con la extensión de Videoner para el navegador en un ordenador." : ""}`,
  privateReconnectHint: (platform, withExtension) =>
    `\n\n⚠️ Tu cuenta de ${platform} conectada no pudo abrir esta publicación. Puede que la sesión haya dejado de funcionar — vuelve a conectar la cuenta. O esa cuenta no tiene acceso a la publicación.${withExtension ? "\n\n💻 También puedes descargarlo con la extensión de Videoner para el navegador en un ordenador." : ""}`,
  connectAccountButton: "🔑 Conectar cuenta",
  reconnectAccountButton: "🔑 Volver a conectar",
  extensionButton: "🧩 Descargar con la extensión",
  extensionCommand:
    "🧩 Videoner para tu navegador: un botón Descargar directamente en la página del video — YouTube, Instagram, TikTok, VK, videos privados de tu cuenta y lecciones de GetCourse.\n\nPara Chrome, Edge, Opera, Yandex Browser y Firefox en un ordenador.",
  extensionPageButton: "🧩 Instalar la extensión",
  addToGroupButton: "👥 Agregar a un grupo",
  newsButton: "📣 Novedades del proyecto",
  fileCaptionShort: (title, sourceUrl) =>
    withOptionalLines((title ? `🎬 ${title.slice(0, 200)}\n\n` : "") + sourceUrl, `📣 Novedades del proyecto: ${NEWS_CHANNEL}`, undefined),
  sentBy: (name) => `👤 ${name}`,
  groupSettings: (s, canDelete) =>
    "⚙️ Configuración del bot en este grupo\n\n" +
    `🗑 Borrar el mensaje con el enlace: ${s.deleteLinks ? "sí" : "no"}\n` +
    "Cuando se envía el video, el mensaje que solo contenía el enlace se borra — en el chat queda solo el video con el nombre de quien lo compartió.\n" +
    (s.deleteLinks && !canDelete
      ? "⚠️ Ahora no puedo borrar mensajes: hazme administrador con el permiso «Eliminar mensajes».\n"
      : "") +
    `\n✍️ Texto bajo el video: ${{ full: "completo", short: "título y fuente", none: "sin texto" }[s.caption] ?? s.caption}\n` +
    `\n🎞 Calidad: ${s.quality === "max" ? "la más alta que acepta Telegram" : "estándar (720p)"}\n` +
    `\n⏱ Videos largos: ${s.longVideos ? "de cualquier duración" : "solo hasta 15 minutos"}\n` +
    `\n🔑 Quién puede conectar sus cuentas (para historias y publicaciones privadas): ${s.cookiesBy === "all" ? "cualquier miembro" : "solo los administradores"}\n` +
    `\n🌐 Idioma de las respuestas: ${s.language ? langName(s.language) : "el de cada miembro"}\n` +
    "\nSolo los administradores del grupo pueden cambiar la configuración.",
  settingsDeleteButton: (on) => `🗑 Borrar enlaces: ${on ? "sí" : "no"}`,
  settingsCaptionButton: (style) => `✍️ Texto: ${{ full: "completo", short: "corto", none: "ninguno" }[style] ?? style}`,
  settingsQualityButton: (mode) => `🎞 Calidad: ${mode === "max" ? "máxima" : "720p"}`,
  settingsLongButton: (on) => `⏱ Videos largos: ${on ? "sí" : "hasta 15 min"}`,
  settingsDoneButton: "✅ Listo",
  settingsAdminsOnly: "Solo los administradores del grupo pueden cambiar la configuración.",
  settingsGroupsOnly: "La configuración es para grupos: agrégame a un grupo y envía /settings allí.",
  settingsFailed: "No se pudo guardar la configuración, inténtalo de nuevo.",
  settingsCookiesButton: (by) => `🔑 Conectar cuentas: ${by === "all" ? "todos" : "administradores"}`,
  accountsIntro:
    "🔑 Cuentas conectadas\n\nEl bot puede descargar lo que solo ven quienes han iniciado sesión (historias de Instagram, publicaciones privadas) — usando tu cuenta. Una sesión funciona donde la conectaste: la del chat privado sirve para tus descargas, incluidos tus propios enlaces en grupos que no tienen cuenta propia; la conectada a un grupo sirve para todos sus miembros.",
  accountsHowTo:
    "Cómo conectar:\n1. Lo más fácil: la extensión de Videoner en un ordenador — inicia sesión en el sitio de la plataforma, abre la ventana de Videoner, pulsa «🔑 Conecta tu cuenta de … al bot» y envíame el código. Para un grupo, envía /connect CÓDIGO en ese grupo.\n2. O envíame un archivo cookies.txt (cookies exportadas del navegador), o pega su texto en un mensaje.\n3. Desde un teléfono Android — con Firefox y el complemento Cookie-Editor: https://videoner.download/es/blog/android-firefox",
  accountsWarning:
    "⚠️ A las plataformas no les gustan las descargas automáticas y pueden restringir o bloquear la cuenta. Mejor conecta una cuenta secundaria, no la principal. Las cookies se guardan cifradas, se usan solo para descargar y se eliminan con los botones de abajo.",
  accountsNone: "Todavía no hay nada conectado.",
  accountsGroupTitle: "🔑 Cuentas conectadas a este grupo",
  accountsGroupHowTo:
    "Para conectar una cuenta para todo el grupo: obtén un código con el botón «🔑 Conecta tu cuenta de … al bot» en la extensión de Videoner y envía aquí /connect CÓDIGO. Si conectaste una cuenta solo en tu chat privado, el bot la usa aquí para tus propios enlaces. Tus conexiones: /accounts en un chat privado con @VideonerBot.",
  accountsLine: (platform, where, active) => `• ${platform} — ${where}${active ? "" : " (⚠️ la sesión no funciona)"}`,
  accountsGroupLine: (platform, owner, active) => `• ${platform} — ${owner}${active ? "" : " (⚠️ la sesión no funciona)"}`,
  accountsWhereHere: "chat privado",
  accountsWhereGroup: (title) => `grupo «${title}»`,
  accountsDeleteButton: (platform, where) => `🗑 ${platform} · ${where}`,
  accountsDeleteAllButton: "🗑 Eliminar todas mis conexiones",
  accountsDeleted: "Eliminado.",
  accountsDeletedAll: (n) => `Conexiones eliminadas: ${n}.`,
  accountsNotAllowed: "Solo quien la conectó o un administrador del grupo puede eliminarla.",
  connectUsage:
    "Envía /connect CÓDIGO. El código te lo da el botón «🔑 Conecta tu cuenta de … al bot» en la extensión de Videoner en un ordenador. Tus conexiones: /accounts.",
  connectOnlyAdmins: "Solo los administradores pueden conectar cuentas a este grupo (ver /settings).",
  connectDone: (platform, where) =>
    `✅ ${platform} conectado ${where}. Ahora el bot también descarga lo que solo ven quienes han iniciado sesión. Ver o eliminar: /accounts.\n\n⚠️ La plataforma puede restringir la cuenta por las descargas automáticas — mejor usa una secundaria.`,
  connectWhereGroup: "a este grupo",
  connectWhereHere: "para tus descargas en el chat privado y el modo inline",
  connectCodeNotFound: "Código no encontrado o caducado (los códigos duran 10 minutos). Obtén uno nuevo en la extensión de Videoner.",
  connectRejectedNoSession: "Estas cookies no tienen una sesión iniciada. Inicia sesión en el sitio de la plataforma y vuelve a exportar las cookies.",
  connectRejectedUnknown: "No se encontraron cookies de las plataformas compatibles: Instagram, Facebook, YouTube, X, VK, TikTok.",
  connectUnavailable: "Conectar cuentas todavía no está disponible.",
  connectFailed: "No se pudo conectar, inténtalo de nuevo.",
  connectFileTooBig: "El archivo es demasiado grande — exporta solo las cookies del sitio que necesitas.",
  connectNotAnonymous: "Conecta la cuenta como tú mismo, no de forma anónima como el grupo: si no, las conexiones de los administradores se mezclan. Anulé el código — obtén uno nuevo.",
  connectCodeInGroup:
    "Un código de conexión publicado en el chat del grupo lo pueden ver otros — lo anulé y borré el mensaje. Obtén uno nuevo y envíalo con /connect CÓDIGO: borro ese mensaje con el comando al instante.",
  groupWelcome:
    "👋 ¡Hola! Publica en este chat enlaces a videos de TikTok, Instagram, YouTube, VK y otras plataformas — responderé con el propio video.\n\n" +
    "Descargo por mi cuenta los clips de hasta 15 minutos, sin comandos, y el resto del tiempo me quedo callado.\n\n⚙️ Los administradores del grupo pueden ajustarme con /settings: borrar los mensajes con enlaces, estilo del texto, calidad, videos largos e idioma.\n\n⚡ Añade -audio después de un enlace para recibir el sonido, o -hd para la mejor calidad.\n\n📣 Novedades del proyecto: @videonerdownload",
  errorTooLong: "el video es demasiado largo — todavía no podemos descargar videos tan largos.",
  errorUnknown: "no se pudo descargar este video. Inténtalo un poco más tarde o envía otro enlace.",
  inlineHintButton: "Enviar un enlace al bot",
  inlineResultTitle: "⬇️ Descargar video",
  inlineResultDescription: "El video se publicará directamente en este chat",
  inlinePlaceholder: "⏬ Descargando, puede tardar un par de minutos...",
  inlineOpenBot: "Abrir el bot",
  inlineOnlySingleVideo:
    "Este modo envía un solo video. Para publicaciones con varios archivos o fotos, envía el enlace al bot en un chat privado.",
  inlineSubscribeRequired: (channel: string) =>
    `Para descargar, suscríbete a ${channel} e inténtalo de nuevo.`,
  inlineRateLimited: "Demasiadas solicitudes seguidas. Espera un minuto e inténtalo de nuevo.",
  queueRest: (count) => `\n\n📋 Enlaces que siguen en la cola: ${count}. Te los mostraré uno por uno después de este.`,
  queuedOne: (position) =>
    `📋 Enlace en la cola, n.º ${position}. Primero terminamos el actual — luego te muestro la elección de calidad para este.`,
  queuedMany: (added, waiting) =>
    `📋 Enlaces añadidos a la cola: ${added}. En espera en total: ${waiting}. Te los mostraré uno por uno después del actual.`,
  queueDuplicates: (count) =>
    count === 1
      ? "Este enlace ya está en la cola — no lo añado dos veces."
      : `Los enlaces que ya están en la cola no se añaden dos veces (repetidos: ${count}).`,
  queueFull: (limit, rejected) =>
    `La cola admite como máximo ${limit} enlaces — los sobrantes no se añadieron (${rejected}). Envíalos cuando la cola avance.`,
  skipButton: "✖️ No descargar",
  skipped: "⏭ Enlace omitido.",
  chooseTimedOut: "⌛ No se eligió ninguna calidad en 30 minutos — omito este enlace.",
  queueLostOnRestart: (count) =>
    `⚠️ El bot se está reiniciando por una actualización — la cola se vació (enlaces: ${count}). Envíalos de nuevo dentro de un minuto.`,
  subtitlesButton: "📝 Subtítulos",
  subtitlesBack: "⬅️ Volver a la calidad",
  subtitlesAuto: "auto",
  subtitlesChoose: "Elige el idioma de los subtítulos",
  subtitlesPreparing: "📝 Preparando los subtítulos...",
  subtitlesFailed: "No se pudieron descargar los subtítulos en este idioma. Prueba con otro idioma.",
  subtitlesBusy: "YouTube no está entregando subtítulos en este momento — inténtalo de nuevo en unos minutos.",
  playlistFound: (title, count) =>
    `📃 Lista${title ? ` «${title.slice(0, 150)}»` : ""}: ${count} videos.\nLos descargaré uno por uno. ¿En qué formato?`,
  playlistStdButton: "🎬 720p",
  playlistHdButton: "🎬 Mejor calidad",
  playlistAudioButton: "🎵 Solo audio (mp3)",
  playlistNoButton: "✖️ No, gracias",
  playlistQueued: (count) =>
    `📃 Videos de la lista en la cola: ${count}. Te los enviaré uno por uno. Detén la descarga con el botón de abajo o con /stop.`,
  playlistFailed: "No se pudo abrir la lista — puede que sea privada. Envía el enlace de un solo video.",
  stopButton: "⏹ Detener",
  stopped: (dropped) => `⏹ Detenido.${dropped ? ` Enlaces quitados de la cola: ${dropped}.` : ""}`,
  nothingToStop: "No se está descargando nada en este momento.",
  languageChoose: "🌐 Elige el idioma del bot. «Auto» sigue el idioma de tu Telegram.",
  languageChooseGroup: "🌐 El idioma de las respuestas del bot en este grupo. «Auto» — el idioma de Telegram de cada miembro.",
  languageAuto: "Auto — como en Telegram",
  languageAutoGroup: "Auto — el de cada miembro",
  languageSaved: (name) => `✅ Idioma del bot: ${name}. Cámbialo con /language.`,
  languageSavedAuto: "✅ El bot sigue el idioma de tu Telegram. Cámbialo con /language.",
  settingsLanguageButton: (name) => `🌐 Idioma: ${name ?? "automático"}`,
  settingsBack: "⬅️ Volver a la configuración",
};

const uz: Messages = {
  start: "Assalomu alaykum! Menga YouTube, TikTok, Instagram, Facebook, Twitter/X, Vimeo, VK, Rutube, OK.ru, Pinterest yoki Threads platformasidagi videoga havola yuboring — uni yuklab olishga yordam beraman.\n\n✨ Sifat cheklanmagan: platformada nima boʻlsa, 4K gacha beraman — faqat fayl 2 GB ga sigʻsin, bu Telegram botlar uchun belgilagan chegara. Bu yerda pullik funksiyalar umuman yoʻq.\n\nMutlaqo bepul: obunalarsiz, reklamasiz, ilova ichidagi xaridlarsiz.\n\n🧩 Kompyuterda yuklab olyapsizmi? Brauzer kengaytmasini oʻrnating — «Yuklab olish» tugmasi toʻgʻridan-toʻgʻri video sahifasida paydo boʻladi: videoner.download/uz/extension\n\n👥 Meni guruhga qoʻshing — u yerda ulashilgan havolalar boʻyicha videolarni oʻzim yuboraman.\n\n⚡ Sifat tanlamasdan: havoladan keyin -audio yozing — faqat ovoz (mp3), -hd — eng yaxshi sifatdagi video.\n\n📣 Loyiha yangiliklari: @videonerdownload\n\n🌐 Bot tili: /language",
  notLink: "Bu havolaga oʻxshamaydi. Menga video havolasini yuboring.",
  inviteGreeting: "Assalomu alaykum! Men Videoner — YouTube, TikTok, Instagram va boshqa platformalardan videolarni bepul yuklab olaman. Sizga ulashilgan videoni tayyorlayapman 👇",
  inviteNotFound: "Bu taklif havolasi boʻyicha video topilmadi. Menga video havolasini yuboring — yuklab beraman.",
  inviteUnavailable: "Bu havoladagi videoni ochib boʻlmadi — xizmat hozir javob bermayapti. Bir daqiqadan soʻng shu havolani qayta oching.",
  fetchingInfo: "🔍 Video haqida maʼlumot olinmoqda...",
  audioOnlyButton: "🎵 Faqat audio (mp3)",
  photoButton: "📷 Rasmlarni yuklab olish",
  slideshowButton: "🎞 Slayd-shou (video)",
  galleryButton: "📷+🎞 Rasmlar va slayd-shou",
  chooseQuality: (title, duration) => `«${title}»${duration ? `\n⏱ ${duration}` : ""}\n\nSifatni tanlang:`,
  sessionExpired: "Sessiya muddati tugadi — havolani qayta yuboring",
  downloading: "⏬ Yuklab olinmoqda, bu bir-ikki daqiqa vaqt olishi mumkin...",
  downloadFailed: "yuklab olib boʻlmadi",
  downloadProgress: (percent, eta, done) =>
    `⏬ Yuklab olinmoqda: ${percent}%${eta ? ` · yana ${eta}` : ""}${done ? `\n${done}` : ""}`,
  downloadFinishing: "⚙️ Deyarli tayyor — fayl yigʻilmoqda...",
  converting: (percent) => `⚙️ Konvertatsiya: ${percent}%`,
  etaUnderMinute: "bir daqiqadan kam",
  etaMinutes: (minutes) => `~${minutes} daq`,
  etaHours: (hours, minutes) => `~${hours} soat${minutes ? ` ${minutes} daq` : ""}`,
  downloadTimeout: "yuklab olish juda uzoq davom etmoqda — video juda ogʻir koʻrinadi. Pastroq sifatni tanlab koʻring.",
  downloadInterrupted: "⚠️ Bot yangilanish uchun qayta ishga tushmoqda — yuklab olishingiz uzilib qoldi. Bir daqiqadan soʻng havolani qayta yuboring.",
  fileTooBig: (mb, url) =>
    `Fayl katta boʻlib chiqdi (${mb} MB) — Telegram botga uni yuborishga ruxsat bermaydi.\nBu yerdan yuklab oling: ${url}`,
  sendingFile: "📤 Fayl yuborilmoqda...",
  sendingAlbum: (count) => `📤 Bu postda bir nechta fayl bor (${count}) — ularni albom qilib yuboryapman...`,
  failedPrefix: "❌ Xatolik: ",
  fileCaption: (title, sourceUrl, shareUrl, description) =>
    composeCaption(
      title,
      description,
      `Manba: ${sourceUrl}\n` +
        "Videoga oid barcha huquqlar uning muallifiga tegishli.\n" +
        "@VideonerBot orqali bepul yuklab olindi",
      `📣 Loyiha yangiliklari: ${NEWS_CHANNEL}`,
      shareUrl && `🔗 Ulashish: ${shareUrl}`,
    ),
  subscribeRequired: (channel) =>
    `Yuklab olish uchun ${channel} kanalimizga obuna boʻling — bu yagona shart, xizmat bepulligicha qoladi.\n\n` +
    "Obuna boʻling va «Obuna boʻldim» tugmasini bosing.",
  openChannelButton: "📣 Kanalni ochish",
  checkSubscriptionButton: "Obuna boʻldim",
  subscribeThanks: "Rahmat! Endi menga video havolasini yuboring.",
  subscribeThanksResuming: "Rahmat! Havolangizni hozir ishga olaman.",
  subscribeStillMissing: "Obunani hali koʻrmayapman. Obuna boʻling va yana bosing.",
  channelNotice: (channel) => `\n\nBu post havolasi ${channel} kanalida paydo boʻladi — anonim tarzda, ismingizsiz.`,
  channelPost: (title, url) =>
    (title ? `🎬 ${title.slice(0, 200)}\n\n` : "") +
    `${url}\n\n` +
    "Bu va istalgan boshqa videoni bepul yuklab oling: @VideonerBot",
  errorStoryNeedsId:
    "aniq bir storisga havola yuboring: uni Instagram ilovasida oching va «Ulashish» → «Havolani nusxalash» tugmasini bosing.",
  errorInstagramStory:
    "Instagram storislarini faqat akkauntiga kirgan foydalanuvchilar koʻra oladi.",
  errorLoginRequired:
    "Bu postni akkauntga kirmasdan ochib boʻlmaydi: platforma uni faqat " +
    "tizimga kirgan foydalanuvchilarga koʻrsatadi. Bu yopiq postlarda, yosh cheklovi bor kontentda va " +
    "cheklangan auditoriya uchun ulashilgan postlarda boʻladi.\n\n" +
    "Ochiq postlar muammosiz yuklab olinadi — boshqa havolani sinab koʻring.",
  errorUnsupportedPlatform:
    "Bu havolani aniqlab boʻlmadi — bu YouTube, TikTok, Instagram, Facebook, Twitter/X, Vimeo, VK, Rutube, OK.ru, Pinterest yoki Threads platformasidagi videoga toʻgʻridan-toʻgʻri havola ekanini tekshiring.",
  errorFileTooLarge: "fayl 2 GB dan katta — Telegram botlarga bundan katta fayllarni yuborishga ruxsat bermaydi. Uni saytda yoki brauzer kengaytmasi orqali yuklab oling — tugmalar quyida. Yoki havolani qayta yuborib, pastroq sifatni tanlang.",
  siteButton: "🌐 Saytda yuklab olish",
  qualitiesHiddenBySize: (limit) =>
    `\n\n⚖️ ${limit} dan ogʻir sifatlar yashirildi: Telegram botlarga kattaroq fayllarni yuborishga ruxsat bermaydi. Ularni saytda yoki brauzer kengaytmasi orqali yuklab olishingiz mumkin — tugmalar quyida.`,
  videoTooBigForTelegram: (smallest) =>
    `\n\n⚖️ Bu video eng past sifatda ham Telegram uchun juda ogʻir (~${smallest}): Telegram botlarga 2 GB dan katta fayllarni yuborishga ruxsat bermaydi. Bu yerda faqat audioni olishingiz mumkin, videoni esa — saytda yoki brauzer kengaytmasi orqali (tugmalar quyida).`,
  errorFormatUnavailable: "Bu video uchun bunday sifat mavjud emas. Havolani qayta yuboring — joriy roʻyxatni koʻrsataman.",
  errorNoVideoContent: "Bu havolada yuklab olinadigan video yoʻq — post faqat rasmlardan iborat koʻrinadi.",
  errorRegionBlocked:
    "Bu video muallif mamlakatidan tashqarida bloklangan — platforma uni " +
    "serverimizga bermaydi. Buni chetlab oʻtishning iloji yoʻq: cheklov ular tomonida." +
    "\n\nBoshqa havolalar odatdagidek yuklab olinadi.",
  errorRateLimited: "Ketma-ket juda koʻp havola — biroz kuting va qayta yuboring.",
  errorYoutubeDailyLimit: (gb) => `soʻnggi 24 soatda YouTube platformasidan ${gb} GB dan koʻp yuklab oldingiz — bu botning bir kishi uchun kunlik limiti. Hisob soʻnggi 24 soat boʻyicha yuritiladi, shuning uchun yangi YouTube videolarini birozdan keyin yuklab olishingiz mumkin. Boshqa platformalar odatdagidek ishlaydi.`,
  playlistStoppedByLimit: (dropped) => `⏹ Pleylist toʻxtatildi: YouTube kunlik limitiga yetildi. Yuklab olinmagan videolar: ${dropped}. Pleylist havolasini keyinroq qayta yuboring.`,
  errorPlatformRefused:
    "platforma bu videoni serverimizga bermadi. Bu yopiq " +
    "yoki yosh cheklovi bor postlarda boʻladi, baʼzan esa platforma kirishni shunchaki vaqtincha " +
    "cheklaydi. Bir necha daqiqadan soʻng qayta urinib koʻring.",
  errorThreadsNoMedia:
    "bu Threads postida video ham, rasm ham koʻrinmayapti. Yo bu faqat matnli post, yoki " +
    "Threads uning mediasini faqat tizimga kirgan foydalanuvchilarga koʻrsatadi — bunday postlarni akkauntga kirmasdan yuklab boʻlmaydi.",
  extensionHint:
    "\n\n💻 Uni kompyuterda Videoner brauzer kengaytmasi orqali yuklab olishingiz mumkin: " +
    "u platformadagi oʻz akkauntingiz orqali yuklab oladi, parol ham, cookie fayllar ham brauzeringizdan tashqariga chiqmaydi.",
  privateConnectHint: (platform, withExtension) =>
    `\n\n🔑 Bunday postlarni yuklab olish uchun ${platform} akkauntingizni botga ulang — bir marta. Shundan soʻng bot siz koʻra oladigan hamma narsani yuklab oladi: yopiq postlar, reels va storislar, telefondan ham. Buni qanday qilish — quyidagi tugmada.${withExtension ? "\n\n💻 Yoki uni kompyuterda Videoner brauzer kengaytmasi orqali yuklab oling." : ""}`,
  privateReconnectHint: (platform, withExtension) =>
    `\n\n⚠️ Ulangan ${platform} akkauntingiz bu postni ocha olmadi. Ehtimol, kirish ishlamay qolgan — akkauntni qayta ulang. Yoki bu akkauntda postga ruxsat yoʻq.${withExtension ? "\n\n💻 Uni kompyuterda Videoner brauzer kengaytmasi orqali ham yuklab olishingiz mumkin." : ""}`,
  connectAccountButton: "🔑 Akkauntni ulash",
  reconnectAccountButton: "🔑 Qayta ulash",
  extensionButton: "🧩 Kengaytma orqali yuklab olish",
  extensionCommand:
    "🧩 Brauzer uchun Videoner: «Yuklab olish» tugmasi toʻgʻridan-toʻgʻri video sahifasida — YouTube, Instagram, TikTok, VK, akkauntingizdagi yopiq videolar va GetCourse darslari.\n\nKompyuterdagi Chrome, Edge, Opera, Yandex Browser va Firefox uchun.",
  extensionPageButton: "🧩 Kengaytmani oʻrnatish",
  addToGroupButton: "👥 Guruhga qoʻshish",
  newsButton: "📣 Loyiha yangiliklari",
  fileCaptionShort: (title, sourceUrl) =>
    withOptionalLines((title ? `🎬 ${title.slice(0, 200)}\n\n` : "") + sourceUrl, `📣 Loyiha yangiliklari: ${NEWS_CHANNEL}`, undefined),
  sentBy: (name) => `👤 ${name}`,
  groupSettings: (s, canDelete) =>
    "⚙️ Bu guruh uchun bot sozlamalari\n\n" +
    `🗑 Havolali xabarni oʻchirish: ${s.deleteLinks ? "ha" : "yoʻq"}\n` +
    "Video yuborilgach, faqat havoladan iborat xabar oʻchiriladi — chatda faqat video va uni ulashgan kishining ismi qoladi.\n" +
    (s.deleteLinks && !canDelete
      ? "⚠️ Hozir xabarlarni oʻchira olmayman: meni «Xabarlarni oʻchirish» huquqi bilan administrator qiling.\n"
      : "") +
    `\n✍️ Video ostidagi izoh: ${{ full: "toʻliq", short: "nomi va manba", none: "izohsiz" }[s.caption] ?? s.caption}\n` +
    `\n🎞 Sifat: ${s.quality === "max" ? "Telegram qabul qiladigan eng yuqori" : "standart (720p)"}\n` +
    `\n⏱ Uzun videolar: ${s.longVideos ? "istalgan uzunlikda" : "faqat 15 daqiqagacha"}\n` +
    `\n🔑 Kim oʻz akkauntlarini ulay oladi (storislar va yopiq postlar uchun): ${s.cookiesBy === "all" ? "istalgan aʼzo" : "faqat adminlar"}\n` +
    `\n🌐 Javob tili: ${s.language ? langName(s.language) : "har bir aʼzoning oʻz tili"}\n` +
    "\nSozlamalarni faqat guruh adminlari oʻzgartira oladi.",
  settingsDeleteButton: (on) => `🗑 Havolalarni oʻchirish: ${on ? "ha" : "yoʻq"}`,
  settingsCaptionButton: (style) => `✍️ Izoh: ${{ full: "toʻliq", short: "qisqa", none: "yoʻq" }[style] ?? style}`,
  settingsQualityButton: (mode) => `🎞 Sifat: ${mode === "max" ? "eng yuqori" : "720p"}`,
  settingsLongButton: (on) => `⏱ Uzun videolar: ${on ? "ha" : "15 daqiqagacha"}`,
  settingsDoneButton: "✅ Tayyor",
  settingsAdminsOnly: "Sozlamalarni faqat guruh adminlari oʻzgartira oladi.",
  settingsGroupsOnly: "Sozlamalar guruhlar uchun: meni guruhga qoʻshing va u yerda /settings yuboring.",
  settingsFailed: "Sozlamalarni saqlab boʻlmadi, qayta urinib koʻring.",
  settingsCookiesButton: (by) => `🔑 Akkauntlarni ulash: ${by === "all" ? "hamma" : "adminlar"}`,
  accountsIntro:
    "🔑 Ulangan akkauntlar\n\nBot faqat tizimga kirganlar koʻradigan narsalarni (Instagram storislari, yopiq postlar) sizning akkauntingiz orqali yuklab olishi mumkin. Kirish qayerda ulangan boʻlsa, oʻsha yerda ishlaydi: shaxsiy chatda ulangani sizning yuklab olishlaringizga, jumladan oʻz akkaunti ulanmagan guruhlardagi oʻz havolalaringizga xizmat qiladi; guruhga ulangani esa uning barcha aʼzolariga xizmat qiladi.",
  accountsHowTo:
    "Qanday ulash mumkin:\n1. Eng osoni: kompyuterdagi Videoner kengaytmasi — platforma saytida akkauntingizga kiring, Videoner oynasini oching, «🔑 … akkauntingizni botga ulash» tugmasini bosing va menga kodni yuboring. Guruh uchun oʻsha guruhda /connect KOD yuboring.\n2. Yoki menga cookies.txt faylini (brauzerdan eksport qilingan cookie fayllar) yuboring yoki uning matnini xabar sifatida joylang.\n3. Android telefondan — Firefox va Cookie-Editor qoʻshimchasi orqali: https://videoner.download/uz/blog/android-firefox",
  accountsWarning:
    "⚠️ Platformalar avtomatik yuklab olishni yoqtirmaydi va akkauntni cheklashi yoki bloklashi mumkin. Asosiy emas, qoʻshimcha akkauntni ulagan maʼqul. Cookie fayllar shifrlangan holda saqlanadi, faqat yuklab olish uchun ishlatiladi va quyidagi tugmalar bilan oʻchiriladi.",
  accountsNone: "Hozircha hech narsa ulanmagan.",
  accountsGroupTitle: "🔑 Bu guruhga ulangan akkauntlar",
  accountsGroupHowTo:
    "Butun guruh uchun ulash: Videoner kengaytmasidagi «🔑 … akkauntingizni botga ulash» tugmasi orqali kod oling va shu yerda /connect KOD yuboring. Agar akkauntni faqat shaxsiy chatingizda ulagan boʻlsangiz, bot undan bu yerda ham oʻz havolalaringiz uchun foydalanadi. Ulanishlaringiz: @VideonerBot bilan shaxsiy chatda /accounts.",
  accountsLine: (platform, where, active) => `• ${platform} — ${where}${active ? "" : " (⚠️ kirish ishlamayapti)"}`,
  accountsGroupLine: (platform, owner, active) => `• ${platform} — ${owner}${active ? "" : " (⚠️ kirish ishlamayapti)"}`,
  accountsWhereHere: "shaxsiy chat",
  accountsWhereGroup: (title) => `«${title}» guruhi`,
  accountsDeleteButton: (platform, where) => `🗑 ${platform} · ${where}`,
  accountsDeleteAllButton: "🗑 Barcha ulanishlarimni oʻchirish",
  accountsDeleted: "Oʻchirildi.",
  accountsDeletedAll: (n) => `Oʻchirilgan ulanishlar: ${n}.`,
  accountsNotAllowed: "Uni faqat ulagan kishi yoki guruh admini oʻchira oladi.",
  connectUsage:
    "/connect KOD yuboring. Kodni kompyuterdagi Videoner kengaytmasidagi «🔑 … akkauntingizni botga ulash» tugmasi beradi. Ulanishlaringiz: /accounts.",
  connectOnlyAdmins: "Bu guruhga akkauntlarni faqat adminlar ulay oladi (/settings ga qarang).",
  connectDone: (platform, where) =>
    `✅ ${platform} ${where} ulandi. Endi bot faqat tizimga kirganlar koʻradigan narsalarni ham yuklab oladi. Koʻrish yoki oʻchirish: /accounts.\n\n⚠️ Platforma avtomatik yuklab olish uchun akkauntni cheklashi mumkin — qoʻshimcha akkauntdan foydalangan maʼqul.`,
  connectWhereGroup: "bu guruhga",
  connectWhereHere: "shaxsiy chatdagi va inline rejimdagi yuklab olishlaringiz uchun",
  connectCodeNotFound: "Kod topilmadi yoki muddati tugagan (kodlar 10 daqiqa amal qiladi). Videoner kengaytmasida yangisini oling.",
  connectRejectedNoSession: "Bu cookie fayllarda akkauntga kirish maʼlumotlari yoʻq. Platforma saytida akkauntingizga kiring va cookie fayllarni qayta eksport qiling.",
  connectRejectedUnknown: "Qoʻllab-quvvatlanadigan platformalarning cookie fayllari topilmadi: Instagram, Facebook, YouTube, X, VK, TikTok.",
  connectUnavailable: "Akkauntlarni ulash hozircha mavjud emas.",
  connectFailed: "Ulab boʻlmadi, qayta urinib koʻring.",
  connectFileTooBig: "Fayl juda katta — faqat kerakli saytning cookie fayllarini eksport qiling.",
  connectNotAnonymous: "Akkauntni guruh nomidan anonim tarzda emas, oʻz nomingizdan ulang: aks holda adminlarning ulanishlari aralashib ketadi. Kodni yoʻq qildim — yangisini oling.",
  connectCodeInGroup:
    "Guruh chatida yuborilgan ulanish kodini boshqalar ham koʻrishi mumkin — uni yoʻq qildim va xabarni oʻchirdim. Yangisini oling va /connect KOD bilan yuboring: bunday buyruqli xabarni darhol oʻchiraman.",
  groupWelcome:
    "👋 Assalomu alaykum! Bu chatga TikTok, Instagram, YouTube, VK va boshqa platformalardagi videolarga havolalar tashlang — men videoning oʻzi bilan javob beraman.\n\n" +
    "15 daqiqagacha boʻlgan videolarni buyruqlarsiz oʻzim yuklab olaman, boshqa paytlarda jim turaman.\n\n⚙️ Guruh adminlari meni /settings orqali sozlashi mumkin: havolali xabarlarni oʻchirish, izoh uslubi, sifat, uzun videolar va til.\n\n⚡ Ovozni olish uchun havoladan keyin -audio, eng yaxshi sifat uchun -hd qoʻshing.\n\n📣 Loyiha yangiliklari: @videonerdownload",
  errorTooLong: "video juda uzun — bunday uzun videolarni hozircha yuklab ololmaymiz.",
  errorUnknown: "bu videoni yuklab boʻlmadi. Birozdan keyin qayta urinib koʻring yoki boshqa havola yuboring.",
  inlineHintButton: "Botga havola yuborish",
  inlineResultTitle: "⬇️ Videoni yuklab olish",
  inlineResultDescription: "Video aynan shu chatga joylanadi",
  inlinePlaceholder: "⏬ Yuklab olinmoqda, bu bir-ikki daqiqa vaqt olishi mumkin...",
  inlineOpenBot: "Botni ochish",
  inlineOnlySingleVideo:
    "Bu rejim bitta video yuboradi. Bir nechta faylli postlar yoki rasmlar uchun havolani botga shaxsiy chatda yuboring.",
  inlineSubscribeRequired: (channel: string) =>
    `Yuklab olish uchun ${channel} kanaliga obuna boʻling va qayta urinib koʻring.`,
  inlineRateLimited: "Ketma-ket juda koʻp soʻrov. Bir daqiqa kuting va qayta urinib koʻring.",
  queueRest: (count) => `\n\n📋 Navbatda yana havolalar bor: ${count}. Bundan keyin ularni birma-bir koʻrsataman.`,
  queuedOne: (position) =>
    `📋 Havola navbatga qoʻyildi, #${position}. Avval joriysini tugataylik — keyin uning uchun sifat tanlashni koʻrsataman.`,
  queuedMany: (added, waiting) =>
    `📋 Navbatga qoʻshilgan havolalar: ${added}. Jami kutmoqda: ${waiting}. Joriysidan keyin ularni birma-bir koʻrsataman.`,
  queueDuplicates: (count) =>
    count === 1
      ? "Bu havola allaqachon navbatda — ikki marta qoʻshmayman."
      : `Navbatda bor havolalar ikki marta qoʻshilmaydi (takrorlar: ${count}).`,
  queueFull: (limit, rejected) =>
    `Navbatga koʻpi bilan ${limit} ta havola sigʻadi — ortiqchalari qoʻshilmadi (${rejected}). Navbat siljigach, ularni yuboring.`,
  skipButton: "✖️ Yuklab olmaslik",
  skipped: "⏭ Bu havola oʻtkazib yuborildi.",
  chooseTimedOut: "⌛ 30 daqiqa ichida sifat tanlanmadi — bu havola oʻtkazib yuborildi.",
  queueLostOnRestart: (count) =>
    `⚠️ Bot yangilanish uchun qayta ishga tushmoqda — navbat tozalandi (havolalar: ${count}). Bir daqiqadan soʻng ularni qayta yuboring.`,
  subtitlesButton: "📝 Subtitrlar",
  subtitlesBack: "⬅️ Sifat tanlashga qaytish",
  subtitlesAuto: "avto",
  subtitlesChoose: "Subtitr tilini tanlang",
  subtitlesPreparing: "📝 Subtitrlar tayyorlanmoqda...",
  subtitlesFailed: "Bu tildagi subtitrlarni yuklab boʻlmadi. Boshqa tilni tanlab koʻring.",
  subtitlesBusy: "YouTube hozir subtitrlarni bermayapti — bir necha daqiqadan soʻng qayta urinib koʻring.",
  playlistFound: (title, count) =>
    `📃 Pleylist${title ? ` «${title.slice(0, 150)}»` : ""}: ${count} ta video.\nUlarni birma-bir yuklab olaman. Qaysi formatda?`,
  playlistStdButton: "🎬 720p",
  playlistHdButton: "🎬 Eng yaxshi sifat",
  playlistAudioButton: "🎵 Faqat audio (mp3)",
  playlistNoButton: "✖️ Yoʻq, rahmat",
  playlistQueued: (count) =>
    `📃 Pleylistdan navbatga qoʻyilgan videolar: ${count}. Ularni birma-bir yuboraman. Quyidagi tugma yoki /stop bilan toʻxtatishingiz mumkin.`,
  playlistFailed: "Pleylistni ochib boʻlmadi — u yopiq boʻlishi mumkin. Bitta videoga havola yuboring.",
  stopButton: "⏹ Toʻxtatish",
  stopped: (dropped) => `⏹ Toʻxtatildi.${dropped ? ` Navbatdan olib tashlangan havolalar: ${dropped}.` : ""}`,
  nothingToStop: "Hozir hech narsa yuklab olinmayapti.",
  languageChoose: "🌐 Bot tilini tanlang. «Avto» — Telegram tilingizga moslashadi.",
  languageChooseGroup: "🌐 Bu guruhda botning javob tili. «Avto» — har bir aʼzoning Telegram tili.",
  languageAuto: "Avto — Telegram tili boʻyicha",
  languageAutoGroup: "Avto — har bir aʼzoning oʻz tili",
  languageSaved: (name) => `✅ Bot tili: ${name}. /language orqali oʻzgartirishingiz mumkin.`,
  languageSavedAuto: "✅ Bot Telegram tilingizga moslashadi. /language orqali oʻzgartirishingiz mumkin.",
  settingsLanguageButton: (name) => `🌐 Til: ${name ?? "avto"}`,
  settingsBack: "⬅️ Sozlamalarga qaytish",
};

const tr: Messages = {
  start: "Merhaba! Bana YouTube, TikTok, Instagram, Facebook, Twitter/X, Vimeo, VK, Rutube, OK.ru, Pinterest veya Threads'teki bir videonun bağlantısını gönderin — indirmenize yardımcı olayım.\n\n✨ Kalite sınırı yok: platform ne sunuyorsa, 4K'ya kadar alırsınız — yeter ki dosya, Telegram'ın botlar için koyduğu 2 GB sınırına sığsın. Burada ücretli özellik yok.\n\nTamamen ücretsiz: abonelik yok, reklam yok, uygulama içi satın alma yok.\n\n🧩 Bilgisayardan mı indiriyorsunuz? Tarayıcı eklentisini yükleyin — İndir düğmesi doğrudan video sayfasında belirir: videoner.download/tr/extension\n\n👥 Beni bir gruba ekleyin, orada paylaşılan bağlantıların videolarını gönderirim.\n\n⚡ Kalite seçimini atlayın: yalnızca ses (mp3) için bağlantının ardından -audio, en iyi kalite için -hd ekleyin.\n\n📣 Proje haberleri: @videonerdownload\n\n🌐 Bot dili: /language",
  notLink: "Bu bir bağlantıya benzemiyor. Bana bir video bağlantısı gönderin.",
  inviteGreeting: "Merhaba! Ben Videoner — YouTube, TikTok, Instagram ve diğer platformlardan videoları ücretsiz indiririm. Sizinle paylaşılan videoyu hazırlıyorum 👇",
  inviteNotFound: "Bu davet bağlantısına ait bir video bulamadım. Bana bir video bağlantısı gönderin, indireyim.",
  inviteUnavailable: "Bu bağlantıdaki videoyu açamadım — hizmet şu anda yanıt vermiyor. Bir dakika sonra aynı bağlantıyı tekrar açın.",
  fetchingInfo: "🔍 Video bilgileri alınıyor...",
  audioOnlyButton: "🎵 Yalnızca ses (mp3)",
  photoButton: "📷 Fotoğrafları indir",
  slideshowButton: "🎞 Slayt gösterisi (video)",
  galleryButton: "📷+🎞 Fotoğraflar ve slayt gösterisi",
  chooseQuality: (title, duration) => `“${title}”${duration ? `\n⏱ ${duration}` : ""}\n\nKaliteyi seçin:`,
  sessionExpired: "Oturumun süresi doldu — bağlantıyı tekrar gönderin",
  downloading: "⏬ İndiriliyor, bu birkaç dakika sürebilir...",
  downloadFailed: "indirme başarısız oldu",
  downloadProgress: (percent, eta, done) =>
    `⏬ İndiriliyor: %${percent}${eta ? ` · ${eta} kaldı` : ""}${done ? `\n${done}` : ""}`,
  downloadFinishing: "⚙️ Neredeyse bitti — dosya birleştiriliyor...",
  converting: (percent) => `⚙️ Dönüştürülüyor: %${percent}`,
  etaUnderMinute: "bir dakikadan az",
  etaMinutes: (minutes) => `~${minutes} dk`,
  etaHours: (hours, minutes) => `~${hours} sa${minutes ? ` ${minutes} dk` : ""}`,
  downloadTimeout: "indirme çok uzun sürüyor — video çok büyük görünüyor. Daha düşük bir kalite deneyin.",
  downloadInterrupted: "⚠️ Bot bir güncelleme için yeniden başlatılıyor — indirmeniz yarıda kaldı. Lütfen bir dakika sonra bağlantıyı tekrar gönderin.",
  fileTooBig: (mb, url) =>
    `Dosya büyük çıktı (${mb} MB) — Telegram botun bunu göndermesine izin vermiyor.\nBuradan indirin: ${url}`,
  sendingFile: "📤 Dosya gönderiliyor...",
  sendingAlbum: (count) => `📤 Bu gönderide birden fazla dosya var (${count}) — albüm olarak gönderiyorum...`,
  failedPrefix: "❌ Başarısız: ",
  fileCaption: (title, sourceUrl, shareUrl, description) =>
    composeCaption(
      title,
      description,
      `Kaynak: ${sourceUrl}\n` +
        "Videonun tüm hakları sahibine aittir.\n" +
        "@VideonerBot ile ücretsiz indirildi",
      `📣 Proje haberleri: ${NEWS_CHANNEL}`,
      shareUrl && `🔗 Paylaş: ${shareUrl}`,
    ),
  subscribeRequired: (channel) =>
    `İndirmek için lütfen ${channel} kanalımıza abone olun — tek koşul bu, hizmet ücretsiz kalmaya devam ediyor.\n\n` +
    "Abone olun ve “Abone oldum” düğmesine basın.",
  openChannelButton: "📣 Kanalı aç",
  checkSubscriptionButton: "Abone oldum",
  subscribeThanks: "Teşekkürler! Şimdi bana bir video bağlantısı gönderin.",
  subscribeThanksResuming: "Teşekkürler! Bağlantınızı şimdi işliyorum.",
  subscribeStillMissing: "Aboneliği henüz göremiyorum. Abone olun ve tekrar basın.",
  channelNotice: (channel) => `\n\nBu gönderinin bağlantısı ${channel} kanalında görünecek — anonim olarak, adınız olmadan.`,
  channelPost: (title, url) =>
    (title ? `🎬 ${title.slice(0, 200)}\n\n` : "") +
    `${url}\n\n` +
    "Bu ve diğer tüm videoları ücretsiz indirin: @VideonerBot",
  errorStoryNeedsId:
    "belirli bir hikayenin bağlantısını gönderin: hikayeyi Instagram uygulamasında açın ve Paylaş → Bağlantıyı kopyala'ya dokunun.",
  errorInstagramStory:
    "Instagram hikayelerini yalnızca oturum açmış kişiler görebilir.",
  errorLoginRequired:
    "Bu gönderi oturum açmadan kullanılamıyor: platform onu yalnızca " +
    "giriş yapmış kullanıcılara gösteriyor. Bu durum gizli gönderilerde, yaş sınırlı içerikte ve " +
    "sınırlı bir kitleyle paylaşılan gönderilerde olur.\n\n" +
    "Herkese açık gönderiler sorunsuz indirilir — başka bir bağlantı deneyin.",
  errorUnsupportedPlatform:
    "Bu bağlantıyı tanıyamadım — YouTube, TikTok, Instagram, Facebook, Twitter/X, Vimeo, VK, Rutube, OK.ru, Pinterest veya Threads'ten doğrudan bir video bağlantısı olduğundan emin olun.",
  errorFileTooLarge: "dosya 2 GB'tan büyük — Telegram botların daha büyük dosya göndermesine izin vermiyor. Web sitesinden veya tarayıcı eklentisiyle indirin — düğmeler aşağıda. Ya da bağlantıyı tekrar gönderip daha düşük bir kalite seçin.",
  siteButton: "🌐 Web sitesinden indir",
  qualitiesHiddenBySize: (limit) =>
    `\n\n⚖️ ${limit} üzerindeki kaliteler gizlendi: Telegram botların daha büyük dosya göndermesine izin vermiyor. Bunları web sitesinden veya tarayıcı eklentisiyle indirebilirsiniz — düğmeler aşağıda.`,
  videoTooBigForTelegram: (smallest) =>
    `\n\n⚖️ Bu video en düşük kalitede bile (~${smallest}) Telegram için fazla büyük: Telegram botların 2 GB üzerindeki dosyaları göndermesine izin vermiyor. Burada yalnızca sesi alabilirsiniz; videoyu ise web sitesinden veya tarayıcı eklentisiyle (aşağıdaki düğmeler) indirebilirsiniz.`,
  errorFormatUnavailable: "Bu kalite bu video için mevcut değil. Bağlantıyı tekrar gönderin — güncel listeyi göstereyim.",
  errorNoVideoContent: "Bu bağlantıda indirilecek bir video yok — gönderi yalnızca fotoğraflardan oluşuyor gibi görünüyor.",
  errorRegionBlocked:
    "Bu video, sahibinin ülkesi dışında engellenmiş — platform onu sunucumuza " +
    "vermiyor. Bunun bir yolu yok: kısıtlama platformun tarafında." +
    "\n\nDiğer bağlantılar her zamanki gibi indirilir.",
  errorRateLimited: "Arka arkaya çok fazla bağlantı — biraz bekleyip tekrar gönderin.",
  errorYoutubeDailyLimit: (gb) => `son 24 saatte YouTube'dan ${gb} GB'tan fazla indirdiniz — bu, botun kişi başına günlük sınırı. Sınır son 24 saati sayar, bu yüzden yeni YouTube videolarını biraz sonra indirebilirsiniz. Diğer platformlar her zamanki gibi çalışıyor.`,
  playlistStoppedByLimit: (dropped) => `⏹ Oynatma listesi durduruldu: günlük YouTube sınırına ulaşıldı. İndirilmeyen videolar: ${dropped}. Oynatma listesi bağlantısını daha sonra tekrar gönderin.`,
  errorPlatformRefused:
    "platform bu videoyu sunucumuza vermedi. Bu, gizli " +
    "veya yaş sınırlı gönderilerde olur, bazen de platform erişimi bir süreliğine " +
    "kısıtlar. Birkaç dakika sonra tekrar deneyin.",
  errorThreadsNoMedia:
    "bu Threads gönderisinde video veya fotoğraf görünmüyor. Ya yalnızca metin içeren bir gönderi, ya da " +
    "Threads medyasını yalnızca oturum açmış kullanıcılara gösteriyor — bu tür gönderiler giriş yapmadan indirilemez.",
  extensionHint:
    "\n\n💻 Bilgisayarda Videoner tarayıcı eklentisiyle indirebilirsiniz: " +
    "eklenti, platformdaki kendi oturumunuzla indirir; hiçbir şifre veya çerez tarayıcınızdan çıkmaz.",
  privateConnectHint: (platform, withExtension) =>
    `\n\n🔑 Bu tür gönderileri indirmek için ${platform} hesabınızı bota bağlayın — bir kez. Bundan sonra bot sizin görebildiğiniz her şeyi indirir: gizli gönderiler, Reels videoları ve hikayeler, telefondan da. Nasıl yapılacağını aşağıdaki düğme gösteriyor.${withExtension ? "\n\n💻 Ya da bilgisayarda Videoner tarayıcı eklentisiyle indirin." : ""}`,
  privateReconnectHint: (platform, withExtension) =>
    `\n\n⚠️ Bağlı ${platform} hesabınız bu gönderiyi açamadı. Oturum çalışmayı durdurmuş olabilir — hesabı tekrar bağlayın. Ya da bu hesabın gönderiye erişimi yok.${withExtension ? "\n\n💻 Bilgisayarda Videoner tarayıcı eklentisiyle da indirebilirsiniz." : ""}`,
  connectAccountButton: "🔑 Hesap bağla",
  reconnectAccountButton: "🔑 Tekrar bağla",
  extensionButton: "🧩 Eklentiyle indir",
  extensionCommand:
    "🧩 Tarayıcınız için Videoner: İndir düğmesi doğrudan video sayfasında — YouTube, Instagram, TikTok, VK, hesabınızdaki gizli videolar ve GetCourse dersleri.\n\nBilgisayarda Chrome, Edge, Opera, Yandex Browser ve Firefox için.",
  extensionPageButton: "🧩 Eklentiyi yükle",
  addToGroupButton: "👥 Gruba ekle",
  newsButton: "📣 Proje haberleri",
  fileCaptionShort: (title, sourceUrl) =>
    withOptionalLines((title ? `🎬 ${title.slice(0, 200)}\n\n` : "") + sourceUrl, `📣 Proje haberleri: ${NEWS_CHANNEL}`, undefined),
  sentBy: (name) => `👤 ${name}`,
  groupSettings: (s, canDelete) =>
    "⚙️ Bu grup için bot ayarları\n\n" +
    `🗑 Bağlantı içeren mesajı sil: ${s.deleteLinks ? "evet" : "hayır"}\n` +
    "Video gönderildikten sonra yalnızca bağlantı içeren mesaj silinir — sohbette sadece video ve onu paylaşan kişinin adı kalır.\n" +
    (s.deleteLinks && !canDelete
      ? "⚠️ Şu anda mesaj silemiyorum: beni “Mesajları sil” yetkisine sahip bir yönetici yapın.\n"
      : "") +
    `\n✍️ Videonun altındaki açıklama: ${{ full: "tam", short: "başlık ve kaynak", none: "açıklama yok" }[s.caption] ?? s.caption}\n` +
    `\n🎞 Kalite: ${s.quality === "max" ? "Telegram'ın kabul ettiği en yüksek" : "standart (720p)"}\n` +
    `\n⏱ Uzun videolar: ${s.longVideos ? "her uzunlukta" : "yalnızca 15 dakikaya kadar"}\n` +
    `\n🔑 Hesabını kimler bağlayabilir (hikayeler ve gizli gönderiler için): ${s.cookiesBy === "all" ? "her üye" : "yalnızca yöneticiler"}\n` +
    `\n🌐 Yanıt dili: ${s.language ? langName(s.language) : "her üyenin kendi dili"}\n` +
    "\nAyarları yalnızca grup yöneticileri değiştirebilir.",
  settingsDeleteButton: (on) => `🗑 Bağlantıları sil: ${on ? "evet" : "hayır"}`,
  settingsCaptionButton: (style) => `✍️ Açıklama: ${{ full: "tam", short: "kısa", none: "yok" }[style] ?? style}`,
  settingsQualityButton: (mode) => `🎞 Kalite: ${mode === "max" ? "en yüksek" : "720p"}`,
  settingsLongButton: (on) => `⏱ Uzun videolar: ${on ? "evet" : "15 dk'ya kadar"}`,
  settingsDoneButton: "✅ Tamam",
  settingsAdminsOnly: "Ayarları yalnızca grup yöneticileri değiştirebilir.",
  settingsGroupsOnly: "Ayarlar gruplar içindir: beni bir gruba ekleyin ve orada /settings gönderin.",
  settingsFailed: "Ayarlar kaydedilemedi, lütfen tekrar deneyin.",
  settingsCookiesButton: (by) => `🔑 Hesap bağlama: ${by === "all" ? "herkes" : "yöneticiler"}`,
  accountsIntro:
    "🔑 Bağlı hesaplar\n\nBot, yalnızca oturum açmış kişilerin görebildiklerini (Instagram hikayeleri, gizli gönderiler) hesabınızla indirebilir. Bir oturum, bağlandığı yerde çalışır: özel sohbette bağlanan, sizin indirmelerinize hizmet eder — kendi hesabı olmayan gruplardaki kendi bağlantılarınız dahil; bir gruba bağlanan ise grubun tüm üyelerine hizmet eder.",
  accountsHowTo:
    "Nasıl bağlanır:\n1. En kolayı: bilgisayarda Videoner eklentisi — platformun sitesinde oturum açın, Videoner penceresini açın, «🔑 … hesabınızı bota bağlayın» düğmesine basın ve kodu bana gönderin. Bir grup için o grupta /connect KOD gönderin.\n2. Ya da bana bir cookies.txt dosyası gönderin (tarayıcıdan dışa aktarılan çerezler) veya metnini mesaj olarak yapıştırın.\n3. Android telefondan — Firefox ve Cookie-Editor eklentisiyle: https://videoner.download/tr/blog/android-firefox",
  accountsWarning:
    "⚠️ Platformlar otomatik indirmelerden hoşlanmaz ve hesabı kısıtlayabilir ya da engelleyebilir. Ana hesabınızı değil, ikincil bir hesabı bağlamanız daha iyi olur. Çerezler şifrelenmiş olarak saklanır, yalnızca indirmeler için kullanılır ve aşağıdaki düğmelerle silinir.",
  accountsNone: "Henüz bağlı bir hesap yok.",
  accountsGroupTitle: "🔑 Bu gruba bağlı hesaplar",
  accountsGroupHowTo:
    "Tüm grup için bir hesap bağlamak için: Videoner eklentisindeki «🔑 … hesabınızı bota bağlayın» düğmesiyle bir kod alın ve burada /connect KOD gönderin. Bir hesabı yalnızca özel sohbetinizde bağladıysanız, bot onu burada kendi bağlantılarınız için kullanır. Bağlantılarınız: @VideonerBot ile özel sohbette /accounts.",
  accountsLine: (platform, where, active) => `• ${platform} — ${where}${active ? "" : " (⚠️ oturum çalışmıyor)"}`,
  accountsGroupLine: (platform, owner, active) => `• ${platform} — ${owner}${active ? "" : " (⚠️ oturum çalışmıyor)"}`,
  accountsWhereHere: "özel sohbet",
  accountsWhereGroup: (title) => `“${title}” grubu`,
  accountsDeleteButton: (platform, where) => `🗑 ${platform} · ${where}`,
  accountsDeleteAllButton: "🗑 Tüm bağlantılarımı kaldır",
  accountsDeleted: "Kaldırıldı.",
  accountsDeletedAll: (n) => `Kaldırılan bağlantılar: ${n}.`,
  accountsNotAllowed: "Yalnızca bağlayan kişi veya bir grup yöneticisi kaldırabilir.",
  connectUsage:
    "/connect KOD gönderin. Kodu bilgisayardaki Videoner eklentisinin «🔑 … hesabınızı bota bağlayın» düğmesi verir. Bağlantılarınız: /accounts.",
  connectOnlyAdmins: "Bu gruba yalnızca yöneticiler hesap bağlayabilir (bkz. /settings).",
  connectDone: (platform, where) =>
    `✅ ${platform} ${where} bağlandı. Bot artık yalnızca oturum açmış kişilerin görebildiklerini de indiriyor. Görüntülemek veya kaldırmak için: /accounts.\n\n⚠️ Platform, otomatik indirmeler nedeniyle hesabı kısıtlayabilir — ikincil bir hesap kullanmanız daha iyi olur.`,
  connectWhereGroup: "bu gruba",
  connectWhereHere: "özel sohbetteki ve satır içi moddaki indirmeleriniz için",
  connectCodeNotFound: "Kod bulunamadı veya süresi doldu (kodlar 10 dakika geçerlidir). Videoner eklentisinden yeni bir kod alın.",
  connectRejectedNoSession: "Bu çerezlerde oturum bilgisi yok. Platformun sitesinde oturum açın ve çerezleri tekrar dışa aktarın.",
  connectRejectedUnknown: "Desteklenen platformların çerezleri bulunamadı: Instagram, Facebook, YouTube, X, VK, TikTok.",
  connectUnavailable: "Hesap bağlama henüz kullanılamıyor.",
  connectFailed: "Bağlanamadı, lütfen tekrar deneyin.",
  connectFileTooBig: "Dosya çok büyük — yalnızca gerekli sitenin çerezlerini dışa aktarın.",
  connectNotAnonymous: "Hesabı grup adına anonim olarak değil, kendiniz olarak bağlayın: aksi halde yöneticilerin bağlantıları birbirine karışır. Kodu iptal ettim — yeni bir kod alın.",
  connectCodeInGroup:
    "Grup sohbetine yazılan bir bağlantı kodunu başkaları görebilir — kodu iptal ettim ve mesajı sildim. Yeni bir kod alın ve /connect KOD ile gönderin: bu komutu içeren mesajı hemen silerim.",
  groupWelcome:
    "👋 Merhaba! Bu sohbete TikTok, Instagram, YouTube, VK ve diğer platformlardaki videoların bağlantılarını gönderin — videonun kendisiyle yanıt vereyim.\n\n" +
    "15 dakikaya kadar olan videoları komut gerekmeden kendiliğimden indiririm, onun dışında sessiz kalırım.\n\n⚙️ Grup yöneticileri beni /settings ile ayarlayabilir: bağlantı mesajlarını silme, açıklama stili, kalite, uzun videolar ve dil.\n\n⚡ Sesi almak için bağlantının ardından -audio, en iyi kalite için -hd ekleyin.\n\n📣 Proje haberleri: @videonerdownload",
  errorTooLong: "video çok uzun — bu kadar uzun videoları henüz indiremiyoruz.",
  errorUnknown: "bu video indirilemedi. Biraz sonra tekrar deneyin veya başka bir bağlantı gönderin.",
  inlineHintButton: "Bota bağlantı gönderin",
  inlineResultTitle: "⬇️ Videoyu indir",
  inlineResultDescription: "Video doğrudan bu sohbete gönderilecek",
  inlinePlaceholder: "⏬ İndiriliyor, bu birkaç dakika sürebilir...",
  inlineOpenBot: "Botu aç",
  inlineOnlySingleVideo:
    "Bu mod tek bir video gönderir. Birden fazla dosya içeren gönderiler veya fotoğraflar için bağlantıyı bota özel sohbetten gönderin.",
  inlineSubscribeRequired: (channel: string) =>
    `İndirmek için ${channel} kanalına abone olun ve tekrar deneyin.`,
  inlineRateLimited: "Arka arkaya çok fazla istek. Bir dakika bekleyip tekrar deneyin.",
  queueRest: (count) => `\n\n📋 Kuyrukta bekleyen bağlantılar: ${count}. Bundan sonra onları tek tek göstereceğim.`,
  queuedOne: (position) =>
    `📋 Bağlantı kuyruğa eklendi, #${position}. Önce mevcut olanı bitirelim — sonra bunun için kalite seçimini göstereceğim.`,
  queuedMany: (added, waiting) =>
    `📋 Kuyruğa eklenen bağlantılar: ${added}. Toplam bekleyen: ${waiting}. Mevcut olandan sonra onları tek tek göstereceğim.`,
  queueDuplicates: (count) =>
    count === 1
      ? "Bu bağlantı zaten kuyrukta — iki kez eklemiyorum."
      : `Kuyrukta zaten olan bağlantılar iki kez eklenmez (tekrarlar: ${count}).`,
  queueFull: (limit, rejected) =>
    `Kuyruk en fazla ${limit} bağlantı alır — fazlası eklenmedi (${rejected}). Kuyruk ilerleyince onları gönderin.`,
  skipButton: "✖️ İndirme",
  skipped: "⏭ Bu bağlantı atlandı.",
  chooseTimedOut: "⌛ 30 dakika içinde kalite seçilmedi — bu bağlantıyı atlıyorum.",
  queueLostOnRestart: (count) =>
    `⚠️ Bot bir güncelleme için yeniden başlatılıyor — kuyruk sıfırlandı (bağlantılar: ${count}). Lütfen bir dakika sonra onları tekrar gönderin.`,
  subtitlesButton: "📝 Altyazılar",
  subtitlesBack: "⬅️ Kaliteye dön",
  subtitlesAuto: "otomatik",
  subtitlesChoose: "Altyazı dilini seçin",
  subtitlesPreparing: "📝 Altyazılar hazırlanıyor...",
  subtitlesFailed: "Bu dilde altyazılar indirilemedi. Başka bir dil deneyin.",
  subtitlesBusy: "YouTube şu anda altyazı vermiyor — birkaç dakika sonra tekrar deneyin.",
  playlistFound: (title, count) =>
    `📃 Oynatma listesi${title ? ` “${title.slice(0, 150)}”` : ""}: ${count} video.\nOnları tek tek indireceğim. Hangi biçimde?`,
  playlistStdButton: "🎬 720p",
  playlistHdButton: "🎬 En iyi kalite",
  playlistAudioButton: "🎵 Yalnızca ses (mp3)",
  playlistNoButton: "✖️ Hayır, teşekkürler",
  playlistQueued: (count) =>
    `📃 Oynatma listesinden kuyruğa eklenen videolar: ${count}. Onları tek tek göndereceğim. Aşağıdaki düğmeyle veya /stop ile durdurabilirsiniz.`,
  playlistFailed: "Oynatma listesi açılamadı — gizli olabilir. Tek bir videonun bağlantısını gönderin.",
  stopButton: "⏹ Durdur",
  stopped: (dropped) => `⏹ Durduruldu.${dropped ? ` Kuyruktan kaldırılan bağlantılar: ${dropped}.` : ""}`,
  nothingToStop: "Şu anda hiçbir şey indirilmiyor.",
  languageChoose: "🌐 Botun dilini seçin. “Otomatik”, Telegram dilinizi izler.",
  languageChooseGroup: "🌐 Botun bu gruptaki yanıt dili. “Otomatik” — her üyenin Telegram dili.",
  languageAuto: "Otomatik — Telegram'daki gibi",
  languageAutoGroup: "Otomatik — her üyenin kendi dili",
  languageSaved: (name) => `✅ Bot dili: ${name}. /language ile değiştirebilirsiniz.`,
  languageSavedAuto: "✅ Bot, Telegram dilinizi izliyor. /language ile değiştirebilirsiniz.",
  settingsLanguageButton: (name) => `🌐 Dil: ${name ?? "otomatik"}`,
  settingsBack: "⬅️ Ayarlara dön",
};

const fa: Messages = {
  start: "سلام! لینک یک ویدیو از YouTube، TikTok، Instagram، Facebook، Twitter/X، Vimeo، VK، Rutube، OK.ru، Pinterest یا Threads را برایم بفرستید — در دانلودش کمکتان می‌کنم.\n\n✨ بدون محدودیت کیفیت: هر کیفیتی که پلتفرم ارائه می‌دهد، تا 4K، به شما می‌رسد — به شرطی که حجم فایل از 2 GB بیشتر نشود؛ این سقف Telegram برای ربات‌هاست. اینجا هیچ قابلیت پولی وجود ندارد.\n\nکاملاً رایگان: بدون اشتراک، بدون تبلیغات، بدون خرید درون‌برنامه‌ای.\n\n🧩 با کامپیوتر دانلود می‌کنید؟ افزونهٔ مرورگر را نصب کنید — دکمهٔ دانلود مستقیم در صفحهٔ ویدیو ظاهر می‌شود: videoner.download/fa/extension\n\n👥 مرا به یک گروه اضافه کنید تا ویدیوی لینک‌هایی را که اعضا آنجا می‌فرستند ارسال کنم.\n\n⚡ از انتخاب کیفیت بگذرید: بعد از لینک -audio بنویسید تا فقط صدا (mp3) بگیرید، یا -hd برای بهترین کیفیت.\n\n📣 اخبار پروژه: ‎@videonerdownload\n\n🌐 زبان ربات: ‎/language",
  notLink: "این شبیه لینک نیست. لینک یک ویدیو را برایم بفرستید.",
  inviteGreeting: "سلام! من Videoner هستم — ویدیوها را از YouTube، TikTok، Instagram و پلتفرم‌های دیگر رایگان دانلود می‌کنم. ویدیویی را که کسی با شما به اشتراک گذاشته آماده می‌کنم 👇",
  inviteNotFound: "برای این لینک دعوت ویدیویی پیدا نکردم. لینک یک ویدیو را بفرستید تا دانلودش کنم.",
  inviteUnavailable: "نتوانستم ویدیوی این لینک را باز کنم — سرویس الان پاسخ نمی‌دهد. یک دقیقهٔ دیگر همین لینک را دوباره باز کنید.",
  fetchingInfo: "🔍 در حال دریافت اطلاعات ویدیو...",
  audioOnlyButton: "🎵 فقط صدا (mp3)",
  photoButton: "📷 دانلود عکس‌ها",
  slideshowButton: "🎞 اسلایدشو (ویدیو)",
  galleryButton: "📷+🎞 عکس‌ها و اسلایدشو",
  chooseQuality: (title, duration) => `«${title}»${duration ? `\n⏱ ${duration}` : ""}\n\nکیفیت را انتخاب کنید:`,
  sessionExpired: "نشست منقضی شد — لینک را دوباره بفرستید",
  downloading: "⏬ در حال دانلود، ممکن است چند دقیقه طول بکشد...",
  downloadFailed: "دانلود ناموفق بود",
  downloadProgress: (percent, eta, done) =>
    `⏬ در حال دانلود: ${percent}%${eta ? ` · ${eta} مانده` : ""}${done ? `\n${done}` : ""}`,
  downloadFinishing: "⚙️ تقریباً تمام است — در حال سرهم‌کردن فایل...",
  converting: (percent) => `⚙️ در حال تبدیل: ${percent}%`,
  etaUnderMinute: "کمتر از یک دقیقه",
  etaMinutes: (minutes) => `~${minutes} دقیقه`,
  etaHours: (hours, minutes) => `~${hours} ساعت${minutes ? ` ${minutes} دقیقه` : ""}`,
  downloadTimeout: "دانلود بیش از حد طول می‌کشد — به نظر می‌رسد ویدیو خیلی حجیم است. کیفیت پایین‌تری را امتحان کنید.",
  downloadInterrupted: "⚠️ ربات برای به‌روزرسانی در حال راه‌اندازی مجدد است — دانلود شما قطع شد. لطفاً یک دقیقهٔ دیگر لینک را دوباره بفرستید.",
  fileTooBig: (mb, url) =>
    `حجم فایل زیاد شد (${mb} MB) — Telegram اجازه نمی‌دهد ربات آن را بفرستد.\nاز اینجا دانلودش کنید: ${url}`,
  sendingFile: "📤 در حال ارسال فایل...",
  sendingAlbum: (count) => `📤 این پست چند فایل دارد (${count}) — آن‌ها را به‌صورت آلبوم می‌فرستم...`,
  failedPrefix: "❌ ناموفق: ",
  fileCaption: (title, sourceUrl, shareUrl, description) =>
    composeCaption(
      title,
      description,
      `منبع: ${sourceUrl}\n` +
        "تمام حقوق ویدیو متعلق به سازندهٔ آن است.\n" +
        "رایگان دانلود شده با ‎@VideonerBot",
      `📣 اخبار پروژه: ${NEWS_CHANNEL}`,
      shareUrl && `🔗 اشتراک‌گذاری: ${shareUrl}`,
    ),
  subscribeRequired: (channel) =>
    `برای دانلود، لطفاً در کانال ما ${channel} عضو شوید — این تنها شرط است و سرویس رایگان می‌ماند.\n\n` +
    "عضو شوید و «عضو شدم» را بزنید.",
  openChannelButton: "📣 باز کردن کانال",
  checkSubscriptionButton: "عضو شدم",
  subscribeThanks: "متشکرم! حالا لینک یک ویدیو را برایم بفرستید.",
  subscribeThanksResuming: "متشکرم! همین حالا سراغ لینک شما می‌روم.",
  subscribeStillMissing: "هنوز عضویت شما را نمی‌بینم. عضو شوید و دوباره دکمه را بزنید.",
  channelNotice: (channel) => `\n\nلینک این پست در ${channel} منتشر می‌شود — به‌صورت ناشناس، بدون نام شما.`,
  channelPost: (title, url) =>
    (title ? `🎬 ${title.slice(0, 200)}\n\n` : "") +
    `${url}\n\n` +
    "این ویدیو و هر ویدیوی دیگری را رایگان دانلود کنید: ‎@VideonerBot",
  errorStoryNeedsId:
    "لینک یک استوری مشخص را بفرستید: آن را در اپلیکیشن Instagram باز کنید و «اشتراک‌گذاری ← کپی لینک» را بزنید.",
  errorInstagramStory:
    "استوری‌های Instagram فقط برای کسانی که وارد حساب خود شده‌اند قابل مشاهده است.",
  errorLoginRequired:
    "این پست بدون ورود به حساب در دسترس نیست: پلتفرم آن را فقط به " +
    "کاربرانی که وارد شده‌اند نشان می‌دهد. این اتفاق برای پست‌های خصوصی، محتوای دارای محدودیت سنی " +
    "و پست‌هایی که برای مخاطبان محدود منتشر شده‌اند پیش می‌آید.\n\n" +
    "پست‌های عمومی بدون مشکل دانلود می‌شوند — لینک دیگری را امتحان کنید.",
  errorUnsupportedPlatform:
    "این لینک را نشناختم — مطمئن شوید که لینک مستقیم ویدیو از YouTube، TikTok، Instagram، Facebook، Twitter/X، Vimeo، VK، Rutube، OK.ru، Pinterest یا Threads است.",
  errorFileTooLarge: "حجم فایل بیش از 2 GB است — Telegram اجازه نمی‌دهد ربات‌ها فایل بزرگ‌تری بفرستند. آن را از وب‌سایت یا با افزونهٔ مرورگر دانلود کنید — دکمه‌ها پایین هستند. یا لینک را دوباره بفرستید و کیفیت پایین‌تری انتخاب کنید.",
  siteButton: "🌐 دانلود از وب‌سایت",
  qualitiesHiddenBySize: (limit) =>
    `\n\n⚖️ کیفیت‌های حجیم‌تر از ${limit} پنهان شده‌اند: Telegram اجازه نمی‌دهد ربات‌ها فایل بزرگ‌تری بفرستند. می‌توانید آن‌ها را از وب‌سایت یا با افزونهٔ مرورگر دانلود کنید — دکمه‌ها پایین هستند.`,
  videoTooBigForTelegram: (smallest) =>
    `\n\n⚖️ این ویدیو حتی با پایین‌ترین کیفیت (~${smallest}) برای Telegram خیلی حجیم است: Telegram اجازه نمی‌دهد ربات‌ها فایل بزرگ‌تر از 2 GB بفرستند. اینجا فقط می‌توانید صدا را بگیرید؛ ویدیو را از وب‌سایت یا با افزونهٔ مرورگر دانلود کنید (دکمه‌ها پایین هستند).`,
  errorFormatUnavailable: "این کیفیت برای این ویدیو موجود نیست. لینک را دوباره بفرستید — فهرست به‌روز را نشانتان می‌دهم.",
  errorNoVideoContent: "این لینک ویدیویی برای دانلود ندارد — به نظر می‌رسد پست فقط عکس دارد.",
  errorRegionBlocked:
    "این ویدیو خارج از کشور سازنده‌اش مسدود است — پلتفرم آن را " +
    "به سرور ما نمی‌دهد. راهی برای دور زدنش نیست: محدودیت از سمت خود پلتفرم است." +
    "\n\nلینک‌های دیگر مثل همیشه دانلود می‌شوند.",
  errorRateLimited: "لینک‌های زیادی پشت سر هم فرستادید — کمی صبر کنید و دوباره بفرستید.",
  errorYoutubeDailyLimit: (gb) => `شما در 24 ساعت گذشته بیش از ${gb} GB از YouTube دانلود کرده‌اید — این سقف روزانهٔ ربات برای هر نفر است. حساب بر اساس 24 ساعت اخیر است، پس کمی بعد می‌توانید ویدیوهای جدید YouTube را دانلود کنید. پلتفرم‌های دیگر مثل همیشه کار می‌کنند.`,
  playlistStoppedByLimit: (dropped) => `⏹ پلی‌لیست متوقف شد: به سقف روزانهٔ YouTube رسیدید. ویدیوهای دانلودنشده: ${dropped}. بعداً لینک پلی‌لیست را دوباره بفرستید.`,
  errorPlatformRefused:
    "پلتفرم این ویدیو را به سرور ما نداد. این اتفاق برای پست‌های خصوصی " +
    "یا دارای محدودیت سنی می‌افتد، و گاهی هم پلتفرم دسترسی را " +
    "موقتاً محدود می‌کند. چند دقیقهٔ دیگر دوباره امتحان کنید.",
  errorThreadsNoMedia:
    "در این پست Threads هیچ ویدیو یا عکسی دیده نمی‌شود. یا پست فقط متنی است، یا " +
    "Threads رسانه‌هایش را فقط به کاربرانی که وارد شده‌اند نشان می‌دهد — چنین پست‌هایی بدون ورود به حساب دانلود نمی‌شوند.",
  extensionHint:
    "\n\n💻 می‌توانید آن را با افزونهٔ مرورگر Videoner روی کامپیوتر دانلود کنید: " +
    "افزونه با ورود خود شما به پلتفرم دانلود می‌کند و هیچ رمز عبور یا کوکی‌ای از مرورگرتان خارج نمی‌شود.",
  privateConnectHint: (platform, withExtension) =>
    `\n\n🔑 برای دانلود چنین پست‌هایی، حساب ${platform} خود را به ربات متصل کنید — فقط یک بار. بعد از آن ربات هر چیزی را که شما می‌بینید دانلود می‌کند: پست‌های خصوصی، ریلز و استوری‌ها، از گوشی هم. دکمهٔ زیر روشش را نشان می‌دهد.${withExtension ? "\n\n💻 یا آن را با افزونهٔ مرورگر Videoner روی کامپیوتر دانلود کنید." : ""}`,
  privateReconnectHint: (platform, withExtension) =>
    `\n\n⚠️ حساب ${platform} متصل‌شدهٔ شما نتوانست این پست را باز کند. شاید ورود به حساب دیگر کار نمی‌کند — حساب را دوباره متصل کنید. یا این حساب به پست دسترسی ندارد.${withExtension ? "\n\n💻 همچنین می‌توانید آن را با افزونهٔ مرورگر Videoner روی کامپیوتر دانلود کنید." : ""}`,
  connectAccountButton: "🔑 اتصال حساب",
  reconnectAccountButton: "🔑 اتصال دوباره",
  extensionButton: "🧩 دانلود با افزونه",
  extensionCommand:
    "🧩 Videoner برای مرورگر شما: دکمهٔ دانلود مستقیم در صفحهٔ ویدیو — YouTube، Instagram، TikTok، VK، ویدیوهای خصوصی از حساب شما و درس‌های GetCourse.\n\nبرای Chrome، Edge، Opera، Yandex Browser و Firefox روی کامپیوتر.",
  extensionPageButton: "🧩 نصب افزونه",
  addToGroupButton: "👥 افزودن به گروه",
  newsButton: "📣 اخبار پروژه",
  fileCaptionShort: (title, sourceUrl) =>
    withOptionalLines((title ? `🎬 ${title.slice(0, 200)}\n\n` : "") + sourceUrl, `📣 اخبار پروژه: ${NEWS_CHANNEL}`, undefined),
  sentBy: (name) => `👤 ${name}`,
  groupSettings: (s, canDelete) =>
    "⚙️ تنظیمات ربات برای این گروه\n\n" +
    `🗑 حذف پیام حاوی لینک: ${s.deleteLinks ? "بله" : "خیر"}\n` +
    "پس از ارسال ویدیو، پیامی که فقط لینک داشت حذف می‌شود — در گفتگو فقط ویدیو با نام فرستنده‌اش می‌ماند.\n" +
    (s.deleteLinks && !canDelete
      ? "⚠️ الان نمی‌توانم پیام‌ها را حذف کنم: مرا با دسترسی «حذف پیام‌ها» ادمین کنید.\n"
      : "") +
    `\n✍️ کپشن زیر ویدیو: ${{ full: "کامل", short: "عنوان و منبع", none: "بدون کپشن" }[s.caption] ?? s.caption}\n` +
    `\n🎞 کیفیت: ${s.quality === "max" ? "بالاترین کیفیتی که Telegram می‌پذیرد" : "استاندارد (720p)"}\n` +
    `\n⏱ ویدیوهای طولانی: ${s.longVideos ? "با هر طولی" : "فقط تا 15 دقیقه"}\n` +
    `\n🔑 چه کسی می‌تواند حساب‌هایش را متصل کند (برای استوری‌ها و پست‌های خصوصی): ${s.cookiesBy === "all" ? "هر عضوی" : "فقط ادمین‌ها"}\n` +
    `\n🌐 زبان پاسخ‌ها: ${s.language ? langName(s.language) : "زبان خود هر عضو"}\n` +
    "\nفقط ادمین‌های گروه می‌توانند تنظیمات را تغییر دهند.",
  settingsDeleteButton: (on) => `🗑 حذف لینک‌ها: ${on ? "بله" : "خیر"}`,
  settingsCaptionButton: (style) => `✍️ کپشن: ${{ full: "کامل", short: "کوتاه", none: "بدون کپشن" }[style] ?? style}`,
  settingsQualityButton: (mode) => `🎞 کیفیت: ${mode === "max" ? "بالاترین" : "720p"}`,
  settingsLongButton: (on) => `⏱ ویدیوهای طولانی: ${on ? "بله" : "تا 15 دقیقه"}`,
  settingsDoneButton: "✅ تمام",
  settingsAdminsOnly: "فقط ادمین‌های گروه می‌توانند تنظیمات را تغییر دهند.",
  settingsGroupsOnly: "تنظیمات مخصوص گروه‌هاست: مرا به یک گروه اضافه کنید و آنجا ‎/settings را بفرستید.",
  settingsFailed: "ذخیرهٔ تنظیمات ممکن نشد، لطفاً دوباره امتحان کنید.",
  settingsCookiesButton: (by) => `🔑 اتصال حساب‌ها: ${by === "all" ? "همه" : "ادمین‌ها"}`,
  accountsIntro:
    "🔑 حساب‌های متصل\n\nربات می‌تواند چیزهایی را که فقط کاربران واردشده می‌بینند (استوری‌های Instagram، پست‌های خصوصی) با حساب شما دانلود کند. هر ورود همان جایی کار می‌کند که متصلش کرده‌اید: حسابی که در گفتگوی خصوصی متصل شده برای دانلودهای خود شماست، از جمله لینک‌های خودتان در گروه‌هایی که حساب جداگانه ندارند؛ حسابی که به یک گروه متصل شده برای همهٔ اعضای آن گروه کار می‌کند.",
  accountsHowTo:
    "روش اتصال:\n1. ساده‌ترین راه: افزونهٔ Videoner روی کامپیوتر — در سایت پلتفرم وارد حساب شوید، پنجرهٔ Videoner را باز کنید، دکمهٔ «🔑 اتصال حساب … شما به ربات» را بزنید و کد را برایم بفرستید. برای یک گروه، در همان گروه ‎/connect CODE را بفرستید.\n2. یا یک فایل cookies.txt (کوکی‌های خروجی‌گرفته از مرورگر) برایم بفرستید، یا متن آن را در یک پیام بچسبانید.\n3. از گوشی Android — با Firefox و افزونهٔ Cookie-Editor: https://videoner.download/fa/blog/android-firefox",
  accountsWarning:
    "⚠️ پلتفرم‌ها دانلود خودکار را دوست ندارند و ممکن است حساب را محدود یا مسدود کنند. بهتر است یک حساب فرعی متصل کنید، نه حساب اصلی‌تان را. کوکی‌ها رمزگذاری‌شده ذخیره می‌شوند، فقط برای دانلود به کار می‌روند و با دکمه‌های زیر حذف می‌شوند.",
  accountsNone: "هنوز چیزی متصل نشده است.",
  accountsGroupTitle: "🔑 حساب‌های متصل به این گروه",
  accountsGroupHowTo:
    "برای اتصال یک حساب برای کل گروه: با دکمهٔ «🔑 اتصال حساب … شما به ربات» در افزونهٔ Videoner کد بگیرید و اینجا ‎/connect CODE را بفرستید. اگر حسابی را فقط در گفتگوی خصوصی خود متصل کرده‌اید، ربات اینجا از آن برای لینک‌های خودتان استفاده می‌کند. اتصال‌های شما: ‎/accounts در گفتگوی خصوصی با ‎@VideonerBot.",
  accountsLine: (platform, where, active) => `• ${platform} — ${where}${active ? "" : " (⚠️ ورود کار نمی‌کند)"}`,
  accountsGroupLine: (platform, owner, active) => `• ${platform} — ${owner}${active ? "" : " (⚠️ ورود کار نمی‌کند)"}`,
  accountsWhereHere: "گفتگوی خصوصی",
  accountsWhereGroup: (title) => `گروه «${title}»`,
  accountsDeleteButton: (platform, where) => `🗑 ${platform} · ${where}`,
  accountsDeleteAllButton: "🗑 حذف همهٔ اتصال‌های من",
  accountsDeleted: "حذف شد.",
  accountsDeletedAll: (n) => `اتصال‌های حذف‌شده: ${n}.`,
  accountsNotAllowed: "فقط کسی که حساب را متصل کرده یا ادمین گروه می‌تواند آن را حذف کند.",
  connectUsage:
    "‎/connect CODE را بفرستید. کد را دکمهٔ «🔑 اتصال حساب … شما به ربات» در افزونهٔ Videoner روی کامپیوتر به شما می‌دهد. اتصال‌های شما: ‎/accounts.",
  connectOnlyAdmins: "فقط ادمین‌ها می‌توانند حساب به این گروه متصل کنند (‎/settings را ببینید).",
  connectDone: (platform, where) =>
    `✅ ${platform} ${where} متصل شد. حالا ربات چیزهایی را هم که فقط کاربران واردشده می‌بینند دانلود می‌کند. مشاهده یا حذف: ‎/accounts.\n\n⚠️ ممکن است پلتفرم حساب را به خاطر دانلود خودکار محدود کند — بهتر است از یک حساب فرعی استفاده کنید.`,
  connectWhereGroup: "به این گروه",
  connectWhereHere: "برای دانلودهای شما در گفتگوی خصوصی و حالت inline",
  connectCodeNotFound: "کد پیدا نشد یا منقضی شده است (کدها 10 دقیقه اعتبار دارند). یک کد جدید از افزونهٔ Videoner بگیرید.",
  connectRejectedNoSession: "این کوکی‌ها ورود به حساب ندارند. در سایت پلتفرم وارد حساب شوید و دوباره کوکی‌ها را خروجی بگیرید.",
  connectRejectedUnknown: "هیچ کوکی‌ای از پلتفرم‌های پشتیبانی‌شده پیدا نشد: Instagram، Facebook، YouTube، X، VK، TikTok.",
  connectUnavailable: "اتصال حساب‌ها هنوز در دسترس نیست.",
  connectFailed: "اتصال ممکن نشد، لطفاً دوباره امتحان کنید.",
  connectFileTooBig: "فایل خیلی بزرگ است — فقط کوکی‌های سایت موردنظر را خروجی بگیرید.",
  connectNotAnonymous: "حساب را با نام خودتان متصل کنید، نه به‌صورت ناشناس از طرف گروه: وگرنه اتصال‌های ادمین‌ها با هم قاطی می‌شوند. کد را باطل کردم — یک کد جدید بگیرید.",
  connectCodeInGroup:
    "کد اتصالی که در گفتگوی گروه منتشر شود را دیگران هم می‌بینند — آن را باطل کردم و پیام را حذف کردم. یک کد جدید بگیرید و با ‎/connect CODE بفرستید: پیام این دستور را بلافاصله حذف می‌کنم.",
  groupWelcome:
    "👋 سلام! لینک ویدیوها از TikTok، Instagram، YouTube، VK و پلتفرم‌های دیگر را در این گفتگو بفرستید — با خود ویدیو جواب می‌دهم.\n\n" +
    "ویدیوهای تا 15 دقیقه را خودم، بدون هیچ دستوری، دانلود می‌کنم و بقیهٔ وقت ساکتم.\n\n⚙️ ادمین‌های گروه می‌توانند مرا با ‎/settings تنظیم کنند: حذف پیام‌های لینک، سبک کپشن، کیفیت، ویدیوهای طولانی و زبان.\n\n⚡ بعد از لینک -audio بنویسید تا صدا را بگیرید، یا -hd برای بهترین کیفیت.\n\n📣 اخبار پروژه: ‎@videonerdownload",
  errorTooLong: "ویدیو خیلی طولانی است — فعلاً نمی‌توانیم ویدیوهایی با این طول را دانلود کنیم.",
  errorUnknown: "دانلود این ویدیو ممکن نشد. کمی بعد دوباره امتحان کنید یا لینک دیگری بفرستید.",
  inlineHintButton: "فرستادن لینک به ربات",
  inlineResultTitle: "⬇️ دانلود ویدیو",
  inlineResultDescription: "ویدیو مستقیم در همین گفتگو ارسال می‌شود",
  inlinePlaceholder: "⏬ در حال دانلود، ممکن است چند دقیقه طول بکشد...",
  inlineOpenBot: "باز کردن ربات",
  inlineOnlySingleVideo:
    "این حالت فقط یک ویدیو می‌فرستد. برای پست‌های چندفایلی یا عکس‌ها، لینک را در گفتگوی خصوصی برای ربات بفرستید.",
  inlineSubscribeRequired: (channel: string) =>
    `برای دانلود، در ${channel} عضو شوید و دوباره امتحان کنید.`,
  inlineRateLimited: "درخواست‌های زیادی پشت سر هم. یک دقیقه صبر کنید و دوباره امتحان کنید.",
  queueRest: (count) => `\n\n📋 لینک‌های باقی‌مانده در صف: ${count}. بعد از این یکی، آن‌ها را یکی‌یکی نشان می‌دهم.`,
  queuedOne: (position) =>
    `📋 لینک به صف اضافه شد، شمارهٔ ${position}. اول کار فعلی را تمام کنیم — بعد انتخاب کیفیت را برای آن نشان می‌دهم.`,
  queuedMany: (added, waiting) =>
    `📋 لینک‌های اضافه‌شده به صف: ${added}. کل لینک‌های در انتظار: ${waiting}. بعد از کار فعلی، آن‌ها را یکی‌یکی نشان می‌دهم.`,
  queueDuplicates: (count) =>
    count === 1
      ? "این لینک از قبل در صف است — دوباره اضافه‌اش نمی‌کنم."
      : `لینک‌هایی که از قبل در صف هستند دوباره اضافه نمی‌شوند (تکراری‌ها: ${count}).`,
  queueFull: (limit, rejected) =>
    `صف حداکثر ${limit} لینک جا دارد — لینک‌های اضافی افزوده نشدند (${rejected}). وقتی صف جلو رفت آن‌ها را بفرستید.`,
  skipButton: "✖️ دانلود نشود",
  skipped: "⏭ از این لینک گذشتم.",
  chooseTimedOut: "⌛ در 30 دقیقه کیفیتی انتخاب نشد — از این لینک می‌گذرم.",
  queueLostOnRestart: (count) =>
    `⚠️ ربات برای به‌روزرسانی در حال راه‌اندازی مجدد است — صف خالی شد (لینک‌ها: ${count}). لطفاً یک دقیقهٔ دیگر آن‌ها را دوباره بفرستید.`,
  subtitlesButton: "📝 زیرنویس",
  subtitlesBack: "⬅️ بازگشت به کیفیت",
  subtitlesAuto: "خودکار",
  subtitlesChoose: "زبان زیرنویس را انتخاب کنید",
  subtitlesPreparing: "📝 در حال آماده‌سازی زیرنویس...",
  subtitlesFailed: "دانلود زیرنویس به این زبان ممکن نشد. زبان دیگری را امتحان کنید.",
  subtitlesBusy: "YouTube الان زیرنویس نمی‌دهد — چند دقیقهٔ دیگر دوباره امتحان کنید.",
  playlistFound: (title, count) =>
    `📃 پلی‌لیست${title ? ` «${title.slice(0, 150)}»` : ""}: ${count} ویدیو.\nآن‌ها را یکی‌یکی دانلود می‌کنم. با چه فرمتی؟`,
  playlistStdButton: "🎬 720p",
  playlistHdButton: "🎬 بهترین کیفیت",
  playlistAudioButton: "🎵 فقط صدا (mp3)",
  playlistNoButton: "✖️ نه، ممنون",
  playlistQueued: (count) =>
    `📃 ویدیوهای پلی‌لیست که به صف اضافه شدند: ${count}. آن‌ها را یکی‌یکی می‌فرستم. برای توقف، دکمهٔ زیر یا ‎/stop.`,
  playlistFailed: "باز کردن پلی‌لیست ممکن نشد — شاید خصوصی باشد. لینک یک ویدیوی تکی را بفرستید.",
  stopButton: "⏹ توقف",
  stopped: (dropped) => `⏹ متوقف شد.${dropped ? ` لینک‌های حذف‌شده از صف: ${dropped}.` : ""}`,
  nothingToStop: "الان چیزی در حال دانلود نیست.",
  languageChoose: "🌐 زبان ربات را انتخاب کنید. «خودکار» از زبان Telegram شما پیروی می‌کند.",
  languageChooseGroup: "🌐 زبان پاسخ‌های ربات در این گروه. «خودکار» — زبان Telegram هر عضو.",
  languageAuto: "خودکار — مثل Telegram",
  languageAutoGroup: "خودکار — زبان خود هر عضو",
  languageSaved: (name) => `✅ زبان ربات: ${name}. با ‎/language می‌توانید تغییرش دهید.`,
  languageSavedAuto: "✅ ربات از زبان Telegram شما پیروی می‌کند. با ‎/language می‌توانید تغییرش دهید.",
  settingsLanguageButton: (name) => `🌐 زبان: ${name ?? "خودکار"}`,
  settingsBack: "⬅️ بازگشت به تنظیمات",
};

const vi: Messages = {
  start: "Chào bạn! Gửi cho mình link video từ YouTube, TikTok, Instagram, Facebook, Twitter/X, Vimeo, VK, Rutube, OK.ru, Pinterest hoặc Threads — mình sẽ giúp bạn tải về.\n\n✨ Không giới hạn chất lượng: nền tảng có gì bạn nhận nấy, lên đến 4K — miễn là file không vượt quá 2 GB, giới hạn của Telegram dành cho bot. Ở đây không có tính năng trả phí nào.\n\nHoàn toàn miễn phí: không gói đăng ký, không quảng cáo, không mua hàng trong ứng dụng.\n\n🧩 Bạn tải trên máy tính? Hãy cài tiện ích trình duyệt — nút Tải xuống sẽ xuất hiện ngay trên trang video: videoner.download/vi/extension\n\n👥 Thêm mình vào nhóm, mình sẽ gửi video theo các link mọi người chia sẻ ở đó.\n\n⚡ Bỏ qua bước chọn chất lượng: thêm -audio sau link để chỉ lấy âm thanh (mp3), hoặc -hd để có chất lượng tốt nhất.\n\n📣 Tin tức dự án: @videonerdownload\n\n🌐 Ngôn ngữ của bot: /language",
  notLink: "Đây có vẻ không phải là link. Hãy gửi cho mình link video.",
  inviteGreeting: "Chào bạn! Mình là Videoner — mình tải video từ YouTube, TikTok, Instagram và các nền tảng khác miễn phí. Đang chuẩn bị video mà người ta đã chia sẻ với bạn 👇",
  inviteNotFound: "Mình không tìm thấy video cho link mời này. Hãy gửi cho mình link video, mình sẽ tải về.",
  inviteUnavailable: "Mình không mở được video từ link này — dịch vụ hiện chưa phản hồi. Hãy mở lại chính link đó sau một phút.",
  fetchingInfo: "🔍 Đang lấy thông tin video...",
  audioOnlyButton: "🎵 Chỉ âm thanh (mp3)",
  photoButton: "📷 Tải ảnh",
  slideshowButton: "🎞 Trình chiếu (video)",
  galleryButton: "📷+🎞 Ảnh và trình chiếu",
  chooseQuality: (title, duration) => `“${title}”${duration ? `\n⏱ ${duration}` : ""}\n\nChọn chất lượng:`,
  sessionExpired: "Phiên đã hết hạn — hãy gửi lại link",
  downloading: "⏬ Đang tải, có thể mất vài phút...",
  downloadFailed: "tải về không thành công",
  downloadProgress: (percent, eta, done) =>
    `⏬ Đang tải: ${percent}%${eta ? ` · còn ${eta}` : ""}${done ? `\n${done}` : ""}`,
  downloadFinishing: "⚙️ Sắp xong — đang ghép file...",
  converting: (percent) => `⚙️ Đang chuyển đổi: ${percent}%`,
  etaUnderMinute: "chưa đến một phút",
  etaMinutes: (minutes) => `~${minutes} phút`,
  etaHours: (hours, minutes) => `~${hours} giờ${minutes ? ` ${minutes} phút` : ""}`,
  downloadTimeout: "việc tải mất quá nhiều thời gian — video có vẻ rất nặng. Hãy thử chất lượng thấp hơn.",
  downloadInterrupted: "⚠️ Bot đang khởi động lại để cập nhật — lượt tải của bạn đã bị gián đoạn. Hãy gửi lại link sau một phút nhé.",
  fileTooBig: (mb, url) =>
    `File khá lớn (${mb} MB) — Telegram không cho bot gửi file này.\nBạn có thể tải tại đây: ${url}`,
  sendingFile: "📤 Đang gửi file...",
  sendingAlbum: (count) => `📤 Bài đăng này có nhiều file (${count}) — đang gửi dưới dạng album...`,
  failedPrefix: "❌ Không thành công: ",
  fileCaption: (title, sourceUrl, shareUrl, description) =>
    composeCaption(
      title,
      description,
      `Nguồn: ${sourceUrl}\n` +
        "Mọi quyền đối với video thuộc về tác giả.\n" +
        "Tải miễn phí bằng @VideonerBot",
      `📣 Tin tức dự án: ${NEWS_CHANNEL}`,
      shareUrl && `🔗 Chia sẻ: ${shareUrl}`,
    ),
  subscribeRequired: (channel) =>
    `Để tải về, bạn hãy đăng ký kênh ${channel} của chúng mình — đó là điều kiện duy nhất, dịch vụ vẫn miễn phí.\n\n` +
    "Đăng ký rồi bấm “Mình đã đăng ký”.",
  openChannelButton: "📣 Mở kênh",
  checkSubscriptionButton: "Mình đã đăng ký",
  subscribeThanks: "Cảm ơn bạn! Giờ hãy gửi cho mình link video.",
  subscribeThanksResuming: "Cảm ơn bạn! Mình đang xử lý link của bạn.",
  subscribeStillMissing: "Mình chưa thấy bạn đăng ký. Hãy đăng ký rồi bấm lại.",
  channelNotice: (channel) => `\n\nLink tới bài đăng này sẽ xuất hiện trên ${channel} — ẩn danh, không kèm tên bạn.`,
  channelPost: (title, url) =>
    (title ? `🎬 ${title.slice(0, 200)}\n\n` : "") +
    `${url}\n\n` +
    "Tải video này và mọi video khác miễn phí: @VideonerBot",
  errorStoryNeedsId:
    "hãy gửi link tới một story cụ thể: mở story trong ứng dụng Instagram và bấm Chia sẻ → Sao chép liên kết.",
  errorInstagramStory:
    "Story trên Instagram chỉ hiển thị với người đã đăng nhập.",
  errorLoginRequired:
    "Bài đăng này không xem được nếu chưa đăng nhập: nền tảng chỉ hiển thị nó cho " +
    "người dùng đã đăng nhập. Điều này xảy ra với bài đăng riêng tư, nội dung giới hạn độ tuổi và " +
    "bài đăng chỉ chia sẻ với một nhóm người nhất định.\n\n" +
    "Bài đăng công khai tải về bình thường — hãy thử link khác.",
  errorUnsupportedPlatform:
    "Mình không nhận ra link này — hãy kiểm tra đó là link trực tiếp tới video từ YouTube, TikTok, Instagram, Facebook, Twitter/X, Vimeo, VK, Rutube, OK.ru, Pinterest hoặc Threads.",
  errorFileTooLarge: "file lớn hơn 2 GB — Telegram không cho bot gửi file lớn hơn. Bạn có thể tải trên trang web hoặc bằng tiện ích trình duyệt — các nút ở bên dưới. Hoặc gửi lại link và chọn chất lượng thấp hơn.",
  siteButton: "🌐 Tải trên trang web",
  qualitiesHiddenBySize: (limit) =>
    `\n\n⚖️ Các chất lượng nặng hơn ${limit} đã được ẩn: Telegram không cho bot gửi file lớn hơn. Bạn có thể tải chúng trên trang web hoặc bằng tiện ích trình duyệt — các nút ở bên dưới.`,
  videoTooBigForTelegram: (smallest) =>
    `\n\n⚖️ Video này quá nặng với Telegram ngay cả ở chất lượng thấp nhất (~${smallest}): Telegram không cho bot gửi file trên 2 GB. Ở đây bạn chỉ lấy được âm thanh; còn video — trên trang web hoặc bằng tiện ích trình duyệt (các nút bên dưới).`,
  errorFormatUnavailable: "Chất lượng này không có cho video này. Hãy gửi lại link — mình sẽ hiện danh sách mới nhất.",
  errorNoVideoContent: "Link này không có video để tải — có vẻ bài đăng chỉ có ảnh.",
  errorRegionBlocked:
    "Video này bị chặn bên ngoài quốc gia của tác giả — nền tảng không cung cấp " +
    "nó cho máy chủ của chúng mình. Không có cách nào vượt qua: giới hạn nằm ở phía họ." +
    "\n\nCác link khác vẫn tải về bình thường.",
  errorRateLimited: "Bạn gửi quá nhiều link liên tiếp — hãy chờ một chút rồi gửi lại.",
  errorYoutubeDailyLimit: (gb) => `bạn đã tải hơn ${gb} GB từ YouTube trong 24 giờ qua — đó là giới hạn mỗi ngày của bot cho mỗi người. Giới hạn tính theo 24 giờ gần nhất, nên một lúc sau bạn có thể tải video YouTube mới. Các nền tảng khác vẫn hoạt động bình thường.`,
  playlistStoppedByLimit: (dropped) => `⏹ Đã dừng playlist: đã đạt giới hạn YouTube trong ngày. Số video chưa tải: ${dropped}. Hãy gửi lại link playlist sau.`,
  errorPlatformRefused:
    "nền tảng không cung cấp video này cho máy chủ của chúng mình. Điều này xảy ra với bài đăng riêng tư " +
    "hoặc giới hạn độ tuổi, và đôi khi nền tảng chỉ tạm thời hạn chế truy cập " +
    "một lúc. Hãy thử lại sau vài phút.",
  errorThreadsNoMedia:
    "bài đăng Threads này không có video hay ảnh nào hiển thị. Có thể đó là bài chỉ có chữ, hoặc " +
    "Threads chỉ hiển thị nội dung cho người đã đăng nhập — những bài như vậy không thể tải nếu không đăng nhập.",
  extensionHint:
    "\n\n💻 Bạn có thể tải video này bằng tiện ích trình duyệt Videoner trên máy tính: " +
    "tiện ích tải bằng chính phiên đăng nhập của bạn trên nền tảng, mật khẩu và cookie không rời khỏi trình duyệt của bạn.",
  privateConnectHint: (platform, withExtension) =>
    `\n\n🔑 Để tải những bài đăng như thế này, hãy kết nối tài khoản ${platform} của bạn với bot — chỉ một lần. Sau đó bot tải được mọi thứ bạn xem được: bài đăng riêng tư, reels và story, cả trên điện thoại. Nút bên dưới sẽ hướng dẫn cách làm.${withExtension ? "\n\n💻 Hoặc tải bằng tiện ích trình duyệt Videoner trên máy tính." : ""}`,
  privateReconnectHint: (platform, withExtension) =>
    `\n\n⚠️ Tài khoản ${platform} bạn đã kết nối không mở được bài đăng này. Có thể phiên đăng nhập đã hết hiệu lực — hãy kết nối lại tài khoản. Hoặc tài khoản này không có quyền xem bài đăng.${withExtension ? "\n\n💻 Bạn cũng có thể tải bằng tiện ích trình duyệt Videoner trên máy tính." : ""}`,
  connectAccountButton: "🔑 Kết nối tài khoản",
  reconnectAccountButton: "🔑 Kết nối lại",
  extensionButton: "🧩 Tải bằng tiện ích",
  extensionCommand:
    "🧩 Videoner cho trình duyệt của bạn: nút Tải xuống ngay trên trang video — YouTube, Instagram, TikTok, VK, video riêng tư từ tài khoản của bạn và bài học GetCourse.\n\nDành cho Chrome, Edge, Opera, Yandex Browser và Firefox trên máy tính.",
  extensionPageButton: "🧩 Cài tiện ích",
  addToGroupButton: "👥 Thêm vào nhóm",
  newsButton: "📣 Tin tức dự án",
  fileCaptionShort: (title, sourceUrl) =>
    withOptionalLines((title ? `🎬 ${title.slice(0, 200)}\n\n` : "") + sourceUrl, `📣 Tin tức dự án: ${NEWS_CHANNEL}`, undefined),
  sentBy: (name) => `👤 ${name}`,
  groupSettings: (s, canDelete) =>
    "⚙️ Cài đặt bot cho nhóm này\n\n" +
    `🗑 Xóa tin nhắn chứa link: ${s.deleteLinks ? "có" : "không"}\n` +
    "Sau khi gửi video, tin nhắn chỉ chứa link sẽ bị xóa — trong chat chỉ còn video kèm tên người đã chia sẻ.\n" +
    (s.deleteLinks && !canDelete
      ? "⚠️ Hiện mình không xóa được tin nhắn: hãy đặt mình làm quản trị viên với quyền “Xóa tin nhắn”.\n"
      : "") +
    `\n✍️ Chú thích dưới video: ${{ full: "đầy đủ", short: "tiêu đề và nguồn", none: "không có chú thích" }[s.caption] ?? s.caption}\n` +
    `\n🎞 Chất lượng: ${s.quality === "max" ? "cao nhất mà Telegram chấp nhận" : "tiêu chuẩn (720p)"}\n` +
    `\n⏱ Video dài: ${s.longVideos ? "mọi độ dài" : "chỉ tối đa 15 phút"}\n` +
    `\n🔑 Ai được kết nối tài khoản (cho story và bài đăng riêng tư): ${s.cookiesBy === "all" ? "mọi thành viên" : "chỉ quản trị viên"}\n` +
    `\n🌐 Ngôn ngữ trả lời: ${s.language ? langName(s.language) : "theo ngôn ngữ của từng thành viên"}\n` +
    "\nChỉ quản trị viên nhóm mới được thay đổi cài đặt.",
  settingsDeleteButton: (on) => `🗑 Xóa link: ${on ? "có" : "không"}`,
  settingsCaptionButton: (style) => `✍️ Chú thích: ${{ full: "đầy đủ", short: "ngắn", none: "không có" }[style] ?? style}`,
  settingsQualityButton: (mode) => `🎞 Chất lượng: ${mode === "max" ? "cao nhất" : "720p"}`,
  settingsLongButton: (on) => `⏱ Video dài: ${on ? "có" : "tối đa 15 phút"}`,
  settingsDoneButton: "✅ Xong",
  settingsAdminsOnly: "Chỉ quản trị viên nhóm mới được thay đổi cài đặt.",
  settingsGroupsOnly: "Cài đặt dành cho nhóm: hãy thêm mình vào nhóm và gửi /settings ở đó.",
  settingsFailed: "Không lưu được cài đặt, bạn hãy thử lại.",
  settingsCookiesButton: (by) => `🔑 Kết nối tài khoản: ${by === "all" ? "mọi người" : "quản trị viên"}`,
  accountsIntro:
    "🔑 Tài khoản đã kết nối\n\nBot có thể tải những nội dung chỉ người đã đăng nhập mới xem được (story Instagram, bài đăng riêng tư) — bằng tài khoản của bạn. Phiên đăng nhập có tác dụng ở nơi bạn kết nối: kết nối trong chat riêng phục vụ lượt tải của bạn, kể cả link của chính bạn trong các nhóm chưa có tài khoản riêng; kết nối với một nhóm phục vụ mọi thành viên của nhóm đó.",
  accountsHowTo:
    "Cách kết nối:\n1. Dễ nhất: tiện ích Videoner trên máy tính — đăng nhập trên trang của nền tảng, mở cửa sổ Videoner, bấm «🔑 Kết nối tài khoản … của bạn với bot» rồi gửi mã cho mình. Với nhóm, hãy gửi /connect MÃ ngay trong nhóm đó.\n2. Hoặc gửi cho mình file cookies.txt (cookie xuất từ trình duyệt), hoặc dán nội dung của nó thành tin nhắn.\n3. Từ điện thoại Android — dùng Firefox và tiện ích Cookie-Editor: https://videoner.download/vi/blog/android-firefox",
  accountsWarning:
    "⚠️ Các nền tảng không thích việc tải tự động và có thể hạn chế hoặc khóa tài khoản. Tốt hơn hãy kết nối tài khoản phụ, không phải tài khoản chính. Cookie được lưu ở dạng mã hóa, chỉ dùng để tải về và có thể xóa bằng các nút bên dưới.",
  accountsNone: "Chưa có kết nối nào.",
  accountsGroupTitle: "🔑 Tài khoản đã kết nối với nhóm này",
  accountsGroupHowTo:
    "Để kết nối cho cả nhóm: lấy mã bằng nút «🔑 Kết nối tài khoản … của bạn với bot» trong tiện ích Videoner rồi gửi /connect MÃ tại đây. Nếu bạn chỉ kết nối tài khoản trong chat riêng, bot sẽ dùng nó ở đây cho link của chính bạn. Các kết nối của bạn: /accounts trong chat riêng với @VideonerBot.",
  accountsLine: (platform, where, active) => `• ${platform} — ${where}${active ? "" : " (⚠️ phiên đăng nhập không hoạt động)"}`,
  accountsGroupLine: (platform, owner, active) => `• ${platform} — ${owner}${active ? "" : " (⚠️ phiên đăng nhập không hoạt động)"}`,
  accountsWhereHere: "chat riêng",
  accountsWhereGroup: (title) => `nhóm “${title}”`,
  accountsDeleteButton: (platform, where) => `🗑 ${platform} · ${where}`,
  accountsDeleteAllButton: "🗑 Xóa mọi kết nối của mình",
  accountsDeleted: "Đã xóa.",
  accountsDeletedAll: (n) => `Đã xóa kết nối: ${n}.`,
  accountsNotAllowed: "Chỉ người đã kết nối hoặc quản trị viên nhóm mới xóa được.",
  connectUsage:
    "Hãy gửi /connect MÃ. Mã được lấy bằng nút «🔑 Kết nối tài khoản … của bạn với bot» trong tiện ích Videoner trên máy tính. Các kết nối của bạn: /accounts.",
  connectOnlyAdmins: "Chỉ quản trị viên mới được kết nối tài khoản với nhóm này (xem /settings).",
  connectDone: (platform, where) =>
    `✅ Đã kết nối ${platform} ${where}. Giờ bot còn tải được cả nội dung chỉ người đã đăng nhập mới xem được. Xem hoặc xóa: /accounts.\n\n⚠️ Nền tảng có thể hạn chế tài khoản vì tải tự động — tốt hơn hãy dùng tài khoản phụ.`,
  connectWhereGroup: "với nhóm này",
  connectWhereHere: "cho lượt tải của bạn trong chat riêng và chế độ inline",
  connectCodeNotFound: "Không tìm thấy mã hoặc mã đã hết hạn (mã có hiệu lực 10 phút). Hãy lấy mã mới trong tiện ích Videoner.",
  connectRejectedNoSession: "Các cookie này không có phiên đăng nhập. Hãy đăng nhập trên trang của nền tảng rồi xuất lại cookie.",
  connectRejectedUnknown: "Không tìm thấy cookie của nền tảng được hỗ trợ: Instagram, Facebook, YouTube, X, VK, TikTok.",
  connectUnavailable: "Tính năng kết nối tài khoản hiện chưa khả dụng.",
  connectFailed: "Không kết nối được, bạn hãy thử lại.",
  connectFileTooBig: "File quá lớn — chỉ xuất cookie của trang web cần thiết thôi.",
  connectNotAnonymous: "Hãy kết nối tài khoản bằng chính bạn, không phải ẩn danh dưới tên nhóm: nếu không, kết nối của các quản trị viên sẽ bị lẫn lộn. Mình đã hủy mã — hãy lấy mã mới.",
  connectCodeInGroup:
    "Mã kết nối đăng trong chat nhóm thì người khác đều thấy được — mình đã hủy mã và xóa tin nhắn. Hãy lấy mã mới và gửi bằng /connect MÃ: mình sẽ xóa tin nhắn lệnh đó ngay lập tức.",
  groupWelcome:
    "👋 Chào cả nhà! Hãy đăng link video từ TikTok, Instagram, YouTube, VK và các nền tảng khác trong chat này — mình sẽ trả lời bằng chính video đó.\n\n" +
    "Mình tự tải các clip dài tối đa 15 phút, không cần lệnh nào, và ngoài ra thì giữ im lặng.\n\n⚙️ Quản trị viên nhóm có thể tùy chỉnh mình bằng /settings: xóa tin nhắn chứa link, kiểu chú thích, chất lượng, video dài và ngôn ngữ.\n\n⚡ Thêm -audio sau link để lấy âm thanh, hoặc -hd để có chất lượng tốt nhất.\n\n📣 Tin tức dự án: @videonerdownload",
  errorTooLong: "video quá dài — hiện chúng mình chưa tải được video dài như vậy.",
  errorUnknown: "không tải được video này. Hãy thử lại sau một chút hoặc gửi link khác.",
  inlineHintButton: "Gửi link cho bot",
  inlineResultTitle: "⬇️ Tải video",
  inlineResultDescription: "Video sẽ được đăng ngay trong chat này",
  inlinePlaceholder: "⏬ Đang tải, có thể mất vài phút...",
  inlineOpenBot: "Mở bot",
  inlineOnlySingleVideo:
    "Chế độ này chỉ gửi một video. Với bài đăng nhiều file hoặc ảnh, hãy gửi link cho bot trong chat riêng.",
  inlineSubscribeRequired: (channel: string) =>
    `Để tải về, hãy đăng ký ${channel} rồi thử lại.`,
  inlineRateLimited: "Quá nhiều yêu cầu liên tiếp. Hãy chờ một phút rồi thử lại.",
  queueRest: (count) => `\n\n📋 Link còn trong hàng đợi: ${count}. Mình sẽ lần lượt hiện từng link sau link này.`,
  queuedOne: (position) =>
    `📋 Đã thêm link vào hàng đợi, vị trí #${position}. Xong link hiện tại trước đã — sau đó mình sẽ hiện phần chọn chất lượng cho link này.`,
  queuedMany: (added, waiting) =>
    `📋 Đã thêm link vào hàng đợi: ${added}. Tổng số đang chờ: ${waiting}. Mình sẽ lần lượt hiện từng link sau link hiện tại.`,
  queueDuplicates: (count) =>
    count === 1
      ? "Link này đã có trong hàng đợi — mình không thêm lần nữa."
      : `Các link đã có trong hàng đợi sẽ không được thêm lần nữa (trùng lặp: ${count}).`,
  queueFull: (limit, rejected) =>
    `Hàng đợi chứa tối đa ${limit} link — các link thừa chưa được thêm (${rejected}). Hãy gửi lại khi hàng đợi đã vơi bớt.`,
  skipButton: "✖️ Không tải",
  skipped: "⏭ Đã bỏ qua link này.",
  chooseTimedOut: "⌛ Không có chất lượng nào được chọn trong 30 phút — bỏ qua link này.",
  queueLostOnRestart: (count) =>
    `⚠️ Bot đang khởi động lại để cập nhật — hàng đợi đã bị xóa (số link: ${count}). Hãy gửi lại sau một phút nhé.`,
  subtitlesButton: "📝 Phụ đề",
  subtitlesBack: "⬅️ Quay lại chọn chất lượng",
  subtitlesAuto: "tự động",
  subtitlesChoose: "Chọn ngôn ngữ phụ đề",
  subtitlesPreparing: "📝 Đang chuẩn bị phụ đề...",
  subtitlesFailed: "Không tải được phụ đề bằng ngôn ngữ này. Hãy thử ngôn ngữ khác.",
  subtitlesBusy: "YouTube hiện không cung cấp phụ đề — hãy thử lại sau vài phút.",
  playlistFound: (title, count) =>
    `📃 Playlist${title ? ` “${title.slice(0, 150)}”` : ""}: ${count} video.\nMình sẽ tải lần lượt từng video. Bạn chọn định dạng nào?`,
  playlistStdButton: "🎬 720p",
  playlistHdButton: "🎬 Chất lượng tốt nhất",
  playlistAudioButton: "🎵 Chỉ âm thanh (mp3)",
  playlistNoButton: "✖️ Không, cảm ơn",
  playlistQueued: (count) =>
    `📃 Đã thêm video từ playlist vào hàng đợi: ${count}. Mình sẽ gửi lần lượt từng video. Dừng bằng nút bên dưới hoặc /stop.`,
  playlistFailed: "Không mở được playlist — có thể playlist ở chế độ riêng tư. Hãy gửi link tới một video riêng lẻ.",
  stopButton: "⏹ Dừng",
  stopped: (dropped) => `⏹ Đã dừng.${dropped ? ` Số link đã xóa khỏi hàng đợi: ${dropped}.` : ""}`,
  nothingToStop: "Hiện không có gì đang tải.",
  languageChoose: "🌐 Chọn ngôn ngữ cho bot. “Tự động” sẽ theo ngôn ngữ Telegram của bạn.",
  languageChooseGroup: "🌐 Ngôn ngữ trả lời của bot trong nhóm này. “Tự động” — theo ngôn ngữ Telegram của từng thành viên.",
  languageAuto: "Tự động — theo Telegram",
  languageAutoGroup: "Tự động — theo từng thành viên",
  languageSaved: (name) => `✅ Ngôn ngữ của bot: ${name}. Đổi bằng /language.`,
  languageSavedAuto: "✅ Bot sẽ theo ngôn ngữ Telegram của bạn. Đổi bằng /language.",
  settingsLanguageButton: (name) => `🌐 Ngôn ngữ: ${name ?? "tự động"}`,
  settingsBack: "⬅️ Quay lại cài đặt",
};


const bn: Messages = {
  start: "হ্যালো! YouTube, TikTok, Instagram, Facebook, Twitter/X, Vimeo, VK, Rutube, OK.ru, Pinterest বা Threads থেকে ভিডিওর লিংক পাঠান — আমি ডাউনলোড করতে সাহায্য করব।\n\n✨ কোয়ালিটির কোনো সীমা নেই: প্ল্যাটফর্ম যা দেয় তা-ই পাবেন, 4K পর্যন্ত — শুধু ফাইলটি 2 GB-এর মধ্যে হতে হবে, বটের জন্য এটাই Telegram-এর সীমা। এখানে কোনো পেইড ফিচার নেই।\n\nসম্পূর্ণ ফ্রি: কোনো সাবস্ক্রিপশন নেই, বিজ্ঞাপন নেই, ইন-অ্যাপ কেনাকাটা নেই।\n\n🧩 কম্পিউটারে ডাউনলোড করছেন? ব্রাউজার এক্সটেনশন ইনস্টল করুন — ভিডিওর পেজেই একটি ডাউনলোড বাটন দেখা যাবে: videoner.download/bn/extension\n\n👥 আমাকে কোনো গ্রুপে যোগ করুন — সেখানে কেউ লিংক শেয়ার করলে আমি ভিডিওটি পোস্ট করে দেব।\n\n⚡ কোয়ালিটি বাছাই এড়িয়ে যান: শুধু সাউন্ডের (mp3) জন্য লিংকের পরে -audio লিখুন, আর সেরা কোয়ালিটির জন্য -hd।\n\n📣 প্রজেক্টের খবর: @videonerdownload\n\n🌐 বটের ভাষা: /language",
  notLink: "এটি লিংক বলে মনে হচ্ছে না। আমাকে একটি ভিডিওর লিংক পাঠান।",
  inviteGreeting: "হ্যালো! আমি Videoner — YouTube, TikTok, Instagram ও অন্যান্য প্ল্যাটফর্ম থেকে বিনামূল্যে ভিডিও ডাউনলোড করি। আপনার সাথে শেয়ার করা ভিডিওটি তৈরি করছি 👇",
  inviteNotFound: "এই আমন্ত্রণ লিংকের জন্য কোনো ভিডিও খুঁজে পাইনি। আমাকে ভিডিওর লিংক পাঠান, আমি ডাউনলোড করে দেব।",
  inviteUnavailable: "এই লিংক থেকে ভিডিওটি খুলতে পারিনি — সার্ভিসটি এখন সাড়া দিচ্ছে না। এক মিনিট পরে একই লিংক আবার খুলুন।",
  fetchingInfo: "🔍 ভিডিওর তথ্য আনা হচ্ছে...",
  audioOnlyButton: "🎵 শুধু অডিও (mp3)",
  photoButton: "📷 ছবি ডাউনলোড করুন",
  slideshowButton: "🎞 স্লাইডশো (ভিডিও)",
  galleryButton: "📷+🎞 ছবি ও স্লাইডশো",
  chooseQuality: (title, duration) => `"${title}"${duration ? `\n⏱ ${duration}` : ""}\n\nকোয়ালিটি বেছে নিন:`,
  sessionExpired: "সেশনের মেয়াদ শেষ — লিংকটি আবার পাঠান",
  downloading: "⏬ ডাউনলোড হচ্ছে, এতে কয়েক মিনিট লাগতে পারে...",
  downloadFailed: "ডাউনলোড ব্যর্থ হয়েছে",
  downloadProgress: (percent, eta, done) =>
    `⏬ ডাউনলোড হচ্ছে: ${percent}%${eta ? ` · বাকি ${eta}` : ""}${done ? `\n${done}` : ""}`,
  downloadFinishing: "⚙️ প্রায় শেষ — ফাইলটি জোড়া লাগানো হচ্ছে...",
  converting: (percent) => `⚙️ কনভার্ট হচ্ছে: ${percent}%`,
  etaUnderMinute: "এক মিনিটেরও কম",
  etaMinutes: (minutes) => `~${minutes} মিনিট`,
  etaHours: (hours, minutes) => `~${hours} ঘণ্টা${minutes ? ` ${minutes} মিনিট` : ""}`,
  downloadTimeout: "ডাউনলোডে অনেক বেশি সময় লাগছে — ভিডিওটি মনে হয় খুব ভারী। কম কোয়ালিটি বেছে দেখুন।",
  downloadInterrupted: "⚠️ আপডেটের জন্য বট রিস্টার্ট হচ্ছে — আপনার ডাউনলোড থেমে গেছে। এক মিনিট পরে লিংকটি আবার পাঠান।",
  fileTooBig: (mb, url) =>
    `ফাইলটি বড় হয়ে গেছে (${mb} MB) — Telegram বটকে এটি পাঠাতে দেয় না।\nএখান থেকে ডাউনলোড করুন: ${url}`,
  sendingFile: "📤 ফাইল পাঠানো হচ্ছে...",
  sendingAlbum: (count) => `📤 এই পোস্টে কয়েকটি ফাইল আছে (${count}) — অ্যালবাম হিসেবে পাঠাচ্ছি...`,
  failedPrefix: "❌ ব্যর্থ: ",
  fileCaption: (title, sourceUrl, shareUrl, description) =>
    composeCaption(
      title,
      description,
      `সোর্স: ${sourceUrl}\n` +
        "ভিডিওর সব স্বত্ব এর নির্মাতার।\n" +
        "@VideonerBot দিয়ে বিনামূল্যে ডাউনলোড করা",
      `📣 প্রজেক্টের খবর: ${NEWS_CHANNEL}`,
      shareUrl && `🔗 শেয়ার করুন: ${shareUrl}`,
    ),
  subscribeRequired: (channel) =>
    `ডাউনলোড করতে আমাদের চ্যানেল ${channel} সাবস্ক্রাইব করুন — এটাই একমাত্র শর্ত, সার্ভিসটি ফ্রি-ই থাকবে।\n\n` +
    "সাবস্ক্রাইব করে «আমি সাবস্ক্রাইব করেছি» চাপুন।",
  openChannelButton: "📣 চ্যানেল খুলুন",
  checkSubscriptionButton: "আমি সাবস্ক্রাইব করেছি",
  subscribeThanks: "ধন্যবাদ! এখন আমাকে একটি ভিডিওর লিংক পাঠান।",
  subscribeThanksResuming: "ধন্যবাদ! আপনার লিংকটি নিয়ে কাজ শুরু করছি।",
  subscribeStillMissing: "এখনো সাবস্ক্রিপশন দেখতে পাচ্ছি না। সাবস্ক্রাইব করে আবার চাপুন।",
  channelNotice: (channel) => `\n\nএই পোস্টের লিংক ${channel}-এ দেখা যাবে — বেনামে, আপনার নাম ছাড়া।`,
  channelPost: (title, url) =>
    (title ? `🎬 ${title.slice(0, 200)}\n\n` : "") +
    `${url}\n\n` +
    "এটি এবং যেকোনো ভিডিও বিনামূল্যে ডাউনলোড করুন: @VideonerBot",
  errorStoryNeedsId:
    "নির্দিষ্ট একটি স্টোরির লিংক পাঠান: Instagram অ্যাপে সেটি খুলে Share → Copy link চাপুন।",
  errorInstagramStory:
    "Instagram স্টোরি শুধু সাইন ইন করা ব্যবহারকারীরাই দেখতে পান।",
  errorLoginRequired:
    "সাইন ইন ছাড়া এই পোস্ট দেখা যায় না: প্ল্যাটফর্মটি এটি শুধু " +
    "লগ ইন করা ব্যবহারকারীদের দেখায়। প্রাইভেট পোস্ট, বয়স-সীমিত কনটেন্ট এবং " +
    "সীমিত দর্শকের সাথে শেয়ার করা পোস্টে এমন হয়।\n\n" +
    "পাবলিক পোস্ট কোনো সমস্যা ছাড়াই ডাউনলোড হয় — অন্য একটি লিংক দিয়ে চেষ্টা করুন।",
  errorUnsupportedPlatform:
    "লিংকটি চিনতে পারিনি — নিশ্চিত করুন যে এটি YouTube, TikTok, Instagram, Facebook, Twitter/X, Vimeo, VK, Rutube, OK.ru, Pinterest বা Threads-এর সরাসরি ভিডিও লিংক।",
  errorFileTooLarge: "ফাইলটি 2 GB-এর চেয়ে বড় — Telegram বটকে এর চেয়ে বড় ফাইল পাঠাতে দেয় না। ওয়েবসাইটে বা ব্রাউজার এক্সটেনশন দিয়ে ডাউনলোড করুন — বাটন নিচে আছে। অথবা লিংকটি আবার পাঠিয়ে কম কোয়ালিটি বেছে নিন।",
  siteButton: "🌐 ওয়েবসাইটে ডাউনলোড করুন",
  qualitiesHiddenBySize: (limit) =>
    `\n\n⚖️ ${limit}-এর চেয়ে ভারী কোয়ালিটিগুলো লুকানো আছে: Telegram বটকে এর চেয়ে বড় ফাইল পাঠাতে দেয় না। সেগুলো ওয়েবসাইটে বা ব্রাউজার এক্সটেনশন দিয়ে ডাউনলোড করতে পারেন — বাটন নিচে আছে।`,
  videoTooBigForTelegram: (smallest) =>
    `\n\n⚖️ সবচেয়ে কম কোয়ালিটিতেও এই ভিডিওটি Telegram-এর জন্য খুব ভারী (~${smallest}): Telegram বটকে 2 GB-এর বেশি ফাইল পাঠাতে দেয় না। এখানে শুধু অডিও পাবেন; ভিডিওটি — ওয়েবসাইটে বা ব্রাউজার এক্সটেনশন দিয়ে (বাটন নিচে আছে)।`,
  errorFormatUnavailable: "এই ভিডিওর জন্য এই কোয়ালিটি পাওয়া যাচ্ছে না। লিংকটি আবার পাঠান — আমি বর্তমান তালিকা দেখাব।",
  errorNoVideoContent: "এই লিংকে ডাউনলোড করার মতো কোনো ভিডিও নেই — পোস্টটিতে মনে হয় শুধু ছবি আছে।",
  errorRegionBlocked:
    "এই ভিডিওটি নির্মাতার দেশের বাইরে ব্লক করা — প্ল্যাটফর্মটি এটি আমাদের " +
    "সার্ভারে দেয় না। এর কোনো উপায় নেই: সীমাবদ্ধতাটি তাদের দিক থেকে।" +
    "\n\nঅন্য লিংক স্বাভাবিকভাবেই ডাউনলোড হয়।",
  errorRateLimited: "পরপর অনেক বেশি লিংক — একটু অপেক্ষা করে আবার পাঠান।",
  errorYoutubeDailyLimit: (gb) => `গত 24 ঘণ্টায় আপনি YouTube থেকে ${gb} GB-এর বেশি ডাউনলোড করেছেন — এটাই একজনের জন্য বটের দৈনিক সীমা। হিসাব হয় শেষ 24 ঘণ্টার, তাই কিছুক্ষণ পরে আবার নতুন YouTube ভিডিও ডাউনলোড করতে পারবেন। অন্য প্ল্যাটফর্ম স্বাভাবিকভাবে কাজ করছে।`,
  playlistStoppedByLimit: (dropped) => `⏹ প্লেলিস্ট থামানো হয়েছে: YouTube-এর দৈনিক সীমা পূর্ণ হয়েছে। ডাউনলোড হয়নি এমন ভিডিও: ${dropped}। পরে প্লেলিস্টের লিংকটি আবার পাঠান।`,
  errorPlatformRefused:
    "প্ল্যাটফর্মটি এই ভিডিওটি আমাদের সার্ভারকে দেয়নি। প্রাইভেট " +
    "বা বয়স-সীমিত পোস্টে এমন হয়, আর কখনো কখনো প্ল্যাটফর্ম কিছু সময়ের জন্য " +
    "অ্যাক্সেস সীমিত করে দেয়। কয়েক মিনিট পরে আবার চেষ্টা করুন।",
  errorThreadsNoMedia:
    "এই Threads পোস্টে কোনো ভিডিও বা ছবি দেখা যাচ্ছে না। হয় এটি শুধু লেখার পোস্ট, অথবা " +
    "Threads এর মিডিয়া শুধু সাইন ইন করা ব্যবহারকারীদের দেখায় — এমন পোস্ট লগ ইন ছাড়া ডাউনলোড করা যায় না।",
  extensionHint:
    "\n\n💻 কম্পিউটারে Videoner ব্রাউজার এক্সটেনশন দিয়ে এটি ডাউনলোড করতে পারেন: " +
    "এটি প্ল্যাটফর্মে আপনার নিজের সাইন ইন ব্যবহার করে ডাউনলোড করে, আর কোনো পাসওয়ার্ড বা কুকি আপনার ব্রাউজারের বাইরে যায় না।",
  privateConnectHint: (platform, withExtension) =>
    `\n\n🔑 এমন পোস্ট ডাউনলোড করতে আপনার ${platform} অ্যাকাউন্ট বটের সাথে যুক্ত করুন — একবারই। এরপর আপনি যা দেখতে পান বট সবই ডাউনলোড করবে: প্রাইভেট পোস্ট, রিলস ও স্টোরি, ফোন থেকেও। কীভাবে করবেন, নিচের বাটনে দেখানো আছে।${withExtension ? "\n\n💻 অথবা কম্পিউটারে Videoner ব্রাউজার এক্সটেনশন দিয়ে ডাউনলোড করুন।" : ""}`,
  privateReconnectHint: (platform, withExtension) =>
    `\n\n⚠️ আপনার যুক্ত করা ${platform} অ্যাকাউন্ট এই পোস্টটি খুলতে পারেনি। হয়তো লগ ইন আর কাজ করছে না — অ্যাকাউন্টটি আবার যুক্ত করুন। অথবা এই অ্যাকাউন্টের পোস্টটিতে অ্যাক্সেস নেই।${withExtension ? "\n\n💻 কম্পিউটারে Videoner ব্রাউজার এক্সটেনশন দিয়েও এটি ডাউনলোড করতে পারেন।" : ""}`,
  connectAccountButton: "🔑 অ্যাকাউন্ট যুক্ত করুন",
  reconnectAccountButton: "🔑 আবার যুক্ত করুন",
  extensionButton: "🧩 এক্সটেনশন দিয়ে ডাউনলোড করুন",
  extensionCommand:
    "🧩 আপনার ব্রাউজারের জন্য Videoner: ভিডিওর পেজেই একটি ডাউনলোড বাটন — YouTube, Instagram, TikTok, VK, আপনার অ্যাকাউন্টের প্রাইভেট ভিডিও এবং GetCourse-এর লেসন।\n\nকম্পিউটারে Chrome, Edge, Opera, Yandex Browser ও Firefox-এর জন্য।",
  extensionPageButton: "🧩 এক্সটেনশন ইনস্টল করুন",
  addToGroupButton: "👥 গ্রুপে যোগ করুন",
  newsButton: "📣 প্রজেক্টের খবর",
  fileCaptionShort: (title, sourceUrl) =>
    withOptionalLines((title ? `🎬 ${title.slice(0, 200)}\n\n` : "") + sourceUrl, `📣 প্রজেক্টের খবর: ${NEWS_CHANNEL}`, undefined),
  sentBy: (name) => `👤 ${name}`,
  groupSettings: (s, canDelete) =>
    "⚙️ এই গ্রুপে বটের সেটিংস\n\n" +
    `🗑 লিংকসহ মেসেজ মুছে ফেলা: ${s.deleteLinks ? "হ্যাঁ" : "না"}\n` +
    "ভিডিও পাঠানোর পরে যে মেসেজে শুধু লিংক ছিল সেটি মুছে যায় — চ্যাটে থাকে শুধু ভিডিও, সাথে যিনি শেয়ার করেছেন তাঁর নাম।\n" +
    (s.deleteLinks && !canDelete
      ? "⚠️ আমি এখন মেসেজ মুছতে পারছি না: আমাকে \"Delete messages\" অধিকারসহ অ্যাডমিন বানান।\n"
      : "") +
    `\n✍️ ভিডিওর নিচের ক্যাপশন: ${{ full: "পুরো", short: "শিরোনাম ও সোর্স", none: "ক্যাপশন নেই" }[s.caption] ?? s.caption}\n` +
    `\n🎞 কোয়ালিটি: ${s.quality === "max" ? "Telegram যত বেশি নেয়" : "স্ট্যান্ডার্ড (720p)"}\n` +
    `\n⏱ লম্বা ভিডিও: ${s.longVideos ? "যেকোনো দৈর্ঘ্যের" : "শুধু 15 মিনিট পর্যন্ত"}\n` +
    `\n🔑 কারা নিজের অ্যাকাউন্ট যুক্ত করতে পারবেন (স্টোরি ও প্রাইভেট পোস্টের জন্য): ${s.cookiesBy === "all" ? "যেকোনো সদস্য" : "শুধু অ্যাডমিনরা"}\n` +
    `\n🌐 উত্তরের ভাষা: ${s.language ? langName(s.language) : "প্রত্যেক সদস্যের নিজের"}\n` +
    "\nশুধু গ্রুপের অ্যাডমিনরাই সেটিংস বদলাতে পারেন।",
  settingsDeleteButton: (on) => `🗑 লিংক মুছুন: ${on ? "হ্যাঁ" : "না"}`,
  settingsCaptionButton: (style) => `✍️ ক্যাপশন: ${{ full: "পুরো", short: "সংক্ষিপ্ত", none: "নেই" }[style] ?? style}`,
  settingsQualityButton: (mode) => `🎞 কোয়ালিটি: ${mode === "max" ? "সর্বোচ্চ" : "720p"}`,
  settingsLongButton: (on) => `⏱ লম্বা ভিডিও: ${on ? "হ্যাঁ" : "15 মিনিট পর্যন্ত"}`,
  settingsDoneButton: "✅ সম্পন্ন",
  settingsAdminsOnly: "শুধু গ্রুপের অ্যাডমিনরাই সেটিংস বদলাতে পারেন।",
  settingsGroupsOnly: "সেটিংস গ্রুপের জন্য: আমাকে কোনো গ্রুপে যোগ করে সেখানে /settings পাঠান।",
  settingsFailed: "সেটিংস সেভ করা যায়নি, আবার চেষ্টা করুন।",
  settingsCookiesButton: (by) => `🔑 অ্যাকাউন্ট যুক্ত করা: ${by === "all" ? "সবাই" : "অ্যাডমিনরা"}`,
  accountsIntro:
    "🔑 যুক্ত অ্যাকাউন্ট\n\nশুধু সাইন ইন করা লোকেরা যা দেখতে পান (Instagram স্টোরি, প্রাইভেট পোস্ট), বট তা আপনার অ্যাকাউন্ট ব্যবহার করে ডাউনলোড করতে পারে। লগ ইন সেখানেই কাজ করে যেখানে আপনি এটি যুক্ত করেছেন: প্রাইভেট চ্যাটে যুক্ত করা অ্যাকাউন্ট আপনার ডাউনলোডের জন্য, যেসব গ্রুপে নিজস্ব অ্যাকাউন্ট নেই সেখানে আপনার নিজের লিংকসহ; আর গ্রুপে যুক্ত করা অ্যাকাউন্ট সেই গ্রুপের সব সদস্যের জন্য।",
  accountsHowTo:
    "কীভাবে যুক্ত করবেন:\n1. সবচেয়ে সহজ: কম্পিউটারে Videoner এক্সটেনশন — প্ল্যাটফর্মের সাইটে সাইন ইন করুন, Videoner উইন্ডো খুলুন, «🔑 আপনার … অ্যাকাউন্ট বটের সাথে যুক্ত করুন» চাপুন এবং কোডটি আমাকে পাঠান। গ্রুপের জন্য সেই গ্রুপেই /connect কোড পাঠান।\n2. অথবা আমাকে একটি cookies.txt ফাইল পাঠান (ব্রাউজার থেকে এক্সপোর্ট করা কুকি), অথবা এর লেখা মেসেজ হিসেবে পেস্ট করুন।\n3. Android ফোন থেকে — Firefox ও Cookie-Editor অ্যাড-অন দিয়ে: https://videoner.download/bn/blog/android-firefox",
  accountsWarning:
    "⚠️ প্ল্যাটফর্মগুলো স্বয়ংক্রিয় ডাউনলোড পছন্দ করে না এবং অ্যাকাউন্ট সীমিত বা ব্যান করতে পারে। মূল অ্যাকাউন্ট নয়, একটি বাড়তি অ্যাকাউন্ট যুক্ত করাই ভালো। কুকি এনক্রিপ্ট করে রাখা হয়, শুধু ডাউনলোডের জন্য ব্যবহার করা হয়, আর নিচের বাটন দিয়ে মুছে ফেলা যায়।",
  accountsNone: "এখনো কিছু যুক্ত করা হয়নি।",
  accountsGroupTitle: "🔑 এই গ্রুপে যুক্ত অ্যাকাউন্ট",
  accountsGroupHowTo:
    "পুরো গ্রুপের জন্য অ্যাকাউন্ট যুক্ত করতে: Videoner এক্সটেনশনের «🔑 আপনার … অ্যাকাউন্ট বটের সাথে যুক্ত করুন» বাটন দিয়ে কোড নিন এবং এখানে /connect কোড পাঠান। আপনি যদি শুধু প্রাইভেট চ্যাটে অ্যাকাউন্ট যুক্ত করে থাকেন, বট এখানে আপনার নিজের লিংকের জন্য সেটি ব্যবহার করবে। আপনার সংযোগগুলো: @VideonerBot-এর সাথে প্রাইভেট চ্যাটে /accounts।",
  accountsLine: (platform, where, active) => `• ${platform} — ${where}${active ? "" : " (⚠️ লগ ইন কাজ করছে না)"}`,
  accountsGroupLine: (platform, owner, active) => `• ${platform} — ${owner}${active ? "" : " (⚠️ লগ ইন কাজ করছে না)"}`,
  accountsWhereHere: "প্রাইভেট চ্যাট",
  accountsWhereGroup: (title) => `গ্রুপ "${title}"`,
  accountsDeleteButton: (platform, where) => `🗑 ${platform} · ${where}`,
  accountsDeleteAllButton: "🗑 আমার সব সংযোগ মুছুন",
  accountsDeleted: "মুছে ফেলা হয়েছে।",
  accountsDeletedAll: (n) => `সংযোগ মুছে ফেলা হয়েছে: ${n}।`,
  accountsNotAllowed: "শুধু যিনি এটি যুক্ত করেছেন অথবা গ্রুপের অ্যাডমিন এটি মুছতে পারেন।",
  connectUsage:
    "/connect কোড পাঠান। কোডটি পাবেন কম্পিউটারে Videoner এক্সটেনশনের «🔑 আপনার … অ্যাকাউন্ট বটের সাথে যুক্ত করুন» বাটন থেকে। আপনার সংযোগগুলো: /accounts।",
  connectOnlyAdmins: "এই গ্রুপে শুধু অ্যাডমিনরাই অ্যাকাউন্ট যুক্ত করতে পারেন (দেখুন /settings)।",
  connectDone: (platform, where) =>
    `✅ ${platform} ${where} যুক্ত হয়েছে। এখন বট সেগুলোও ডাউনলোড করবে যা শুধু সাইন ইন করা লোকেরা দেখতে পান। দেখুন বা মুছুন: /accounts।\n\n⚠️ স্বয়ংক্রিয় ডাউনলোডের কারণে প্ল্যাটফর্ম অ্যাকাউন্টটি সীমিত করতে পারে — একটি বাড়তি অ্যাকাউন্ট ব্যবহার করাই ভালো।`,
  connectWhereGroup: "এই গ্রুপে",
  connectWhereHere: "প্রাইভেট চ্যাট ও ইনলাইন মোডে আপনার ডাউনলোডের জন্য",
  connectCodeNotFound: "কোডটি পাওয়া যায়নি বা মেয়াদ শেষ (কোড 10 মিনিট কার্যকর থাকে)। Videoner এক্সটেনশন থেকে নতুন কোড নিন।",
  connectRejectedNoSession: "এই কুকিতে কোনো লগ ইন নেই। প্ল্যাটফর্মের সাইটে সাইন ইন করে আবার কুকি এক্সপোর্ট করুন।",
  connectRejectedUnknown: "সমর্থিত প্ল্যাটফর্মের কোনো কুকি পাওয়া যায়নি: Instagram, Facebook, YouTube, X, VK, TikTok।",
  connectUnavailable: "অ্যাকাউন্ট যুক্ত করার সুবিধা এখনো চালু হয়নি।",
  connectFailed: "যুক্ত করা যায়নি, আবার চেষ্টা করুন।",
  connectFileTooBig: "ফাইলটি অনেক বড় — শুধু প্রয়োজনীয় সাইটের কুকি এক্সপোর্ট করুন।",
  connectNotAnonymous: "অ্যাকাউন্টটি নিজের নামে যুক্ত করুন, গ্রুপের নামে বেনামে নয়: নইলে অ্যাডমিনদের সংযোগ মিশে যায়। আমি কোডটি বাতিল করেছি — নতুন একটি নিন।",
  connectCodeInGroup:
    "গ্রুপ চ্যাটে পোস্ট করা সংযোগ কোড অন্যরা দেখতে পারেন — আমি কোডটি বাতিল করেছি এবং মেসেজটি মুছে দিয়েছি। নতুন কোড নিয়ে /connect কোড দিয়ে পাঠান: ওই কমান্ডের মেসেজ আমি সঙ্গে সঙ্গে মুছে দিই।",
  groupWelcome:
    "👋 হ্যালো! এই চ্যাটে TikTok, Instagram, YouTube, VK ও অন্যান্য প্ল্যাটফর্মের ভিডিওর লিংক পোস্ট করুন — আমি উত্তরে ভিডিওটিই পাঠাব।\n\n" +
    "15 মিনিট পর্যন্ত ভিডিও আমি নিজে থেকেই ডাউনলোড করি, কোনো কমান্ড লাগে না, আর বাকি সময় চুপ থাকি।\n\n⚙️ গ্রুপের অ্যাডমিনরা /settings দিয়ে আমাকে সাজাতে পারেন: লিংকের মেসেজ মুছে ফেলা, ক্যাপশনের ধরন, কোয়ালিটি, লম্বা ভিডিও ও ভাষা।\n\n⚡ সাউন্ড পেতে লিংকের পরে -audio লিখুন, আর সেরা কোয়ালিটির জন্য -hd।\n\n📣 প্রজেক্টের খবর: @videonerdownload",
  errorTooLong: "ভিডিওটি অনেক লম্বা — এত লম্বা ভিডিও আমরা এখনো ডাউনলোড করতে পারি না।",
  errorUnknown: "এই ভিডিওটি ডাউনলোড করা যায়নি। একটু পরে আবার চেষ্টা করুন বা অন্য লিংক পাঠান।",
  inlineHintButton: "বটকে লিংক পাঠান",
  inlineResultTitle: "⬇️ ভিডিও ডাউনলোড করুন",
  inlineResultDescription: "ভিডিওটি সরাসরি এই চ্যাটে পোস্ট হবে",
  inlinePlaceholder: "⏬ ডাউনলোড হচ্ছে, এতে কয়েক মিনিট লাগতে পারে...",
  inlineOpenBot: "বট খুলুন",
  inlineOnlySingleVideo:
    "এই মোডে একটি মাত্র ভিডিও পাঠানো যায়। একাধিক ফাইলের পোস্ট বা ছবির জন্য প্রাইভেট চ্যাটে বটকে লিংকটি পাঠান।",
  inlineSubscribeRequired: (channel: string) =>
    `ডাউনলোড করতে ${channel} সাবস্ক্রাইব করে আবার চেষ্টা করুন।`,
  inlineRateLimited: "পরপর অনেক বেশি অনুরোধ। এক মিনিট অপেক্ষা করে আবার চেষ্টা করুন।",
  queueRest: (count) => `\n\n📋 সারিতে এখনো লিংক আছে: ${count}। এটির পরে একে একে দেখাব।`,
  queuedOne: (position) =>
    `📋 লিংকটি সারিতে রাখা হয়েছে, #${position}। আগে বর্তমানটি শেষ করি — তারপর এর কোয়ালিটি বাছাই দেখাব।`,
  queuedMany: (added, waiting) =>
    `📋 সারিতে লিংক যোগ হয়েছে: ${added}। মোট অপেক্ষায়: ${waiting}। বর্তমানটির পরে একে একে দেখাব।`,
  queueDuplicates: (count) =>
    count === 1
      ? "এই লিংকটি আগে থেকেই সারিতে আছে — দ্বিতীয়বার যোগ করছি না।"
      : `সারিতে আগে থেকে থাকা লিংক দ্বিতীয়বার যোগ করা হয় না (পুনরাবৃত্তি: ${count})।`,
  queueFull: (limit, rejected) =>
    `সারিতে সর্বোচ্চ ${limit}টি লিংক রাখা যায় — বাড়তিগুলো যোগ করা হয়নি (${rejected})। সারি এগোলে সেগুলো পাঠান।`,
  skipButton: "✖️ ডাউনলোড করবেন না",
  skipped: "⏭ এই লিংকটি বাদ দেওয়া হয়েছে।",
  chooseTimedOut: "⌛ 30 মিনিটের মধ্যে কোনো কোয়ালিটি বাছাই করা হয়নি — এই লিংকটি বাদ দিচ্ছি।",
  queueLostOnRestart: (count) =>
    `⚠️ আপডেটের জন্য বট রিস্টার্ট হচ্ছে — সারি রিসেট হয়ে গেছে (লিংক: ${count})। এক মিনিট পরে সেগুলো আবার পাঠান।`,
  subtitlesButton: "📝 সাবটাইটেল",
  subtitlesBack: "⬅️ কোয়ালিটিতে ফিরে যান",
  subtitlesAuto: "অটো",
  subtitlesChoose: "সাবটাইটেলের ভাষা বেছে নিন",
  subtitlesPreparing: "📝 সাবটাইটেল তৈরি হচ্ছে...",
  subtitlesFailed: "এই ভাষায় সাবটাইটেল ডাউনলোড করা যায়নি। অন্য ভাষা বেছে দেখুন।",
  subtitlesBusy: "YouTube এখন সাবটাইটেল দিচ্ছে না — কয়েক মিনিট পরে আবার চেষ্টা করুন।",
  playlistFound: (title, count) =>
    `📃 প্লেলিস্ট${title ? ` "${title.slice(0, 150)}"` : ""}: ${count}টি ভিডিও।\nএকে একে ডাউনলোড করব। কোন ফরম্যাটে?`,
  playlistStdButton: "🎬 720p",
  playlistHdButton: "🎬 সেরা কোয়ালিটি",
  playlistAudioButton: "🎵 শুধু অডিও (mp3)",
  playlistNoButton: "✖️ না, ধন্যবাদ",
  playlistQueued: (count) =>
    `📃 প্লেলিস্ট থেকে সারিতে রাখা ভিডিও: ${count}। একে একে পাঠাব। নিচের বাটন বা /stop দিয়ে থামান।`,
  playlistFailed: "প্লেলিস্টটি খোলা যায়নি — হয়তো এটি প্রাইভেট। একটি নির্দিষ্ট ভিডিওর লিংক পাঠান।",
  stopButton: "⏹ থামান",
  stopped: (dropped) => `⏹ থামানো হয়েছে।${dropped ? ` সারি থেকে সরানো লিংক: ${dropped}।` : ""}`,
  nothingToStop: "এখন কিছুই ডাউনলোড হচ্ছে না।",
  languageChoose: "🌐 বটের ভাষা বেছে নিন। \"অটো\" আপনার Telegram-এর ভাষা অনুসরণ করে।",
  languageChooseGroup: "🌐 এই গ্রুপে বটের উত্তরের ভাষা। \"অটো\" — প্রত্যেক সদস্যের Telegram-এর ভাষা।",
  languageAuto: "অটো — Telegram-এর মতো",
  languageAutoGroup: "অটো — প্রত্যেক সদস্যের নিজের",
  languageSaved: (name) => `✅ বটের ভাষা: ${name}। /language দিয়ে বদলান।`,
  languageSavedAuto: "✅ বট আপনার Telegram-এর ভাষা অনুসরণ করবে। /language দিয়ে বদলান।",
  settingsLanguageButton: (name) => `🌐 ভাষা: ${name ?? "অটো"}`,
  settingsBack: "⬅️ সেটিংসে ফিরে যান",
};

const ur: Messages = {
  start: "السلام علیکم! مجھے YouTube، TikTok، Instagram، Facebook، Twitter/X، Vimeo، VK، Rutube، OK.ru، Pinterest یا Threads سے کسی ویڈیو کا لنک بھیجیں — میں اسے ڈاؤن لوڈ کرنے میں آپ کی مدد کروں گا۔\n\n✨ کوالٹی کی کوئی حد نہیں: پلیٹ فارم جو بھی کوالٹی دیتا ہے، 4K تک، وہ آپ کو ملے گی — بشرطیکہ فائل 2 GB میں آ جائے، جو بوٹس کے لیے Telegram کی حد ہے۔ یہاں کوئی پیڈ فیچر نہیں ہے۔\n\nبالکل مفت: نہ سبسکرپشن، نہ اشتہارات، نہ ان ایپ خریداری۔\n\n🧩 کمپیوٹر پر ڈاؤن لوڈ کر رہے ہیں؟ براؤزر ایکسٹینشن انسٹال کریں — ڈاؤن لوڈ کا بٹن سیدھا ویڈیو کے صفحے پر نظر آئے گا: videoner.download/ur/extension\n\n👥 مجھے کسی گروپ میں شامل کریں، وہاں لوگ جو لنک شیئر کریں گے میں ان کی ویڈیوز بھیج دوں گا۔\n\n⚡ کوالٹی چننے کا مرحلہ چھوڑیں: صرف آواز (mp3) کے لیے لنک کے بعد -audio لکھیں، یا بہترین کوالٹی کے لیے -hd لکھیں۔\n\n📣 پروجیکٹ کی خبریں: ‎@videonerdownload\n\n🌐 بوٹ کی زبان: ‎/language",
  notLink: "یہ لنک نہیں لگتا۔ مجھے کسی ویڈیو کا لنک بھیجیں۔",
  inviteGreeting: "السلام علیکم! میں Videoner ہوں — YouTube، TikTok، Instagram اور دوسرے پلیٹ فارمز سے ویڈیوز مفت ڈاؤن لوڈ کرتا ہوں۔ جو ویڈیو کسی نے آپ کے ساتھ شیئر کی ہے، وہ تیار کر رہا ہوں 👇",
  inviteNotFound: "اس دعوتی لنک کے لیے کوئی ویڈیو نہیں ملی۔ مجھے ویڈیو کا لنک بھیجیں، میں اسے ڈاؤن لوڈ کر دوں گا۔",
  inviteUnavailable: "اس لنک سے ویڈیو نہیں کھل سکی — سروس ابھی جواب نہیں دے رہی۔ ایک منٹ بعد یہی لنک دوبارہ کھولیں۔",
  fetchingInfo: "🔍 ویڈیو کی معلومات حاصل کی جا رہی ہیں...",
  audioOnlyButton: "🎵 صرف آڈیو (mp3)",
  photoButton: "📷 تصاویر ڈاؤن لوڈ کریں",
  slideshowButton: "🎞 سلائیڈ شو (ویڈیو)",
  galleryButton: "📷+🎞 تصاویر اور سلائیڈ شو",
  chooseQuality: (title, duration) => `«${title}»${duration ? `\n⏱ ${duration}` : ""}\n\nکوالٹی منتخب کریں:`,
  sessionExpired: "سیشن ختم ہو گیا — لنک دوبارہ بھیجیں",
  downloading: "⏬ ڈاؤن لوڈ ہو رہا ہے، اس میں چند منٹ لگ سکتے ہیں...",
  downloadFailed: "ڈاؤن لوڈ ناکام ہو گیا",
  downloadProgress: (percent, eta, done) =>
    `⏬ ڈاؤن لوڈ ہو رہا ہے: ${percent}%${eta ? ` · ${eta} باقی` : ""}${done ? `\n${done}` : ""}`,
  downloadFinishing: "⚙️ تقریباً ہو گیا — فائل تیار کی جا رہی ہے...",
  converting: (percent) => `⚙️ کنورٹ ہو رہا ہے: ${percent}%`,
  etaUnderMinute: "ایک منٹ سے کم",
  etaMinutes: (minutes) => `~${minutes} منٹ`,
  etaHours: (hours, minutes) => `~${hours} گھنٹے${minutes ? ` ${minutes} منٹ` : ""}`,
  downloadTimeout: "ڈاؤن لوڈ میں بہت زیادہ وقت لگ رہا ہے — لگتا ہے ویڈیو بہت بھاری ہے۔ کم کوالٹی آزمائیں۔",
  downloadInterrupted: "⚠️ اپ ڈیٹ کے لیے بوٹ ری اسٹارٹ ہو رہا ہے — آپ کا ڈاؤن لوڈ رک گیا۔ براہ کرم ایک منٹ بعد لنک دوبارہ بھیجیں۔",
  fileTooBig: (mb, url) =>
    `فائل بڑی بن گئی (${mb} MB) — Telegram بوٹ کو اسے بھیجنے نہیں دیتا۔\nیہاں سے ڈاؤن لوڈ کریں: ${url}`,
  sendingFile: "📤 فائل بھیجی جا رہی ہے...",
  sendingAlbum: (count) => `📤 اس پوسٹ میں کئی فائلیں ہیں (${count}) — انہیں البم کی شکل میں بھیج رہا ہوں...`,
  failedPrefix: "❌ ناکام: ",
  fileCaption: (title, sourceUrl, shareUrl, description) =>
    composeCaption(
      title,
      description,
      `ماخذ: ${sourceUrl}\n` +
        "ویڈیو کے تمام حقوق اس کے تخلیق کار کے پاس ہیں۔\n" +
        "مفت ڈاؤن لوڈ بذریعہ ‎@VideonerBot",
      `📣 پروجیکٹ کی خبریں: ${NEWS_CHANNEL}`,
      shareUrl && `🔗 شیئر کریں: ${shareUrl}`,
    ),
  subscribeRequired: (channel) =>
    `ڈاؤن لوڈ کرنے کے لیے براہ کرم ہمارا چینل ${channel} سبسکرائب کریں — بس یہی ایک شرط ہے، سروس مفت ہی رہے گی۔\n\n` +
    "سبسکرائب کریں اور «میں نے سبسکرائب کر لیا» دبائیں۔",
  openChannelButton: "📣 چینل کھولیں",
  checkSubscriptionButton: "میں نے سبسکرائب کر لیا",
  subscribeThanks: "شکریہ! اب مجھے کسی ویڈیو کا لنک بھیجیں۔",
  subscribeThanksResuming: "شکریہ! آپ کا لنک ابھی لے رہا ہوں۔",
  subscribeStillMissing: "مجھے ابھی تک آپ کی سبسکرپشن نظر نہیں آ رہی۔ سبسکرائب کریں اور دوبارہ دبائیں۔",
  channelNotice: (channel) => `\n\nاس پوسٹ کا لنک ${channel} میں شائع ہو گا — گمنام طور پر، آپ کے نام کے بغیر۔`,
  channelPost: (title, url) =>
    (title ? `🎬 ${title.slice(0, 200)}\n\n` : "") +
    `${url}\n\n` +
    "یہ اور کوئی بھی دوسری ویڈیو مفت ڈاؤن لوڈ کریں: ‎@VideonerBot",
  errorStoryNeedsId:
    "کسی مخصوص اسٹوری کا لنک بھیجیں: اسے Instagram ایپ میں کھولیں اور شیئر ← لنک کاپی کریں پر ٹیپ کریں۔",
  errorInstagramStory:
    "Instagram اسٹوریز صرف سائن ان کیے ہوئے لوگوں کو نظر آتی ہیں۔",
  errorLoginRequired:
    "یہ پوسٹ سائن ان کیے بغیر دستیاب نہیں: پلیٹ فارم اسے صرف " +
    "لاگ ان صارفین کو دکھاتا ہے۔ ایسا پرائیویٹ پوسٹس، عمر کی پابندی والے مواد اور " +
    "محدود ناظرین کے لیے شیئر کی گئی پوسٹس کے ساتھ ہوتا ہے۔\n\n" +
    "پبلک پوسٹس بغیر کسی مسئلے کے ڈاؤن لوڈ ہو جاتی ہیں — کوئی دوسرا لنک آزمائیں۔",
  errorUnsupportedPlatform:
    "یہ لنک پہچانا نہیں جا سکا — یقینی بنائیں کہ یہ YouTube، TikTok، Instagram، Facebook، Twitter/X، Vimeo، VK، Rutube، OK.ru، Pinterest یا Threads کی ویڈیو کا براہ راست لنک ہے۔",
  errorFileTooLarge: "فائل 2 GB سے بڑی ہے — Telegram بوٹس کو اس سے بڑی فائلیں بھیجنے نہیں دیتا۔ اسے ویب سائٹ سے یا براؤزر ایکسٹینشن سے ڈاؤن لوڈ کریں — بٹن نیچے ہیں۔ یا لنک دوبارہ بھیجیں اور کم کوالٹی منتخب کریں۔",
  siteButton: "🌐 ویب سائٹ پر ڈاؤن لوڈ کریں",
  qualitiesHiddenBySize: (limit) =>
    `\n\n⚖️ ${limit} سے بھاری کوالٹیز چھپا دی گئی ہیں: Telegram بوٹس کو اس سے بڑی فائلیں بھیجنے نہیں دیتا۔ آپ انہیں ویب سائٹ سے یا براؤزر ایکسٹینشن سے ڈاؤن لوڈ کر سکتے ہیں — بٹن نیچے ہیں۔`,
  videoTooBigForTelegram: (smallest) =>
    `\n\n⚖️ یہ ویڈیو سب سے کم کوالٹی میں بھی Telegram کے لیے بہت بھاری ہے (~${smallest}): Telegram بوٹس کو 2 GB سے بڑی فائلیں بھیجنے نہیں دیتا۔ یہاں آپ صرف آڈیو لے سکتے ہیں؛ ویڈیو — ویب سائٹ سے یا براؤزر ایکسٹینشن سے (بٹن نیچے ہیں)۔`,
  errorFormatUnavailable: "اس ویڈیو کے لیے یہ کوالٹی دستیاب نہیں۔ لنک دوبارہ بھیجیں — میں تازہ فہرست دکھا دوں گا۔",
  errorNoVideoContent: "اس لنک میں ڈاؤن لوڈ کرنے کے لیے کوئی ویڈیو نہیں — لگتا ہے پوسٹ میں صرف تصاویر ہیں۔",
  errorRegionBlocked:
    "یہ ویڈیو تخلیق کار کے ملک سے باہر بلاک ہے — پلیٹ فارم اسے " +
    "ہمارے سرور کو نہیں دیتا۔ اس کا کوئی حل نہیں: پابندی ان کی طرف سے ہے۔" +
    "\n\nدوسرے لنک معمول کے مطابق ڈاؤن لوڈ ہوتے ہیں۔",
  errorRateLimited: "ایک ساتھ بہت زیادہ لنک — تھوڑا انتظار کریں اور دوبارہ بھیجیں۔",
  errorYoutubeDailyLimit: (gb) => `آپ نے پچھلے 24 گھنٹوں میں YouTube سے ${gb} GB سے زیادہ ڈاؤن لوڈ کیا ہے — یہ فی شخص بوٹ کی روزانہ حد ہے۔ حساب پچھلے 24 گھنٹوں کا ہوتا ہے، اس لیے کچھ دیر بعد آپ YouTube کی نئی ویڈیوز ڈاؤن لوڈ کر سکیں گے۔ دوسرے پلیٹ فارمز معمول کے مطابق کام کرتے ہیں۔`,
  playlistStoppedByLimit: (dropped) => `⏹ پلے لسٹ روک دی گئی: YouTube کی روزانہ حد پوری ہو گئی۔ ڈاؤن لوڈ نہ ہونے والی ویڈیوز: ${dropped}۔ پلے لسٹ کا لنک بعد میں دوبارہ بھیجیں۔`,
  errorPlatformRefused:
    "پلیٹ فارم نے یہ ویڈیو ہمارے سرور کو نہیں دی۔ ایسا پرائیویٹ " +
    "یا عمر کی پابندی والی پوسٹس کے ساتھ ہوتا ہے، اور کبھی کبھی پلیٹ فارم کچھ دیر کے لیے " +
    "رسائی محدود کر دیتا ہے۔ چند منٹ بعد دوبارہ کوشش کریں۔",
  errorThreadsNoMedia:
    "اس Threads پوسٹ میں کوئی ویڈیو یا تصویر نظر نہیں آ رہی۔ یا تو یہ صرف ٹیکسٹ والی پوسٹ ہے، یا " +
    "Threads اپنا میڈیا صرف سائن ان صارفین کو دکھاتا ہے — ایسی پوسٹس لاگ ان کیے بغیر ڈاؤن لوڈ نہیں ہو سکتیں۔",
  extensionHint:
    "\n\n💻 آپ اسے کمپیوٹر پر Videoner براؤزر ایکسٹینشن سے ڈاؤن لوڈ کر سکتے ہیں: " +
    "یہ پلیٹ فارم پر آپ کے اپنے سائن ان سے ڈاؤن لوڈ کرتی ہے، اور کوئی پاس ورڈ یا کوکیز آپ کے براؤزر سے باہر نہیں جاتیں۔",
  privateConnectHint: (platform, withExtension) =>
    `\n\n🔑 ایسی پوسٹس ڈاؤن لوڈ کرنے کے لیے اپنا ${platform} اکاؤنٹ بوٹ سے جوڑیں — صرف ایک بار۔ اس کے بعد بوٹ وہ سب ڈاؤن لوڈ کرے گا جو آپ دیکھ سکتے ہیں: پرائیویٹ پوسٹس، ریلز اور اسٹوریز، فون سے بھی۔ نیچے والا بٹن طریقہ بتاتا ہے۔${withExtension ? "\n\n💻 یا اسے کمپیوٹر پر Videoner براؤزر ایکسٹینشن سے ڈاؤن لوڈ کریں۔" : ""}`,
  privateReconnectHint: (platform, withExtension) =>
    `\n\n⚠️ آپ کا جوڑا ہوا ${platform} اکاؤنٹ یہ پوسٹ نہیں کھول سکا۔ ہو سکتا ہے لاگ ان نے کام کرنا چھوڑ دیا ہو — اکاؤنٹ دوبارہ جوڑیں۔ یا اس اکاؤنٹ کو پوسٹ تک رسائی نہیں ہے۔${withExtension ? "\n\n💻 آپ اسے کمپیوٹر پر Videoner براؤزر ایکسٹینشن سے بھی ڈاؤن لوڈ کر سکتے ہیں۔" : ""}`,
  connectAccountButton: "🔑 اکاؤنٹ جوڑیں",
  reconnectAccountButton: "🔑 دوبارہ جوڑیں",
  extensionButton: "🧩 ایکسٹینشن سے ڈاؤن لوڈ کریں",
  extensionCommand:
    "🧩 آپ کے براؤزر کے لیے Videoner: ویڈیو کے صفحے پر ہی ڈاؤن لوڈ کا بٹن — YouTube، Instagram، TikTok، VK، آپ کے اکاؤنٹ کی پرائیویٹ ویڈیوز اور GetCourse کے اسباق۔\n\nکمپیوٹر پر Chrome، Edge، Opera، Yandex Browser اور Firefox کے لیے۔",
  extensionPageButton: "🧩 ایکسٹینشن انسٹال کریں",
  addToGroupButton: "👥 گروپ میں شامل کریں",
  newsButton: "📣 پروجیکٹ کی خبریں",
  fileCaptionShort: (title, sourceUrl) =>
    withOptionalLines((title ? `🎬 ${title.slice(0, 200)}\n\n` : "") + sourceUrl, `📣 پروجیکٹ کی خبریں: ${NEWS_CHANNEL}`, undefined),
  sentBy: (name) => `👤 ${name}`,
  groupSettings: (s, canDelete) =>
    "⚙️ اس گروپ کے لیے بوٹ کی سیٹنگز\n\n" +
    `🗑 لنک والا پیغام ڈیلیٹ کریں: ${s.deleteLinks ? "ہاں" : "نہیں"}\n` +
    "ویڈیو بھیجنے کے بعد وہ پیغام ڈیلیٹ ہو جاتا ہے جس میں صرف لنک تھا — چیٹ میں صرف ویڈیو رہ جاتی ہے، شیئر کرنے والے کے نام کے ساتھ۔\n" +
    (s.deleteLinks && !canDelete
      ? "⚠️ میں ابھی پیغامات ڈیلیٹ نہیں کر سکتا: مجھے «پیغامات ڈیلیٹ کریں» کے اختیار کے ساتھ ایڈمن بنائیں۔\n"
      : "") +
    `\n✍️ ویڈیو کے نیچے کیپشن: ${{ full: "مکمل", short: "عنوان اور ماخذ", none: "کوئی کیپشن نہیں" }[s.caption] ?? s.caption}\n` +
    `\n🎞 کوالٹی: ${s.quality === "max" ? "سب سے اعلیٰ جو Telegram قبول کرے" : "اسٹینڈرڈ (720p)"}\n` +
    `\n⏱ لمبی ویڈیوز: ${s.longVideos ? "کسی بھی لمبائی کی" : "صرف 15 منٹ تک"}\n` +
    `\n🔑 کون اپنے اکاؤنٹس جوڑ سکتا ہے (اسٹوریز اور پرائیویٹ پوسٹس کے لیے): ${s.cookiesBy === "all" ? "کوئی بھی ممبر" : "صرف ایڈمنز"}\n` +
    `\n🌐 جواب کی زبان: ${s.language ? langName(s.language) : "ہر ممبر کی اپنی"}\n` +
    "\nسیٹنگز صرف گروپ کے ایڈمنز بدل سکتے ہیں۔",
  settingsDeleteButton: (on) => `🗑 لنکس ڈیلیٹ کریں: ${on ? "ہاں" : "نہیں"}`,
  settingsCaptionButton: (style) => `✍️ کیپشن: ${{ full: "مکمل", short: "مختصر", none: "کوئی نہیں" }[style] ?? style}`,
  settingsQualityButton: (mode) => `🎞 کوالٹی: ${mode === "max" ? "سب سے اعلیٰ" : "720p"}`,
  settingsLongButton: (on) => `⏱ لمبی ویڈیوز: ${on ? "ہاں" : "15 منٹ تک"}`,
  settingsDoneButton: "✅ ہو گیا",
  settingsAdminsOnly: "سیٹنگز صرف گروپ کے ایڈمنز بدل سکتے ہیں۔",
  settingsGroupsOnly: "سیٹنگز گروپس کے لیے ہیں: مجھے کسی گروپ میں شامل کریں اور وہاں ‎/settings بھیجیں۔",
  settingsFailed: "سیٹنگز محفوظ نہیں ہو سکیں، براہ کرم دوبارہ کوشش کریں۔",
  settingsCookiesButton: (by) => `🔑 اکاؤنٹس جوڑنا: ${by === "all" ? "سب" : "ایڈمنز"}`,
  accountsIntro:
    "🔑 جڑے ہوئے اکاؤنٹس\n\nبوٹ وہ چیزیں بھی ڈاؤن لوڈ کر سکتا ہے جو صرف سائن ان لوگوں کو نظر آتی ہیں (Instagram اسٹوریز، پرائیویٹ پوسٹس) — آپ کے اکاؤنٹ کے ذریعے۔ لاگ ان وہیں کام کرتا ہے جہاں آپ نے اسے جوڑا ہے: پرائیویٹ چیٹ میں جوڑا گیا اکاؤنٹ آپ کے ڈاؤن لوڈز کے لیے ہے، ان گروپس میں آپ کے اپنے لنکس سمیت جن کا اپنا کوئی اکاؤنٹ نہیں؛ کسی گروپ سے جوڑا گیا اکاؤنٹ اس کے تمام ممبرز کے کام آتا ہے۔",
  accountsHowTo:
    "جوڑنے کا طریقہ:\n1. سب سے آسان: کمپیوٹر پر Videoner ایکسٹینشن — پلیٹ فارم کی سائٹ پر سائن ان کریں، Videoner کی ونڈو کھولیں، «🔑 اپنا … اکاؤنٹ بوٹ سے جوڑیں» دبائیں اور کوڈ مجھے بھیجیں۔ گروپ کے لیے، اسی گروپ میں ‎/connect CODE بھیجیں۔\n2. یا مجھے cookies.txt فائل (براؤزر سے ایکسپورٹ کی گئی کوکیز) بھیجیں، یا اس کا متن پیغام میں پیسٹ کریں۔\n3. Android فون سے — Firefox اور Cookie-Editor ایڈ آن کے ساتھ: https://videoner.download/ur/blog/android-firefox",
  accountsWarning:
    "⚠️ پلیٹ فارمز خودکار ڈاؤن لوڈز پسند نہیں کرتے اور اکاؤنٹ کو محدود یا بین کر سکتے ہیں۔ بہتر ہے کوئی ثانوی اکاؤنٹ جوڑیں، اپنا مرکزی اکاؤنٹ نہیں۔ کوکیز انکرپٹ کر کے محفوظ کی جاتی ہیں، صرف ڈاؤن لوڈز کے لیے استعمال ہوتی ہیں، اور نیچے دیے گئے بٹنوں سے ہٹائی جا سکتی ہیں۔",
  accountsNone: "ابھی کچھ بھی جڑا ہوا نہیں ہے۔",
  accountsGroupTitle: "🔑 اس گروپ سے جڑے اکاؤنٹس",
  accountsGroupHowTo:
    "پورے گروپ کے لیے اکاؤنٹ جوڑنے کے لیے: Videoner ایکسٹینشن میں «🔑 اپنا … اکاؤنٹ بوٹ سے جوڑیں» بٹن سے کوڈ لیں اور یہاں ‎/connect CODE بھیجیں۔ اگر آپ نے کوئی اکاؤنٹ صرف اپنی پرائیویٹ چیٹ میں جوڑا ہے تو بوٹ یہاں آپ کے اپنے لنکس کے لیے اسے استعمال کرتا ہے۔ آپ کے کنکشنز: ‎@VideonerBot کے ساتھ پرائیویٹ چیٹ میں ‎/accounts۔",
  accountsLine: (platform, where, active) => `• ${platform} — ${where}${active ? "" : " (⚠️ لاگ ان کام نہیں کر رہا)"}`,
  accountsGroupLine: (platform, owner, active) => `• ${platform} — ${owner}${active ? "" : " (⚠️ لاگ ان کام نہیں کر رہا)"}`,
  accountsWhereHere: "پرائیویٹ چیٹ",
  accountsWhereGroup: (title) => `گروپ «${title}»`,
  accountsDeleteButton: (platform, where) => `🗑 ${platform} · ${where}`,
  accountsDeleteAllButton: "🗑 میرے تمام کنکشنز ہٹائیں",
  accountsDeleted: "ہٹا دیا گیا۔",
  accountsDeletedAll: (n) => `ہٹائے گئے کنکشنز: ${n}۔`,
  accountsNotAllowed: "اسے صرف وہ شخص ہٹا سکتا ہے جس نے جوڑا تھا، یا گروپ کا ایڈمن۔",
  connectUsage:
    "یہ بھیجیں: ‎/connect CODE۔ کوڈ آپ کو کمپیوٹر پر Videoner ایکسٹینشن کے «🔑 اپنا … اکاؤنٹ بوٹ سے جوڑیں» بٹن سے ملے گا۔ آپ کے کنکشنز: ‎/accounts۔",
  connectOnlyAdmins: "اس گروپ سے اکاؤنٹس صرف ایڈمنز جوڑ سکتے ہیں (‎/settings دیکھیں)۔",
  connectDone: (platform, where) =>
    `✅ ${platform} ${where} جوڑ دیا گیا۔ اب بوٹ وہ چیزیں بھی ڈاؤن لوڈ کرتا ہے جو صرف سائن ان لوگوں کو نظر آتی ہیں۔ دیکھیں یا ہٹائیں: ‎/accounts۔\n\n⚠️ پلیٹ فارم خودکار ڈاؤن لوڈز کی وجہ سے اکاؤنٹ کو محدود کر سکتا ہے — بہتر ہے کوئی ثانوی اکاؤنٹ استعمال کریں۔`,
  connectWhereGroup: "اس گروپ سے",
  connectWhereHere: "پرائیویٹ چیٹ اور inline موڈ میں آپ کے ڈاؤن لوڈز کے لیے",
  connectCodeNotFound: "کوڈ نہیں ملا یا اس کی میعاد ختم ہو گئی (کوڈ 10 منٹ تک چلتے ہیں)۔ Videoner ایکسٹینشن سے نیا کوڈ لیں۔",
  connectRejectedNoSession: "ان کوکیز میں لاگ ان نہیں ہے۔ پلیٹ فارم کی سائٹ پر سائن ان کریں اور کوکیز دوبارہ ایکسپورٹ کریں۔",
  connectRejectedUnknown: "سپورٹ کیے گئے پلیٹ فارمز کی کوئی کوکیز نہیں ملیں: Instagram، Facebook، YouTube، X، VK، TikTok۔",
  connectUnavailable: "اکاؤنٹس جوڑنے کی سہولت ابھی دستیاب نہیں۔",
  connectFailed: "جوڑا نہیں جا سکا، براہ کرم دوبارہ کوشش کریں۔",
  connectFileTooBig: "فائل بہت بڑی ہے — صرف مطلوبہ سائٹ کی کوکیز ایکسپورٹ کریں۔",
  connectNotAnonymous: "اکاؤنٹ اپنے نام سے جوڑیں، گروپ کی طرف سے گمنام طور پر نہیں: ورنہ ایڈمنز کے کنکشنز آپس میں گڈمڈ ہو جاتے ہیں۔ میں نے کوڈ ختم کر دیا — نیا کوڈ لیں۔",
  connectCodeInGroup:
    "گروپ چیٹ میں بھیجا گیا کنکشن کوڈ دوسرے بھی دیکھ سکتے ہیں — میں نے اسے ختم کر دیا اور پیغام ہٹا دیا۔ نیا کوڈ لیں اور ‎/connect CODE کے ساتھ بھیجیں: اس کمانڈ والا پیغام میں فوراً ڈیلیٹ کر دیتا ہوں۔",
  groupWelcome:
    "👋 السلام علیکم! اس چیٹ میں TikTok، Instagram، YouTube، VK اور دوسرے پلیٹ فارمز کی ویڈیوز کے لنک بھیجیں — میں جواب میں خود ویڈیو بھیجوں گا۔\n\n" +
    "15 منٹ تک کے کلپس میں خود ڈاؤن لوڈ کرتا ہوں، کسی کمانڈ کی ضرورت نہیں، اور باقی وقت خاموش رہتا ہوں۔\n\n⚙️ گروپ کے ایڈمنز ‎/settings سے میری سیٹنگز بدل سکتے ہیں: لنک والے پیغامات ڈیلیٹ کرنا، کیپشن کا انداز، کوالٹی، لمبی ویڈیوز اور زبان۔\n\n⚡ آواز کے لیے لنک کے بعد -audio لکھیں، یا بہترین کوالٹی کے لیے -hd۔\n\n📣 پروجیکٹ کی خبریں: ‎@videonerdownload",
  errorTooLong: "ویڈیو بہت لمبی ہے — ہم ابھی اتنی لمبی ویڈیوز ڈاؤن لوڈ نہیں کر سکتے۔",
  errorUnknown: "یہ ویڈیو ڈاؤن لوڈ نہیں ہو سکی۔ کچھ دیر بعد دوبارہ کوشش کریں یا کوئی دوسرا لنک بھیجیں۔",
  inlineHintButton: "بوٹ کو لنک بھیجیں",
  inlineResultTitle: "⬇️ ویڈیو ڈاؤن لوڈ کریں",
  inlineResultDescription: "ویڈیو اسی چیٹ میں بھیج دی جائے گی",
  inlinePlaceholder: "⏬ ڈاؤن لوڈ ہو رہا ہے، اس میں چند منٹ لگ سکتے ہیں...",
  inlineOpenBot: "بوٹ کھولیں",
  inlineOnlySingleVideo:
    "یہ موڈ صرف ایک ویڈیو بھیجتا ہے۔ کئی فائلوں والی پوسٹس یا تصاویر کے لیے، لنک بوٹ کو پرائیویٹ چیٹ میں بھیجیں۔",
  inlineSubscribeRequired: (channel: string) =>
    `ڈاؤن لوڈ کرنے کے لیے ${channel} سبسکرائب کریں اور دوبارہ کوشش کریں۔`,
  inlineRateLimited: "ایک ساتھ بہت زیادہ درخواستیں۔ ایک منٹ انتظار کریں اور دوبارہ کوشش کریں۔",
  queueRest: (count) => `\n\n📋 قطار میں باقی لنکس: ${count}۔ اس کے بعد میں انہیں ایک ایک کر کے دکھاؤں گا۔`,
  queuedOne: (position) =>
    `📋 لنک قطار میں شامل ہو گیا، نمبر ${position}۔ پہلے موجودہ کام ختم کر لیں — پھر میں اس کے لیے کوالٹی کا انتخاب دکھاؤں گا۔`,
  queuedMany: (added, waiting) =>
    `📋 قطار میں شامل کیے گئے لنکس: ${added}۔ کل انتظار میں: ${waiting}۔ موجودہ کام کے بعد میں انہیں ایک ایک کر کے دکھاؤں گا۔`,
  queueDuplicates: (count) =>
    count === 1
      ? "یہ لنک پہلے سے قطار میں ہے — اسے دوبارہ شامل نہیں کر رہا۔"
      : `جو لنکس پہلے سے قطار میں ہیں وہ دوبارہ شامل نہیں کیے جاتے (دہرائے گئے: ${count})۔`,
  queueFull: (limit, rejected) =>
    `قطار میں زیادہ سے زیادہ ${limit} لنکس آ سکتے ہیں — اضافی لنکس شامل نہیں کیے گئے (${rejected})۔ قطار آگے بڑھنے پر انہیں بھیجیں۔`,
  skipButton: "✖️ ڈاؤن لوڈ نہ کریں",
  skipped: "⏭ یہ لنک چھوڑ دیا۔",
  chooseTimedOut: "⌛ 30 منٹ میں کوئی کوالٹی منتخب نہیں کی گئی — یہ لنک چھوڑ رہا ہوں۔",
  queueLostOnRestart: (count) =>
    `⚠️ اپ ڈیٹ کے لیے بوٹ ری اسٹارٹ ہو رہا ہے — قطار خالی ہو گئی (لنکس: ${count})۔ براہ کرم ایک منٹ بعد انہیں دوبارہ بھیجیں۔`,
  subtitlesButton: "📝 سب ٹائٹلز",
  subtitlesBack: "⬅️ کوالٹی پر واپس",
  subtitlesAuto: "خودکار",
  subtitlesChoose: "سب ٹائٹلز کی زبان منتخب کریں",
  subtitlesPreparing: "📝 سب ٹائٹلز تیار ہو رہے ہیں...",
  subtitlesFailed: "اس زبان میں سب ٹائٹلز ڈاؤن لوڈ نہیں ہو سکے۔ کوئی دوسری زبان آزمائیں۔",
  subtitlesBusy: "YouTube ابھی سب ٹائٹلز نہیں دے رہا — چند منٹ بعد دوبارہ کوشش کریں۔",
  playlistFound: (title, count) =>
    `📃 پلے لسٹ${title ? ` «${title.slice(0, 150)}»` : ""}: ${count} ویڈیوز۔\nمیں انہیں ایک ایک کر کے ڈاؤن لوڈ کروں گا۔ کون سا فارمیٹ؟`,
  playlistStdButton: "🎬 720p",
  playlistHdButton: "🎬 بہترین کوالٹی",
  playlistAudioButton: "🎵 صرف آڈیو (mp3)",
  playlistNoButton: "✖️ نہیں، شکریہ",
  playlistQueued: (count) =>
    `📃 پلے لسٹ سے قطار میں شامل ویڈیوز: ${count}۔ میں انہیں ایک ایک کر کے بھیجوں گا۔ روکنے کے لیے نیچے والا بٹن یا ‎/stop۔`,
  playlistFailed: "پلے لسٹ نہیں کھل سکی — شاید یہ پرائیویٹ ہے۔ کسی ایک ویڈیو کا لنک بھیجیں۔",
  stopButton: "⏹ روکیں",
  stopped: (dropped) => `⏹ روک دیا گیا۔${dropped ? ` قطار سے ہٹائے گئے لنکس: ${dropped}۔` : ""}`,
  nothingToStop: "ابھی کچھ بھی ڈاؤن لوڈ نہیں ہو رہا۔",
  languageChoose: "🌐 بوٹ کی زبان منتخب کریں۔ «خودکار» آپ کے Telegram کی زبان کے مطابق چلتا ہے۔",
  languageChooseGroup: "🌐 اس گروپ میں بوٹ کے جوابات کی زبان۔ «خودکار» — ہر ممبر کے Telegram کی زبان۔",
  languageAuto: "خودکار — Telegram کے مطابق",
  languageAutoGroup: "خودکار — ہر ممبر کی اپنی",
  languageSaved: (name) => `✅ بوٹ کی زبان: ${name}۔ اسے ‎/language سے بدلیں۔`,
  languageSavedAuto: "✅ بوٹ آپ کے Telegram کی زبان کے مطابق چلتا ہے۔ اسے ‎/language سے بدلیں۔",
  settingsLanguageButton: (name) => `🌐 زبان: ${name ?? "خودکار"}`,
  settingsBack: "⬅️ سیٹنگز پر واپس",
};

const pl: Messages = {
  start: "Cześć! Wyślij mi link do filmu z YouTube, TikToka, Instagrama, Facebooka, Twittera/X, Vimeo, VK, Rutube, OK.ru, Pinteresta lub Threads — pomogę ci go pobrać.\n\n✨ Bez limitów jakości: dostajesz wszystko, co oferuje platforma, aż do 4K — o ile plik zmieści się w 2 GB, czyli limicie Telegrama dla botów. Płatnych funkcji tu nie ma.\n\nCałkowicie za darmo: bez subskrypcji, bez reklam, bez zakupów w aplikacji.\n\n🧩 Pobierasz na komputerze? Zainstaluj rozszerzenie do przeglądarki — przycisk Pobierz pojawi się bezpośrednio na stronie z filmem: videoner.download/pl/extension\n\n👥 Dodaj mnie do grupy, a będę wysyłać filmy z linków, które ludzie tam udostępniają.\n\n⚡ Bez wybierania jakości: dopisz -audio po linku, żeby dostać sam dźwięk (mp3), albo -hd, żeby dostać najlepszą jakość.\n\n📣 Nowości projektu: @videonerdownload\n\n🌐 Język bota: /language",
  notLink: "To nie wygląda na link. Wyślij mi link do filmu.",
  inviteGreeting: "Cześć! Jestem Videoner — za darmo pobieram filmy z YouTube, TikToka, Instagrama i innych platform. Przygotowuję film, który ktoś ci udostępnił 👇",
  inviteNotFound: "Nie znalazłem filmu dla tego linku z zaproszeniem. Wyślij mi link do filmu, a go pobiorę.",
  inviteUnavailable: "Nie udało się otworzyć filmu z tego linku — usługa w tej chwili nie odpowiada. Otwórz ten sam link ponownie za minutę.",
  fetchingInfo: "🔍 Pobieram informacje o filmie...",
  audioOnlyButton: "🎵 Tylko dźwięk (mp3)",
  photoButton: "📷 Pobierz zdjęcia",
  slideshowButton: "🎞 Pokaz slajdów (wideo)",
  galleryButton: "📷+🎞 Zdjęcia i pokaz slajdów",
  chooseQuality: (title, duration) => `„${title}”${duration ? `\n⏱ ${duration}` : ""}\n\nWybierz jakość:`,
  sessionExpired: "Sesja wygasła — wyślij link jeszcze raz",
  downloading: "⏬ Pobieram, to może potrwać kilka minut...",
  downloadFailed: "pobieranie nie powiodło się",
  downloadProgress: (percent, eta, done) =>
    `⏬ Pobieranie: ${percent}%${eta ? ` · zostało ${eta}` : ""}${done ? `\n${done}` : ""}`,
  downloadFinishing: "⚙️ Prawie gotowe — składam plik...",
  converting: (percent) => `⚙️ Konwersja: ${percent}%`,
  etaUnderMinute: "mniej niż minuta",
  etaMinutes: (minutes) => `~${minutes} min`,
  etaHours: (hours, minutes) => `~${hours} godz.${minutes ? ` ${minutes} min` : ""}`,
  downloadTimeout: "pobieranie trwa zbyt długo — film wydaje się bardzo ciężki. Spróbuj niższej jakości.",
  downloadInterrupted: "⚠️ Bot uruchamia się ponownie po aktualizacji — twoje pobieranie zostało przerwane. Wyślij link jeszcze raz za minutę.",
  fileTooBig: (mb, url) =>
    `Plik okazał się duży (${mb} MB) — Telegram nie pozwala botowi go wysłać.\nPobierz go tutaj: ${url}`,
  sendingFile: "📤 Wysyłam plik...",
  sendingAlbum: (count) => `📤 Ten post ma kilka plików (${count}) — wysyłam je jako album...`,
  failedPrefix: "❌ Nie udało się: ",
  fileCaption: (title, sourceUrl, shareUrl, description) =>
    composeCaption(
      title,
      description,
      `Źródło: ${sourceUrl}\n` +
        "Wszelkie prawa do filmu należą do jego autora.\n" +
        "Pobrano za darmo przez @VideonerBot",
      `📣 Nowości projektu: ${NEWS_CHANNEL}`,
      shareUrl && `🔗 Udostępnij: ${shareUrl}`,
    ),
  subscribeRequired: (channel) =>
    `Aby pobierać, zasubskrybuj nasz kanał ${channel} — to jedyny warunek, usługa pozostaje darmowa.\n\n` +
    "Zasubskrybuj i naciśnij „Subskrybuję”.",
  openChannelButton: "📣 Otwórz kanał",
  checkSubscriptionButton: "Subskrybuję",
  subscribeThanks: "Dzięki! Teraz wyślij mi link do filmu.",
  subscribeThanksResuming: "Dzięki! Już biorę się za twój link.",
  subscribeStillMissing: "Nie widzę jeszcze subskrypcji. Zasubskrybuj i naciśnij ponownie.",
  channelNotice: (channel) => `\n\nLink do tego posta pojawi się na kanale ${channel} — anonimowo, bez twojego imienia.`,
  channelPost: (title, url) =>
    (title ? `🎬 ${title.slice(0, 200)}\n\n` : "") +
    `${url}\n\n` +
    "Pobierz ten i każdy inny film za darmo: @VideonerBot",
  errorStoryNeedsId:
    "wyślij link do konkretnej relacji: otwórz ją w aplikacji Instagram i stuknij Udostępnij → Kopiuj link.",
  errorInstagramStory:
    "Relacje na Instagramie widzą tylko zalogowane osoby.",
  errorLoginRequired:
    "Ten post nie jest dostępny bez logowania: platforma pokazuje go tylko " +
    "zalogowanym użytkownikom. Tak bywa z prywatnymi postami, treściami z ograniczeniem wiekowym " +
    "i postami udostępnionymi ograniczonemu gronu.\n\n" +
    "Publiczne posty pobierają się bez problemu — spróbuj innego linku.",
  errorUnsupportedPlatform:
    "Nie rozpoznaję tego linku — upewnij się, że to bezpośredni link do filmu z YouTube, TikToka, Instagrama, Facebooka, Twittera/X, Vimeo, VK, Rutube, OK.ru, Pinteresta lub Threads.",
  errorFileTooLarge: "plik jest większy niż 2 GB — Telegram nie pozwala botom wysyłać większych plików. Pobierz go na stronie lub przez rozszerzenie do przeglądarki — przyciski poniżej. Albo wyślij link ponownie i wybierz niższą jakość.",
  siteButton: "🌐 Pobierz na stronie",
  qualitiesHiddenBySize: (limit) =>
    `\n\n⚖️ Jakości cięższe niż ${limit} są ukryte: Telegram nie pozwala botom wysyłać większych plików. Możesz je pobrać na stronie lub przez rozszerzenie do przeglądarki — przyciski poniżej.`,
  videoTooBigForTelegram: (smallest) =>
    `\n\n⚖️ Ten film jest za ciężki dla Telegrama nawet w najniższej jakości (~${smallest}): Telegram nie pozwala botom wysyłać plików powyżej 2 GB. Tutaj możesz pobrać tylko dźwięk; film — na stronie lub przez rozszerzenie do przeglądarki (przyciski poniżej).`,
  errorFormatUnavailable: "Ta jakość nie jest dostępna dla tego filmu. Wyślij link ponownie — pokażę aktualną listę.",
  errorNoVideoContent: "Pod tym linkiem nie ma filmu do pobrania — wygląda na to, że post zawiera tylko zdjęcia.",
  errorRegionBlocked:
    "Ten film jest zablokowany poza krajem autora — platforma nie udostępnia go " +
    "naszemu serwerowi. Nie da się tego obejść: ograniczenie jest po ich stronie." +
    "\n\nInne linki pobierają się normalnie.",
  errorRateLimited: "Za dużo linków z rzędu — odczekaj chwilę i wyślij ponownie.",
  errorYoutubeDailyLimit: (gb) => `w ciągu ostatnich 24 godzin twoje pobrania z YouTube przekroczyły ${gb} GB — to dzienny limit bota na osobę. Liczą się ostatnie 24 godziny, więc nowe filmy z YouTube pobierzesz trochę później. Inne platformy działają normalnie.`,
  playlistStoppedByLimit: (dropped) => `⏹ Playlista zatrzymana: osiągnięto dzienny limit YouTube. Niepobrane filmy: ${dropped}. Wyślij link do playlisty ponownie później.`,
  errorPlatformRefused:
    "platforma nie udostępniła tego filmu naszemu serwerowi. Tak bywa z prywatnymi " +
    "postami lub treściami z ograniczeniem wiekowym, a czasem platforma po prostu ogranicza dostęp " +
    "na jakiś czas. Spróbuj ponownie za kilka minut.",
  errorThreadsNoMedia:
    "w tym poście na Threads nie widać filmu ani zdjęcia. Albo to post tylko z tekstem, albo " +
    "Threads pokazuje jego multimedia tylko zalogowanym — takich postów nie da się pobrać bez logowania.",
  extensionHint:
    "\n\n💻 Możesz go pobrać na komputerze przez rozszerzenie Videoner do przeglądarki: " +
    "pobiera ono przy użyciu twojego własnego logowania na platformie, a żadne hasło ani pliki cookie nie opuszczają twojej przeglądarki.",
  privateConnectHint: (platform, withExtension) =>
    `\n\n🔑 Aby pobierać takie posty, połącz swoje konto ${platform} z botem — jednorazowo. Potem bot pobiera wszystko, co możesz zobaczyć: prywatne posty, rolki i relacje, także z telefonu. Przycisk poniżej pokazuje, jak to zrobić.${withExtension ? "\n\n💻 Albo pobierz to na komputerze przez rozszerzenie Videoner do przeglądarki." : ""}`,
  privateReconnectHint: (platform, withExtension) =>
    `\n\n⚠️ Twoje połączone konto ${platform} nie mogło otworzyć tego posta. Logowanie mogło przestać działać — połącz konto ponownie. Albo to konto nie ma dostępu do posta.${withExtension ? "\n\n💻 Możesz to też pobrać na komputerze przez rozszerzenie Videoner do przeglądarki." : ""}`,
  connectAccountButton: "🔑 Połącz konto",
  reconnectAccountButton: "🔑 Połącz ponownie",
  extensionButton: "🧩 Pobierz przez rozszerzenie",
  extensionCommand:
    "🧩 Videoner do twojej przeglądarki: przycisk Pobierz bezpośrednio na stronie z filmem — YouTube, Instagram, TikTok, VK, prywatne filmy z twojego konta i lekcje GetCourse.\n\nDla Chrome, Edge, Opery, Yandex Browser i Firefoksa na komputerze.",
  extensionPageButton: "🧩 Zainstaluj rozszerzenie",
  addToGroupButton: "👥 Dodaj do grupy",
  newsButton: "📣 Nowości projektu",
  fileCaptionShort: (title, sourceUrl) =>
    withOptionalLines((title ? `🎬 ${title.slice(0, 200)}\n\n` : "") + sourceUrl, `📣 Nowości projektu: ${NEWS_CHANNEL}`, undefined),
  sentBy: (name) => `👤 ${name}`,
  groupSettings: (s, canDelete) =>
    "⚙️ Ustawienia bota w tej grupie\n\n" +
    `🗑 Usuwanie wiadomości z linkiem: ${s.deleteLinks ? "tak" : "nie"}\n` +
    "Po wysłaniu filmu wiadomość zawierająca tylko link zostaje usunięta — na czacie zostaje sam film z imieniem osoby, która go udostępniła.\n" +
    (s.deleteLinks && !canDelete
      ? "⚠️ Nie mogę teraz usuwać wiadomości: zrób mnie administratorem z uprawnieniem „Usuwanie wiadomości”.\n"
      : "") +
    `\n✍️ Podpis pod filmem: ${{ full: "pełny", short: "tytuł i źródło", none: "bez podpisu" }[s.caption] ?? s.caption}\n` +
    `\n🎞 Jakość: ${s.quality === "max" ? "najwyższa, jaką przyjmie Telegram" : "standardowa (720p)"}\n` +
    `\n⏱ Długie filmy: ${s.longVideos ? "dowolna długość" : "tylko do 15 minut"}\n` +
    `\n🔑 Kto może łączyć swoje konta (dla relacji i prywatnych postów): ${s.cookiesBy === "all" ? "każdy członek" : "tylko administratorzy"}\n` +
    `\n🌐 Język odpowiedzi: ${s.language ? langName(s.language) : "własny każdego członka"}\n` +
    "\nUstawienia mogą zmieniać tylko administratorzy grupy.",
  settingsDeleteButton: (on) => `🗑 Usuwanie linków: ${on ? "tak" : "nie"}`,
  settingsCaptionButton: (style) => `✍️ Podpis: ${{ full: "pełny", short: "krótki", none: "brak" }[style] ?? style}`,
  settingsQualityButton: (mode) => `🎞 Jakość: ${mode === "max" ? "najwyższa" : "720p"}`,
  settingsLongButton: (on) => `⏱ Długie filmy: ${on ? "tak" : "do 15 min"}`,
  settingsDoneButton: "✅ Gotowe",
  settingsAdminsOnly: "Ustawienia mogą zmieniać tylko administratorzy grupy.",
  settingsGroupsOnly: "Ustawienia są dla grup: dodaj mnie do grupy i wyślij tam /settings.",
  settingsFailed: "Nie udało się zapisać ustawień, spróbuj ponownie.",
  settingsCookiesButton: (by) => `🔑 Łączenie kont: ${by === "all" ? "wszyscy" : "administratorzy"}`,
  accountsIntro:
    "🔑 Połączone konta\n\nBot może pobierać to, co widzą tylko zalogowane osoby (relacje na Instagramie, prywatne posty) — przez twoje konto. Logowanie działa tam, gdzie zostało połączone: to w prywatnym czacie obsługuje twoje pobrania, także twoje własne linki w grupach, które nie mają własnego konta; to połączone z grupą obsługuje wszystkich jej członków.",
  accountsHowTo:
    "Jak połączyć:\n1. Najprościej: rozszerzenie Videoner na komputerze — zaloguj się na stronie platformy, otwórz okienko Videoner, naciśnij «🔑 Połącz swoje konto … z botem» i wyślij mi kod. Dla grupy wyślij /connect KOD w tej grupie.\n2. Albo wyślij mi plik cookies.txt (pliki cookie wyeksportowane z przeglądarki) lub wklej jego treść jako wiadomość.\n3. Z telefonu z Androidem — przez Firefoksa i dodatek Cookie-Editor: https://videoner.download/pl/blog/android-firefox",
  accountsWarning:
    "⚠️ Platformy nie lubią automatycznego pobierania i mogą ograniczyć lub zablokować konto. Lepiej połącz konto zapasowe, a nie główne. Pliki cookie są przechowywane w postaci zaszyfrowanej, używane tylko do pobierania i usuwane przyciskami poniżej.",
  accountsNone: "Nic jeszcze nie jest połączone.",
  accountsGroupTitle: "🔑 Konta połączone z tą grupą",
  accountsGroupHowTo:
    "Aby połączyć konto dla całej grupy: zdobądź kod przyciskiem «🔑 Połącz swoje konto … z botem» w rozszerzeniu Videoner i wyślij tutaj /connect KOD. Jeśli konto jest połączone tylko w twoim prywatnym czacie, bot użyje go tutaj dla twoich własnych linków. Twoje połączenia: /accounts w prywatnym czacie z @VideonerBot.",
  accountsLine: (platform, where, active) => `• ${platform} — ${where}${active ? "" : " (⚠️ logowanie nie działa)"}`,
  accountsGroupLine: (platform, owner, active) => `• ${platform} — ${owner}${active ? "" : " (⚠️ logowanie nie działa)"}`,
  accountsWhereHere: "czat prywatny",
  accountsWhereGroup: (title) => `grupa „${title}”`,
  accountsDeleteButton: (platform, where) => `🗑 ${platform} · ${where}`,
  accountsDeleteAllButton: "🗑 Usuń wszystkie moje połączenia",
  accountsDeleted: "Usunięto.",
  accountsDeletedAll: (n) => `Usunięte połączenia: ${n}.`,
  accountsNotAllowed: "Usunąć je może tylko osoba, która je połączyła, lub administrator grupy.",
  connectUsage:
    "Wyślij /connect KOD. Kod dostaniesz przyciskiem «🔑 Połącz swoje konto … z botem» w rozszerzeniu Videoner na komputerze. Twoje połączenia: /accounts.",
  connectOnlyAdmins: "Tylko administratorzy mogą łączyć konta z tą grupą (zobacz /settings).",
  connectDone: (platform, where) =>
    `✅ Połączono ${platform} ${where}. Bot pobiera teraz także to, co widzą tylko zalogowane osoby. Podgląd lub usunięcie: /accounts.\n\n⚠️ Platforma może ograniczyć konto za automatyczne pobieranie — lepiej użyj konta zapasowego.`,
  connectWhereGroup: "z tą grupą",
  connectWhereHere: "dla twoich pobrań w prywatnym czacie i trybie inline",
  connectCodeNotFound: "Nie znaleziono kodu lub wygasł (kody są ważne 10 minut). Zdobądź nowy w rozszerzeniu Videoner.",
  connectRejectedNoSession: "W tych plikach cookie nie ma logowania. Zaloguj się na stronie platformy i wyeksportuj pliki cookie ponownie.",
  connectRejectedUnknown: "Nie znaleziono plików cookie obsługiwanych platform: Instagram, Facebook, YouTube, X, VK, TikTok.",
  connectUnavailable: "Łączenie kont nie jest jeszcze dostępne.",
  connectFailed: "Nie udało się połączyć, spróbuj ponownie.",
  connectFileTooBig: "Plik jest za duży — wyeksportuj pliki cookie tylko potrzebnej strony.",
  connectNotAnonymous: "Połącz konto jako ty, a nie anonimowo w imieniu grupy: inaczej połączenia administratorów się pomieszają. Zniszczyłem kod — zdobądź nowy.",
  connectCodeInGroup:
    "Kod połączenia wysłany na czacie grupy mogą zobaczyć inni — zniszczyłem go i usunąłem wiadomość. Zdobądź nowy i wyślij go przez /connect KOD: taką wiadomość z komendą usuwam od razu.",
  groupWelcome:
    "👋 Cześć! Wrzucajcie na ten czat linki do filmów z TikToka, Instagrama, YouTube, VK i innych platform — odpowiem samym filmem.\n\n" +
    "Klipy do 15 minut pobieram sam, bez żadnych komend, a poza tym się nie odzywam.\n\n⚙️ Administratorzy grupy mogą mnie dostroić przez /settings: usuwanie wiadomości z linkami, styl podpisu, jakość, długie filmy i język.\n\n⚡ Dopisz -audio po linku, żeby dostać dźwięk, albo -hd, żeby dostać najlepszą jakość.\n\n📣 Nowości projektu: @videonerdownload",
  errorTooLong: "film jest za długi — tak długich filmów nie umiemy jeszcze pobierać.",
  errorUnknown: "nie udało się pobrać tego filmu. Spróbuj trochę później lub wyślij inny link.",
  inlineHintButton: "Wyślij link do bota",
  inlineResultTitle: "⬇️ Pobierz film",
  inlineResultDescription: "Film zostanie opublikowany bezpośrednio na tym czacie",
  inlinePlaceholder: "⏬ Pobieram, to może potrwać kilka minut...",
  inlineOpenBot: "Otwórz bota",
  inlineOnlySingleVideo:
    "Ten tryb wysyła jeden film. W przypadku postów z wieloma plikami lub zdjęciami wyślij link do bota w prywatnym czacie.",
  inlineSubscribeRequired: (channel: string) =>
    `Aby pobierać, zasubskrybuj ${channel} i spróbuj ponownie.`,
  inlineRateLimited: "Za dużo zapytań z rzędu. Odczekaj minutę i spróbuj ponownie.",
  queueRest: (count) => `\n\n📋 Linki wciąż w kolejce: ${count}. Pokażę je po kolei po tym.`,
  queuedOne: (position) =>
    `📋 Link dodany do kolejki, nr ${position}. Najpierw skończmy bieżący — potem pokażę dla niego wybór jakości.`,
  queuedMany: (added, waiting) =>
    `📋 Dodane do kolejki linki: ${added}. Łącznie czeka: ${waiting}. Pokażę je po kolei po bieżącym.`,
  queueDuplicates: (count) =>
    count === 1
      ? "Ten link jest już w kolejce — nie dodaję go drugi raz."
      : `Linki, które już są w kolejce, nie są dodawane drugi raz (powtórzenia: ${count}).`,
  queueFull: (limit, rejected) =>
    `Kolejka jest pełna (limit: ${limit}) — nadmiarowe linki nie zostały dodane (${rejected}). Wyślij je, gdy kolejka się przesunie.`,
  skipButton: "✖️ Nie pobieraj",
  skipped: "⏭ Pominięto ten link.",
  chooseTimedOut: "⌛ Nie wybrano jakości w ciągu 30 minut — pomijam ten link.",
  queueLostOnRestart: (count) =>
    `⚠️ Bot uruchamia się ponownie po aktualizacji — kolejka została wyczyszczona (linki: ${count}). Wyślij je ponownie za minutę.`,
  subtitlesButton: "📝 Napisy",
  subtitlesBack: "⬅️ Wróć do jakości",
  subtitlesAuto: "auto",
  subtitlesChoose: "Wybierz język napisów",
  subtitlesPreparing: "📝 Przygotowuję napisy...",
  subtitlesFailed: "Nie udało się pobrać napisów w tym języku. Spróbuj innego języka.",
  subtitlesBusy: "YouTube nie udostępnia teraz napisów — spróbuj ponownie za kilka minut.",
  playlistFound: (title, count) =>
    `📃 Playlista${title ? ` „${title.slice(0, 150)}”` : ""} — liczba filmów: ${count}.\nPobiorę je po kolei. W jakim formacie?`,
  playlistStdButton: "🎬 720p",
  playlistHdButton: "🎬 Najlepsza jakość",
  playlistAudioButton: "🎵 Tylko dźwięk (mp3)",
  playlistNoButton: "✖️ Nie, dzięki",
  playlistQueued: (count) =>
    `📃 Filmy z playlisty w kolejce: ${count}. Wyślę je po kolei. Zatrzymasz przyciskiem poniżej lub /stop.`,
  playlistFailed: "Nie udało się otworzyć playlisty — może być prywatna. Wyślij link do pojedynczego filmu.",
  stopButton: "⏹ Zatrzymaj",
  stopped: (dropped) => `⏹ Zatrzymano.${dropped ? ` Usunięte z kolejki linki: ${dropped}.` : ""}`,
  nothingToStop: "Nic się teraz nie pobiera.",
  languageChoose: "🌐 Wybierz język bota. „Auto” podąża za twoim Telegramem.",
  languageChooseGroup: "🌐 Język odpowiedzi bota w tej grupie. „Auto” — język Telegrama każdego członka.",
  languageAuto: "Auto — jak w Telegramie",
  languageAutoGroup: "Auto — własny każdego członka",
  languageSaved: (name) => `✅ Język bota: ${name}. Zmienisz go przez /language.`,
  languageSavedAuto: "✅ Bot używa języka twojego Telegrama. Zmienisz go przez /language.",
  settingsLanguageButton: (name) => `🌐 Język: ${name ?? "auto"}`,
  settingsBack: "⬅️ Wróć do ustawień",
};

const ja: Messages = {
  start: "こんにちは！YouTube、TikTok、Instagram、Facebook、Twitter/X、Vimeo、VK、Rutube、OK.ru、Pinterest、Threads の動画リンクを送ってください。ダウンロードをお手伝いします。\n\n✨ 画質の制限はありません。プラットフォームが提供する画質なら最大 4K まで、そのままお届けします。ただし、ファイルが 2 GB（Telegram のボット向け上限）に収まる場合に限ります。有料機能は一切ありません。\n\n完全無料です。サブスクリプションも広告もアプリ内課金もありません。\n\n🧩 パソコンでダウンロードしますか？ブラウザ拡張機能をインストールすると、動画ページに直接ダウンロードボタンが表示されます：videoner.download/ja/extension\n\n👥 グループに追加していただくと、そこで共有されたリンクの動画を投稿します。\n\n⚡ 画質の選択を省略できます。リンクの後に -audio を付けると音声のみ（mp3）、-hd を付けると最高画質でダウンロードします。\n\n📣 プロジェクトのお知らせ：@videonerdownload\n\n🌐 ボットの言語：/language",
  notLink: "リンクではないようです。動画のリンクを送ってください。",
  inviteGreeting: "こんにちは！Videoner です。YouTube、TikTok、Instagram などのプラットフォームから動画を無料でダウンロードします。共有された動画を準備しています 👇",
  inviteNotFound: "この招待リンクに対応する動画が見つかりませんでした。動画のリンクを送っていただければダウンロードします。",
  inviteUnavailable: "このリンクの動画を開けませんでした。現在サービスが応答していません。1 分ほどしてから同じリンクをもう一度開いてください。",
  fetchingInfo: "🔍 動画の情報を取得しています...",
  audioOnlyButton: "🎵 音声のみ（mp3）",
  photoButton: "📷 写真をダウンロード",
  slideshowButton: "🎞 スライドショー（動画）",
  galleryButton: "📷+🎞 写真とスライドショー",
  chooseQuality: (title, duration) => `「${title}」${duration ? `\n⏱ ${duration}` : ""}\n\n画質を選んでください：`,
  sessionExpired: "セッションの有効期限が切れました。リンクをもう一度送ってください",
  downloading: "⏬ ダウンロード中です。数分かかる場合があります...",
  downloadFailed: "ダウンロードに失敗しました",
  downloadProgress: (percent, eta, done) =>
    `⏬ ダウンロード中：${percent}%${eta ? ` · 残り ${eta}` : ""}${done ? `\n${done}` : ""}`,
  downloadFinishing: "⚙️ もうすぐ完了です。ファイルをまとめています...",
  converting: (percent) => `⚙️ 変換中：${percent}%`,
  etaUnderMinute: "1 分未満",
  etaMinutes: (minutes) => `約 ${minutes} 分`,
  etaHours: (hours, minutes) => `約 ${hours} 時間${minutes ? ` ${minutes} 分` : ""}`,
  downloadTimeout: "ダウンロードに時間がかかりすぎています。動画のサイズがかなり大きいようです。低めの画質をお試しください。",
  downloadInterrupted: "⚠️ アップデートのためボットを再起動しています。ダウンロードが中断されました。1 分ほどしてからリンクをもう一度送ってください。",
  fileTooBig: (mb, url) =>
    `ファイルが大きすぎました（${mb} MB）。Telegram の制限により、ボットから送信できません。\nこちらからダウンロードしてください：${url}`,
  sendingFile: "📤 ファイルを送信しています...",
  sendingAlbum: (count) => `📤 この投稿には複数のファイル（${count} 件）があります。アルバムとして送信しています...`,
  failedPrefix: "❌ 失敗しました：",
  fileCaption: (title, sourceUrl, shareUrl, description) =>
    composeCaption(
      title,
      description,
      `出典：${sourceUrl}\n` +
        "動画の権利はすべて作者に帰属します。\n" +
        "@VideonerBot で無料ダウンロード",
      `📣 プロジェクトのお知らせ：${NEWS_CHANNEL}`,
      shareUrl && `🔗 共有：${shareUrl}`,
    ),
  subscribeRequired: (channel) =>
    `ダウンロードするには、チャンネル ${channel} を購読してください。条件はこれだけで、サービスは引き続き無料です。\n\n` +
    "購読したら「購読しました」を押してください。",
  openChannelButton: "📣 チャンネルを開く",
  checkSubscriptionButton: "購読しました",
  subscribeThanks: "ありがとうございます！動画のリンクを送ってください。",
  subscribeThanksResuming: "ありがとうございます！送っていただいたリンクの処理を始めます。",
  subscribeStillMissing: "まだ購読が確認できません。購読してからもう一度押してください。",
  channelNotice: (channel) => `\n\nこの投稿へのリンクは ${channel} に匿名で（お名前なしで）掲載されます。`,
  channelPost: (title, url) =>
    (title ? `🎬 ${title.slice(0, 200)}\n\n` : "") +
    `${url}\n\n` +
    "この動画もほかの動画も無料でダウンロード：@VideonerBot",
  errorStoryNeedsId:
    "特定のストーリーへのリンクを送ってください。Instagram アプリでストーリーを開き、「シェア」→「リンクをコピー」をタップしてください。",
  errorInstagramStory:
    "Instagram のストーリーはログインしているユーザーにしか表示されません。",
  errorLoginRequired:
    "この投稿はログインしないと見られません。プラットフォームがログイン済みのユーザーにしか" +
    "表示しないためです。非公開の投稿、年齢制限のあるコンテンツ、" +
    "限られた相手に共有された投稿などがこれに当たります。\n\n" +
    "公開投稿なら問題なくダウンロードできます。別のリンクをお試しください。",
  errorUnsupportedPlatform:
    "このリンクを認識できませんでした。YouTube、TikTok、Instagram、Facebook、Twitter/X、Vimeo、VK、Rutube、OK.ru、Pinterest、Threads の動画への直接リンクかどうかご確認ください。",
  errorFileTooLarge: "ファイルが 2 GB を超えています。Telegram ではボットがこれより大きなファイルを送信できません。ウェブサイトかブラウザ拡張機能でダウンロードしてください（下のボタンから）。または、リンクをもう一度送って低めの画質を選んでください。",
  siteButton: "🌐 ウェブサイトでダウンロード",
  qualitiesHiddenBySize: (limit) =>
    `\n\n⚖️ ${limit} を超える画質は表示していません。Telegram ではボットがこれより大きなファイルを送信できないためです。ウェブサイトかブラウザ拡張機能でダウンロードできます（下のボタンから）。`,
  videoTooBigForTelegram: (smallest) =>
    `\n\n⚖️ この動画は最低画質（約 ${smallest}）でも Telegram には大きすぎます。Telegram ではボットが 2 GB を超えるファイルを送信できません。ここでは音声のみ取得できます。動画はウェブサイトかブラウザ拡張機能でダウンロードしてください（下のボタンから）。`,
  errorFormatUnavailable: "この動画ではその画質を利用できません。リンクをもう一度送っていただければ、最新の一覧を表示します。",
  errorNoVideoContent: "このリンクにはダウンロードできる動画がありません。写真だけの投稿のようです。",
  errorRegionBlocked:
    "この動画は作者の国以外ではブロックされているため、プラットフォームが" +
    "当サーバーに提供してくれません。制限はプラットフォーム側にあるので、回避する方法はありません。" +
    "\n\nほかのリンクは通常どおりダウンロードできます。",
  errorRateLimited: "連続して送られたリンクが多すぎます。少し待ってからもう一度送ってください。",
  errorYoutubeDailyLimit: (gb) => `過去 24 時間に YouTube から ${gb} GB を超えてダウンロードしました。これはボットの 1 人あたりの 1 日の上限です。直近 24 時間で計算しているので、しばらくすると YouTube の新しい動画をダウンロードできるようになります。ほかのプラットフォームは通常どおり使えます。`,
  playlistStoppedByLimit: (dropped) => `⏹ 再生リストを停止しました：YouTube の 1 日の上限に達しました。ダウンロードされなかった動画：${dropped} 本。後で再生リストのリンクをもう一度送ってください。`,
  errorPlatformRefused:
    "プラットフォームがこの動画を当サーバーに提供してくれませんでした。非公開の投稿や" +
    "年齢制限のある投稿で起こるほか、プラットフォームが一時的にアクセスを" +
    "制限していることもあります。数分後にもう一度お試しください。",
  errorThreadsNoMedia:
    "この Threads の投稿には動画も写真も見当たりません。テキストのみの投稿か、" +
    "Threads がログイン済みのユーザーにしかメディアを表示しない投稿です。後者はログインしないとダウンロードできません。",
  extensionHint:
    "\n\n💻 パソコンなら Videoner のブラウザ拡張機能でダウンロードできます。" +
    "プラットフォームでのご自身のログインを使ってダウンロードし、パスワードや Cookie がブラウザの外に出ることはありません。",
  privateConnectHint: (platform, withExtension) =>
    `\n\n🔑 このような投稿をダウンロードするには、${platform} アカウントをボットに一度だけ接続してください。接続後は、あなたが閲覧できるもの（非公開の投稿、リール、ストーリー）をスマートフォンからでもダウンロードできます。方法は下のボタンからご確認ください。${withExtension ? "\n\n💻 または、パソコンで Videoner のブラウザ拡張機能を使ってダウンロードしてください。" : ""}`,
  privateReconnectHint: (platform, withExtension) =>
    `\n\n⚠️ 接続済みの ${platform} アカウントでこの投稿を開けませんでした。ログインが無効になった可能性があります。アカウントをもう一度接続してください。または、このアカウントにはこの投稿へのアクセス権がありません。${withExtension ? "\n\n💻 パソコンで Videoner のブラウザ拡張機能を使ってダウンロードすることもできます。" : ""}`,
  connectAccountButton: "🔑 アカウントを接続",
  reconnectAccountButton: "🔑 再接続",
  extensionButton: "🧩 拡張機能でダウンロード",
  extensionCommand:
    "🧩 ブラウザ版 Videoner：動画ページに直接ダウンロードボタンが表示されます。YouTube、Instagram、TikTok、VK、ご自身のアカウントの非公開動画、GetCourse のレッスンに対応しています。\n\nパソコン版の Chrome、Edge、Opera、Yandex Browser、Firefox で使えます。",
  extensionPageButton: "🧩 拡張機能をインストール",
  addToGroupButton: "👥 グループに追加",
  newsButton: "📣 プロジェクトのお知らせ",
  fileCaptionShort: (title, sourceUrl) =>
    withOptionalLines((title ? `🎬 ${title.slice(0, 200)}\n\n` : "") + sourceUrl, `📣 プロジェクトのお知らせ：${NEWS_CHANNEL}`, undefined),
  sentBy: (name) => `👤 ${name}`,
  groupSettings: (s, canDelete) =>
    "⚙️ このグループでのボットの設定\n\n" +
    `🗑 リンクのメッセージを削除：${s.deleteLinks ? "する" : "しない"}\n` +
    "動画を送信した後、リンクだけのメッセージを削除します。チャットには、共有した人の名前付きの動画だけが残ります。\n" +
    (s.deleteLinks && !canDelete
      ? "⚠️ 現在メッセージを削除できません。「メッセージの削除」権限を付けて管理者にしてください。\n"
      : "") +
    `\n✍️ 動画のキャプション：${{ full: "完全", short: "タイトルと出典", none: "なし" }[s.caption] ?? s.caption}\n` +
    `\n🎞 画質：${s.quality === "max" ? "Telegram が受け付ける最高画質" : "標準（720p）"}\n` +
    `\n⏱ 長い動画：${s.longVideos ? "長さ制限なし" : "15 分までのみ"}\n` +
    `\n🔑 アカウントを接続できる人（ストーリーや非公開の投稿用）：${s.cookiesBy === "all" ? "メンバー全員" : "管理者のみ"}\n` +
    `\n🌐 返信の言語：${s.language ? langName(s.language) : "メンバーごとの言語"}\n` +
    "\n設定を変更できるのはグループの管理者だけです。",
  settingsDeleteButton: (on) => `🗑 リンクを削除：${on ? "する" : "しない"}`,
  settingsCaptionButton: (style) => `✍️ キャプション：${{ full: "完全", short: "短い", none: "なし" }[style] ?? style}`,
  settingsQualityButton: (mode) => `🎞 画質：${mode === "max" ? "最高" : "720p"}`,
  settingsLongButton: (on) => `⏱ 長い動画：${on ? "許可" : "15 分まで"}`,
  settingsDoneButton: "✅ 完了",
  settingsAdminsOnly: "設定を変更できるのはグループの管理者だけです。",
  settingsGroupsOnly: "設定はグループ用です。私をグループに追加して、そこで /settings を送ってください。",
  settingsFailed: "設定を保存できませんでした。もう一度お試しください。",
  settingsCookiesButton: (by) => `🔑 アカウントの接続：${by === "all" ? "全員" : "管理者"}`,
  accountsIntro:
    "🔑 接続済みのアカウント\n\nボットは、ログインしている人にしか見えないもの（Instagram のストーリー、非公開の投稿）を、あなたのアカウントを使ってダウンロードできます。ログインは接続した場所で有効になります。個人チャットで接続したものはあなたのダウンロードに使われ、独自のアカウントがないグループでのあなた自身のリンクにも使われます。グループに接続したものはそのグループのメンバー全員に使われます。",
  accountsHowTo:
    "接続方法：\n1. いちばん簡単なのは、パソコンの Videoner 拡張機能です。プラットフォームのサイトでログインし、Videoner のポップアップを開いて «🔑 … アカウントをボットに接続» を押し、表示されたコードを私に送ってください。グループの場合は、そのグループで /connect コード を送ってください。\n2. または、cookies.txt ファイル（ブラウザからエクスポートした Cookie）を送るか、その内容をメッセージとして貼り付けてください。\n3. Android スマートフォンからは、Firefox と Cookie-Editor アドオンを使います：https://videoner.download/ja/blog/android-firefox",
  accountsWarning:
    "⚠️ プラットフォームは自動ダウンロードを好まないため、アカウントが制限されたり停止されたりすることがあります。メインではなくサブのアカウントを接続することをおすすめします。Cookie は暗号化して保存され、ダウンロードにのみ使われ、下のボタンで削除できます。",
  accountsNone: "まだ何も接続されていません。",
  accountsGroupTitle: "🔑 このグループに接続されたアカウント",
  accountsGroupHowTo:
    "グループ全体用に接続するには、Videoner 拡張機能の «🔑 … アカウントをボットに接続» ボタンでコードを取得し、ここで /connect コード を送ってください。個人チャットでのみアカウントを接続している場合、ボットはここでもあなた自身のリンクにそれを使います。あなたの接続：@VideonerBot との個人チャットで /accounts。",
  accountsLine: (platform, where, active) => `• ${platform} — ${where}${active ? "" : "（⚠️ ログインが無効）"}`,
  accountsGroupLine: (platform, owner, active) => `• ${platform} — ${owner}${active ? "" : "（⚠️ ログインが無効）"}`,
  accountsWhereHere: "個人チャット",
  accountsWhereGroup: (title) => `グループ「${title}」`,
  accountsDeleteButton: (platform, where) => `🗑 ${platform} · ${where}`,
  accountsDeleteAllButton: "🗑 自分の接続をすべて削除",
  accountsDeleted: "削除しました。",
  accountsDeletedAll: (n) => `削除した接続：${n} 件。`,
  accountsNotAllowed: "削除できるのは、接続した本人かグループの管理者だけです。",
  connectUsage:
    "/connect コード を送ってください。コードはパソコンの Videoner 拡張機能の «🔑 … アカウントをボットに接続» ボタンで取得できます。あなたの接続：/accounts。",
  connectOnlyAdmins: "このグループにアカウントを接続できるのは管理者だけです（/settings を参照）。",
  connectDone: (platform, where) =>
    `✅ ${platform} を${where}接続しました。これで、ログインしている人にしか見えないものもボットがダウンロードできます。確認・削除：/accounts。\n\n⚠️ 自動ダウンロードによってプラットフォームがアカウントを制限することがあります。サブのアカウントを使うことをおすすめします。`,
  connectWhereGroup: "このグループに",
  connectWhereHere: "個人チャットとインラインモードでのダウンロード用に",
  connectCodeNotFound: "コードが見つからないか、有効期限が切れています（コードの有効期間は 10 分です）。Videoner 拡張機能で新しいコードを取得してください。",
  connectRejectedNoSession: "この Cookie にはログイン情報がありません。プラットフォームのサイトでログインしてから、もう一度 Cookie をエクスポートしてください。",
  connectRejectedUnknown: "対応プラットフォームの Cookie が見つかりませんでした：Instagram、Facebook、YouTube、X、VK、TikTok。",
  connectUnavailable: "アカウントの接続はまだご利用いただけません。",
  connectFailed: "接続できませんでした。もう一度お試しください。",
  connectFileTooBig: "ファイルが大きすぎます。必要なサイトの Cookie だけをエクスポートしてください。",
  connectNotAnonymous: "グループとして匿名ではなく、ご自身としてアカウントを接続してください。そうしないと管理者の接続が混ざってしまいます。コードは無効にしました。新しいコードを取得してください。",
  connectCodeInGroup:
    "グループチャットに投稿された接続コードはほかの人にも見えてしまいます。コードを無効にし、メッセージを削除しました。新しいコードを取得して /connect コード で送ってください。そのコマンドのメッセージはすぐに削除します。",
  groupWelcome:
    "👋 こんにちは！このチャットに TikTok、Instagram、YouTube、VK などの動画リンクを投稿してください。動画そのものを返信します。\n\n" +
    "15 分までの動画はコマンドなしで自動的にダウンロードし、それ以外のときは静かにしています。\n\n⚙️ グループの管理者は /settings で設定を変更できます：リンクのメッセージの削除、キャプションの形式、画質、長い動画、言語。\n\n⚡ リンクの後に -audio を付けると音声を、-hd を付けると最高画質で取得できます。\n\n📣 プロジェクトのお知らせ：@videonerdownload",
  errorTooLong: "動画が長すぎます。このような長い動画はまだダウンロードできません。",
  errorUnknown: "この動画をダウンロードできませんでした。少し時間をおいてもう一度お試しいただくか、別のリンクを送ってください。",
  inlineHintButton: "ボットにリンクを送る",
  inlineResultTitle: "⬇️ 動画をダウンロード",
  inlineResultDescription: "動画はこのチャットに直接投稿されます",
  inlinePlaceholder: "⏬ ダウンロード中です。数分かかる場合があります...",
  inlineOpenBot: "ボットを開く",
  inlineOnlySingleVideo:
    "このモードでは動画を 1 本だけ送信します。複数のファイルがある投稿や写真は、個人チャットでボットにリンクを送ってください。",
  inlineSubscribeRequired: (channel: string) =>
    `ダウンロードするには、${channel} を購読してからもう一度お試しください。`,
  inlineRateLimited: "連続したリクエストが多すぎます。1 分ほど待ってからもう一度お試しください。",
  queueRest: (count) => `\n\n📋 キューに残っているリンク：${count} 件。この後 1 件ずつ表示します。`,
  queuedOne: (position) =>
    `📋 リンクをキューに追加しました（${position} 番目）。まず現在のリンクを終わらせてから、このリンクの画質選択を表示します。`,
  queuedMany: (added, waiting) =>
    `📋 キューに追加したリンク：${added} 件。待機中の合計：${waiting} 件。現在のリンクの後に 1 件ずつ表示します。`,
  queueDuplicates: (count) =>
    count === 1
      ? "このリンクはすでにキューにあります。重複して追加はしません。"
      : `すでにキューにあるリンクは重複して追加しません（重複：${count} 件）。`,
  queueFull: (limit, rejected) =>
    `キューに入れられるリンクは最大 ${limit} 件です。超えた分は追加されませんでした（${rejected} 件）。キューが進んでから送ってください。`,
  skipButton: "✖️ ダウンロードしない",
  skipped: "⏭ このリンクをスキップしました。",
  chooseTimedOut: "⌛ 30 分以内に画質が選ばれなかったため、このリンクをスキップします。",
  queueLostOnRestart: (count) =>
    `⚠️ アップデートのためボットを再起動しています。キューがリセットされました（リンク：${count} 件）。1 分ほどしてからもう一度送ってください。`,
  subtitlesButton: "📝 字幕",
  subtitlesBack: "⬅️ 画質選択に戻る",
  subtitlesAuto: "自動",
  subtitlesChoose: "字幕の言語を選んでください",
  subtitlesPreparing: "📝 字幕を準備しています...",
  subtitlesFailed: "この言語の字幕をダウンロードできませんでした。別の言語をお試しください。",
  subtitlesBusy: "現在 YouTube が字幕を提供していません。数分後にもう一度お試しください。",
  playlistFound: (title, count) =>
    `📃 再生リスト${title ? `「${title.slice(0, 150)}」` : ""}：動画 ${count} 本。\n1 本ずつダウンロードします。形式はどれにしますか？`,
  playlistStdButton: "🎬 720p",
  playlistHdButton: "🎬 最高画質",
  playlistAudioButton: "🎵 音声のみ（mp3）",
  playlistNoButton: "✖️ やめておく",
  playlistQueued: (count) =>
    `📃 再生リストの動画をキューに追加しました：${count} 本。1 本ずつ送信します。止めるには下のボタンか /stop を使ってください。`,
  playlistFailed: "再生リストを開けませんでした。非公開の可能性があります。個別の動画のリンクを送ってください。",
  stopButton: "⏹ 停止",
  stopped: (dropped) => `⏹ 停止しました。${dropped ? `キューから削除したリンク：${dropped} 件。` : ""}`,
  nothingToStop: "現在ダウンロード中のものはありません。",
  languageChoose: "🌐 ボットの言語を選んでください。「自動」は Telegram の言語に合わせます。",
  languageChooseGroup: "🌐 このグループでのボットの返信言語です。「自動」はメンバーそれぞれの Telegram の言語になります。",
  languageAuto: "自動（Telegram と同じ）",
  languageAutoGroup: "自動（メンバーごと）",
  languageSaved: (name) => `✅ ボットの言語：${name}。/language で変更できます。`,
  languageSavedAuto: "✅ ボットは Telegram の言語に合わせます。/language で変更できます。",
  settingsLanguageButton: (name) => `🌐 言語：${name ?? "自動"}`,
  settingsBack: "⬅️ 設定に戻る",
};

const ko: Messages = {
  start: "안녕하세요! YouTube, TikTok, Instagram, Facebook, Twitter/X, Vimeo, VK, Rutube, OK.ru, Pinterest, Threads의 동영상 링크를 보내 주세요. 다운로드를 도와드릴게요.\n\n✨ 화질 제한이 없어요. 플랫폼이 제공하는 화질 그대로 최대 4K까지 받을 수 있어요. 단, 파일이 Telegram 봇 전송 한도인 2 GB 이내여야 해요. 유료 기능은 전혀 없어요.\n\n완전히 무료예요. 구독도, 광고도, 인앱 결제도 없어요.\n\n🧩 컴퓨터에서 다운로드하시나요? 브라우저 확장 프로그램을 설치하면 동영상 페이지에 바로 다운로드 버튼이 나타나요: videoner.download/ko/extension\n\n👥 저를 그룹에 추가하면 그곳에서 공유된 링크의 동영상을 올려 드려요.\n\n⚡ 화질 선택을 건너뛸 수 있어요. 링크 뒤에 -audio를 붙이면 소리만(mp3), -hd를 붙이면 최고 화질로 받아요.\n\n📣 프로젝트 소식: @videonerdownload\n\n🌐 봇 언어: /language",
  notLink: "링크가 아닌 것 같아요. 동영상 링크를 보내 주세요.",
  inviteGreeting: "안녕하세요! 저는 Videoner예요. YouTube, TikTok, Instagram 등 여러 플랫폼의 동영상을 무료로 다운로드해 드려요. 공유받은 동영상을 준비하고 있어요 👇",
  inviteNotFound: "이 초대 링크에 해당하는 동영상을 찾지 못했어요. 동영상 링크를 보내 주시면 다운로드해 드릴게요.",
  inviteUnavailable: "이 링크의 동영상을 열지 못했어요. 지금 서비스가 응답하지 않아요. 1분 뒤에 같은 링크를 다시 열어 주세요.",
  fetchingInfo: "🔍 동영상 정보를 가져오는 중이에요...",
  audioOnlyButton: "🎵 오디오만 (mp3)",
  photoButton: "📷 사진 다운로드",
  slideshowButton: "🎞 슬라이드쇼 (동영상)",
  galleryButton: "📷+🎞 사진과 슬라이드쇼",
  chooseQuality: (title, duration) => `"${title}"${duration ? `\n⏱ ${duration}` : ""}\n\n화질을 선택해 주세요:`,
  sessionExpired: "세션이 만료되었어요. 링크를 다시 보내 주세요",
  downloading: "⏬ 다운로드 중이에요. 몇 분 정도 걸릴 수 있어요...",
  downloadFailed: "다운로드에 실패했어요",
  downloadProgress: (percent, eta, done) =>
    `⏬ 다운로드 중: ${percent}%${eta ? ` · ${eta} 남음` : ""}${done ? `\n${done}` : ""}`,
  downloadFinishing: "⚙️ 거의 다 됐어요. 파일을 합치는 중이에요...",
  converting: (percent) => `⚙️ 변환 중: ${percent}%`,
  etaUnderMinute: "1분 미만",
  etaMinutes: (minutes) => `약 ${minutes}분`,
  etaHours: (hours, minutes) => `약 ${hours}시간${minutes ? ` ${minutes}분` : ""}`,
  downloadTimeout: "다운로드가 너무 오래 걸려요. 동영상 용량이 매우 큰 것 같아요. 더 낮은 화질로 시도해 보세요.",
  downloadInterrupted: "⚠️ 업데이트를 위해 봇을 다시 시작하고 있어서 다운로드가 중단되었어요. 1분 뒤에 링크를 다시 보내 주세요.",
  fileTooBig: (mb, url) =>
    `파일이 너무 커요 (${mb} MB). Telegram에서 봇이 보낼 수 없는 크기예요.\n여기에서 다운로드하세요: ${url}`,
  sendingFile: "📤 파일을 보내는 중이에요...",
  sendingAlbum: (count) => `📤 이 게시물에는 파일이 여러 개(${count}개) 있어요. 앨범으로 보내는 중이에요...`,
  failedPrefix: "❌ 실패: ",
  fileCaption: (title, sourceUrl, shareUrl, description) =>
    composeCaption(
      title,
      description,
      `출처: ${sourceUrl}\n` +
        "동영상의 모든 권리는 원작자에게 있어요.\n" +
        "@VideonerBot으로 무료 다운로드",
      `📣 프로젝트 소식: ${NEWS_CHANNEL}`,
      shareUrl && `🔗 공유: ${shareUrl}`,
    ),
  subscribeRequired: (channel) =>
    `다운로드하려면 채널 ${channel}을(를) 구독해 주세요. 조건은 이것뿐이고, 서비스는 계속 무료예요.\n\n` +
    "구독한 뒤 «구독했어요»를 눌러 주세요.",
  openChannelButton: "📣 채널 열기",
  checkSubscriptionButton: "구독했어요",
  subscribeThanks: "감사합니다! 이제 동영상 링크를 보내 주세요.",
  subscribeThanksResuming: "감사합니다! 보내 주신 링크를 바로 처리할게요.",
  subscribeStillMissing: "아직 구독이 확인되지 않아요. 구독한 뒤 다시 눌러 주세요.",
  channelNotice: (channel) => `\n\n이 게시물의 링크는 ${channel}에 이름 없이 익명으로 올라가요.`,
  channelPost: (title, url) =>
    (title ? `🎬 ${title.slice(0, 200)}\n\n` : "") +
    `${url}\n\n` +
    "이 동영상과 다른 동영상도 무료로 다운로드하세요: @VideonerBot",
  errorStoryNeedsId:
    "특정 스토리의 링크를 보내 주세요. Instagram 앱에서 스토리를 열고 공유 → 링크 복사를 눌러 주세요.",
  errorInstagramStory:
    "Instagram 스토리는 로그인한 사용자에게만 보여요.",
  errorLoginRequired:
    "이 게시물은 로그인하지 않으면 볼 수 없어요. 플랫폼이 로그인한 사용자에게만 " +
    "보여 주기 때문이에요. 비공개 게시물, 연령 제한 콘텐츠, " +
    "일부 사람에게만 공유된 게시물이 이런 경우예요.\n\n" +
    "공개 게시물은 문제없이 다운로드돼요. 다른 링크로 시도해 보세요.",
  errorUnsupportedPlatform:
    "이 링크를 인식하지 못했어요. YouTube, TikTok, Instagram, Facebook, Twitter/X, Vimeo, VK, Rutube, OK.ru, Pinterest, Threads의 동영상으로 바로 연결되는 링크인지 확인해 주세요.",
  errorFileTooLarge: "파일이 2 GB보다 커요. Telegram에서는 봇이 이보다 큰 파일을 보낼 수 없어요. 웹사이트나 브라우저 확장 프로그램으로 다운로드하세요(아래 버튼). 또는 링크를 다시 보내고 더 낮은 화질을 선택해 주세요.",
  siteButton: "🌐 웹사이트에서 다운로드",
  qualitiesHiddenBySize: (limit) =>
    `\n\n⚖️ ${limit}보다 큰 화질은 숨겼어요. Telegram에서는 봇이 이보다 큰 파일을 보낼 수 없기 때문이에요. 웹사이트나 브라우저 확장 프로그램으로 다운로드할 수 있어요(아래 버튼).`,
  videoTooBigForTelegram: (smallest) =>
    `\n\n⚖️ 이 동영상은 가장 낮은 화질(약 ${smallest})로도 Telegram에 보내기에는 너무 커요. Telegram에서는 봇이 2 GB가 넘는 파일을 보낼 수 없어요. 여기에서는 오디오만 받을 수 있고, 동영상은 웹사이트나 브라우저 확장 프로그램으로 받으세요(아래 버튼).`,
  errorFormatUnavailable: "이 동영상에서는 해당 화질을 사용할 수 없어요. 링크를 다시 보내 주시면 최신 목록을 보여 드릴게요.",
  errorNoVideoContent: "이 링크에는 다운로드할 동영상이 없어요. 사진만 있는 게시물인 것 같아요.",
  errorRegionBlocked:
    "이 동영상은 작성자의 국가 밖에서 차단되어 있어서 플랫폼이 " +
    "저희 서버에 제공하지 않아요. 제한이 플랫폼 쪽에 있어서 우회할 방법이 없어요." +
    "\n\n다른 링크는 평소처럼 다운로드돼요.",
  errorRateLimited: "연속으로 보낸 링크가 너무 많아요. 잠시 기다린 뒤 다시 보내 주세요.",
  errorYoutubeDailyLimit: (gb) => `최근 24시간 동안 YouTube에서 ${gb} GB 넘게 다운로드했어요. 이것이 봇의 1인당 하루 한도예요. 최근 24시간 기준으로 계산하니 조금 뒤에 새 YouTube 동영상을 다시 다운로드할 수 있어요. 다른 플랫폼은 평소처럼 이용할 수 있어요.`,
  playlistStoppedByLimit: (dropped) => `⏹ 재생목록을 중지했어요. YouTube 하루 한도에 도달했어요. 다운로드하지 못한 동영상: ${dropped}개. 나중에 재생목록 링크를 다시 보내 주세요.`,
  errorPlatformRefused:
    "플랫폼이 이 동영상을 저희 서버에 제공하지 않았어요. 비공개 게시물이나 " +
    "연령 제한 게시물에서 이런 일이 생기고, 가끔은 플랫폼이 잠시 접근을 " +
    "제한하기도 해요. 몇 분 뒤에 다시 시도해 보세요.",
  errorThreadsNoMedia:
    "이 Threads 게시물에는 동영상이나 사진이 보이지 않아요. 텍스트만 있는 게시물이거나, " +
    "Threads가 로그인한 사용자에게만 미디어를 보여 주는 게시물이에요. 이런 게시물은 로그인하지 않으면 다운로드할 수 없어요.",
  extensionHint:
    "\n\n💻 컴퓨터에서 Videoner 브라우저 확장 프로그램으로 다운로드할 수 있어요. " +
    "플랫폼에 로그인된 내 계정으로 다운로드하며, 비밀번호나 쿠키는 브라우저 밖으로 나가지 않아요.",
  privateConnectHint: (platform, withExtension) =>
    `\n\n🔑 이런 게시물을 다운로드하려면 ${platform} 계정을 봇에 한 번만 연결해 주세요. 그러면 내가 볼 수 있는 비공개 게시물, 릴스, 스토리를 휴대폰에서도 봇이 다운로드해 드려요. 방법은 아래 버튼에서 확인하세요.${withExtension ? "\n\n💻 또는 컴퓨터에서 Videoner 브라우저 확장 프로그램으로 다운로드하세요." : ""}`,
  privateReconnectHint: (platform, withExtension) =>
    `\n\n⚠️ 연결된 ${platform} 계정으로 이 게시물을 열지 못했어요. 로그인이 만료되었을 수 있으니 계정을 다시 연결해 주세요. 또는 이 계정에 게시물을 볼 권한이 없는 경우예요.${withExtension ? "\n\n💻 컴퓨터에서 Videoner 브라우저 확장 프로그램으로 다운로드할 수도 있어요." : ""}`,
  connectAccountButton: "🔑 계정 연결",
  reconnectAccountButton: "🔑 다시 연결",
  extensionButton: "🧩 확장 프로그램으로 다운로드",
  extensionCommand:
    "🧩 브라우저용 Videoner: 동영상 페이지에 바로 다운로드 버튼이 생겨요. YouTube, Instagram, TikTok, VK, 내 계정의 비공개 동영상, GetCourse 강의를 지원해요.\n\n컴퓨터의 Chrome, Edge, Opera, Yandex Browser, Firefox에서 사용할 수 있어요.",
  extensionPageButton: "🧩 확장 프로그램 설치",
  addToGroupButton: "👥 그룹에 추가",
  newsButton: "📣 프로젝트 소식",
  fileCaptionShort: (title, sourceUrl) =>
    withOptionalLines((title ? `🎬 ${title.slice(0, 200)}\n\n` : "") + sourceUrl, `📣 프로젝트 소식: ${NEWS_CHANNEL}`, undefined),
  sentBy: (name) => `👤 ${name}`,
  groupSettings: (s, canDelete) =>
    "⚙️ 이 그룹의 봇 설정\n\n" +
    `🗑 링크 메시지 삭제: ${s.deleteLinks ? "예" : "아니요"}\n` +
    "동영상을 보낸 뒤 링크만 있던 메시지를 삭제해요. 채팅에는 공유한 사람의 이름이 붙은 동영상만 남아요.\n" +
    (s.deleteLinks && !canDelete
      ? "⚠️ 지금은 메시지를 삭제할 수 없어요. \"메시지 삭제\" 권한이 있는 관리자로 지정해 주세요.\n"
      : "") +
    `\n✍️ 동영상 캡션: ${{ full: "전체", short: "제목과 출처", none: "캡션 없음" }[s.caption] ?? s.caption}\n` +
    `\n🎞 화질: ${s.quality === "max" ? "Telegram이 허용하는 최고 화질" : "표준 (720p)"}\n` +
    `\n⏱ 긴 동영상: ${s.longVideos ? "길이 제한 없음" : "15분 이하만"}\n` +
    `\n🔑 계정을 연결할 수 있는 사람 (스토리와 비공개 게시물용): ${s.cookiesBy === "all" ? "모든 멤버" : "관리자만"}\n` +
    `\n🌐 답장 언어: ${s.language ? langName(s.language) : "멤버별 언어"}\n` +
    "\n설정은 그룹 관리자만 변경할 수 있어요.",
  settingsDeleteButton: (on) => `🗑 링크 삭제: ${on ? "예" : "아니요"}`,
  settingsCaptionButton: (style) => `✍️ 캡션: ${{ full: "전체", short: "짧게", none: "없음" }[style] ?? style}`,
  settingsQualityButton: (mode) => `🎞 화질: ${mode === "max" ? "최고" : "720p"}`,
  settingsLongButton: (on) => `⏱ 긴 동영상: ${on ? "예" : "15분 이하"}`,
  settingsDoneButton: "✅ 완료",
  settingsAdminsOnly: "설정은 그룹 관리자만 변경할 수 있어요.",
  settingsGroupsOnly: "설정은 그룹용이에요. 저를 그룹에 추가하고 그곳에서 /settings를 보내 주세요.",
  settingsFailed: "설정을 저장하지 못했어요. 다시 시도해 주세요.",
  settingsCookiesButton: (by) => `🔑 계정 연결: ${by === "all" ? "모두" : "관리자"}`,
  accountsIntro:
    "🔑 연결된 계정\n\n봇은 로그인한 사람만 볼 수 있는 콘텐츠(Instagram 스토리, 비공개 게시물)를 내 계정으로 다운로드할 수 있어요. 로그인은 연결한 곳에서 작동해요. 개인 채팅에서 연결한 계정은 내 다운로드에 쓰이고, 자체 계정이 없는 그룹에서 내가 보낸 링크에도 쓰여요. 그룹에 연결한 계정은 그 그룹의 모든 멤버에게 쓰여요.",
  accountsHowTo:
    "연결 방법:\n1. 가장 쉬운 방법은 컴퓨터의 Videoner 확장 프로그램이에요. 플랫폼 사이트에 로그인하고 Videoner 팝업을 열어 «🔑 내 … 계정을 봇에 연결»을 누른 뒤 코드를 저에게 보내 주세요. 그룹이라면 해당 그룹에서 /connect 코드 를 보내 주세요.\n2. 또는 cookies.txt 파일(브라우저에서 내보낸 쿠키)을 보내거나, 그 내용을 메시지로 붙여 넣어 주세요.\n3. Android 휴대폰에서는 Firefox와 Cookie-Editor 부가 기능으로 할 수 있어요: https://videoner.download/ko/blog/android-firefox",
  accountsWarning:
    "⚠️ 플랫폼은 자동 다운로드를 싫어해서 계정을 제한하거나 정지할 수 있어요. 주 계정 말고 보조 계정을 연결하는 것이 좋아요. 쿠키는 암호화되어 저장되고, 다운로드에만 쓰이며, 아래 버튼으로 삭제할 수 있어요.",
  accountsNone: "아직 연결된 계정이 없어요.",
  accountsGroupTitle: "🔑 이 그룹에 연결된 계정",
  accountsGroupHowTo:
    "그룹 전체용으로 연결하려면 Videoner 확장 프로그램의 «🔑 내 … 계정을 봇에 연결» 버튼으로 코드를 받아 여기에서 /connect 코드 를 보내 주세요. 개인 채팅에서만 계정을 연결했다면, 봇은 여기서도 내가 보낸 링크에 그 계정을 사용해요. 내 연결 관리: @VideonerBot과의 개인 채팅에서 /accounts.",
  accountsLine: (platform, where, active) => `• ${platform} — ${where}${active ? "" : " (⚠️ 로그인 작동 안 함)"}`,
  accountsGroupLine: (platform, owner, active) => `• ${platform} — ${owner}${active ? "" : " (⚠️ 로그인 작동 안 함)"}`,
  accountsWhereHere: "개인 채팅",
  accountsWhereGroup: (title) => `"${title}" 그룹`,
  accountsDeleteButton: (platform, where) => `🗑 ${platform} · ${where}`,
  accountsDeleteAllButton: "🗑 내 연결 모두 삭제",
  accountsDeleted: "삭제했어요.",
  accountsDeletedAll: (n) => `삭제한 연결: ${n}개.`,
  accountsNotAllowed: "연결한 본인이나 그룹 관리자만 삭제할 수 있어요.",
  connectUsage:
    "/connect 코드 를 보내 주세요. 코드는 컴퓨터의 Videoner 확장 프로그램에서 «🔑 내 … 계정을 봇에 연결» 버튼을 누르면 받을 수 있어요. 내 연결 관리: /accounts.",
  connectOnlyAdmins: "이 그룹에는 관리자만 계정을 연결할 수 있어요 (/settings 참고).",
  connectDone: (platform, where) =>
    `✅ ${platform} 계정을 ${where} 연결했어요. 이제 봇이 로그인한 사람만 볼 수 있는 콘텐츠도 다운로드해요. 확인 및 삭제: /accounts.\n\n⚠️ 자동 다운로드 때문에 플랫폼이 계정을 제한할 수 있어요. 보조 계정을 사용하는 것이 좋아요.`,
  connectWhereGroup: "이 그룹에",
  connectWhereHere: "개인 채팅과 인라인 모드의 다운로드용으로",
  connectCodeNotFound: "코드를 찾을 수 없거나 만료되었어요 (코드는 10분 동안 유효해요). Videoner 확장 프로그램에서 새 코드를 받아 주세요.",
  connectRejectedNoSession: "이 쿠키에는 로그인 정보가 없어요. 플랫폼 사이트에 로그인한 뒤 쿠키를 다시 내보내 주세요.",
  connectRejectedUnknown: "지원하는 플랫폼의 쿠키를 찾지 못했어요: Instagram, Facebook, YouTube, X, VK, TikTok.",
  connectUnavailable: "계정 연결은 아직 사용할 수 없어요.",
  connectFailed: "연결하지 못했어요. 다시 시도해 주세요.",
  connectFileTooBig: "파일이 너무 커요. 필요한 사이트의 쿠키만 내보내 주세요.",
  connectNotAnonymous: "그룹 이름으로 익명으로 말고, 본인 계정으로 연결해 주세요. 그렇지 않으면 관리자들의 연결이 섞여요. 코드는 폐기했으니 새 코드를 받아 주세요.",
  connectCodeInGroup:
    "그룹 채팅에 올린 연결 코드는 다른 사람도 볼 수 있어요. 코드를 폐기하고 메시지를 삭제했어요. 새 코드를 받아 /connect 코드 로 보내 주세요. 그 명령 메시지는 바로 삭제해 드려요.",
  groupWelcome:
    "👋 안녕하세요! 이 채팅에 TikTok, Instagram, YouTube, VK 등 여러 플랫폼의 동영상 링크를 올려 주세요. 동영상으로 바로 답장해 드릴게요.\n\n" +
    "15분 이하의 영상은 명령 없이 알아서 다운로드하고, 그 외에는 조용히 있을게요.\n\n⚙️ 그룹 관리자는 /settings로 저를 설정할 수 있어요: 링크 메시지 삭제, 캡션 형식, 화질, 긴 동영상, 언어.\n\n⚡ 링크 뒤에 -audio를 붙이면 소리만, -hd를 붙이면 최고 화질로 받아요.\n\n📣 프로젝트 소식: @videonerdownload",
  errorTooLong: "동영상이 너무 길어요. 이렇게 긴 동영상은 아직 다운로드할 수 없어요.",
  errorUnknown: "이 동영상을 다운로드하지 못했어요. 잠시 뒤에 다시 시도하거나 다른 링크를 보내 주세요.",
  inlineHintButton: "봇에 링크 보내기",
  inlineResultTitle: "⬇️ 동영상 다운로드",
  inlineResultDescription: "동영상이 이 채팅에 바로 올라가요",
  inlinePlaceholder: "⏬ 다운로드 중이에요. 몇 분 정도 걸릴 수 있어요...",
  inlineOpenBot: "봇 열기",
  inlineOnlySingleVideo:
    "이 모드에서는 동영상 하나만 보낼 수 있어요. 파일이 여러 개인 게시물이나 사진은 개인 채팅에서 봇에 링크를 보내 주세요.",
  inlineSubscribeRequired: (channel: string) =>
    `다운로드하려면 ${channel}을(를) 구독한 뒤 다시 시도해 주세요.`,
  inlineRateLimited: "연속 요청이 너무 많아요. 1분 정도 기다린 뒤 다시 시도해 주세요.",
  queueRest: (count) => `\n\n📋 대기열에 남은 링크: ${count}개. 이 링크 다음에 하나씩 보여 드릴게요.`,
  queuedOne: (position) =>
    `📋 링크를 대기열에 추가했어요 (${position}번째). 지금 처리 중인 링크를 먼저 끝낸 뒤 이 링크의 화질 선택을 보여 드릴게요.`,
  queuedMany: (added, waiting) =>
    `📋 대기열에 추가한 링크: ${added}개. 전체 대기: ${waiting}개. 지금 링크가 끝나면 하나씩 보여 드릴게요.`,
  queueDuplicates: (count) =>
    count === 1
      ? "이 링크는 이미 대기열에 있어요. 중복으로 추가하지 않을게요."
      : `이미 대기열에 있는 링크는 중복으로 추가하지 않아요 (중복: ${count}개).`,
  queueFull: (limit, rejected) =>
    `대기열에는 링크를 최대 ${limit}개까지 넣을 수 있어요. 초과한 링크는 추가되지 않았어요 (${rejected}개). 대기열이 줄어든 뒤 보내 주세요.`,
  skipButton: "✖️ 다운로드 안 함",
  skipped: "⏭ 이 링크를 건너뛰었어요.",
  chooseTimedOut: "⌛ 30분 동안 화질을 선택하지 않아서 이 링크를 건너뛸게요.",
  queueLostOnRestart: (count) =>
    `⚠️ 업데이트를 위해 봇을 다시 시작하고 있어서 대기열이 초기화되었어요 (링크: ${count}개). 1분 뒤에 다시 보내 주세요.`,
  subtitlesButton: "📝 자막",
  subtitlesBack: "⬅️ 화질 선택으로 돌아가기",
  subtitlesAuto: "자동",
  subtitlesChoose: "자막 언어를 선택해 주세요",
  subtitlesPreparing: "📝 자막을 준비하는 중이에요...",
  subtitlesFailed: "이 언어의 자막을 다운로드하지 못했어요. 다른 언어를 선택해 보세요.",
  subtitlesBusy: "지금 YouTube가 자막을 제공하지 않아요. 몇 분 뒤에 다시 시도해 주세요.",
  playlistFound: (title, count) =>
    `📃 재생목록${title ? ` "${title.slice(0, 150)}"` : ""}: 동영상 ${count}개.\n하나씩 다운로드할게요. 어떤 형식으로 받을까요?`,
  playlistStdButton: "🎬 720p",
  playlistHdButton: "🎬 최고 화질",
  playlistAudioButton: "🎵 오디오만 (mp3)",
  playlistNoButton: "✖️ 괜찮아요",
  playlistQueued: (count) =>
    `📃 재생목록의 동영상을 대기열에 추가했어요: ${count}개. 하나씩 보내 드릴게요. 멈추려면 아래 버튼이나 /stop을 사용하세요.`,
  playlistFailed: "재생목록을 열지 못했어요. 비공개일 수 있어요. 동영상 하나의 링크를 보내 주세요.",
  stopButton: "⏹ 중지",
  stopped: (dropped) => `⏹ 중지했어요.${dropped ? ` 대기열에서 삭제한 링크: ${dropped}개.` : ""}`,
  nothingToStop: "지금 다운로드 중인 것이 없어요.",
  languageChoose: "🌐 봇 언어를 선택해 주세요. \"자동\"은 Telegram 언어를 따라요.",
  languageChooseGroup: "🌐 이 그룹에서 봇이 답장하는 언어예요. \"자동\"은 멤버마다 각자의 Telegram 언어를 따라요.",
  languageAuto: "자동 — Telegram과 같게",
  languageAutoGroup: "자동 — 멤버별 언어",
  languageSaved: (name) => `✅ 봇 언어: ${name}. /language로 변경할 수 있어요.`,
  languageSavedAuto: "✅ 봇이 Telegram 언어를 따라요. /language로 변경할 수 있어요.",
  settingsLanguageButton: (name) => `🌐 언어: ${name ?? "자동"}`,
  settingsBack: "⬅️ 설정으로 돌아가기",
};

const th: Messages = {
  start: "สวัสดี! ส่งลิงก์วิดีโอจาก YouTube, TikTok, Instagram, Facebook, Twitter/X, Vimeo, VK, Rutube, OK.ru, Pinterest หรือ Threads มาได้เลย แล้วเราจะช่วยดาวน์โหลดให้\n\n✨ ไม่จำกัดคุณภาพ: ได้ตามที่แพลตฟอร์มมีให้ สูงสุดถึง 4K ขอแค่ไฟล์ไม่เกิน 2 GB ซึ่งเป็นขีดจำกัดของ Telegram สำหรับบอท ที่นี่ไม่มีฟีเจอร์แบบเสียเงิน\n\nฟรีทั้งหมด: ไม่มีการสมัครสมาชิก ไม่มีโฆษณา ไม่มีการซื้อในแอป\n\n🧩 ดาวน์โหลดบนคอมพิวเตอร์ใช่ไหม? ติดตั้งส่วนขยายเบราว์เซอร์ แล้วปุ่มดาวน์โหลดจะขึ้นบนหน้าวิดีโอเลย: videoner.download/th/extension\n\n👥 เพิ่มเราเข้ากลุ่ม แล้วเราจะโพสต์วิดีโอจากลิงก์ที่สมาชิกแชร์ในกลุ่มให้\n\n⚡ ข้ามการเลือกคุณภาพได้: พิมพ์ -audio ต่อท้ายลิงก์เพื่อเอาแค่เสียง (mp3) หรือ -hd เพื่อคุณภาพดีที่สุด\n\n📣 ข่าวสารโปรเจกต์: @videonerdownload\n\n🌐 ภาษาของบอท: /language",
  notLink: "ข้อความนี้ดูไม่เหมือนลิงก์ ลองส่งลิงก์วิดีโอมาอีกครั้งนะ",
  inviteGreeting: "สวัสดี! เราคือ Videoner ดาวน์โหลดวิดีโอจาก YouTube, TikTok, Instagram และแพลตฟอร์มอื่น ๆ ได้ฟรี กำลังเตรียมวิดีโอที่มีคนแชร์ให้คุณ 👇",
  inviteNotFound: "ไม่พบวิดีโอสำหรับลิงก์เชิญนี้ ส่งลิงก์วิดีโอมา แล้วเราจะดาวน์โหลดให้",
  inviteUnavailable: "เปิดวิดีโอจากลิงก์นี้ไม่ได้ เพราะตอนนี้บริการไม่ตอบสนอง ลองเปิดลิงก์เดิมอีกครั้งในอีกสักนาทีนะ",
  fetchingInfo: "🔍 กำลังดึงข้อมูลวิดีโอ...",
  audioOnlyButton: "🎵 เฉพาะเสียง (mp3)",
  photoButton: "📷 ดาวน์โหลดรูปภาพ",
  slideshowButton: "🎞 สไลด์โชว์ (วิดีโอ)",
  galleryButton: "📷+🎞 รูปภาพและสไลด์โชว์",
  chooseQuality: (title, duration) => `"${title}"${duration ? `\n⏱ ${duration}` : ""}\n\nเลือกคุณภาพ:`,
  sessionExpired: "เซสชันหมดอายุแล้ว ส่งลิงก์มาอีกครั้งนะ",
  downloading: "⏬ กำลังดาวน์โหลด อาจใช้เวลาสักสองสามนาที...",
  downloadFailed: "ดาวน์โหลดไม่สำเร็จ",
  downloadProgress: (percent, eta, done) =>
    `⏬ กำลังดาวน์โหลด: ${percent}%${eta ? ` · เหลืออีก ${eta}` : ""}${done ? `\n${done}` : ""}`,
  downloadFinishing: "⚙️ ใกล้เสร็จแล้ว กำลังรวมไฟล์...",
  converting: (percent) => `⚙️ กำลังแปลงไฟล์: ${percent}%`,
  etaUnderMinute: "ไม่ถึงหนึ่งนาที",
  etaMinutes: (minutes) => `~${minutes} นาที`,
  etaHours: (hours, minutes) => `~${hours} ชม.${minutes ? ` ${minutes} นาที` : ""}`,
  downloadTimeout: "การดาวน์โหลดใช้เวลานานเกินไป ดูเหมือนวิดีโอจะใหญ่มาก ลองเลือกคุณภาพที่ต่ำลง",
  downloadInterrupted: "⚠️ บอทกำลังรีสตาร์ทเพื่ออัปเดต การดาวน์โหลดของคุณถูกขัดจังหวะ ส่งลิงก์มาอีกครั้งในอีกสักนาทีนะ",
  fileTooBig: (mb, url) =>
    `ไฟล์มีขนาดใหญ่ (${mb} MB) Telegram ไม่ยอมให้บอทส่งไฟล์นี้\nดาวน์โหลดได้ที่นี่: ${url}`,
  sendingFile: "📤 กำลังส่งไฟล์...",
  sendingAlbum: (count) => `📤 โพสต์นี้มีหลายไฟล์ (${count}) กำลังส่งเป็นอัลบั้ม...`,
  failedPrefix: "❌ ไม่สำเร็จ: ",
  fileCaption: (title, sourceUrl, shareUrl, description) =>
    composeCaption(
      title,
      description,
      `ที่มา: ${sourceUrl}\n` +
        "ลิขสิทธิ์ทั้งหมดของวิดีโอเป็นของผู้สร้าง\n" +
        "ดาวน์โหลดฟรีด้วย @VideonerBot",
      `📣 ข่าวสารโปรเจกต์: ${NEWS_CHANNEL}`,
      shareUrl && `🔗 แชร์: ${shareUrl}`,
    ),
  subscribeRequired: (channel) =>
    `หากต้องการดาวน์โหลด กรุณาติดตามช่อง ${channel} ของเรา นี่เป็นเงื่อนไขเดียว และบริการยังคงฟรีเหมือนเดิม\n\n` +
    "ติดตามแล้วกด «ติดตามแล้ว»",
  openChannelButton: "📣 เปิดช่อง",
  checkSubscriptionButton: "ติดตามแล้ว",
  subscribeThanks: "ขอบคุณ! ส่งลิงก์วิดีโอมาได้เลย",
  subscribeThanksResuming: "ขอบคุณ! กำลังจัดการลิงก์ของคุณต่อ",
  subscribeStillMissing: "ยังไม่เห็นการติดตาม ติดตามช่องแล้วกดอีกครั้งนะ",
  channelNotice: (channel) => `\n\nลิงก์ของโพสต์นี้จะปรากฏใน ${channel} แบบไม่ระบุตัวตน ไม่มีชื่อของคุณ`,
  channelPost: (title, url) =>
    (title ? `🎬 ${title.slice(0, 200)}\n\n` : "") +
    `${url}\n\n` +
    "ดาวน์โหลดวิดีโอนี้และวิดีโออื่น ๆ ได้ฟรี: @VideonerBot",
  errorStoryNeedsId:
    "ส่งลิงก์ของสตอรี่ที่ต้องการ: เปิดสตอรี่ในแอป Instagram แล้วแตะ แชร์ → คัดลอกลิงก์",
  errorInstagramStory:
    "สตอรี่ Instagram จะเห็นได้เฉพาะคนที่ล็อกอินอยู่เท่านั้น",
  errorLoginRequired:
    "โพสต์นี้ดูไม่ได้หากไม่ล็อกอิน: แพลตฟอร์มแสดงให้เฉพาะ " +
    "ผู้ใช้ที่ล็อกอินอยู่ ซึ่งเกิดขึ้นกับโพสต์ส่วนตัว เนื้อหาที่จำกัดอายุ " +
    "และโพสต์ที่แชร์ให้ผู้ชมกลุ่มจำกัด\n\n" +
    "โพสต์สาธารณะดาวน์โหลดได้ไม่มีปัญหา ลองลิงก์อื่นดูนะ",
  errorUnsupportedPlatform:
    "ไม่รู้จักลิงก์นี้ ตรวจสอบว่าเป็นลิงก์วิดีโอโดยตรงจาก YouTube, TikTok, Instagram, Facebook, Twitter/X, Vimeo, VK, Rutube, OK.ru, Pinterest หรือ Threads",
  errorFileTooLarge: "ไฟล์ใหญ่กว่า 2 GB และ Telegram ไม่ยอมให้บอทส่งไฟล์ที่ใหญ่กว่านี้ ดาวน์โหลดได้บนเว็บไซต์หรือด้วยส่วนขยายเบราว์เซอร์ (ปุ่มด้านล่าง) หรือส่งลิงก์มาอีกครั้งแล้วเลือกคุณภาพที่ต่ำลง",
  siteButton: "🌐 ดาวน์โหลดบนเว็บไซต์",
  qualitiesHiddenBySize: (limit) =>
    `\n\n⚖️ ซ่อนคุณภาพที่ใหญ่กว่า ${limit} ไว้: Telegram ไม่ยอมให้บอทส่งไฟล์ที่ใหญ่กว่านี้ ดาวน์โหลดได้บนเว็บไซต์หรือด้วยส่วนขยายเบราว์เซอร์ (ปุ่มด้านล่าง)`,
  videoTooBigForTelegram: (smallest) =>
    `\n\n⚖️ วิดีโอนี้ใหญ่เกินไปสำหรับ Telegram แม้ในคุณภาพต่ำสุด (~${smallest}): Telegram ไม่ยอมให้บอทส่งไฟล์เกิน 2 GB ที่นี่รับได้เฉพาะเสียง ส่วนวิดีโอดาวน์โหลดได้บนเว็บไซต์หรือด้วยส่วนขยายเบราว์เซอร์ (ปุ่มด้านล่าง)`,
  errorFormatUnavailable: "วิดีโอนี้ไม่มีคุณภาพที่เลือก ส่งลิงก์มาอีกครั้ง แล้วเราจะแสดงรายการล่าสุดให้",
  errorNoVideoContent: "ลิงก์นี้ไม่มีวิดีโอให้ดาวน์โหลด ดูเหมือนโพสต์จะมีแค่รูปภาพ",
  errorRegionBlocked:
    "วิดีโอนี้ถูกบล็อกนอกประเทศของผู้สร้าง แพลตฟอร์มจึงไม่ส่ง " +
    "ให้เซิร์ฟเวอร์ของเรา ไม่มีทางเลี่ยงได้ เพราะข้อจำกัดอยู่ที่ฝั่งแพลตฟอร์ม" +
    "\n\nลิงก์อื่นยังดาวน์โหลดได้ตามปกติ",
  errorRateLimited: "ส่งลิงก์ติดกันมากเกินไป รอสักครู่แล้วส่งใหม่นะ",
  errorYoutubeDailyLimit: (gb) => `คุณดาวน์โหลดจาก YouTube เกิน ${gb} GB ใน 24 ชั่วโมงที่ผ่านมา ซึ่งเป็นขีดจำกัดรายวันต่อคนของบอท ระบบนับย้อนหลัง 24 ชั่วโมง จึงดาวน์โหลดวิดีโอ YouTube ใหม่ได้อีกในภายหลัง แพลตฟอร์มอื่นยังใช้ได้ตามปกติ`,
  playlistStoppedByLimit: (dropped) => `⏹ หยุดเพลย์ลิสต์แล้ว: ถึงขีดจำกัด YouTube รายวัน วิดีโอที่ยังไม่ได้ดาวน์โหลด: ${dropped} ส่งลิงก์เพลย์ลิสต์มาใหม่ภายหลังนะ`,
  errorPlatformRefused:
    "แพลตฟอร์มไม่ส่งวิดีโอนี้ให้เซิร์ฟเวอร์ของเรา ซึ่งเกิดขึ้นกับโพสต์ส่วนตัว " +
    "หรือโพสต์ที่จำกัดอายุ และบางครั้งแพลตฟอร์มก็จำกัดการเข้าถึง " +
    "ชั่วคราว ลองใหม่อีกครั้งในอีกไม่กี่นาที",
  errorThreadsNoMedia:
    "ไม่พบวิดีโอหรือรูปภาพในโพสต์ Threads นี้ อาจเป็นโพสต์ข้อความล้วน หรือ " +
    "Threads แสดงสื่อให้เฉพาะผู้ใช้ที่ล็อกอินอยู่ โพสต์แบบนี้ดาวน์โหลดไม่ได้หากไม่ล็อกอิน",
  extensionHint:
    "\n\n💻 ดาวน์โหลดได้ด้วยส่วนขยายเบราว์เซอร์ Videoner บนคอมพิวเตอร์: " +
    "ส่วนขยายจะดาวน์โหลดโดยใช้การล็อกอินของคุณบนแพลตฟอร์ม และรหัสผ่านหรือคุกกี้จะไม่ออกไปจากเบราว์เซอร์ของคุณ",
  privateConnectHint: (platform, withExtension) =>
    `\n\n🔑 หากต้องการดาวน์โหลดโพสต์แบบนี้ ให้เชื่อมต่อบัญชี ${platform} ของคุณกับบอทเพียงครั้งเดียว หลังจากนั้นบอทจะดาวน์โหลดทุกอย่างที่คุณเห็นได้ ทั้งโพสต์ส่วนตัว รีล และสตอรี่ จากมือถือก็ได้ ดูวิธีได้ที่ปุ่มด้านล่าง${withExtension ? "\n\n💻 หรือดาวน์โหลดด้วยส่วนขยายเบราว์เซอร์ Videoner บนคอมพิวเตอร์" : ""}`,
  privateReconnectHint: (platform, withExtension) =>
    `\n\n⚠️ บัญชี ${platform} ที่เชื่อมต่อไว้เปิดโพสต์นี้ไม่ได้ การล็อกอินอาจใช้งานไม่ได้แล้ว ลองเชื่อมต่อบัญชีใหม่อีกครั้ง หรือบัญชีนี้อาจไม่มีสิทธิ์เข้าถึงโพสต์${withExtension ? "\n\n💻 หรือดาวน์โหลดด้วยส่วนขยายเบราว์เซอร์ Videoner บนคอมพิวเตอร์ก็ได้" : ""}`,
  connectAccountButton: "🔑 เชื่อมต่อบัญชี",
  reconnectAccountButton: "🔑 เชื่อมต่อใหม่",
  extensionButton: "🧩 ดาวน์โหลดด้วยส่วนขยาย",
  extensionCommand:
    "🧩 Videoner สำหรับเบราว์เซอร์: ปุ่มดาวน์โหลดบนหน้าวิดีโอโดยตรง รองรับ YouTube, Instagram, TikTok, VK, วิดีโอส่วนตัวจากบัญชีของคุณ และบทเรียน GetCourse\n\nสำหรับ Chrome, Edge, Opera, Yandex Browser และ Firefox บนคอมพิวเตอร์",
  extensionPageButton: "🧩 ติดตั้งส่วนขยาย",
  addToGroupButton: "👥 เพิ่มเข้ากลุ่ม",
  newsButton: "📣 ข่าวสารโปรเจกต์",
  fileCaptionShort: (title, sourceUrl) =>
    withOptionalLines((title ? `🎬 ${title.slice(0, 200)}\n\n` : "") + sourceUrl, `📣 ข่าวสารโปรเจกต์: ${NEWS_CHANNEL}`, undefined),
  sentBy: (name) => `👤 ${name}`,
  groupSettings: (s, canDelete) =>
    "⚙️ การตั้งค่าบอทสำหรับกลุ่มนี้\n\n" +
    `🗑 ลบข้อความที่มีลิงก์: ${s.deleteLinks ? "ใช่" : "ไม่"}\n` +
    "เมื่อส่งวิดีโอแล้ว ข้อความที่มีแค่ลิงก์จะถูกลบ ในแชตจะเหลือแค่วิดีโอพร้อมชื่อของคนที่แชร์\n" +
    (s.deleteLinks && !canDelete
      ? "⚠️ ตอนนี้เราลบข้อความไม่ได้: ตั้งเราเป็นแอดมินพร้อมสิทธิ์ \"ลบข้อความ\"\n"
      : "") +
    `\n✍️ คำบรรยายใต้วิดีโอ: ${{ full: "แบบเต็ม", short: "ชื่อและที่มา", none: "ไม่มีคำบรรยาย" }[s.caption] ?? s.caption}\n` +
    `\n🎞 คุณภาพ: ${s.quality === "max" ? "สูงสุดที่ Telegram รับได้" : "มาตรฐาน (720p)"}\n` +
    `\n⏱ วิดีโอยาว: ${s.longVideos ? "ทุกความยาว" : "ไม่เกิน 15 นาทีเท่านั้น"}\n` +
    `\n🔑 ใครเชื่อมต่อบัญชีได้ (สำหรับสตอรี่และโพสต์ส่วนตัว): ${s.cookiesBy === "all" ? "สมาชิกทุกคน" : "แอดมินเท่านั้น"}\n` +
    `\n🌐 ภาษาที่ใช้ตอบ: ${s.language ? langName(s.language) : "ตามภาษาของสมาชิกแต่ละคน"}\n` +
    "\nเฉพาะแอดมินของกลุ่มเท่านั้นที่เปลี่ยนการตั้งค่าได้",
  settingsDeleteButton: (on) => `🗑 ลบลิงก์: ${on ? "ใช่" : "ไม่"}`,
  settingsCaptionButton: (style) => `✍️ คำบรรยาย: ${{ full: "เต็ม", short: "สั้น", none: "ไม่มี" }[style] ?? style}`,
  settingsQualityButton: (mode) => `🎞 คุณภาพ: ${mode === "max" ? "สูงสุด" : "720p"}`,
  settingsLongButton: (on) => `⏱ วิดีโอยาว: ${on ? "ใช่" : "ไม่เกิน 15 นาที"}`,
  settingsDoneButton: "✅ เสร็จสิ้น",
  settingsAdminsOnly: "เฉพาะแอดมินของกลุ่มเท่านั้นที่เปลี่ยนการตั้งค่าได้",
  settingsGroupsOnly: "การตั้งค่านี้ใช้สำหรับกลุ่ม: เพิ่มเราเข้ากลุ่มแล้วส่ง /settings ในกลุ่มนั้น",
  settingsFailed: "บันทึกการตั้งค่าไม่สำเร็จ ลองอีกครั้งนะ",
  settingsCookiesButton: (by) => `🔑 การเชื่อมต่อบัญชี: ${by === "all" ? "ทุกคน" : "แอดมิน"}`,
  accountsIntro:
    "🔑 บัญชีที่เชื่อมต่อไว้\n\nบอทดาวน์โหลดเนื้อหาที่เห็นได้เฉพาะคนที่ล็อกอิน (สตอรี่ Instagram, โพสต์ส่วนตัว) ได้โดยใช้บัญชีของคุณ การล็อกอินจะใช้ได้ในที่ที่คุณเชื่อมต่อไว้: บัญชีที่เชื่อมต่อในแชตส่วนตัวใช้กับการดาวน์โหลดของคุณ รวมถึงลิงก์ที่คุณส่งในกลุ่มที่ไม่มีบัญชีของตัวเอง ส่วนบัญชีที่เชื่อมต่อกับกลุ่มใช้ได้กับสมาชิกทุกคนในกลุ่มนั้น",
  accountsHowTo:
    "วิธีเชื่อมต่อ:\n1. ง่ายที่สุด: ใช้ส่วนขยาย Videoner บนคอมพิวเตอร์ ล็อกอินบนเว็บไซต์ของแพลตฟอร์ม เปิดป๊อปอัป Videoner กด «🔑 เชื่อมต่อบัญชี … ของคุณกับบอท» แล้วส่งรหัสมาให้เรา หากเป็นกลุ่ม ให้ส่ง /connect รหัส ในกลุ่มนั้น\n2. หรือส่งไฟล์ cookies.txt (คุกกี้ที่ส่งออกจากเบราว์เซอร์) หรือวางเนื้อหาของไฟล์เป็นข้อความ\n3. จากมือถือ Android ใช้ Firefox กับส่วนเสริม Cookie-Editor: https://videoner.download/th/blog/android-firefox",
  accountsWarning:
    "⚠️ แพลตฟอร์มไม่ชอบการดาวน์โหลดอัตโนมัติ และอาจจำกัดหรือแบนบัญชีได้ ควรเชื่อมต่อบัญชีสำรอง ไม่ใช่บัญชีหลัก คุกกี้จะถูกเก็บแบบเข้ารหัส ใช้เพื่อดาวน์โหลดเท่านั้น และลบได้ด้วยปุ่มด้านล่าง",
  accountsNone: "ยังไม่มีบัญชีที่เชื่อมต่อ",
  accountsGroupTitle: "🔑 บัญชีที่เชื่อมต่อกับกลุ่มนี้",
  accountsGroupHowTo:
    "หากต้องการเชื่อมต่อสำหรับทั้งกลุ่ม: รับรหัสด้วยปุ่ม «🔑 เชื่อมต่อบัญชี … ของคุณกับบอท» ในส่วนขยาย Videoner แล้วส่ง /connect รหัส ที่นี่ หากคุณเชื่อมต่อบัญชีไว้เฉพาะในแชตส่วนตัว บอทจะใช้บัญชีนั้นที่นี่กับลิงก์ของคุณเอง การเชื่อมต่อของคุณ: /accounts ในแชตส่วนตัวกับ @VideonerBot",
  accountsLine: (platform, where, active) => `• ${platform} — ${where}${active ? "" : " (⚠️ ล็อกอินใช้งานไม่ได้)"}`,
  accountsGroupLine: (platform, owner, active) => `• ${platform} — ${owner}${active ? "" : " (⚠️ ล็อกอินใช้งานไม่ได้)"}`,
  accountsWhereHere: "แชตส่วนตัว",
  accountsWhereGroup: (title) => `กลุ่ม "${title}"`,
  accountsDeleteButton: (platform, where) => `🗑 ${platform} · ${where}`,
  accountsDeleteAllButton: "🗑 ลบการเชื่อมต่อทั้งหมดของฉัน",
  accountsDeleted: "ลบแล้ว",
  accountsDeletedAll: (n) => `ลบการเชื่อมต่อแล้ว: ${n}`,
  accountsNotAllowed: "เฉพาะคนที่เชื่อมต่อไว้หรือแอดมินของกลุ่มเท่านั้นที่ลบได้",
  connectUsage:
    "ส่ง /connect รหัส โดยรับรหัสได้จากปุ่ม «🔑 เชื่อมต่อบัญชี … ของคุณกับบอท» ในส่วนขยาย Videoner บนคอมพิวเตอร์ การเชื่อมต่อของคุณ: /accounts",
  connectOnlyAdmins: "เฉพาะแอดมินเท่านั้นที่เชื่อมต่อบัญชีกับกลุ่มนี้ได้ (ดู /settings)",
  connectDone: (platform, where) =>
    `✅ เชื่อมต่อ ${platform} ${where}แล้ว ตอนนี้บอทดาวน์โหลดเนื้อหาที่เห็นได้เฉพาะคนที่ล็อกอินได้ด้วย ดูหรือลบได้ที่: /accounts\n\n⚠️ แพลตฟอร์มอาจจำกัดบัญชีเพราะการดาวน์โหลดอัตโนมัติ ควรใช้บัญชีสำรอง`,
  connectWhereGroup: "กับกลุ่มนี้",
  connectWhereHere: "สำหรับการดาวน์โหลดของคุณในแชตส่วนตัวและโหมดอินไลน์",
  connectCodeNotFound: "ไม่พบรหัสหรือรหัสหมดอายุแล้ว (รหัสใช้ได้ 10 นาที) รับรหัสใหม่ได้ในส่วนขยาย Videoner",
  connectRejectedNoSession: "คุกกี้เหล่านี้ไม่มีข้อมูลการล็อกอิน ล็อกอินบนเว็บไซต์ของแพลตฟอร์มแล้วส่งออกคุกกี้อีกครั้ง",
  connectRejectedUnknown: "ไม่พบคุกกี้ของแพลตฟอร์มที่รองรับ: Instagram, Facebook, YouTube, X, VK, TikTok",
  connectUnavailable: "ยังเชื่อมต่อบัญชีไม่ได้ในตอนนี้",
  connectFailed: "เชื่อมต่อไม่สำเร็จ ลองอีกครั้งนะ",
  connectFileTooBig: "ไฟล์ใหญ่เกินไป ส่งออกเฉพาะคุกกี้ของเว็บไซต์ที่ต้องการ",
  connectNotAnonymous: "เชื่อมต่อบัญชีในนามของคุณเอง ไม่ใช่แบบไม่ระบุตัวตนในนามกลุ่ม ไม่อย่างนั้นการเชื่อมต่อของแอดมินจะปนกัน เราทำลายรหัสนี้แล้ว รับรหัสใหม่ได้เลย",
  connectCodeInGroup:
    "รหัสเชื่อมต่อที่โพสต์ในแชตกลุ่มอาจถูกคนอื่นเห็น เราจึงทำลายรหัสและลบข้อความแล้ว รับรหัสใหม่แล้วส่งด้วย /connect รหัส เราจะลบข้อความคำสั่งนั้นทันที",
  groupWelcome:
    "👋 สวัสดี! โพสต์ลิงก์วิดีโอจาก TikTok, Instagram, YouTube, VK และแพลตฟอร์มอื่น ๆ ในแชตนี้ได้เลย แล้วเราจะตอบกลับด้วยตัววิดีโอ\n\n" +
    "เราดาวน์โหลดคลิปยาวไม่เกิน 15 นาทีให้เองโดยไม่ต้องใช้คำสั่ง และจะไม่รบกวนในเรื่องอื่น\n\n⚙️ แอดมินของกลุ่มปรับแต่งเราได้ด้วย /settings: ลบข้อความลิงก์ รูปแบบคำบรรยาย คุณภาพ วิดีโอยาว และภาษา\n\n⚡ พิมพ์ -audio ต่อท้ายลิงก์เพื่อเอาแค่เสียง หรือ -hd เพื่อคุณภาพดีที่สุด\n\n📣 ข่าวสารโปรเจกต์: @videonerdownload",
  errorTooLong: "วิดีโอยาวเกินไป ตอนนี้เรายังดาวน์โหลดวิดีโอยาวขนาดนี้ไม่ได้",
  errorUnknown: "ดาวน์โหลดวิดีโอนี้ไม่ได้ ลองใหม่ภายหลังหรือส่งลิงก์อื่นมานะ",
  inlineHintButton: "ส่งลิงก์ให้บอท",
  inlineResultTitle: "⬇️ ดาวน์โหลดวิดีโอ",
  inlineResultDescription: "วิดีโอจะถูกโพสต์ในแชตนี้โดยตรง",
  inlinePlaceholder: "⏬ กำลังดาวน์โหลด อาจใช้เวลาสักสองสามนาที...",
  inlineOpenBot: "เปิดบอท",
  inlineOnlySingleVideo:
    "โหมดนี้ส่งได้ทีละหนึ่งวิดีโอ สำหรับโพสต์ที่มีหลายไฟล์หรือรูปภาพ ให้ส่งลิงก์ให้บอทในแชตส่วนตัว",
  inlineSubscribeRequired: (channel: string) =>
    `หากต้องการดาวน์โหลด ให้ติดตาม ${channel} แล้วลองอีกครั้ง`,
  inlineRateLimited: "ส่งคำขอติดกันมากเกินไป รอสักนาทีแล้วลองอีกครั้ง",
  queueRest: (count) => `\n\n📋 ลิงก์ที่ยังอยู่ในคิว: ${count} เราจะแสดงทีละลิงก์หลังจากลิงก์นี้`,
  queuedOne: (position) =>
    `📋 เพิ่มลิงก์เข้าคิวแล้ว ลำดับที่ ${position} ขอจัดการลิงก์ปัจจุบันให้เสร็จก่อน แล้วจะแสดงตัวเลือกคุณภาพของลิงก์นี้`,
  queuedMany: (added, waiting) =>
    `📋 เพิ่มลิงก์เข้าคิวแล้ว: ${added} รอทั้งหมด: ${waiting} เราจะแสดงทีละลิงก์หลังจากลิงก์ปัจจุบัน`,
  queueDuplicates: (count) =>
    count === 1
      ? "ลิงก์นี้อยู่ในคิวแล้ว จะไม่เพิ่มซ้ำ"
      : `ลิงก์ที่อยู่ในคิวแล้วจะไม่ถูกเพิ่มซ้ำ (ซ้ำ: ${count})`,
  queueFull: (limit, rejected) =>
    `คิวรับได้สูงสุด ${limit} ลิงก์ ลิงก์ที่เกินมาไม่ได้ถูกเพิ่ม (${rejected}) ส่งมาใหม่เมื่อคิวขยับแล้วนะ`,
  skipButton: "✖️ ไม่ต้องดาวน์โหลด",
  skipped: "⏭ ข้ามลิงก์นี้แล้ว",
  chooseTimedOut: "⌛ ไม่ได้เลือกคุณภาพภายใน 30 นาที ข้ามลิงก์นี้",
  queueLostOnRestart: (count) =>
    `⚠️ บอทกำลังรีสตาร์ทเพื่ออัปเดต คิวถูกรีเซ็ต (ลิงก์: ${count}) ส่งลิงก์มาอีกครั้งในอีกสักนาทีนะ`,
  subtitlesButton: "📝 ซับไตเติล",
  subtitlesBack: "⬅️ กลับไปเลือกคุณภาพ",
  subtitlesAuto: "อัตโนมัติ",
  subtitlesChoose: "เลือกภาษาซับไตเติล",
  subtitlesPreparing: "📝 กำลังเตรียมซับไตเติล...",
  subtitlesFailed: "ดาวน์โหลดซับไตเติลภาษานี้ไม่ได้ ลองเลือกภาษาอื่น",
  subtitlesBusy: "ตอนนี้ YouTube ไม่ส่งซับไตเติลให้ ลองใหม่ในอีกไม่กี่นาที",
  playlistFound: (title, count) =>
    `📃 เพลย์ลิสต์${title ? ` "${title.slice(0, 150)}"` : ""}: ${count} วิดีโอ\nเราจะดาวน์โหลดให้ทีละรายการ เลือกรูปแบบไหนดี?`,
  playlistStdButton: "🎬 720p",
  playlistHdButton: "🎬 คุณภาพดีที่สุด",
  playlistAudioButton: "🎵 เฉพาะเสียง (mp3)",
  playlistNoButton: "✖️ ไม่ล่ะ ขอบคุณ",
  playlistQueued: (count) =>
    `📃 เพิ่มวิดีโอจากเพลย์ลิสต์เข้าคิวแล้ว: ${count} เราจะส่งให้ทีละรายการ หยุดได้ด้วยปุ่มด้านล่างหรือ /stop`,
  playlistFailed: "เปิดเพลย์ลิสต์ไม่ได้ อาจเป็นเพลย์ลิสต์ส่วนตัว ส่งลิงก์ของวิดีโอเดียวมาแทนนะ",
  stopButton: "⏹ หยุด",
  stopped: (dropped) => `⏹ หยุดแล้ว${dropped ? ` ลบลิงก์ออกจากคิว: ${dropped}` : ""}`,
  nothingToStop: "ตอนนี้ไม่มีอะไรกำลังดาวน์โหลด",
  languageChoose: "🌐 เลือกภาษาของบอท \"อัตโนมัติ\" จะใช้ตามภาษา Telegram ของคุณ",
  languageChooseGroup: "🌐 ภาษาที่บอทใช้ตอบในกลุ่มนี้ \"อัตโนมัติ\" คือตามภาษา Telegram ของสมาชิกแต่ละคน",
  languageAuto: "อัตโนมัติ — ตาม Telegram",
  languageAutoGroup: "อัตโนมัติ — ตามภาษาของแต่ละคน",
  languageSaved: (name) => `✅ ภาษาของบอท: ${name} เปลี่ยนได้ด้วย /language`,
  languageSavedAuto: "✅ บอทจะใช้ภาษาตาม Telegram ของคุณ เปลี่ยนได้ด้วย /language",
  settingsLanguageButton: (name) => `🌐 ภาษา: ${name ?? "อัตโนมัติ"}`,
  settingsBack: "⬅️ กลับไปที่การตั้งค่า",
};

const am: Messages = {
  start: "ሰላም! ከYouTube፣ TikTok፣ Instagram፣ Facebook፣ Twitter/X፣ Vimeo፣ VK፣ Rutube፣ OK.ru፣ Pinterest ወይም Threads የቪዲዮ ሊንክ ይላኩልኝ — ለማውረድ እረዳዎታለሁ።\n\n✨ የጥራት ገደብ የለም፦ መድረኩ የሚያቀርበውን ሁሉ እስከ 4K ድረስ ያገኛሉ — ፋይሉ ከ2 GB እስካልበለጠ ድረስ፤ ይህ Telegram ለቦቶች ያስቀመጠው ገደብ ነው። እዚህ ምንም የሚከፈልባቸው ባህሪያት የሉም።\n\nሙሉ በሙሉ ነፃ፦ ምዝገባ የለም፣ ማስታወቂያ የለም፣ በመተግበሪያ ውስጥ ግዢ የለም።\n\n🧩 በኮምፒውተር ላይ ነው የሚያወርዱት? የአሳሽ ቅጥያውን ይጫኑ — የማውረጃ ቁልፍ በቪዲዮው ገጽ ላይ በቀጥታ ይታያል፦ videoner.download/am/extension\n\n👥 ወደ ቡድን ያክሉኝ፤ ሰዎች እዚያ ለሚያጋሯቸው ሊንኮች ቪዲዮዎቹን እለጥፋለሁ።\n\n⚡ የጥራት ምርጫውን ይዝለሉ፦ ድምፅ ብቻ (mp3) ለማግኘት ከሊንኩ በኋላ -audio ይጨምሩ፤ ለምርጥ ጥራት ደግሞ -hd ይጨምሩ።\n\n📣 የፕሮጀክቱ ዜና፦ @videonerdownload\n\n🌐 የቦቱ ቋንቋ፦ /language",
  notLink: "ይህ ሊንክ አይመስልም። እባክዎ የቪዲዮ ሊንክ ይላኩልኝ።",
  inviteGreeting: "ሰላም! እኔ Videoner ነኝ — ከYouTube፣ TikTok፣ Instagram እና ከሌሎች መድረኮች ቪዲዮዎችን በነፃ አወርዳለሁ። አንድ ሰው ያጋራዎትን ቪዲዮ እያዘጋጀሁ ነው 👇",
  inviteNotFound: "ለዚህ የግብዣ ሊንክ ቪዲዮ ማግኘት አልቻልኩም። የቪዲዮ ሊንክ ይላኩልኝ፣ አወርደዋለሁ።",
  inviteUnavailable: "ከዚህ ሊንክ ቪዲዮውን መክፈት አልቻልኩም — አገልግሎቱ አሁን ምላሽ እየሰጠ አይደለም። ከአንድ ደቂቃ በኋላ ያንኑ ሊንክ እንደገና ይክፈቱ።",
  fetchingInfo: "🔍 የቪዲዮውን መረጃ በማምጣት ላይ...",
  audioOnlyButton: "🎵 ድምፅ ብቻ (mp3)",
  photoButton: "📷 ፎቶዎችን ያውርዱ",
  slideshowButton: "🎞 ስላይድ ትዕይንት (ቪዲዮ)",
  galleryButton: "📷+🎞 ፎቶዎች እና ስላይድ ትዕይንት",
  chooseQuality: (title, duration) => `«${title}»${duration ? `\n⏱ ${duration}` : ""}\n\nጥራት ይምረጡ፦`,
  sessionExpired: "ክፍለ ጊዜው አብቅቷል — ሊንኩን እንደገና ይላኩ",
  downloading: "⏬ በማውረድ ላይ፣ ይህ ጥቂት ደቂቃዎች ሊወስድ ይችላል...",
  downloadFailed: "ማውረዱ አልተሳካም",
  downloadProgress: (percent, eta, done) =>
    `⏬ በማውረድ ላይ፦ ${percent}%${eta ? ` · የቀረው ${eta}` : ""}${done ? `\n${done}` : ""}`,
  downloadFinishing: "⚙️ ሊጠናቀቅ ነው — ፋይሉን በማቀናጀት ላይ...",
  converting: (percent) => `⚙️ በመቀየር ላይ፦ ${percent}%`,
  etaUnderMinute: "ከአንድ ደቂቃ ያነሰ",
  etaMinutes: (minutes) => `~${minutes} ደቂቃ`,
  etaHours: (hours, minutes) => `~${hours} ሰዓት${minutes ? ` ${minutes} ደቂቃ` : ""}`,
  downloadTimeout: "ማውረዱ በጣም እየቆየ ነው — ቪዲዮው በጣም ከባድ ይመስላል። ዝቅተኛ ጥራት ይሞክሩ።",
  downloadInterrupted: "⚠️ ቦቱ ለማዘመን እንደገና እየጀመረ ነው — ማውረድዎ ተቋርጧል። እባክዎ ከአንድ ደቂቃ በኋላ ሊንኩን እንደገና ይላኩ።",
  fileTooBig: (mb, url) =>
    `ፋይሉ ትልቅ ሆኗል (${mb} MB) — Telegram ቦቱ እንዲልከው አይፈቅድም።\nእዚህ ያውርዱት፦ ${url}`,
  sendingFile: "📤 ፋይሉን በመላክ ላይ...",
  sendingAlbum: (count) => `📤 ይህ ልጥፍ በርካታ ፋይሎች (${count}) አሉት — እንደ አልበም በመላክ ላይ...`,
  failedPrefix: "❌ አልተሳካም፦ ",
  fileCaption: (title, sourceUrl, shareUrl, description) =>
    composeCaption(
      title,
      description,
      `ምንጭ፦ ${sourceUrl}\n` +
        "የቪዲዮው መብቶች ሁሉ የደራሲው ናቸው።\n" +
        "በ @VideonerBot በነፃ የወረደ",
      `📣 የፕሮጀክቱ ዜና፦ ${NEWS_CHANNEL}`,
      shareUrl && `🔗 ያጋሩ፦ ${shareUrl}`,
    ),
  subscribeRequired: (channel) =>
    `ለማውረድ እባክዎ ቻናላችንን ${channel} ይቀላቀሉ — ይህ ብቸኛው ቅድመ ሁኔታ ነው፤ አገልግሎቱ ነፃ ሆኖ ይቀጥላል።\n\n` +
    "ይቀላቀሉና «ተቀላቅያለሁ» የሚለውን ይጫኑ።",
  openChannelButton: "📣 ቻናሉን ይክፈቱ",
  checkSubscriptionButton: "ተቀላቅያለሁ",
  subscribeThanks: "እናመሰግናለን! አሁን የቪዲዮ ሊንክ ይላኩልኝ።",
  subscribeThanksResuming: "እናመሰግናለን! ሊንክዎን አሁን እቀጥላለሁ።",
  subscribeStillMissing: "እስካሁን መቀላቀልዎን አላየሁም። ይቀላቀሉና እንደገና ይጫኑ።",
  channelNotice: (channel) => `\n\nየዚህ ልጥፍ ሊንክ በ${channel} ላይ ይታያል — ስምዎ ሳይጠቀስ፣ ማንነትዎ ሳይገለጽ።`,
  channelPost: (title, url) =>
    (title ? `🎬 ${title.slice(0, 200)}\n\n` : "") +
    `${url}\n\n` +
    "ይህንና ሌላ ማንኛውንም ቪዲዮ በነፃ ያውርዱ፦ @VideonerBot",
  errorStoryNeedsId:
    "የአንድን የተወሰነ ስቶሪ ሊንክ ይላኩ፦ በInstagram መተግበሪያ ውስጥ ይክፈቱትና Share → Copy link የሚለውን ይንኩ።",
  errorInstagramStory:
    "የInstagram ስቶሪዎች የሚታዩት ለገቡ (sign in ላደረጉ) ሰዎች ብቻ ነው።",
  errorLoginRequired:
    "ይህ ልጥፍ ሳይገቡ አይገኝም፦ መድረኩ የሚያቀርበው ለገቡ ተጠቃሚዎች ብቻ ነው። " +
    "ይህ የሚሆነው በግል ልጥፎች፣ የዕድሜ ገደብ ባለባቸው ይዘቶች እና " +
    "ለተወሰኑ ተመልካቾች በተጋሩ ልጥፎች ላይ ነው።\n\n" +
    "ይፋዊ ልጥፎች ያለችግር ይወርዳሉ — ሌላ ሊንክ ይሞክሩ።",
  errorUnsupportedPlatform:
    "ይህን ሊንክ መለየት አልቻልኩም — ከYouTube፣ TikTok፣ Instagram፣ Facebook፣ Twitter/X፣ Vimeo፣ VK፣ Rutube፣ OK.ru፣ Pinterest ወይም Threads የመጣ ቀጥተኛ የቪዲዮ ሊንክ መሆኑን ያረጋግጡ።",
  errorFileTooLarge: "ፋይሉ ከ2 GB ይበልጣል — Telegram ቦቶች ከዚህ የሚበልጡ ፋይሎችን እንዲልኩ አይፈቅድም። በድረ-ገጹ ላይ ወይም በአሳሽ ቅጥያው ያውርዱት — ቁልፎቹ ከታች ናቸው። ወይም ሊንኩን እንደገና ልከው ዝቅተኛ ጥራት ይምረጡ።",
  siteButton: "🌐 በድረ-ገጹ ላይ ያውርዱ",
  qualitiesHiddenBySize: (limit) =>
    `\n\n⚖️ ከ${limit} የሚከብዱ ጥራቶች ተደብቀዋል፦ Telegram ቦቶች ከዚህ የሚበልጡ ፋይሎችን እንዲልኩ አይፈቅድም። በድረ-ገጹ ላይ ወይም በአሳሽ ቅጥያው ማውረድ ይችላሉ — ቁልፎቹ ከታች ናቸው።`,
  videoTooBigForTelegram: (smallest) =>
    `\n\n⚖️ ይህ ቪዲዮ በዝቅተኛው ጥራትም ቢሆን ለTelegram በጣም ከባድ ነው (~${smallest})፦ Telegram ቦቶች ከ2 GB በላይ የሆኑ ፋይሎችን እንዲልኩ አይፈቅድም። እዚህ ድምፁን ብቻ ማግኘት ይችላሉ፤ ቪዲዮውን ደግሞ — በድረ-ገጹ ላይ ወይም በአሳሽ ቅጥያው (ቁልፎቹ ከታች ናቸው)።`,
  errorFormatUnavailable: "ይህ ጥራት ለዚህ ቪዲዮ አይገኝም። ሊንኩን እንደገና ይላኩ — ወቅታዊውን ዝርዝር አሳይዎታለሁ።",
  errorNoVideoContent: "ይህ ሊንክ የሚወርድ ቪዲዮ የለውም — ልጥፉ ፎቶዎችን ብቻ የያዘ ይመስላል።",
  errorRegionBlocked:
    "ይህ ቪዲዮ ከደራሲው ሀገር ውጭ ታግዷል — መድረኩ ለአገልጋያችን " +
    "አያቀርበውም። ማለፊያ መንገድ የለም፦ ገደቡ ያለው በእነሱ በኩል ነው።" +
    "\n\nሌሎች ሊንኮች እንደተለመደው ይወርዳሉ።",
  errorRateLimited: "በተከታታይ በጣም ብዙ ሊንኮች ልከዋል — ትንሽ ይጠብቁና እንደገና ይላኩ።",
  errorYoutubeDailyLimit: (gb) => `ባለፉት 24 ሰዓታት ከYouTube ከ${gb} GB በላይ አውርደዋል — ይህ የቦቱ የአንድ ሰው የዕለት ገደብ ነው። ገደቡ የሚቆጠረው ባለፉት 24 ሰዓታት ውስጥ ስለሆነ፣ አዳዲስ የYouTube ቪዲዮዎችን ትንሽ ቆይተው ማውረድ ይችላሉ። ሌሎች መድረኮች እንደተለመደው ይሰራሉ።`,
  playlistStoppedByLimit: (dropped) => `⏹ የአጫዋች ዝርዝሩ ቆሟል፦ የYouTube የዕለት ገደብ ደርሷል። ያልወረዱ ቪዲዮዎች፦ ${dropped}። የአጫዋች ዝርዝሩን ሊንክ በኋላ እንደገና ይላኩ።`,
  errorPlatformRefused:
    "መድረኩ ይህን ቪዲዮ ለአገልጋያችን አልሰጠም። ይህ የሚሆነው በግል " +
    "ወይም የዕድሜ ገደብ ባለባቸው ልጥፎች ላይ ነው፤ አንዳንድ ጊዜ ደግሞ መድረኩ ለተወሰነ ጊዜ " +
    "መዳረሻን ይገድባል። ከጥቂት ደቂቃዎች በኋላ እንደገና ይሞክሩ።",
  errorThreadsNoMedia:
    "በዚህ የThreads ልጥፍ ውስጥ ምንም ቪዲዮ ወይም ፎቶ አይታይም። ወይ ጽሑፍ ብቻ ያለው ልጥፍ ነው፣ ወይም " +
    "Threads ሚዲያውን የሚያሳየው ለገቡ ተጠቃሚዎች ብቻ ነው — እንደዚህ ያሉ ልጥፎች ሳይገቡ ሊወርዱ አይችሉም።",
  extensionHint:
    "\n\n💻 በኮምፒውተር ላይ በVideoner የአሳሽ ቅጥያ ማውረድ ይችላሉ፦ " +
    "በመድረኩ ላይ ያለዎትን የራስዎን መግቢያ ተጠቅሞ ያወርዳል፤ የይለፍ ቃልም ሆነ ኩኪዎች ከአሳሽዎ አይወጡም።",
  privateConnectHint: (platform, withExtension) =>
    `\n\n🔑 እንደዚህ ያሉ ልጥፎችን ለማውረድ የ${platform} መለያዎን ከቦቱ ጋር ያገናኙ — አንድ ጊዜ ብቻ። ከዚያ በኋላ ቦቱ እርስዎ ማየት የሚችሉትን ሁሉ ያወርዳል፦ የግል ልጥፎችን፣ ሪልሶችን እና ስቶሪዎችን፣ ከስልክዎም ጭምር። እንዴት እንደሆነ ከታች ያለው ቁልፍ ያሳያል።${withExtension ? "\n\n💻 ወይም በኮምፒውተር ላይ በVideoner የአሳሽ ቅጥያ ያውርዱት።" : ""}`,
  privateReconnectHint: (platform, withExtension) =>
    `\n\n⚠️ ያገናኙት የ${platform} መለያ ይህን ልጥፍ መክፈት አልቻለም። መግቢያው መስራት አቁሞ ሊሆን ይችላል — መለያውን እንደገና ያገናኙ። ወይም ይህ መለያ ልጥፉን የማየት መዳረሻ የለውም።${withExtension ? "\n\n💻 እንዲሁም በኮምፒውተር ላይ በVideoner የአሳሽ ቅጥያ ማውረድ ይችላሉ።" : ""}`,
  connectAccountButton: "🔑 መለያ ያገናኙ",
  reconnectAccountButton: "🔑 እንደገና ያገናኙ",
  extensionButton: "🧩 በቅጥያው ያውርዱ",
  extensionCommand:
    "🧩 Videoner ለአሳሽዎ፦ የማውረጃ ቁልፍ በቪዲዮው ገጽ ላይ በቀጥታ — YouTube፣ Instagram፣ TikTok፣ VK፣ ከመለያዎ የሚታዩ የግል ቪዲዮዎች እና የGetCourse ትምህርቶች።\n\nበኮምፒውተር ላይ ለChrome፣ Edge፣ Opera፣ Yandex Browser እና Firefox።",
  extensionPageButton: "🧩 ቅጥያውን ይጫኑ",
  addToGroupButton: "👥 ወደ ቡድን ያክሉ",
  newsButton: "📣 የፕሮጀክቱ ዜና",
  fileCaptionShort: (title, sourceUrl) =>
    withOptionalLines((title ? `🎬 ${title.slice(0, 200)}\n\n` : "") + sourceUrl, `📣 የፕሮጀክቱ ዜና፦ ${NEWS_CHANNEL}`, undefined),
  sentBy: (name) => `👤 ${name}`,
  groupSettings: (s, canDelete) =>
    "⚙️ የዚህ ቡድን የቦት ቅንብሮች\n\n" +
    `🗑 ሊንኩን የያዘውን መልዕክት መሰረዝ፦ ${s.deleteLinks ? "አዎ" : "አይ"}\n` +
    "ቪዲዮው ከተላከ በኋላ ሊንክ ብቻ የያዘ መልዕክት ይሰረዛል — ቻቱ የሚይዘው ቪዲዮውን ከአጋሪው ስም ጋር ብቻ ነው።\n" +
    (s.deleteLinks && !canDelete
      ? "⚠️ አሁን መልዕክቶችን መሰረዝ አልችልም፦ «መልዕክቶችን መሰረዝ» (Delete messages) መብት ያለው አስተዳዳሪ ያድርጉኝ።\n"
      : "") +
    `\n✍️ ከቪዲዮው በታች ያለ መግለጫ ጽሑፍ፦ ${{ full: "ሙሉ", short: "ርዕስ እና ምንጭ", none: "መግለጫ ጽሑፍ የለም" }[s.caption] ?? s.caption}\n` +
    `\n🎞 ጥራት፦ ${s.quality === "max" ? "Telegram የሚቀበለው ከፍተኛው" : "መደበኛ (720p)"}\n` +
    `\n⏱ ረጃጅም ቪዲዮዎች፦ ${s.longVideos ? "ማንኛውም ርዝመት" : "እስከ 15 ደቂቃ ብቻ"}\n` +
    `\n🔑 መለያዎቻቸውን ማገናኘት የሚችሉት (ለስቶሪዎች እና ለግል ልጥፎች)፦ ${s.cookiesBy === "all" ? "ማንኛውም አባል" : "አስተዳዳሪዎች ብቻ"}\n` +
    `\n🌐 የምላሽ ቋንቋ፦ ${s.language ? langName(s.language) : "የእያንዳንዱ አባል የራሱ"}\n` +
    "\nቅንብሮቹን መቀየር የሚችሉት የቡድኑ አስተዳዳሪዎች ብቻ ናቸው።",
  settingsDeleteButton: (on) => `🗑 ሊንኮችን መሰረዝ፦ ${on ? "አዎ" : "አይ"}`,
  settingsCaptionButton: (style) => `✍️ መግለጫ ጽሑፍ፦ ${{ full: "ሙሉ", short: "አጭር", none: "የለም" }[style] ?? style}`,
  settingsQualityButton: (mode) => `🎞 ጥራት፦ ${mode === "max" ? "ከፍተኛ" : "720p"}`,
  settingsLongButton: (on) => `⏱ ረጃጅም ቪዲዮዎች፦ ${on ? "አዎ" : "እስከ 15 ደቂቃ"}`,
  settingsDoneButton: "✅ ተጠናቋል",
  settingsAdminsOnly: "ቅንብሮቹን መቀየር የሚችሉት የቡድኑ አስተዳዳሪዎች ብቻ ናቸው።",
  settingsGroupsOnly: "ቅንብሮች ለቡድኖች ናቸው፦ ወደ ቡድን ያክሉኝና እዚያ /settings ይላኩ።",
  settingsFailed: "ቅንብሮቹን ማስቀመጥ አልተቻለም፣ እባክዎ እንደገና ይሞክሩ።",
  settingsCookiesButton: (by) => `🔑 መለያ ማገናኘት፦ ${by === "all" ? "ሁሉም" : "አስተዳዳሪዎች"}`,
  accountsIntro:
    "🔑 የተገናኙ መለያዎች\n\nቦቱ ለገቡ ሰዎች ብቻ የሚታየውን (የInstagram ስቶሪዎችን፣ የግል ልጥፎችን) በእርስዎ መለያ ማውረድ ይችላል። መግቢያው የሚሰራው ባገናኙበት ቦታ ነው፦ በግል ቻት የተገናኘ መለያ ለእርስዎ ማውረዶች ያገለግላል፤ የራሳቸው መለያ በሌላቸው ቡድኖች ውስጥ የሚልኳቸውን ሊንኮችም ጨምሮ። ከቡድን ጋር የተገናኘ መለያ ደግሞ ለሁሉም የቡድኑ አባላት ያገለግላል።",
  accountsHowTo:
    "እንዴት እንደሚያገናኙ፦\n1. በጣም ቀላሉ፦ በኮምፒውተር ላይ የVideoner ቅጥያ — በመድረኩ ድረ-ገጽ ላይ ይግቡ፣ የVideoner ብቅ-ባይ መስኮትን ይክፈቱ፣ «🔑 የ… መለያዎን ከቦቱ ጋር ያገናኙ» የሚለውን ይጫኑና ኮዱን ይላኩልኝ። ለቡድን ከሆነ በዚያው ቡድን ውስጥ /connect ኮድ ይላኩ።\n2. ወይም የcookies.txt ፋይል (ከአሳሹ የተላኩ ኩኪዎች) ይላኩልኝ፣ ወይም ጽሑፉን እንደ መልዕክት ይለጥፉ።\n3. ከAndroid ስልክ — በFirefox እና በCookie-Editor ተጨማሪ፦ https://videoner.download/am/blog/android-firefox",
  accountsWarning:
    "⚠️ መድረኮች አውቶማቲክ ማውረዶችን አይወዱም፤ መለያውን ሊገድቡ ወይም ሊያግዱ ይችላሉ። ዋናውን መለያዎን ሳይሆን ሁለተኛ መለያ ቢያገናኙ ይሻላል። ኩኪዎች ተመስጥረው ይቀመጣሉ፣ ለማውረድ ብቻ ያገለግላሉ፣ እና ከታች ባሉት ቁልፎች ይሰረዛሉ።",
  accountsNone: "እስካሁን ምንም አልተገናኘም።",
  accountsGroupTitle: "🔑 ከዚህ ቡድን ጋር የተገናኙ መለያዎች",
  accountsGroupHowTo:
    "ለመላው ቡድን መለያ ለማገናኘት፦ በVideoner ቅጥያ ውስጥ ባለው «🔑 የ… መለያዎን ከቦቱ ጋር ያገናኙ» ቁልፍ ኮድ ያግኙና እዚህ /connect ኮድ ይላኩ። መለያን በግል ቻትዎ ብቻ ካገናኙ፣ ቦቱ እዚህ ለራስዎ ሊንኮች ይጠቀምበታል። የእርስዎ ግንኙነቶች፦ ከ@VideonerBot ጋር ባለው የግል ቻት ውስጥ /accounts።",
  accountsLine: (platform, where, active) => `• ${platform} — ${where}${active ? "" : " (⚠️ መግቢያው አይሰራም)"}`,
  accountsGroupLine: (platform, owner, active) => `• ${platform} — ${owner}${active ? "" : " (⚠️ መግቢያው አይሰራም)"}`,
  accountsWhereHere: "የግል ቻት",
  accountsWhereGroup: (title) => `ቡድን «${title}»`,
  accountsDeleteButton: (platform, where) => `🗑 ${platform} · ${where}`,
  accountsDeleteAllButton: "🗑 ሁሉንም ግንኙነቶች ያስወግዱ",
  accountsDeleted: "ተወግዷል።",
  accountsDeletedAll: (n) => `የተወገዱ ግንኙነቶች፦ ${n}።`,
  accountsNotAllowed: "ይህን ማስወገድ የሚችሉት ያገናኘው ሰው ወይም የቡድኑ አስተዳዳሪ ብቻ ናቸው።",
  connectUsage:
    "/connect ኮድ ይላኩ። ኮዱን በኮምፒውተር ላይ ባለው የVideoner ቅጥያ ውስጥ ያለው «🔑 የ… መለያዎን ከቦቱ ጋር ያገናኙ» ቁልፍ ይሰጥዎታል። የእርስዎ ግንኙነቶች፦ /accounts።",
  connectOnlyAdmins: "ከዚህ ቡድን ጋር መለያ ማገናኘት የሚችሉት አስተዳዳሪዎች ብቻ ናቸው (/settings ይመልከቱ)።",
  connectDone: (platform, where) =>
    `✅ ${platform} ${where} ተገናኝቷል። ቦቱ አሁን ለገቡ ሰዎች ብቻ የሚታየውንም ያወርዳል። ለማየት ወይም ለማስወገድ፦ /accounts።\n\n⚠️ መድረኩ በአውቶማቲክ ማውረዶች ምክንያት መለያውን ሊገድብ ይችላል — ሁለተኛ መለያ ቢጠቀሙ ይሻላል።`,
  connectWhereGroup: "ከዚህ ቡድን ጋር",
  connectWhereHere: "በግል ቻት እና በinline ሁነታ ለሚያደርጓቸው ማውረዶች",
  connectCodeNotFound: "ኮዱ አልተገኘም ወይም ጊዜው አልፏል (ኮዶች የሚቆዩት 10 ደቂቃ ነው)። በVideoner ቅጥያ ውስጥ አዲስ ኮድ ያግኙ።",
  connectRejectedNoSession: "እነዚህ ኩኪዎች መግቢያ የላቸውም። በመድረኩ ድረ-ገጽ ላይ ይግቡና ኩኪዎቹን እንደገና ይላኩ (export ያድርጉ)።",
  connectRejectedUnknown: "የሚደገፉ መድረኮች ኩኪዎች አልተገኙም፦ Instagram፣ Facebook፣ YouTube፣ X፣ VK፣ TikTok።",
  connectUnavailable: "መለያዎችን ማገናኘት እስካሁን አይገኝም።",
  connectFailed: "ማገናኘት አልተቻለም፣ እባክዎ እንደገና ይሞክሩ።",
  connectFileTooBig: "ፋይሉ በጣም ትልቅ ነው — የሚፈልጉትን ድረ-ገጽ ኩኪዎች ብቻ ይላኩ (export ያድርጉ)።",
  connectNotAnonymous: "መለያውን በራስዎ ስም ያገናኙ እንጂ በቡድኑ ስም ማንነትዎን ደብቀው አይደለም፦ አለበለዚያ የአስተዳዳሪዎች ግንኙነቶች ይደበላለቃሉ። ኮዱን አጥፍቼዋለሁ — አዲስ ኮድ ያግኙ።",
  connectCodeInGroup:
    "በቡድን ቻት ውስጥ የተለጠፈ የግንኙነት ኮድ በሌሎች ሊታይ ይችላል — ኮዱን አጥፍቼ መልዕክቱን አስወግጃለሁ። አዲስ ኮድ ያግኙና በ/connect ኮድ ይላኩት፦ ያንን የትዕዛዝ መልዕክት ወዲያውኑ እሰርዘዋለሁ።",
  groupWelcome:
    "👋 ሰላም! ከTikTok፣ Instagram፣ YouTube፣ VK እና ከሌሎች መድረኮች የቪዲዮ ሊንኮችን በዚህ ቻት ውስጥ ይለጥፉ — በቪዲዮው ራሱ እመልሳለሁ።\n\n" +
    "እስከ 15 ደቂቃ የሚረዝሙ ቪዲዮዎችን ያለ ምንም ትዕዛዝ በራሴ አወርዳለሁ፤ በሌላ ጊዜ ዝም እላለሁ።\n\n⚙️ የቡድኑ አስተዳዳሪዎች በ/settings ሊያስተካክሉኝ ይችላሉ፦ የሊንክ መልዕክቶችን መሰረዝ፣ የመግለጫ ጽሑፍ ዓይነት፣ ጥራት፣ ረጃጅም ቪዲዮዎች እና ቋንቋ።\n\n⚡ ድምፁን ለማግኘት ከሊንኩ በኋላ -audio ይጨምሩ፤ ለምርጥ ጥራት ደግሞ -hd።\n\n📣 የፕሮጀክቱ ዜና፦ @videonerdownload",
  errorTooLong: "ቪዲዮው በጣም ረጅም ነው — እንደዚህ ያሉ ረጃጅም ቪዲዮዎችን እስካሁን ማውረድ አንችልም።",
  errorUnknown: "ይህን ቪዲዮ ማውረድ አልተቻለም። ትንሽ ቆይተው እንደገና ይሞክሩ ወይም ሌላ ሊንክ ይላኩ።",
  inlineHintButton: "ሊንክ ወደ ቦቱ ይላኩ",
  inlineResultTitle: "⬇️ ቪዲዮውን ያውርዱ",
  inlineResultDescription: "ቪዲዮው በቀጥታ በዚህ ቻት ውስጥ ይለጠፋል",
  inlinePlaceholder: "⏬ በማውረድ ላይ፣ ይህ ጥቂት ደቂቃዎች ሊወስድ ይችላል...",
  inlineOpenBot: "ቦቱን ይክፈቱ",
  inlineOnlySingleVideo:
    "ይህ ሁነታ አንድ ቪዲዮ ብቻ ይልካል። በርካታ ፋይሎች ላሏቸው ልጥፎች ወይም ለፎቶዎች ሊንኩን በግል ቻት ወደ ቦቱ ይላኩ።",
  inlineSubscribeRequired: (channel: string) =>
    `ለማውረድ ${channel}ን ይቀላቀሉና እንደገና ይሞክሩ።`,
  inlineRateLimited: "በተከታታይ በጣም ብዙ ጥያቄዎች። አንድ ደቂቃ ይጠብቁና እንደገና ይሞክሩ።",
  queueRest: (count) => `\n\n📋 አሁንም በወረፋ ያሉ ሊንኮች፦ ${count}። ከዚህኛው በኋላ አንድ በአንድ አሳይዎታለሁ።`,
  queuedOne: (position) =>
    `📋 ሊንኩ ወረፋ ውስጥ ገብቷል፣ ቁ. ${position}። መጀመሪያ የአሁኑን እንጨርስ — ከዚያ ለእሱ የጥራት ምርጫን አሳይዎታለሁ።`,
  queuedMany: (added, waiting) =>
    `📋 ወደ ወረፋው የተጨመሩ ሊንኮች፦ ${added}። በአጠቃላይ የሚጠብቁ፦ ${waiting}። ከአሁኑ በኋላ አንድ በአንድ አሳይዎታለሁ።`,
  queueDuplicates: (count) =>
    count === 1
      ? "ይህ ሊንክ አስቀድሞ በወረፋው ውስጥ አለ — ሁለት ጊዜ አልጨምረውም።"
      : `አስቀድመው በወረፋው ውስጥ ያሉ ሊንኮች ሁለት ጊዜ አይጨመሩም (ድግግሞሾች፦ ${count})።`,
  queueFull: (limit, rejected) =>
    `ወረፋው ቢበዛ ${limit} ሊንኮችን ይይዛል — ትርፎቹ አልተጨመሩም (${rejected})። ወረፋው ሲንቀሳቀስ ይላኳቸው።`,
  skipButton: "✖️ አያውርዱ",
  skipped: "⏭ ይህን ሊንክ ዘልዬዋለሁ።",
  chooseTimedOut: "⌛ በ30 ደቂቃ ውስጥ ምንም ጥራት አልተመረጠም — ይህን ሊንክ እዘላለሁ።",
  queueLostOnRestart: (count) =>
    `⚠️ ቦቱ ለማዘመን እንደገና እየጀመረ ነው — ወረፋው ተሰርዟል (ሊንኮች፦ ${count})። እባክዎ ከአንድ ደቂቃ በኋላ እንደገና ይላኳቸው።`,
  subtitlesButton: "📝 የትርጉም ጽሑፎች",
  subtitlesBack: "⬅️ ወደ ጥራት ይመለሱ",
  subtitlesAuto: "ራስ-ሰር",
  subtitlesChoose: "የትርጉም ጽሑፍ ቋንቋ ይምረጡ",
  subtitlesPreparing: "📝 የትርጉም ጽሑፎችን በማዘጋጀት ላይ...",
  subtitlesFailed: "በዚህ ቋንቋ የትርጉም ጽሑፎችን ማውረድ አልተቻለም። ሌላ ቋንቋ ይሞክሩ።",
  subtitlesBusy: "YouTube አሁን የትርጉም ጽሑፎችን እየሰጠ አይደለም — ከጥቂት ደቂቃዎች በኋላ እንደገና ይሞክሩ።",
  playlistFound: (title, count) =>
    `📃 የአጫዋች ዝርዝር${title ? ` «${title.slice(0, 150)}»` : ""}፦ ${count} ቪዲዮዎች።\nአንድ በአንድ አወርዳቸዋለሁ። በየትኛው ቅርጸት?`,
  playlistStdButton: "🎬 720p",
  playlistHdButton: "🎬 ምርጥ ጥራት",
  playlistAudioButton: "🎵 ድምፅ ብቻ (mp3)",
  playlistNoButton: "✖️ አይ፣ አመሰግናለሁ",
  playlistQueued: (count) =>
    `📃 ከአጫዋች ዝርዝሩ ወረፋ ውስጥ የገቡ ቪዲዮዎች፦ ${count}። አንድ በአንድ እልካቸዋለሁ። በታች ባለው ቁልፍ ወይም በ/stop ያቁሙ።`,
  playlistFailed: "የአጫዋች ዝርዝሩን መክፈት አልተቻለም — የግል ሊሆን ይችላል። የአንድ ቪዲዮ ሊንክ ይላኩ።",
  stopButton: "⏹ አቁም",
  stopped: (dropped) => `⏹ ቆሟል።${dropped ? ` ከወረፋው የተወገዱ ሊንኮች፦ ${dropped}።` : ""}`,
  nothingToStop: "አሁን ምንም እየወረደ አይደለም።",
  languageChoose: "🌐 የቦቱን ቋንቋ ይምረጡ። «ራስ-ሰር» የTelegramዎን ቋንቋ ይከተላል።",
  languageChooseGroup: "🌐 በዚህ ቡድን ውስጥ የቦቱ የምላሽ ቋንቋ። «ራስ-ሰር» — የእያንዳንዱ አባል የTelegram ቋንቋ።",
  languageAuto: "ራስ-ሰር — እንደ Telegram",
  languageAutoGroup: "ራስ-ሰር — የእያንዳንዱ አባል የራሱ",
  languageSaved: (name) => `✅ የቦቱ ቋንቋ፦ ${name}። በ/language ይቀይሩት።`,
  languageSavedAuto: "✅ ቦቱ የTelegramዎን ቋንቋ ይከተላል። በ/language ይቀይሩት።",
  settingsLanguageButton: (name) => `🌐 ቋንቋ፦ ${name ?? "ራስ-ሰር"}`,
  settingsBack: "⬅️ ወደ ቅንብሮች ይመለሱ",
};

const om: Messages = {
  start: "Akkam! Liinkii viidiyoo YouTube, TikTok, Instagram, Facebook, Twitter/X, Vimeo, VK, Rutube, OK.ru, Pinterest ykn Threads irraa naaf ergaa — akka buufattan isin gargaara.\n\n✨ Daangaan qulqullinaa hin jiru: waan waltajjichi dhiyeessu hunda hanga 4K tti ni argattu — faayilichi hanga 2 GB hin caalletti; kun daangaa Telegram bootiiwwaniif kaa'eedha. Tajaajilli kaffaltii barbaadu as hin jiru.\n\nGuutummaatti bilisa: maallaqni galmee, beeksisni, bittaan app keessaa hin jiru.\n\n🧩 Kompiitara irratti buufachaa jirtuu? Dabalata biraawuzarii fe'aa — qabduun “Buusi” fuula viidiyoo irratti kallattiin mul'ata: videoner.download/om/extension\n\n👥 Garee tokkotti na dabalaa, liinkii namoonni achitti qoodaniif viidiyoowwan nan maxxansa.\n\n⚡ Filannoo qulqullinaa irra darbaa: sagalee qofa (mp3) argachuuf liinkii booda -audio dabalaa, qulqullina isa caalu argachuuf immoo -hd.\n\n📣 Oduu pirojektii: @videonerdownload\n\n🌐 Afaan bootii: /language",
  notLink: "Kun liinkii hin fakkaatu. Liinkii viidiyoo naaf ergaa.",
  inviteGreeting: "Akkam! Ani Videoner — viidiyoowwan YouTube, TikTok, Instagram fi waltajjiiwwan biroo irraa bilisaan nan buufadha. Viidiyoo namni tokko isinii qoode qopheessaa jira 👇",
  inviteNotFound: "Liinkii affeerraa kanaaf viidiyoo argachuu hin dandeenye. Liinkii viidiyoo naaf ergaa, nan buufadha.",
  inviteUnavailable: "Viidiyoo liinkii kana irraa banuu hin dandeenye — tajaajilichi amma deebii hin kennu. Daqiiqaa tokko booda liinkii sana irra deebi'aa banaa.",
  fetchingInfo: "🔍 Odeeffannoo viidiyoo fidaa jira...",
  audioOnlyButton: "🎵 Sagalee qofa (mp3)",
  photoButton: "📷 Suuraawwan buufadhaa",
  slideshowButton: "🎞 Islaayid shoo (viidiyoo)",
  galleryButton: "📷+🎞 Suuraawwanii fi islaayid shoo",
  chooseQuality: (title, duration) => `“${title}”${duration ? `\n⏱ ${duration}` : ""}\n\nQulqullina filadhaa:`,
  sessionExpired: "Yeroon darbeera — liinkicha irra deebi'aa ergaa",
  downloading: "⏬ Buufachaa jira, daqiiqaa muraasa fudhachuu danda'a...",
  downloadFailed: "buufachuun hin milkoofne",
  downloadProgress: (percent, eta, done) =>
    `⏬ Buufachaa jira: ${percent}%${eta ? ` · ${eta} hafeera` : ""}${done ? `\n${done}` : ""}`,
  downloadFinishing: "⚙️ Xumuramuu ga'eera — faayilicha walitti qindeessaa jira...",
  converting: (percent) => `⚙️ Jijjiiraa jira: ${percent}%`,
  etaUnderMinute: "daqiiqaa tokkoo gadi",
  etaMinutes: (minutes) => `~daqiiqaa ${minutes}`,
  etaHours: (hours, minutes) => `~sa'aatii ${hours}${minutes ? ` daqiiqaa ${minutes}` : ""}`,
  downloadTimeout: "buufachuun yeroo dheeraa fudhachaa jira — viidiyoon kun baay'ee ulfaataa fakkaata. Qulqullina gadi aanaa yaalaa.",
  downloadInterrupted: "⚠️ Bootiin fooyya'iinsaaf irra deebi'ee ka'aa jira — buufachuun keessan addaan citeera. Daqiiqaa tokko booda liinkicha irra deebi'aa ergaa.",
  fileTooBig: (mb, url) =>
    `Faayilichi guddaa ta'e (${mb} MB) — Telegram bootiin akka erguu hin hayyamu.\nAsitti buufadhaa: ${url}`,
  sendingFile: "📤 Faayilii ergaa jira...",
  sendingAlbum: (count) => `📤 Maxxansi kun faayilota hedduu (${count}) qaba — akka albamiitti ergaa jira...`,
  failedPrefix: "❌ Hin milkoofne: ",
  fileCaption: (title, sourceUrl, shareUrl, description) =>
    composeCaption(
      title,
      description,
      `Madda: ${sourceUrl}\n` +
        "Mirgi viidiyoo kanaa hundi kan uumaa isaati.\n" +
        "@VideonerBot fayyadamuun bilisaan buufatame",
      `📣 Oduu pirojektii: ${NEWS_CHANNEL}`,
      shareUrl && `🔗 Qoodaa: ${shareUrl}`,
    ),
  subscribeRequired: (channel) =>
    `Buufachuuf, chaanaalii keenya ${channel} hordofaa — haalli jiru kana qofa, tajaajilli bilisa ta'ee itti fufa.\n\n` +
    "Hordofaatii “Hordofeera” tuqaa.",
  openChannelButton: "📣 Chaanaalii banaa",
  checkSubscriptionButton: "Hordofeera",
  subscribeThanks: "Galatoomaa! Amma liinkii viidiyoo naaf ergaa.",
  subscribeThanksResuming: "Galatoomaa! Liinkii keessan amma itti fufaa jira.",
  subscribeStillMissing: "Hordoffiin ammallee hin mul'atu. Hordofaatii irra deebi'aa tuqaa.",
  channelNotice: (channel) => `\n\nLiinkiin maxxansa kanaa ${channel} irratti ni mul'ata — maqaa keessan malee, maqaa dhoksuun.`,
  channelPost: (title, url) =>
    (title ? `🎬 ${title.slice(0, 200)}\n\n` : "") +
    `${url}\n\n` +
    "Viidiyoo kanaa fi kan biroo kamiyyuu bilisaan buufadhaa: @VideonerBot",
  errorStoryNeedsId:
    "liinkii istoorii murtaa'aa tokkoo ergaa: app Instagram keessatti banaatii Qoodi → Liinkii garagalchi tuqaa.",
  errorInstagramStory:
    "Istooriiwwan Instagram kan mul'atan namoota seenaniif qofa.",
  errorLoginRequired:
    "Maxxansi kun osoo hin seenin hin argamu: waltajjichi kan kennu namoota " +
    "seenaniif qofa. Kun maxxansoota dhuunfaa, qabiyyee daangaa umurii qabuu fi " +
    "maxxansoota namoota muraasaaf qoodaman irratti ta'a.\n\n" +
    "Maxxansoonni uummataa rakkoo malee buufatamu — liinkii biraa yaalaa.",
  errorUnsupportedPlatform:
    "Liinkii kana adda baasuu hin dandeenye — liinkiin kun liinkii viidiyoo kallattii YouTube, TikTok, Instagram, Facebook, Twitter/X, Vimeo, VK, Rutube, OK.ru, Pinterest ykn Threads irraa ta'uu isaa mirkaneeffadhaa.",
  errorFileTooLarge: "faayilichi 2 GB caala — Telegram bootiin faayilota kana caalan akka ergu hin hayyamu. Marsariitii irratti ykn dabalata biraawuzariitiin buufadhaa — qabduuwwan armaan gadii. Ykn liinkicha irra deebi'aa ergaatii qulqullina gadi aanaa filadhaa.",
  siteButton: "🌐 Marsariitii irratti buufadhaa",
  qualitiesHiddenBySize: (limit) =>
    `\n\n⚖️ Qulqullinni ${limit} caalu dhokfameera: Telegram bootiin faayilota kana caalan akka ergu hin hayyamu. Marsariitii irratti ykn dabalata biraawuzariitiin buufachuu dandeessu — qabduuwwan armaan gadii.`,
  videoTooBigForTelegram: (smallest) =>
    `\n\n⚖️ Viidiyoon kun qulqullina isa gadi aanaa irrattillee Telegram'f baay'ee ulfaataadha (~${smallest}): Telegram bootiin faayilota 2 GB caalan akka ergu hin hayyamu. Asitti sagalee qofa argachuu dandeessu; viidiyoo immoo — marsariitii irratti ykn dabalata biraawuzariitiin (qabduuwwan armaan gadii).`,
  errorFormatUnavailable: "Qulqullinni kun viidiyoo kanaaf hin jiru. Liinkicha irra deebi'aa ergaa — tarree haaraa isinittan agarsiisa.",
  errorNoVideoContent: "Liinkii kana keessa viidiyoon buufatamu hin jiru — maxxansi kun suuraa qofa qaba fakkaata.",
  errorRegionBlocked:
    "Viidiyoon kun biyya uumaa isaatiin ala cufameera — waltajjichi " +
    "sarvara keenyaaf hin kennu. Karaan itti darbamu hin jiru: daangeessichi isaan biratti." +
    "\n\nLiinkiiwwan biroo akkuma duraatti buufatamu.",
  errorRateLimited: "Liinkiiwwan baay'een walitti aananii dhufan — xiqqoo eegaatii irra deebi'aa ergaa.",
  errorYoutubeDailyLimit: (gb) => `sa'aatii 24 darban keessatti YouTube irraa ${gb} GB caalaa buufattaniittu — kun daangaa guyyaa bootii nama tokkoof kaa'ameedha. Sa'aatii 24 darban qofa lakkaa'a, kanaaf viidiyoowwan YouTube haaraa xiqqoo booda buufachuu dandeessu. Waltajjiiwwan biroo akkuma duraatti hojjetu.`,
  playlistStoppedByLimit: (dropped) => `⏹ Tarreen viidiyoo dhaabbateera: daangaan guyyaa YouTube ga'eera. Viidiyoowwan hin buufatamne: ${dropped}. Liinkii tarree viidiyoo booda irra deebi'aa ergaa.`,
  errorPlatformRefused:
    "waltajjichi viidiyoo kana sarvara keenyaaf hin kennine. Kun maxxansoota dhuunfaa " +
    "ykn daangaa umurii qaban irratti ta'a, yeroo tokko tokko immoo waltajjichi yeroodhaaf " +
    "seensa daangeessa. Daqiiqaa muraasa booda irra deebi'aa yaalaa.",
  errorThreadsNoMedia:
    "maxxansa Threads kana keessatti viidiyoon ykn suuraan hin mul'atu. Yookaan maxxansa barreeffama qofaati, yookaan " +
    "Threads miidiyaa isaa namoota seenaniif qofa agarsiisa — maxxansoonni akkasii osoo hin seenin buufatamuu hin danda'an.",
  extensionHint:
    "\n\n💻 Kompiitara irratti dabalata biraawuzarii Videoner'n buufachuu dandeessu: " +
    "seensa keessan waltajjicha irratti fayyadamee buufata, jechi icciitii ykn kuukiin tokkollee biraawuzarii keessan keessaa hin ba'u.",
  privateConnectHint: (platform, withExtension) =>
    `\n\n🔑 Maxxansoota akkasii buufachuuf, akkaawuntii ${platform} keessan bootii wajjin walqabsiisaa — al tokko qofa. Sana booda bootiin waan isin argitan hunda buufata: maxxansoota dhuunfaa, reels fi istooriiwwan, bilbila irraas. Qabduun armaan gadii akkamitti akka ta'u agarsiisa.${withExtension ? "\n\n💻 Ykn kompiitara irratti dabalata biraawuzarii Videoner'n buufadhaa." : ""}`,
  privateReconnectHint: (platform, withExtension) =>
    `\n\n⚠️ Akkaawuntiin ${platform} keessan kan walqabsiifame maxxansa kana banuu hin dandeenye. Seensi hojjechuu dhiisee ta'uu danda'a — akkaawuntii irra deebi'aa walqabsiisaa. Ykn akkaawuntiin kun maxxansa kanaaf hayyama hin qabu.${withExtension ? "\n\n💻 Akkasumas kompiitara irratti dabalata biraawuzarii Videoner'n buufachuu dandeessu." : ""}`,
  connectAccountButton: "🔑 Akkaawuntii walqabsiisaa",
  reconnectAccountButton: "🔑 Irra deebi'aa walqabsiisaa",
  extensionButton: "🧩 Dabalataan buufadhaa",
  extensionCommand:
    "🧩 Videoner biraawuzarii keessaniif: qabduu “Buusi” fuula viidiyoo irratti kallattiin — YouTube, Instagram, TikTok, VK, viidiyoowwan dhuunfaa akkaawuntii keessan irraa fi barnoota GetCourse.\n\nKompiitara irratti Chrome, Edge, Opera, Yandex Browser fi Firefox'f.",
  extensionPageButton: "🧩 Dabalata fe'aa",
  addToGroupButton: "👥 Gareetti dabalaa",
  newsButton: "📣 Oduu pirojektii",
  fileCaptionShort: (title, sourceUrl) =>
    withOptionalLines((title ? `🎬 ${title.slice(0, 200)}\n\n` : "") + sourceUrl, `📣 Oduu pirojektii: ${NEWS_CHANNEL}`, undefined),
  sentBy: (name) => `👤 ${name}`,
  groupSettings: (s, canDelete) =>
    "⚙️ Qindaa'ina bootii garee kanaa\n\n" +
    `🗑 Ergaa liinkii qabu haquu: ${s.deleteLinks ? "eeyyee" : "lakki"}\n` +
    "Erga viidiyoon ergamee booda, ergaan liinkii qofa qabu ni haqama — chaatiin viidiyoo maqaa nama qoodee wajjin qofa qabata.\n" +
    (s.deleteLinks && !canDelete
      ? "⚠️ Amma ergaawwan haquu hin danda'u: mirga “Ergaawwan haquu” wajjin bulchaa na godhaa.\n"
      : "") +
    `\n✍️ Ibsa viidiyoo jalaa: ${{ full: "guutuu", short: "mata-duree fi madda", none: "ibsa malee" }[s.caption] ?? s.caption}\n` +
    `\n🎞 Qulqullina: ${s.quality === "max" ? "isa Telegram fudhatu keessaa isa olaanaa" : "idilee (720p)"}\n` +
    `\n⏱ Viidiyoowwan dheeraa: ${s.longVideos ? "dheerina kamiyyuu" : "hanga daqiiqaa 15 qofa"}\n` +
    `\n🔑 Eenyutu akkaawuntii isaa walqabsiisuu danda'a (istooriif fi maxxansa dhuunfaaf): ${s.cookiesBy === "all" ? "miseensa kamiyyuu" : "bulchitoota qofa"}\n` +
    `\n🌐 Afaan deebii: ${s.language ? langName(s.language) : "afaan miseensa tokkoon tokkoo"}\n` +
    "\nQindaa'ina jijjiiruu kan danda'an bulchitoota garee qofa.",
  settingsDeleteButton: (on) => `🗑 Liinkiiwwan haquu: ${on ? "eeyyee" : "lakki"}`,
  settingsCaptionButton: (style) => `✍️ Ibsa: ${{ full: "guutuu", short: "gabaabaa", none: "hin jiru" }[style] ?? style}`,
  settingsQualityButton: (mode) => `🎞 Qulqullina: ${mode === "max" ? "olaanaa" : "720p"}`,
  settingsLongButton: (on) => `⏱ Viidiyoowwan dheeraa: ${on ? "eeyyee" : "hanga daq. 15"}`,
  settingsDoneButton: "✅ Xumurameera",
  settingsAdminsOnly: "Qindaa'ina jijjiiruu kan danda'an bulchitoota garee qofa.",
  settingsGroupsOnly: "Qindaa'inni gareewwaniif: garee tokkotti na dabalaatii achitti /settings ergaa.",
  settingsFailed: "Qindaa'ina olkaa'uu hin dandeenye, irra deebi'aa yaalaa.",
  settingsCookiesButton: (by) => `🔑 Akkaawuntii walqabsiisuu: ${by === "all" ? "nama hunda" : "bulchitoota"}`,
  accountsIntro:
    "🔑 Akkaawuntiiwwan walqabsiifaman\n\nBootiin waan namoota seenan qofaaf mul'atu (istoorii Instagram, maxxansoota dhuunfaa) akkaawuntii keessan fayyadamee buufachuu danda'a. Seensi bakka itti walqabsiiftan qofatti hojjeta: kan chaatii dhuunfaa keessatti walqabsiifame buufannaa keessan tajaajila, liinkiiwwan keessan gareewwan akkaawuntii mataa isaanii hin qabne keessatti ergitan dabalatee; kan garee tokkoon walqabsiifame miseensota isaa hunda tajaajila.",
  accountsHowTo:
    "Akkamitti walqabsiisuu:\n1. Inni salphaan: kompiitara irratti dabalata Videoner — marsariitii waltajjichaa irratti seenaa, foddaa Videoner banaa, “🔑 Akkaawuntii … keessan bootii wajjin walqabsiisaa” tuqaatii koodii naaf ergaa. Gareef yoo ta'e, garee sana keessatti /connect KOODII ergaa.\n2. Ykn faayilii cookies.txt (kuukii biraawuzarii irraa baafame) naaf ergaa, ykn barreeffama isaa akka ergaatti maxxansaa.\n3. Bilbila Android irraa — Firefox fi dabalata Cookie-Editor'n: https://videoner.download/om/blog/android-firefox",
  accountsWarning:
    "⚠️ Waltajjiiwwan buufannaa ofumaan ta'u hin jaallatan, akkaawuntii daangeessuu ykn cufuu danda'u. Akkaawuntii keessan isa ijoo osoo hin taane akkaawuntii lammaffaa walqabsiisuun wayya. Kuukiin icciitiin kuufama, buufachuuf qofa tajaajila, qabduuwwan armaan gadiitiin ni haqama.",
  accountsNone: "Ammaaf wanti walqabsiifame hin jiru.",
  accountsGroupTitle: "🔑 Akkaawuntiiwwan garee kanaan walqabsiifaman",
  accountsGroupHowTo:
    "Garee guutuuf walqabsiisuuf: dabalata Videoner keessatti qabduu “🔑 Akkaawuntii … keessan bootii wajjin walqabsiisaa” fayyadamaatii koodii argadhaa, as immoo /connect KOODII ergaa. Yoo akkaawuntii chaatii dhuunfaa keessan qofatti walqabsiiftan, bootiin liinkiiwwan keessaniif asitti itti fayyadama. Walqabsiisoota keessan: chaatii dhuunfaa @VideonerBot wajjin keessatti /accounts.",
  accountsLine: (platform, where, active) => `• ${platform} — ${where}${active ? "" : " (⚠️ seensi hin hojjetu)"}`,
  accountsGroupLine: (platform, owner, active) => `• ${platform} — ${owner}${active ? "" : " (⚠️ seensi hin hojjetu)"}`,
  accountsWhereHere: "chaatii dhuunfaa",
  accountsWhereGroup: (title) => `garee “${title}”`,
  accountsDeleteButton: (platform, where) => `🗑 ${platform} · ${where}`,
  accountsDeleteAllButton: "🗑 Walqabsiisoota koo hunda haqaa",
  accountsDeleted: "Haqameera.",
  accountsDeletedAll: (n) => `Walqabsiisoonni haqaman: ${n}.`,
  accountsNotAllowed: "Haquu kan danda'u nama walqabsiise ykn bulchaa garee qofa.",
  connectUsage:
    "/connect KOODII ergaa. Koodii qabduun “🔑 Akkaawuntii … keessan bootii wajjin walqabsiisaa” dabalata Videoner kompiitara irraa isiniif kenna. Walqabsiisoota keessan: /accounts.",
  connectOnlyAdmins: "Garee kanaan akkaawuntii walqabsiisuu kan danda'an bulchitoota qofa (/settings ilaalaa).",
  connectDone: (platform, where) =>
    `✅ ${platform} ${where} walqabsiifameera. Bootiin amma waan namoota seenan qofaaf mul'atus ni buufata. Ilaaluuf ykn haquuf: /accounts.\n\n⚠️ Waltajjichi buufannaa ofumaan ta'uuf akkaawuntii daangeessuu danda'a — akkaawuntii lammaffaa fayyadamuun wayya.`,
  connectWhereGroup: "garee kanaan",
  connectWhereHere: "buufannaa keessan chaatii dhuunfaa fi haala inline keessatti",
  connectCodeNotFound: "Koodiin hin argamne ykn yeroon isaa darbeera (koodiin daqiiqaa 10 qofa tura). Dabalata Videoner keessatti koodii haaraa argadhaa.",
  connectRejectedNoSession: "Kuukiin kun seensa hin qabu. Marsariitii waltajjichaa irratti seenaatii kuukii irra deebi'aa baasaa.",
  connectRejectedUnknown: "Kuukiin waltajjiiwwan deeggaramanii hin argamne: Instagram, Facebook, YouTube, X, VK, TikTok.",
  connectUnavailable: "Akkaawuntii walqabsiisuun ammaaf hin jiru.",
  connectFailed: "Walqabsiisuu hin dandeenye, irra deebi'aa yaalaa.",
  connectFileTooBig: "Faayilichi baay'ee guddaa dha — kuukii marsariitii barbaachisu qofa baasaa.",
  connectNotAnonymous: "Akkaawuntii akka ofii keessaniitti walqabsiisaa, akka garee maqaa dhoksuun miti: yoo kanaa miti walqabsiisoonni bulchitootaa walitti makamu. Koodii sana balleesseera — haaraa argadhaa.",
  connectCodeInGroup:
    "Koodiin walqabsiisaa chaatii garee keessatti maxxanfame namoota biroon mul'achuu danda'a — koodii balleesseera, ergaas haqeera. Haaraa argadhaatii /connect KOODII jedhaa ergaa: ergaa ajaja sanaa battaluma nan haqa.",
  groupWelcome:
    "👋 Akkam! Chaatii kana keessatti liinkii viidiyoowwan TikTok, Instagram, YouTube, VK fi waltajjiiwwan biroo irraa maxxansaa — viidiyoo mataa isaatiin deebisa.\n\n" +
    "Viidiyoowwan hanga daqiiqaa 15 ofumaan nan buufadha, ajajni hin barbaachisu, yeroo biraa immoo callisa.\n\n⚙️ Bulchitoonni garee /settings'n na qindeessuu danda'u: ergaawwan liinkii haquu, akkaataa ibsaa, qulqullina, viidiyoowwan dheeraa fi afaan.\n\n⚡ Sagalee argachuuf liinkii booda -audio dabalaa, qulqullina isa caalu argachuuf immoo -hd.\n\n📣 Oduu pirojektii: @videonerdownload",
  errorTooLong: "viidiyoon kun baay'ee dheeraa dha — viidiyoowwan akkasii dheeratan ammaaf buufachuu hin dandeenyu.",
  errorUnknown: "viidiyoo kana buufachuu hin dandeenye. Xiqqoo booda irra deebi'aa yaalaa ykn liinkii biraa ergaa.",
  inlineHintButton: "Liinkii bootiif ergaa",
  inlineResultTitle: "⬇️ Viidiyoo buufadhaa",
  inlineResultDescription: "Viidiyoon chaatii kana keessatti kallattiin ni maxxanfama",
  inlinePlaceholder: "⏬ Buufachaa jira, daqiiqaa muraasa fudhachuu danda'a...",
  inlineOpenBot: "Bootii banaa",
  inlineOnlySingleVideo:
    "Haalli kun viidiyoo tokko qofa erga. Maxxansoota faayilota hedduu qabaniif ykn suuraawwaniif, liinkicha chaatii dhuunfaa keessatti bootiif ergaa.",
  inlineSubscribeRequired: (channel: string) =>
    `Buufachuuf, ${channel} hordofaatii irra deebi'aa yaalaa.`,
  inlineRateLimited: "Gaaffiiwwan baay'een walitti aananii dhufan. Daqiiqaa tokko eegaatii irra deebi'aa yaalaa.",
  queueRest: (count) => `\n\n📋 Liinkiiwwan ammallee tarree eegumsaa keessa jiran: ${count}. Kana booda tokko tokkoon isinittan agarsiisa.`,
  queuedOne: (position) =>
    `📋 Liinkiin tarree eegumsaatti dabalameera, #${position}. Dura isa amma jiru haa xumurru — sana booda filannoo qulqullinaa isaa isinittan agarsiisa.`,
  queuedMany: (added, waiting) =>
    `📋 Liinkiiwwan tarree eegumsaatti dabalaman: ${added}. Waliigala kan eegaa jiran: ${waiting}. Isa amma jiru booda tokko tokkoon isinittan agarsiisa.`,
  queueDuplicates: (count) =>
    count === 1
      ? "Liinkiin kun duraanuu tarree eegumsaa keessa jira — al lama hin dabalamu."
      : `Liinkiiwwan duraanuu tarree eegumsaa keessa jiran al lama hin dabalaman (irra deddeebi'an: ${count}).`,
  queueFull: (limit, rejected) =>
    `Tarreen eegumsaa liinkii ${limit} ol hin qabatu — kanneen hafan hin dabalamne (${rejected}). Erga tarreen socho'ee booda ergaa.`,
  skipButton: "✖️ Hin buufatinaa",
  skipped: "⏭ Liinkii kana irra darbeera.",
  chooseTimedOut: "⌛ Daqiiqaa 30 keessatti qulqullinni hin filatamne — liinkii kana irra darbaa jira.",
  queueLostOnRestart: (count) =>
    `⚠️ Bootiin fooyya'iinsaaf irra deebi'ee ka'aa jira — tarreen eegumsaa haqameera (liinkiiwwan: ${count}). Daqiiqaa tokko booda irra deebi'aa ergaa.`,
  subtitlesButton: "📝 Barreeffama jalaa",
  subtitlesBack: "⬅️ Gara qulqullinaatti deebi'aa",
  subtitlesAuto: "ofumaan",
  subtitlesChoose: "Afaan barreeffama jalaa filadhaa",
  subtitlesPreparing: "📝 Barreeffama jalaa qopheessaa jira...",
  subtitlesFailed: "Barreeffama jalaa afaan kanaan buufachuu hin dandeenye. Afaan biraa yaalaa.",
  subtitlesBusy: "YouTube amma barreeffama jalaa hin kennu — daqiiqaa muraasa booda irra deebi'aa yaalaa.",
  playlistFound: (title, count) =>
    `📃 Tarree viidiyoo${title ? ` “${title.slice(0, 150)}”` : ""}: viidiyoo ${count}.\nTokko tokkoon nan buufadha. Akkaataa kam?`,
  playlistStdButton: "🎬 720p",
  playlistHdButton: "🎬 Qulqullina isa caalu",
  playlistAudioButton: "🎵 Sagalee qofa (mp3)",
  playlistNoButton: "✖️ Lakki, galatoomaa",
  playlistQueued: (count) =>
    `📃 Viidiyoowwan tarree viidiyoo irraa tarree eegumsaatti galan: ${count}. Tokko tokkoon nan erga. Qabduu armaan gadiitiin ykn /stop'n dhaabaa.`,
  playlistFailed: "Tarree viidiyoo banuu hin dandeenye — dhuunfaa ta'uu danda'a. Liinkii viidiyoo tokkoo ergaa.",
  stopButton: "⏹ Dhaabi",
  stopped: (dropped) => `⏹ Dhaabbateera.${dropped ? ` Liinkiiwwan tarree eegumsaa keessaa haqaman: ${dropped}.` : ""}`,
  nothingToStop: "Amma wanti buufatamaa jiru hin jiru.",
  languageChoose: "🌐 Afaan bootii filadhaa. “Ofumaan” afaan Telegram keessanii hordofa.",
  languageChooseGroup: "🌐 Afaan deebii bootii garee kana keessatti. “Ofumaan” — afaan Telegram miseensa tokkoon tokkoo.",
  languageAuto: "Ofumaan — akka Telegram",
  languageAutoGroup: "Ofumaan — afaan miseensa tokkoon tokkoo",
  languageSaved: (name) => `✅ Afaan bootii: ${name}. /language'n jijjiiruu dandeessu.`,
  languageSavedAuto: "✅ Bootiin afaan Telegram keessanii hordofa. /language'n jijjiiruu dandeessu.",
  settingsLanguageButton: (name) => `🌐 Afaan: ${name ?? "ofumaan"}`,
  settingsBack: "⬅️ Gara qindaa'inaatti deebi'aa",
};

const ha: Messages = {
  start: "Sannu! Ku aiko min da hanyar haɗi ta bidiyo daga YouTube, TikTok, Instagram, Facebook, Twitter/X, Vimeo, VK, Rutube, OK.ru, Pinterest ko Threads — zan taimaka muku ku sauke shi.\n\n✨ Babu iyaka a inganci: za ku sami duk abin da dandalin ke bayarwa, har zuwa 4K — muddin fayil ɗin bai wuce 2 GB ba, iyakar da Telegram ya sanya wa bot. Babu wani abu na biya a nan.\n\nKyauta ne gaba ɗaya: babu biyan kuɗi na wata-wata, babu talla, babu sayayya a cikin manhaja.\n\n🧩 Kuna saukewa a kwamfuta? Ku sanya ƙarin burauza — maɓallin “Sauke” zai bayyana kai tsaye a shafin bidiyon: videoner.download/ha/extension\n\n👥 Ku ƙara ni a rukuni, zan wallafa bidiyoyin hanyoyin haɗin da mutane ke turawa a can.\n\n⚡ Ku tsallake zaɓin inganci: ku ƙara -audio bayan hanyar haɗi don sauti kawai (mp3), ko -hd don mafi kyawun inganci.\n\n📣 Labaran aikin: @videonerdownload\n\n🌐 Harshen bot: /language",
  notLink: "Wannan bai yi kama da hanyar haɗi ba. Ku aiko min da hanyar haɗi ta bidiyo.",
  inviteGreeting: "Sannu! Ni ne Videoner — ina sauke bidiyo daga YouTube, TikTok, Instagram da sauran dandamali kyauta. Ina shirya muku bidiyon da aka turo muku 👇",
  inviteNotFound: "Ban sami bidiyo don wannan hanyar haɗin gayyata ba. Ku aiko min da hanyar haɗi ta bidiyo, zan sauke shi.",
  inviteUnavailable: "Ban iya buɗe bidiyon daga wannan hanyar haɗi ba — sabis ɗin ba ya amsawa a yanzu. Ku sake buɗe wannan hanyar haɗi bayan minti ɗaya.",
  fetchingInfo: "🔍 Ana samo bayanan bidiyo...",
  audioOnlyButton: "🎵 Sauti kawai (mp3)",
  photoButton: "📷 Sauke hotuna",
  slideshowButton: "🎞 Nunin hotuna (bidiyo)",
  galleryButton: "📷+🎞 Hotuna da nunin hotuna",
  chooseQuality: (title, duration) => `“${title}”${duration ? `\n⏱ ${duration}` : ""}\n\nKu zaɓi inganci:`,
  sessionExpired: "Lokacin zama ya ƙare — ku sake aiko da hanyar haɗin",
  downloading: "⏬ Ana saukewa, wannan na iya ɗaukar mintuna kaɗan...",
  downloadFailed: "saukewa ta gaza",
  downloadProgress: (percent, eta, done) =>
    `⏬ Ana saukewa: ${percent}%${eta ? ` · saura ${eta}` : ""}${done ? `\n${done}` : ""}`,
  downloadFinishing: "⚙️ An kusa gamawa — ana haɗa fayil ɗin...",
  converting: (percent) => `⚙️ Ana canzawa: ${percent}%`,
  etaUnderMinute: "ƙasa da minti ɗaya",
  etaMinutes: (minutes) => `~minti ${minutes}`,
  etaHours: (hours, minutes) => `~awa ${hours}${minutes ? ` minti ${minutes}` : ""}`,
  downloadTimeout: "saukewar na ɗaukar lokaci mai tsawo — da alama bidiyon yana da nauyi sosai. Ku gwada ƙaramin inganci.",
  downloadInterrupted: "⚠️ Bot yana sake farawa don sabuntawa — saukewarku ta katse. Don Allah ku sake aiko da hanyar haɗin bayan minti ɗaya.",
  fileTooBig: (mb, url) =>
    `Fayil ɗin ya zama babba (${mb} MB) — Telegram ba zai bar bot ya aika shi ba.\nKu sauke shi a nan: ${url}`,
  sendingFile: "📤 Ana aika fayil...",
  sendingAlbum: (count) => `📤 Wannan wallafa tana da fayiloli da yawa (${count}) — ana aika su a matsayin kundi...`,
  failedPrefix: "❌ An gaza: ",
  fileCaption: (title, sourceUrl, shareUrl, description) =>
    composeCaption(
      title,
      description,
      `Tushe: ${sourceUrl}\n` +
        "Duk haƙƙoƙin bidiyon na mai shi ne.\n" +
        "An sauke kyauta tare da @VideonerBot",
      `📣 Labaran aikin: ${NEWS_CHANNEL}`,
      shareUrl && `🔗 Raba: ${shareUrl}`,
    ),
  subscribeRequired: (channel) =>
    `Don saukewa, don Allah ku yi rajista a tasharmu ${channel} — wannan ne kawai sharaɗi, sabis ɗin zai ci gaba da zama kyauta.\n\n` +
    "Ku yi rajista sannan ku danna “Na yi rajista”.",
  openChannelButton: "📣 Buɗe tashar",
  checkSubscriptionButton: "Na yi rajista",
  subscribeThanks: "Na gode! Yanzu ku aiko min da hanyar haɗi ta bidiyo.",
  subscribeThanksResuming: "Na gode! Ina ci gaba da hanyar haɗinku yanzu.",
  subscribeStillMissing: "Har yanzu ban ga rajistar ba. Ku yi rajista sannan ku sake dannawa.",
  channelNotice: (channel) => `\n\nHanyar haɗin wannan wallafa za ta bayyana a ${channel} — ba tare da sunanku ba.`,
  channelPost: (title, url) =>
    (title ? `🎬 ${title.slice(0, 200)}\n\n` : "") +
    `${url}\n\n` +
    "Ku sauke wannan da kowane bidiyo kyauta: @VideonerBot",
  errorStoryNeedsId:
    "ku aiko da hanyar haɗi ta takamaiman labari (story): ku buɗe shi a manhajar Instagram sannan ku danna Share → Copy link.",
  errorInstagramStory:
    "Labaran (stories) Instagram suna bayyana ne kawai ga mutanen da suka shiga asusunsu.",
  errorLoginRequired:
    "Wannan wallafa ba ta samuwa ba tare da shiga asusu ba: dandalin yana ba da ita ne kawai ga " +
    "masu amfani da suka shiga. Hakan na faruwa da wallafe-wallafe na sirri, abun ciki mai iyakar shekaru da " +
    "wallafe-wallafen da aka raba ga taƙaitattun mutane.\n\n" +
    "Wallafe-wallafen jama'a suna saukuwa ba tare da matsala ba — ku gwada wata hanyar haɗi.",
  errorUnsupportedPlatform:
    "Ban gane wannan hanyar haɗi ba — ku tabbatar hanyar haɗi ce kai tsaye ta bidiyo daga YouTube, TikTok, Instagram, Facebook, Twitter/X, Vimeo, VK, Rutube, OK.ru, Pinterest ko Threads.",
  errorFileTooLarge: "fayil ɗin ya wuce 2 GB — Telegram ba ya bar bot su aika manyan fayiloli. Ku sauke shi a shafin yanar gizo ko da ƙarin burauza — maɓallan da ke ƙasa. Ko ku sake aiko da hanyar haɗin ku zaɓi ƙaramin inganci.",
  siteButton: "🌐 Sauke a shafin yanar gizo",
  qualitiesHiddenBySize: (limit) =>
    `\n\n⚖️ An ɓoye ingancin da ya fi ${limit} nauyi: Telegram ba ya bar bot su aika manyan fayiloli. Kuna iya sauke su a shafin yanar gizo ko da ƙarin burauza — maɓallan da ke ƙasa.`,
  videoTooBigForTelegram: (smallest) =>
    `\n\n⚖️ Wannan bidiyo ya yi nauyi sosai ga Telegram ko a mafi ƙarancin inganci (~${smallest}): Telegram ba ya bar bot su aika fayilolin da suka wuce 2 GB. A nan kuna iya samun sauti kawai; bidiyon kuwa — a shafin yanar gizo ko da ƙarin burauza (maɓallan da ke ƙasa).`,
  errorFormatUnavailable: "Wannan inganci ba ya samuwa ga wannan bidiyo. Ku sake aiko da hanyar haɗin — zan nuna muku jerin na yanzu.",
  errorNoVideoContent: "Babu bidiyon da za a sauke a wannan hanyar haɗi — da alama wallafar hotuna kawai ce.",
  errorRegionBlocked:
    "An toshe wannan bidiyo a wajen ƙasar mai shi — dandalin ba zai ba da shi " +
    "ga sabarmu ba. Babu hanyar kewaye shi: takunkumin daga gefensu ne." +
    "\n\nSauran hanyoyin haɗi suna saukuwa kamar yadda aka saba.",
  errorRateLimited: "Hanyoyin haɗi sun yi yawa a jere — ku jira kaɗan sannan ku sake aikowa.",
  errorYoutubeDailyLimit: (gb) => `kun sauke fiye da ${gb} GB daga YouTube cikin awanni 24 da suka wuce — wannan ne iyakar bot ta yau da kullum ga kowane mutum. Tana ƙirga awanni 24 na ƙarshe, don haka kuna iya sauke sabbin bidiyoyin YouTube nan gaba kaɗan. Sauran dandamali suna aiki kamar yadda aka saba.`,
  playlistStoppedByLimit: (dropped) => `⏹ An dakatar da jerin bidiyo: an kai iyakar YouTube ta yau da kullum. Bidiyoyin da ba a sauke ba: ${dropped}. Ku sake aiko da hanyar haɗin jerin bidiyon daga baya.`,
  errorPlatformRefused:
    "dandalin bai ba sabarmu wannan bidiyo ba. Hakan na faruwa da wallafe-wallafe na sirri " +
    "ko masu iyakar shekaru, kuma wani lokaci dandalin kawai yana taƙaita samun dama na " +
    "ɗan lokaci. Ku sake gwadawa bayan mintuna kaɗan.",
  errorThreadsNoMedia:
    "babu bidiyo ko hoto da ake gani a wannan wallafar Threads. Ko dai wallafa ce ta rubutu kawai, ko kuma " +
    "Threads yana nuna hotuna da bidiyonta ne kawai ga waɗanda suka shiga asusu — irin waɗannan wallafe-wallafe ba za a iya sauke su ba sai an shiga.",
  extensionHint:
    "\n\n💻 Kuna iya sauke shi da ƙarin burauza na Videoner a kwamfuta: " +
    "yana saukewa ta amfani da shigarku a dandalin, kuma babu kalmar sirri ko cookies da ke barin burauzarku.",
  privateConnectHint: (platform, withExtension) =>
    `\n\n🔑 Don sauke irin waɗannan wallafe-wallafe, ku haɗa asusunku na ${platform} da bot — sau ɗaya. Bayan haka bot zai sauke duk abin da kuke iya gani: wallafe-wallafe na sirri, reels da stories, har daga wayarku. Maɓallin da ke ƙasa yana nuna yadda ake yi.${withExtension ? "\n\n💻 Ko ku sauke shi da ƙarin burauza na Videoner a kwamfuta." : ""}`,
  privateReconnectHint: (platform, withExtension) =>
    `\n\n⚠️ Asusunku na ${platform} da aka haɗa bai iya buɗe wannan wallafa ba. Wataƙila shigar ta daina aiki — ku sake haɗa asusun. Ko kuma wannan asusu ba shi da damar ganin wallafar.${withExtension ? "\n\n💻 Kuna kuma iya sauke shi da ƙarin burauza na Videoner a kwamfuta." : ""}`,
  connectAccountButton: "🔑 Haɗa asusu",
  reconnectAccountButton: "🔑 Sake haɗawa",
  extensionButton: "🧩 Sauke da ƙarin burauza",
  extensionCommand:
    "🧩 Videoner don burauzarku: maɓallin “Sauke” kai tsaye a shafin bidiyo — YouTube, Instagram, TikTok, VK, bidiyoyi na sirri daga asusunku da darussan GetCourse.\n\nDon Chrome, Edge, Opera, Yandex Browser da Firefox a kwamfuta.",
  extensionPageButton: "🧩 Sanya ƙarin burauza",
  addToGroupButton: "👥 Ƙara a rukuni",
  newsButton: "📣 Labaran aikin",
  fileCaptionShort: (title, sourceUrl) =>
    withOptionalLines((title ? `🎬 ${title.slice(0, 200)}\n\n` : "") + sourceUrl, `📣 Labaran aikin: ${NEWS_CHANNEL}`, undefined),
  sentBy: (name) => `👤 ${name}`,
  groupSettings: (s, canDelete) =>
    "⚙️ Saitunan bot na wannan rukuni\n\n" +
    `🗑 Goge saƙon da ke ɗauke da hanyar haɗi: ${s.deleteLinks ? "e" : "a'a"}\n` +
    "Da zarar an aika bidiyon, ana goge saƙon da ke ɗauke da hanyar haɗi kawai — tattaunawar tana riƙe bidiyon kawai tare da sunan wanda ya turo shi.\n" +
    (s.deleteLinks && !canDelete
      ? "⚠️ Ba zan iya goge saƙonni yanzu ba: ku mai da ni admin tare da izinin “Delete messages”.\n"
      : "") +
    `\n✍️ Rubutu a ƙarƙashin bidiyo: ${{ full: "cikakke", short: "take da tushe", none: "babu rubutu" }[s.caption] ?? s.caption}\n` +
    `\n🎞 Inganci: ${s.quality === "max" ? "mafi girma da Telegram ke karɓa" : "na yau da kullum (720p)"}\n` +
    `\n⏱ Dogayen bidiyoyi: ${s.longVideos ? "kowane tsawo" : "har zuwa minti 15 kawai"}\n` +
    `\n🔑 Wa zai iya haɗa asusunsa (don stories da wallafe-wallafe na sirri): ${s.cookiesBy === "all" ? "kowane memba" : "admins kawai"}\n` +
    `\n🌐 Harshen amsa: ${s.language ? langName(s.language) : "na kowane memba"}\n` +
    "\nAdmins na rukuni ne kawai za su iya canza saitunan.",
  settingsDeleteButton: (on) => `🗑 Goge hanyoyin haɗi: ${on ? "e" : "a'a"}`,
  settingsCaptionButton: (style) => `✍️ Rubutu: ${{ full: "cikakke", short: "gajere", none: "babu" }[style] ?? style}`,
  settingsQualityButton: (mode) => `🎞 Inganci: ${mode === "max" ? "mafi girma" : "720p"}`,
  settingsLongButton: (on) => `⏱ Dogayen bidiyoyi: ${on ? "e" : "har minti 15"}`,
  settingsDoneButton: "✅ An gama",
  settingsAdminsOnly: "Admins na rukuni ne kawai za su iya canza saitunan.",
  settingsGroupsOnly: "Saitunan na rukunoni ne: ku ƙara ni a rukuni sannan ku aika /settings a can.",
  settingsFailed: "Ban iya adana saitunan ba, don Allah ku sake gwadawa.",
  settingsCookiesButton: (by) => `🔑 Haɗa asusu: ${by === "all" ? "kowa" : "admins"}`,
  accountsIntro:
    "🔑 Asusun da aka haɗa\n\nBot zai iya sauke abin da waɗanda suka shiga asusu kawai ke gani (stories na Instagram, wallafe-wallafe na sirri) — ta amfani da asusunku. Shiga yana aiki a inda kuka haɗa shi: wanda ke cikin tattaunawar sirri yana yi wa saukewarku aiki, har da hanyoyin haɗinku a rukunonin da ba su da nasu asusu; wanda aka haɗa da rukuni yana yi wa dukkan membobinsa aiki.",
  accountsHowTo:
    "Yadda ake haɗawa:\n1. Mafi sauƙi: ƙarin burauza na Videoner a kwamfuta — ku shiga a shafin dandalin, ku buɗe taga na Videoner, ku danna “🔑 Haɗa asusunku na … da bot” sannan ku aiko min da lambar. Don rukuni, ku aika /connect LAMBA a cikin wannan rukuni.\n2. Ko ku aiko min da fayil ɗin cookies.txt (cookies da aka fitar daga burauza), ko ku liƙa rubutunsa a matsayin saƙo.\n3. Daga wayar Android — da Firefox da ƙarin Cookie-Editor: https://videoner.download/ha/blog/android-firefox",
  accountsWarning:
    "⚠️ Dandamali ba sa son saukewa ta atomatik kuma suna iya taƙaita ko dakatar da asusun. Gara ku haɗa asusu na biyu, ba babban asusunku ba. Ana adana cookies a ɓoye (encrypted), ana amfani da su ne don saukewa kawai, kuma ana cire su da maɓallan da ke ƙasa.",
  accountsNone: "Har yanzu ba a haɗa komai ba.",
  accountsGroupTitle: "🔑 Asusun da aka haɗa da wannan rukuni",
  accountsGroupHowTo:
    "Don haɗa ɗaya ga dukkan rukunin: ku sami lamba da maɓallin “🔑 Haɗa asusunku na … da bot” a cikin ƙarin burauza na Videoner sannan ku aika /connect LAMBA a nan. Idan kun haɗa asusu a tattaunawarku ta sirri kawai, bot zai yi amfani da shi a nan don hanyoyin haɗinku. Haɗin ku: /accounts a tattaunawar sirri da @VideonerBot.",
  accountsLine: (platform, where, active) => `• ${platform} — ${where}${active ? "" : " (⚠️ shiga ba ya aiki)"}`,
  accountsGroupLine: (platform, owner, active) => `• ${platform} — ${owner}${active ? "" : " (⚠️ shiga ba ya aiki)"}`,
  accountsWhereHere: "tattaunawar sirri",
  accountsWhereGroup: (title) => `rukuni “${title}”`,
  accountsDeleteButton: (platform, where) => `🗑 ${platform} · ${where}`,
  accountsDeleteAllButton: "🗑 Cire dukkan haɗina",
  accountsDeleted: "An cire.",
  accountsDeletedAll: (n) => `An cire haɗi: ${n}.`,
  accountsNotAllowed: "Wanda ya haɗa shi ko admin na rukuni ne kawai zai iya cire shi.",
  connectUsage:
    "Ku aika /connect LAMBA. Maɓallin “🔑 Haɗa asusunku na … da bot” a cikin ƙarin burauza na Videoner a kwamfuta yana ba ku lambar. Haɗin ku: /accounts.",
  connectOnlyAdmins: "Admins ne kawai za su iya haɗa asusu da wannan rukuni (duba /settings).",
  connectDone: (platform, where) =>
    `✅ An haɗa ${platform} ${where}. Yanzu bot yana kuma sauke abin da waɗanda suka shiga asusu kawai ke gani. Duba ko cire: /accounts.\n\n⚠️ Dandalin na iya taƙaita asusun saboda saukewa ta atomatik — gara ku yi amfani da asusu na biyu.`,
  connectWhereGroup: "da wannan rukuni",
  connectWhereHere: "don saukewarku a tattaunawar sirri da yanayin inline",
  connectCodeNotFound: "Ba a sami lambar ba ko ta ƙare (lambobi suna aiki na minti 10). Ku sami sabuwa a cikin ƙarin burauza na Videoner.",
  connectRejectedNoSession: "Waɗannan cookies ba su da shiga. Ku shiga a shafin dandalin sannan ku sake fitar da cookies.",
  connectRejectedUnknown: "Ba a sami cookies na dandamali da ake tallafawa ba: Instagram, Facebook, YouTube, X, VK, TikTok.",
  connectUnavailable: "Haɗa asusu bai samu ba tukuna.",
  connectFailed: "Ban iya haɗawa ba, don Allah ku sake gwadawa.",
  connectFileTooBig: "Fayil ɗin ya yi girma sosai — ku fitar da cookies na shafin da ake buƙata kawai.",
  connectNotAnonymous: "Ku haɗa asusun a matsayinku, ba a ɓoye a matsayin rukunin ba: in ba haka ba haɗin admins zai cakuɗe. Na lalata lambar — ku sami sabuwa.",
  connectCodeInGroup:
    "Lambar haɗi da aka wallafa a tattaunawar rukuni wasu za su iya gani — na lalata ta kuma na cire saƙon. Ku sami sabuwa sannan ku aika ta da /connect LAMBA: zan goge saƙon umarnin nan take.",
  groupWelcome:
    "👋 Sannu! Ku wallafa hanyoyin haɗi na bidiyo daga TikTok, Instagram, YouTube, VK da sauran dandamali a wannan tattaunawa — zan amsa da bidiyon kansa.\n\n" +
    "Ina sauke bidiyoyi har zuwa minti 15 da kaina, ba tare da umarni ba, kuma ina yin shiru a sauran lokuta.\n\n⚙️ Admins na rukuni za su iya daidaita ni da /settings: goge saƙonnin hanyoyin haɗi, salon rubutu, inganci, dogayen bidiyoyi da harshe.\n\n⚡ Ku ƙara -audio bayan hanyar haɗi don samun sauti, ko -hd don mafi kyawun inganci.\n\n📣 Labaran aikin: @videonerdownload",
  errorTooLong: "bidiyon ya yi tsawo sosai — ba za mu iya sauke irin waɗannan dogayen bidiyoyi ba tukuna.",
  errorUnknown: "ban iya sauke wannan bidiyo ba. Ku sake gwadawa nan gaba kaɗan ko ku aiko da wata hanyar haɗi.",
  inlineHintButton: "Aika hanyar haɗi ga bot",
  inlineResultTitle: "⬇️ Sauke bidiyo",
  inlineResultDescription: "Za a wallafa bidiyon kai tsaye a wannan tattaunawa",
  inlinePlaceholder: "⏬ Ana saukewa, wannan na iya ɗaukar mintuna kaɗan...",
  inlineOpenBot: "Buɗe bot",
  inlineOnlySingleVideo:
    "Wannan yanayi yana aika bidiyo ɗaya ne kawai. Don wallafe-wallafe masu fayiloli da yawa ko hotuna, ku aika hanyar haɗin ga bot a tattaunawar sirri.",
  inlineSubscribeRequired: (channel: string) =>
    `Don saukewa, ku yi rajista a ${channel} sannan ku sake gwadawa.`,
  inlineRateLimited: "Buƙatu sun yi yawa a jere. Ku jira minti ɗaya sannan ku sake gwadawa.",
  queueRest: (count) => `\n\n📋 Hanyoyin haɗi da suka rage a layi: ${count}. Zan nuna su ɗaya bayan ɗaya bayan wannan.`,
  queuedOne: (position) =>
    `📋 An saka hanyar haɗin a layi, na ${position}. Bari mu gama na yanzu da farko — sannan zan nuna muku zaɓin inganci gare shi.`,
  queuedMany: (added, waiting) =>
    `📋 An ƙara hanyoyin haɗi a layi: ${added}. Jimillar masu jira: ${waiting}. Zan nuna su ɗaya bayan ɗaya bayan na yanzu.`,
  queueDuplicates: (count) =>
    count === 1
      ? "Wannan hanyar haɗi tana cikin layi tuni — ba zan ƙara ta sau biyu ba."
      : `Hanyoyin haɗin da ke cikin layi tuni ba a ƙara su sau biyu (maimaitawa: ${count}).`,
  queueFull: (limit, rejected) =>
    `Layi yana ɗaukar hanyoyin haɗi ${limit} ne kawai — ba a ƙara sauran ba (${rejected}). Ku aiko da su da zarar layin ya ci gaba.`,
  skipButton: "✖️ Kada a sauke",
  skipped: "⏭ An tsallake wannan hanyar haɗi.",
  chooseTimedOut: "⌛ Ba a zaɓi inganci cikin minti 30 ba — ana tsallake wannan hanyar haɗi.",
  queueLostOnRestart: (count) =>
    `⚠️ Bot yana sake farawa don sabuntawa — an share layin (hanyoyin haɗi: ${count}). Don Allah ku sake aiko da su bayan minti ɗaya.`,
  subtitlesButton: "📝 Rubutun ƙasa",
  subtitlesBack: "⬅️ Koma ga inganci",
  subtitlesAuto: "atomatik",
  subtitlesChoose: "Ku zaɓi harshen rubutun ƙasa",
  subtitlesPreparing: "📝 Ana shirya rubutun ƙasa...",
  subtitlesFailed: "Ban iya sauke rubutun ƙasa a wannan harshe ba. Ku gwada wani harshe.",
  subtitlesBusy: "YouTube ba ya bayar da rubutun ƙasa a yanzu — ku sake gwadawa bayan mintuna kaɗan.",
  playlistFound: (title, count) =>
    `📃 Jerin bidiyo${title ? ` “${title.slice(0, 150)}”` : ""}: bidiyo ${count}.\nZan sauke su ɗaya bayan ɗaya. Wane tsari?`,
  playlistStdButton: "🎬 720p",
  playlistHdButton: "🎬 Mafi kyawun inganci",
  playlistAudioButton: "🎵 Sauti kawai (mp3)",
  playlistNoButton: "✖️ A'a, na gode",
  playlistQueued: (count) =>
    `📃 An saka bidiyoyi daga jerin bidiyo a layi: ${count}. Zan aika su ɗaya bayan ɗaya. Ku tsayar da maɓallin da ke ƙasa ko /stop.`,
  playlistFailed: "Ban iya buɗe jerin bidiyon ba — wataƙila na sirri ne. Ku aiko da hanyar haɗi ta bidiyo ɗaya.",
  stopButton: "⏹ Tsaya",
  stopped: (dropped) => `⏹ An tsayar.${dropped ? ` Hanyoyin haɗin da aka cire daga layi: ${dropped}.` : ""}`,
  nothingToStop: "Babu abin da ake saukewa a yanzu.",
  languageChoose: "🌐 Ku zaɓi harshen bot. “Atomatik” yana bin harshen Telegram ɗinku.",
  languageChooseGroup: "🌐 Harshen amsar bot a wannan rukuni. “Atomatik” — harshen Telegram na kowane memba.",
  languageAuto: "Atomatik — kamar a Telegram",
  languageAutoGroup: "Atomatik — na kowane memba",
  languageSaved: (name) => `✅ Harshen bot: ${name}. Ku canza shi da /language.`,
  languageSavedAuto: "✅ Bot yana bin harshen Telegram ɗinku. Ku canza shi da /language.",
  settingsLanguageButton: (name) => `🌐 Harshe: ${name ?? "atomatik"}`,
  settingsBack: "⬅️ Koma ga saituna",
};

const so: Messages = {
  start: "Salaan! Ii soo dir link muuqaal oo ka yimid YouTube, TikTok, Instagram, Facebook, Twitter/X, Vimeo, VK, Rutube, OK.ru, Pinterest ama Threads — waan kaa caawin doonaa inaad soo dejiso.\n\n✨ Xad tayo ma jiro: waxaad helaysaa wax kasta oo madashu bixiso, ilaa 4K — inta faylku uusan ka badnayn 2 GB, xadka Telegram u yeelay bot-yada. Halkan ma jiraan adeegyo lacag ah.\n\nGabi ahaanba waa bilaash: ma jiro rukummo, ma jiro xayaysiis, mana jiro wax iibsasho ah oo app-ka gudihiisa ah.\n\n🧩 Kombiyuutar ma ku soo dejinaysaa? Rakib kordhiyaha biraawsarka — badhanka “Soo deji” ayaa si toos ah uga soo muuqan doona bogga muuqaalka: videoner.download/so/extension\n\n👥 Igu dar koox, waxaanan halkaas ku dhejin doonaa muuqaallada link-yada dadku wadaagaan.\n\n⚡ Ka bood doorashada tayada: ku dar -audio link-ga kadib si aad u hesho codka oo keliya (mp3), ama -hd si aad u hesho tayada ugu fiican.\n\n📣 Wararka mashruuca: @videonerdownload\n\n🌐 Luqadda bot-ka: /language",
  notLink: "Taasi uma eka link. Ii soo dir link muuqaal.",
  inviteGreeting: "Salaan! Waxaan ahay Videoner — waxaan bilaash uga soo dejiyaa muuqaallada YouTube, TikTok, Instagram iyo madallo kale. Waxaan diyaarinayaa muuqaalka laguu soo wadaagay 👇",
  inviteNotFound: "Kuma aanan helin muuqaal link-gan martiqaadka ah. Ii soo dir link muuqaal, waanan soo dejin doonaa.",
  inviteUnavailable: "Ma aan furi karin muuqaalka link-gan — adeeggu hadda ma jawaabayo. Mar kale fur isla link-gaas daqiiqad kadib.",
  fetchingInfo: "🔍 Waxaan soo helayaa xogta muuqaalka...",
  audioOnlyButton: "🎵 Cod oo keliya (mp3)",
  photoButton: "📷 Soo deji sawirrada",
  slideshowButton: "🎞 Bandhig sawirro (muuqaal)",
  galleryButton: "📷+🎞 Sawirro iyo bandhig sawirro",
  chooseQuality: (title, duration) => `“${title}”${duration ? `\n⏱ ${duration}` : ""}\n\nDooro tayada:`,
  sessionExpired: "Waqtigu wuu dhacay — mar kale soo dir link-ga",
  downloading: "⏬ Waa la soo dejinayaa, tani waxay qaadan kartaa dhowr daqiiqo...",
  downloadFailed: "soo dejintu way fashilantay",
  downloadProgress: (percent, eta, done) =>
    `⏬ Waa la soo dejinayaa: ${percent}%${eta ? ` · ${eta} ayaa haray` : ""}${done ? `\n${done}` : ""}`,
  downloadFinishing: "⚙️ Ku dhawaad waa dhammaatay — faylka ayaa la isku ururinayaa...",
  converting: (percent) => `⚙️ Waa la beddelayaa: ${percent}%`,
  etaUnderMinute: "in ka yar daqiiqad",
  etaMinutes: (minutes) => `~${minutes} daqiiqo`,
  etaHours: (hours, minutes) => `~${hours} saac${minutes ? ` ${minutes} daqiiqo` : ""}`,
  downloadTimeout: "soo dejintu aad bay u dheeraatay — muuqaalku wuxuu u egyahay mid aad u culus. Isku day tayo ka hooseysa.",
  downloadInterrupted: "⚠️ Bot-ka ayaa dib loo bilaabayaa si loo cusbooneysiiyo — soo dejintaadii way go'day. Fadlan mar kale soo dir link-ga daqiiqad kadib.",
  fileTooBig: (mb, url) =>
    `Faylku wuxuu noqday mid weyn (${mb} MB) — Telegram uma oggola bot-ka inuu diro.\nHalkan ka soo deji: ${url}`,
  sendingFile: "📤 Faylka ayaa la dirayaa...",
  sendingAlbum: (count) => `📤 Boostadan waxay leedahay faylal dhowr ah (${count}) — waxaan u dirayaa albam ahaan...`,
  failedPrefix: "❌ Way fashilantay: ",
  fileCaption: (title, sourceUrl, shareUrl, description) =>
    composeCaption(
      title,
      description,
      `Isha: ${sourceUrl}\n` +
        "Dhammaan xuquuqda muuqaalka waxaa iska leh sameeyihiisa.\n" +
        "Bilaash lagu soo dejiyay @VideonerBot",
      `📣 Wararka mashruuca: ${NEWS_CHANNEL}`,
      shareUrl && `🔗 La wadaag: ${shareUrl}`,
    ),
  subscribeRequired: (channel) =>
    `Si aad wax u soo dejiso, fadlan ku biir kanaalkayaga ${channel} — taasi waa shuruudda keliya, adeeggu wuu sii ahaanayaa bilaash.\n\n` +
    "Ku biir oo riix “Waan ku biiray”.",
  openChannelButton: "📣 Fur kanaalka",
  checkSubscriptionButton: "Waan ku biiray",
  subscribeThanks: "Mahadsanid! Hadda ii soo dir link muuqaal.",
  subscribeThanksResuming: "Mahadsanid! Hadda ayaan qaadanayaa link-gaagii.",
  subscribeStillMissing: "Weli ma arko ku biiriddaada. Ku biir oo mar kale riix.",
  channelNotice: (channel) => `\n\nLink-ga boostadan wuxuu ka soo muuqan doonaa ${channel} — si qarsoodi ah, magacaaga la'aan.`,
  channelPost: (title, url) =>
    (title ? `🎬 ${title.slice(0, 200)}\n\n` : "") +
    `${url}\n\n` +
    "Bilaash ku soo deji kan iyo muuqaal kasta oo kale: @VideonerBot",
  errorStoryNeedsId:
    "soo dir link-ga story gaar ah: ka fur app-ka Instagram oo taabo Share → Copy link.",
  errorInstagramStory:
    "Stories-ka Instagram waxaa arki kara oo keliya dadka akoonkooda galay.",
  errorLoginRequired:
    "Boostadan lama heli karo adigoon akoon gelin: madashu waxay siisaa oo keliya " +
    "isticmaalayaasha akoonkooda galay. Taasi waxay dhacdaa boostooyinka gaarka ah, waxyaabaha da'da lagu xaddiday " +
    "iyo boostooyinka loo wadaagay dad xaddidan.\n\n" +
    "Boostooyinka dadweynaha si dhib la'aan ah ayaa loo soo dejiyaa — isku day link kale.",
  errorUnsupportedPlatform:
    "Ma aqoonsan karin link-gan — hubi inuu yahay link toos ah oo muuqaal ah oo ka yimid YouTube, TikTok, Instagram, Facebook, Twitter/X, Vimeo, VK, Rutube, OK.ru, Pinterest ama Threads.",
  errorFileTooLarge: "faylku wuu ka weyn yahay 2 GB — Telegram uma oggola bot-yada inay diraan faylal ka weyn. Ka soo deji websaydhka ama kordhiyaha biraawsarka — badhamada hoose. Ama mar kale soo dir link-ga oo dooro tayo ka hooseysa.",
  siteButton: "🌐 Ka soo deji websaydhka",
  qualitiesHiddenBySize: (limit) =>
    `\n\n⚖️ Tayooyinka ka culus ${limit} waa la qariyay: Telegram uma oggola bot-yada inay diraan faylal ka weyn. Waxaad ka soo dejisan kartaa websaydhka ama kordhiyaha biraawsarka — badhamada hoose.`,
  videoTooBigForTelegram: (smallest) =>
    `\n\n⚖️ Muuqaalkani aad buu ugu culus yahay Telegram xitaa tayada ugu hooseysa (~${smallest}): Telegram uma oggola bot-yada inay diraan faylal ka weyn 2 GB. Halkan waxaad ka heli kartaa codka oo keliya; muuqaalka — websaydhka ama kordhiyaha biraawsarka (badhamada hoose).`,
  errorFormatUnavailable: "Tayadaas looma hayo muuqaalkan. Mar kale soo dir link-ga — waxaan ku tusi doonaa liiska hadda jira.",
  errorNoVideoContent: "Link-gan ma laha muuqaal la soo dejiyo — boostadu waxay u egtahay sawirro oo keliya.",
  errorRegionBlocked:
    "Muuqaalkan waa laga xannibay meel ka baxsan dalka sameeyaha — madashu uma dirayso " +
    "server-kayaga. Ma jirto si looga gudbo: xaddidaaddu dhinacooda ayay ka timid." +
    "\n\nLink-yada kale si caadi ah ayaa loo soo dejiyaa.",
  errorRateLimited: "Link-yo aad u badan oo isku xiga — wax yar sug oo mar kale soo dir.",
  errorYoutubeDailyLimit: (gb) => `waxaad YouTube ka soo dejisay in ka badan ${gb} GB 24-kii saac ee la soo dhaafay — taasi waa xadka maalinlaha ah ee bot-ka ee qof kasta. Wuxuu xisaabiyaa 24-ka saac ee u dambeeyay, markaa waxaad soo dejin kartaa muuqaallo cusub oo YouTube ah wax yar kadib. Madallada kale si caadi ah ayay u shaqeeyaan.`,
  playlistStoppedByLimit: (dropped) => `⏹ Liiska muuqaallada waa la joojiyay: xadka maalinlaha ah ee YouTube waa la gaaray. Muuqaallada aan la soo dejin: ${dropped}. Mar dambe soo dir link-ga liiska muuqaallada.`,
  errorPlatformRefused:
    "madashu ma siin muuqaalkan server-kayaga. Tani waxay dhacdaa boostooyinka gaarka ah " +
    "ama kuwa da'da lagu xaddiday, mararka qaarkoodna madashu waxay xaddiddaa gelitaanka " +
    "muddo. Isku day mar kale dhowr daqiiqo kadib.",
  errorThreadsNoMedia:
    "boostadan Threads kuma muuqdo muuqaal ama sawir. Ama waa boost qoraal oo keliya ah, ama " +
    "Threads waxay warbaahinteeda tustaa oo keliya dadka akoonkooda galay — boostooyinkaas lama soo dejin karo adigoon akoon gelin.",
  extensionHint:
    "\n\n💻 Waxaad ku soo dejin kartaa kordhiyaha biraawsarka Videoner ee kombiyuutarka: " +
    "wuxuu soo dejiyaa isagoo adeegsanaya gelitaankaaga madasha, eraygaaga sirta ah iyo cookies-kaagu kama baxaan biraawsarkaaga.",
  privateConnectHint: (platform, withExtension) =>
    `\n\n🔑 Si aad u soo dejiso boostooyinka noocan ah, ku xir akoonkaaga ${platform} bot-ka — hal mar. Intaa kadib bot-ku wuxuu soo dejiyaa wax kasta oo aad arki karto: boostooyinka gaarka ah, reels iyo stories, xitaa taleefankaaga. Badhanka hoose ayaa ku tusaya sida.${withExtension ? "\n\n💻 Ama ku soo deji kordhiyaha biraawsarka Videoner ee kombiyuutarka." : ""}`,
  privateReconnectHint: (platform, withExtension) =>
    `\n\n⚠️ Akoonkaaga ${platform} ee ku xiran ma furi karin boostadan. Gelitaanku waxaa laga yaabaa inuu joojiyay shaqada — mar kale ku xir akoonka. Ama akoonkani ma laha gelitaan boostada.${withExtension ? "\n\n💻 Waxaad sidoo kale ku soo dejin kartaa kordhiyaha biraawsarka Videoner ee kombiyuutarka." : ""}`,
  connectAccountButton: "🔑 Ku xir akoonka",
  reconnectAccountButton: "🔑 Dib u xir",
  extensionButton: "🧩 Ku soo deji kordhiyaha",
  extensionCommand:
    "🧩 Videoner biraawsarkaaga: badhanka “Soo deji” oo toos ugu jira bogga muuqaalka — YouTube, Instagram, TikTok, VK, muuqaallo gaar ah oo akoonkaaga ka yimid iyo casharrada GetCourse.\n\nWaxaa loogu talagalay Chrome, Edge, Opera, Yandex Browser iyo Firefox ee kombiyuutarka.",
  extensionPageButton: "🧩 Rakib kordhiyaha",
  addToGroupButton: "👥 Ku dar koox",
  newsButton: "📣 Wararka mashruuca",
  fileCaptionShort: (title, sourceUrl) =>
    withOptionalLines((title ? `🎬 ${title.slice(0, 200)}\n\n` : "") + sourceUrl, `📣 Wararka mashruuca: ${NEWS_CHANNEL}`, undefined),
  sentBy: (name) => `👤 ${name}`,
  groupSettings: (s, canDelete) =>
    "⚙️ Dejinta bot-ka ee kooxdan\n\n" +
    `🗑 Tirtir fariinta link-ga leh: ${s.deleteLinks ? "haa" : "maya"}\n` +
    "Marka muuqaalka la diro, fariin ka koobnayd link-ga oo keliya waa la tirtiraa — sheekadu waxay haysaa muuqaalka oo keliya iyo magaca qofkii wadaagay.\n" +
    (s.deleteLinks && !canDelete
      ? "⚠️ Hadda ma tirtiri karo fariimaha: iga dhig admin leh xuquuqda “Delete messages”.\n"
      : "") +
    `\n✍️ Qoraalka muuqaalka: ${{ full: "buuxa", short: "cinwaanka iyo isha", none: "qoraal la'aan" }[s.caption] ?? s.caption}\n` +
    `\n🎞 Tayada: ${s.quality === "max" ? "tan ugu sarreysa ee Telegram aqbalo" : "caadi (720p)"}\n` +
    `\n⏱ Muuqaallada dhaadheer: ${s.longVideos ? "dherer kasta" : "ilaa 15 daqiiqo oo keliya"}\n` +
    `\n🔑 Yaa ku xiri kara akoonkiisa (stories iyo boostooyinka gaarka ah): ${s.cookiesBy === "all" ? "xubin kasta" : "maamulayaasha oo keliya"}\n` +
    `\n🌐 Luqadda jawaabta: ${s.language ? langName(s.language) : "tan xubin kasta"}\n` +
    "\nMaamulayaasha kooxda oo keliya ayaa beddeli kara dejinta.",
  settingsDeleteButton: (on) => `🗑 Tirtir link-yada: ${on ? "haa" : "maya"}`,
  settingsCaptionButton: (style) => `✍️ Qoraal: ${{ full: "buuxa", short: "gaaban", none: "midna" }[style] ?? style}`,
  settingsQualityButton: (mode) => `🎞 Tayada: ${mode === "max" ? "ugu sarreysa" : "720p"}`,
  settingsLongButton: (on) => `⏱ Muuqaallo dhaadheer: ${on ? "haa" : "ilaa 15 daqiiqo"}`,
  settingsDoneButton: "✅ Dhammee",
  settingsAdminsOnly: "Maamulayaasha kooxda oo keliya ayaa beddeli kara dejinta.",
  settingsGroupsOnly: "Dejintu waxay u taal kooxaha: igu dar koox oo halkaas ku dir /settings.",
  settingsFailed: "Ma kaydin karin dejinta, fadlan mar kale isku day.",
  settingsCookiesButton: (by) => `🔑 Ku xiridda akoonnada: ${by === "all" ? "qof kasta" : "maamulayaasha"}`,
  accountsIntro:
    "🔑 Akoonnada ku xiran\n\nBot-ku wuxuu soo dejin karaa waxa ay arkaan oo keliya dadka akoonkooda galay (stories-ka Instagram, boostooyinka gaarka ah) — isagoo adeegsanaya akoonkaaga. Gelitaanku wuxuu ka shaqeeyaa meesha aad ku xirtay: midka sheekada gaarka ah wuxuu u adeegaa soo dejintaada, oo ay ku jiraan link-yadaada kooxaha aan lahayn akoon u gaar ah; midka koox lagu xiray wuxuu u adeegaa dhammaan xubnaheeda.",
  accountsHowTo:
    "Sida loo xiro:\n1. Tan ugu fudud: kordhiyaha Videoner ee kombiyuutarka — gal websaydhka madasha, fur daaqadda Videoner, riix “🔑 Ku xir akoonkaaga … bot-ka” oo ii soo dir koodka. Koox ahaan, ku dir /connect KOOD kooxdaas gudaheeda.\n2. Ama ii soo dir fayl cookies.txt ah (cookies laga soo saaray biraawsarka), ama qoraalkiisa ku dheji fariin ahaan.\n3. Taleefan Android ah — adigoo isticmaalaya Firefox iyo add-on-ka Cookie-Editor: https://videoner.download/so/blog/android-firefox",
  accountsWarning:
    "⚠️ Madallada ma jecla soo dejinta otomaatigga ah, waxayna xaddidi karaan ama xannibi karaan akoonka. Waxaa fiican inaad ku xirto akoon labaad, ha ahaan kaaga ugu muhiimsan. Cookies-ka waxaa lagu kaydiyaa si sir ah, waxaa loo isticmaalaa oo keliya soo dejinta, waxaana lagu tirtiraa badhamada hoose.",
  accountsNone: "Weli waxba lama xirin.",
  accountsGroupTitle: "🔑 Akoonnada ku xiran kooxdan",
  accountsGroupHowTo:
    "Si aad mid ugu xirto kooxda oo dhan: ka hel kood badhanka “🔑 Ku xir akoonkaaga … bot-ka” ee kordhiyaha Videoner oo halkan ku dir /connect KOOD. Haddii aad akoon ku xirtay sheekadaada gaarka ah oo keliya, bot-ku halkan wuxuu u isticmaalaa link-yadaada. Xiriiradaada: /accounts sheeko gaar ah oo aad la leedahay @VideonerBot.",
  accountsLine: (platform, where, active) => `• ${platform} — ${where}${active ? "" : " (⚠️ gelitaanku ma shaqeynayo)"}`,
  accountsGroupLine: (platform, owner, active) => `• ${platform} — ${owner}${active ? "" : " (⚠️ gelitaanku ma shaqeynayo)"}`,
  accountsWhereHere: "sheekada gaarka ah",
  accountsWhereGroup: (title) => `kooxda “${title}”`,
  accountsDeleteButton: (platform, where) => `🗑 ${platform} · ${where}`,
  accountsDeleteAllButton: "🗑 Tirtir dhammaan xiriirradayda",
  accountsDeleted: "Waa la tirtiray.",
  accountsDeletedAll: (n) => `Xiriirada la tirtiray: ${n}.`,
  accountsNotAllowed: "Qofka ku xiray ama maamulaha kooxda oo keliya ayaa tirtiri kara.",
  connectUsage:
    "Soo dir /connect KOOD. Koodka waxaa ku siinaya badhanka “🔑 Ku xir akoonkaaga … bot-ka” ee kordhiyaha Videoner ee kombiyuutarka. Xiriiradaada: /accounts.",
  connectOnlyAdmins: "Maamulayaasha oo keliya ayaa akoonno ku xiri kara kooxdan (eeg /settings).",
  connectDone: (platform, where) =>
    `✅ ${platform} waa lagu xiray ${where}. Bot-ku hadda wuxuu sidoo kale soo dejiyaa waxa ay arkaan oo keliya dadka akoonkooda galay. Eeg ama tirtir: /accounts.\n\n⚠️ Madashu waxay xaddidi kartaa akoonka soo dejinta otomaatigga ah awgeed — waxaa fiican inaad isticmaasho akoon labaad.`,
  connectWhereGroup: "kooxdan",
  connectWhereHere: "soo dejintaada ee sheekada gaarka ah iyo habka inline",
  connectCodeNotFound: "Koodka lama helin ama wuu dhacay (koodadku waxay shaqeeyaan 10 daqiiqo). Ka hel mid cusub kordhiyaha Videoner.",
  connectRejectedNoSession: "Cookies-kan kuma jiro gelitaan akoon. Gal websaydhka madasha oo mar kale soo saar cookies-ka.",
  connectRejectedUnknown: "Lama helin cookies madallo la taageero: Instagram, Facebook, YouTube, X, VK, TikTok.",
  connectUnavailable: "Ku xiridda akoonnada weli lama heli karo.",
  connectFailed: "Ma ku xiri karin, fadlan mar kale isku day.",
  connectFileTooBig: "Faylku aad buu u weyn yahay — soo saar cookies-ka websaydhka loo baahan yahay oo keliya.",
  connectNotAnonymous: "Akoonka ku xir adigoo naftaada ah, ha ahaan si qarsoodi ah oo magaca kooxda ah: haddii kale xiriirada maamulayaasha way isku dhex qasmayaan. Koodka waan burburiyay — hel mid cusub.",
  connectCodeInGroup:
    "Koodka xiriirka ee lagu dhejiyo sheekada kooxda dad kale ayaa arki kara — waan burburiyay, fariintana waan tirtiray. Hel mid cusub oo ku dir /connect KOOD: fariinta amarkaas isla markiiba waan tirtiraa.",
  groupWelcome:
    "👋 Salaan! Sheekadan ku dhaji link-yada muuqaallada TikTok, Instagram, YouTube, VK iyo madallo kale — waxaan kugu jawaabi doonaa muuqaalka laftiisa.\n\n" +
    "Waxaan si iskay ah u soo dejiyaa muuqaallada ilaa 15 daqiiqo ah, amarro looma baahna, haddii kalena waan aamusaa.\n\n⚙️ Maamulayaasha kooxda waxay igu habayn karaan /settings: tirtirka fariimaha link-ga, qaabka qoraalka, tayada, muuqaallada dhaadheer iyo luqadda.\n\n⚡ Ku dar -audio link-ga kadib si aad u hesho codka, ama -hd si aad u hesho tayada ugu fiican.\n\n📣 Wararka mashruuca: @videonerdownload",
  errorTooLong: "muuqaalku aad buu u dheer yahay — weli ma soo dejin karno muuqaallo intaas le'eg.",
  errorUnknown: "ma soo dejin karin muuqaalkan. Isku day mar kale wax yar kadib ama soo dir link kale.",
  inlineHintButton: "U dir link bot-ka",
  inlineResultTitle: "⬇️ Soo deji muuqaalka",
  inlineResultDescription: "Muuqaalka waxaa si toos ah loogu dhejin doonaa sheekadan",
  inlinePlaceholder: "⏬ Waa la soo dejinayaa, tani waxay qaadan kartaa dhowr daqiiqo...",
  inlineOpenBot: "Fur bot-ka",
  inlineOnlySingleVideo:
    "Habkani wuxuu diraa hal muuqaal. Boostooyinka faylal badan leh ama sawirrada, link-ga u dir bot-ka sheeko gaar ah.",
  inlineSubscribeRequired: (channel: string) =>
    `Si aad wax u soo dejiso, ku biir ${channel} oo mar kale isku day.`,
  inlineRateLimited: "Codsiyo aad u badan oo isku xiga. Sug daqiiqad oo mar kale isku day.",
  queueRest: (count) => `\n\n📋 Link-yada weli safka ku jira: ${count}. Midba mar ayaan kuu tusi doonaa kan kadib.`,
  queuedOne: (position) =>
    `📋 Link-ga safka ayaa la geliyay, #${position}. Aan marka hore dhammeyno kan hadda socda — kadib waxaan kuu tusi doonaa doorashada tayada.`,
  queuedMany: (added, waiting) =>
    `📋 Link-yada safka lagu daray: ${added}. Wadarta sugaysa: ${waiting}. Midba mar ayaan kuu tusi doonaa kan hadda socda kadib.`,
  queueDuplicates: (count) =>
    count === 1
      ? "Link-gan horey ayuu safka ugu jiray — laba jeer laguma darayo."
      : `Link-yada horey safka ugu jiray laba jeer laguma darayo (ku celcelin: ${count}).`,
  queueFull: (limit, rejected) =>
    `Safku wuxuu qaadi karaa ugu badnaan ${limit} link — kuwa dheeraadka ah lama darin (${rejected}). Soo dir marka safku dhaqaaqo.`,
  skipButton: "✖️ Ha soo dejin",
  skipped: "⏭ Link-gan waa laga gudbay.",
  chooseTimedOut: "⌛ Tayo lama dooran 30 daqiiqo gudahood — link-gan waa laga gudbayaa.",
  queueLostOnRestart: (count) =>
    `⚠️ Bot-ka ayaa dib loo bilaabayaa si loo cusbooneysiiyo — safka waa la tirtiray (link-yo: ${count}). Fadlan mar kale soo dir daqiiqad kadib.`,
  subtitlesButton: "📝 Qoraalka hoose",
  subtitlesBack: "⬅️ Ku noqo tayada",
  subtitlesAuto: "otomaatig",
  subtitlesChoose: "Dooro luqadda qoraalka hoose",
  subtitlesPreparing: "📝 Qoraalka hoose waa la diyaarinayaa...",
  subtitlesFailed: "Ma soo dejin karin qoraalka hoose ee luqaddan. Isku day luqad kale.",
  subtitlesBusy: "YouTube hadda ma bixinayo qoraalka hoose — isku day mar kale dhowr daqiiqo kadib.",
  playlistFound: (title, count) =>
    `📃 Liiska muuqaallada${title ? ` “${title.slice(0, 150)}”` : ""}: ${count} muuqaal.\nMidba mar ayaan soo dejin doonaa. Qaabkee?`,
  playlistStdButton: "🎬 720p",
  playlistHdButton: "🎬 Tayada ugu fiican",
  playlistAudioButton: "🎵 Cod oo keliya (mp3)",
  playlistNoButton: "✖️ Maya, mahadsanid",
  playlistQueued: (count) =>
    `📃 Muuqaallada liiska ee safka la geliyay: ${count}. Midba mar ayaan kuu soo diri doonaa. Ku jooji badhanka hoose ama /stop.`,
  playlistFailed: "Ma furi karin liiska muuqaallada — waxaa laga yaabaa inuu gaar yahay. Soo dir link hal muuqaal ah.",
  stopButton: "⏹ Jooji",
  stopped: (dropped) => `⏹ Waa la joojiyay.${dropped ? ` Link-yada safka laga saaray: ${dropped}.` : ""}`,
  nothingToStop: "Hadda waxba lama soo dejinayo.",
  languageChoose: "🌐 Dooro luqadda bot-ka. “Otomaatig” wuxuu raacaa Telegram-kaaga.",
  languageChooseGroup: "🌐 Luqadda jawaabta bot-ka ee kooxdan. “Otomaatig” — luqadda Telegram ee xubin kasta.",
  languageAuto: "Otomaatig — sida Telegram",
  languageAutoGroup: "Otomaatig — tan xubin kasta",
  languageSaved: (name) => `✅ Luqadda bot-ka: ${name}. Ku beddel /language.`,
  languageSavedAuto: "✅ Bot-ku wuxuu raacaa luqadda Telegram-kaaga. Ku beddel /language.",
  settingsLanguageButton: (name) => `🌐 Luqadda: ${name ?? "otomaatig"}`,
  settingsBack: "⬅️ Ku noqo dejinta",
};

const az: Messages = {
  start: "Salam! Mənə YouTube, TikTok, Instagram, Facebook, Twitter/X, Vimeo, VK, Rutube, OK.ru, Pinterest və ya Threads-dən videonun linkini göndərin — onu yükləməyinizə kömək edəcəyəm.\n\n✨ Keyfiyyət məhdudiyyəti yoxdur: platforma nə verirsə, 4K-ya qədər alırsınız — təki fayl 2 GB-a sığsın, bu, Telegram-ın botlar üçün qoyduğu limitdir. Burada ödənişli funksiyalar yoxdur.\n\nTamamilə pulsuzdur: abunə haqqı yoxdur, reklam yoxdur, tətbiqdaxili alış yoxdur.\n\n🧩 Kompüterdə yükləyirsiniz? Brauzer genişlənməsini quraşdırın — «Yüklə» düyməsi birbaşa video səhifəsində görünəcək: videoner.download/az/extension\n\n👥 Məni qrupa əlavə edin — orada paylaşılan linklərə görə videoları özüm göndərəcəyəm.\n\n⚡ Keyfiyyət seçimini keçin: yalnız səs (mp3) üçün linkdən sonra -audio, ən yaxşı keyfiyyət üçün isə -hd əlavə edin.\n\n📣 Layihə xəbərləri: @videonerdownload\n\n🌐 Botun dili: /language",
  notLink: "Bu, linkə oxşamır. Mənə videonun linkini göndərin.",
  inviteGreeting: "Salam! Mən Videoner-əm — YouTube, TikTok, Instagram və digər platformalardan videoları pulsuz yükləyirəm. Sizinlə paylaşılan videonu hazırlayıram 👇",
  inviteNotFound: "Bu dəvət linkinə görə video tapa bilmədim. Mənə videonun linkini göndərin, onu yükləyəcəyəm.",
  inviteUnavailable: "Bu linkdəki videonu aça bilmədim — xidmət hazırda cavab vermir. Bir dəqiqədən sonra eyni linki yenidən açın.",
  fetchingInfo: "🔍 Video haqqında məlumat alınır...",
  audioOnlyButton: "🎵 Yalnız audio (mp3)",
  photoButton: "📷 Fotoları yüklə",
  slideshowButton: "🎞 Slayd-şou (video)",
  galleryButton: "📷+🎞 Fotolar və slayd-şou",
  chooseQuality: (title, duration) => `«${title}»${duration ? `\n⏱ ${duration}` : ""}\n\nKeyfiyyəti seçin:`,
  sessionExpired: "Sessiyanın vaxtı bitib — linki yenidən göndərin",
  downloading: "⏬ Yüklənir, bu bir-iki dəqiqə çəkə bilər...",
  downloadFailed: "yükləmək alınmadı",
  downloadProgress: (percent, eta, done) =>
    `⏬ Yüklənir: ${percent}%${eta ? ` · qalıb ${eta}` : ""}${done ? `\n${done}` : ""}`,
  downloadFinishing: "⚙️ Az qalıb — fayl yığılır...",
  converting: (percent) => `⚙️ Çevrilir: ${percent}%`,
  etaUnderMinute: "bir dəqiqədən az",
  etaMinutes: (minutes) => `~${minutes} dəq`,
  etaHours: (hours, minutes) => `~${hours} saat${minutes ? ` ${minutes} dəq` : ""}`,
  downloadTimeout: "yükləmə çox uzun çəkir — video, deyəsən, çox ağırdır. Daha aşağı keyfiyyət seçin.",
  downloadInterrupted: "⚠️ Bot yeniləmə üçün yenidən başladılır — yükləməniz kəsildi. Bir dəqiqədən sonra linki yenidən göndərin.",
  fileTooBig: (mb, url) =>
    `Fayl böyük alındı (${mb} MB) — Telegram botun onu göndərməsinə icazə vermir.\nBuradan yükləyin: ${url}`,
  sendingFile: "📤 Fayl göndərilir...",
  sendingAlbum: (count) => `📤 Bu paylaşımda bir neçə fayl var (${count}) — onları albom kimi göndərirəm...`,
  failedPrefix: "❌ Alınmadı: ",
  fileCaption: (title, sourceUrl, shareUrl, description) =>
    composeCaption(
      title,
      description,
      `Mənbə: ${sourceUrl}\n` +
        "Videoya olan bütün hüquqlar müəllifinə məxsusdur.\n" +
        "@VideonerBot ilə pulsuz yüklənib",
      `📣 Layihə xəbərləri: ${NEWS_CHANNEL}`,
      shareUrl && `🔗 Paylaşın: ${shareUrl}`,
    ),
  subscribeRequired: (channel) =>
    `Yükləmək üçün ${channel} kanalımıza abunə olun — bu, yeganə şərtdir, xidmət pulsuz qalır.\n\n` +
    "Abunə olun və «Abunə oldum» düyməsini basın.",
  openChannelButton: "📣 Kanalı açın",
  checkSubscriptionButton: "Abunə oldum",
  subscribeThanks: "Təşəkkür edirik! İndi mənə videonun linkini göndərin.",
  subscribeThanksResuming: "Təşəkkür edirik! Linkinizi indi götürürəm.",
  subscribeStillMissing: "Abunəliyi hələ görmürəm. Abunə olun və yenidən basın.",
  channelNotice: (channel) => `\n\nBu paylaşımın linki ${channel} kanalında görünəcək — anonim, adınız olmadan.`,
  channelPost: (title, url) =>
    (title ? `🎬 ${title.slice(0, 200)}\n\n` : "") +
    `${url}\n\n` +
    "Bu və istənilən başqa videonu pulsuz yükləyin: @VideonerBot",
  errorStoryNeedsId:
    "konkret storinin linkini göndərin: onu Instagram tətbiqində açın və «Paylaş» → «Linki kopyala» düyməsini basın.",
  errorInstagramStory:
    "Instagram storiləri yalnız hesaba daxil olmuş istifadəçilərə görünür.",
  errorLoginRequired:
    "Bu paylaşım hesaba daxil olmadan əlçatan deyil: platforma onu yalnız " +
    "daxil olmuş istifadəçilərə göstərir. Bu, qapalı paylaşımlarda, yaş məhdudiyyətli məzmunda və " +
    "məhdud auditoriya ilə paylaşılan paylaşımlarda olur.\n\n" +
    "Açıq paylaşımlar problemsiz yüklənir — başqa link yoxlayın.",
  errorUnsupportedPlatform:
    "Bu linki tanıya bilmədim — onun YouTube, TikTok, Instagram, Facebook, Twitter/X, Vimeo, VK, Rutube, OK.ru, Pinterest və ya Threads-dən birbaşa video linki olduğuna əmin olun.",
  errorFileTooLarge: "fayl 2 GB-dan böyükdür — Telegram botlara daha böyük faylları göndərməyə icazə vermir. Onu saytda və ya brauzer genişlənməsi ilə yükləyin — düymələr aşağıdadır. Və ya linki yenidən göndərib daha aşağı keyfiyyət seçin.",
  siteButton: "🌐 Saytda yüklə",
  qualitiesHiddenBySize: (limit) =>
    `\n\n⚖️ ${limit} həcmindən ağır keyfiyyətlər gizlədilib: Telegram botlara daha böyük faylları göndərməyə icazə vermir. Onları saytda və ya brauzer genişlənməsi ilə yükləyə bilərsiniz — düymələr aşağıdadır.`,
  videoTooBigForTelegram: (smallest) =>
    `\n\n⚖️ Bu video ən aşağı keyfiyyətdə belə Telegram üçün çox ağırdır (~${smallest}): Telegram botlara 2 GB-dan böyük faylları göndərməyə icazə vermir. Burada yalnız audionu ala bilərsiniz; videonu isə — saytda və ya brauzer genişlənməsi ilə (düymələr aşağıdadır).`,
  errorFormatUnavailable: "Bu video üçün belə keyfiyyət yoxdur. Linki yenidən göndərin — aktual siyahını göstərəcəyəm.",
  errorNoVideoContent: "Bu linkdə yükləmək üçün video yoxdur — deyəsən, paylaşımda yalnız foto var.",
  errorRegionBlocked:
    "Bu video müəllifin ölkəsindən kənarda bloklanıb — platforma onu " +
    "serverimizə vermir. Bunun yan yolu yoxdur: məhdudiyyət onların tərəfindədir." +
    "\n\nDigər linklər həmişəki kimi yüklənir.",
  errorRateLimited: "Ardıcıl çox link göndərildi — bir az gözləyin və yenidən göndərin.",
  errorYoutubeDailyLimit: (gb) => `son 24 saatda YouTube-dan ${gb} GB-dan çox yükləmisiniz — bu, botun bir nəfər üçün gündəlik limitidir. Limit son 24 saatı sayır, ona görə də yeni YouTube videolarını bir az sonra yükləyə biləcəksiniz. Digər platformalar həmişəki kimi işləyir.`,
  playlistStoppedByLimit: (dropped) => `⏹ Pleylist dayandırıldı: gündəlik YouTube limitinə çatıldı. Yüklənməmiş videolar: ${dropped}. Pleylistin linkini sonra yenidən göndərin.`,
  errorPlatformRefused:
    "platforma bu videonu serverimizə vermədi. Bu, qapalı " +
    "və ya yaş məhdudiyyətli paylaşımlarda olur, bəzən isə platforma girişi sadəcə " +
    "müvəqqəti məhdudlaşdırır. Bir neçə dəqiqədən sonra yenidən cəhd edin.",
  errorThreadsNoMedia:
    "bu Threads paylaşımında video və ya foto görünmür. Ya bu, yalnız mətndən ibarət paylaşımdır, ya da " +
    "Threads onun mediasını yalnız hesaba daxil olmuş istifadəçilərə göstərir — belə paylaşımları hesaba daxil olmadan yükləmək mümkün deyil.",
  extensionHint:
    "\n\n💻 Onu kompüterdə Videoner brauzer genişlənməsi ilə yükləyə bilərsiniz: " +
    "o, platformadakı öz hesabınızla yükləyir, parol və ya cookies brauzerinizdən kənara çıxmır.",
  privateConnectHint: (platform, withExtension) =>
    `\n\n🔑 Belə paylaşımları yükləmək üçün ${platform} hesabınızı bota qoşun — bir dəfə. Bundan sonra bot sizin gördüyünüz hər şeyi yükləyəcək: qapalı paylaşımları, reels və storiləri, telefondan da. Bunu necə etmək lazım olduğunu aşağıdakı düymə göstərir.${withExtension ? "\n\n💻 Və ya onu kompüterdə Videoner brauzer genişlənməsi ilə yükləyin." : ""}`,
  privateReconnectHint: (platform, withExtension) =>
    `\n\n⚠️ Qoşulmuş ${platform} hesabınız bu paylaşımı aça bilmədi. Ola bilər ki, giriş artıq işləmir — hesabı yenidən qoşun. Və ya bu hesabın paylaşıma girişi yoxdur.${withExtension ? "\n\n💻 Onu kompüterdə Videoner brauzer genişlənməsi ilə də yükləyə bilərsiniz." : ""}`,
  connectAccountButton: "🔑 Hesabı qoş",
  reconnectAccountButton: "🔑 Yenidən qoş",
  extensionButton: "🧩 Genişlənmə ilə yüklə",
  extensionCommand:
    "🧩 Brauzeriniz üçün Videoner: «Yüklə» düyməsi birbaşa video səhifəsində — YouTube, Instagram, TikTok, VK, hesabınızdakı qapalı videolar və GetCourse dərsləri.\n\nKompüterdə Chrome, Edge, Opera, Yandex Browser və Firefox üçün.",
  extensionPageButton: "🧩 Genişlənməni quraşdır",
  addToGroupButton: "👥 Qrupa əlavə et",
  newsButton: "📣 Layihə xəbərləri",
  fileCaptionShort: (title, sourceUrl) =>
    withOptionalLines((title ? `🎬 ${title.slice(0, 200)}\n\n` : "") + sourceUrl, `📣 Layihə xəbərləri: ${NEWS_CHANNEL}`, undefined),
  sentBy: (name) => `👤 ${name}`,
  groupSettings: (s, canDelete) =>
    "⚙️ Bu qrupda botun parametrləri\n\n" +
    `🗑 Linkli mesajı silmək: ${s.deleteLinks ? "bəli" : "xeyr"}\n` +
    "Video göndərildikdən sonra yalnız linkdən ibarət mesaj silinir — çatda yalnız video və onu paylaşanın adı qalır.\n" +
    (s.deleteLinks && !canDelete
      ? "⚠️ Hazırda mesajları silə bilmirəm: məni «Mesajları silmək» hüququ ilə admin edin.\n"
      : "") +
    `\n✍️ Videonun altındakı mətn: ${{ full: "tam", short: "ad və mənbə", none: "mətnsiz" }[s.caption] ?? s.caption}\n` +
    `\n🎞 Keyfiyyət: ${s.quality === "max" ? "Telegram-ın qəbul etdiyi ən yüksək" : "standart (720p)"}\n` +
    `\n⏱ Uzun videolar: ${s.longVideos ? "istənilən uzunluqda" : "yalnız 15 dəqiqəyə qədər"}\n` +
    `\n🔑 Kim öz hesablarını qoşa bilər (storilər və qapalı paylaşımlar üçün): ${s.cookiesBy === "all" ? "istənilən üzv" : "yalnız adminlər"}\n` +
    `\n🌐 Cavab dili: ${s.language ? langName(s.language) : "hər üzvün öz dili"}\n` +
    "\nParametrləri yalnız qrup adminləri dəyişə bilər.",
  settingsDeleteButton: (on) => `🗑 Linkləri silmək: ${on ? "bəli" : "xeyr"}`,
  settingsCaptionButton: (style) => `✍️ Mətn: ${{ full: "tam", short: "qısa", none: "yoxdur" }[style] ?? style}`,
  settingsQualityButton: (mode) => `🎞 Keyfiyyət: ${mode === "max" ? "ən yüksək" : "720p"}`,
  settingsLongButton: (on) => `⏱ Uzun videolar: ${on ? "bəli" : "15 dəq-yə qədər"}`,
  settingsDoneButton: "✅ Hazırdır",
  settingsAdminsOnly: "Parametrləri yalnız qrup adminləri dəyişə bilər.",
  settingsGroupsOnly: "Parametrlər qruplar üçündür: məni qrupa əlavə edin və orada /settings göndərin.",
  settingsFailed: "Parametrləri saxlamaq alınmadı, yenidən cəhd edin.",
  settingsCookiesButton: (by) => `🔑 Hesabları qoşmaq: ${by === "all" ? "hamı" : "adminlər"}`,
  accountsIntro:
    "🔑 Qoşulmuş hesablar\n\nBot yalnız hesaba daxil olmuş istifadəçilərin gördüyünü (Instagram storiləri, qapalı paylaşımlar) sizin hesabınızla yükləyə bilər. Giriş harada qoşulubsa, orada işləyir: şəxsi çatda qoşulan sizin yükləmələrinizə, o cümlədən öz hesabı olmayan qruplardakı öz linklərinizə xidmət edir; qrupa qoşulan isə onun bütün üzvlərinə xidmət edir.",
  accountsHowTo:
    "Necə qoşmaq olar:\n1. Ən asanı: kompüterdə Videoner genişlənməsi — platformanın saytında hesabınıza daxil olun, Videoner pəncərəsini açın, «🔑 … hesabınızı bota qoşun» düyməsini basın və kodu mənə göndərin. Qrup üçün həmin qrupda /connect KOD göndərin.\n2. Və ya mənə cookies.txt faylını (brauzerdən ixrac edilmiş cookies) göndərin, yaxud onun mətnini mesaj kimi yapışdırın.\n3. Android telefondan — Firefox və Cookie-Editor əlavəsi ilə: https://videoner.download/az/blog/android-firefox",
  accountsWarning:
    "⚠️ Platformalar avtomatik yükləmələri sevmir və hesabı məhdudlaşdıra və ya bloklaya bilər. Əsas hesabı deyil, ikinci dərəcəli hesabı qoşmaq daha yaxşıdır. Cookies şifrələnmiş şəkildə saxlanılır, yalnız yükləmələr üçün istifadə olunur və aşağıdakı düymələrlə silinir.",
  accountsNone: "Hələ heç nə qoşulmayıb.",
  accountsGroupTitle: "🔑 Bu qrupa qoşulmuş hesablar",
  accountsGroupHowTo:
    "Bütün qrup üçün qoşmaq: Videoner genişlənməsindəki «🔑 … hesabınızı bota qoşun» düyməsi ilə kod alın və burada /connect KOD göndərin. Əgər hesabı yalnız şəxsi çatınızda qoşmusunuzsa, bot onu burada da öz linkləriniz üçün istifadə edir. Qoşulmalarınız: @VideonerBot ilə şəxsi çatda /accounts.",
  accountsLine: (platform, where, active) => `• ${platform} — ${where}${active ? "" : " (⚠️ giriş işləmir)"}`,
  accountsGroupLine: (platform, owner, active) => `• ${platform} — ${owner}${active ? "" : " (⚠️ giriş işləmir)"}`,
  accountsWhereHere: "şəxsi çat",
  accountsWhereGroup: (title) => `«${title}» qrupu`,
  accountsDeleteButton: (platform, where) => `🗑 ${platform} · ${where}`,
  accountsDeleteAllButton: "🗑 Bütün qoşulmalarımı sil",
  accountsDeleted: "Silindi.",
  accountsDeletedAll: (n) => `Silinən qoşulmalar: ${n}.`,
  accountsNotAllowed: "Onu yalnız qoşan şəxs və ya qrup admini silə bilər.",
  connectUsage:
    "/connect KOD göndərin. Kodu kompüterdəki Videoner genişlənməsində «🔑 … hesabınızı bota qoşun» düyməsi verir. Qoşulmalarınız: /accounts.",
  connectOnlyAdmins: "Bu qrupa hesabları yalnız adminlər qoşa bilər (bax: /settings).",
  connectDone: (platform, where) =>
    `✅ ${platform} ${where} qoşuldu. Bot indi yalnız hesaba daxil olmuş istifadəçilərin gördüyünü də yükləyir. Baxmaq və ya silmək: /accounts.\n\n⚠️ Platforma avtomatik yükləmələrə görə hesabı məhdudlaşdıra bilər — ikinci dərəcəli hesabdan istifadə etmək daha yaxşıdır.`,
  connectWhereGroup: "bu qrupa",
  connectWhereHere: "şəxsi çatdakı və inline rejimdəki yükləmələriniz üçün",
  connectCodeNotFound: "Kod tapılmadı və ya vaxtı bitib (kodlar 10 dəqiqə etibarlıdır). Videoner genişlənməsində yenisini alın.",
  connectRejectedNoSession: "Bu cookies-də giriş yoxdur. Platformanın saytında hesabınıza daxil olun və cookies-i yenidən ixrac edin.",
  connectRejectedUnknown: "Dəstəklənən platformaların cookies-i tapılmadı: Instagram, Facebook, YouTube, X, VK, TikTok.",
  connectUnavailable: "Hesabların qoşulması hələ mümkün deyil.",
  connectFailed: "Qoşmaq alınmadı, yenidən cəhd edin.",
  connectFileTooBig: "Fayl çox böyükdür — yalnız lazım olan saytın cookies-ini ixrac edin.",
  connectNotAnonymous: "Hesabı qrup adından anonim deyil, öz adınızdan qoşun: əks halda adminlərin qoşulmaları qarışır. Kodu ləğv etdim — yenisini alın.",
  connectCodeInGroup:
    "Qrup çatında yazılmış qoşulma kodunu başqaları görə bilər — onu ləğv etdim və mesajı sildim. Yenisini alın və /connect KOD ilə göndərin: bu əmrli mesajı dərhal silirəm.",
  groupWelcome:
    "👋 Salam! Bu çatda TikTok, Instagram, YouTube, VK və digər platformalardan videoların linklərini paylaşın — cavab olaraq videonun özünü göndərəcəyəm.\n\n" +
    "15 dəqiqəyə qədər olan videoları özüm, əmrsiz yükləyirəm, qalan hallarda isə susuram.\n\n⚙️ Qrup adminləri məni /settings ilə tənzimləyə bilər: linkli mesajların silinməsi, mətn üslubu, keyfiyyət, uzun videolar və dil.\n\n⚡ Səsi almaq üçün linkdən sonra -audio, ən yaxşı keyfiyyət üçün isə -hd əlavə edin.\n\n📣 Layihə xəbərləri: @videonerdownload",
  errorTooLong: "video çox uzundur — belə uzun videoları hələ yükləyə bilmirik.",
  errorUnknown: "bu videonu yükləmək alınmadı. Bir az sonra yenidən cəhd edin və ya başqa link göndərin.",
  inlineHintButton: "Linki bota göndərin",
  inlineResultTitle: "⬇️ Videonu yüklə",
  inlineResultDescription: "Video birbaşa bu çatda dərc olunacaq",
  inlinePlaceholder: "⏬ Yüklənir, bu bir-iki dəqiqə çəkə bilər...",
  inlineOpenBot: "Botu açın",
  inlineOnlySingleVideo:
    "Bu rejim yalnız bir video göndərir. Bir neçə fayllı paylaşımlar və ya fotolar üçün linki bota şəxsi çatda göndərin.",
  inlineSubscribeRequired: (channel: string) =>
    `Yükləmək üçün ${channel} kanalına abunə olun və yenidən cəhd edin.`,
  inlineRateLimited: "Ardıcıl çox sorğu göndərildi. Bir dəqiqə gözləyin və yenidən cəhd edin.",
  queueRest: (count) => `\n\n📋 Növbədə hələ linklər var: ${count}. Bundan sonra onları bir-bir göstərəcəyəm.`,
  queuedOne: (position) =>
    `📋 Link növbəyə əlavə olundu, №${position}. Əvvəlcə cari linki bitirək — sonra onun üçün keyfiyyət seçimini göstərəcəyəm.`,
  queuedMany: (added, waiting) =>
    `📋 Növbəyə əlavə olunan linklər: ${added}. Cəmi gözləyir: ${waiting}. Cari linkdən sonra onları bir-bir göstərəcəyəm.`,
  queueDuplicates: (count) =>
    count === 1
      ? "Bu link artıq növbədədir — onu ikinci dəfə əlavə etmirəm."
      : `Artıq növbədə olan linklər ikinci dəfə əlavə edilmir (təkrarlar: ${count}).`,
  queueFull: (limit, rejected) =>
    `Növbədə ən çoxu ${limit} link ola bilər — artıq olanlar əlavə edilmədi (${rejected}). Növbə irəlilədikdən sonra onları göndərin.`,
  skipButton: "✖️ Yükləmə",
  skipped: "⏭ Bu linki keçdim.",
  chooseTimedOut: "⌛ 30 dəqiqə ərzində keyfiyyət seçilmədi — bu linki keçirəm.",
  queueLostOnRestart: (count) =>
    `⚠️ Bot yeniləmə üçün yenidən başladılır — növbə sıfırlandı (linklər: ${count}). Bir dəqiqədən sonra onları yenidən göndərin.`,
  subtitlesButton: "📝 Subtitrlər",
  subtitlesBack: "⬅️ Keyfiyyətə qayıt",
  subtitlesAuto: "avto",
  subtitlesChoose: "Subtitrlərin dilini seçin",
  subtitlesPreparing: "📝 Subtitrlər hazırlanır...",
  subtitlesFailed: "Bu dildə subtitrləri yükləmək alınmadı. Başqa dil seçin.",
  subtitlesBusy: "YouTube hazırda subtitrləri vermir — bir neçə dəqiqədən sonra yenidən cəhd edin.",
  playlistFound: (title, count) =>
    `📃 Pleylist${title ? ` «${title.slice(0, 150)}»` : ""}: ${count} video.\nOnları bir-bir yükləyəcəyəm. Hansı formatda?`,
  playlistStdButton: "🎬 720p",
  playlistHdButton: "🎬 Ən yaxşı keyfiyyət",
  playlistAudioButton: "🎵 Yalnız audio (mp3)",
  playlistNoButton: "✖️ Xeyr, təşəkkürlər",
  playlistQueued: (count) =>
    `📃 Pleylistdən növbəyə əlavə olunan videolar: ${count}. Onları bir-bir göndərəcəyəm. Aşağıdakı düymə və ya /stop ilə dayandırın.`,
  playlistFailed: "Pleylisti açmaq alınmadı — ola bilər ki, qapalıdır. Ayrıca bir videonun linkini göndərin.",
  stopButton: "⏹ Dayandır",
  stopped: (dropped) => `⏹ Dayandırıldı.${dropped ? ` Növbədən silinən linklər: ${dropped}.` : ""}`,
  nothingToStop: "Hazırda heç nə yüklənmir.",
  languageChoose: "🌐 Botun dilini seçin. «Avto» — Telegram dilinizə uyğunlaşır.",
  languageChooseGroup: "🌐 Bu qrupda botun cavab dili. «Avto» — hər üzvün Telegram dili.",
  languageAuto: "Avto — Telegram-dakı kimi",
  languageAutoGroup: "Avto — hər üzvün öz dili",
  languageSaved: (name) => `✅ Botun dili: ${name}. /language ilə dəyişin.`,
  languageSavedAuto: "✅ Bot Telegram dilinizə uyğunlaşır. /language ilə dəyişin.",
  settingsLanguageButton: (name) => `🌐 Dil: ${name ?? "avto"}`,
  settingsBack: "⬅️ Parametrlərə qayıt",
};

const ky: Messages = {
  start: "Салам! Мага YouTube, TikTok, Instagram, Facebook, Twitter/X, Vimeo, VK, Rutube, OK.ru, Pinterest же Threads видеосунун шилтемесин жөнөтүңүз — аны жүктөп алууга жардам берем.\n\n✨ Сапат эч нерсе менен чектелбейт: платформада болгон сапаттын баарын, 4K чейин берем — файл 2 ГБдан ашпаса эле болду, бул Telegram боттор үчүн койгон чек. Бул жерде акы төлөнүүчү функциялар такыр жок.\n\nТолугу менен акысыз: жазылуусуз, жарнамасыз, ички сатып алууларсыз.\n\n🧩 Компьютерден жүктөп аласызбы? Браузер кеңейтүүсүн орнотуңуз — «Жүктөп алуу» баскычы түз эле видео барагында пайда болот: videoner.download/ky/extension\n\n👥 Мени топко кошуңуз — ал жакта бөлүшүлгөн шилтемелер боюнча видеолорду өзүм жөнөтүп турам.\n\n⚡ Сапатты тандабай эле: шилтемеден кийин -audio деп жазсаңыз — үнүн гана (mp3) жөнөтөм, -hd деп жазсаңыз — эң жакшы сапатта.\n\n📣 Долбоордун жаңылыктары: @videonerdownload\n\n🌐 Боттун тили: /language",
  notLink: "Бул шилтемеге окшобойт. Мага видео шилтемесин жөнөтүңүз.",
  inviteGreeting: "Салам! Мен Videoner — YouTube, TikTok, Instagram жана башка платформалардан видеолорду акысыз жүктөп берем. Сиз менен бөлүшүлгөн видеону даярдап жатам 👇",
  inviteNotFound: "Бул чакыруу шилтемеси боюнча видео табылган жок. Мага видео шилтемесин жөнөтүңүз — мен аны жүктөп берем.",
  inviteUnavailable: "Бул шилтемедеги видеону ачуу мүмкүн болгон жок — кызмат азыр жооп бербей жатат. Бир мүнөттөн кийин ошол эле шилтемени кайра ачыңыз.",
  fetchingInfo: "🔍 Видео тууралуу маалымат алып жатам...",
  audioOnlyButton: "🎵 Аудио гана (mp3)",
  photoButton: "📷 Сүрөттөрдү жүктөп алуу",
  slideshowButton: "🎞 Слайд-шоу (видео)",
  galleryButton: "📷+🎞 Сүрөттөр жана слайд-шоу",
  chooseQuality: (title, duration) => `«${title}»${duration ? `\n⏱ ${duration}` : ""}\n\nСапатты тандаңыз:`,
  sessionExpired: "Сессиянын мөөнөтү бүттү — шилтемени кайра жөнөтүңүз",
  downloading: "⏬ Жүктөлүүдө, бул бир нече мүнөткө созулушу мүмкүн...",
  downloadFailed: "жүктөп алуу ишке ашкан жок",
  downloadProgress: (percent, eta, done) =>
    `⏬ Жүктөлүүдө: ${percent}%${eta ? ` · ${eta} калды` : ""}${done ? `\n${done}` : ""}`,
  downloadFinishing: "⚙️ Аз калды — файлды чогултуп жатам...",
  converting: (percent) => `⚙️ Конвертациялап жатам: ${percent}%`,
  etaUnderMinute: "бир мүнөткө жетпеген убакыт",
  etaMinutes: (minutes) => `~${minutes} мүн`,
  etaHours: (hours, minutes) => `~${hours} саат${minutes ? ` ${minutes} мүн` : ""}`,
  downloadTimeout: "жүктөп алуу өтө көпкө созулуп жатат — видео абдан оор окшойт. Төмөнүрөөк сапатты тандап көрүңүз.",
  downloadInterrupted: "⚠️ Бот жаңыртуу үчүн кайра иштетилүүдө — жүктөп алуу үзүлүп калды. Бир мүнөттөн кийин шилтемени кайра жөнөтүңүз.",
  fileTooBig: (mb, url) =>
    `Файл чоң болуп чыкты (${mb} МБ) — Telegram ботко аны жөнөтүүгө уруксат бербейт.\nБул жерден жүктөп алыңыз: ${url}`,
  sendingFile: "📤 Файлды жөнөтүп жатам...",
  sendingAlbum: (count) => `📤 Бул постто бир нече файл бар (${count}) — альбом катары жөнөтүп жатам...`,
  failedPrefix: "❌ Ишке ашкан жок: ",
  fileCaption: (title, sourceUrl, shareUrl, description) =>
    composeCaption(
      title,
      description,
      `Булак: ${sourceUrl}\n` +
        "Видеого болгон бардык укуктар анын авторуна таандык.\n" +
        "@VideonerBot аркылуу акысыз жүктөлүп алынды",
      `📣 Долбоордун жаңылыктары: ${NEWS_CHANNEL}`,
      shareUrl && `🔗 Бөлүшүү: ${shareUrl}`,
    ),
  subscribeRequired: (channel) =>
    `Жүктөп алуу үчүн биздин ${channel} каналыбызга жазылыңыз — бул жалгыз шарт, кызмат акысыз бойдон калат.\n\n` +
    "Жазылып, «Мен жазылдым» баскычын басыңыз.",
  openChannelButton: "📣 Каналды ачуу",
  checkSubscriptionButton: "Мен жазылдым",
  subscribeThanks: "Рахмат! Эми мага видео шилтемесин жөнөтүңүз.",
  subscribeThanksResuming: "Рахмат! Шилтемеңизди азыр иштетип жатам.",
  subscribeStillMissing: "Жазылууну азырынча көрбөй жатам. Жазылып, кайра басыңыз.",
  channelNotice: (channel) => `\n\nБул посттун шилтемеси ${channel} каналында жарыяланат — анонимдүү түрдө, атыңызсыз.`,
  channelPost: (title, url) =>
    (title ? `🎬 ${title.slice(0, 200)}\n\n` : "") +
    `${url}\n\n` +
    "Бул жана каалаган башка видеону акысыз жүктөп алыңыз: @VideonerBot",
  errorStoryNeedsId:
    "белгилүү бир сториске шилтеме жөнөтүңүз: аны Instagram колдонмосунда ачып, «Поделиться» (Бөлүшүү) → «Копировать ссылку» (Шилтемени көчүрүү) баскычын басыңыз.",
  errorInstagramStory:
    "Instagram стористерин аккаунтка киргендер гана көрө алат.",
  errorLoginRequired:
    "Бул пост аккаунтка кирбей туруп жеткиликсиз: платформа аны аккаунтуна " +
    "кирген колдонуучуларга гана берет. Бул жабык посттордо, жаш курагы боюнча " +
    "чектелген мазмунда жана чектелген аудиторияга арналган посттордо болот.\n\n" +
    "Ачык посттор эч кыйынчылыксыз жүктөлөт — башка шилтемени байкап көрүңүз.",
  errorUnsupportedPlatform:
    "Шилтемени тааный алган жокмун — бул YouTube, TikTok, Instagram, Facebook, Twitter/X, Vimeo, VK, Rutube, OK.ru, Pinterest же Threads видеосуна түз шилтеме экенин текшериңиз.",
  errorFileTooLarge: "файл 2 ГБдан оор — Telegram андан чоң файлдарды боттор аркылуу жөнөтүүгө уруксат бербейт. Аны сайттан же браузер кеңейтүүсү аркылуу жүктөп алыңыз — баскычтар төмөндө. Же шилтемени кайра жөнөтүп, төмөнүрөөк сапатты тандаңыз.",
  siteButton: "🌐 Сайттан жүктөп алуу",
  qualitiesHiddenBySize: (limit) =>
    `\n\n⚖️ Көлөмү ${limit} чегинен ашкан сапаттар жашырылды: Telegram андан чоң файлдарды боттор аркылуу жөнөтүүгө уруксат бербейт. Аларды сайттан же браузер кеңейтүүсү аркылуу жүктөп алсаңыз болот — баскычтар төмөндө.`,
  videoTooBigForTelegram: (smallest) =>
    `\n\n⚖️ Бул видео эң төмөнкү сапатта да Telegram үчүн өтө оор (~${smallest}): Telegram 2 ГБдан ашкан файлдарды боттор аркылуу жөнөтүүгө уруксат бербейт. Бул жерден аудиону гана алсаңыз болот, ал эми видеону — сайттан же браузер кеңейтүүсү аркылуу (баскычтар төмөндө).`,
  errorFormatUnavailable: "Бул видеодо мындай сапат жок. Шилтемени кайра жөнөтүңүз — учурдагы тизмени көрсөтөм.",
  errorNoVideoContent: "Бул шилтемеде жүктөп ала турган видео жок — постто сүрөттөр гана бар окшойт.",
  errorRegionBlocked:
    "Бул видео автордун өлкөсүнөн тышкары бөгөттөлгөн — платформа аны " +
    "биздин серверге бербейт. Муну айланып өтүүгө болбойт: чектөө платформа тарабында." +
    "\n\nБашка шилтемелер кадимкидей жүктөлөт.",
  errorRateLimited: "Катары менен өтө көп шилтеме — бир аз күтүп, кайра жөнөтүңүз.",
  errorYoutubeDailyLimit: (gb) => `акыркы 24 саатта YouTube-дан ${gb} ГБдан ашык жүктөп алдыңыз — бул боттун бир адамга берген суткалык лимити. Ал акыркы 24 саат боюнча эсептелет, ошондуктан YouTube-дан жаңы видеолорду бир аздан кийин жүктөп ала аласыз. Башка платформалар кадимкидей иштейт.`,
  playlistStoppedByLimit: (dropped) => `⏹ Плейлист токтотулду: YouTube суткалык лимитине жеттиңиз. Жүктөлбөгөн видеолор: ${dropped}. Плейлисттин шилтемесин кийинчерээк кайра жөнөтүңүз.`,
  errorPlatformRefused:
    "платформа бул видеону биздин серверге берген жок. Бул жабык же жаш курагы " +
    "боюнча чектелген посттордо болот, кээде платформа жөн гана убактылуу " +
    "жетүүнү чектейт. Бир нече мүнөттөн кийин кайра аракет кылыңыз.",
  errorThreadsNoMedia:
    "бул Threads постунда видео да, сүрөт да көрүнбөйт. Же бул текст гана камтылган пост, же " +
    "Threads анын медиасын аккаунтка киргендерге гана көрсөтөт — мындай постторду аккаунтка кирбей жүктөп алуу мүмкүн эмес.",
  extensionHint:
    "\n\n💻 Муну компьютерде Videoner браузер кеңейтүүсү менен жүктөп алсаңыз болот: " +
    "ал платформадагы өз аккаунтуңуз аркылуу жүктөйт, сырсөз да, cookie да браузериңизден эч жакка чыкпайт.",
  privateConnectHint: (platform, withExtension) =>
    `\n\n🔑 Мындай постторду жүктөп алуу үчүн ${platform} аккаунтуңузду ботко бир жолу туташтырыңыз. Андан кийин бот Сиз көргөндүн баарын жүктөп берет: жабык постторду, рилстерди жана стористерди, телефондон да. Кантип туташтырууну төмөнкү баскыч көрсөтөт.${withExtension ? "\n\n💻 Же аны компьютерде Videoner браузер кеңейтүүсү менен жүктөп алыңыз." : ""}`,
  privateReconnectHint: (platform, withExtension) =>
    `\n\n⚠️ Туташтырылган ${platform} аккаунтуңуз бул постту ача алган жок. Балким, кирүү иштебей калгандыр — аккаунтту кайра туташтырыңыз. Же бул аккаунттун постко жетүү мүмкүнчүлүгү жок.${withExtension ? "\n\n💻 Аны компьютерде Videoner браузер кеңейтүүсү менен да жүктөп алсаңыз болот." : ""}`,
  connectAccountButton: "🔑 Аккаунтту туташтыруу",
  reconnectAccountButton: "🔑 Кайра туташтыруу",
  extensionButton: "🧩 Кеңейтүү менен жүктөп алуу",
  extensionCommand:
    "🧩 Браузер үчүн Videoner: «Жүктөп алуу» баскычы түз эле видео барагында — YouTube, Instagram, TikTok, VK, аккаунтуңуздагы жабык видеолор жана GetCourse сабактары.\n\nКомпьютердеги Chrome, Edge, Opera, Яндекс Браузер жана Firefox үчүн.",
  extensionPageButton: "🧩 Кеңейтүүнү орнотуу",
  addToGroupButton: "👥 Топко кошуу",
  newsButton: "📣 Долбоордун жаңылыктары",
  fileCaptionShort: (title, sourceUrl) =>
    withOptionalLines((title ? `🎬 ${title.slice(0, 200)}\n\n` : "") + sourceUrl, `📣 Долбоордун жаңылыктары: ${NEWS_CHANNEL}`, undefined),
  sentBy: (name) => `👤 ${name}`,
  groupSettings: (s, canDelete) =>
    "⚙️ Бул топтогу боттун жөндөөлөрү\n\n" +
    `🗑 Шилтемеси бар билдирүүнү өчүрүү: ${s.deleteLinks ? "ооба" : "жок"}\n` +
    "Видео жөнөтүлгөндөн кийин шилтеме гана камтылган билдирүү өчүрүлөт — чатта аны бөлүшкөн адамдын аты менен видео гана калат.\n" +
    (s.deleteLinks && !canDelete
      ? "⚠️ Азыр билдирүүлөрдү өчүрө албайм: мени «Удаление сообщений» (Билдирүүлөрдү өчүрүү) укугу бар администратор кылыңыз.\n"
      : "") +
    `\n✍️ Видеонун астындагы текст: ${{ full: "толук", short: "аталышы жана булагы", none: "текстсиз" }[s.caption] ?? s.caption}\n` +
    `\n🎞 Сапат: ${s.quality === "max" ? "Telegram кабыл алган эң жогорку" : "стандарттуу (720p)"}\n` +
    `\n⏱ Узун видеолор: ${s.longVideos ? "каалаган узундуктагы" : "15 мүнөткө чейинкилер гана"}\n` +
    `\n🔑 Аккаунттарды ким туташтыра алат (стористер жана жабык посттор үчүн): ${s.cookiesBy === "all" ? "каалаган катышуучу" : "администраторлор гана"}\n` +
    `\n🌐 Жооп тили: ${s.language ? langName(s.language) : "ар бир катышуучунун өз тили"}\n` +
    "\nЖөндөөлөрдү топтун администраторлору гана өзгөртө алат.",
  settingsDeleteButton: (on) => `🗑 Шилтемелерди өчүрүү: ${on ? "ооба" : "жок"}`,
  settingsCaptionButton: (style) => `✍️ Текст: ${{ full: "толук", short: "кыска", none: "жок" }[style] ?? style}`,
  settingsQualityButton: (mode) => `🎞 Сапат: ${mode === "max" ? "эң жогорку" : "720p"}`,
  settingsLongButton: (on) => `⏱ Узун видеолор: ${on ? "ооба" : "15 мүн чейин"}`,
  settingsDoneButton: "✅ Даяр",
  settingsAdminsOnly: "Жөндөөлөрдү топтун администраторлору гана өзгөртө алат.",
  settingsGroupsOnly: "Жөндөөлөр топтор үчүн: мени топко кошуп, ошол жакка /settings жөнөтүңүз.",
  settingsFailed: "Жөндөөлөрдү сактоо мүмкүн болгон жок, кайра аракет кылыңыз.",
  settingsCookiesButton: (by) => `🔑 Аккаунт туташтыруу: ${by === "all" ? "баары" : "администраторлор"}`,
  accountsIntro:
    "🔑 Туташтырылган аккаунттар\n\nБот аккаунтка киргендер гана көрө турган нерселерди (Instagram стористери, жабык посттор) Сиздин аккаунтуңуз аркылуу жүктөп ала алат. Кирүү Сиз аны туташтырган жерде иштейт: жеке чатта туташтырылганы Сиздин жүктөөлөрүңүз үчүн, анын ичинде өз аккаунту жок топтордогу өз шилтемелериңиз үчүн иштейт; топко туташтырылганы анын бардык катышуучуларына кызмат кылат.",
  accountsHowTo:
    "Кантип туташтыруу керек:\n1. Эң оңою: компьютердеги Videoner кеңейтүүсү — платформанын сайтына кирип, Videoner терезесин ачыңыз, «🔑 … аккаунтуңузду ботко туташтырыңыз» баскычын басып, кодду мага жөнөтүңүз. Топ үчүн ошол топко /connect КОД жөнөтүңүз.\n2. Же мага cookies.txt файлын (браузерден экспорттолгон cookie-файлдар) жөнөтүңүз, же анын текстин билдирүү катары жиберип коюңуз.\n3. Android телефонунан — Firefox жана Cookie-Editor кошумчасы менен: https://videoner.download/ky/blog/android-firefox",
  accountsWarning:
    "⚠️ Платформалар автоматтык жүктөөлөрдү жактырбайт жана аккаунтту чектеп же бөгөттөп коюшу мүмкүн. Негизги эмес, кошумча аккаунтту туташтырганыңыз жакшы. Cookie-файлдар шифрленген түрдө сакталат, жүктөп алуу үчүн гана колдонулат жана төмөнкү баскычтар менен өчүрүлөт.",
  accountsNone: "Азырынча эч нерсе туташтырылган эмес.",
  accountsGroupTitle: "🔑 Бул топко туташтырылган аккаунттар",
  accountsGroupHowTo:
    "Бүт топ үчүн туташтыруу: Videoner кеңейтүүсүндөгү «🔑 … аккаунтуңузду ботко туташтырыңыз» баскычы менен код алып, бул жакка /connect КОД жөнөтүңүз. Эгер аккаунтту жеке чатыңызда гана туташтырсаңыз, бот аны бул жерде Сиздин өз шилтемелериңиз үчүн колдонот. Өз туташтырууларыңыз: @VideonerBot менен жеке чатта /accounts.",
  accountsLine: (platform, where, active) => `• ${platform} — ${where}${active ? "" : " (⚠️ кирүү иштебей жатат)"}`,
  accountsGroupLine: (platform, owner, active) => `• ${platform} — ${owner}${active ? "" : " (⚠️ кирүү иштебей жатат)"}`,
  accountsWhereHere: "жеке чат",
  accountsWhereGroup: (title) => `«${title}» тобу`,
  accountsDeleteButton: (platform, where) => `🗑 ${platform} · ${where}`,
  accountsDeleteAllButton: "🗑 Бардык туташтырууларымды өчүрүү",
  accountsDeleted: "Өчүрүлдү.",
  accountsDeletedAll: (n) => `Өчүрүлгөн туташтыруулар: ${n}.`,
  accountsNotAllowed: "Аны туташтырган адам же топтун администратору гана өчүрө алат.",
  connectUsage:
    "/connect КОД жөнөтүңүз. Кодду компьютердеги Videoner кеңейтүүсүндөгү «🔑 … аккаунтуңузду ботко туташтырыңыз» баскычы берет. Туташтырууларыңыз: /accounts.",
  connectOnlyAdmins: "Бул топко аккаунттарды администраторлор гана туташтыра алат (/settings караңыз).",
  connectDone: (platform, where) =>
    `✅ ${platform} ${where} туташтырылды. Эми бот аккаунтка киргендер гана көрө турган нерселерди да жүктөп алат. Көрүү же өчүрүү: /accounts.\n\n⚠️ Платформа автоматтык жүктөөлөр үчүн аккаунтту чектеши мүмкүн — кошумча аккаунтту колдонгонуңуз жакшы.`,
  connectWhereGroup: "бул топко",
  connectWhereHere: "жеке чаттагы жана инлайн режиминдеги жүктөөлөрүңүз үчүн",
  connectCodeNotFound: "Код табылган жок же мөөнөтү бүткөн (коддор 10 мүнөт жарактуу). Videoner кеңейтүүсүнөн жаңысын алыңыз.",
  connectRejectedNoSession: "Бул cookie-файлдарда аккаунтка кирүү жок. Платформанын сайтына кирип, cookie-файлдарды кайра экспорттоңуз.",
  connectRejectedUnknown: "Колдоого алынган платформалардын cookie-файлдары табылган жок: Instagram, Facebook, YouTube, X, VK, TikTok.",
  connectUnavailable: "Аккаунттарды туташтыруу азырынча жеткиликсиз.",
  connectFailed: "Туташтыруу мүмкүн болгон жок, кайра аракет кылыңыз.",
  connectFileTooBig: "Файл өтө чоң — керектүү сайттын гана cookie-файлдарын экспорттоңуз.",
  connectNotAnonymous: "Аккаунтту топтун атынан анонимдүү эмес, өз атыңыздан туташтырыңыз: болбосо администраторлордун туташтыруулары аралашып кетет. Кодду жок кылдым — жаңысын алыңыз.",
  connectCodeInGroup:
    "Топтун чатына жазылган туташтыруу кодун башкалар көрүп калышы мүмкүн — мен аны жок кылып, билдирүүнү өчүрдүм. Жаңысын алып, /connect КОД буйругу менен жөнөтүңүз: мындай буйругу бар билдирүүнү дароо өчүрөм.",
  groupWelcome:
    "👋 Салам! Бул чатка TikTok, Instagram, YouTube, VK жана башка платформалардагы видеолордун шилтемелерин жөнөтүңүз — мен видеонун өзү менен жооп берем.\n\n" +
    "15 мүнөткө чейинки видеолорду буйруксуз эле өзүм жүктөп алам, калган учурда унчукпайм.\n\n⚙️ Топтун администраторлору мени /settings аркылуу жөндөй алат: шилтемеси бар билдирүүлөрдү өчүрүү, тексттин түрү, сапат, узун видеолор жана тил.\n\n⚡ Шилтемеден кийин -audio деп жазсаңыз — үнүн, -hd деп жазсаңыз — эң жакшы сапатты аласыз.\n\n📣 Долбоордун жаңылыктары: @videonerdownload",
  errorTooLong: "видео өтө узун — мындай узун видеолорду азырынча жүктөп ала албайбыз.",
  errorUnknown: "бул видеону жүктөп алуу мүмкүн болгон жок. Бир аздан кийин кайра аракет кылыңыз же башка шилтеме жөнөтүңүз.",
  inlineHintButton: "Ботко шилтеме жөнөтүү",
  inlineResultTitle: "⬇️ Видеону жүктөп алуу",
  inlineResultDescription: "Видео түз эле ушул чатка жарыяланат",
  inlinePlaceholder: "⏬ Жүктөлүүдө, бул бир нече мүнөткө созулушу мүмкүн...",
  inlineOpenBot: "Ботту ачуу",
  inlineOnlySingleVideo:
    "Бул режим бир гана видео жөнөтөт. Бир нече файлдан турган посттор же сүрөттөр үчүн шилтемени ботко жеке чатта жөнөтүңүз.",
  inlineSubscribeRequired: (channel: string) =>
    `Жүктөп алуу үчүн ${channel} каналына жазылып, кайра аракет кылыңыз.`,
  inlineRateLimited: "Катары менен өтө көп суроо. Бир мүнөт күтүп, кайра аракет кылыңыз.",
  queueRest: (count) => `\n\n📋 Кезекте дагы шилтемелер бар: ${count}. Бул бүткөндөн кийин аларды бирден көрсөтөм.`,
  queuedOne: (position) =>
    `📋 Шилтеме кезекке коюлду, №${position}. Адегенде учурдагысын бүтүрөбүз — андан кийин бул шилтеме үчүн сапат тандоону көрсөтөм.`,
  queuedMany: (added, waiting) =>
    `📋 Кезекке кошулган шилтемелер: ${added}. Бардыгы күтүүдө: ${waiting}. Учурдагысынан кийин аларды бирден көрсөтөм.`,
  queueDuplicates: (count) =>
    count === 1
      ? "Бул шилтеме кезекте бар — аны эки жолу кошпойм."
      : `Кезекте бар шилтемелер эки жолу кошулбайт (кайталангандар: ${count}).`,
  queueFull: (limit, rejected) =>
    `Кезекте эң көп ${limit} шилтеме болот — ашыкчалары кошулган жок (${rejected}). Кезек жылганда аларды жөнөтүңүз.`,
  skipButton: "✖️ Жүктөп албоо",
  skipped: "⏭ Бул шилтеме өткөрүлүп жиберилди.",
  chooseTimedOut: "⌛ 30 мүнөттүн ичинде сапат тандалган жок — бул шилтемени өткөрүп жиберем.",
  queueLostOnRestart: (count) =>
    `⚠️ Бот жаңыртуу үчүн кайра иштетилүүдө — кезек тазаланды (шилтемелер: ${count}). Бир мүнөттөн кийин аларды кайра жөнөтүңүз.`,
  subtitlesButton: "📝 Субтитрлер",
  subtitlesBack: "⬅️ Сапат тандоого кайтуу",
  subtitlesAuto: "авто",
  subtitlesChoose: "Субтитрлердин тилин тандаңыз",
  subtitlesPreparing: "📝 Субтитрлерди даярдап жатам...",
  subtitlesFailed: "Бул тилдеги субтитрлерди жүктөп алуу мүмкүн болгон жок. Башка тилди тандап көрүңүз.",
  subtitlesBusy: "YouTube азыр субтитрлерди бербей жатат — бир нече мүнөттөн кийин кайра аракет кылыңыз.",
  playlistFound: (title, count) =>
    `📃 Плейлист${title ? ` «${title.slice(0, 150)}»` : ""}: ${count} видео.\nАларды бирден жүктөп берем. Кайсы форматта?`,
  playlistStdButton: "🎬 720p",
  playlistHdButton: "🎬 Эң жакшы сапат",
  playlistAudioButton: "🎵 Аудио гана (mp3)",
  playlistNoButton: "✖️ Жок, рахмат",
  playlistQueued: (count) =>
    `📃 Плейлисттен кезекке коюлган видеолор: ${count}. Аларды бирден жөнөтөм. Токтотуу үчүн төмөнкү баскычты басыңыз же /stop жөнөтүңүз.`,
  playlistFailed: "Плейлистти ачуу мүмкүн болгон жок — ал жабык болушу мүмкүн. Бир видеонун шилтемесин жөнөтүңүз.",
  stopButton: "⏹ Токтотуу",
  stopped: (dropped) => `⏹ Токтотулду.${dropped ? ` Кезектен алынып салынган шилтемелер: ${dropped}.` : ""}`,
  nothingToStop: "Азыр эч нерсе жүктөлүп жаткан жок.",
  languageChoose: "🌐 Боттун тилин тандаңыз. «Авто» — Telegram-дагы тилиңиз боюнча.",
  languageChooseGroup: "🌐 Бул топтогу боттун жооп тили. «Авто» — ар бир катышуучунун Telegram тилинде.",
  languageAuto: "Авто — Telegram-дагыдай",
  languageAutoGroup: "Авто — ар кимдин өз тили",
  languageSaved: (name) => `✅ Боттун тили: ${name}. Өзгөртүү: /language.`,
  languageSavedAuto: "✅ Бот Telegram-дагы тилиңизди колдонот. Өзгөртүү: /language.",
  settingsLanguageButton: (name) => `🌐 Тил: ${name ?? "авто"}`,
  settingsBack: "⬅️ Жөндөөлөргө кайтуу",
};

const tg: Messages = {
  start: "Салом! Ба ман пайванди видеоро аз YouTube, TikTok, Instagram, Facebook, Twitter/X, Vimeo, VK, Rutube, OK.ru, Pinterest ё Threads фиристед — дар боргирии он кӯмак мекунам.\n\n✨ Сифат маҳдуд нест: ҳар сифате, ки платформа дорад, то 4K медиҳам — фақат файл аз 2 ГБ зиёд набошад, ин маҳдудияти Telegram барои ботҳост. Дар ин ҷо ягон функсияи пулакӣ нест.\n\nПурра ройгон: бе обуна, бе реклама, бе харидҳои дохилӣ.\n\n🧩 Дар компютер боргирӣ мекунед? Васеъкунандаи браузерро насб кунед — тугмаи «Боргирӣ» рост дар саҳифаи видео пайдо мешавад: videoner.download/tg/extension\n\n👥 Маро ба гурӯҳ илова кунед — видеоҳоро аз рӯи пайвандҳое, ки дар он ҷо мубодила мешаванд, худам мефиристам.\n\n⚡ Бе интихоби сифат: баъди пайванд -audio нависед — фақат садо (mp3), ё -hd — беҳтарин сифат.\n\n📣 Хабарҳои лоиҳа: @videonerdownload\n\n🌐 Забони бот: /language",
  notLink: "Ин ба пайванд монанд нест. Ба ман пайванди видеоро фиристед.",
  inviteGreeting: "Салом! Ман Videoner ҳастам — видеоҳоро аз YouTube, TikTok, Instagram ва дигар платформаҳо ройгон боргирӣ мекунам. Видеоеро, ки бо Шумо мубодила карданд, омода карда истодаам 👇",
  inviteNotFound: "Аз рӯи ин пайванди даъват видео ёфт нашуд. Ба ман пайванди видеоро фиристед — онро боргирӣ мекунам.",
  inviteUnavailable: "Видеоро аз ин пайванд кушодан нашуд — хизматрасонӣ ҳоло ҷавоб намедиҳад. Баъд аз як дақиқа ҳамон пайвандро боз кушоед.",
  fetchingInfo: "🔍 Маълумот дар бораи видео гирифта истодаам...",
  audioOnlyButton: "🎵 Фақат аудио (mp3)",
  photoButton: "📷 Боргирии аксҳо",
  slideshowButton: "🎞 Слайд-шоу (видео)",
  galleryButton: "📷+🎞 Аксҳо ва слайд-шоу",
  chooseQuality: (title, duration) => `«${title}»${duration ? `\n⏱ ${duration}` : ""}\n\nСифатро интихоб кунед:`,
  sessionExpired: "Мӯҳлати сессия гузашт — пайвандро боз фиристед",
  downloading: "⏬ Боргирӣ шуда истодааст, ин метавонад якчанд дақиқа тӯл кашад...",
  downloadFailed: "боргирӣ нашуд",
  downloadProgress: (percent, eta, done) =>
    `⏬ Боргирӣ шуда истодааст: ${percent}%${eta ? ` · ${eta} монд` : ""}${done ? `\n${done}` : ""}`,
  downloadFinishing: "⚙️ Қариб тайёр — файлро ҷамъ карда истодаам...",
  converting: (percent) => `⚙️ Табдил дода истодаам: ${percent}%`,
  etaUnderMinute: "камтар аз як дақиқа",
  etaMinutes: (minutes) => `~${minutes} дақ`,
  etaHours: (hours, minutes) => `~${hours} соат${minutes ? ` ${minutes} дақ` : ""}`,
  downloadTimeout: "боргирӣ хеле дер тӯл кашид — гӯё видео хеле вазнин аст. Сифати пасттарро интихоб кунед.",
  downloadInterrupted: "⚠️ Бот барои навсозӣ аз нав оғоз мешавад — боргирии Шумо қатъ шуд. Лутфан, баъд аз як дақиқа пайвандро боз фиристед.",
  fileTooBig: (mb, url) =>
    `Файл калон баромад (${mb} МБ) — Telegram ба бот фиристодани онро иҷозат намедиҳад.\nОнро аз ин ҷо боргирӣ кунед: ${url}`,
  sendingFile: "📤 Файлро фиристода истодаам...",
  sendingAlbum: (count) => `📤 Дар ин пост якчанд файл ҳаст (${count}) — онҳоро ҳамчун албом мефиристам...`,
  failedPrefix: "❌ Нашуд: ",
  fileCaption: (title, sourceUrl, shareUrl, description) =>
    composeCaption(
      title,
      description,
      `Манбаъ: ${sourceUrl}\n` +
        "Ҳамаи ҳуқуқҳо ба видео ба муаллифи он тааллуқ доранд.\n" +
        "Бо ёрии @VideonerBot ройгон боргирӣ шуд",
      `📣 Хабарҳои лоиҳа: ${NEWS_CHANNEL}`,
      shareUrl && `🔗 Мубодила: ${shareUrl}`,
    ),
  subscribeRequired: (channel) =>
    `Барои боргирӣ, лутфан, ба канали мо ${channel} обуна шавед — ин ягона шарт аст, хизматрасонӣ ройгон мемонад.\n\n` +
    "Обуна шавед ва тугмаи «Ман обуна шудам»-ро пахш кунед.",
  openChannelButton: "📣 Кушодани канал",
  checkSubscriptionButton: "Ман обуна шудам",
  subscribeThanks: "Ташаккур! Акнун ба ман пайванди видеоро фиристед.",
  subscribeThanksResuming: "Ташаккур! Ҳозир ба пайванди Шумо машғул мешавам.",
  subscribeStillMissing: "Ҳоло обунаро намебинам. Обуна шавед ва боз пахш кунед.",
  channelNotice: (channel) => `\n\nПайванди ин пост дар ${channel} пайдо мешавад — беном, бе номи Шумо.`,
  channelPost: (title, url) =>
    (title ? `🎬 ${title.slice(0, 200)}\n\n` : "") +
    `${url}\n\n` +
    "Ин ва ҳар видеои дигарро ройгон боргирӣ кунед: @VideonerBot",
  errorStoryNeedsId:
    "пайванди сторисии мушаххасро фиристед: онро дар барномаи Instagram кушоед ва «Поделиться» (Мубодила) → «Копировать ссылку» (Нусха бардоштани пайванд)-ро пахш кунед.",
  errorInstagramStory:
    "Сторисҳои Instagram-ро танҳо касоне мебинанд, ки ба аккаунт ворид шудаанд.",
  errorLoginRequired:
    "Ин пост бе ворид шудан ба аккаунт дастрас нест: платформа онро танҳо ба " +
    "корбарони воридшуда медиҳад. Ин бо постҳои пӯшида, мундариҷаи дорои маҳдудияти " +
    "синну сол ва постҳое, ки барои доираи маҳдуди одамон нашр шудаанд, рух медиҳад.\n\n" +
    "Постҳои кушода бе мушкил боргирӣ мешаванд — пайванди дигарро санҷед.",
  errorUnsupportedPlatform:
    "Пайвандро шинохта натавонистам — боварӣ ҳосил кунед, ки ин пайванди мустақими видео аз YouTube, TikTok, Instagram, Facebook, Twitter/X, Vimeo, VK, Rutube, OK.ru, Pinterest ё Threads аст.",
  errorFileTooLarge: "файл аз 2 ГБ калонтар аст — Telegram ба ботҳо фиристодани файлҳои калонтарро иҷозат намедиҳад. Онро дар сайт ё бо васеъкунандаи браузер боргирӣ кунед — тугмаҳо дар поён. Ё пайвандро боз фиристед ва сифати пасттарро интихоб кунед.",
  siteButton: "🌐 Боргирӣ дар сайт",
  qualitiesHiddenBySize: (limit) =>
    `\n\n⚖️ Сифатҳои вазнинтар аз ${limit} пинҳон карда шуданд: Telegram ба ботҳо фиристодани файлҳои калонтарро иҷозат намедиҳад. Онҳоро дар сайт ё бо васеъкунандаи браузер боргирӣ кардан мумкин аст — тугмаҳо дар поён.`,
  videoTooBigForTelegram: (smallest) =>
    `\n\n⚖️ Ин видео ҳатто бо пасттарин сифат барои Telegram хеле вазнин аст (~${smallest}): Telegram ба ботҳо фиристодани файлҳои аз 2 ГБ калонтарро иҷозат намедиҳад. Дар ин ҷо фақат аудиоро гирифтан мумкин аст, видеоро — дар сайт ё бо васеъкунандаи браузер (тугмаҳо дар поён).`,
  errorFormatUnavailable: "Барои ин видео чунин сифат дастрас нест. Пайвандро боз фиристед — рӯйхати ҷориро нишон медиҳам.",
  errorNoVideoContent: "Дар ин пайванд видеое барои боргирӣ нест — гӯё дар пост фақат акс ҳаст.",
  errorRegionBlocked:
    "Ин видео берун аз кишвари муаллиф баста шудааст — платформа онро ба " +
    "сервери мо намедиҳад. Роҳи гузаштан нест: маҳдудият аз ҷониби платформа аст." +
    "\n\nПайвандҳои дигар мисли пештара боргирӣ мешаванд.",
  errorRateLimited: "Пайвандҳо пай дар пай хеле зиёданд — каме сабр кунед ва боз фиристед.",
  errorYoutubeDailyLimit: (gb) => `дар 24 соати охир Шумо аз YouTube зиёда аз ${gb} ГБ боргирӣ кардед — ин маҳдудияти шабонарӯзии бот барои як нафар аст. Он аз рӯи 24 соати охир ҳисоб мешавад, бинобар ин видеоҳои нави YouTube-ро каме баъдтар боргирӣ карда метавонед. Платформаҳои дигар мисли пештара кор мекунанд.`,
  playlistStoppedByLimit: (dropped) => `⏹ Плейлист қатъ шуд: маҳдудияти шабонарӯзии YouTube ба охир расид. Видеоҳои боргиринашуда: ${dropped}. Пайванди плейлистро дертар боз фиристед.`,
  errorPlatformRefused:
    "платформа ин видеоро ба сервери мо надод. Ин бо постҳои пӯшида ё дорои " +
    "маҳдудияти синну сол рух медиҳад, баъзан платформа дастрасиро муваққатан " +
    "маҳдуд мекунад. Баъд аз якчанд дақиқа боз кӯшиш кунед.",
  errorThreadsNoMedia:
    "дар ин пости Threads на видео намоён аст, на акс. Ё ин пости фақат матнӣ аст, ё " +
    "Threads медиаи онро танҳо ба корбарони воридшуда нишон медиҳад — чунин постҳоро бе ворид шудан ба аккаунт боргирӣ кардан мумкин нест.",
  extensionHint:
    "\n\n💻 Онро дар компютер бо васеъкунандаи браузерии Videoner боргирӣ кардан мумкин аст: " +
    "он бо воридшавии худи Шумо дар платформа боргирӣ мекунад ва на парол, на cookie аз браузери Шумо берун намебароянд.",
  privateConnectHint: (platform, withExtension) =>
    `\n\n🔑 Барои боргирии чунин постҳо аккаунти ${platform}-и худро як маротиба ба бот пайваст кунед. Баъд аз ин бот ҳар чизеро, ки Шумо мебинед, боргирӣ мекунад: постҳои пӯшида, рилсҳо ва сторисҳо, аз телефон ҳам. Чӣ тавр пайваст кардан — тугмаи поён нишон медиҳад.${withExtension ? "\n\n💻 Ё онро дар компютер бо васеъкунандаи браузерии Videoner боргирӣ кунед." : ""}`,
  privateReconnectHint: (platform, withExtension) =>
    `\n\n⚠️ Аккаунти пайвастшудаи ${platform}-и Шумо ин постро кушода натавонист. Шояд воридшавӣ дигар кор намекунад — аккаунтро аз нав пайваст кунед. Ё ин аккаунт ба пост дастрасӣ надорад.${withExtension ? "\n\n💻 Инчунин онро дар компютер бо васеъкунандаи браузерии Videoner боргирӣ кардан мумкин аст." : ""}`,
  connectAccountButton: "🔑 Пайваст кардани аккаунт",
  reconnectAccountButton: "🔑 Аз нав пайваст кардан",
  extensionButton: "🧩 Боргирӣ бо васеъкунанда",
  extensionCommand:
    "🧩 Videoner барои браузер: тугмаи «Боргирӣ» рост дар саҳифаи видео — YouTube, Instagram, TikTok, VK, видеоҳои пӯшидаи аккаунти Шумо ва дарсҳои GetCourse.\n\nБарои Chrome, Edge, Opera, Яндекс Браузер ва Firefox дар компютер.",
  extensionPageButton: "🧩 Насб кардани васеъкунанда",
  addToGroupButton: "👥 Илова кардан ба гурӯҳ",
  newsButton: "📣 Хабарҳои лоиҳа",
  fileCaptionShort: (title, sourceUrl) =>
    withOptionalLines((title ? `🎬 ${title.slice(0, 200)}\n\n` : "") + sourceUrl, `📣 Хабарҳои лоиҳа: ${NEWS_CHANNEL}`, undefined),
  sentBy: (name) => `👤 ${name}`,
  groupSettings: (s, canDelete) =>
    "⚙️ Танзимоти бот дар ин гурӯҳ\n\n" +
    `🗑 Нест кардани паём бо пайванд: ${s.deleteLinks ? "ҳа" : "не"}\n` +
    "Баъди фиристодани видео паёме, ки фақат пайванд дошт, нест карда мешавад — дар чат танҳо видео бо номи касе, ки онро мубодила кард, мемонад.\n" +
    (s.deleteLinks && !canDelete
      ? "⚠️ Ҳоло паёмҳоро нест карда наметавонам: маро бо ҳуқуқи «Удаление сообщений» (Нест кардани паёмҳо) админ кунед.\n"
      : "") +
    `\n✍️ Матн зери видео: ${{ full: "пурра", short: "ном ва манбаъ", none: "бе матн" }[s.caption] ?? s.caption}\n` +
    `\n🎞 Сифат: ${s.quality === "max" ? "баландтарине, ки Telegram қабул мекунад" : "стандартӣ (720p)"}\n` +
    `\n⏱ Видеоҳои дароз: ${s.longVideos ? "бо ҳар дарозӣ" : "фақат то 15 дақиқа"}\n` +
    `\n🔑 Кӣ аккаунтҳоро пайваст карда метавонад (барои сторисҳо ва постҳои пӯшида): ${s.cookiesBy === "all" ? "ҳар узв" : "фақат админҳо"}\n` +
    `\n🌐 Забони ҷавоб: ${s.language ? langName(s.language) : "забони худи ҳар узв"}\n` +
    "\nТанзимотро танҳо админҳои гурӯҳ тағйир дода метавонанд.",
  settingsDeleteButton: (on) => `🗑 Нест кардани пайвандҳо: ${on ? "ҳа" : "не"}`,
  settingsCaptionButton: (style) => `✍️ Матн: ${{ full: "пурра", short: "кӯтоҳ", none: "нест" }[style] ?? style}`,
  settingsQualityButton: (mode) => `🎞 Сифат: ${mode === "max" ? "баландтарин" : "720p"}`,
  settingsLongButton: (on) => `⏱ Видеоҳои дароз: ${on ? "ҳа" : "то 15 дақ"}`,
  settingsDoneButton: "✅ Тайёр",
  settingsAdminsOnly: "Танзимотро танҳо админҳои гурӯҳ тағйир дода метавонанд.",
  settingsGroupsOnly: "Танзимот барои гурӯҳҳост: маро ба гурӯҳ илова кунед ва дар он ҷо /settings фиристед.",
  settingsFailed: "Танзимотро нигоҳ доштан нашуд, лутфан, боз кӯшиш кунед.",
  settingsCookiesButton: (by) => `🔑 Пайваст кардани аккаунтҳо: ${by === "all" ? "ҳама" : "админҳо"}`,
  accountsIntro:
    "🔑 Аккаунтҳои пайвастшуда\n\nБот метавонад он чиро, ки танҳо корбарони воридшуда мебинанд (сторисҳои Instagram, постҳои пӯшида), бо аккаунти Шумо боргирӣ кунад. Воридшавӣ дар ҳамон ҷое кор мекунад, ки онро пайваст кардед: аккаунти дар чати шахсӣ пайвастшуда барои боргириҳои Шумо, аз ҷумла пайвандҳои худатон дар гурӯҳҳое, ки аккаунти худро надоранд, хизмат мекунад; аккаунти ба гурӯҳ пайвастшуда ба ҳамаи узвҳои он хизмат мекунад.",
  accountsHowTo:
    "Чӣ тавр пайваст кардан:\n1. Осонтарин роҳ: васеъкунандаи Videoner дар компютер — ба сайти платформа ворид шавед, равзанаи Videoner-ро кушоед, тугмаи «🔑 Аккаунти …-и худро ба бот пайваст кунед»-ро пахш кунед ва кодро ба ман фиристед. Барои гурӯҳ дар ҳамон гурӯҳ /connect КОД фиристед.\n2. Ё ба ман файли cookies.txt (cookie-ҳое, ки аз браузер содир шудаанд) фиристед, ё матни онро ҳамчун паём гузоред.\n3. Аз телефони Android — бо Firefox ва иловаи Cookie-Editor: https://videoner.download/tg/blog/android-firefox",
  accountsWarning:
    "⚠️ Платформаҳо боргириҳои худкорро дӯст намедоранд ва метавонанд аккаунтро маҳдуд ё баста кунанд. Беҳтар аст аккаунти иловагиро пайваст кунед, на асосиро. Cookie-ҳо рамзгузоришуда нигоҳ дошта мешаванд, танҳо барои боргирӣ истифода мешаванд ва бо тугмаҳои поён нест карда мешаванд.",
  accountsNone: "Ҳоло ҳеҷ чиз пайваст нашудааст.",
  accountsGroupTitle: "🔑 Аккаунтҳое, ки ба ин гурӯҳ пайваст шудаанд",
  accountsGroupHowTo:
    "Барои пайваст кардан ба тамоми гурӯҳ: бо тугмаи «🔑 Аккаунти …-и худро ба бот пайваст кунед» дар васеъкунандаи Videoner код гиред ва дар ин ҷо /connect КОД фиристед. Агар аккаунтро танҳо дар чати шахсии худ пайваст карда бошед, бот онро дар ин ҷо барои пайвандҳои худатон истифода мебарад. Пайвастҳои Шумо: /accounts дар чати шахсӣ бо @VideonerBot.",
  accountsLine: (platform, where, active) => `• ${platform} — ${where}${active ? "" : " (⚠️ воридшавӣ кор намекунад)"}`,
  accountsGroupLine: (platform, owner, active) => `• ${platform} — ${owner}${active ? "" : " (⚠️ воридшавӣ кор намекунад)"}`,
  accountsWhereHere: "чати шахсӣ",
  accountsWhereGroup: (title) => `гурӯҳи «${title}»`,
  accountsDeleteButton: (platform, where) => `🗑 ${platform} · ${where}`,
  accountsDeleteAllButton: "🗑 Нест кардани ҳамаи пайвастҳои ман",
  accountsDeleted: "Нест карда шуд.",
  accountsDeletedAll: (n) => `Пайвастҳои нестшуда: ${n}.`,
  accountsNotAllowed: "Онро танҳо касе, ки пайваст кардааст, ё админи гурӯҳ нест карда метавонад.",
  connectUsage:
    "/connect КОД фиристед. Кодро тугмаи «🔑 Аккаунти …-и худро ба бот пайваст кунед» дар васеъкунандаи Videoner дар компютер медиҳад. Пайвастҳои Шумо: /accounts.",
  connectOnlyAdmins: "Ба ин гурӯҳ аккаунтҳоро танҳо админҳо пайваст карда метавонанд (/settings-ро бинед).",
  connectDone: (platform, where) =>
    `✅ ${platform} ${where} пайваст шуд. Акнун бот он чиро ҳам, ки танҳо корбарони воридшуда мебинанд, боргирӣ мекунад. Дидан ё нест кардан: /accounts.\n\n⚠️ Платформа метавонад аккаунтро барои боргириҳои худкор маҳдуд кунад — беҳтар аст аккаунти иловагиро истифода баред.`,
  connectWhereGroup: "ба ин гурӯҳ",
  connectWhereHere: "барои боргириҳои Шумо дар чати шахсӣ ва реҷаи inline",
  connectCodeNotFound: "Код ёфт нашуд ё мӯҳлаташ гузаштааст (кодҳо 10 дақиқа амал мекунанд). Дар васеъкунандаи Videoner коди нав гиред.",
  connectRejectedNoSession: "Дар ин cookie-ҳо воридшавӣ нест. Ба сайти платформа ворид шавед ва cookie-ҳоро аз нав содир кунед.",
  connectRejectedUnknown: "Cookie-ҳои платформаҳои дастгиришаванда ёфт нашуданд: Instagram, Facebook, YouTube, X, VK, TikTok.",
  connectUnavailable: "Пайваст кардани аккаунтҳо ҳоло дастрас нест.",
  connectFailed: "Пайваст кардан нашуд, лутфан, боз кӯшиш кунед.",
  connectFileTooBig: "Файл хеле калон аст — танҳо cookie-ҳои сайти лозимиро содир кунед.",
  connectNotAnonymous: "Аккаунтро аз номи худ пайваст кунед, на беном аз номи гурӯҳ: вагарна пайвастҳои админҳо омехта мешаванд. Кодро нест кардам — коди нав гиред.",
  connectCodeInGroup:
    "Коди пайвастро, ки дар чати гурӯҳ навишта шудааст, дигарон дида метавонанд — ман онро нест кардам ва паёмро пок кардам. Коди нав гиред ва онро бо /connect КОД фиристед: паёми дорои ин фармонро фавран нест мекунам.",
  groupWelcome:
    "👋 Салом! Дар ин чат пайвандҳои видеоро аз TikTok, Instagram, YouTube, VK ва дигар платформаҳо фиристед — ман бо худи видео ҷавоб медиҳам.\n\n" +
    "Видеоҳои то 15 дақиқаро худам, бе фармон боргирӣ мекунам, дар дигар ҳолатҳо хомӯш мемонам.\n\n⚙️ Админҳои гурӯҳ метавонанд маро бо /settings танзим кунанд: нест кардани паёмҳо бо пайванд, намуди матн, сифат, видеоҳои дароз ва забон.\n\n⚡ Баъди пайванд -audio нависед — садоро мегиред, ё -hd — беҳтарин сифатро.\n\n📣 Хабарҳои лоиҳа: @videonerdownload",
  errorTooLong: "видео хеле дароз аст — чунин видеоҳои дарозро ҳоло боргирӣ карда наметавонем.",
  errorUnknown: "ин видеоро боргирӣ кардан нашуд. Каме баъдтар боз кӯшиш кунед ё пайванди дигар фиристед.",
  inlineHintButton: "Фиристодани пайванд ба бот",
  inlineResultTitle: "⬇️ Боргирии видео",
  inlineResultDescription: "Видео рост дар ҳамин чат нашр мешавад",
  inlinePlaceholder: "⏬ Боргирӣ шуда истодааст, ин метавонад якчанд дақиқа тӯл кашад...",
  inlineOpenBot: "Кушодани бот",
  inlineOnlySingleVideo:
    "Ин реҷа танҳо як видео мефиристад. Барои постҳои аз якчанд файл иборат ё аксҳо пайвандро ба бот дар чати шахсӣ фиристед.",
  inlineSubscribeRequired: (channel: string) =>
    `Барои боргирӣ ба ${channel} обуна шавед ва боз кӯшиш кунед.`,
  inlineRateLimited: "Дархостҳо пай дар пай хеле зиёданд. Як дақиқа сабр кунед ва боз кӯшиш кунед.",
  queueRest: (count) => `\n\n📋 Дар навбат боз пайвандҳо ҳастанд: ${count}. Баъди ин якто онҳоро як-як нишон медиҳам.`,
  queuedOne: (position) =>
    `📋 Пайванд ба навбат гузошта шуд, №${position}. Аввал ҷориро ба охир мерасонем — баъд барои он интихоби сифатро нишон медиҳам.`,
  queuedMany: (added, waiting) =>
    `📋 Пайвандҳои ба навбат иловашуда: ${added}. Ҳамагӣ дар интизорӣ: ${waiting}. Баъди ҷорӣ онҳоро як-як нишон медиҳам.`,
  queueDuplicates: (count) =>
    count === 1
      ? "Ин пайванд аллакай дар навбат аст — ду бор илова намекунам."
      : `Пайвандҳое, ки аллакай дар навбатанд, ду бор илова намешаванд (такрорҳо: ${count}).`,
  queueFull: (limit, rejected) =>
    `Дар навбат ҳадди аксар ${limit} пайванд ҷой мегирад — пайвандҳои зиёдатӣ илова нашуданд (${rejected}). Вақте навбат пеш равад, онҳоро фиристед.`,
  skipButton: "✖️ Боргирӣ накардан",
  skipped: "⏭ Ин пайванд гузаронида шуд.",
  chooseTimedOut: "⌛ Дар давоми 30 дақиқа сифат интихоб нашуд — ин пайвандро мегузаронам.",
  queueLostOnRestart: (count) =>
    `⚠️ Бот барои навсозӣ аз нав оғоз мешавад — навбат тоза шуд (пайвандҳо: ${count}). Лутфан, баъд аз як дақиқа онҳоро боз фиристед.`,
  subtitlesButton: "📝 Субтитрҳо",
  subtitlesBack: "⬅️ Бозгашт ба интихоби сифат",
  subtitlesAuto: "худкор",
  subtitlesChoose: "Забони субтитрҳоро интихоб кунед",
  subtitlesPreparing: "📝 Субтитрҳоро омода карда истодаам...",
  subtitlesFailed: "Субтитрҳоро бо ин забон боргирӣ кардан нашуд. Забони дигарро интихоб кунед.",
  subtitlesBusy: "YouTube ҳоло субтитрҳоро намедиҳад — баъд аз якчанд дақиқа боз кӯшиш кунед.",
  playlistFound: (title, count) =>
    `📃 Плейлист${title ? ` «${title.slice(0, 150)}»` : ""}: ${count} видео.\nОнҳоро як-як боргирӣ мекунам. Дар кадом формат?`,
  playlistStdButton: "🎬 720p",
  playlistHdButton: "🎬 Беҳтарин сифат",
  playlistAudioButton: "🎵 Фақат аудио (mp3)",
  playlistNoButton: "✖️ Не, ташаккур",
  playlistQueued: (count) =>
    `📃 Видеоҳои плейлист, ки ба навбат гузошта шуданд: ${count}. Онҳоро як-як мефиристам. Барои қатъ кардан тугмаи поёнро пахш кунед ё /stop фиристед.`,
  playlistFailed: "Плейлистро кушодан нашуд — шояд он пӯшида бошад. Пайванди як видеоро фиристед.",
  stopButton: "⏹ Қатъ кардан",
  stopped: (dropped) => `⏹ Қатъ шуд.${dropped ? ` Пайвандҳои аз навбат хориҷшуда: ${dropped}.` : ""}`,
  nothingToStop: "Ҳоло ҳеҷ чиз боргирӣ намешавад.",
  languageChoose: "🌐 Забони ботро интихоб кунед. «Худкор» — мувофиқи забони Telegram-и Шумо.",
  languageChooseGroup: "🌐 Забони ҷавобҳои бот дар ин гурӯҳ. «Худкор» — бо забони Telegram-и ҳар узв.",
  languageAuto: "Худкор — мисли Telegram",
  languageAutoGroup: "Худкор — забони худи ҳар кас",
  languageSaved: (name) => `✅ Забони бот: ${name}. Тағйир додан: /language.`,
  languageSavedAuto: "✅ Бот забони Telegram-и Шуморо истифода мебарад. Тағйир додан: /language.",
  settingsLanguageButton: (name) => `🌐 Забон: ${name ?? "худкор"}`,
  settingsBack: "⬅️ Бозгашт ба танзимот",
};

const ms: Messages = {
  start: "Hai! Hantar kepada saya pautan video daripada YouTube, TikTok, Instagram, Facebook, Twitter/X, Vimeo, VK, Rutube, OK.ru, Pinterest atau Threads — saya akan bantu anda memuat turunnya.\n\n✨ Tiada had kualiti: anda dapat apa sahaja yang ditawarkan oleh platform, sehingga 4K — asalkan fail tidak melebihi 2 GB, iaitu had Telegram untuk bot. Tiada ciri berbayar di sini.\n\nPercuma sepenuhnya: tanpa langganan, tanpa iklan, tanpa pembelian dalam aplikasi.\n\n🧩 Memuat turun di komputer? Pasang sambungan pelayar — butang “Muat turun” akan muncul terus pada halaman video: videoner.download/ms/extension\n\n👥 Tambah saya ke dalam kumpulan dan saya akan menghantar video bagi pautan yang dikongsi di sana.\n\n⚡ Langkau pilihan kualiti: tambah -audio selepas pautan untuk audio sahaja (mp3), atau -hd untuk kualiti terbaik.\n\n📣 Berita projek: @videonerdownload\n\n🌐 Bahasa bot: /language",
  notLink: "Itu tidak kelihatan seperti pautan. Hantar pautan video kepada saya.",
  inviteGreeting: "Hai! Saya Videoner — saya memuat turun video daripada YouTube, TikTok, Instagram dan platform lain secara percuma. Sedang menyediakan video yang dikongsi dengan anda 👇",
  inviteNotFound: "Saya tidak menemui video untuk pautan jemputan ini. Hantar pautan video kepada saya dan saya akan memuat turunnya.",
  inviteUnavailable: "Saya tidak dapat membuka video daripada pautan ini — perkhidmatan tidak bertindak balas buat masa ini. Buka pautan yang sama sekali lagi dalam seminit.",
  fetchingInfo: "🔍 Sedang mendapatkan maklumat video...",
  audioOnlyButton: "🎵 Audio sahaja (mp3)",
  photoButton: "📷 Muat turun foto",
  slideshowButton: "🎞 Tayangan slaid (video)",
  galleryButton: "📷+🎞 Foto dan tayangan slaid",
  chooseQuality: (title, duration) => `"${title}"${duration ? `\n⏱ ${duration}` : ""}\n\nPilih kualiti:`,
  sessionExpired: "Sesi telah tamat — hantar pautan sekali lagi",
  downloading: "⏬ Sedang memuat turun, ini mungkin mengambil masa beberapa minit...",
  downloadFailed: "muat turun gagal",
  downloadProgress: (percent, eta, done) =>
    `⏬ Sedang memuat turun: ${percent}%${eta ? ` · tinggal ${eta}` : ""}${done ? `\n${done}` : ""}`,
  downloadFinishing: "⚙️ Hampir siap — sedang menyusun fail...",
  converting: (percent) => `⚙️ Sedang menukar: ${percent}%`,
  etaUnderMinute: "kurang daripada seminit",
  etaMinutes: (minutes) => `~${minutes} min`,
  etaHours: (hours, minutes) => `~${hours} j${minutes ? ` ${minutes} min` : ""}`,
  downloadTimeout: "muat turun mengambil masa terlalu lama — video ini nampaknya sangat besar. Cuba kualiti yang lebih rendah.",
  downloadInterrupted: "⚠️ Bot sedang dimulakan semula untuk kemas kini — muat turun anda terganggu. Sila hantar pautan sekali lagi dalam seminit.",
  fileTooBig: (mb, url) =>
    `Fail ini ternyata besar (${mb} MB) — Telegram tidak membenarkan bot menghantarnya.\nMuat turun di sini: ${url}`,
  sendingFile: "📤 Sedang menghantar fail...",
  sendingAlbum: (count) => `📤 Hantaran ini mempunyai beberapa fail (${count}) — sedang menghantarnya sebagai album...`,
  failedPrefix: "❌ Gagal: ",
  fileCaption: (title, sourceUrl, shareUrl, description) =>
    composeCaption(
      title,
      description,
      `Sumber: ${sourceUrl}\n` +
        "Semua hak ke atas video ini milik penciptanya.\n" +
        "Dimuat turun secara percuma dengan @VideonerBot",
      `📣 Berita projek: ${NEWS_CHANNEL}`,
      shareUrl && `🔗 Kongsi: ${shareUrl}`,
    ),
  subscribeRequired: (channel) =>
    `Untuk memuat turun, sila langgan saluran kami ${channel} — itu sahaja syaratnya, perkhidmatan ini kekal percuma.\n\n` +
    "Langgan dan tekan “Saya sudah melanggan”.",
  openChannelButton: "📣 Buka saluran",
  checkSubscriptionButton: "Saya sudah melanggan",
  subscribeThanks: "Terima kasih! Sekarang hantar pautan video kepada saya.",
  subscribeThanksResuming: "Terima kasih! Saya sedang memproses pautan anda sekarang.",
  subscribeStillMissing: "Saya belum nampak langganan anda. Langgan dan tekan sekali lagi.",
  channelNotice: (channel) => `\n\nPautan ke hantaran ini akan muncul dalam ${channel} — tanpa nama, nama anda tidak dipaparkan.`,
  channelPost: (title, url) =>
    (title ? `🎬 ${title.slice(0, 200)}\n\n` : "") +
    `${url}\n\n` +
    "Muat turun video ini dan video lain secara percuma: @VideonerBot",
  errorStoryNeedsId:
    "hantar pautan ke story tertentu: bukanya dalam aplikasi Instagram dan ketik Share → Copy link.",
  errorInstagramStory:
    "Story Instagram hanya boleh dilihat oleh orang yang telah log masuk.",
  errorLoginRequired:
    "Hantaran ini tidak tersedia tanpa log masuk: platform hanya memaparkannya kepada " +
    "pengguna yang telah log masuk. Ini berlaku pada hantaran peribadi, kandungan dengan had umur dan " +
    "hantaran yang dikongsi dengan khalayak terhad.\n\n" +
    "Hantaran awam boleh dimuat turun tanpa masalah — cuba pautan lain.",
  errorUnsupportedPlatform:
    "Pautan itu tidak dapat dikenali — pastikan ia pautan video terus daripada YouTube, TikTok, Instagram, Facebook, Twitter/X, Vimeo, VK, Rutube, OK.ru, Pinterest atau Threads.",
  errorFileTooLarge: "fail ini lebih besar daripada 2 GB — Telegram tidak membenarkan bot menghantar fail yang lebih besar. Muat turunnya di laman web atau dengan sambungan pelayar — butang di bawah. Atau hantar pautan sekali lagi dan pilih kualiti yang lebih rendah.",
  siteButton: "🌐 Muat turun di laman web",
  qualitiesHiddenBySize: (limit) =>
    `\n\n⚖️ Kualiti yang lebih besar daripada ${limit} disembunyikan: Telegram tidak membenarkan bot menghantar fail yang lebih besar. Anda boleh memuat turunnya di laman web atau dengan sambungan pelayar — butang di bawah.`,
  videoTooBigForTelegram: (smallest) =>
    `\n\n⚖️ Video ini terlalu besar untuk Telegram walaupun dalam kualiti paling rendah (~${smallest}): Telegram tidak membenarkan bot menghantar fail melebihi 2 GB. Di sini anda boleh mendapatkan audio sahaja; videonya — di laman web atau dengan sambungan pelayar (butang di bawah).`,
  errorFormatUnavailable: "Kualiti itu tidak tersedia untuk video ini. Hantar pautan sekali lagi — saya akan tunjukkan senarai terkini.",
  errorNoVideoContent: "Pautan ini tiada video untuk dimuat turun — hantaran ini nampaknya hanya mengandungi foto.",
  errorRegionBlocked:
    "Video ini disekat di luar negara pencipta — platform tidak akan memberikannya " +
    "kepada pelayan kami. Tiada cara untuk mengelaknya: sekatan itu dari pihak mereka." +
    "\n\nPautan lain dimuat turun seperti biasa.",
  errorRateLimited: "Terlalu banyak pautan berturut-turut — tunggu sebentar dan hantar sekali lagi.",
  errorYoutubeDailyLimit: (gb) => `anda telah memuat turun lebih daripada ${gb} GB dari YouTube dalam 24 jam yang lalu — itu had harian bot bagi setiap orang. Had ini dikira untuk 24 jam yang lalu, jadi anda boleh memuat turun video YouTube baharu sedikit masa lagi. Platform lain berfungsi seperti biasa.`,
  playlistStoppedByLimit: (dropped) => `⏹ Senarai main dihentikan: had harian YouTube telah dicapai. Video yang tidak dimuat turun: ${dropped}. Hantar pautan senarai main sekali lagi kemudian.`,
  errorPlatformRefused:
    "platform tidak memberikan video ini kepada pelayan kami. Ini berlaku pada hantaran peribadi " +
    "atau hantaran dengan had umur, dan kadangkala platform hanya mengehadkan akses untuk " +
    "seketika. Cuba lagi dalam beberapa minit.",
  errorThreadsNoMedia:
    "tiada video atau foto kelihatan dalam hantaran Threads ini. Sama ada ia hantaran teks sahaja, atau " +
    "Threads hanya memaparkan medianya kepada pengguna yang telah log masuk — hantaran sebegini tidak boleh dimuat turun tanpa log masuk.",
  extensionHint:
    "\n\n💻 Anda boleh memuat turunnya dengan sambungan pelayar Videoner di komputer: " +
    "ia memuat turun menggunakan log masuk anda sendiri di platform, dan tiada kata laluan atau kuki yang keluar dari pelayar anda.",
  privateConnectHint: (platform, withExtension) =>
    `\n\n🔑 Untuk memuat turun hantaran seperti ini, sambungkan akaun ${platform} anda ke bot — sekali sahaja. Selepas itu bot akan memuat turun apa sahaja yang anda boleh lihat: hantaran peribadi, reels dan story, termasuk dari telefon anda. Butang di bawah menunjukkan caranya.${withExtension ? "\n\n💻 Atau muat turunnya dengan sambungan pelayar Videoner di komputer." : ""}`,
  privateReconnectHint: (platform, withExtension) =>
    `\n\n⚠️ Akaun ${platform} anda yang disambungkan tidak dapat membuka hantaran ini. Log masuk mungkin sudah tidak berfungsi — sambungkan akaun itu sekali lagi. Atau akaun ini tiada akses ke hantaran tersebut.${withExtension ? "\n\n💻 Anda juga boleh memuat turunnya dengan sambungan pelayar Videoner di komputer." : ""}`,
  connectAccountButton: "🔑 Sambungkan akaun",
  reconnectAccountButton: "🔑 Sambungkan semula",
  extensionButton: "🧩 Muat turun dengan sambungan",
  extensionCommand:
    "🧩 Videoner untuk pelayar anda: butang “Muat turun” terus pada halaman video — YouTube, Instagram, TikTok, VK, video peribadi daripada akaun anda dan pelajaran GetCourse.\n\nUntuk Chrome, Edge, Opera, Yandex Browser dan Firefox di komputer.",
  extensionPageButton: "🧩 Pasang sambungan",
  addToGroupButton: "👥 Tambah ke kumpulan",
  newsButton: "📣 Berita projek",
  fileCaptionShort: (title, sourceUrl) =>
    withOptionalLines((title ? `🎬 ${title.slice(0, 200)}\n\n` : "") + sourceUrl, `📣 Berita projek: ${NEWS_CHANNEL}`, undefined),
  sentBy: (name) => `👤 ${name}`,
  groupSettings: (s, canDelete) =>
    "⚙️ Tetapan bot untuk kumpulan ini\n\n" +
    `🗑 Padam mesej yang mengandungi pautan: ${s.deleteLinks ? "ya" : "tidak"}\n` +
    "Sebaik sahaja video dihantar, mesej yang hanya mengandungi pautan akan dipadam — sembang hanya menyimpan video dengan nama orang yang berkongsi.\n" +
    (s.deleteLinks && !canDelete
      ? "⚠️ Saya tidak dapat memadam mesej buat masa ini: jadikan saya pentadbir dengan hak \"Delete messages\".\n"
      : "") +
    `\n✍️ Teks di bawah video: ${{ full: "penuh", short: "tajuk dan sumber", none: "tiada teks" }[s.caption] ?? s.caption}\n` +
    `\n🎞 Kualiti: ${s.quality === "max" ? "tertinggi yang diterima Telegram" : "standard (720p)"}\n` +
    `\n⏱ Video panjang: ${s.longVideos ? "sebarang panjang" : "hanya sehingga 15 minit"}\n` +
    `\n🔑 Siapa boleh menyambungkan akaun mereka (untuk story dan hantaran peribadi): ${s.cookiesBy === "all" ? "mana-mana ahli" : "pentadbir sahaja"}\n` +
    `\n🌐 Bahasa balasan: ${s.language ? langName(s.language) : "bahasa setiap ahli sendiri"}\n` +
    "\nHanya pentadbir kumpulan boleh menukar tetapan.",
  settingsDeleteButton: (on) => `🗑 Padam pautan: ${on ? "ya" : "tidak"}`,
  settingsCaptionButton: (style) => `✍️ Teks: ${{ full: "penuh", short: "ringkas", none: "tiada" }[style] ?? style}`,
  settingsQualityButton: (mode) => `🎞 Kualiti: ${mode === "max" ? "tertinggi" : "720p"}`,
  settingsLongButton: (on) => `⏱ Video panjang: ${on ? "ya" : "sehingga 15 min"}`,
  settingsDoneButton: "✅ Selesai",
  settingsAdminsOnly: "Hanya pentadbir kumpulan boleh menukar tetapan.",
  settingsGroupsOnly: "Tetapan adalah untuk kumpulan: tambah saya ke dalam kumpulan dan hantar /settings di sana.",
  settingsFailed: "Tidak dapat menyimpan tetapan, sila cuba lagi.",
  settingsCookiesButton: (by) => `🔑 Menyambungkan akaun: ${by === "all" ? "semua orang" : "pentadbir"}`,
  accountsIntro:
    "🔑 Akaun yang disambungkan\n\nBot boleh memuat turun apa yang hanya dapat dilihat oleh orang yang telah log masuk (story Instagram, hantaran peribadi) — menggunakan akaun anda. Log masuk berfungsi di tempat anda menyambungkannya: yang disambungkan dalam sembang peribadi digunakan untuk muat turun anda, termasuk pautan anda sendiri dalam kumpulan yang tiada akaun sendiri; yang disambungkan ke kumpulan digunakan untuk semua ahlinya.",
  accountsHowTo:
    "Cara menyambungkan:\n1. Paling mudah: sambungan Videoner di komputer — log masuk di laman platform, buka tetingkap timbul Videoner, tekan “🔑 Sambungkan akaun … anda ke bot” dan hantar kod itu kepada saya. Untuk kumpulan, hantar /connect KOD dalam kumpulan tersebut.\n2. Atau hantar kepada saya fail cookies.txt (kuki yang dieksport dari pelayar), atau tampal teksnya sebagai mesej.\n3. Dari telefon Android — dengan Firefox dan add-on Cookie-Editor: https://videoner.download/ms/blog/android-firefox",
  accountsWarning:
    "⚠️ Platform tidak suka muat turun automatik dan mungkin menyekat atau mengharamkan akaun. Lebih baik sambungkan akaun sampingan, bukan akaun utama anda. Kuki disimpan secara tersulit, hanya digunakan untuk muat turun, dan boleh dibuang dengan butang di bawah.",
  accountsNone: "Belum ada apa-apa yang disambungkan.",
  accountsGroupTitle: "🔑 Akaun yang disambungkan ke kumpulan ini",
  accountsGroupHowTo:
    "Untuk menyambungkan akaun bagi seluruh kumpulan: dapatkan kod dengan butang “🔑 Sambungkan akaun … anda ke bot” dalam sambungan Videoner dan hantar /connect KOD di sini. Jika anda menyambungkan akaun hanya dalam sembang peribadi anda, bot menggunakannya di sini untuk pautan anda sendiri. Sambungan anda: /accounts dalam sembang peribadi dengan @VideonerBot.",
  accountsLine: (platform, where, active) => `• ${platform} — ${where}${active ? "" : " (⚠️ log masuk tidak berfungsi)"}`,
  accountsGroupLine: (platform, owner, active) => `• ${platform} — ${owner}${active ? "" : " (⚠️ log masuk tidak berfungsi)"}`,
  accountsWhereHere: "sembang peribadi",
  accountsWhereGroup: (title) => `kumpulan "${title}"`,
  accountsDeleteButton: (platform, where) => `🗑 ${platform} · ${where}`,
  accountsDeleteAllButton: "🗑 Buang semua sambungan saya",
  accountsDeleted: "Dibuang.",
  accountsDeletedAll: (n) => `Sambungan dibuang: ${n}.`,
  accountsNotAllowed: "Hanya orang yang menyambungkannya atau pentadbir kumpulan boleh membuangnya.",
  connectUsage:
    "Hantar /connect KOD. Butang “🔑 Sambungkan akaun … anda ke bot” dalam sambungan Videoner di komputer memberikan anda kod tersebut. Sambungan anda: /accounts.",
  connectOnlyAdmins: "Hanya pentadbir boleh menyambungkan akaun ke kumpulan ini (lihat /settings).",
  connectDone: (platform, where) =>
    `✅ ${platform} disambungkan ${where}. Bot kini juga memuat turun apa yang hanya dapat dilihat oleh orang yang telah log masuk. Lihat atau buang: /accounts.\n\n⚠️ Platform mungkin menyekat akaun kerana muat turun automatik — lebih baik gunakan akaun sampingan.`,
  connectWhereGroup: "ke kumpulan ini",
  connectWhereHere: "untuk muat turun anda dalam sembang peribadi dan mod inline",
  connectCodeNotFound: "Kod tidak ditemui atau telah tamat tempoh (kod sah selama 10 minit). Dapatkan kod baharu dalam sambungan Videoner.",
  connectRejectedNoSession: "Kuki ini tiada log masuk. Log masuk di laman platform dan eksport kuki sekali lagi.",
  connectRejectedUnknown: "Tiada kuki daripada platform yang disokong ditemui: Instagram, Facebook, YouTube, X, VK, TikTok.",
  connectUnavailable: "Penyambungan akaun belum tersedia lagi.",
  connectFailed: "Tidak dapat menyambungkan, sila cuba lagi.",
  connectFileTooBig: "Fail terlalu besar — eksport kuki untuk laman yang diperlukan sahaja.",
  connectNotAnonymous: "Sambungkan akaun sebagai diri anda sendiri, bukan secara tanpa nama sebagai kumpulan: jika tidak, sambungan pentadbir akan bercampur aduk. Saya telah memusnahkan kod itu — dapatkan kod baharu.",
  connectCodeInGroup:
    "Kod sambungan yang disiarkan dalam sembang kumpulan boleh dilihat oleh orang lain — saya telah memusnahkannya dan membuang mesej itu. Dapatkan kod baharu dan hantar dengan /connect KOD: saya akan memadam mesej arahan itu serta-merta.",
  groupWelcome:
    "👋 Hai! Siarkan pautan video daripada TikTok, Instagram, YouTube, VK dan platform lain dalam sembang ini — saya akan membalas dengan video itu sendiri.\n\n" +
    "Saya memuat turun klip sehingga 15 minit secara automatik, tanpa perlu arahan, dan selain itu saya kekal senyap.\n\n⚙️ Pentadbir kumpulan boleh melaraskan saya dengan /settings: padam mesej pautan, gaya teks, kualiti, video panjang dan bahasa.\n\n⚡ Tambah -audio selepas pautan untuk mendapatkan bunyi, atau -hd untuk kualiti terbaik.\n\n📣 Berita projek: @videonerdownload",
  errorTooLong: "video ini terlalu panjang — kami belum dapat memuat turun video sepanjang itu.",
  errorUnknown: "tidak dapat memuat turun video ini. Cuba lagi sebentar nanti atau hantar pautan lain.",
  inlineHintButton: "Hantar pautan ke bot",
  inlineResultTitle: "⬇️ Muat turun video",
  inlineResultDescription: "Video akan disiarkan terus dalam sembang ini",
  inlinePlaceholder: "⏬ Sedang memuat turun, ini mungkin mengambil masa beberapa minit...",
  inlineOpenBot: "Buka bot",
  inlineOnlySingleVideo:
    "Mod ini menghantar satu video sahaja. Untuk hantaran berbilang fail atau foto, hantar pautan ke bot dalam sembang peribadi.",
  inlineSubscribeRequired: (channel: string) =>
    `Untuk memuat turun, langgan ${channel} dan cuba lagi.`,
  inlineRateLimited: "Terlalu banyak permintaan berturut-turut. Tunggu seminit dan cuba lagi.",
  queueRest: (count) => `\n\n📋 Pautan yang masih dalam baris gilir: ${count}. Saya akan tunjukkan satu demi satu selepas yang ini.`,
  queuedOne: (position) =>
    `📋 Pautan dimasukkan ke baris gilir, #${position}. Mari selesaikan yang semasa dahulu — kemudian saya akan tunjukkan pilihan kualiti untuknya.`,
  queuedMany: (added, waiting) =>
    `📋 Pautan ditambah ke baris gilir: ${added}. Jumlah yang menunggu: ${waiting}. Saya akan tunjukkan satu demi satu selepas yang semasa.`,
  queueDuplicates: (count) =>
    count === 1
      ? "Pautan ini sudah ada dalam baris gilir — tidak ditambah dua kali."
      : `Pautan yang sudah ada dalam baris gilir tidak ditambah dua kali (ulangan: ${count}).`,
  queueFull: (limit, rejected) =>
    `Baris gilir memuatkan paling banyak ${limit} pautan — pautan selebihnya tidak ditambah (${rejected}). Hantar semula apabila baris gilir sudah bergerak.`,
  skipButton: "✖️ Jangan muat turun",
  skipped: "⏭ Pautan ini dilangkau.",
  chooseTimedOut: "⌛ Tiada kualiti dipilih dalam masa 30 minit — pautan ini dilangkau.",
  queueLostOnRestart: (count) =>
    `⚠️ Bot sedang dimulakan semula untuk kemas kini — baris gilir telah ditetapkan semula (pautan: ${count}). Sila hantar semula dalam seminit.`,
  subtitlesButton: "📝 Sari kata",
  subtitlesBack: "⬅️ Kembali ke kualiti",
  subtitlesAuto: "auto",
  subtitlesChoose: "Pilih bahasa sari kata",
  subtitlesPreparing: "📝 Sedang menyediakan sari kata...",
  subtitlesFailed: "Tidak dapat memuat turun sari kata dalam bahasa ini. Cuba bahasa lain.",
  subtitlesBusy: "YouTube tidak memberikan sari kata buat masa ini — cuba lagi dalam beberapa minit.",
  playlistFound: (title, count) =>
    `📃 Senarai main${title ? ` "${title.slice(0, 150)}"` : ""}: ${count} video.\nSaya akan memuat turunnya satu demi satu. Format mana?`,
  playlistStdButton: "🎬 720p",
  playlistHdButton: "🎬 Kualiti terbaik",
  playlistAudioButton: "🎵 Audio sahaja (mp3)",
  playlistNoButton: "✖️ Tidak, terima kasih",
  playlistQueued: (count) =>
    `📃 Video daripada senarai main dimasukkan ke baris gilir: ${count}. Saya akan menghantarnya satu demi satu. Hentikan dengan butang di bawah atau /stop.`,
  playlistFailed: "Tidak dapat membuka senarai main — ia mungkin peribadi. Hantar pautan ke satu video.",
  stopButton: "⏹ Hentikan",
  stopped: (dropped) => `⏹ Dihentikan.${dropped ? ` Pautan dibuang daripada baris gilir: ${dropped}.` : ""}`,
  nothingToStop: "Tiada apa-apa yang sedang dimuat turun sekarang.",
  languageChoose: "🌐 Pilih bahasa bot. \"Auto\" mengikut Telegram anda.",
  languageChooseGroup: "🌐 Bahasa balasan bot dalam kumpulan ini. \"Auto\" — bahasa Telegram setiap ahli.",
  languageAuto: "Auto — seperti dalam Telegram",
  languageAutoGroup: "Auto — bahasa setiap ahli sendiri",
  languageSaved: (name) => `✅ Bahasa bot: ${name}. Tukar dengan /language.`,
  languageSavedAuto: "✅ Bot mengikut bahasa Telegram anda. Tukar dengan /language.",
  settingsLanguageButton: (name) => `🌐 Bahasa: ${name ?? "auto"}`,
  settingsBack: "⬅️ Kembali ke tetapan",
};

const nl: Messages = {
  start: "Hoi! Stuur me een link naar een video van YouTube, TikTok, Instagram, Facebook, Twitter/X, Vimeo, VK, Rutube, OK.ru, Pinterest of Threads — ik help je hem te downloaden.\n\n✨ Geen kwaliteitslimieten: je krijgt alles wat het platform aanbiedt, tot 4K — zolang het bestand binnen 2 GB past, de limiet van Telegram voor bots. Betaalde functies zijn er hier niet.\n\nHelemaal gratis: geen abonnementen, geen advertenties, geen in-app-aankopen.\n\n🧩 Download je op een computer? Installeer de browserextensie — er verschijnt een knop Downloaden direct op de videopagina: videoner.download/nl/extension\n\n👥 Voeg me toe aan een groep, dan plaats ik daar de video's bij de links die mensen delen.\n\n⚡ Sla de kwaliteitskeuze over: zet -audio achter de link voor alleen geluid (mp3), of -hd voor de beste kwaliteit.\n\n📣 Projectnieuws: @videonerdownload\n\n🌐 Taal van de bot: /language",
  notLink: "Dat lijkt geen link. Stuur me een videolink.",
  inviteGreeting: "Hoi! Ik ben Videoner — ik download gratis video's van YouTube, TikTok, Instagram en andere platforms. Ik zet de video klaar die iemand met je heeft gedeeld 👇",
  inviteNotFound: "Ik kon geen video vinden bij deze uitnodigingslink. Stuur me een videolink, dan download ik hem.",
  inviteUnavailable: "Ik kon de video via deze link niet openen — de dienst reageert op dit moment niet. Open dezelfde link over een minuut opnieuw.",
  fetchingInfo: "🔍 Video-informatie ophalen...",
  audioOnlyButton: "🎵 Alleen audio (mp3)",
  photoButton: "📷 Foto's downloaden",
  slideshowButton: "🎞 Diavoorstelling (video)",
  galleryButton: "📷+🎞 Foto's en diavoorstelling",
  chooseQuality: (title, duration) => `“${title}”${duration ? `\n⏱ ${duration}` : ""}\n\nKies de kwaliteit:`,
  sessionExpired: "Sessie verlopen — stuur de link opnieuw",
  downloading: "⏬ Bezig met downloaden, dit kan een paar minuten duren...",
  downloadFailed: "downloaden mislukt",
  downloadProgress: (percent, eta, done) =>
    `⏬ Bezig met downloaden: ${percent}%${eta ? ` · nog ${eta}` : ""}${done ? `\n${done}` : ""}`,
  downloadFinishing: "⚙️ Bijna klaar — het bestand wordt samengevoegd...",
  converting: (percent) => `⚙️ Converteren: ${percent}%`,
  etaUnderMinute: "minder dan een minuut",
  etaMinutes: (minutes) => `~${minutes} min`,
  etaHours: (hours, minutes) => `~${hours} u${minutes ? ` ${minutes} min` : ""}`,
  downloadTimeout: "het downloaden duurt te lang — de video lijkt erg zwaar. Probeer een lagere kwaliteit.",
  downloadInterrupted: "⚠️ De bot wordt opnieuw gestart voor een update — je download is onderbroken. Stuur de link over een minuut opnieuw.",
  fileTooBig: (mb, url) =>
    `Het bestand is groot geworden (${mb} MB) — Telegram laat de bot het niet versturen.\nDownload het hier: ${url}`,
  sendingFile: "📤 Bestand versturen...",
  sendingAlbum: (count) => `📤 Deze post bevat meerdere bestanden (${count}) — ik stuur ze als album...`,
  failedPrefix: "❌ Mislukt: ",
  fileCaption: (title, sourceUrl, shareUrl, description) =>
    composeCaption(
      title,
      description,
      `Bron: ${sourceUrl}\n` +
        "Alle rechten op de video liggen bij de maker.\n" +
        "Gratis gedownload met @VideonerBot",
      `📣 Projectnieuws: ${NEWS_CHANNEL}`,
      shareUrl && `🔗 Delen: ${shareUrl}`,
    ),
  subscribeRequired: (channel) =>
    `Abonneer je op ons kanaal ${channel} om te downloaden — dat is de enige voorwaarde, de dienst blijft gratis.\n\n` +
    "Abonneer je en tik op “Ik ben geabonneerd”.",
  openChannelButton: "📣 Kanaal openen",
  checkSubscriptionButton: "Ik ben geabonneerd",
  subscribeThanks: "Bedankt! Stuur me nu een link naar een video.",
  subscribeThanksResuming: "Bedankt! Ik ga nu verder met je link.",
  subscribeStillMissing: "Ik zie het abonnement nog niet. Abonneer je en tik nog een keer.",
  channelNotice: (channel) => `\n\nDe link naar deze post verschijnt in ${channel} — anoniem, zonder je naam.`,
  channelPost: (title, url) =>
    (title ? `🎬 ${title.slice(0, 200)}\n\n` : "") +
    `${url}\n\n` +
    "Download deze en elke andere video gratis: @VideonerBot",
  errorStoryNeedsId:
    "stuur een link naar een specifieke story: open hem in de Instagram-app en tik op Delen → Link kopiëren.",
  errorInstagramStory:
    "Instagram-story's zijn alleen zichtbaar voor mensen die zijn ingelogd.",
  errorLoginRequired:
    "Deze post is niet beschikbaar zonder in te loggen: het platform toont hem alleen aan " +
    "ingelogde gebruikers. Dat gebeurt bij privéposts, content met een leeftijdsgrens en " +
    "posts die met een beperkt publiek zijn gedeeld.\n\n" +
    "Openbare posts worden zonder problemen gedownload — probeer een andere link.",
  errorUnsupportedPlatform:
    "Ik herken deze link niet — controleer of het een directe videolink is van YouTube, TikTok, Instagram, Facebook, Twitter/X, Vimeo, VK, Rutube, OK.ru, Pinterest of Threads.",
  errorFileTooLarge: "het bestand is groter dan 2 GB — Telegram laat bots geen grotere bestanden versturen. Download het op de website of met de browserextensie — knoppen hieronder. Of stuur de link opnieuw en kies een lagere kwaliteit.",
  siteButton: "🌐 Downloaden op de website",
  qualitiesHiddenBySize: (limit) =>
    `\n\n⚖️ Kwaliteiten zwaarder dan ${limit} zijn verborgen: Telegram laat bots geen grotere bestanden versturen. Je kunt ze downloaden op de website of met de browserextensie — knoppen hieronder.`,
  videoTooBigForTelegram: (smallest) =>
    `\n\n⚖️ Deze video is zelfs in de laagste kwaliteit te zwaar voor Telegram (~${smallest}): Telegram laat bots geen bestanden groter dan 2 GB versturen. Hier kun je alleen de audio krijgen; de video — op de website of met de browserextensie (knoppen hieronder).`,
  errorFormatUnavailable: "Die kwaliteit is niet beschikbaar voor deze video. Stuur de link opnieuw — ik laat de actuele lijst zien.",
  errorNoVideoContent: "Deze link bevat geen video om te downloaden — de post lijkt alleen foto's te hebben.",
  errorRegionBlocked:
    "Deze video is geblokkeerd buiten het land van de maker — het platform geeft hem " +
    "niet aan onze server. Daar is niets aan te doen: de beperking ligt bij het platform." +
    "\n\nAndere links worden gewoon gedownload.",
  errorRateLimited: "Te veel links achter elkaar — wacht even en stuur hem opnieuw.",
  errorYoutubeDailyLimit: (gb) => `je hebt de afgelopen 24 uur meer dan ${gb} GB van YouTube gedownload — dat is de daglimiet van de bot per persoon. Er wordt gekeken naar de afgelopen 24 uur, dus je kunt iets later weer nieuwe YouTube-video's downloaden. Andere platforms werken gewoon.`,
  playlistStoppedByLimit: (dropped) => `⏹ Afspeellijst gestopt: de daglimiet voor YouTube is bereikt. Niet gedownloade video's: ${dropped}. Stuur de link naar de afspeellijst later opnieuw.`,
  errorPlatformRefused:
    "het platform heeft deze video niet aan onze server gegeven. Dat gebeurt bij privéposts " +
    "of posts met een leeftijdsgrens, en soms beperkt het platform de toegang gewoon " +
    "tijdelijk. Probeer het over een paar minuten opnieuw.",
  errorThreadsNoMedia:
    "in deze Threads-post is geen video of foto te zien. Het is een post met alleen tekst, of " +
    "Threads toont de media alleen aan ingelogde gebruikers — zulke posts kunnen niet worden gedownload zonder in te loggen.",
  extensionHint:
    "\n\n💻 Je kunt hem downloaden met de browserextensie van Videoner op een computer: " +
    "die downloadt met je eigen login op het platform, en er verlaten geen wachtwoord of cookies je browser.",
  privateConnectHint: (platform, withExtension) =>
    `\n\n🔑 Om zulke posts te downloaden, koppel je je ${platform}-account aan de bot — één keer. Daarna downloadt de bot alles wat jij kunt zien: privéposts, reels en story's, ook vanaf je telefoon. De knop hieronder laat zien hoe.${withExtension ? "\n\n💻 Of download hem met de browserextensie van Videoner op een computer." : ""}`,
  privateReconnectHint: (platform, withExtension) =>
    `\n\n⚠️ Je gekoppelde ${platform}-account kon deze post niet openen. Misschien werkt de login niet meer — koppel het account opnieuw. Of dit account heeft geen toegang tot de post.${withExtension ? "\n\n💻 Je kunt hem ook downloaden met de browserextensie van Videoner op een computer." : ""}`,
  connectAccountButton: "🔑 Account koppelen",
  reconnectAccountButton: "🔑 Opnieuw koppelen",
  extensionButton: "🧩 Downloaden met de extensie",
  extensionCommand:
    "🧩 Videoner voor je browser: een knop Downloaden direct op de videopagina — YouTube, Instagram, TikTok, VK, privévideo's uit je account en lessen van GetCourse.\n\nVoor Chrome, Edge, Opera, Yandex Browser en Firefox op een computer.",
  extensionPageButton: "🧩 Extensie installeren",
  addToGroupButton: "👥 Toevoegen aan een groep",
  newsButton: "📣 Projectnieuws",
  fileCaptionShort: (title, sourceUrl) =>
    withOptionalLines((title ? `🎬 ${title.slice(0, 200)}\n\n` : "") + sourceUrl, `📣 Projectnieuws: ${NEWS_CHANNEL}`, undefined),
  sentBy: (name) => `👤 ${name}`,
  groupSettings: (s, canDelete) =>
    "⚙️ Instellingen van de bot voor deze groep\n\n" +
    `🗑 Bericht met de link verwijderen: ${s.deleteLinks ? "ja" : "nee"}\n` +
    "Zodra de video is verstuurd, wordt een bericht met alleen de link verwijderd — in de chat blijft alleen de video met de naam van wie hem deelde.\n" +
    (s.deleteLinks && !canDelete
      ? "⚠️ Ik kan nu geen berichten verwijderen: maak me beheerder met het recht “Berichten verwijderen”.\n"
      : "") +
    `\n✍️ Tekst onder de video: ${{ full: "volledig", short: "titel en bron", none: "geen tekst" }[s.caption] ?? s.caption}\n` +
    `\n🎞 Kwaliteit: ${s.quality === "max" ? "de hoogste die Telegram accepteert" : "standaard (720p)"}\n` +
    `\n⏱ Lange video's: ${s.longVideos ? "elke lengte" : "alleen tot 15 minuten"}\n` +
    `\n🔑 Wie eigen accounts mag koppelen (voor story's en privéposts): ${s.cookiesBy === "all" ? "elk lid" : "alleen beheerders"}\n` +
    `\n🌐 Antwoordtaal: ${s.language ? langName(s.language) : "die van elk lid zelf"}\n` +
    "\nAlleen beheerders van de groep kunnen de instellingen wijzigen.",
  settingsDeleteButton: (on) => `🗑 Links verwijderen: ${on ? "ja" : "nee"}`,
  settingsCaptionButton: (style) => `✍️ Tekst: ${{ full: "volledig", short: "kort", none: "geen" }[style] ?? style}`,
  settingsQualityButton: (mode) => `🎞 Kwaliteit: ${mode === "max" ? "hoogste" : "720p"}`,
  settingsLongButton: (on) => `⏱ Lange video's: ${on ? "ja" : "tot 15 min"}`,
  settingsDoneButton: "✅ Klaar",
  settingsAdminsOnly: "Alleen beheerders van de groep kunnen de instellingen wijzigen.",
  settingsGroupsOnly: "Instellingen zijn voor groepen: voeg me toe aan een groep en stuur daar /settings.",
  settingsFailed: "De instellingen konden niet worden opgeslagen, probeer het opnieuw.",
  settingsCookiesButton: (by) => `🔑 Accounts koppelen: ${by === "all" ? "iedereen" : "beheerders"}`,
  accountsIntro:
    "🔑 Gekoppelde accounts\n\nDe bot kan downloaden wat alleen ingelogde mensen zien (Instagram-story's, privéposts) — via jouw account. Een login werkt waar je hem hebt gekoppeld: een login in de privéchat geldt voor jouw downloads, ook voor je eigen links in groepen zonder eigen account; een login die aan een groep is gekoppeld, geldt voor alle leden.",
  accountsHowTo:
    "Zo koppel je een account:\n1. Het makkelijkst: de Videoner-extensie op een computer — log in op de website van het platform, open het venster van Videoner, klik op “🔑 Je …-account aan de bot koppelen” en stuur me de code. Voor een groep stuur je /connect CODE in die groep.\n2. Of stuur me een bestand cookies.txt (cookies geëxporteerd uit de browser), of plak de tekst ervan als bericht.\n3. Vanaf een Android-telefoon — met Firefox en de add-on Cookie-Editor: https://videoner.download/nl/blog/android-firefox",
  accountsWarning:
    "⚠️ Platforms houden niet van automatische downloads en kunnen het account beperken of blokkeren. Koppel liever een tweede account, niet je hoofdaccount. Cookies worden versleuteld opgeslagen, alleen voor downloads gebruikt en verwijderd met de knoppen hieronder.",
  accountsNone: "Er is nog niets gekoppeld.",
  accountsGroupTitle: "🔑 Accounts gekoppeld aan deze groep",
  accountsGroupHowTo:
    "Om er een voor de hele groep te koppelen: haal een code op met de knop “🔑 Je …-account aan de bot koppelen” in de Videoner-extensie en stuur hier /connect CODE. Als je een account alleen in je privéchat hebt gekoppeld, gebruikt de bot het hier voor je eigen links. Je koppelingen: /accounts in een privéchat met @VideonerBot.",
  accountsLine: (platform, where, active) => `• ${platform} — ${where}${active ? "" : " (⚠️ login werkt niet)"}`,
  accountsGroupLine: (platform, owner, active) => `• ${platform} — ${owner}${active ? "" : " (⚠️ login werkt niet)"}`,
  accountsWhereHere: "privéchat",
  accountsWhereGroup: (title) => `groep “${title}”`,
  accountsDeleteButton: (platform, where) => `🗑 ${platform} · ${where}`,
  accountsDeleteAllButton: "🗑 Al mijn koppelingen verwijderen",
  accountsDeleted: "Verwijderd.",
  accountsDeletedAll: (n) => `Koppelingen verwijderd: ${n}.`,
  accountsNotAllowed: "Alleen degene die het heeft gekoppeld of een beheerder van de groep kan het verwijderen.",
  connectUsage:
    "Stuur /connect CODE. De code krijg je met de knop “🔑 Je …-account aan de bot koppelen” in de Videoner-extensie op een computer. Je koppelingen: /accounts.",
  connectOnlyAdmins: "Alleen beheerders kunnen accounts aan deze groep koppelen (zie /settings).",
  connectDone: (platform, where) =>
    `✅ ${platform} gekoppeld ${where}. De bot downloadt nu ook wat alleen ingelogde mensen zien. Bekijken of verwijderen: /accounts.\n\n⚠️ Het platform kan het account beperken vanwege automatische downloads — gebruik liever een tweede account.`,
  connectWhereGroup: "aan deze groep",
  connectWhereHere: "voor je downloads in de privéchat en de inline-modus",
  connectCodeNotFound: "Code niet gevonden of verlopen (codes zijn 10 minuten geldig). Haal een nieuwe op in de Videoner-extensie.",
  connectRejectedNoSession: "Deze cookies bevatten geen login. Log in op de website van het platform en exporteer de cookies opnieuw.",
  connectRejectedUnknown: "Geen cookies van ondersteunde platforms gevonden: Instagram, Facebook, YouTube, X, VK, TikTok.",
  connectUnavailable: "Accounts koppelen is nog niet beschikbaar.",
  connectFailed: "Koppelen mislukt, probeer het opnieuw.",
  connectFileTooBig: "Het bestand is te groot — exporteer alleen de cookies van de benodigde website.",
  connectNotAnonymous: "Koppel het account als jezelf, niet anoniem namens de groep: anders raken de koppelingen van beheerders door elkaar. Ik heb de code ongeldig gemaakt — haal een nieuwe op.",
  connectCodeInGroup:
    "Een koppelcode die in de groepschat is geplaatst, kunnen anderen zien — ik heb hem ongeldig gemaakt en het bericht verwijderd. Haal een nieuwe op en stuur die met /connect CODE: dat bericht met de opdracht verwijder ik meteen.",
  groupWelcome:
    "👋 Hoi! Plaats in deze chat links naar video's van TikTok, Instagram, YouTube, VK en andere platforms — ik antwoord met de video zelf.\n\n" +
    "Clips tot 15 minuten download ik vanzelf, zonder opdrachten, en verder houd ik me stil.\n\n⚙️ Beheerders van de groep kunnen me instellen met /settings: berichten met links verwijderen, tekst onder de video, kwaliteit, lange video's en taal.\n\n⚡ Zet -audio achter een link voor het geluid, of -hd voor de beste kwaliteit.\n\n📣 Projectnieuws: @videonerdownload",
  errorTooLong: "de video is te lang — zulke lange video's kunnen we nog niet downloaden.",
  errorUnknown: "deze video kon niet worden gedownload. Probeer het iets later opnieuw of stuur een andere link.",
  inlineHintButton: "Stuur een link naar de bot",
  inlineResultTitle: "⬇️ Video downloaden",
  inlineResultDescription: "De video wordt direct in deze chat geplaatst",
  inlinePlaceholder: "⏬ Bezig met downloaden, dit kan een paar minuten duren...",
  inlineOpenBot: "Bot openen",
  inlineOnlySingleVideo:
    "Deze modus verstuurt één video. Voor posts met meerdere bestanden of foto's stuur je de link in een privéchat naar de bot.",
  inlineSubscribeRequired: (channel: string) =>
    `Abonneer je op ${channel} om te downloaden en probeer het opnieuw.`,
  inlineRateLimited: "Te veel verzoeken achter elkaar. Wacht een minuut en probeer het opnieuw.",
  queueRest: (count) => `\n\n📋 Links nog in de wachtrij: ${count}. Na deze laat ik ze een voor een zien.`,
  queuedOne: (position) =>
    `📋 Link in de wachtrij gezet, nr. ${position}. Eerst maken we de huidige af — daarna laat ik de kwaliteitskeuze ervoor zien.`,
  queuedMany: (added, waiting) =>
    `📋 Links toegevoegd aan de wachtrij: ${added}. In totaal wachtend: ${waiting}. Na de huidige laat ik ze een voor een zien.`,
  queueDuplicates: (count) =>
    count === 1
      ? "Deze link staat al in de wachtrij — ik voeg hem niet twee keer toe."
      : `Links die al in de wachtrij staan, worden niet twee keer toegevoegd (herhalingen: ${count}).`,
  queueFull: (limit, rejected) =>
    `De wachtrij bevat maximaal ${limit} links — de rest is niet toegevoegd (${rejected}). Stuur ze zodra de wachtrij is opgeschoten.`,
  skipButton: "✖️ Niet downloaden",
  skipped: "⏭ Deze link overgeslagen.",
  chooseTimedOut: "⌛ Binnen 30 minuten geen kwaliteit gekozen — ik sla deze link over.",
  queueLostOnRestart: (count) =>
    `⚠️ De bot wordt opnieuw gestart voor een update — de wachtrij is gewist (links: ${count}). Stuur ze over een minuut opnieuw.`,
  subtitlesButton: "📝 Ondertiteling",
  subtitlesBack: "⬅️ Terug naar kwaliteit",
  subtitlesAuto: "automatisch",
  subtitlesChoose: "Kies de taal van de ondertiteling",
  subtitlesPreparing: "📝 Ondertiteling voorbereiden...",
  subtitlesFailed: "Kon de ondertiteling in deze taal niet downloaden. Probeer een andere taal.",
  subtitlesBusy: "YouTube levert op dit moment geen ondertiteling — probeer het over een paar minuten opnieuw.",
  playlistFound: (title, count) =>
    `📃 Afspeellijst${title ? ` “${title.slice(0, 150)}”` : ""}: ${count} video's.\nIk download ze een voor een. Welk formaat?`,
  playlistStdButton: "🎬 720p",
  playlistHdButton: "🎬 Beste kwaliteit",
  playlistAudioButton: "🎵 Alleen audio (mp3)",
  playlistNoButton: "✖️ Nee, bedankt",
  playlistQueued: (count) =>
    `📃 Video's uit de afspeellijst in de wachtrij: ${count}. Ik stuur ze een voor een. Stoppen met de knop hieronder of /stop.`,
  playlistFailed: "Kon de afspeellijst niet openen — misschien is hij privé. Stuur een link naar één video.",
  stopButton: "⏹ Stoppen",
  stopped: (dropped) => `⏹ Gestopt.${dropped ? ` Links verwijderd uit de wachtrij: ${dropped}.` : ""}`,
  nothingToStop: "Er wordt op dit moment niets gedownload.",
  languageChoose: "🌐 Kies de taal van de bot. “Automatisch” volgt je Telegram.",
  languageChooseGroup: "🌐 De antwoordtaal van de bot in deze groep. “Automatisch” — de Telegram-taal van elk lid.",
  languageAuto: "Automatisch — zoals in Telegram",
  languageAutoGroup: "Automatisch — die van elk lid zelf",
  languageSaved: (name) => `✅ Taal van de bot: ${name}. Wijzigen met /language.`,
  languageSavedAuto: "✅ De bot volgt je Telegram-taal. Wijzigen met /language.",
  settingsLanguageButton: (name) => `🌐 Taal: ${name ?? "automatisch"}`,
  settingsBack: "⬅️ Terug naar instellingen",
};

const ro: Messages = {
  start: "Salut! Trimite-mi linkul unui videoclip de pe YouTube, TikTok, Instagram, Facebook, Twitter/X, Vimeo, VK, Rutube, OK.ru, Pinterest sau Threads — te ajut să-l descarci.\n\n✨ Fără limite de calitate: primești tot ce oferă platforma, până la 4K — atâta timp cât fișierul încape în 2 GB, limita Telegram pentru boți. Aici nu există funcții plătite.\n\nComplet gratuit: fără abonamente, fără reclame, fără achiziții în aplicație.\n\n🧩 Descarci pe calculator? Instalează extensia de browser — un buton Descarcă apare chiar pe pagina videoclipului: videoner.download/ro/extension\n\n👥 Adaugă-mă într-un grup și voi posta videoclipurile pentru linkurile pe care le trimit oamenii acolo.\n\n⚡ Sari peste alegerea calității: adaugă -audio după link pentru doar sunet (mp3) sau -hd pentru cea mai bună calitate.\n\n📣 Noutățile proiectului: @videonerdownload\n\n🌐 Limba botului: /language",
  notLink: "Asta nu pare a fi un link. Trimite-mi linkul unui videoclip.",
  inviteGreeting: "Salut! Sunt Videoner — descarc gratuit videoclipuri de pe YouTube, TikTok, Instagram și alte platforme. Pregătesc videoclipul pe care ți l-a trimis cineva 👇",
  inviteNotFound: "Nu am găsit niciun videoclip pentru acest link de invitație. Trimite-mi linkul unui videoclip și îl descarc.",
  inviteUnavailable: "Nu am putut deschide videoclipul din acest link — serviciul nu răspunde acum. Deschide din nou același link peste un minut.",
  fetchingInfo: "🔍 Obțin informațiile despre videoclip...",
  audioOnlyButton: "🎵 Doar audio (mp3)",
  photoButton: "📷 Descarcă fotografiile",
  slideshowButton: "🎞 Prezentare foto (videoclip)",
  galleryButton: "📷+🎞 Fotografii și prezentare foto",
  chooseQuality: (title, duration) => `„${title}”${duration ? `\n⏱ ${duration}` : ""}\n\nAlege calitatea:`,
  sessionExpired: "Sesiunea a expirat — trimite din nou linkul",
  downloading: "⏬ Se descarcă, poate dura câteva minute...",
  downloadFailed: "descărcarea a eșuat",
  downloadProgress: (percent, eta, done) =>
    `⏬ Se descarcă: ${percent}%${eta ? ` · mai rămân ${eta}` : ""}${done ? `\n${done}` : ""}`,
  downloadFinishing: "⚙️ Aproape gata — asamblez fișierul...",
  converting: (percent) => `⚙️ Conversie: ${percent}%`,
  etaUnderMinute: "sub un minut",
  etaMinutes: (minutes) => `~${minutes} min`,
  etaHours: (hours, minutes) => `~${hours} h${minutes ? ` ${minutes} min` : ""}`,
  downloadTimeout: "descărcarea durează prea mult — videoclipul pare foarte mare. Încearcă o calitate mai mică.",
  downloadInterrupted: "⚠️ Botul repornește pentru o actualizare — descărcarea ta a fost întreruptă. Trimite din nou linkul peste un minut.",
  fileTooBig: (mb, url) =>
    `Fișierul a ieșit mare (${mb} MB) — Telegram nu permite botului să-l trimită.\nDescarcă-l aici: ${url}`,
  sendingFile: "📤 Trimit fișierul...",
  sendingAlbum: (count) => `📤 Această postare are mai multe fișiere (${count}) — le trimit ca album...`,
  failedPrefix: "❌ Eroare: ",
  fileCaption: (title, sourceUrl, shareUrl, description) =>
    composeCaption(
      title,
      description,
      `Sursa: ${sourceUrl}\n` +
        "Toate drepturile asupra videoclipului aparțin autorului său.\n" +
        "Descărcat gratuit cu @VideonerBot",
      `📣 Noutățile proiectului: ${NEWS_CHANNEL}`,
      shareUrl && `🔗 Distribuie: ${shareUrl}`,
    ),
  subscribeRequired: (channel) =>
    `Ca să descarci, abonează-te la canalul nostru ${channel} — este singura condiție, serviciul rămâne gratuit.\n\n` +
    "Abonează-te și apasă „M-am abonat”.",
  openChannelButton: "📣 Deschide canalul",
  checkSubscriptionButton: "M-am abonat",
  subscribeThanks: "Mulțumesc! Acum trimite-mi linkul unui videoclip.",
  subscribeThanksResuming: "Mulțumesc! Mă ocup acum de linkul tău.",
  subscribeStillMissing: "Încă nu văd abonamentul. Abonează-te și apasă din nou.",
  channelNotice: (channel) => `\n\nLinkul către această postare va apărea în ${channel} — anonim, fără numele tău.`,
  channelPost: (title, url) =>
    (title ? `🎬 ${title.slice(0, 200)}\n\n` : "") +
    `${url}\n\n` +
    "Descarcă gratuit acest videoclip și oricare altul: @VideonerBot",
  errorStoryNeedsId:
    "trimite linkul unei anumite povești: deschide-o în aplicația Instagram și atinge Distribuie → Copiază linkul.",
  errorInstagramStory:
    "Poveștile Instagram sunt vizibile doar pentru cei conectați.",
  errorLoginRequired:
    "Această postare nu este disponibilă fără autentificare: platforma o oferă doar " +
    "utilizatorilor conectați. Asta se întâmplă cu postările private, conținutul cu restricție de vârstă și " +
    "postările distribuite unui public restrâns.\n\n" +
    "Postările publice se descarcă fără probleme — încearcă alt link.",
  errorUnsupportedPlatform:
    "Nu am putut recunoaște acest link — asigură-te că este un link direct către un videoclip de pe YouTube, TikTok, Instagram, Facebook, Twitter/X, Vimeo, VK, Rutube, OK.ru, Pinterest sau Threads.",
  errorFileTooLarge: "fișierul depășește 2 GB — Telegram nu permite boților să trimită fișiere mai mari. Descarcă-l pe site sau cu extensia de browser — butoanele de mai jos. Sau trimite din nou linkul și alege o calitate mai mică.",
  siteButton: "🌐 Descarcă pe site",
  qualitiesHiddenBySize: (limit) =>
    `\n\n⚖️ Calitățile mai mari de ${limit} sunt ascunse: Telegram nu permite boților să trimită fișiere mai mari. Le poți descărca pe site sau cu extensia de browser — butoanele de mai jos.`,
  videoTooBigForTelegram: (smallest) =>
    `\n\n⚖️ Acest videoclip este prea mare pentru Telegram chiar și la cea mai mică calitate (~${smallest}): Telegram nu permite boților să trimită fișiere de peste 2 GB. Aici poți primi doar sunetul; videoclipul — pe site sau cu extensia de browser (butoanele de mai jos).`,
  errorFormatUnavailable: "Această calitate nu este disponibilă pentru acest videoclip. Trimite din nou linkul — îți arăt lista actuală.",
  errorNoVideoContent: "La acest link nu există niciun videoclip de descărcat — postarea pare să conțină doar fotografii.",
  errorRegionBlocked:
    "Acest videoclip este blocat în afara țării autorului — platforma nu îl oferă " +
    "serverului nostru. Nu există nicio cale de ocolire: restricția este de partea lor." +
    "\n\nCelelalte linkuri se descarcă normal.",
  errorRateLimited: "Prea multe linkuri la rând — așteaptă puțin și trimite din nou.",
  errorYoutubeDailyLimit: (gb) => `ai descărcat peste ${gb} GB de pe YouTube în ultimele 24 de ore — aceasta este limita zilnică a botului per persoană. Se socotesc ultimele 24 de ore, așa că vei putea descărca videoclipuri noi de pe YouTube puțin mai târziu. Celelalte platforme funcționează normal.`,
  playlistStoppedByLimit: (dropped) => `⏹ Playlist oprit: s-a atins limita zilnică pentru YouTube. Videoclipuri nedescărcate: ${dropped}. Trimite din nou linkul playlistului mai târziu.`,
  errorPlatformRefused:
    "platforma nu a oferit acest videoclip serverului nostru. Asta se întâmplă cu postările private " +
    "sau cu restricție de vârstă, iar uneori platforma pur și simplu limitează accesul pentru " +
    "o vreme. Încearcă din nou peste câteva minute.",
  errorThreadsNoMedia:
    "în această postare Threads nu se vede niciun videoclip sau fotografie. Fie este o postare doar cu text, fie " +
    "Threads își arată conținutul media doar utilizatorilor conectați — astfel de postări nu pot fi descărcate fără autentificare.",
  extensionHint:
    "\n\n💻 Îl poți descărca pe calculator cu extensia de browser Videoner: " +
    "descarcă folosind propria ta autentificare pe platformă, iar nicio parolă sau cookie nu părăsește browserul tău.",
  privateConnectHint: (platform, withExtension) =>
    `\n\n🔑 Ca să descarci astfel de postări, conectează-ți contul ${platform} la bot — o singură dată. După aceea botul descarcă tot ce poți vedea tu: postări private, reels și povești, inclusiv de pe telefon. Butonul de mai jos îți arată cum.${withExtension ? "\n\n💻 Sau descarcă-l pe calculator cu extensia de browser Videoner." : ""}`,
  privateReconnectHint: (platform, withExtension) =>
    `\n\n⚠️ Contul tău ${platform} conectat nu a putut deschide această postare. Probabil autentificarea nu mai funcționează — conectează din nou contul. Sau acest cont nu are acces la postare.${withExtension ? "\n\n💻 O poți descărca și pe calculator cu extensia de browser Videoner." : ""}`,
  connectAccountButton: "🔑 Conectează contul",
  reconnectAccountButton: "🔑 Reconectează",
  extensionButton: "🧩 Descarcă cu extensia",
  extensionCommand:
    "🧩 Videoner pentru browserul tău: un buton Descarcă chiar pe pagina videoclipului — YouTube, Instagram, TikTok, VK, videoclipuri private din contul tău și lecții GetCourse.\n\nPentru Chrome, Edge, Opera, Yandex Browser și Firefox pe calculator.",
  extensionPageButton: "🧩 Instalează extensia",
  addToGroupButton: "👥 Adaugă într-un grup",
  newsButton: "📣 Noutățile proiectului",
  fileCaptionShort: (title, sourceUrl) =>
    withOptionalLines((title ? `🎬 ${title.slice(0, 200)}\n\n` : "") + sourceUrl, `📣 Noutățile proiectului: ${NEWS_CHANNEL}`, undefined),
  sentBy: (name) => `👤 ${name}`,
  groupSettings: (s, canDelete) =>
    "⚙️ Setările botului pentru acest grup\n\n" +
    `🗑 Șterge mesajul cu linkul: ${s.deleteLinks ? "da" : "nu"}\n` +
    "După ce videoclipul este trimis, mesajul care conținea doar linkul este șters — în chat rămâne doar videoclipul cu numele celui care l-a trimis.\n" +
    (s.deleteLinks && !canDelete
      ? "⚠️ Momentan nu pot șterge mesaje: fă-mă administrator cu dreptul „Ștergere mesaje”.\n"
      : "") +
    `\n✍️ Textul de sub videoclip: ${{ full: "complet", short: "titlul și sursa", none: "fără text" }[s.caption] ?? s.caption}\n` +
    `\n🎞 Calitate: ${s.quality === "max" ? "cea mai mare acceptată de Telegram" : "standard (720p)"}\n` +
    `\n⏱ Videoclipuri lungi: ${s.longVideos ? "de orice durată" : "doar până la 15 minute"}\n` +
    `\n🔑 Cine își poate conecta conturile (pentru povești și postări private): ${s.cookiesBy === "all" ? "orice membru" : "doar administratorii"}\n` +
    `\n🌐 Limba răspunsurilor: ${s.language ? langName(s.language) : "a fiecărui membru"}\n` +
    "\nDoar administratorii grupului pot modifica setările.",
  settingsDeleteButton: (on) => `🗑 Șterge linkurile: ${on ? "da" : "nu"}`,
  settingsCaptionButton: (style) => `✍️ Text: ${{ full: "complet", short: "scurt", none: "fără" }[style] ?? style}`,
  settingsQualityButton: (mode) => `🎞 Calitate: ${mode === "max" ? "maximă" : "720p"}`,
  settingsLongButton: (on) => `⏱ Videoclipuri lungi: ${on ? "da" : "până la 15 min"}`,
  settingsDoneButton: "✅ Gata",
  settingsAdminsOnly: "Doar administratorii grupului pot modifica setările.",
  settingsGroupsOnly: "Setările sunt pentru grupuri: adaugă-mă într-un grup și trimite /settings acolo.",
  settingsFailed: "Nu am putut salva setările, încearcă din nou.",
  settingsCookiesButton: (by) => `🔑 Conectarea conturilor: ${by === "all" ? "toți" : "administratorii"}`,
  accountsIntro:
    "🔑 Conturi conectate\n\nBotul poate descărca ceea ce văd doar cei conectați (povești Instagram, postări private) — folosind contul tău. O autentificare funcționează acolo unde ai conectat-o: cea din chatul privat servește descărcările tale, inclusiv linkurile tale din grupurile care nu au un cont propriu; cea conectată la un grup servește toți membrii lui.",
  accountsHowTo:
    "Cum conectezi un cont:\n1. Cel mai simplu: extensia Videoner pe calculator — conectează-te pe site-ul platformei, deschide fereastra Videoner, apasă „🔑 Conectează-ți contul … la bot” și trimite-mi codul. Pentru un grup, trimite /connect COD în acel grup.\n2. Sau trimite-mi un fișier cookies.txt (cookie-uri exportate din browser) ori lipește textul lui într-un mesaj.\n3. De pe un telefon Android — cu Firefox și suplimentul Cookie-Editor: https://videoner.download/ro/blog/android-firefox",
  accountsWarning:
    "⚠️ Platformele nu agreează descărcările automate și pot restricționa sau bloca contul. E mai bine să conectezi un cont secundar, nu pe cel principal. Cookie-urile sunt stocate criptat, folosite doar pentru descărcări și se șterg cu butoanele de mai jos.",
  accountsNone: "Încă nu este nimic conectat.",
  accountsGroupTitle: "🔑 Conturi conectate la acest grup",
  accountsGroupHowTo:
    "Ca să conectezi unul pentru tot grupul: obține un cod cu butonul „🔑 Conectează-ți contul … la bot” din extensia Videoner și trimite aici /connect COD. Dacă ai conectat un cont doar în chatul tău privat, botul îl folosește aici pentru linkurile tale. Conexiunile tale: /accounts într-un chat privat cu @VideonerBot.",
  accountsLine: (platform, where, active) => `• ${platform} — ${where}${active ? "" : " (⚠️ autentificarea nu funcționează)"}`,
  accountsGroupLine: (platform, owner, active) => `• ${platform} — ${owner}${active ? "" : " (⚠️ autentificarea nu funcționează)"}`,
  accountsWhereHere: "chat privat",
  accountsWhereGroup: (title) => `grupul „${title}”`,
  accountsDeleteButton: (platform, where) => `🗑 ${platform} · ${where}`,
  accountsDeleteAllButton: "🗑 Șterge toate conexiunile mele",
  accountsDeleted: "Șters.",
  accountsDeletedAll: (n) => `Conexiuni șterse: ${n}.`,
  accountsNotAllowed: "Doar persoana care a conectat contul sau un administrator al grupului îl poate șterge.",
  connectUsage:
    "Trimite /connect COD. Codul îl primești cu butonul „🔑 Conectează-ți contul … la bot” din extensia Videoner pe calculator. Conexiunile tale: /accounts.",
  connectOnlyAdmins: "Doar administratorii pot conecta conturi la acest grup (vezi /settings).",
  connectDone: (platform, where) =>
    `✅ ${platform} conectat ${where}. Acum botul descarcă și ceea ce văd doar cei conectați. Vezi sau șterge: /accounts.\n\n⚠️ Platforma poate restricționa contul pentru descărcări automate — e mai bine să folosești unul secundar.`,
  connectWhereGroup: "la acest grup",
  connectWhereHere: "pentru descărcările tale din chatul privat și din modul inline",
  connectCodeNotFound: "Codul nu a fost găsit sau a expirat (codurile sunt valabile 10 minute). Obține unul nou în extensia Videoner.",
  connectRejectedNoSession: "Aceste cookie-uri nu conțin nicio autentificare. Conectează-te pe site-ul platformei și exportă din nou cookie-urile.",
  connectRejectedUnknown: "Nu am găsit cookie-uri ale platformelor acceptate: Instagram, Facebook, YouTube, X, VK, TikTok.",
  connectUnavailable: "Conectarea conturilor nu este disponibilă încă.",
  connectFailed: "Nu am putut conecta contul, încearcă din nou.",
  connectFileTooBig: "Fișierul este prea mare — exportă doar cookie-urile site-ului de care ai nevoie.",
  connectNotAnonymous: "Conectează contul în nume propriu, nu anonim în numele grupului: altfel conexiunile administratorilor se amestecă. Am anulat codul — obține unul nou.",
  connectCodeInGroup:
    "Un cod de conectare postat în chatul grupului poate fi văzut de alții — l-am anulat și am șters mesajul. Obține unul nou și trimite-l cu /connect COD: șterg imediat mesajul cu această comandă.",
  groupWelcome:
    "👋 Salut! Postați în acest chat linkuri către videoclipuri de pe TikTok, Instagram, YouTube, VK și alte platforme — vă răspund cu videoclipul propriu-zis.\n\n" +
    "Descarc singur clipurile de până la 15 minute, fără nicio comandă, iar în rest tac.\n\n⚙️ Administratorii grupului mă pot configura cu /settings: ștergerea mesajelor cu linkuri, stilul textului, calitatea, videoclipurile lungi și limba.\n\n⚡ Adaugă -audio după un link ca să primești sunetul sau -hd pentru cea mai bună calitate.\n\n📣 Noutățile proiectului: @videonerdownload",
  errorTooLong: "videoclipul este prea lung — încă nu putem descărca videoclipuri atât de lungi.",
  errorUnknown: "nu am putut descărca acest videoclip. Încearcă din nou puțin mai târziu sau trimite alt link.",
  inlineHintButton: "Trimite un link botului",
  inlineResultTitle: "⬇️ Descarcă videoclipul",
  inlineResultDescription: "Videoclipul va fi postat chiar în acest chat",
  inlinePlaceholder: "⏬ Se descarcă, poate dura câteva minute...",
  inlineOpenBot: "Deschide botul",
  inlineOnlySingleVideo:
    "Acest mod trimite un singur videoclip. Pentru postări cu mai multe fișiere sau fotografii, trimite linkul botului într-un chat privat.",
  inlineSubscribeRequired: (channel: string) =>
    `Ca să descarci, abonează-te la ${channel} și încearcă din nou.`,
  inlineRateLimited: "Prea multe cereri la rând. Așteaptă un minut și încearcă din nou.",
  queueRest: (count) => `\n\n📋 Linkuri rămase în coadă: ${count}. Ți le arăt pe rând după acesta.`,
  queuedOne: (position) =>
    `📋 Link adăugat în coadă, nr. ${position}. Mai întâi terminăm linkul curent — apoi îți arăt alegerea calității pentru acesta.`,
  queuedMany: (added, waiting) =>
    `📋 Linkuri adăugate în coadă: ${added}. În total așteaptă: ${waiting}. Ți le arăt pe rând după cel curent.`,
  queueDuplicates: (count) =>
    count === 1
      ? "Acest link este deja în coadă — nu îl adaug de două ori."
      : `Linkurile aflate deja în coadă nu se adaugă de două ori (repetări: ${count}).`,
  queueFull: (limit, rejected) =>
    `Coada cuprinde cel mult ${limit} linkuri — cele în plus nu au fost adăugate (${rejected}). Trimite-le după ce coada avansează.`,
  skipButton: "✖️ Nu descărca",
  skipped: "⏭ Am sărit peste acest link.",
  chooseTimedOut: "⌛ Nu a fost aleasă nicio calitate în 30 de minute — sar peste acest link.",
  queueLostOnRestart: (count) =>
    `⚠️ Botul repornește pentru o actualizare — coada a fost golită (linkuri: ${count}). Trimite-le din nou peste un minut.`,
  subtitlesButton: "📝 Subtitrări",
  subtitlesBack: "⬅️ Înapoi la calitate",
  subtitlesAuto: "automate",
  subtitlesChoose: "Alege limba subtitrărilor",
  subtitlesPreparing: "📝 Pregătesc subtitrările...",
  subtitlesFailed: "Nu am putut descărca subtitrările în această limbă. Încearcă altă limbă.",
  subtitlesBusy: "YouTube nu oferă subtitrări momentan — încearcă din nou peste câteva minute.",
  playlistFound: (title, count) =>
    `📃 Playlist${title ? ` „${title.slice(0, 150)}”` : ""}: ${count} videoclipuri.\nLe descarc pe rând. Ce format?`,
  playlistStdButton: "🎬 720p",
  playlistHdButton: "🎬 Cea mai bună calitate",
  playlistAudioButton: "🎵 Doar audio (mp3)",
  playlistNoButton: "✖️ Nu, mulțumesc",
  playlistQueued: (count) =>
    `📃 Videoclipuri din playlist adăugate în coadă: ${count}. Ți le trimit pe rând. Oprește cu butonul de mai jos sau cu /stop.`,
  playlistFailed: "Nu am putut deschide playlistul — poate fi privat. Trimite linkul unui singur videoclip.",
  stopButton: "⏹ Oprește",
  stopped: (dropped) => `⏹ Oprit.${dropped ? ` Linkuri eliminate din coadă: ${dropped}.` : ""}`,
  nothingToStop: "Nu se descarcă nimic în acest moment.",
  languageChoose: "🌐 Alege limba botului. „Automat” urmează limba din Telegram.",
  languageChooseGroup: "🌐 Limba răspunsurilor botului în acest grup. „Automat” — limba din Telegram a fiecărui membru.",
  languageAuto: "Automat — ca în Telegram",
  languageAutoGroup: "Automat — a fiecărui membru",
  languageSaved: (name) => `✅ Limba botului: ${name}. O poți schimba cu /language.`,
  languageSavedAuto: "✅ Botul urmează limba din Telegram. O poți schimba cu /language.",
  settingsLanguageButton: (name) => `🌐 Limbă: ${name ?? "automat"}`,
  settingsBack: "⬅️ Înapoi la setări",
};

const ps: Messages = {
  start: "سلام! د YouTube، TikTok، Instagram، Facebook، Twitter/X، Vimeo، VK، Rutube، OK.ru، Pinterest یا Threads څخه د یوې ویډیو لینک راته ولېږئ — د هغې په ښکته کولو کې به مو مرسته وکړم.\n\n✨ د کیفیت هېڅ محدودیت نشته: هر کیفیت چې پلاټفارم یې وړاندې کوي، تر 4K پورې، تاسو ته رسېږي — په دې شرط چې فایل له 2 GB څخه لوی نه وي؛ دا د بوټونو لپاره د Telegram حد دی. دلته هېڅ پولي امکانات نشته.\n\nبشپړ وړیا: نه ګډون، نه اعلانونه، نه د اپلیکیشن دننه پېرودنې.\n\n🧩 په کمپیوټر ښکته کوئ؟ د براوزر توسیع نصب کړئ — د «ښکته کول» تڼۍ په مستقیم ډول د ویډیو په پاڼه کې ښکاري: videoner.download/ps/extension\n\n👥 ما یو ګروپ ته ور اضافه کړئ، او هغه لینکونه چې غړي یې هلته شریکوي، د هغو ویډیوګانې به ولېږم.\n\n⚡ د کیفیت ټاکل پرېږدئ: له لینک وروسته -audio ولیکئ چې یوازې غږ (mp3) ترلاسه کړئ، یا -hd د غوره کیفیت لپاره.\n\n📣 د پروژې خبرونه: ‎@videonerdownload\n\n🌐 د بوټ ژبه: ‎/language",
  notLink: "دا لینک نه ښکاري. د یوې ویډیو لینک راته ولېږئ.",
  inviteGreeting: "سلام! زه Videoner یم — له YouTube، TikTok، Instagram او نورو پلاټفارمونو څخه ویډیوګانې وړیا ښکته کوم. هغه ویډیو چې چا له تاسو سره شریکه کړې، چمتو کوم 👇",
  inviteNotFound: "د دې بلنې لینک لپاره مې ویډیو ونه موندله. د یوې ویډیو لینک راته ولېږئ چې ښکته یې کړم.",
  inviteUnavailable: "د دې لینک ویډیو مې پرانیستلای نه شوه — خدمت اوس ځواب نه ورکوي. یوه دقیقه وروسته همدا لینک بیا پرانیزئ.",
  fetchingInfo: "🔍 د ویډیو معلومات راوړل کېږي...",
  audioOnlyButton: "🎵 یوازې آډیو (mp3)",
  photoButton: "📷 انځورونه ښکته کول",
  slideshowButton: "🎞 سلایډ شو (ویډیو)",
  galleryButton: "📷+🎞 انځورونه او سلایډ شو",
  chooseQuality: (title, duration) => `«${title}»${duration ? `\n⏱ ${duration}` : ""}\n\nکیفیت وټاکئ:`,
  sessionExpired: "ناسته پای ته ورسېده — لینک بیا ولېږئ",
  downloading: "⏬ ښکته کېږي، کېدای شي څو دقیقې وخت ونیسي...",
  downloadFailed: "ښکته کول ناکام شول",
  downloadProgress: (percent, eta, done) =>
    `⏬ ښکته کېږي: ${percent}%${eta ? ` · ${eta} پاتې` : ""}${done ? `\n${done}` : ""}`,
  downloadFinishing: "⚙️ نږدې بشپړ دی — فایل یوځای کېږي...",
  converting: (percent) => `⚙️ اړول کېږي: ${percent}%`,
  etaUnderMinute: "له یوې دقیقې کم",
  etaMinutes: (minutes) => `~${minutes} دقیقې`,
  etaHours: (hours, minutes) => `~${hours} ساعته${minutes ? ` ${minutes} دقیقې` : ""}`,
  downloadTimeout: "ښکته کول ډېر وخت نیسي — داسې ښکاري چې ویډیو ډېره درنه ده. ټیټ کیفیت وازمویئ.",
  downloadInterrupted: "⚠️ بوټ د تازه کولو لپاره بیا پیل کېږي — ستاسو ښکته کول ودرېدل. مهرباني وکړئ یوه دقیقه وروسته لینک بیا ولېږئ.",
  fileTooBig: (mb, url) =>
    `فایل لوی شو (${mb} MB) — Telegram بوټ ته اجازه نه ورکوي چې ویې لېږي.\nله دې ځایه یې ښکته کړئ: ${url}`,
  sendingFile: "📤 فایل لېږل کېږي...",
  sendingAlbum: (count) => `📤 په دې پوسټ کې څو فایلونه (${count}) دي — د البوم په توګه یې لېږم...`,
  failedPrefix: "❌ ناکام: ",
  fileCaption: (title, sourceUrl, shareUrl, description) =>
    composeCaption(
      title,
      description,
      `سرچینه: ${sourceUrl}\n` +
        "د ویډیو ټول حقونه د هغې جوړونکي پورې اړه لري.\n" +
        "په ‎@VideonerBot وړیا ښکته شوې",
      `📣 د پروژې خبرونه: ${NEWS_CHANNEL}`,
      shareUrl && `🔗 شریکول: ${shareUrl}`,
    ),
  subscribeRequired: (channel) =>
    `د ښکته کولو لپاره، مهرباني وکړئ زموږ په چینل ${channel} کې ګډون وکړئ — دا یوازینی شرط دی، خدمت وړیا پاتې کېږي.\n\n` +
    "ګډون وکړئ او «ګډون مې وکړ» کېکاږئ.",
  openChannelButton: "📣 چینل پرانیزئ",
  checkSubscriptionButton: "ګډون مې وکړ",
  subscribeThanks: "مننه! اوس د یوې ویډیو لینک راته ولېږئ.",
  subscribeThanksResuming: "مننه! همدا اوس ستاسو لینک ته لاس اچوم.",
  subscribeStillMissing: "ستاسو ګډون لا نه وینم. ګډون وکړئ او بیا یې کېکاږئ.",
  channelNotice: (channel) => `\n\nد دې پوسټ لینک به په ${channel} کې خپور شي — په بې نومه ډول، ستاسو له نوم پرته.`,
  channelPost: (title, url) =>
    (title ? `🎬 ${title.slice(0, 200)}\n\n` : "") +
    `${url}\n\n` +
    "دا او هره بله ویډیو وړیا ښکته کړئ: ‎@VideonerBot",
  errorStoryNeedsId:
    "د یوې ټاکلې سټورۍ لینک ولېږئ: هغه د Instagram په اپلیکیشن کې پرانیزئ او «شریکول ← لینک کاپي کړئ» کېکاږئ.",
  errorInstagramStory:
    "د Instagram سټورۍ یوازې هغه کسان لیدلای شي چې خپل حساب ته ننوتي وي.",
  errorLoginRequired:
    "دا پوسټ له ننوتلو پرته نه لاسته راځي: پلاټفارم یې یوازې هغو " +
    "کاروونکو ته ښیي چې ننوتي وي. دا د شخصي پوسټونو، د عمر محدودیت لرونکي منځپانګې " +
    "او هغو پوسټونو سره پېښېږي چې له محدودو لیدونکو سره شریک شوي وي.\n\n" +
    "عامه پوسټونه بې له ستونزې ښکته کېږي — بل لینک وازمویئ.",
  errorUnsupportedPlatform:
    "دا لینک مې ونه پېژانده — ډاډ ترلاسه کړئ چې دا د YouTube، TikTok، Instagram، Facebook، Twitter/X، Vimeo، VK، Rutube، OK.ru، Pinterest یا Threads څخه د ویډیو مستقیم لینک دی.",
  errorFileTooLarge: "فایل له 2 GB څخه لوی دی — Telegram بوټونو ته اجازه نه ورکوي چې لوی فایلونه ولېږي. په وېبپاڼه کې یې یا د براوزر په توسیع یې ښکته کړئ — تڼۍ لاندې دي. یا لینک بیا ولېږئ او ټیټ کیفیت وټاکئ.",
  siteButton: "🌐 په وېبپاڼه کې ښکته کول",
  qualitiesHiddenBySize: (limit) =>
    `\n\n⚖️ له ${limit} څخه دروند کیفیتونه پټ شوي: Telegram بوټونو ته اجازه نه ورکوي چې لوی فایلونه ولېږي. تاسو یې په وېبپاڼه کې یا د براوزر په توسیع ښکته کولای شئ — تڼۍ لاندې دي.`,
  videoTooBigForTelegram: (smallest) =>
    `\n\n⚖️ دا ویډیو حتی په تر ټولو ټیټ کیفیت (~${smallest}) کې هم د Telegram لپاره ډېره درنه ده: Telegram بوټونو ته اجازه نه ورکوي چې له 2 GB څخه لوی فایلونه ولېږي. دلته یوازې آډیو ترلاسه کولای شئ؛ ویډیو — په وېبپاڼه کې یا د براوزر په توسیع (تڼۍ لاندې دي).`,
  errorFormatUnavailable: "دا کیفیت د دې ویډیو لپاره شتون نه لري. لینک بیا ولېږئ — تازه لیست به درته وښیم.",
  errorNoVideoContent: "په دې لینک کې د ښکته کولو لپاره ویډیو نشته — داسې ښکاري چې پوسټ یوازې انځورونه لري.",
  errorRegionBlocked:
    "دا ویډیو د جوړونکي له هېواد څخه بهر بنده ده — پلاټفارم یې " +
    "زموږ سرور ته نه ورکوي. د دې د تېرولو لار نشته: محدودیت د هغوی له خوا دی." +
    "\n\nنور لینکونه د تل په څېر ښکته کېږي.",
  errorRateLimited: "پرله پسې ډېر لینکونه — لږ صبر وکړئ او بیا یې ولېږئ.",
  errorYoutubeDailyLimit: (gb) => `تاسو په تېرو 24 ساعتونو کې له YouTube څخه له ${gb} GB څخه ډېر ښکته کړي — دا د هر کس لپاره د بوټ ورځنی حد دی. حساب د وروستیو 24 ساعتونو له مخې کېږي، نو لږ وروسته کولای شئ د YouTube نوې ویډیوګانې ښکته کړئ. نور پلاټفارمونه د تل په څېر کار کوي.`,
  playlistStoppedByLimit: (dropped) => `⏹ پلی لیست ودرول شو: د YouTube ورځني حد ته ورسېدئ. نه ښکته شوې ویډیوګانې: ${dropped}. وروسته د پلی لیست لینک بیا ولېږئ.`,
  errorPlatformRefused:
    "پلاټفارم دا ویډیو زموږ سرور ته ورنه کړه. دا د شخصي " +
    "یا د عمر محدودیت لرونکو پوسټونو سره پېښېږي، او کله ناکله پلاټفارم یوازې " +
    "لاسرسی د یو څه وخت لپاره محدودوي. څو دقیقې وروسته بیا هڅه وکړئ.",
  errorThreadsNoMedia:
    "د Threads په دې پوسټ کې هېڅ ویډیو یا انځور نه ښکاري. یا دا یوازې متني پوسټ دی، یا " +
    "Threads خپل میډیا یوازې ننوتو کاروونکو ته ښیي — داسې پوسټونه له ننوتلو پرته نه شي ښکته کېدای.",
  extensionHint:
    "\n\n💻 تاسو یې په کمپیوټر کې د Videoner د براوزر په توسیع ښکته کولای شئ: " +
    "توسیع ستاسو په خپل ننوتلو سره په پلاټفارم کې ښکته کوي، او هېڅ پټنوم یا cookies ستاسو له براوزر نه وځي.",
  privateConnectHint: (platform, withExtension) =>
    `\n\n🔑 د داسې پوسټونو د ښکته کولو لپاره، خپل ${platform} حساب له بوټ سره وصل کړئ — یوازې یو ځل. له هغې وروسته بوټ هر هغه څه ښکته کوي چې تاسو یې لیدلای شئ: شخصي پوسټونه، ریلز او سټورۍ، له موبایل څخه هم. لاندې تڼۍ یې طریقه ښیي.${withExtension ? "\n\n💻 یا یې په کمپیوټر کې د Videoner د براوزر په توسیع ښکته کړئ." : ""}`,
  privateReconnectHint: (platform, withExtension) =>
    `\n\n⚠️ ستاسو وصل شوي ${platform} حساب دا پوسټ پرانیستلای نه شو. کېدای شي ننوتل نور کار نه کوي — حساب بیا وصل کړئ. یا دا حساب پوسټ ته لاسرسی نه لري.${withExtension ? "\n\n💻 همدارنګه یې په کمپیوټر کې د Videoner د براوزر په توسیع ښکته کولای شئ." : ""}`,
  connectAccountButton: "🔑 حساب وصل کړئ",
  reconnectAccountButton: "🔑 بیا وصل کړئ",
  extensionButton: "🧩 په توسیع ښکته کول",
  extensionCommand:
    "🧩 Videoner ستاسو د براوزر لپاره: د «ښکته کول» تڼۍ مستقیم د ویډیو په پاڼه کې — YouTube، Instagram، TikTok، VK، ستاسو له حساب څخه شخصي ویډیوګانې او د GetCourse درسونه.\n\nپه کمپیوټر کې د Chrome، Edge، Opera، Yandex Browser او Firefox لپاره.",
  extensionPageButton: "🧩 توسیع نصب کړئ",
  addToGroupButton: "👥 ګروپ ته اضافه کړئ",
  newsButton: "📣 د پروژې خبرونه",
  fileCaptionShort: (title, sourceUrl) =>
    withOptionalLines((title ? `🎬 ${title.slice(0, 200)}\n\n` : "") + sourceUrl, `📣 د پروژې خبرونه: ${NEWS_CHANNEL}`, undefined),
  sentBy: (name) => `👤 ${name}`,
  groupSettings: (s, canDelete) =>
    "⚙️ د دې ګروپ لپاره د بوټ تنظیمات\n\n" +
    `🗑 د لینک لرونکي پیغام ړنګول: ${s.deleteLinks ? "هو" : "نه"}\n` +
    "کله چې ویډیو ولېږل شي، هغه پیغام چې یوازې لینک یې درلود ړنګېږي — په چټ کې یوازې ویډیو د شریکوونکي له نوم سره پاتې کېږي.\n" +
    (s.deleteLinks && !canDelete
      ? "⚠️ اوس پیغامونه نه شم ړنګولای: ما د «پیغامونه ړنګول» له اجازې سره اډمین کړئ.\n"
      : "") +
    `\n✍️ د ویډیو لاندې متن: ${{ full: "بشپړ", short: "سرلیک او سرچینه", none: "بې متنه" }[s.caption] ?? s.caption}\n` +
    `\n🎞 کیفیت: ${s.quality === "max" ? "تر ټولو لوړ چې Telegram یې مني" : "معیاري (720p)"}\n` +
    `\n⏱ اوږدې ویډیوګانې: ${s.longVideos ? "هر اوږدوالی" : "یوازې تر 15 دقیقو پورې"}\n` +
    `\n🔑 څوک کولای شي خپل حسابونه وصل کړي (د سټوریو او شخصي پوسټونو لپاره): ${s.cookiesBy === "all" ? "هر غړی" : "یوازې اډمینان"}\n` +
    `\n🌐 د ځوابونو ژبه: ${s.language ? langName(s.language) : "د هر غړي خپله"}\n` +
    "\nیوازې د ګروپ اډمینان کولای شي تنظیمات بدل کړي.",
  settingsDeleteButton: (on) => `🗑 لینکونه ړنګول: ${on ? "هو" : "نه"}`,
  settingsCaptionButton: (style) => `✍️ متن: ${{ full: "بشپړ", short: "لنډ", none: "هېڅ" }[style] ?? style}`,
  settingsQualityButton: (mode) => `🎞 کیفیت: ${mode === "max" ? "تر ټولو لوړ" : "720p"}`,
  settingsLongButton: (on) => `⏱ اوږدې ویډیوګانې: ${on ? "هو" : "تر 15 دقیقو"}`,
  settingsDoneButton: "✅ بشپړ",
  settingsAdminsOnly: "یوازې د ګروپ اډمینان کولای شي تنظیمات بدل کړي.",
  settingsGroupsOnly: "تنظیمات د ګروپونو لپاره دي: ما یو ګروپ ته اضافه کړئ او هلته ‎/settings ولېږئ.",
  settingsFailed: "تنظیمات خوندي نه شول، مهرباني وکړئ بیا هڅه وکړئ.",
  settingsCookiesButton: (by) => `🔑 د حسابونو وصلول: ${by === "all" ? "هر څوک" : "اډمینان"}`,
  accountsIntro:
    "🔑 وصل شوي حسابونه\n\nبوټ کولای شي هغه څه چې یوازې ننوتي کسان یې ویني (د Instagram سټورۍ، شخصي پوسټونه) ستاسو په حساب ښکته کړي. هر ننوتل په هماغه ځای کار کوي چېرې چې مو وصل کړی: هغه چې په شخصي چټ کې وصل شوی ستاسو د ښکته کولو لپاره دی، په هغو ګروپونو کې ستاسو د خپلو لینکونو په ګډون چې خپل حساب نه لري؛ هغه چې له یوه ګروپ سره وصل شوی د هغه ګروپ ټولو غړو ته کار کوي.",
  accountsHowTo:
    "د وصلولو طریقه:\n1. تر ټولو اسانه: په کمپیوټر کې د Videoner توسیع — د پلاټفارم په وېبپاڼه کې ننوځئ، د Videoner کړکۍ پرانیزئ، «🔑 خپل … حساب له بوټ سره وصل کړئ» کېکاږئ او کوډ راته ولېږئ. د ګروپ لپاره، په هماغه ګروپ کې ‎/connect CODE ولېږئ.\n2. یا راته د cookies.txt فایل (له براوزر څخه صادر شوي cookies) ولېږئ، یا یې متن په یوه پیغام کې ولګوئ.\n3. له Android موبایل څخه — د Firefox او Cookie-Editor ضمیمې سره: https://videoner.download/ps/blog/android-firefox",
  accountsWarning:
    "⚠️ پلاټفارمونه اتوماتیک ښکته کول نه خوښوي او کېدای شي حساب محدود یا بند کړي. غوره ده چې یو فرعي حساب وصل کړئ، نه خپل اصلي حساب. cookies کوډ شوي ساتل کېږي، یوازې د ښکته کولو لپاره کارول کېږي، او د لاندې تڼیو په واسطه ړنګېږي.",
  accountsNone: "تر اوسه هېڅ نه دي وصل شوي.",
  accountsGroupTitle: "🔑 له دې ګروپ سره وصل شوي حسابونه",
  accountsGroupHowTo:
    "د ټول ګروپ لپاره د یوه حساب د وصلولو لپاره: د Videoner په توسیع کې د «🔑 خپل … حساب له بوټ سره وصل کړئ» تڼۍ په واسطه کوډ واخلئ او دلته ‎/connect CODE ولېږئ. که مو حساب یوازې په خپل شخصي چټ کې وصل کړی وي، بوټ یې دلته ستاسو د خپلو لینکونو لپاره کاروي. ستاسو وصلونه: ‎/accounts له ‎@VideonerBot سره په شخصي چټ کې.",
  accountsLine: (platform, where, active) => `• ${platform} — ${where}${active ? "" : " (⚠️ ننوتل کار نه کوي)"}`,
  accountsGroupLine: (platform, owner, active) => `• ${platform} — ${owner}${active ? "" : " (⚠️ ننوتل کار نه کوي)"}`,
  accountsWhereHere: "شخصي چټ",
  accountsWhereGroup: (title) => `ګروپ «${title}»`,
  accountsDeleteButton: (platform, where) => `🗑 ${platform} · ${where}`,
  accountsDeleteAllButton: "🗑 زما ټول وصلونه ړنګ کړئ",
  accountsDeleted: "ړنګ شو.",
  accountsDeletedAll: (n) => `ړنګ شوي وصلونه: ${n}.`,
  accountsNotAllowed: "یوازې هغه څوک چې حساب یې وصل کړی یا د ګروپ اډمین یې ړنګولای شي.",
  connectUsage:
    "‎/connect CODE ولېږئ. کوډ تاسو ته په کمپیوټر کې د Videoner په توسیع کې د «🔑 خپل … حساب له بوټ سره وصل کړئ» تڼۍ درکوي. ستاسو وصلونه: ‎/accounts.",
  connectOnlyAdmins: "یوازې اډمینان کولای شي له دې ګروپ سره حسابونه وصل کړي (‎/settings وګورئ).",
  connectDone: (platform, where) =>
    `✅ ${platform} ${where} وصل شو. اوس بوټ هغه څه هم ښکته کوي چې یوازې ننوتي کسان یې ویني. کتل یا ړنګول: ‎/accounts.\n\n⚠️ کېدای شي پلاټفارم حساب د اتوماتیک ښکته کولو له امله محدود کړي — غوره ده چې فرعي حساب وکاروئ.`,
  connectWhereGroup: "له دې ګروپ سره",
  connectWhereHere: "په شخصي چټ او inline حالت کې ستاسو د ښکته کولو لپاره",
  connectCodeNotFound: "کوډ ونه موندل شو یا یې موده تېره شوې (کوډونه 10 دقیقې اعتبار لري). د Videoner له توسیع څخه نوی کوډ واخلئ.",
  connectRejectedNoSession: "په دې cookies کې ننوتل نشته. د پلاټفارم په وېبپاڼه کې ننوځئ او cookies بیا صادر کړئ.",
  connectRejectedUnknown: "د ملاتړ شوو پلاټفارمونو هېڅ cookies ونه موندل شول: Instagram، Facebook، YouTube، X، VK، TikTok.",
  connectUnavailable: "د حسابونو وصلول لا شتون نه لري.",
  connectFailed: "وصل نه شو، مهرباني وکړئ بیا هڅه وکړئ.",
  connectFileTooBig: "فایل ډېر لوی دی — یوازې د اړینې وېبپاڼې cookies صادر کړئ.",
  connectNotAnonymous: "حساب د خپل ځان په نوم وصل کړئ، نه د ګروپ په توګه بې نومه: که نه نو د اډمینانو وصلونه سره ګډوډېږي. کوډ مې باطل کړ — نوی واخلئ.",
  connectCodeInGroup:
    "د وصلولو کوډ چې د ګروپ په چټ کې خپور شي، نور یې هم لیدلای شي — باطل مې کړ او پیغام مې ړنګ کړ. نوی کوډ واخلئ او د ‎/connect CODE په توګه یې ولېږئ: د دې کمانډ پیغام سمدستي ړنګوم.",
  groupWelcome:
    "👋 سلام! په دې چټ کې د TikTok، Instagram، YouTube، VK او نورو پلاټفارمونو د ویډیوګانو لینکونه ولېږئ — زه به پخپله ویډیو درته د ځواب په توګه ولېږم.\n\n" +
    "تر 15 دقیقو پورې ویډیوګانې پخپله، له هېڅ کمانډ پرته، ښکته کوم، او نور وخت چوپ یم.\n\n⚙️ د ګروپ اډمینان کولای شي ما په ‎/settings تنظیم کړي: د لینک پیغامونو ړنګول، د متن بڼه، کیفیت، اوږدې ویډیوګانې او ژبه.\n\n⚡ له لینک وروسته -audio ولیکئ چې غږ ترلاسه کړئ، یا -hd د غوره کیفیت لپاره.\n\n📣 د پروژې خبرونه: ‎@videonerdownload",
  errorTooLong: "ویډیو ډېره اوږده ده — تر اوسه دومره اوږدې ویډیوګانې نه شو ښکته کولای.",
  errorUnknown: "دا ویډیو ښکته نه شوه. لږ وروسته بیا هڅه وکړئ یا بل لینک ولېږئ.",
  inlineHintButton: "بوټ ته لینک ولېږئ",
  inlineResultTitle: "⬇️ ویډیو ښکته کول",
  inlineResultDescription: "ویډیو به مستقیم په همدې چټ کې ولېږل شي",
  inlinePlaceholder: "⏬ ښکته کېږي، کېدای شي څو دقیقې وخت ونیسي...",
  inlineOpenBot: "بوټ پرانیزئ",
  inlineOnlySingleVideo:
    "دا حالت یوازې یوه ویډیو لېږي. د څو فایلي پوسټونو یا انځورونو لپاره، لینک په شخصي چټ کې بوټ ته ولېږئ.",
  inlineSubscribeRequired: (channel: string) =>
    `د ښکته کولو لپاره، په ${channel} کې ګډون وکړئ او بیا هڅه وکړئ.`,
  inlineRateLimited: "پرله پسې ډېرې غوښتنې. یوه دقیقه صبر وکړئ او بیا هڅه وکړئ.",
  queueRest: (count) => `\n\n📋 په کتار کې پاتې لینکونه: ${count}. له دې وروسته به یې یو په یو درته وښیم.`,
  queuedOne: (position) =>
    `📋 لینک کتار ته اضافه شو، شمېره ${position}. لومړی اوسنی بشپړ کړو — بیا به یې د کیفیت ټاکل درته وښیم.`,
  queuedMany: (added, waiting) =>
    `📋 کتار ته اضافه شوي لینکونه: ${added}. ټول په انتظار: ${waiting}. له اوسني وروسته به یې یو په یو درته وښیم.`,
  queueDuplicates: (count) =>
    count === 1
      ? "دا لینک دمخه په کتار کې دی — دوه ځله یې نه اضافه کوم."
      : `هغه لینکونه چې دمخه په کتار کې دي دوه ځله نه اضافه کېږي (تکرارونه: ${count}).`,
  queueFull: (limit, rejected) =>
    `کتار تر ټولو ډېر ${limit} لینکونه ځایولای شي — اضافي لینکونه اضافه نه شول (${rejected}). کله چې کتار مخ ته لاړ، بیا یې ولېږئ.`,
  skipButton: "✖️ مه یې ښکته کوئ",
  skipped: "⏭ دا لینک پرېښودل شو.",
  chooseTimedOut: "⌛ په 30 دقیقو کې هېڅ کیفیت ونه ټاکل شو — دا لینک پرېږدم.",
  queueLostOnRestart: (count) =>
    `⚠️ بوټ د تازه کولو لپاره بیا پیل کېږي — کتار خالي شو (لینکونه: ${count}). مهرباني وکړئ یوه دقیقه وروسته یې بیا ولېږئ.`,
  subtitlesButton: "📝 زیرنویس",
  subtitlesBack: "⬅️ کیفیت ته بېرته",
  subtitlesAuto: "اتوماتیک",
  subtitlesChoose: "د زیرنویس ژبه وټاکئ",
  subtitlesPreparing: "📝 زیرنویس چمتو کېږي...",
  subtitlesFailed: "په دې ژبه زیرنویس ښکته نه شو. بله ژبه وازمویئ.",
  subtitlesBusy: "YouTube اوس زیرنویس نه ورکوي — څو دقیقې وروسته بیا هڅه وکړئ.",
  playlistFound: (title, count) =>
    `📃 پلی لیست${title ? ` «${title.slice(0, 150)}»` : ""}: ${count} ویډیوګانې.\nیو په یو به یې ښکته کړم. په کوم فارمټ؟`,
  playlistStdButton: "🎬 720p",
  playlistHdButton: "🎬 غوره کیفیت",
  playlistAudioButton: "🎵 یوازې آډیو (mp3)",
  playlistNoButton: "✖️ نه، مننه",
  playlistQueued: (count) =>
    `📃 له پلی لیست څخه کتار ته اضافه شوې ویډیوګانې: ${count}. یو په یو به یې ولېږم. د درولو لپاره لاندې تڼۍ یا ‎/stop.`,
  playlistFailed: "پلی لیست پرانیستل نه شو — کېدای شي شخصي وي. د یوې ویډیو لینک ولېږئ.",
  stopButton: "⏹ درول",
  stopped: (dropped) => `⏹ ودرول شو.${dropped ? ` له کتار څخه لرې شوي لینکونه: ${dropped}.` : ""}`,
  nothingToStop: "اوس هېڅ نه ښکته کېږي.",
  languageChoose: "🌐 د بوټ ژبه وټاکئ. «اتوماتیک» ستاسو د Telegram ژبه تعقیبوي.",
  languageChooseGroup: "🌐 په دې ګروپ کې د بوټ د ځوابونو ژبه. «اتوماتیک» — د هر غړي د Telegram ژبه.",
  languageAuto: "اتوماتیک — لکه په Telegram کې",
  languageAutoGroup: "اتوماتیک — د هر غړي خپله",
  languageSaved: (name) => `✅ د بوټ ژبه: ${name}. په ‎/language یې بدلولای شئ.`,
  languageSavedAuto: "✅ بوټ ستاسو د Telegram ژبه تعقیبوي. په ‎/language یې بدلولای شئ.",
  settingsLanguageButton: (name) => `🌐 ژبه: ${name ?? "اتوماتیک"}`,
  settingsBack: "⬅️ تنظیماتو ته بېرته",
};

const ckb: Messages = {
  start: "سڵاو! بەستەری ڤیدیۆیەک لە YouTube، TikTok، Instagram، Facebook، Twitter/X، Vimeo، VK، Rutube، OK.ru، Pinterest یان Threads بۆم بنێرە — یارمەتیت دەدەم دایبگریت.\n\n✨ هیچ سنوورێکی کوالیتی نییە: هەر کوالیتییەک پلاتفۆرمەکە پێشکەشی بکات، تا 4K، وەریدەگریت — بە مەرجێک فایلەکە لە 2 GB گەورەتر نەبێت؛ ئەمە ئەو سنوورەیە کە Telegram بۆ بۆتەکان دایناوە. لێرە هیچ تایبەتمەندییەکی پارەدار نییە.\n\nبە تەواوی بە خۆڕایی: نە بەشداریکردن، نە ڕیکلام، نە کڕینی ناو ئەپ.\n\n🧩 لەسەر کۆمپیوتەر دادەگریت؟ پێوەکراوی وێبگەڕ دابمەزرێنە — دوگمەی «داگرتن» ڕاستەوخۆ لە پەڕەی ڤیدیۆکەدا دەردەکەوێت: videoner.download/ckb/extension\n\n👥 زیادم بکە بۆ گرووپێک و ڤیدیۆی ئەو بەستەرانە دەنێرم کە ئەندامان لەوێ هاوبەشی دەکەن.\n\n⚡ هەڵبژاردنی کوالیتی تێپەڕێنە: لە دوای بەستەرەکە -audio بنووسە بۆ تەنها دەنگ (mp3)، یان -hd بۆ باشترین کوالیتی.\n\n📣 هەواڵەکانی پڕۆژە: ‎@videonerdownload\n\n🌐 زمانی بۆت: ‎/language",
  notLink: "ئەمە وەک بەستەر دیار نییە. بەستەری ڤیدیۆیەک بۆم بنێرە.",
  inviteGreeting: "سڵاو! من Videoner ـم — ڤیدیۆ لە YouTube، TikTok، Instagram و پلاتفۆرمەکانی تر بە خۆڕایی دادەگرم. ئەو ڤیدیۆیەی کەسێک بۆی ناردوویت ئامادە دەکەم 👇",
  inviteNotFound: "هیچ ڤیدیۆیەکم بۆ ئەم بەستەری بانگهێشتە نەدۆزییەوە. بەستەری ڤیدیۆیەک بۆم بنێرە و دایدەگرم.",
  inviteUnavailable: "نەمتوانی ڤیدیۆی ئەم بەستەرە بکەمەوە — خزمەتگوزارییەکە ئێستا وەڵام ناداتەوە. دوای خولەکێک هەمان بەستەر دووبارە بکەرەوە.",
  fetchingInfo: "🔍 زانیاریی ڤیدیۆکە وەردەگیرێت...",
  audioOnlyButton: "🎵 تەنها دەنگ (mp3)",
  photoButton: "📷 داگرتنی وێنەکان",
  slideshowButton: "🎞 سلایدشۆ (ڤیدیۆ)",
  galleryButton: "📷+🎞 وێنەکان و سلایدشۆ",
  chooseQuality: (title, duration) => `«${title}»${duration ? `\n⏱ ${duration}` : ""}\n\nکوالیتی هەڵبژێرە:`,
  sessionExpired: "کاتی دانیشتنەکە بەسەرچوو — بەستەرەکە دووبارە بنێرە",
  downloading: "⏬ دادەگیرێت، لەوانەیە چەند خولەکێک بخایەنێت...",
  downloadFailed: "داگرتن سەرکەوتوو نەبوو",
  downloadProgress: (percent, eta, done) =>
    `⏬ دادەگیرێت: ${percent}%${eta ? ` · ${eta} ماوە` : ""}${done ? `\n${done}` : ""}`,
  downloadFinishing: "⚙️ خەریکە تەواو دەبێت — فایلەکە کۆدەکرێتەوە...",
  converting: (percent) => `⚙️ گۆڕین: ${percent}%`,
  etaUnderMinute: "کەمتر لە خولەکێک",
  etaMinutes: (minutes) => `~${minutes} خولەک`,
  etaHours: (hours, minutes) => `~${hours} کاتژمێر${minutes ? ` ${minutes} خولەک` : ""}`,
  downloadTimeout: "داگرتنەکە زۆر دەخایەنێت — وا دیارە ڤیدیۆکە زۆر قورسە. کوالیتییەکی نزمتر تاقی بکەرەوە.",
  downloadInterrupted: "⚠️ بۆتەکە بۆ نوێکردنەوە دەستپێدەکاتەوە — داگرتنەکەت پچڕا. تکایە دوای خولەکێک بەستەرەکە دووبارە بنێرە.",
  fileTooBig: (mb, url) =>
    `فایلەکە گەورە دەرچوو (${mb} MB) — Telegram ڕێگە بە بۆتەکە نادات بینێرێت.\nلێرە دایبگرە: ${url}`,
  sendingFile: "📤 فایلەکە دەنێردرێت...",
  sendingAlbum: (count) => `📤 ئەم پۆستە چەند فایلێکی تێدایە (${count}) — وەک ئەلبووم دەیاننێرم...`,
  failedPrefix: "❌ سەرکەوتوو نەبوو: ",
  fileCaption: (title, sourceUrl, shareUrl, description) =>
    composeCaption(
      title,
      description,
      `سەرچاوە: ${sourceUrl}\n` +
        "هەموو مافەکانی ڤیدیۆکە هی خاوەنەکەیەتی.\n" +
        "بە خۆڕایی بە ‎@VideonerBot داگیراوە",
      `📣 هەواڵەکانی پڕۆژە: ${NEWS_CHANNEL}`,
      shareUrl && `🔗 هاوبەشکردن: ${shareUrl}`,
    ),
  subscribeRequired: (channel) =>
    `بۆ داگرتن، تکایە بەشداری کەناڵەکەمان ${channel} بکە — ئەمە تاکە مەرجە، خزمەتگوزارییەکە بە خۆڕایی دەمێنێتەوە.\n\n` +
    "بەشداری بکە و کرتە لە «بەشداریم کرد» بکە.",
  openChannelButton: "📣 کردنەوەی کەناڵەکە",
  checkSubscriptionButton: "بەشداریم کرد",
  subscribeThanks: "سوپاس! ئێستا بەستەری ڤیدیۆیەک بۆم بنێرە.",
  subscribeThanksResuming: "سوپاس! ئێستا دەست بە بەستەرەکەت دەکەم.",
  subscribeStillMissing: "هێشتا بەشداریکردنەکەت نابینم. بەشداری بکە و دووبارە کرتە بکە.",
  channelNotice: (channel) => `\n\nبەستەری ئەم پۆستە لە ${channel} دا دەردەکەوێت — بێ ناو، بەبێ ئەوەی ناوی تۆ دیار بێت.`,
  channelPost: (title, url) =>
    (title ? `🎬 ${title.slice(0, 200)}\n\n` : "") +
    `${url}\n\n` +
    "ئەمە و هەر ڤیدیۆیەکی تر بە خۆڕایی دابگرە: ‎@VideonerBot",
  errorStoryNeedsId:
    "بەستەری ستۆرییەکی دیاریکراو بنێرە: لە ئەپی Instagram بیکەرەوە و کرتە لە «هاوبەشکردن ← کۆپیکردنی بەستەر» بکە.",
  errorInstagramStory:
    "ستۆرییەکانی Instagram تەنها بۆ ئەو کەسانە دیارن کە چوونەتە ژوورەوە.",
  errorLoginRequired:
    "ئەم پۆستە بەبێ چوونەژوورەوە بەردەست نییە: پلاتفۆرمەکە تەنها پیشانی " +
    "ئەو بەکارهێنەرانەی دەدات کە چوونەتە ژوورەوە. ئەمە بۆ پۆستە تایبەتەکان، ناوەڕۆکی سنووردار بە تەمەن " +
    "و ئەو پۆستانە ڕوودەدات کە لەگەڵ بینەرانێکی سنووردار هاوبەش کراون.\n\n" +
    "پۆستە گشتییەکان بەبێ کێشە دادەگیرێن — بەستەرێکی تر تاقی بکەرەوە.",
  errorUnsupportedPlatform:
    "ئەم بەستەرەم نەناسییەوە — دڵنیا بەرەوە کە بەستەری ڕاستەوخۆی ڤیدیۆیە لە YouTube، TikTok، Instagram، Facebook، Twitter/X، Vimeo، VK، Rutube، OK.ru، Pinterest یان Threads.",
  errorFileTooLarge: "فایلەکە لە 2 GB گەورەترە — Telegram ڕێگە بە بۆتەکان نادات فایلی گەورەتر بنێرن. لە ماڵپەڕەکە یان بە پێوەکراوی وێبگەڕ دایبگرە — دوگمەکان لە خوارەوەن. یان بەستەرەکە دووبارە بنێرە و کوالیتییەکی نزمتر هەڵبژێرە.",
  siteButton: "🌐 داگرتن لە ماڵپەڕ",
  qualitiesHiddenBySize: (limit) =>
    `\n\n⚖️ ئەو کوالیتییانەی لە ${limit} قورسترن شاردراونەتەوە: Telegram ڕێگە بە بۆتەکان نادات فایلی گەورەتر بنێرن. دەتوانیت لە ماڵپەڕەکە یان بە پێوەکراوی وێبگەڕ دایانبگریت — دوگمەکان لە خوارەوەن.`,
  videoTooBigForTelegram: (smallest) =>
    `\n\n⚖️ ئەم ڤیدیۆیە تەنانەت بە نزمترین کوالیتیش (~${smallest}) بۆ Telegram زۆر قورسە: Telegram ڕێگە بە بۆتەکان نادات فایلی سەرووی 2 GB بنێرن. لێرە دەتوانیت تەنها دەنگەکە وەربگریت؛ ڤیدیۆکەش — لە ماڵپەڕەکە یان بە پێوەکراوی وێبگەڕ (دوگمەکان لە خوارەوەن).`,
  errorFormatUnavailable: "ئەم کوالیتییە بۆ ئەم ڤیدیۆیە بەردەست نییە. بەستەرەکە دووبارە بنێرە — لیستی نوێت پیشان دەدەم.",
  errorNoVideoContent: "ئەم بەستەرە هیچ ڤیدیۆیەکی تێدا نییە بۆ داگرتن — وا دیارە پۆستەکە تەنها وێنەیە.",
  errorRegionBlocked:
    "ئەم ڤیدیۆیە لە دەرەوەی وڵاتی خاوەنەکەی بلۆک کراوە — پلاتفۆرمەکە " +
    "نایداتە سێرڤەرەکەمان. هیچ ڕێگەیەک نییە بۆ تێپەڕاندنی: سنووردارکردنەکە لە لایەن ئەوانەوەیە." +
    "\n\nبەستەرەکانی تر وەک هەمیشە دادەگیرێن.",
  errorRateLimited: "بەستەری زۆر لە دوای یەک — کەمێک چاوەڕێ بکە و دووبارە بینێرە.",
  errorYoutubeDailyLimit: (gb) => `لە 24 کاتژمێری ڕابردوودا زیاتر لە ${gb} GB لە YouTube داگرتووە — ئەمە سنووری ڕۆژانەی بۆتەکەیە بۆ هەر کەسێک. 24 کاتژمێری کۆتایی دەژمێردرێت، بۆیە کەمێکی تر دەتوانیت ڤیدیۆی نوێی YouTube دابگریت. پلاتفۆرمەکانی تر وەک هەمیشە کار دەکەن.`,
  playlistStoppedByLimit: (dropped) => `⏹ پلەیلیستەکە ڕاگیرا: سنووری ڕۆژانەی YouTube پڕ بووەوە. ئەو ڤیدیۆیانەی دانەگیران: ${dropped}. دواتر بەستەری پلەیلیستەکە دووبارە بنێرە.`,
  errorPlatformRefused:
    "پلاتفۆرمەکە ئەم ڤیدیۆیەی نەدایە سێرڤەرەکەمان. ئەمە بۆ پۆستە تایبەتەکان " +
    "یان سنووردار بە تەمەن ڕوودەدات، و هەندێک جار پلاتفۆرمەکە تەنها " +
    "بۆ ماوەیەک دەستگەیشتن سنووردار دەکات. دوای چەند خولەکێک دووبارە هەوڵ بدەرەوە.",
  errorThreadsNoMedia:
    "هیچ ڤیدیۆ یان وێنەیەک لەم پۆستەی Threads دا دیار نییە. یان پۆستێکی تەنها دەقە، یان " +
    "Threads میدیاکەی تەنها بۆ ئەو بەکارهێنەرانە پیشان دەدات کە چوونەتە ژوورەوە — ئەم جۆرە پۆستانە بەبێ چوونەژوورەوە داناگیرێن.",
  extensionHint:
    "\n\n💻 دەتوانیت لەسەر کۆمپیوتەر بە پێوەکراوی وێبگەڕی Videoner دایبگریت: " +
    "بە چوونەژوورەوەی خۆت لە پلاتفۆرمەکە دایدەگرێت، و هیچ وشەی نهێنی یان cookies لە وێبگەڕەکەت دەرناچێت.",
  privateConnectHint: (platform, withExtension) =>
    `\n\n🔑 بۆ داگرتنی ئەم جۆرە پۆستانە، هەژماری ${platform} بە بۆتەوە ببەستەوە — تەنها یەک جار. دوای ئەوە بۆتەکە هەر شتێک دادەگرێت کە تۆ دەیبینیت: پۆستە تایبەتەکان، ڕیلز و ستۆرییەکان، لە مۆبایلیشەوە. دوگمەی خوارەوە ڕێگاکەی پیشان دەدات.${withExtension ? "\n\n💻 یان لەسەر کۆمپیوتەر بە پێوەکراوی وێبگەڕی Videoner دایبگرە." : ""}`,
  privateReconnectHint: (platform, withExtension) =>
    `\n\n⚠️ هەژمارە بەستراوەکەی ${platform} نەیتوانی ئەم پۆستە بکاتەوە. لەوانەیە چوونەژوورەوەکە ئیتر کار نەکات — هەژمارەکە دووبارە ببەستەوە. یان ئەم هەژمارە دەستی بەم پۆستە ناگات.${withExtension ? "\n\n💻 هەروەها دەتوانیت لەسەر کۆمپیوتەر بە پێوەکراوی وێبگەڕی Videoner دایبگریت." : ""}`,
  connectAccountButton: "🔑 بەستنەوەی هەژمار",
  reconnectAccountButton: "🔑 دووبارە بەستنەوە",
  extensionButton: "🧩 داگرتن بە پێوەکراو",
  extensionCommand:
    "🧩 Videoner بۆ وێبگەڕەکەت: دوگمەی «داگرتن» ڕاستەوخۆ لە پەڕەی ڤیدیۆکەدا — YouTube، Instagram، TikTok، VK، ڤیدیۆ تایبەتەکان لە هەژمارەکەتەوە و وانەکانی GetCourse.\n\nبۆ Chrome، Edge، Opera، Yandex Browser و Firefox لەسەر کۆمپیوتەر.",
  extensionPageButton: "🧩 دامەزراندنی پێوەکراو",
  addToGroupButton: "👥 زیادکردن بۆ گرووپ",
  newsButton: "📣 هەواڵەکانی پڕۆژە",
  fileCaptionShort: (title, sourceUrl) =>
    withOptionalLines((title ? `🎬 ${title.slice(0, 200)}\n\n` : "") + sourceUrl, `📣 هەواڵەکانی پڕۆژە: ${NEWS_CHANNEL}`, undefined),
  sentBy: (name) => `👤 ${name}`,
  groupSettings: (s, canDelete) =>
    "⚙️ ڕێکخستنەکانی بۆت بۆ ئەم گرووپە\n\n" +
    `🗑 سڕینەوەی نامەی بەستەرەکە: ${s.deleteLinks ? "بەڵێ" : "نەخێر"}\n` +
    "دوای ناردنی ڤیدیۆکە، ئەو نامەیەی تەنها بەستەرەکەی تێدا بوو دەسڕدرێتەوە — لە چاتەکەدا تەنها ڤیدیۆکە لەگەڵ ناوی ئەو کەسەی هاوبەشی کردووە دەمێنێتەوە.\n" +
    (s.deleteLinks && !canDelete
      ? "⚠️ ئێستا ناتوانم نامەکان بسڕمەوە: بمکە بە ئەدمین بە مافی «سڕینەوەی نامەکان».\n"
      : "") +
    `\n✍️ دەقی ژێر ڤیدیۆ: ${{ full: "تەواو", short: "ناونیشان و سەرچاوە", none: "بێ دەق" }[s.caption] ?? s.caption}\n` +
    `\n🎞 کوالیتی: ${s.quality === "max" ? "بەرزترین کە Telegram وەریدەگرێت" : "ستاندارد (720p)"}\n` +
    `\n⏱ ڤیدیۆی درێژ: ${s.longVideos ? "هەر درێژییەک" : "تەنها تا 15 خولەک"}\n` +
    `\n🔑 کێ دەتوانێت هەژمارەکانی ببەستێتەوە (بۆ ستۆری و پۆستی تایبەت): ${s.cookiesBy === "all" ? "هەر ئەندامێک" : "تەنها ئەدمینەکان"}\n` +
    `\n🌐 زمانی وەڵامەکان: ${s.language ? langName(s.language) : "زمانی خودی هەر ئەندامێک"}\n` +
    "\nتەنها ئەدمینەکانی گرووپ دەتوانن ڕێکخستنەکان بگۆڕن.",
  settingsDeleteButton: (on) => `🗑 سڕینەوەی بەستەرەکان: ${on ? "بەڵێ" : "نەخێر"}`,
  settingsCaptionButton: (style) => `✍️ دەق: ${{ full: "تەواو", short: "کورت", none: "هیچ" }[style] ?? style}`,
  settingsQualityButton: (mode) => `🎞 کوالیتی: ${mode === "max" ? "بەرزترین" : "720p"}`,
  settingsLongButton: (on) => `⏱ ڤیدیۆی درێژ: ${on ? "بەڵێ" : "تا 15 خولەک"}`,
  settingsDoneButton: "✅ تەواو",
  settingsAdminsOnly: "تەنها ئەدمینەکانی گرووپ دەتوانن ڕێکخستنەکان بگۆڕن.",
  settingsGroupsOnly: "ڕێکخستنەکان بۆ گرووپەکانن: زیادم بکە بۆ گرووپێک و لەوێ ‎/settings بنێرە.",
  settingsFailed: "نەتوانرا ڕێکخستنەکان پاشەکەوت بکرێن، تکایە دووبارە هەوڵ بدەرەوە.",
  settingsCookiesButton: (by) => `🔑 بەستنەوەی هەژمار: ${by === "all" ? "هەمووان" : "ئەدمینەکان"}`,
  accountsIntro:
    "🔑 هەژمارە بەستراوەکان\n\nبۆتەکە دەتوانێت ئەو شتانەی تەنها کەسانی چووەژوورەوە دەیبینن (ستۆرییەکانی Instagram، پۆستە تایبەتەکان) بە هەژمارەکەی تۆ دابگرێت. هەر چوونەژوورەوەیەک لەو شوێنە کار دەکات کە لێی بەستراوەتەوە: ئەوەی لە چاتی تایبەتدا بەستراوەتەوە بۆ داگرتنەکانی خۆتە، لەوانەش بەستەرەکانی خۆت لەو گرووپانەی هەژماری خۆیان نییە؛ ئەوەی بە گرووپێکەوە بەستراوەتەوە بۆ هەموو ئەندامەکانی ئەو گرووپە کار دەکات.",
  accountsHowTo:
    "چۆن ببەستیتەوە:\n1. ئاسانترین ڕێگا: پێوەکراوی Videoner لەسەر کۆمپیوتەر — لە ماڵپەڕی پلاتفۆرمەکە بچۆ ژوورەوە، پەنجەرەی Videoner بکەرەوە، کرتە لە «🔑 هەژماری … بە بۆتەوە ببەستەوە» بکە و کۆدەکەم بۆ بنێرە. بۆ گرووپ، لە هەمان گرووپدا ‎/connect CODE بنێرە.\n2. یان فایلی cookies.txt (cookies هەناردەکراو لە وێبگەڕەوە) بۆم بنێرە، یان دەقەکەی وەک نامەیەک بلکێنە.\n3. بە مۆبایلێکی Android — بە Firefox و پێوەکراوی Cookie-Editor: https://videoner.download/ckb/blog/android-firefox",
  accountsWarning:
    "⚠️ پلاتفۆرمەکان حەزیان لە داگرتنی خۆکاری نییە و لەوانەیە هەژمارەکە سنووردار یان قەدەغە بکەن. باشترە هەژمارێکی لاوەکی ببەستیتەوە، نەک هەژمارە سەرەکییەکەت. cookies بە شێوەی شفرەکراو هەڵدەگیرێن، تەنها بۆ داگرتن بەکاردەهێنرێن، و بە دوگمەکانی خوارەوە دەسڕدرێنەوە.",
  accountsNone: "هێشتا هیچ شتێک نەبەستراوەتەوە.",
  accountsGroupTitle: "🔑 ئەو هەژمارانەی بەم گرووپەوە بەستراونەتەوە",
  accountsGroupHowTo:
    "بۆ بەستنەوەی هەژمارێک بۆ هەموو گرووپەکە: بە دوگمەی «🔑 هەژماری … بە بۆتەوە ببەستەوە» لە پێوەکراوی Videoner کۆدێک وەربگرە و لێرە ‎/connect CODE بنێرە. ئەگەر هەژمارێکت تەنها لە چاتی تایبەتی خۆت بەستووەتەوە، بۆتەکە لێرە بۆ بەستەرەکانی خۆت بەکاری دەهێنێت. بەستنەوەکانت: ‎/accounts لە چاتی تایبەت لەگەڵ ‎@VideonerBot.",
  accountsLine: (platform, where, active) => `• ${platform} — ${where}${active ? "" : " (⚠️ چوونەژوورەوە کار ناکات)"}`,
  accountsGroupLine: (platform, owner, active) => `• ${platform} — ${owner}${active ? "" : " (⚠️ چوونەژوورەوە کار ناکات)"}`,
  accountsWhereHere: "چاتی تایبەت",
  accountsWhereGroup: (title) => `گرووپی «${title}»`,
  accountsDeleteButton: (platform, where) => `🗑 ${platform} · ${where}`,
  accountsDeleteAllButton: "🗑 سڕینەوەی هەموو بەستنەوەکانم",
  accountsDeleted: "سڕایەوە.",
  accountsDeletedAll: (n) => `بەستنەوە سڕاوەکان: ${n}.`,
  accountsNotAllowed: "تەنها ئەو کەسەی بەستوویەتەوە یان ئەدمینێکی گرووپ دەتوانێت بیسڕێتەوە.",
  connectUsage:
    "‎/connect CODE بنێرە. دوگمەی «🔑 هەژماری … بە بۆتەوە ببەستەوە» لە پێوەکراوی Videoner لەسەر کۆمپیوتەر کۆدەکەت دەداتێ. بەستنەوەکانت: ‎/accounts.",
  connectOnlyAdmins: "تەنها ئەدمینەکان دەتوانن هەژمار بەم گرووپەوە ببەستنەوە (بڕوانە ‎/settings).",
  connectDone: (platform, where) =>
    `✅ ${platform} ${where} بەسترایەوە. ئێستا بۆتەکە ئەو شتانەش دادەگرێت کە تەنها کەسانی چووەژوورەوە دەیبینن. بینین یان سڕینەوە: ‎/accounts.\n\n⚠️ لەوانەیە پلاتفۆرمەکە بەهۆی داگرتنی خۆکارییەوە هەژمارەکە سنووردار بکات — باشترە هەژمارێکی لاوەکی بەکاربهێنیت.`,
  connectWhereGroup: "بەم گرووپەوە",
  connectWhereHere: "بۆ داگرتنەکانت لە چاتی تایبەت و دۆخی inline",
  connectCodeNotFound: "کۆدەکە نەدۆزرایەوە یان ماوەی بەسەرچووە (کۆدەکان 10 خولەک کار دەکەن). کۆدێکی نوێ لە پێوەکراوی Videoner وەربگرە.",
  connectRejectedNoSession: "لەم cookies ـانەدا هیچ چوونەژوورەوەیەک نییە. لە ماڵپەڕی پلاتفۆرمەکە بچۆ ژوورەوە و cookies دووبارە هەناردە بکە.",
  connectRejectedUnknown: "هیچ cookies لە پلاتفۆرمە پشتگیریکراوەکان نەدۆزرایەوە: Instagram، Facebook، YouTube، X، VK، TikTok.",
  connectUnavailable: "بەستنەوەی هەژمار هێشتا بەردەست نییە.",
  connectFailed: "نەتوانرا ببەسترێتەوە، تکایە دووبارە هەوڵ بدەرەوە.",
  connectFileTooBig: "فایلەکە زۆر گەورەیە — تەنها cookies لەو ماڵپەڕەی پێویستە هەناردە بکە.",
  connectNotAnonymous: "هەژمارەکە بە ناوی خۆتەوە ببەستەوە، نەک بێ ناو وەک گرووپەکە: ئەگینا بەستنەوەکانی ئەدمینەکان تێکەڵ دەبن. کۆدەکەم لەناوبرد — کۆدێکی نوێ وەربگرە.",
  connectCodeInGroup:
    "کۆدی بەستنەوە کە لە چاتی گرووپدا بڵاو بکرێتەوە، کەسانی تریش دەتوانن بیبینن — لەناوم برد و نامەکەم سڕییەوە. کۆدێکی نوێ وەربگرە و بە ‎/connect CODE بینێرە: نامەی ئەو فەرمانە یەکسەر دەسڕمەوە.",
  groupWelcome:
    "👋 سڵاو! لەم چاتەدا بەستەری ڤیدیۆ لە TikTok، Instagram، YouTube، VK و پلاتفۆرمەکانی تر بنێرە — بە خودی ڤیدیۆکە وەڵام دەدەمەوە.\n\n" +
    "کلیپی تا 15 خولەک خۆم دادەگرم، بەبێ هیچ فەرمانێک، و جگە لەوە بێدەنگ دەمێنم.\n\n⚙️ ئەدمینەکانی گرووپ دەتوانن بە ‎/settings ڕێکم بخەن: سڕینەوەی نامەی بەستەرەکان، شێوەی دەق، کوالیتی، ڤیدیۆی درێژ و زمان.\n\n⚡ لە دوای بەستەرێک -audio بنووسە بۆ وەرگرتنی دەنگ، یان -hd بۆ باشترین کوالیتی.\n\n📣 هەواڵەکانی پڕۆژە: ‎@videonerdownload",
  errorTooLong: "ڤیدیۆکە زۆر درێژە — هێشتا ناتوانین ڤیدیۆی ئەوەندە درێژ دابگرین.",
  errorUnknown: "نەتوانرا ئەم ڤیدیۆیە دابگیرێت. کەمێکی تر دووبارە هەوڵ بدەرەوە یان بەستەرێکی تر بنێرە.",
  inlineHintButton: "بەستەرێک بۆ بۆتەکە بنێرە",
  inlineResultTitle: "⬇️ داگرتنی ڤیدیۆ",
  inlineResultDescription: "ڤیدیۆکە ڕاستەوخۆ لەم چاتەدا دەنێردرێت",
  inlinePlaceholder: "⏬ دادەگیرێت، لەوانەیە چەند خولەکێک بخایەنێت...",
  inlineOpenBot: "کردنەوەی بۆت",
  inlineOnlySingleVideo:
    "ئەم دۆخە تەنها یەک ڤیدیۆ دەنێرێت. بۆ پۆستی چەند فایلی یان وێنە، بەستەرەکە لە چاتی تایبەتدا بۆ بۆتەکە بنێرە.",
  inlineSubscribeRequired: (channel: string) =>
    `بۆ داگرتن، بەشداری ${channel} بکە و دووبارە هەوڵ بدەرەوە.`,
  inlineRateLimited: "داواکاریی زۆر لە دوای یەک. خولەکێک چاوەڕێ بکە و دووبارە هەوڵ بدەرەوە.",
  queueRest: (count) => `\n\n📋 بەستەرەکانی ماوە لە ڕیزدا: ${count}. دوای ئەمە یەک بە یەک پیشانیان دەدەم.`,
  queuedOne: (position) =>
    `📋 بەستەرەکە خرایە ڕیزەوە، ژمارە ${position}. با سەرەتا ئەمەی ئێستا تەواو بکەین — پاشان هەڵبژاردنی کوالیتیت بۆ پیشان دەدەم.`,
  queuedMany: (added, waiting) =>
    `📋 بەستەری زیادکراو بۆ ڕیز: ${added}. کۆی چاوەڕوانکراو: ${waiting}. دوای ئەمەی ئێستا یەک بە یەک پیشانیان دەدەم.`,
  queueDuplicates: (count) =>
    count === 1
      ? "ئەم بەستەرە پێشتر لە ڕیزدایە — دوو جار زیادی ناکەم."
      : `ئەو بەستەرانەی پێشتر لە ڕیزدان دوو جار زیاد ناکرێن (دووبارەکان: ${count}).`,
  queueFull: (limit, rejected) =>
    `ڕیزەکە زۆرترین ${limit} بەستەر دەگرێت — بەستەرە زیادەکان زیاد نەکران (${rejected}). کاتێک ڕیزەکە پێشکەوت بیاننێرە.`,
  skipButton: "✖️ دایمەگرە",
  skipped: "⏭ ئەم بەستەرە تێپەڕێنرا.",
  chooseTimedOut: "⌛ لە ماوەی 30 خولەکدا هیچ کوالیتییەک هەڵنەبژێردرا — ئەم بەستەرە تێدەپەڕێنم.",
  queueLostOnRestart: (count) =>
    `⚠️ بۆتەکە بۆ نوێکردنەوە دەستپێدەکاتەوە — ڕیزەکە سفر کرایەوە (بەستەرەکان: ${count}). تکایە دوای خولەکێک دووبارە بیاننێرە.`,
  subtitlesButton: "📝 ژێرنووس",
  subtitlesBack: "⬅️ گەڕانەوە بۆ کوالیتی",
  subtitlesAuto: "خۆکار",
  subtitlesChoose: "زمانی ژێرنووس هەڵبژێرە",
  subtitlesPreparing: "📝 ژێرنووس ئامادە دەکرێت...",
  subtitlesFailed: "نەتوانرا ژێرنووس بەم زمانە دابگیرێت. زمانێکی تر تاقی بکەرەوە.",
  subtitlesBusy: "YouTube ئێستا ژێرنووس نادات — دوای چەند خولەکێک دووبارە هەوڵ بدەرەوە.",
  playlistFound: (title, count) =>
    `📃 پلەیلیست${title ? ` «${title.slice(0, 150)}»` : ""}: ${count} ڤیدیۆ.\nیەک بە یەک دایاندەگرم. بە چ فۆرماتێک؟`,
  playlistStdButton: "🎬 720p",
  playlistHdButton: "🎬 باشترین کوالیتی",
  playlistAudioButton: "🎵 تەنها دەنگ (mp3)",
  playlistNoButton: "✖️ نەخێر، سوپاس",
  playlistQueued: (count) =>
    `📃 ڤیدیۆکانی پلەیلیست کە خرانە ڕیزەوە: ${count}. یەک بە یەک دەیاننێرم. بە دوگمەی خوارەوە یان ‎/stop ڕایبگرە.`,
  playlistFailed: "نەتوانرا پلەیلیستەکە بکرێتەوە — لەوانەیە تایبەت بێت. بەستەری تاکە ڤیدیۆیەک بنێرە.",
  stopButton: "⏹ ڕاگرتن",
  stopped: (dropped) => `⏹ ڕاگیرا.${dropped ? ` بەستەرە لابراوەکان لە ڕیز: ${dropped}.` : ""}`,
  nothingToStop: "لە ئێستادا هیچ داگرتنێک لە ئارادا نییە.",
  languageChoose: "🌐 زمانی بۆت هەڵبژێرە. «خۆکار» شوێن زمانی Telegram ـەکەت دەکەوێت.",
  languageChooseGroup: "🌐 زمانی وەڵامەکانی بۆت لەم گرووپەدا. «خۆکار» — زمانی Telegram ـی هەر ئەندامێک.",
  languageAuto: "خۆکار — وەک لە Telegram",
  languageAutoGroup: "خۆکار — زمانی خودی هەر ئەندامێک",
  languageSaved: (name) => `✅ زمانی بۆت: ${name}. بە ‎/language بیگۆڕە.`,
  languageSavedAuto: "✅ بۆتەکە شوێن زمانی Telegram ـەکەت دەکەوێت. بە ‎/language بیگۆڕە.",
  settingsLanguageButton: (name) => `🌐 زمان: ${name ?? "خۆکار"}`,
  settingsBack: "⬅️ گەڕانەوە بۆ ڕێکخستنەکان",
};

const tl: Messages = {
  start: "Hi! Magpadala ng link ng video mula sa YouTube, TikTok, Instagram, Facebook, Twitter/X, Vimeo, VK, Rutube, OK.ru, Pinterest, o Threads — tutulungan kitang i-download ito.\n\n✨ Walang limit sa quality: makukuha mo ang anumang inaalok ng platform, hanggang 4K — basta kasya ang file sa 2 GB, ang limit ng Telegram para sa mga bot. Walang bayad na feature dito.\n\nLibreng-libre: walang subscription, walang ads, walang in-app purchase.\n\n🧩 Magda-download sa computer? I-install ang browser extension — lalabas ang Download button mismo sa page ng video: videoner.download/tl/extension\n\n👥 Idagdag ako sa isang group at ipo-post ko ang mga video ng mga link na ibinabahagi roon.\n\n⚡ Laktawan ang pagpili ng quality: idagdag ang -audio pagkatapos ng link para sa tunog lang (mp3), o -hd para sa pinakamagandang quality.\n\n📣 Balita ng proyekto: @videonerdownload\n\n🌐 Wika ng bot: /language",
  notLink: "Mukhang hindi ito link. Magpadala ng link ng video.",
  inviteGreeting: "Hi! Ako si Videoner — nagda-download ako ng mga video mula sa YouTube, TikTok, Instagram at iba pang platform nang libre. Inihahanda ko na ang video na ibinahagi sa iyo 👇",
  inviteNotFound: "Wala akong nahanap na video para sa invite link na ito. Magpadala ng link ng video at ida-download ko ito.",
  inviteUnavailable: "Hindi ko mabuksan ang video mula sa link na ito — hindi sumasagot ang serbisyo ngayon. Buksan ulit ang parehong link pagkalipas ng isang minuto.",
  fetchingInfo: "🔍 Kinukuha ang impormasyon ng video...",
  audioOnlyButton: "🎵 Audio lang (mp3)",
  photoButton: "📷 I-download ang mga larawan",
  slideshowButton: "🎞 Slideshow (video)",
  galleryButton: "📷+🎞 Mga larawan at slideshow",
  chooseQuality: (title, duration) => `“${title}”${duration ? `\n⏱ ${duration}` : ""}\n\nPumili ng quality:`,
  sessionExpired: "Nag-expire na ang session — ipadala ulit ang link",
  downloading: "⏬ Nagda-download, maaaring tumagal ito ng ilang minuto...",
  downloadFailed: "hindi na-download",
  downloadProgress: (percent, eta, done) =>
    `⏬ Nagda-download: ${percent}%${eta ? ` · ${eta} pa` : ""}${done ? `\n${done}` : ""}`,
  downloadFinishing: "⚙️ Malapit nang matapos — binubuo ang file...",
  converting: (percent) => `⚙️ Kino-convert: ${percent}%`,
  etaUnderMinute: "wala pang isang minuto",
  etaMinutes: (minutes) => `~${minutes} min`,
  etaHours: (hours, minutes) => `~${hours} oras${minutes ? ` ${minutes} min` : ""}`,
  downloadTimeout: "masyadong matagal ang pag-download — mukhang napakabigat ng video. Subukan ang mas mababang quality.",
  downloadInterrupted: "⚠️ Nagre-restart ang bot para sa update — naputol ang iyong download. Pakipadala ulit ang link pagkalipas ng isang minuto.",
  fileTooBig: (mb, url) =>
    `Lumabas na malaki ang file (${mb} MB) — hindi ito pinapayagan ng Telegram na ipadala ng bot.\nI-download ito rito: ${url}`,
  sendingFile: "📤 Ipinapadala ang file...",
  sendingAlbum: (count) => `📤 May ilang file ang post na ito (${count}) — ipinapadala bilang album...`,
  failedPrefix: "❌ Hindi nagtagumpay: ",
  fileCaption: (title, sourceUrl, shareUrl, description) =>
    composeCaption(
      title,
      description,
      `Source: ${sourceUrl}\n` +
        "Ang lahat ng karapatan sa video ay pag-aari ng gumawa nito.\n" +
        "Na-download nang libre gamit ang @VideonerBot",
      `📣 Balita ng proyekto: ${NEWS_CHANNEL}`,
      shareUrl && `🔗 I-share: ${shareUrl}`,
    ),
  subscribeRequired: (channel) =>
    `Para makapag-download, mag-subscribe sa aming channel na ${channel} — iyan lang ang kondisyon, mananatiling libre ang serbisyo.\n\n` +
    "Mag-subscribe at pindutin ang “Nag-subscribe na ako”.",
  openChannelButton: "📣 Buksan ang channel",
  checkSubscriptionButton: "Nag-subscribe na ako",
  subscribeThanks: "Salamat! Ngayon, magpadala ng link ng video.",
  subscribeThanksResuming: "Salamat! Ipinagpapatuloy ko na ang iyong link.",
  subscribeStillMissing: "Hindi ko pa nakikita ang subscription. Mag-subscribe at pindutin ulit.",
  channelNotice: (channel) => `\n\nLalabas ang link ng post na ito sa ${channel} — anonymous, nang wala ang pangalan mo.`,
  channelPost: (title, url) =>
    (title ? `🎬 ${title.slice(0, 200)}\n\n` : "") +
    `${url}\n\n` +
    "I-download ito at anumang ibang video nang libre: @VideonerBot",
  errorStoryNeedsId:
    "magpadala ng link ng isang partikular na story: buksan ito sa Instagram app at i-tap ang Share → Copy link.",
  errorInstagramStory:
    "Ang mga Instagram story ay nakikita lang ng mga naka-sign in.",
  errorLoginRequired:
    "Hindi available ang post na ito nang hindi naka-sign in: ibinibigay lang ito ng platform " +
    "sa mga naka-log in. Nangyayari ito sa mga private post, content na may age restriction at " +
    "mga post na ibinahagi sa limitadong audience.\n\n" +
    "Walang problema sa pag-download ng mga public post — subukan ang ibang link.",
  errorUnsupportedPlatform:
    "Hindi ko makilala ang link na iyan — siguraduhing direktang link ito ng video mula sa YouTube, TikTok, Instagram, Facebook, Twitter/X, Vimeo, VK, Rutube, OK.ru, Pinterest, o Threads.",
  errorFileTooLarge: "lampas sa 2 GB ang file — hindi pinapayagan ng Telegram ang mga bot na magpadala ng mas malalaking file. I-download ito sa website o gamit ang browser extension — nasa ibaba ang mga button. O ipadala ulit ang link at pumili ng mas mababang quality.",
  siteButton: "🌐 I-download sa website",
  qualitiesHiddenBySize: (limit) =>
    `\n\n⚖️ Nakatago ang mga quality na mas mabigat sa ${limit}: hindi pinapayagan ng Telegram ang mga bot na magpadala ng mas malalaking file. Maaari mo silang i-download sa website o gamit ang browser extension — nasa ibaba ang mga button.`,
  videoTooBigForTelegram: (smallest) =>
    `\n\n⚖️ Masyadong mabigat ang video na ito para sa Telegram kahit sa pinakamababang quality (~${smallest}): hindi pinapayagan ng Telegram ang mga bot na magpadala ng file na lampas sa 2 GB. Dito, audio lang ang makukuha mo; ang video — sa website o gamit ang browser extension (nasa ibaba ang mga button).`,
  errorFormatUnavailable: "Hindi available ang quality na iyan para sa video na ito. Ipadala ulit ang link — ipapakita ko ang kasalukuyang listahan.",
  errorNoVideoContent: "Walang video na mada-download sa link na ito — mukhang puro larawan ang post.",
  errorRegionBlocked:
    "Naka-block ang video na ito sa labas ng bansa ng gumawa — hindi ito ibinibigay ng platform " +
    "sa aming server. Walang paraan para malusutan ito: nasa panig nila ang restriction." +
    "\n\nNormal na nada-download ang ibang mga link.",
  errorRateLimited: "Masyadong maraming link nang sunud-sunod — maghintay sandali at ipadala ulit.",
  errorYoutubeDailyLimit: (gb) => `nakapag-download ka na ng higit sa ${gb} GB mula sa YouTube sa nakalipas na 24 oras — iyan ang daily limit ng bot bawat tao. Binibilang nito ang huling 24 oras, kaya makakapag-download ka ulit ng mga bagong YouTube video mamaya-maya. Normal na gumagana ang ibang platform.`,
  playlistStoppedByLimit: (dropped) => `⏹ Itinigil ang playlist: naabot na ang daily limit sa YouTube. Mga video na hindi na-download: ${dropped}. Ipadala ulit ang link ng playlist mamaya.`,
  errorPlatformRefused:
    "hindi ibinigay ng platform ang video na ito sa aming server. Nangyayari ito sa mga private " +
    "post o may age restriction, at kung minsan ay pansamantalang nililimitahan lang ng platform " +
    "ang access. Subukan ulit pagkalipas ng ilang minuto.",
  errorThreadsNoMedia:
    "walang nakikitang video o larawan sa Threads post na ito. Maaaring text lang ang post, o " +
    "ipinapakita lang ng Threads ang media nito sa mga naka-sign in — hindi mada-download ang ganitong mga post nang hindi naka-log in.",
  extensionHint:
    "\n\n💻 Maaari mo itong i-download gamit ang Videoner browser extension sa computer: " +
    "nagda-download ito gamit ang sarili mong sign-in sa platform, at walang password o cookies na lumalabas sa iyong browser.",
  privateConnectHint: (platform, withExtension) =>
    `\n\n🔑 Para ma-download ang mga ganitong post, i-connect ang iyong ${platform} account sa bot — isang beses lang. Pagkatapos noon, ida-download ng bot ang anumang nakikita mo: mga private post, reels at stories, pati mula sa iyong phone. Ipinapakita ng button sa ibaba kung paano.${withExtension ? "\n\n💻 O i-download ito gamit ang Videoner browser extension sa computer." : ""}`,
  privateReconnectHint: (platform, withExtension) =>
    `\n\n⚠️ Hindi mabuksan ng naka-connect mong ${platform} account ang post na ito. Maaaring hindi na gumagana ang login — i-connect ulit ang account. O walang access ang account na ito sa post.${withExtension ? "\n\n💻 Maaari mo rin itong i-download gamit ang Videoner browser extension sa computer." : ""}`,
  connectAccountButton: "🔑 I-connect ang account",
  reconnectAccountButton: "🔑 I-connect ulit",
  extensionButton: "🧩 I-download gamit ang extension",
  extensionCommand:
    "🧩 Videoner para sa iyong browser: may Download button mismo sa page ng video — YouTube, Instagram, TikTok, VK, mga private video mula sa iyong account at mga lesson sa GetCourse.\n\nPara sa Chrome, Edge, Opera, Yandex Browser at Firefox sa computer.",
  extensionPageButton: "🧩 I-install ang extension",
  addToGroupButton: "👥 Idagdag sa group",
  newsButton: "📣 Balita ng proyekto",
  fileCaptionShort: (title, sourceUrl) =>
    withOptionalLines((title ? `🎬 ${title.slice(0, 200)}\n\n` : "") + sourceUrl, `📣 Balita ng proyekto: ${NEWS_CHANNEL}`, undefined),
  sentBy: (name) => `👤 ${name}`,
  groupSettings: (s, canDelete) =>
    "⚙️ Mga setting ng bot para sa group na ito\n\n" +
    `🗑 Burahin ang mensaheng may link: ${s.deleteLinks ? "oo" : "hindi"}\n` +
    "Kapag naipadala na ang video, buburahin ang mensaheng link lang ang laman — ang video na lang ang matitira sa chat, kasama ang pangalan ng nagbahagi nito.\n" +
    (s.deleteLinks && !canDelete
      ? "⚠️ Hindi ako makapagbura ng mga mensahe ngayon: gawin akong admin na may karapatang “Delete messages”.\n"
      : "") +
    `\n✍️ Caption sa ilalim ng video: ${{ full: "buo", short: "pamagat at source", none: "walang caption" }[s.caption] ?? s.caption}\n` +
    `\n🎞 Quality: ${s.quality === "max" ? "ang pinakamataas na tinatanggap ng Telegram" : "standard (720p)"}\n` +
    `\n⏱ Mahahabang video: ${s.longVideos ? "kahit gaano kahaba" : "hanggang 15 minuto lang"}\n` +
    `\n🔑 Sino ang puwedeng mag-connect ng kanilang account (para sa stories at private post): ${s.cookiesBy === "all" ? "sinumang miyembro" : "mga admin lang"}\n` +
    `\n🌐 Wika ng mga sagot: ${s.language ? langName(s.language) : "sariling wika ng bawat miyembro"}\n` +
    "\nAng mga admin lang ng group ang puwedeng magbago ng mga setting.",
  settingsDeleteButton: (on) => `🗑 Burahin ang mga link: ${on ? "oo" : "hindi"}`,
  settingsCaptionButton: (style) => `✍️ Caption: ${{ full: "buo", short: "maikli", none: "wala" }[style] ?? style}`,
  settingsQualityButton: (mode) => `🎞 Quality: ${mode === "max" ? "pinakamataas" : "720p"}`,
  settingsLongButton: (on) => `⏱ Mahahabang video: ${on ? "oo" : "hanggang 15 min"}`,
  settingsDoneButton: "✅ Tapos na",
  settingsAdminsOnly: "Ang mga admin lang ng group ang puwedeng magbago ng mga setting.",
  settingsGroupsOnly: "Para sa mga group ang settings: idagdag ako sa isang group at ipadala roon ang /settings.",
  settingsFailed: "Hindi na-save ang mga setting, pakisubukan ulit.",
  settingsCookiesButton: (by) => `🔑 Pag-connect ng account: ${by === "all" ? "lahat" : "mga admin"}`,
  accountsIntro:
    "🔑 Mga naka-connect na account\n\nKayang i-download ng bot ang nakikita lang ng mga naka-sign in (Instagram stories, private post) — gamit ang iyong account. Gumagana ang login kung saan mo ito ini-connect: ang nasa private chat ay para sa iyong mga download, kasama ang sarili mong mga link sa mga group na walang sariling account; ang naka-connect sa isang group ay para sa lahat ng miyembro nito.",
  accountsHowTo:
    "Paano mag-connect:\n1. Pinakamadali: ang Videoner extension sa computer — mag-sign in sa site ng platform, buksan ang popup ng Videoner, pindutin ang «🔑 I-connect ang iyong … account sa bot» at ipadala sa akin ang code. Para sa group, ipadala ang /connect CODE sa group na iyon.\n2. O magpadala sa akin ng cookies.txt file (cookies na na-export mula sa browser), o i-paste ang laman nito bilang mensahe.\n3. Mula sa Android phone — gamit ang Firefox at ang Cookie-Editor add-on: https://videoner.download/tl/blog/android-firefox",
  accountsWarning:
    "⚠️ Ayaw ng mga platform sa automated na pag-download at maaari nilang limitahan o i-ban ang account. Mas mabuting mag-connect ng secondary account, hindi ang main mo. Naka-encrypt ang pag-store ng cookies, ginagamit lang para sa mga download, at natatanggal gamit ang mga button sa ibaba.",
  accountsNone: "Wala pang naka-connect.",
  accountsGroupTitle: "🔑 Mga account na naka-connect sa group na ito",
  accountsGroupHowTo:
    "Para mag-connect para sa buong group: kumuha ng code gamit ang button na «🔑 I-connect ang iyong … account sa bot» sa Videoner extension at ipadala rito ang /connect CODE. Kung sa private chat mo lang ini-connect ang isang account, gagamitin ito ng bot dito para sa sarili mong mga link. Ang iyong mga connection: /accounts sa private chat kasama ang @VideonerBot.",
  accountsLine: (platform, where, active) => `• ${platform} — ${where}${active ? "" : " (⚠️ hindi gumagana ang login)"}`,
  accountsGroupLine: (platform, owner, active) => `• ${platform} — ${owner}${active ? "" : " (⚠️ hindi gumagana ang login)"}`,
  accountsWhereHere: "private chat",
  accountsWhereGroup: (title) => `group na “${title}”`,
  accountsDeleteButton: (platform, where) => `🗑 ${platform} · ${where}`,
  accountsDeleteAllButton: "🗑 Tanggalin lahat ng aking connection",
  accountsDeleted: "Natanggal na.",
  accountsDeletedAll: (n) => `Mga natanggal na connection: ${n}.`,
  accountsNotAllowed: "Ang nag-connect lang o isang admin ng group ang puwedeng magtanggal nito.",
  connectUsage:
    "Ipadala ang /connect CODE. Makukuha mo ang code sa button na «🔑 I-connect ang iyong … account sa bot» sa Videoner extension sa computer. Ang iyong mga connection: /accounts.",
  connectOnlyAdmins: "Mga admin lang ang puwedeng mag-connect ng account sa group na ito (tingnan ang /settings).",
  connectDone: (platform, where) =>
    `✅ Naka-connect na ang ${platform} ${where}. Dina-download na rin ngayon ng bot ang nakikita lang ng mga naka-sign in. Tingnan o tanggalin: /accounts.\n\n⚠️ Maaaring limitahan ng platform ang account dahil sa automated na pag-download — mas mabuting gumamit ng secondary account.`,
  connectWhereGroup: "sa group na ito",
  connectWhereHere: "para sa iyong mga download sa private chat at inline mode",
  connectCodeNotFound: "Hindi nahanap o nag-expire na ang code (10 minuto lang tumatagal ang mga code). Kumuha ng bago sa Videoner extension.",
  connectRejectedNoSession: "Walang login ang mga cookies na ito. Mag-sign in sa site ng platform at i-export ulit ang cookies.",
  connectRejectedUnknown: "Walang nahanap na cookies ng mga suportadong platform: Instagram, Facebook, YouTube, X, VK, TikTok.",
  connectUnavailable: "Hindi pa available ang pag-connect ng account.",
  connectFailed: "Hindi na-connect, pakisubukan ulit.",
  connectFileTooBig: "Masyadong malaki ang file — i-export lang ang cookies ng kailangang site.",
  connectNotAnonymous: "I-connect ang account bilang ikaw mismo, hindi nang anonymous bilang group: kung hindi, magkakahalo ang mga connection ng mga admin. Sinira ko na ang code — kumuha ng bago.",
  connectCodeInGroup:
    "Nakikita ng iba ang connection code na ipinost sa group chat — sinira ko na ito at binura ang mensahe. Kumuha ng bago at ipadala ito gamit ang /connect CODE: agad kong binubura ang mensaheng may command na iyon.",
  groupWelcome:
    "👋 Hi! Mag-post ng mga link ng video mula sa TikTok, Instagram, YouTube, VK at iba pang platform sa chat na ito — sasagot ako ng mismong video.\n\n" +
    "Kusa kong dina-download ang mga clip na hanggang 15 minuto, hindi kailangan ng command, at tahimik lang ako sa ibang pagkakataon.\n\n⚙️ Maaari akong i-set up ng mga admin ng group gamit ang /settings: pagbura ng mga mensaheng may link, istilo ng caption, quality, mahahabang video at wika.\n\n⚡ Idagdag ang -audio pagkatapos ng link para sa tunog, o -hd para sa pinakamagandang quality.\n\n📣 Balita ng proyekto: @videonerdownload",
  errorTooLong: "masyadong mahaba ang video — hindi pa namin kayang i-download ang ganito kahabang video.",
  errorUnknown: "hindi ma-download ang video na ito. Subukan ulit mamaya-maya o magpadala ng ibang link.",
  inlineHintButton: "Magpadala ng link sa bot",
  inlineResultTitle: "⬇️ I-download ang video",
  inlineResultDescription: "Ipo-post ang video mismo sa chat na ito",
  inlinePlaceholder: "⏬ Nagda-download, maaaring tumagal ito ng ilang minuto...",
  inlineOpenBot: "Buksan ang bot",
  inlineOnlySingleVideo:
    "Isang video lang ang ipinapadala ng mode na ito. Para sa mga post na may ilang file o mga larawan, ipadala ang link sa bot sa private chat.",
  inlineSubscribeRequired: (channel: string) =>
    `Para makapag-download, mag-subscribe sa ${channel} at subukan ulit.`,
  inlineRateLimited: "Masyadong maraming request nang sunud-sunod. Maghintay ng isang minuto at subukan ulit.",
  queueRest: (count) => `\n\n📋 Mga link na nasa queue pa: ${count}. Ipapakita ko sila isa-isa pagkatapos nito.`,
  queuedOne: (position) =>
    `📋 Nasa queue na ang link, #${position}. Tapusin muna natin ang kasalukuyan — saka ko ipapakita ang pagpili ng quality para rito.`,
  queuedMany: (added, waiting) =>
    `📋 Mga link na naidagdag sa queue: ${added}. Kabuuang naghihintay: ${waiting}. Ipapakita ko sila isa-isa pagkatapos ng kasalukuyan.`,
  queueDuplicates: (count) =>
    count === 1
      ? "Nasa queue na ang link na ito — hindi ko na ito idadagdag ulit."
      : `Hindi na idinadagdag ulit ang mga link na nasa queue na (mga ulit: ${count}).`,
  queueFull: (limit, rejected) =>
    `Hanggang ${limit} link lang ang kasya sa queue — hindi naidagdag ang mga sobra (${rejected}). Ipadala sila kapag umusad na ang queue.`,
  skipButton: "✖️ Huwag i-download",
  skipped: "⏭ Nilaktawan ang link na ito.",
  chooseTimedOut: "⌛ Walang napiling quality sa loob ng 30 minuto — nilalaktawan ang link na ito.",
  queueLostOnRestart: (count) =>
    `⚠️ Nagre-restart ang bot para sa update — na-reset ang queue (mga link: ${count}). Pakipadala ulit sila pagkalipas ng isang minuto.`,
  subtitlesButton: "📝 Subtitles",
  subtitlesBack: "⬅️ Bumalik sa quality",
  subtitlesAuto: "auto",
  subtitlesChoose: "Pumili ng wika ng subtitles",
  subtitlesPreparing: "📝 Inihahanda ang subtitles...",
  subtitlesFailed: "Hindi ma-download ang subtitles sa wikang ito. Subukan ang ibang wika.",
  subtitlesBusy: "Hindi nagbibigay ng subtitles ang YouTube ngayon — subukan ulit pagkalipas ng ilang minuto.",
  playlistFound: (title, count) =>
    `📃 Playlist${title ? ` “${title.slice(0, 150)}”` : ""}: ${count} video.\nIda-download ko sila isa-isa. Anong format?`,
  playlistStdButton: "🎬 720p",
  playlistHdButton: "🎬 Pinakamagandang quality",
  playlistAudioButton: "🎵 Audio lang (mp3)",
  playlistNoButton: "✖️ Hindi, salamat",
  playlistQueued: (count) =>
    `📃 Mga video mula sa playlist na nasa queue: ${count}. Ipapadala ko sila isa-isa. Ihinto gamit ang button sa ibaba o /stop.`,
  playlistFailed: "Hindi mabuksan ang playlist — maaaring private ito. Magpadala ng link ng isang video.",
  stopButton: "⏹ Ihinto",
  stopped: (dropped) => `⏹ Itinigil na.${dropped ? ` Mga link na tinanggal sa queue: ${dropped}.` : ""}`,
  nothingToStop: "Walang nagda-download ngayon.",
  languageChoose: "🌐 Pumili ng wika ng bot. Sinusunod ng “Auto” ang iyong Telegram.",
  languageChooseGroup: "🌐 Wika ng mga sagot ng bot sa group na ito. “Auto” — ang wika ng Telegram ng bawat miyembro.",
  languageAuto: "Auto — gaya ng sa Telegram",
  languageAutoGroup: "Auto — sariling wika ng bawat miyembro",
  languageSaved: (name) => `✅ Wika ng bot: ${name}. Palitan ito gamit ang /language.`,
  languageSavedAuto: "✅ Sinusunod ng bot ang wika ng iyong Telegram. Palitan ito gamit ang /language.",
  settingsLanguageButton: (name) => `🌐 Wika: ${name ?? "auto"}`,
  settingsBack: "⬅️ Bumalik sa settings",
};

const uk: Messages = {
  start: "Привіт! Надішли мені посилання на відео з YouTube, TikTok, Instagram, Facebook, Twitter/X, Vimeo, VK, Rutube, OK.ru, Pinterest або Threads — я допоможу його завантажити.\n\n✨ Якість нічим не обмежена: віддам усе, що є на платформі, аж до 4K — аби файл вмістився у 2 ГБ, більше Telegram боту надіслати не дає. Платних функцій тут немає взагалі.\n\nПовністю безкоштовно: без підписок, без реклами, без вбудованих покупок.\n\n🧩 Завантажуєте на комп'ютері? Встановіть розширення для браузера — кнопка «Завантажити» з'явиться прямо на сторінці відео: videoner.download/uk/extension\n\n👥 Додайте мене в групу — сам надсилатиму відео за посиланнями, які там публікують.\n\n⚡ Без вибору якості: допишіть після посилання -audio — надішлю звук (mp3), -hd — відео в найкращій якості.\n\n📣 Новини проєкту: @videonerdownload\n\n🌐 Мова бота: /language",
  notLink: "Це не схоже на посилання. Надішли посилання на відео.",
  inviteGreeting: "Привіт! Я Videoner — безкоштовно завантажую відео з YouTube, TikTok, Instagram та інших платформ. Зараз підготую відео, яким із тобою поділилися 👇",
  inviteNotFound: "Не знайшов відео за цим посиланням-запрошенням. Надішли мені посилання на відео — і я його завантажу.",
  inviteUnavailable: "Не вдалося відкрити відео за посиланням — сервіс зараз не відповідає. Відкрий те саме посилання ще раз за хвилину.",
  fetchingInfo: "🔍 Отримую інформацію про відео...",
  audioOnlyButton: "🎵 Лише аудіо (mp3)",
  photoButton: "📷 Завантажити фото",
  slideshowButton: "🎞 Слайдшоу (відео)",
  galleryButton: "📷+🎞 Фото й слайдшоу",
  chooseQuality: (title, duration) => `«${title}»${duration ? `\n⏱ ${duration}` : ""}\n\nОбери якість:`,
  sessionExpired: "Сесія застаріла — надішли посилання ще раз",
  downloading: "⏬ Завантажую, це може зайняти пару хвилин...",
  downloadFailed: "завантаження завершилося помилкою",
  downloadProgress: (percent, eta, done) =>
    `⏬ Завантажую: ${percent}%${eta ? ` · залишилося ${eta}` : ""}${done ? `\n${done}` : ""}`,
  downloadFinishing: "⚙️ Майже готово — збираю файл...",
  converting: (percent) => `⚙️ Конвертую: ${percent}%`,
  etaUnderMinute: "менше хвилини",
  etaMinutes: (minutes) => `~${minutes} хв`,
  etaHours: (hours, minutes) => `~${hours} год${minutes ? ` ${minutes} хв` : ""}`,
  downloadTimeout: "завантаження триває надто довго — відео, схоже, дуже важке. Спробуй якість нижчу.",
  downloadInterrupted: "⚠️ Бот оновлюється й має перезапуститися — завантаження перервано. Надішли посилання ще раз за хвилину.",
  fileTooBig: (mb, url) =>
    `Файл вийшов великим (${mb} МБ) — Telegram не дасть боту його надіслати.\nЗавантаж за посиланням: ${url}`,
  sendingFile: "📤 Надсилаю файл...",
  sendingAlbum: (count) => `📤 У дописі кілька файлів (${count}) — надсилаю альбомом...`,
  failedPrefix: "❌ Не вдалося: ",
  fileCaption: (title, sourceUrl, shareUrl, description) =>
    composeCaption(
      title,
      description,
      `Джерело: ${sourceUrl}\n` +
        "Права на відео належать його автору.\n" +
        "Завантажено безкоштовно через @VideonerBot",
      `📣 Новини проєкту: ${NEWS_CHANNEL}`,
      shareUrl && `🔗 Поділитися: ${shareUrl}`,
    ),
  subscribeRequired: (channel) =>
    `Щоб завантажувати, підпишіться на наш канал ${channel} — це єдина умова, сервіс лишається безкоштовним.\n\n` +
    "Підпишіться й натисніть «Я підписався».",
  openChannelButton: "📣 Відкрити канал",
  checkSubscriptionButton: "Я підписався",
  subscribeThanks: "Дякую! Тепер надішліть посилання на відео.",
  subscribeThanksResuming: "Дякую! Продовжую з вашим посиланням.",
  subscribeStillMissing: "Підписки поки не видно. Підпишіться й натисніть ще раз.",
  channelNotice: (channel) => `\n\nПосилання на цей допис з'явиться в каналі ${channel} — анонімно, без вашого імені.`,
  channelPost: (title, url) =>
    (title ? `🎬 ${title.slice(0, 200)}\n\n` : "") +
    `${url}\n\n` +
    "Завантажити це й будь-яке інше відео безкоштовно: @VideonerBot",
  errorStoryNeedsId:
    "надішліть посилання на конкретну сторіс: у застосунку Instagram відкрийте її й натисніть «Поділитися» → «Копіювати посилання».",
  errorInstagramStory:
    "сторіс Instagram видно лише тим, хто увійшов в акаунт.",
  errorLoginRequired:
    "Цей допис недоступний без входу в акаунт: платформа віддає його лише " +
    "авторизованим. Так буває з приватними дописами, віковими обмеженнями " +
    "й дописами для обмеженого кола.\n\n" +
    "Публічні дописи завантажуються без проблем — спробуйте інше посилання.",
  errorUnsupportedPlatform:
    "Не розпізнав посилання — перевір, що це пряме посилання на відео з YouTube, TikTok, Instagram, Facebook, Twitter/X, Vimeo, VK, Rutube, OK.ru, Pinterest або Threads.",
  errorFileTooLarge: "файл вийшов важчим за 2 ГБ — більші Telegram не дає ботам надсилати. Завантажте його на сайті або через розширення для браузера — кнопки нижче. Або надішліть посилання ще раз і оберіть якість нижчу.",
  siteButton: "🌐 Завантажити на сайті",
  qualitiesHiddenBySize: (limit) =>
    `\n\n⚖️ Якості важчі за ${limit} не показано: більші файли Telegram не дає ботам надсилати. Їх можна завантажити на сайті або через розширення для браузера — кнопки нижче.`,
  videoTooBigForTelegram: (smallest) =>
    `\n\n⚖️ Відео завелике для Telegram навіть у найнижчій якості (~${smallest}): понад 2 ГБ Telegram не дає ботам надсилати. Тут можна завантажити лише звук, а відео — на сайті або через розширення для браузера (кнопки нижче).`,
  errorFormatUnavailable: "Для цього відео немає такої якості. Надішли посилання ще раз — покажу актуальний список.",
  errorNoVideoContent: "За цим посиланням немає відео для завантаження — схоже, допис містить лише фото.",
  errorRegionBlocked:
    "Це відео закрите для перегляду за межами країни автора — платформа не " +
    "віддає його нашому серверу. Обійти це не можна: обмеження стоїть на боці " +
    "платформи.\n\nІнші посилання завантажуються як зазвичай.",
  errorRateLimited: "Забагато посилань поспіль — зачекай трохи й надішли знову.",
  errorYoutubeDailyLimit: (gb) => `за останню добу ви завантажили з YouTube понад ${gb} ГБ — це добовий ліміт бота на людину. Ліміт рахується за останні 24 години: нові відео з YouTube можна буде завантажити пізніше. Інші платформи працюють як завжди.`,
  playlistStoppedByLimit: (dropped) => `⏹ Плейлист зупинено: досягнуто добового ліміту YouTube. Не завантажено відео: ${dropped}. Надішліть посилання на плейлист пізніше.`,
  errorPlatformRefused:
    "платформа не віддала це відео нашому серверу. Так буває із закритими й " +
    "віковими публікаціями, а іноді платформа просто тимчасово обмежує " +
    "доступ. Спробуй ще раз за кілька хвилин.",
  errorThreadsNoMedia:
    "у цьому дописі Threads не видно ні відео, ні фото. Або це текстовий допис, або " +
    "Threads показує його медіа лише тим, хто увійшов в акаунт, — такі дописи без входу завантажити не можна.",
  extensionHint:
    "\n\n💻 Таке відео можна завантажити розширенням Videoner для браузера на комп'ютері: " +
    "воно завантажує під вашим входом на платформі, пароль і куки нікуди не передаються.",
  privateConnectHint: (platform, withExtension) =>
    `\n\n🔑 Щоб завантажити такий допис, підключіть до бота свій акаунт ${platform} — один раз. Далі бот сам завантажує те, що бачите ви: закриті дописи, рілси й сторіс, зокрема з телефона. Кнопка нижче покаже, як це зробити.${withExtension ? "\n\n💻 Або завантажте його розширенням Videoner для браузера на комп'ютері." : ""}`,
  privateReconnectHint: (platform, withExtension) =>
    `\n\n⚠️ Ваш підключений акаунт ${platform} не відкрив цей допис. Можливо, вхід перестав працювати — підключіть акаунт заново. Або в цього акаунта немає доступу до допису.${withExtension ? "\n\n💻 Можна також завантажити його розширенням Videoner для браузера на комп'ютері." : ""}`,
  connectAccountButton: "🔑 Підключити акаунт",
  reconnectAccountButton: "🔑 Підключити заново",
  extensionButton: "🧩 Завантажити через розширення",
  extensionCommand:
    "🧩 Videoner для браузера: кнопка «Завантажити» прямо на сторінці відео — YouTube, Instagram, TikTok, VK, закриті відео з вашого акаунта й уроки GetCourse.\n\nДля Chrome, Edge, Opera й Firefox на комп'ютері.",
  extensionPageButton: "🧩 Встановити розширення",
  addToGroupButton: "👥 Додати в групу",
  newsButton: "📣 Новини проєкту",
  fileCaptionShort: (title, sourceUrl) =>
    withOptionalLines((title ? `🎬 ${title.slice(0, 200)}\n\n` : "") + sourceUrl, `📣 Новини проєкту: ${NEWS_CHANNEL}`, undefined),
  sentBy: (name) => `👤 ${name}`,
  groupSettings: (s, canDelete) =>
    "⚙️ Налаштування бота в цій групі\n\n" +
    `🗑 Видаляти повідомлення з посиланням: ${s.deleteLinks ? "так" : "ні"}\n` +
    "Коли відео надіслано, повідомлення, де було лише посилання, видаляється — у чаті лишається одне відео з іменем того, хто його надіслав.\n" +
    (s.deleteLinks && !canDelete
      ? "⚠️ Зараз я не можу видаляти повідомлення: зробіть мене адміністратором із правом «Видалення повідомлень».\n"
      : "") +
    `\n✍️ Підпис під відео: ${{ full: "повний", short: "назва й джерело", none: "без підпису" }[s.caption] ?? s.caption}\n` +
    `\n🎞 Якість: ${s.quality === "max" ? "максимальна, яку пропускає Telegram" : "звичайна (720p)"}\n` +
    `\n⏱ Довгі відео: ${s.longVideos ? "завантажую будь-якої тривалості" : "лише до 15 хвилин"}\n` +
    `\n🔑 Підключати свої акаунти (для сторіс і закритих дописів): ${s.cookiesBy === "all" ? "будь-який учасник" : "лише адміністратори"}\n` +
    `\n🌐 Мова відповідей: ${s.language ? langName(s.language) : "кожному — його мовою"}\n` +
    "\nЗмінювати налаштування можуть лише адміністратори групи.",
  settingsDeleteButton: (on) => `🗑 Видаляти посилання: ${on ? "так" : "ні"}`,
  settingsCaptionButton: (style) =>
    `✍️ Підпис: ${{ full: "повний", short: "короткий", none: "немає" }[style] ?? style}`,
  settingsQualityButton: (mode) => `🎞 Якість: ${mode === "max" ? "максимальна" : "720p"}`,
  settingsLongButton: (on) => `⏱ Довгі відео: ${on ? "так" : "до 15 хв"}`,
  settingsDoneButton: "✅ Готово",
  settingsAdminsOnly: "Налаштування змінюють лише адміністратори групи.",
  settingsGroupsOnly: "Налаштування — для груп: додайте мене в групу й надішліть там /settings.",
  settingsFailed: "Не вдалося зберегти налаштування, спробуйте ще раз.",
  settingsCookiesButton: (by) => `🔑 Підключати акаунти: ${by === "all" ? "усі" : "адміни"}`,
  accountsIntro:
    "🔑 Підключені акаунти\n\nБот може завантажувати те, що видно лише тим, хто увійшов (сторіс Instagram, закриті дописи), — від вашого акаунта. Вхід працює там, куди ви його підключили: в особистих повідомленнях — для ваших завантажень, і в групах — для ваших власних посилань, якщо до групи не підключено власний акаунт. Підключений до групи — для всіх її учасників.",
  accountsHowTo:
    "Як підключити:\n1. Найпростіше — розширення Videoner на комп'ютері: увійдіть на сайт платформи, відкрийте віконце Videoner, натисніть «Підключити акаунт» і надішліть мені код. Для групи — надішліть у групі /connect КОД.\n2. Або надішліть мені файл cookies.txt (експорт куків із браузера) — чи вставте його текст повідомленням.\n3. З телефона Android — через Firefox і доповнення Cookie-Editor: https://videoner.download/uk/blog/android-firefox",
  accountsWarning:
    "⚠️ Платформи не люблять автоматичних завантажень і можуть обмежити чи заблокувати акаунт. Краще підключати окремий, не основний акаунт. Куки зберігаються зашифрованими, використовуються лише для завантажень і видаляються кнопкою нижче.",
  accountsNone: "Поки нічого не підключено.",
  accountsGroupTitle: "🔑 Акаунти, підключені до цієї групи",
  accountsGroupHowTo:
    "Підключити для всієї групи: отримайте код кнопкою «Підключити акаунт» у розширенні Videoner і надішліть тут /connect КОД. Якщо акаунт підключено лише у вас в особистих, бот завантажить ним ваші власні посилання й тут. Свої підключення — в особистих у @VideonerBot: /accounts.",
  accountsLine: (platform, where, active) => `• ${platform} — ${where}${active ? "" : " (⚠️ вхід не працює)"}`,
  accountsGroupLine: (platform, owner, active) => `• ${platform} — ${owner}${active ? "" : " (⚠️ вхід не працює)"}`,
  accountsWhereHere: "в особистих",
  accountsWhereGroup: (title) => `група «${title}»`,
  accountsDeleteButton: (platform, where) => `🗑 ${platform} · ${where}`,
  accountsDeleteAllButton: "🗑 Видалити всі мої підключення",
  accountsDeleted: "Видалено.",
  accountsDeletedAll: (n) => `Видалено підключень: ${n}.`,
  accountsNotAllowed: "Видалити може лише той, хто підключив, або адміністратор групи.",
  connectUsage:
    "Надішліть /connect КОД. Код дає кнопка «Підключити акаунт» у розширенні Videoner на комп'ютері. Список підключень — /accounts.",
  connectOnlyAdmins: "Підключати акаунти до цієї групи можуть лише адміністратори (налаштування в /settings).",
  connectDone: (platform, where) =>
    `✅ ${platform} підключено ${where}. Тепер бот завантажує й те, що видно лише тим, хто увійшов. Переглянути чи видалити — /accounts.\n\n⚠️ Платформа може обмежити акаунт за автоматичні завантаження — краще підключати не основний.`,
  connectWhereGroup: "до цієї групи",
  connectWhereHere: "для ваших завантажень в особистих та інлайн-режимі",
  connectCodeNotFound: "Код не знайдено або він уже застарів (він діє 10 хвилин). Отримайте новий у розширенні Videoner.",
  connectRejectedNoSession: "У цих куках немає входу в акаунт. Увійдіть на сайті платформи й вивантажте куки заново.",
  connectRejectedUnknown: "Не знайшов куків підтримуваних платформ: Instagram, Facebook, YouTube, X, VK, TikTok.",
  connectUnavailable: "Підключення акаунтів поки недоступне.",
  connectFailed: "Не вдалося підключити, спробуйте ще раз.",
  connectFileTooBig: "Файл завеликий — вивантажте куки лише потрібного сайту.",
  connectNotAnonymous: "Підключайте акаунт від свого імені, а не анонімно від імені групи: інакше підключення адмінів переплутаються. Код я знищив — отримайте новий.",
  connectCodeInGroup:
    "Код підключення в загальному чаті можуть підгледіти — я його знищив і прибрав повідомлення. Отримайте новий і надішліть командою /connect КОД: повідомлення з командою я видаляю одразу.",
  groupWelcome:
    "👋 Привіт! Надсилайте в чат посилання на відео з TikTok, Instagram, YouTube, VK та інших платформ — я відповім самим відео.\n\n" +
    "Ролики до 15 хвилин завантажую сам, без команд. На інші повідомлення не відповідаю.\n\n⚙️ Адміни групи можуть налаштувати мене командою /settings: видаляти повідомлення з посиланнями, вигляд підпису, якість, довгі відео й мову.\n\n⚡ Після посилання можна дописати -audio — надішлю звук, -hd — найкращу якість.\n\n📣 Новини проєкту: @videonerdownload",
  errorTooLong: "відео задовге — такі ми поки не завантажуємо.",
  errorUnknown: "не вдалося завантажити це відео. Спробуй ще раз трохи пізніше або надішли інше посилання.",
  inlineHintButton: "Надішліть посилання боту",
  inlineResultTitle: "⬇️ Завантажити відео",
  inlineResultDescription: "Відео прийде прямо в цей чат",
  inlinePlaceholder: "⏬ Завантажую відео, це може зайняти пару хвилин...",
  inlineOpenBot: "Відкрити бота",
  inlineOnlySingleVideo:
    "У цьому режимі надсилається одне відео. Допис із кількох файлів чи фотографії — надішліть посилання боту в особисті повідомлення.",
  inlineSubscribeRequired: (channel: string) =>
    `Щоб завантажувати, підпишіться на ${channel} і спробуйте знову.`,
  inlineRateLimited: "Забагато запитів поспіль. Зачекайте хвилину й спробуйте знову.",
  queueRest: (count) => `\n\n📋 У черзі ще посилань: ${count}. Покажу їх по одному, коли закінчимо з цим.`,
  queuedOne: (position) =>
    `📋 Посилання в черзі, ${position}-е. Спершу закінчимо з поточним — потім покажу вибір якості для нього.`,
  queuedMany: (added, waiting) =>
    `📋 Додав у чергу посилань: ${added}. Усього чекають: ${waiting}. Покажу їх по одному, коли закінчимо з поточним.`,
  queueDuplicates: (count) =>
    count === 1
      ? "Це посилання вже в черзі — вдруге не додаю."
      : `Посилання, які вже в черзі, вдруге не додаю (повторів: ${count}).`,
  queueFull: (limit, rejected) =>
    `У черзі може бути не більше ${limit} посилань — зайві не додав (${rejected}). Надішліть їх, коли черга просунеться.`,
  skipButton: "✖️ Не завантажувати",
  skipped: "⏭ Це посилання пропустив.",
  chooseTimedOut: "⌛ Якість не обрано за 30 хвилин — це посилання пропускаю.",
  queueLostOnRestart: (count) =>
    `⚠️ Бот перезапускається для оновлення — чергу скинуто (посилань: ${count}). Надішліть їх знову за хвилину.`,
  subtitlesButton: "📝 Субтитри",
  subtitlesBack: "⬅️ Назад до якості",
  subtitlesAuto: "авто",
  subtitlesChoose: "Оберіть мову субтитрів",
  subtitlesPreparing: "📝 Готую субтитри...",
  subtitlesFailed: "Не вдалося завантажити субтитри цією мовою. Спробуйте іншу мову.",
  subtitlesBusy: "YouTube зараз не віддає субтитри — спробуйте за кілька хвилин.",
  playlistFound: (title, count) =>
    `📃 Плейлист${title ? ` «${title.slice(0, 150)}»` : ""}: ${count} відео.\nЗавантажу їх по одному, по черзі. Як завантажувати?`,
  playlistStdButton: "🎬 720p",
  playlistHdButton: "🎬 Найкраща якість",
  playlistAudioButton: "🎵 Лише звук (mp3)",
  playlistNoButton: "✖️ Не треба",
  playlistQueued: (count) =>
    `📃 Поставив у чергу відео з плейлиста: ${count}. Надішлю по одному. Зупинити — кнопкою нижче або командою /stop.`,
  playlistFailed: "Не вдалося відкрити плейлист — можливо, він закритий. Надішліть посилання на окреме відео.",
  stopButton: "⏹ Зупинити",
  stopped: (dropped) => `⏹ Зупинив.${dropped ? ` Скасовано посилань у черзі: ${dropped}.` : ""}`,
  nothingToStop: "Зараз нічого не завантажується.",
  languageChoose: "🌐 Оберіть мову бота. «Авто» — як у вашому Telegram.",
  languageChooseGroup: "🌐 Мова відповідей бота в цій групі. «Авто» — кожному мовою його Telegram.",
  languageAuto: "Авто — як у Telegram",
  languageAutoGroup: "Авто — кожному його мовою",
  languageSaved: (name) => `✅ Мова бота: ${name}. Змінити — /language.`,
  languageSavedAuto: "✅ Мова бота — як у вашому Telegram. Змінити — /language.",
  settingsLanguageButton: (name) => `🌐 Мова: ${name ?? "авто"}`,
  settingsBack: "⬅️ Назад до налаштувань",
};

const kk: Messages = {
  start: "Сәлем! Маған YouTube, TikTok, Instagram, Facebook, Twitter/X, Vimeo, VK, Rutube, OK.ru, Pinterest немесе Threads видеосының сілтемесін жібер — оны жүктеп алуға көмектесемін.\n\n✨ Сапа ешнәрсемен шектелмейді: платформада бар сапаның бәрін, 4K-ге дейін беремін — тек файл 2 ГБ-тан аспаса болғаны, одан үлкенін Telegram ботқа жіберуге мүмкіндік бермейді. Мұнда ақылы функциялар мүлдем жоқ.\n\nТолығымен тегін: жазылымсыз, жарнамасыз, ішкі сатып алуларсыз.\n\n🧩 Компьютерден жүктейсіз бе? Браузерге кеңейтім орнатыңыз — «Жүктеп алу» батырмасы видео бетінде тікелей пайда болады: videoner.download/kk/extension\n\n👥 Мені топқа қосыңыз — онда жарияланған сілтемелер бойынша видеоларды өзім жіберіп отырамын.\n\n⚡ Сапаны таңдамай: сілтемеден кейін -audio деп жазыңыз — дыбысты (mp3) жіберемін, -hd — видеоны ең жақсы сапада.\n\n📣 Жоба жаңалықтары: @videonerdownload\n\n🌐 Бот тілі: /language",
  notLink: "Бұл сілтемеге ұқсамайды. Видео сілтемесін жібер.",
  inviteGreeting: "Сәлем! Мен Videoner — YouTube, TikTok, Instagram және басқа платформалардан видеоларды тегін жүктеп аламын. Қазір саған бөліскен видеоны дайындаймын 👇",
  inviteNotFound: "Осы шақыру сілтемесі бойынша видео табылмады. Маған видео сілтемесін жібер — мен оны жүктеп аламын.",
  inviteUnavailable: "Сілтеме бойынша видеоны ашу мүмкін болмады — сервис қазір жауап бермей тұр. Бір минуттан кейін сол сілтемені қайта аш.",
  fetchingInfo: "🔍 Видео туралы ақпарат алып жатырмын...",
  audioOnlyButton: "🎵 Тек аудио (mp3)",
  photoButton: "📷 Фотоны жүктеп алу",
  slideshowButton: "🎞 Слайдшоу (видео)",
  galleryButton: "📷+🎞 Фото және слайдшоу",
  chooseQuality: (title, duration) => `«${title}»${duration ? `\n⏱ ${duration}` : ""}\n\nСапаны таңда:`,
  sessionExpired: "Сессия ескірді — сілтемені қайта жібер",
  downloading: "⏬ Жүктеп алып жатырмын, бұл бірнеше минутқа созылуы мүмкін...",
  downloadFailed: "жүктеп алу қатемен аяқталды",
  downloadProgress: (percent, eta, done) =>
    `⏬ Жүктеп алынуда: ${percent}%${eta ? ` · ${eta} қалды` : ""}${done ? `\n${done}` : ""}`,
  downloadFinishing: "⚙️ Аз қалды — файлды жинап жатырмын...",
  converting: (percent) => `⚙️ Түрлендіріп жатырмын: ${percent}%`,
  etaUnderMinute: "бір минуттан аз",
  etaMinutes: (minutes) => `~${minutes} мин`,
  etaHours: (hours, minutes) => `~${hours} сағ${minutes ? ` ${minutes} мин` : ""}`,
  downloadTimeout: "жүктеп алу тым ұзаққа созылды — видео өте ауыр сияқты. Төменірек сапаны таңдап көр.",
  downloadInterrupted: "⚠️ Бот жаңартылып, қайта іске қосылуы керек — жүктеп алу үзілді. Бір минуттан кейін сілтемені қайта жібер.",
  fileTooBig: (mb, url) =>
    `Файл үлкен болып шықты (${mb} МБ) — Telegram боттың оны жіберуіне мүмкіндік бермейді.\nСілтеме арқылы жүктеп ал: ${url}`,
  sendingFile: "📤 Файлды жіберіп жатырмын...",
  sendingAlbum: (count) => `📤 Жазбада бірнеше файл бар (${count}) — альбом етіп жіберемін...`,
  failedPrefix: "❌ Сәтсіз аяқталды: ",
  // Подпись прикрепляется к самому файлу, поэтому уезжает вместе с ним при
  // пересылке — ради этого всё и делается. Заголовок подрезаем: у подписи в
  // Telegram лимит 1024 символа, а название ролика бывает на пол-экрана.
  // shareUrl — ссылка-приглашение: кто её откроет, сразу получит этот же
  // ролик в боте (handlers/invite.ts).
  fileCaption: (title, sourceUrl, shareUrl, description) =>
    composeCaption(
      title,
      description,
      `Дереккөз: ${sourceUrl}\n` +
        "Видеоға құқық оның авторына тиесілі.\n" +
        "@VideonerBot арқылы тегін жүктеп алынды",
      `📣 Жоба жаңалықтары: ${NEWS_CHANNEL}`,
      shareUrl && `🔗 Бөлісу: ${shareUrl}`,
    ),
  subscribeRequired: (channel) =>
    `Жүктеп алу үшін біздің ${channel} арнамызға жазылыңыз — бұл жалғыз шарт, сервис тегін болып қала береді.\n\n` +
    "Жазылып, «Мен жазылдым» батырмасын басыңыз.",
  openChannelButton: "📣 Арнаны ашу",
  checkSubscriptionButton: "Мен жазылдым",
  subscribeThanks: "Рақмет! Енді видео сілтемесін жіберіңіз.",
  subscribeThanksResuming: "Рақмет! Сіздің сілтемеңізбен жалғастырамын.",
  subscribeStillMissing: "Жазылым әлі көрінбейді. Жазылып, қайта басыңыз.",
  channelNotice: (channel) => `\n\nБұл жазбаның сілтемесі ${channel} арнасында жарияланады — анонимді түрде, атыңызсыз.`,
  channelPost: (title, url) =>
    (title ? `🎬 ${title.slice(0, 200)}\n\n` : "") +
    `${url}\n\n` +
    "Осы және кез келген басқа видеоны тегін жүктеп алу: @VideonerBot",
  errorStoryNeedsId:
    "нақты сториске сілтеме жіберіңіз: Instagram қолданбасында оны ашып, «Бөлісу» → «Сілтемені көшіру» түймесін басыңыз.",
  errorInstagramStory:
    "Instagram стористері тек аккаунтқа кіргендерге ғана көрінеді.",
  errorLoginRequired:
    "Бұл жазба аккаунтқа кірмейінше қолжетімсіз: платформа оны тек " +
    "авторизацияланған пайдаланушыларға береді. Бұл жабық жазбаларда, жас шектеуі бар " +
    "және шектеулі аудиторияға арналған жазбаларда болады.\n\n" +
    "Ашық жазбалар еш қиындықсыз жүктеледі — басқа сілтемені байқап көріңіз.",
  errorUnsupportedPlatform:
    "Сілтемені тани алмадым — бұл YouTube, TikTok, Instagram, Facebook, Twitter/X, Vimeo, VK, Rutube, OK.ru, Pinterest немесе Threads видеосына тікелей сілтеме екенін тексер.",
  errorFileTooLarge: "файл 2 ГБ-тан ауыр болып шықты — одан үлкенін Telegram боттарға жіберуге рұқсат бермейді. Оны сайттан немесе браузер кеңейтімі арқылы жүктеп алыңыз — батырмалар төменде. Немесе сілтемені қайта жіберіп, төменірек сапаны таңдаңыз.",
  siteButton: "🌐 Сайттан жүктеп алу",
  qualitiesHiddenBySize: (limit) =>
    `\n\n⚖️ ${limit} шегінен ауыр сапалар көрсетілмеді: одан үлкен файлдарды Telegram боттарға жіберуге рұқсат бермейді. Оларды сайттан немесе браузер кеңейтімі арқылы жүктеп алуға болады — батырмалар төменде.`,
  videoTooBigForTelegram: (smallest) =>
    `\n\n⚖️ Видео ең төменгі сапада да Telegram үшін тым ауыр (~${smallest}): 2 ГБ-тан асатын файлдарды Telegram боттарға жіберуге рұқсат бермейді. Мұнда тек дыбысты, ал видеоны сайттан немесе браузер кеңейтімі арқылы жүктеп алуға болады (батырмалар төменде).`,
  errorFormatUnavailable: "Бұл видеода мұндай сапа жоқ. Сілтемені қайта жібер — өзекті тізімді көрсетемін.",
  errorNoVideoContent: "Бұл сілтемеде жүктеп алатын видео жоқ — жазбада тек фото бар сияқты.",
  errorRegionBlocked:
    "Бұл видеоны автордың елінен тыс жерде көруге болмайды — платформа оны " +
    "біздің серверге бермейді. Мұны айналып өту мүмкін емес: шектеу " +
    "платформа тарапында қойылған.\n\nБасқа сілтемелер әдеттегідей жүктеледі.",
  errorRateLimited: "Қатарынан тым көп сілтеме — сәл күтіп, қайта жібер.",
  errorYoutubeDailyLimit: (gb) => `соңғы тәулікте YouTube-тан ${gb} ГБ-тан көп жүктеп алдыңыз — бұл боттың бір адамға арналған тәуліктік лимиті. Лимит соңғы 24 сағат бойынша есептеледі: YouTube-тан жаңа видеоларды кейінірек жүктеуге болады. Басқа платформалар әдеттегідей жұмыс істейді.`,
  playlistStoppedByLimit: (dropped) => `⏹ Плейлист тоқтатылды: YouTube тәуліктік лимитіне жеттіңіз. Жүктелмеген видео: ${dropped}. Плейлист сілтемесін кейінірек қайта жіберіңіз.`,
  errorPlatformRefused:
    "платформа бұл видеоны біздің серверге бермеді. Бұл жабық және " +
    "жас шектеуі бар жарияланымдарда болады, ал кейде платформа жай ғана уақытша " +
    "қолжетімділікті шектейді. Бірнеше минуттан кейін қайта байқап көр.",
  errorThreadsNoMedia:
    "бұл Threads жазбасында видео да, фото да көрінбейді. Не бұл мәтіндік жазба, не " +
    "Threads оның медиасын тек аккаунтқа кіргендерге көрсетеді, — мұндай жазбаларды кірмей жүктеп алу мүмкін емес.",
  extensionHint:
    "\n\n💻 Мұндай видеоны компьютердегі браузерге арналған Videoner кеңейтімімен жүктеп алуға болады: " +
    "ол платформадағы сіздің аккаунтыңыз арқылы жүктейді, құпиясөз бен куки ешқайда жіберілмейді.",
  privateConnectHint: (platform, withExtension) =>
    `\n\n🔑 Мұндай жазбаны жүктеп алу үшін ${platform} аккаунтыңызды ботқа бір рет қосыңыз. Содан кейін бот сізге көрінетіннің бәрін өзі жүктейді: жабық жазбаларды, рилстерді және стористерді, телефоннан да. Төмендегі батырма мұны қалай жасау керегін көрсетеді.${withExtension ? "\n\n💻 Немесе оны компьютердегі браузерге арналған Videoner кеңейтімімен жүктеп алыңыз." : ""}`,
  privateReconnectHint: (platform, withExtension) =>
    `\n\n⚠️ Қосылған ${platform} аккаунтыңыз бұл жазбаны аша алмады. Мүмкін, кіру жұмысын тоқтатқан шығар — аккаунтты қайта қосыңыз. Немесе бұл аккаунттың жазбаға қолжетімділігі жоқ.${withExtension ? "\n\n💻 Оны компьютердегі браузерге арналған Videoner кеңейтімімен де жүктеп алуға болады." : ""}`,
  connectAccountButton: "🔑 Аккаунтты қосу",
  reconnectAccountButton: "🔑 Қайта қосу",
  extensionButton: "🧩 Кеңейтім арқылы жүктеп алу",
  extensionCommand:
    "🧩 Браузерге арналған Videoner: «Жүктеп алу» батырмасы тікелей видео бетінде — YouTube, Instagram, TikTok, VK, аккаунтыңыздағы жабық видеолар және GetCourse сабақтары.\n\nКомпьютердегі Chrome, Яндекс Браузер, Edge, Opera және Firefox үшін.",
  extensionPageButton: "🧩 Кеңейтімді орнату",
  addToGroupButton: "👥 Топқа қосу",
  newsButton: "📣 Жоба жаңалықтары",
  fileCaptionShort: (title, sourceUrl) =>
    withOptionalLines((title ? `🎬 ${title.slice(0, 200)}\n\n` : "") + sourceUrl, `📣 Жоба жаңалықтары: ${NEWS_CHANNEL}`, undefined),
  sentBy: (name) => `👤 ${name}`,
  groupSettings: (s, canDelete) =>
    "⚙️ Осы топтағы бот баптаулары\n\n" +
    `🗑 Сілтемесі бар хабарламаны жою: ${s.deleteLinks ? "иә" : "жоқ"}\n` +
    "Видео жіберілгеннен кейін тек сілтемесі бар хабарлама жойылады — чатта оны жіберген адамның аты көрсетілген бір ғана видео қалады.\n" +
    (s.deleteLinks && !canDelete
      ? "⚠️ Қазір мен хабарламаларды жоя алмаймын: мені «Хабарламаларды жою» құқығы бар әкімші етіңіз.\n"
      : "") +
    `\n✍️ Видео сипаттамасы: ${{ full: "толық", short: "атауы мен дереккөзі", none: "сипаттамасыз" }[s.caption] ?? s.caption}\n` +
    `\n🎞 Сапа: ${s.quality === "max" ? "Telegram өткізетін ең жоғары сапа" : "қалыпты (720p)"}\n` +
    `\n⏱ Ұзын видеолар: ${s.longVideos ? "кез келген ұзақтықтағысын жүктеймін" : "тек 15 минутқа дейін"}\n` +
    `\n🔑 Өз аккаунттарын қосу (сторис пен жабық жазбалар үшін): ${s.cookiesBy === "all" ? "кез келген қатысушы" : "тек әкімшілер"}\n` +
    `\n🌐 Жауап тілі: ${s.language ? langName(s.language) : "әркімге — өз тілінде"}\n` +
    "\nБаптауларды тек топ әкімшілері өзгерте алады.",
  settingsDeleteButton: (on) => `🗑 Сілтемелерді жою: ${on ? "иә" : "жоқ"}`,
  settingsCaptionButton: (style) =>
    `✍️ Сипаттама: ${{ full: "толық", short: "қысқа", none: "жоқ" }[style] ?? style}`,
  settingsQualityButton: (mode) => `🎞 Сапа: ${mode === "max" ? "ең жоғары" : "720p"}`,
  settingsLongButton: (on) => `⏱ Ұзын видеолар: ${on ? "иә" : "15 мин дейін"}`,
  settingsDoneButton: "✅ Дайын",
  settingsAdminsOnly: "Баптауларды тек топ әкімшілері өзгерте алады.",
  settingsGroupsOnly: "Баптаулар топтарға арналған: мені топқа қосып, сонда /settings жіберіңіз.",
  settingsFailed: "Баптауларды сақтау мүмкін болмады, қайта байқап көріңіз.",
  settingsCookiesButton: (by) => `🔑 Аккаунт қосу: ${by === "all" ? "барлығы" : "әкімшілер"}`,
  accountsIntro:
    "🔑 Қосылған аккаунттар\n\nБот тек аккаунтқа кіргендерге көрінетін нәрселерді (Instagram стористері, жабық жазбалар) сіздің аккаунтыңыз арқылы жүктеп ала алады. Кіру өзіңіз қосқан жерде жұмыс істейді: жеке чатта — сіздің жүктеп алуларыңыз үшін, ал топтарда — егер топқа өз аккаунты қосылмаған болса, сіздің өз сілтемелеріңіз үшін. Топқа қосылған аккаунт оның барлық қатысушыларына жұмыс істейді.",
  accountsHowTo:
    "Қалай қосуға болады:\n1. Ең оңайы — компьютердегі Videoner кеңейтімі: платформа сайтына кіріп, Videoner терезесін ашыңыз, «Аккаунтты қосу» батырмасын басып, кодты маған жіберіңіз. Топ үшін — топта /connect КОД жіберіңіз.\n2. Немесе маған cookies.txt файлын (браузерден экспортталған куки) жіберіңіз — не оның мәтінін хабарлама етіп қойыңыз.\n3. Android телефонынан — Firefox және Cookie-Editor қосымшасы арқылы: https://videoner.download/kk/blog/android-firefox",
  accountsWarning:
    "⚠️ Платформалар автоматты жүктеп алуды ұнатпайды және аккаунтты шектеуі не бұғаттауы мүмкін. Негізгі емес, бөлек аккаунтты қосқан дұрыс. Куки шифрланған күйде сақталады, тек жүктеп алу үшін қолданылады және төмендегі батырма арқылы жойылады.",
  accountsNone: "Әзірге ештеңе қосылмаған.",
  accountsGroupTitle: "🔑 Осы топқа қосылған аккаунттар",
  accountsGroupHowTo:
    "Бүкіл топ үшін қосу: Videoner кеңейтіміндегі «Аккаунтты қосу» батырмасы арқылы код алып, осында /connect КОД жіберіңіз. Егер аккаунт тек сіздің жеке чатыңызда қосылған болса, бот ол арқылы осында да сіздің өз сілтемелеріңізді жүктеп алады. Өз қосылымдарыңыз — @VideonerBot жеке чатында: /accounts.",
  accountsLine: (platform, where, active) => `• ${platform} — ${where}${active ? "" : " (⚠️ кіру жұмыс істемейді)"}`,
  accountsGroupLine: (platform, owner, active) => `• ${platform} — ${owner}${active ? "" : " (⚠️ кіру жұмыс істемейді)"}`,
  accountsWhereHere: "жеке чатта",
  accountsWhereGroup: (title) => `«${title}» тобы`,
  accountsDeleteButton: (platform, where) => `🗑 ${platform} · ${where}`,
  accountsDeleteAllButton: "🗑 Барлық қосылымдарымды жою",
  accountsDeleted: "Жойылды.",
  accountsDeletedAll: (n) => `Жойылған қосылымдар: ${n}.`,
  accountsNotAllowed: "Тек қосқан адам немесе топ әкімшісі ғана жоя алады.",
  connectUsage:
    "/connect КОД жіберіңіз. Кодты компьютердегі Videoner кеңейтіміндегі «Аккаунтты қосу» батырмасы береді. Қосылымдар тізімі — /accounts.",
  connectOnlyAdmins: "Бұл топқа аккаунттарды тек әкімшілер қоса алады (баптау /settings ішінде).",
  connectDone: (platform, where) =>
    `✅ ${platform} ${where} қосылды. Енді бот тек аккаунтқа кіргендерге көрінетін нәрселерді де жүктеп алады. Көру немесе жою — /accounts.\n\n⚠️ Платформа автоматты жүктеп алу үшін аккаунтты шектеуі мүмкін — негізгі емес аккаунтты қосқан дұрыс.`,
  connectWhereGroup: "осы топқа",
  connectWhereHere: "жеке чаттағы және инлайн режиміндегі жүктеп алуларыңыз үшін",
  connectCodeNotFound: "Код табылмады немесе ескірген (ол 10 минут жарамды). Videoner кеңейтімінен жаңасын алыңыз.",
  connectRejectedNoSession: "Бұл кукиде аккаунтқа кіру жоқ. Платформа сайтына кіріп, кукиді қайта экспорттаңыз.",
  connectRejectedUnknown: "Қолдау көрсетілетін платформалардың куки файлдары табылмады: Instagram, Facebook, YouTube, X, VK, TikTok.",
  connectUnavailable: "Аккаунттарды қосу әзірге қолжетімсіз.",
  connectFailed: "Қосу мүмкін болмады, қайта байқап көріңіз.",
  connectFileTooBig: "Файл тым үлкен — тек қажетті сайттың куки файлдарын экспорттаңыз.",
  connectNotAnonymous: "Аккаунтты топ атынан анонимді түрде емес, өз атыңыздан қосыңыз: әйтпесе әкімшілердің қосылымдары шатасып кетеді. Кодты жойдым — жаңасын алыңыз.",
  connectCodeInGroup:
    "Ортақ чаттағы қосылу кодын басқалар көріп қоюы мүмкін — мен оны жойып, хабарламаны өшірдім. Жаңасын алып, /connect КОД командасымен жіберіңіз: командасы бар хабарламаны бірден өшіремін.",
  groupWelcome:
    "👋 Сәлем! Чатқа TikTok, Instagram, YouTube, VK және басқа платформалардағы видеолардың сілтемелерін жіберіңіз — мен видеоның өзімен жауап беремін.\n\n" +
    "15 минутқа дейінгі видеоларды командасыз-ақ өзім жүктеп аламын. Басқа хабарламаларға жауап бермеймін.\n\n⚙️ Топ әкімшілері мені /settings командасымен баптай алады: сілтемесі бар хабарламаларды жою, сипаттама түрі, сапа, ұзын видеолар және тіл.\n\n⚡ Сілтемеден кейін -audio деп жазсаңыз — дыбыс, -hd — ең жақсы сапа.\n\n📣 Жоба жаңалықтары: @videonerdownload",
  errorTooLong: "видео тым ұзын — мұндай видеоларды әзірге жүктеп алмаймыз.",
  errorUnknown: "бұл видеоны жүктеп алу мүмкін болмады. Сәл кейінірек қайта байқап көр немесе басқа сілтеме жібер.",
  inlineHintButton: "Сілтемені ботқа жіберіңіз",
  inlineResultTitle: "⬇️ Видеоны жүктеп алу",
  inlineResultDescription: "Видео дәл осы чатқа келеді",
  inlinePlaceholder: "⏬ Видеоны жүктеп алып жатырмын, бұл бірнеше минутқа созылуы мүмкін...",
  inlineOpenBot: "Ботты ашу",
  inlineOnlySingleVideo:
    "Бұл режимде бір ғана видео жіберіледі. Бірнеше файлдан тұратын жазба немесе фотолар үшін сілтемені ботқа жеке хабарламамен жіберіңіз.",
  inlineSubscribeRequired: (channel: string) =>
    `Жүктеп алу үшін ${channel} арнасына жазылып, қайта байқап көріңіз.`,
  inlineRateLimited: "Қатарынан тым көп сұраныс. Бір минут күтіп, қайта байқап көріңіз.",
  queueRest: (count) => `\n\n📋 Кезекте тағы ${count} сілтеме бар. Мұнымен біткен соң оларды бір-бірлеп көрсетемін.`,
  queuedOne: (position) =>
    `📋 Сілтеме кезекте, реті: ${position}. Алдымен ағымдағысын аяқтаймыз — содан кейін бұған сапа таңдауын көрсетемін.`,
  queuedMany: (added, waiting) =>
    `📋 Кезекке ${added} сілтеме қостым. Барлығы күтуде: ${waiting}. Ағымдағысымен біткен соң оларды бір-бірлеп көрсетемін.`,
  queueDuplicates: (count) =>
    count === 1
      ? "Бұл сілтеме кезекте бар — екінші рет қоспаймын."
      : `Кезекте бар сілтемелерді екінші рет қоспаймын (қайталанғаны: ${count}).`,
  queueFull: (limit, rejected) =>
    `Кезекте ${limit} сілтемеден артық болмайды — артығын қоспадым (${rejected}). Кезек жылжығанда оларды жіберіңіз.`,
  skipButton: "✖️ Жүктеп алмау",
  skipped: "⏭ Бұл сілтемені өткізіп жібердім.",
  chooseTimedOut: "⌛ 30 минут ішінде сапа таңдалмады — бұл сілтемені өткізіп жіберемін.",
  queueLostOnRestart: (count) =>
    `⚠️ Бот жаңарту үшін қайта іске қосылуда — кезек тазартылды (сілтемелер: ${count}). Бір минуттан кейін оларды қайта жіберіңіз.`,
  subtitlesButton: "📝 Субтитрлер",
  subtitlesBack: "⬅️ Сапа таңдауына оралу",
  subtitlesAuto: "авто",
  subtitlesChoose: "Субтитр тілін таңдаңыз",
  subtitlesPreparing: "📝 Субтитрлерді дайындап жатырмын...",
  subtitlesFailed: "Бұл тілдегі субтитрлерді жүктеп алу мүмкін болмады. Басқа тілді таңдап көріңіз.",
  subtitlesBusy: "YouTube қазір субтитрлерді бермей тұр — бірнеше минуттан кейін байқап көріңіз.",
  playlistFound: (title, count) =>
    `📃 Плейлист${title ? ` «${title.slice(0, 150)}»` : ""}: ${count} видео.\nОларды бір-бірлеп, кезекпен жүктеп аламын. Қалай жүктейміз?`,
  playlistStdButton: "🎬 720p",
  playlistHdButton: "🎬 Ең жақсы сапа",
  playlistAudioButton: "🎵 Тек дыбыс (mp3)",
  playlistNoButton: "✖️ Керек емес",
  playlistQueued: (count) =>
    `📃 Плейлисттен кезекке қойылған видео: ${count}. Бір-бірлеп жіберемін. Тоқтату — төмендегі батырмамен немесе /stop командасымен.`,
  playlistFailed: "Плейлистті ашу мүмкін болмады — ол жабық болуы мүмкін. Жеке видеоның сілтемесін жіберіңіз.",
  stopButton: "⏹ Тоқтату",
  stopped: (dropped) => `⏹ Тоқтаттым.${dropped ? ` Кезектен алынған сілтемелер: ${dropped}.` : ""}`,
  nothingToStop: "Қазір ештеңе жүктелмей жатыр.",
  languageChoose: "🌐 Бот тілін таңдаңыз. «Авто» — Telegram-дағы тіліңізбен бірдей.",
  languageChooseGroup: "🌐 Осы топтағы бот жауаптарының тілі. «Авто» — әркімге өз Telegram тілінде.",
  languageAuto: "Авто — Telegram-дағыдай",
  languageAutoGroup: "Авто — әркімге өз тілінде",
  languageSaved: (name) => `✅ Бот тілі: ${name}. Өзгерту — /language.`,
  languageSavedAuto: "✅ Бот тілі — Telegram-дағы тіліңізбен бірдей. Өзгерту — /language.",
  settingsLanguageButton: (name) => `🌐 Тіл: ${name ?? "авто"}`,
  settingsBack: "⬅️ Баптауларға оралу",
};

export const messages: Record<Lang, Messages> = { ru, uk, kk, en, ar, zh, hi, id: indonesian, sw, de, fr, it, pt, es, uz, tr, fa, vi, bn, ur, pl, ja, ko, th, tl, am, om, ha, so, az, ky, tg, ms, nl, ro, ps, ckb };
