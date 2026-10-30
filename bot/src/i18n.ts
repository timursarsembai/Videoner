export type Lang = "ru" | "uk" | "en";

export function detectLang(languageCode?: string): Lang {
  const code = languageCode?.toLowerCase() ?? "";
  if (code.startsWith("uk")) return "uk";
  return code.startsWith("ru") ? "ru" : "en";
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
  fileCaption: (title: string, sourceUrl: string, shareUrl?: string) => string;
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
  dailyLimitReached: string;
  errorFileTooLarge: string;
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
  errorPlatformRefused: string;
  errorThreadsNoMedia: string;
  // Площадка не отдала ролик серверу, а расширение для браузера скачает его
  // под входом человека (см. extensionLinkFor в helpers.ts).
  extensionHint: string;
  extensionButton: string;
  // Команда /extension (меню бота).
  extensionCommand: string;
  extensionPageButton: string;
  // Режим для групп (handlers/group.ts): приветствие при добавлении в группу
  // и ответ на /start там же.
  groupWelcome: string;
  // Кнопка под /start в личке: добавить бота в группу (t.me/<бот>?startgroup).
  addToGroupButton: string;
  // Настройки группы (/settings, handlers/group.ts).
  fileCaptionShort: (title: string, sourceUrl: string) => string;
  sentBy: (name: string) => string;
  groupSettings: (
    s: { deleteLinks: boolean; caption: string; quality: string; longVideos: boolean; cookiesBy: string },
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
  queueDroppedByLimit: (count: number) => string;
  queueLostOnRestart: (count: number) => string;
  // Субтитры YouTube (см. subtitles.ts).
  subtitlesButton: string;
  subtitlesBack: string;
  subtitlesAuto: string;
  subtitlesChoose: string;
  subtitlesPreparing: string;
  subtitlesFailed: string;
  subtitlesBusy: string;
}

// Строка «Поделиться» — только если влезает в лимит подписи Telegram (1024
// символа): ссылка на источник не обрезается и бывает очень длинной, и из-за
// необязательной строки файл не должен перестать отправляться.
const CAPTION_LIMIT = 1024;
function withShareLine(caption: string, shareLine: string | undefined): string {
  if (!shareLine) return caption;
  const full = `${caption}\n\n${shareLine}`;
  return full.length <= CAPTION_LIMIT ? full : caption;
}

const ru: Messages = {
  start: "Привет! Пришли мне ссылку на видео из YouTube, TikTok, Instagram, Facebook, Twitter/X, Vimeo, VK, Rutube, OK.ru, Pinterest или Threads — я помогу его скачать.\n\n✨ Качество ничем не ограничено: отдам всё, что есть у площадки, вплоть до 4K — лишь бы файл уложился в 2 ГБ, больше Telegram боту отправить не даёт. Платных функций тут нет вовсе.\n\nПолностью бесплатно: без подписок, без рекламы, без встроенных покупок.\n\n🧩 Качаете на компьютере? Поставьте расширение для браузера — кнопка «Скачать» появится прямо на странице видео: videoner.download/ru/extension\n\n👥 Добавьте меня в группу — буду сам присылать видео по ссылкам, которые там публикуют.",
  notLink: "Это не похоже на ссылку. Пришли ссылку на видео.",
  inviteGreeting: "Привет! Я Videoner — бесплатно скачиваю видео из YouTube, TikTok, Instagram и других площадок. Сейчас подготовлю видео, которым с тобой поделились 👇",
  inviteNotFound: "Не нашёл видео по этой ссылке-приглашению. Пришли мне ссылку на видео — и я его скачаю.",
  inviteUnavailable: "Не получилось открыть видео по ссылке — сервис сейчас не отвечает. Открой ту же ссылку ещё раз через минуту.",
  fetchingInfo: "🔍 Получаю информацию о видео...",
  audioOnlyButton: "🎵 Только аудио (mp3)",
  photoButton: "📷 Скачать фото",
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
  fileCaption: (title, sourceUrl, shareUrl) =>
    withShareLine(
      (title ? `🎬 ${title.slice(0, 200)}\n\n` : "") +
        `Источник: ${sourceUrl}\n` +
        "Права на видео принадлежат его автору.\n" +
        "Скачано бесплатно через @VideonerBot",
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
  dailyLimitReached: "📅 На сегодня всё: достигнут суточный лимит в 20 скачиваний. Он обновится в течение суток — приходи позже, скачивать снова можно будет бесплатно.",
  errorStoryNeedsId:
    "пришлите ссылку на конкретную сторис: в приложении Instagram откройте её и нажмите «Поделиться» → «Копировать ссылку».",
  errorInstagramStory:
    "сторис Instagram бот пока не скачивает: Instagram показывает их только тем, кто вошёл в аккаунт.",
  errorLoginRequired:
    "Эта запись недоступна без входа в аккаунт: площадка отдаёт её только " +
    "авторизованным. Так бывает с приватными записями, возрастными ограничениями " +
    "и постами для ограниченного круга.\n\n" +
    "Публичные записи скачиваются без проблем — попробуйте другую ссылку.",
  errorUnsupportedPlatform:
    "Не распознал ссылку — проверь, что это прямая ссылка на видео с YouTube, TikTok, Instagram, Facebook, Twitter/X, Vimeo, VK, Rutube, OK.ru, Pinterest или Threads.",
  errorFileTooLarge: "файл в этом качестве слишком большой. Пришли ссылку ещё раз и выбери качество пониже — примерный размер написан на кнопках.",
  qualitiesHiddenBySize: (limit) => `\n\n⚖️ Качества тяжелее ${limit} не показаны: файлы больше Telegram не даёт боту отправить.`,
  videoTooBigForTelegram: (smallest) => `\n\n⚖️ Видео слишком тяжёлое для Telegram даже в самом низком качестве (~${smallest}). Можно скачать только звук.`,
  errorFormatUnavailable: "Для этого видео нет такого качества. Пришли ссылку ещё раз — покажу актуальный список.",
  errorNoVideoContent: "По этой ссылке нет видео для скачивания — похоже, пост содержит только фото.",
  errorRegionBlocked:
    "Это видео закрыто для просмотра за пределами страны автора — площадка не " +
    "отдаёт его нашему серверу. Обойти это нельзя: ограничение стоит на стороне " +
    "площадки.\n\nОстальные ссылки скачиваются как обычно.",
  errorRateLimited: "Слишком много ссылок подряд — подожди немного и пришли снова.",
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
  extensionButton: "🧩 Скачать через расширение",
  extensionCommand:
    "🧩 Videoner для браузера: кнопка «Скачать» прямо на странице видео — YouTube, Instagram, TikTok, VK, закрытые видео из вашего аккаунта и уроки GetCourse.\n\nДля Chrome, Яндекс Браузера, Edge, Opera и Firefox на компьютере.",
  extensionPageButton: "🧩 Установить расширение",
  addToGroupButton: "👥 Добавить в группу",
  fileCaptionShort: (title, sourceUrl) => (title ? `🎬 ${title.slice(0, 200)}\n\n` : "") + sourceUrl,
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
    "Как подключить:\n1. Проще всего — расширение Videoner на компьютере: войдите на сайт площадки, откройте окошко Videoner, нажмите «Подключить аккаунт» и пришлите мне код. Для группы — отправьте в группе /connect КОД.\n2. Или пришлите мне файл cookies.txt (экспорт кук из браузера) — или вставьте его текст сообщением.",
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
    "Ролики до 15 минут скачиваю сам, без команд. На остальные сообщения не отвечаю.\n\n⚙️ Админы группы могут настроить меня командой /settings: удалять сообщения со ссылками, вид подписи, качество и длинные видео.",
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
  queueDroppedByLimit: (count) => `\n\nСсылки из очереди (${count}) сегодня тоже не скачать — пришлите их завтра.`,
  queueLostOnRestart: (count) =>
    `⚠️ Бот перезапускается для обновления — очередь сброшена (ссылок: ${count}). Пришлите их снова через минуту.`,
  subtitlesButton: "📝 Субтитры",
  subtitlesBack: "⬅️ Назад к качеству",
  subtitlesAuto: "авто",
  subtitlesChoose: "Выберите язык субтитров",
  subtitlesPreparing: "📝 Готовлю субтитры...",
  subtitlesFailed: "Не получилось скачать субтитры на этом языке. Попробуйте другой язык.",
  subtitlesBusy: "YouTube сейчас не отдаёт субтитры — попробуйте через несколько минут.",
};

const en: Messages = {
  start: "Hi! Send me a link to a video from YouTube, TikTok, Instagram, Facebook, Twitter/X, Vimeo, VK, Rutube, OK.ru, Pinterest, or Threads — I'll help you download it.\n\n✨ No quality limits: you get whatever the platform offers, up to 4K — as long as the file fits in 2 GB, Telegram's limit for bots. There are no paid features here.\n\nCompletely free: no subscriptions, no ads, no in-app purchases.\n\n🧩 Downloading on a computer? Install the browser extension — a Download button appears right on the video page: videoner.download/extension\n\n👥 Add me to a group and I'll post the videos for the links people share there.",
  notLink: "That doesn't look like a link. Send me a video link.",
  inviteGreeting: "Hi! I'm Videoner — I download videos from YouTube, TikTok, Instagram and other platforms for free. Getting the video someone shared with you ready 👇",
  inviteNotFound: "I couldn't find a video for this invite link. Send me a video link and I'll download it.",
  inviteUnavailable: "I couldn't open the video from this link — the service isn't responding right now. Open the same link again in a minute.",
  fetchingInfo: "🔍 Fetching video info...",
  audioOnlyButton: "🎵 Audio only (mp3)",
  photoButton: "📷 Download photos",
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
  fileCaption: (title, sourceUrl, shareUrl) =>
    withShareLine(
      (title ? `🎬 ${title.slice(0, 200)}\n\n` : "") +
        `Source: ${sourceUrl}\n` +
        "All rights to the video belong to its author.\n" +
        "Downloaded for free with @VideonerBot",
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
  dailyLimitReached: "📅 That is it for today: you have reached the daily limit of 20 downloads. It refreshes within 24 hours — come back later and download again, free.",
  errorStoryNeedsId:
    "send a link to a specific story: open it in the Instagram app and tap Share → Copy link.",
  errorInstagramStory:
    "the bot can't download Instagram stories yet: Instagram shows them only to people who are signed in.",
  errorLoginRequired:
    "This post is not available without signing in: the platform serves it only to " +
    "logged-in users. That happens with private posts, age-restricted content and " +
    "posts shared with a limited audience.\n\n" +
    "Public posts download without trouble — try another link.",
  errorUnsupportedPlatform:
    "Couldn't recognize that link — make sure it's a direct video link from YouTube, TikTok, Instagram, Facebook, Twitter/X, Vimeo, VK, Rutube, OK.ru, Pinterest, or Threads.",
  errorFileTooLarge: "the file is too large in this quality. Send the link again and pick a lower quality — the approximate size is shown on the buttons.",
  qualitiesHiddenBySize: (limit) => `\n\n⚖️ Qualities heavier than ${limit} are hidden: Telegram does not let bots send larger files.`,
  videoTooBigForTelegram: (smallest) => `\n\n⚖️ This video is too heavy for Telegram even in the lowest quality (~${smallest}). Only the audio can be downloaded.`,
  errorFormatUnavailable: "That quality isn't available for this video. Send the link again — I'll show the current list.",
  errorNoVideoContent: "This link doesn't have a video to download — the post appears to be photo-only.",
  errorRegionBlocked:
    "This video is blocked outside the author's country — the platform won't serve " +
    "it to our server. There's no way around it: the restriction is on their side." +
    "\n\nOther links download as usual.",
  errorRateLimited: "Too many links in a row — wait a bit and send it again.",
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
  extensionButton: "🧩 Download with the extension",
  extensionCommand:
    "🧩 Videoner for your browser: a Download button right on the video page — YouTube, Instagram, TikTok, VK, private videos from your account and GetCourse lessons.\n\nFor Chrome, Edge, Opera, Yandex Browser and Firefox on a computer.",
  extensionPageButton: "🧩 Install the extension",
  addToGroupButton: "👥 Add to a group",
  fileCaptionShort: (title, sourceUrl) => (title ? `🎬 ${title.slice(0, 200)}\n\n` : "") + sourceUrl,
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
    "How to connect:\n1. Easiest: the Videoner extension on a computer — sign in on the platform's site, open the Videoner popup, press \"Connect account\" and send me the code. For a group, send /connect CODE in that group.\n2. Or send me a cookies.txt file (cookies exported from the browser), or paste its text as a message.",
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
    "I download clips up to 15 minutes on my own, no commands needed, and stay quiet otherwise.\n\n⚙️ Group admins can tune me with /settings: delete link messages, caption style, quality and long videos.",
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
  queueDroppedByLimit: (count) => `\n\nThe queued links (${count}) can't be downloaded today either — send them tomorrow.`,
  queueLostOnRestart: (count) =>
    `⚠️ The bot is restarting for an update — the queue was reset (links: ${count}). Please send them again in a minute.`,
  subtitlesButton: "📝 Subtitles",
  subtitlesBack: "⬅️ Back to quality",
  subtitlesAuto: "auto",
  subtitlesChoose: "Choose the subtitle language",
  subtitlesPreparing: "📝 Preparing subtitles...",
  subtitlesFailed: "Couldn't download subtitles in this language. Try another language.",
  subtitlesBusy: "YouTube is not serving subtitles right now — try again in a few minutes.",
};

const uk: Messages = {
  start: "Привіт! Надішли мені посилання на відео з YouTube, TikTok, Instagram, Facebook, Twitter/X, Vimeo, VK, Rutube, OK.ru, Pinterest або Threads — я допоможу його завантажити.\n\n✨ Якість нічим не обмежена: віддам усе, що є на платформі, аж до 4K — аби файл вмістився у 2 ГБ, більше Telegram боту надіслати не дає. Платних функцій тут немає взагалі.\n\nПовністю безкоштовно: без підписок, без реклами, без вбудованих покупок.\n\n🧩 Завантажуєте на комп'ютері? Встановіть розширення для браузера — кнопка «Завантажити» з'явиться прямо на сторінці відео: videoner.download/uk/extension\n\n👥 Додайте мене в групу — сам надсилатиму відео за посиланнями, які там публікують.",
  notLink: "Це не схоже на посилання. Надішли посилання на відео.",
  inviteGreeting: "Привіт! Я Videoner — безкоштовно завантажую відео з YouTube, TikTok, Instagram та інших платформ. Зараз підготую відео, яким із тобою поділилися 👇",
  inviteNotFound: "Не знайшов відео за цим посиланням-запрошенням. Надішли мені посилання на відео — і я його завантажу.",
  inviteUnavailable: "Не вдалося відкрити відео за посиланням — сервіс зараз не відповідає. Відкрий те саме посилання ще раз за хвилину.",
  fetchingInfo: "🔍 Отримую інформацію про відео...",
  audioOnlyButton: "🎵 Лише аудіо (mp3)",
  photoButton: "📷 Завантажити фото",
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
  fileCaption: (title, sourceUrl, shareUrl) =>
    withShareLine(
      (title ? `🎬 ${title.slice(0, 200)}\n\n` : "") +
        `Джерело: ${sourceUrl}\n` +
        "Права на відео належать його автору.\n" +
        "Завантажено безкоштовно через @VideonerBot",
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
  dailyLimitReached: "📅 На сьогодні все: досягнуто добового ліміту в 20 завантажень. Він оновиться протягом доби — повертайся пізніше, завантажувати знову можна буде безкоштовно.",
  errorStoryNeedsId:
    "надішліть посилання на конкретну сторіс: у застосунку Instagram відкрийте її й натисніть «Поділитися» → «Копіювати посилання».",
  errorInstagramStory:
    "сторіс Instagram бот поки не завантажує: Instagram показує їх лише тим, хто увійшов в акаунт.",
  errorLoginRequired:
    "Цей допис недоступний без входу в акаунт: платформа віддає його лише " +
    "авторизованим. Так буває з приватними дописами, віковими обмеженнями " +
    "й дописами для обмеженого кола.\n\n" +
    "Публічні дописи завантажуються без проблем — спробуйте інше посилання.",
  errorUnsupportedPlatform:
    "Не розпізнав посилання — перевір, що це пряме посилання на відео з YouTube, TikTok, Instagram, Facebook, Twitter/X, Vimeo, VK, Rutube, OK.ru, Pinterest або Threads.",
  errorFileTooLarge: "файл у цій якості завеликий. Надішли посилання ще раз і обери якість нижчу — приблизний розмір написано на кнопках.",
  qualitiesHiddenBySize: (limit) => `\n\n⚖️ Якості важчі за ${limit} не показано: більші файли Telegram не дає боту надіслати.`,
  videoTooBigForTelegram: (smallest) => `\n\n⚖️ Відео завелике для Telegram навіть у найнижчій якості (~${smallest}). Можна завантажити лише звук.`,
  errorFormatUnavailable: "Для цього відео немає такої якості. Надішли посилання ще раз — покажу актуальний список.",
  errorNoVideoContent: "За цим посиланням немає відео для завантаження — схоже, допис містить лише фото.",
  errorRegionBlocked:
    "Це відео закрите для перегляду за межами країни автора — платформа не " +
    "віддає його нашому серверу. Обійти це не можна: обмеження стоїть на боці " +
    "платформи.\n\nІнші посилання завантажуються як зазвичай.",
  errorRateLimited: "Забагато посилань поспіль — зачекай трохи й надішли знову.",
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
  extensionButton: "🧩 Завантажити через розширення",
  extensionCommand:
    "🧩 Videoner для браузера: кнопка «Завантажити» прямо на сторінці відео — YouTube, Instagram, TikTok, VK, закриті відео з вашого акаунта й уроки GetCourse.\n\nДля Chrome, Edge, Opera й Firefox на комп'ютері.",
  extensionPageButton: "🧩 Встановити розширення",
  addToGroupButton: "👥 Додати в групу",
  fileCaptionShort: (title, sourceUrl) => (title ? `🎬 ${title.slice(0, 200)}\n\n` : "") + sourceUrl,
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
    "Як підключити:\n1. Найпростіше — розширення Videoner на комп'ютері: увійдіть на сайт платформи, відкрийте віконце Videoner, натисніть «Підключити акаунт» і надішліть мені код. Для групи — надішліть у групі /connect КОД.\n2. Або надішліть мені файл cookies.txt (експорт куків із браузера) — чи вставте його текст повідомленням.",
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
    "Ролики до 15 хвилин завантажую сам, без команд. На інші повідомлення не відповідаю.\n\n⚙️ Адміни групи можуть налаштувати мене командою /settings: видаляти повідомлення з посиланнями, вигляд підпису, якість і довгі відео.",
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
  queueDroppedByLimit: (count) => `\n\nПосилання з черги (${count}) сьогодні теж не завантажити — надішліть їх завтра.`,
  queueLostOnRestart: (count) =>
    `⚠️ Бот перезапускається для оновлення — чергу скинуто (посилань: ${count}). Надішліть їх знову за хвилину.`,
  subtitlesButton: "📝 Субтитри",
  subtitlesBack: "⬅️ Назад до якості",
  subtitlesAuto: "авто",
  subtitlesChoose: "Оберіть мову субтитрів",
  subtitlesPreparing: "📝 Готую субтитри...",
  subtitlesFailed: "Не вдалося завантажити субтитри цією мовою. Спробуйте іншу мову.",
  subtitlesBusy: "YouTube зараз не віддає субтитри — спробуйте за кілька хвилин.",
};

export const messages: Record<Lang, Messages> = { ru, uk, en };
