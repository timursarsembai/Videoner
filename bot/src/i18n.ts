import { clip, splitTitle } from "./caption.js";

export type Lang = "ru" | "uk" | "kk" | "en" | "ar" | "zh" | "hi" | "id" | "sw" | "de" | "fr";

export function detectLang(languageCode?: string): Lang {
  const code = languageCode?.toLowerCase().split("-")[0];
  // «in» — старый код индонезийского, некоторые клиенты шлют его до сих пор.
  const base = code === "in" ? "id" : code;
  return isLang(base) ? base : "en";
}

// Канал новостей проекта: ссылка на него — в подписи к каждому файлу
// (fileCaption), туда же уходят статьи блога (blog-channel.ts).
export const NEWS_CHANNEL = "@videonerdownload";

// Языки, которые можно выбрать вручную (/language), в порядке кнопок.
export const LANGS: Lang[] = ["ru", "uk", "kk", "en", "ar", "zh", "hi", "id", "sw", "de", "fr"];
// Название языка на нём самом — так его узнает и тот, кто других не читает.
export const LANGUAGE_NAMES: Record<Lang, string> = { ru: "Русский", uk: "Українська", kk: "Қазақша", en: "English", ar: "العربية", zh: "中文", hi: "हिन्दी", id: "Bahasa Indonesia", sw: "Kiswahili", de: "Deutsch", fr: "Français" };

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

export const messages: Record<Lang, Messages> = { ru, uk, kk, en, ar, zh, hi, id: indonesian, sw, de, fr };
