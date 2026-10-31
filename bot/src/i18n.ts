import { clip, splitTitle } from "./caption.js";

export type Lang = "ru" | "uk" | "kk" | "en" | "ar" | "zh";

export function detectLang(languageCode?: string): Lang {
  const base = languageCode?.toLowerCase().split("-")[0];
  return isLang(base) ? base : "en";
}

// Канал новостей проекта: ссылка на него — в подписи к каждому файлу
// (fileCaption), туда же уходят статьи блога (blog-channel.ts).
export const NEWS_CHANNEL = "@videonerdownload";

// Языки, которые можно выбрать вручную (/language), в порядке кнопок.
export const LANGS: Lang[] = ["ru", "uk", "kk", "en", "ar", "zh"];
// Название языка на нём самом — так его узнает и тот, кто других не читает.
export const LANGUAGE_NAMES: Record<Lang, string> = { ru: "Русский", uk: "Українська", kk: "Қазақша", en: "English", ar: "العربية", zh: "中文" };

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

export const messages: Record<Lang, Messages> = { ru, uk, kk, en, ar, zh };
