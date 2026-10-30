// Общее для окошка (popup.js) и фоновой части (background.js): адрес API,
// тексты интерфейса и перевод ошибок сервера на человеческий язык.

export const SITE = "https://videoner.download";
// Вход в API для расширения: тот же набор действий, что у сайта, но без капчи
// (см. web/app/api/ext/[...path]/route.ts).
const API = `${SITE}/api/ext`;

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

export function api(path, body) {
  return request(`${API}${path}`, body);
}

// Статус скачивания — публичный адрес сервера (им же пользуется прогресс на
// сайте), а не вход для расширения: опрос раз в пару секунд съел бы весь его
// лимит, а GET из фоновой части Chrome отправляет без заголовка Origin, по
// которому этот вход узнаёт расширение.
export function downloadStatus(downloadId) {
  return request(`${SITE}/download/${encodeURIComponent(downloadId)}/status`);
}

async function request(url, body) {
  let res;
  try {
    res = await fetch(url, {
      method: body ? "POST" : "GET",
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError("network", 0);
  }
  let data = null;
  try {
    data = await res.json();
  } catch {
    // Прокси или Cloudflare могли ответить HTML-страницей ошибки.
  }
  if (!res.ok) {
    const raw = data?.message ?? data?.error ?? `HTTP ${res.status}`;
    throw new ApiError(Array.isArray(raw) ? raw.join("; ") : String(raw), res.status);
  }
  return data;
}

// Готовый файл сервер отдаёт по /download/<имя файла>. Статус скачивания
// присылает путь вида /downloads/<имя> — из него берём только имя.
export function fileUrl(pathOrName) {
  const name = String(pathOrName).split("/").pop();
  return `${SITE}/download/${encodeURIComponent(name)}`;
}

// Домены площадок, которые поддерживает Videoner (точная проверка ссылки — на
// сервере, см. server/src/validate/url.ts). Нужно, чтобы на посторонних
// страницах окошко сразу говорило «тут нечего скачивать», не тратя запрос.
const PLATFORM_HOSTS = [
  /(^|\.)youtube\.com$/, /^youtu\.be$/,
  /(^|\.)tiktok\.com$/,
  /(^|\.)instagram\.com$/,
  /(^|\.)facebook\.com$/, /^fb\.watch$/,
  /(^|\.)twitter\.com$/, /(^|\.)x\.com$/,
  /(^|\.)vimeo\.com$/,
  /(^|\.)vk\.com$/, /(^|\.)vk\.ru$/, /(^|\.)vkvideo\.ru$/,
  /(^|\.)rutube\.ru$/,
  /(^|\.)ok\.ru$/,
  /(^|\.)pinterest\.[a-z.]{2,}$/, /^pin\.it$/,
  /(^|\.)threads\.(net|com)$/,
];

export function isPlatformUrl(url) {
  try {
    const { protocol, hostname } = new URL(url);
    if (protocol !== "https:" && protocol !== "http:") return false;
    return PLATFORM_HOSTS.some((re) => re.test(hostname.toLowerCase()));
  } catch {
    return false;
  }
}

// Имя файла для «Загрузок»: без символов, которые Windows и Chrome не
// пропустят, и не длиннее разумного.
export function safeFileName(title, fallback = "video") {
  const cleaned = String(title ?? "")
    .replace(/[\\/:*?"<>|\u0000-\u001f]+/g, " ")
    .replace(/\s+/g, " ")
    .replace(/^[\s.]+|[\s.]+$/g, "")
    .slice(0, 120);
  return cleaned || fallback;
}

const TEXTS = {
  ru: {
    loading: "Получаю информацию о видео…",
    notVideoPage:
      "Откройте страницу с видео на YouTube, TikTok, Instagram, Facebook, X, Vimeo, VK, Rutube, OK.ru, Pinterest или Threads и нажмите на значок ещё раз. Урок GetCourse: если страница урока была открыта до установки расширения, обновите её.",
    gcLesson: "Урок GetCourse",
    gcPick: "В уроке несколько видео — выберите нужное",
    gcVideo: (n) => `Видео ${n}`,
    gcNote: "Качает и склеивает ваш браузер. Окошко можно закрыть, браузер — нет.",
    gcNoStream: "Не удалось получить видео из плеера. Обновите страницу урока и попробуйте снова.",
    video: "Видео",
    photo: "Фото в исходном размере",
    audioOnly: "Только звук (mp3)",
    subtitles: "Субтитры (.srt)",
    subtitlesAuto: "автоматические",
    back: "Назад",
    starting: "Запускаю скачивание…",
    waiting: "Жду своей очереди на сервере…",
    downloading: "Скачиваю",
    converting: "Обрабатываю",
    left: (eta) => `осталось ${eta}`,
    saving: "Сохраняю в «Загрузки»…",
    done: "Готово — файл в «Загрузках».",
    again: "Скачать ещё",
    directDownload: "Скачать видео (mp4)",
    directPhoto: "Скачать фото (jpg)",
    directNote: "Сразу из браузера — без очереди на сервере",
    moreOptions: "Другие качества и звук",
    fallback: "Из браузера не получилось — скачиваю через сервер.",
    openSite: "Открыть videoner.download",
    retry: "Попробовать снова",
    min: "мин",
    sec: "с",
    errNetwork: "Нет связи с Videoner. Проверьте интернет и попробуйте ещё раз.",
    errRateLimit: "Слишком много запросов подряд. Подождите минуту и попробуйте снова.",
    errUnsupported:
      "На этой странице не нашлось видео, которое умеет скачивать Videoner. Откройте страницу конкретного ролика или поста.",
    errYoutubeDaily: "Дневной лимит YouTube для вашей сети исчерпан. Попробуйте завтра.",
    errTooLarge: "Файл в этом качестве слишком большой. Выберите качество пониже.",
    errLogin:
      "Эта запись недоступна без входа в аккаунт: площадка отдаёт её только авторизованным. Публичные записи скачиваются без проблем.",
    errRegion: "Автор ограничил просмотр этой записи по странам — скачать её не получится.",
    errServerBlocked: "Площадка временно ограничила доступ нашему серверу. Попробуйте позже.",
    errFailed: "Не получилось скачать. Попробуйте ещё раз или выберите другое качество.",
    errGeneric: "Что-то пошло не так. Попробуйте ещё раз чуть позже.",
    acctButton: (p) => `🔑 Подключить аккаунт ${p} к боту`,
    acctWarn: (p) =>
      `Бот @VideonerBot сможет скачивать от вашего аккаунта ${p} то, что видно только вошедшим: сторис, закрытые записи. Площадки не любят автоматические скачивания и могут ограничить аккаунт — лучше подключать не основной. Браузер спросит разрешение на куки этого сайта; на сервер уйдут только куки ${p}, зашифрованно.`,
    acctConfirm: "Подключить",
    acctCancel: "Отмена",
    acctSending: "Подключаю…",
    acctDenied: "Без разрешения на куки подключить аккаунт не получится.",
    acctNoLogin: (p) => `Вы не вошли в ${p} в этом браузере. Войдите на сайте и нажмите ещё раз.`,
    acctFailed: "Не получилось. Попробуйте ещё раз чуть позже.",
    acctCodeTitle: (p) => `Код для подключения ${p}:`,
    acctCodeHelp:
      "Отправьте его боту @VideonerBot в личку — для своих скачиваний. Для группы — отправьте в группе /connect КОД. Код действует 10 минут.",
    acctCopy: "Скопировать",
    acctCopied: "Скопировано",
    acctOpenBot: "Открыть бота",
    acctNewCode: "Получить новый код",
    acctList: "Мои подключения в боте",
    updateAvailable: (v) => `Вышла новая версия ${v}.`,
    updateHow: "Как обновить",
  },
  en: {
    loading: "Fetching video info…",
    notVideoPage:
      "Open a video page on YouTube, TikTok, Instagram, Facebook, X, Vimeo, VK, Rutube, OK.ru, Pinterest or Threads and click the icon again. GetCourse lesson: if the lesson page was open before the extension was installed, reload it.",
    gcLesson: "GetCourse lesson",
    gcPick: "This lesson has several videos — pick one",
    gcVideo: (n) => `Video ${n}`,
    gcNote: "Your browser downloads and joins it. You can close this window, but not the browser.",
    gcNoStream: "Couldn't get the video from the player. Reload the lesson page and try again.",
    video: "Video",
    photo: "Photos in original size",
    audioOnly: "Audio only (mp3)",
    subtitles: "Subtitles (.srt)",
    subtitlesAuto: "auto-generated",
    back: "Back",
    starting: "Starting the download…",
    waiting: "Waiting for a free slot on the server…",
    downloading: "Downloading",
    converting: "Processing",
    left: (eta) => `${eta} left`,
    saving: "Saving to Downloads…",
    done: "Done — the file is in your Downloads.",
    again: "Download another",
    directDownload: "Download video (mp4)",
    directPhoto: "Download photo (jpg)",
    directNote: "Straight from your browser — no server queue",
    moreOptions: "Other qualities and audio",
    fallback: "The browser download failed — downloading via the server.",
    openSite: "Open videoner.download",
    retry: "Try again",
    min: "min",
    sec: "s",
    errNetwork: "Can't reach Videoner. Check your connection and try again.",
    errRateLimit: "Too many requests in a row. Wait a minute and try again.",
    errUnsupported:
      "There is no video on this page that Videoner can download. Open the page of a specific video or post.",
    errYoutubeDaily: "The daily YouTube limit for your network is used up. Try again tomorrow.",
    errTooLarge: "The file is too large in this quality. Pick a lower one.",
    errLogin:
      "This post is only available to signed-in users. Public posts download without any trouble.",
    errRegion: "The author restricted this post by country, so it can't be downloaded.",
    errServerBlocked: "The platform is temporarily limiting our server. Please try again later.",
    errFailed: "The download failed. Try again or pick another quality.",
    errGeneric: "Something went wrong. Please try again a bit later.",
    acctButton: (p) => `🔑 Connect your ${p} account to the bot`,
    acctWarn: (p) =>
      `@VideonerBot will be able to download what only signed-in people see on ${p} using your account: stories, private posts. Platforms dislike automated downloads and may restrict the account — better connect a secondary one. The browser will ask for permission to read this site's cookies; only ${p} cookies go to the server, encrypted.`,
    acctConfirm: "Connect",
    acctCancel: "Cancel",
    acctSending: "Connecting…",
    acctDenied: "The account can't be connected without the cookies permission.",
    acctNoLogin: (p) => `You're not signed in to ${p} in this browser. Sign in on the site and try again.`,
    acctFailed: "That didn't work. Try again a bit later.",
    acctCodeTitle: (p) => `Code to connect ${p}:`,
    acctCodeHelp:
      "Send it to @VideonerBot in a private chat — for your own downloads. For a group, send /connect CODE in the group. The code is valid for 10 minutes.",
    acctCopy: "Copy",
    acctCopied: "Copied",
    acctOpenBot: "Open the bot",
    acctNewCode: "Get a new code",
    acctList: "My connections in the bot",
    updateAvailable: (v) => `Version ${v} is out.`,
    updateHow: "How to update",
  },
};

export const lang = chrome.i18n.getUILanguage().toLowerCase().startsWith("ru") ? "ru" : "en";
export const t = TEXTS[lang];

// Ошибки сервера приходят по-английски и техническим языком (часто это
// текст yt-dlp). Порядок проверок повторяет friendlyError бота
// (bot/src/helpers.ts): региональный запрет и ограничения нашего сервера
// проверяются раньше «нужен вход», потому что в их текстах тоже бывает
// «sign in».
export function friendlyError(error) {
  const status = error?.status;
  const msg = String(error?.message ?? "").toLowerCase();

  if (status === 0 || msg === "network") return t.errNetwork;
  if (status === 429 || msg.includes("rate limit exceeded") || msg.includes("too many requests")) {
    return t.errRateLimit;
  }
  if (msg.includes("daily youtube limit")) return t.errYoutubeDaily;
  if (msg.includes("file too large") || msg.includes("request entity too large")) return t.errTooLarge;
  if (
    msg.includes("url not supported") ||
    msg.includes("invalid url") ||
    msg.includes("url is required") ||
    msg.includes("unsupported url") ||
    msg.includes("unsupported platform")
  ) {
    return t.errUnsupported;
  }
  if (
    msg.includes("not available in your country") ||
    msg.includes("not available in your region") ||
    msg.includes("not available from your location") ||
    msg.includes("blocked outside the author's country")
  ) {
    return t.errRegion;
  }
  if (
    msg.includes("empty media response") ||
    msg.includes("without being logged-in") ||
    msg.includes("rate-limit reached") ||
    msg.includes("confirm you're not a bot") ||
    msg.includes("confirm you’re not a bot")
  ) {
    return t.errServerBlocked;
  }
  if (
    msg.includes("certain audiences") ||
    msg.includes("age-restricted") ||
    msg.includes("age restricted") ||
    msg.includes("login required") ||
    msg.includes("requires authentication") ||
    msg.includes("sign in") ||
    msg.includes("log in") ||
    msg.includes("private") ||
    // У Meta закрытая запись выглядит как ошибка разбора страницы (см.
    // server/src/lib/error-category.ts).
    msg.includes("cannot parse data")
  ) {
    return t.errLogin;
  }
  if (msg === "failed") return t.errFailed;
  return t.errGeneric;
}

// «~3 мин», «40 с» — для строки прогресса.
export function formatEta(seconds) {
  if (!Number.isFinite(seconds) || seconds <= 0) return "";
  if (seconds < 60) return `${Math.round(seconds)} ${t.sec}`;
  return `~${Math.round(seconds / 60)} ${t.min}`;
}

export function formatSize(bytes) {
  if (!Number.isFinite(bytes) || bytes <= 0) return "";
  const gb = bytes / 1024 ** 3;
  const locale = lang === "ru" ? "ru-RU" : "en-US";
  if (gb >= 1) return `~${gb.toLocaleString(locale, { maximumFractionDigits: 1 })} ${lang === "ru" ? "ГБ" : "GB"}`;
  return `~${Math.max(1, Math.round(bytes / 1024 ** 2))} ${lang === "ru" ? "МБ" : "MB"}`;
}

export function formatDuration(seconds) {
  if (!Number.isFinite(seconds) || seconds <= 0) return "";
  const s = Math.round(seconds);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const pad = (n) => String(n).padStart(2, "0");
  return h ? `${h}:${pad(m)}:${pad(s % 60)}` : `${m}:${pad(s % 60)}`;
}

// chrome.storage.session. Окошку в рамке на чужой странице Firefox его не даёт
// (как и tabs, см. popup.js; проверено 29.10.2026) — тогда то же самое через
// фоновую часть: чтение и запись — сообщениями «embed-storage», изменения
// присылает соединение «embed-storage» (background.js).
const SESSION = chrome.storage.session;
const viaBackground = (op, extra) => chrome.runtime.sendMessage({ type: "embed-storage", op, ...extra });

export const session = {
  get: (keys = null) => (SESSION ? SESSION.get(keys) : viaBackground("get", { keys }).then((items) => items ?? {})),
  set: (items) => (SESSION ? SESSION.set(items) : viaBackground("set", { items })),
  remove: (keys) => (SESSION ? SESSION.remove(keys) : viaBackground("remove", { keys })),
  // listener(changes) — как у storage.onChanged, только для этой области.
  // Общее storage.onChanged, а не storage.session.onChanged: второго нет в
  // Firefox.
  onChanged(listener) {
    if (SESSION) {
      chrome.storage.onChanged.addListener((changes, area) => {
        if (area === "session") listener(changes);
      });
      return;
    }
    // Фоновую часть Firefox может остановить и запустить заново — соединение
    // тогда рвётся. Подключаемся снова и отдаём слушателю пустые изменения:
    // пусть перечитает состояние, пропущенное за время разрыва.
    const connect = () => {
      const port = chrome.runtime.connect({ name: "embed-storage" });
      port.onMessage.addListener(listener);
      port.onDisconnect.addListener(() => setTimeout(() => {
        connect();
        listener(null);
      }, 1_000));
    };
    connect();
  },
};

// Состояние скачиваний живёт в storage.session: окошко закрывается при
// любом клике мимо, а скачивание должно идти дальше и сохраниться в
// «Загрузки» без него. Одна задача на ссылку, у каждой свой ключ: общий
// объект на все задачи терял бы обновления, когда две идут параллельно.
const JOB_PREFIX = "job:";

export const jobKey = (url) => `${JOB_PREFIX}${url}`;

export async function getJob(url) {
  return (await session.get(jobKey(url)))[jobKey(url)] ?? null;
}

export async function getAllJobs() {
  const all = await session.get();
  return Object.entries(all)
    .filter(([key]) => key.startsWith(JOB_PREFIX))
    .map(([, job]) => job);
}

export async function setJob(url, job) {
  if (job) await session.set({ [jobKey(url)]: job });
  else await session.remove(jobKey(url));
}

// Плееры GetCourse во вкладке (getcourse.js): ключ на каждую рамку с плеером,
// значение — хеш видео. Пишет фоновая часть, читает окошко.
export const gcPlayerPrefix = (tabId) => `gc-player:${tabId}:`;
export const gcPlayerKey = (tabId, frameId) => `${gcPlayerPrefix(tabId)}${frameId}`;
