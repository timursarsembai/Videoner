// Общее для окошка (popup.js) и фоновой части (background.js): адрес API,
// тексты интерфейса и перевод ошибок сервера на человеческий язык.

export const SITE = "https://videoner.download";
// Канал новостей проекта — ссылка под «Готово» (popup.js).
export const NEWS_URL = "https://t.me/videonerdownload";
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
    slideshow: "Слайдшоу (видео)",
    gallery: "Фото + слайдшоу",
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
    news: "📣 Новости проекта: @videonerdownload",
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
    acctRevoke: "Отозвать доступ к куки",
    acctRevoked:
      "Доступ к куки снят — расширение больше их не читает. Уже подключённые аккаунты остаются в боте: отключить их можно в «Мои подключения в боте».",
    updateAvailable: (v) => `Вышла новая версия ${v}.`,
    updateHow: "Как обновить",
    langAuto: "Авто",
    langLabel: "Язык",
  },
  uk: {
    loading: "Отримую інформацію про відео…",
    notVideoPage:
      "Відкрийте сторінку з відео на YouTube, TikTok, Instagram, Facebook, X, Vimeo, VK, Rutube, OK.ru, Pinterest або Threads і натисніть на значок ще раз. Урок GetCourse: якщо сторінку уроку було відкрито до встановлення розширення, оновіть її.",
    gcLesson: "Урок GetCourse",
    gcPick: "В уроці кілька відео — оберіть потрібне",
    gcVideo: (n) => `Відео ${n}`,
    gcNote: "Завантажує й склеює ваш браузер. Віконце можна закрити, браузер — ні.",
    gcNoStream: "Не вдалося отримати відео з плеєра. Оновіть сторінку уроку й спробуйте знову.",
    video: "Відео",
    photo: "Фото в оригінальному розмірі",
    slideshow: "Слайдшоу (відео)",
    gallery: "Фото + слайдшоу",
    audioOnly: "Лише звук (mp3)",
    subtitles: "Субтитри (.srt)",
    subtitlesAuto: "автоматичні",
    back: "Назад",
    starting: "Запускаю завантаження…",
    waiting: "Чекаю своєї черги на сервері…",
    downloading: "Завантажую",
    converting: "Обробляю",
    left: (eta) => `залишилося ${eta}`,
    saving: "Зберігаю в «Завантаження»…",
    done: "Готово — файл у «Завантаженнях».",
    news: "📣 Новини проєкту: @videonerdownload",
    again: "Завантажити ще",
    directDownload: "Завантажити відео (mp4)",
    directPhoto: "Завантажити фото (jpg)",
    directNote: "Одразу з браузера — без черги на сервері",
    moreOptions: "Інші якості та звук",
    fallback: "З браузера не вийшло — завантажую через сервер.",
    openSite: "Відкрити videoner.download",
    retry: "Спробувати знову",
    min: "хв",
    sec: "с",
    errNetwork: "Немає зв'язку з Videoner. Перевірте інтернет і спробуйте ще раз.",
    errRateLimit: "Забагато запитів поспіль. Зачекайте хвилину й спробуйте знову.",
    errUnsupported:
      "На цій сторінці не знайшлося відео, яке вміє завантажувати Videoner. Відкрийте сторінку конкретного ролика чи допису.",
    errYoutubeDaily: "Денний ліміт YouTube для вашої мережі вичерпано. Спробуйте завтра.",
    errTooLarge: "Файл у цій якості завеликий. Оберіть якість нижчу.",
    errLogin:
      "Цей допис недоступний без входу в акаунт: платформа віддає його лише авторизованим. Публічні дописи завантажуються без проблем.",
    errRegion: "Автор обмежив перегляд цього допису за країнами — завантажити його не вийде.",
    errServerBlocked: "Платформа тимчасово обмежила доступ нашому серверу. Спробуйте пізніше.",
    errFailed: "Не вдалося завантажити. Спробуйте ще раз або оберіть іншу якість.",
    errGeneric: "Щось пішло не так. Спробуйте ще раз трохи пізніше.",
    acctButton: (p) => `🔑 Підключити акаунт ${p} до бота`,
    acctWarn: (p) =>
      `Бот @VideonerBot зможе завантажувати від вашого акаунта ${p} те, що видно лише тим, хто увійшов: сторіс, закриті дописи. Платформи не люблять автоматичних завантажень і можуть обмежити акаунт — краще підключати не основний. Браузер запитає дозвіл на куки цього сайту; на сервер підуть лише куки ${p}, зашифровано.`,
    acctConfirm: "Підключити",
    acctCancel: "Скасувати",
    acctSending: "Підключаю…",
    acctDenied: "Без дозволу на куки підключити акаунт не вийде.",
    acctNoLogin: (p) => `Ви не увійшли в ${p} у цьому браузері. Увійдіть на сайті й натисніть ще раз.`,
    acctFailed: "Не вийшло. Спробуйте ще раз трохи пізніше.",
    acctCodeTitle: (p) => `Код для підключення ${p}:`,
    acctCodeHelp:
      "Надішліть його боту @VideonerBot в особисті — для своїх завантажень. Для групи — надішліть у групі /connect КОД. Код діє 10 хвилин.",
    acctCopy: "Скопіювати",
    acctCopied: "Скопійовано",
    acctOpenBot: "Відкрити бота",
    acctNewCode: "Отримати новий код",
    acctList: "Мої підключення в боті",
    acctRevoke: "Відкликати доступ до куків",
    acctRevoked:
      "Доступ до куків знято — розширення більше їх не читає. Уже підключені акаунти лишаються в боті: вимкнути їх можна в «Мої підключення в боті».",
    updateAvailable: (v) => `Вийшла нова версія ${v}.`,
    updateHow: "Як оновити",
    langAuto: "Авто",
    langLabel: "Мова",
  },
  kk: {
    loading: "Видео туралы ақпарат алынуда…",
    notVideoPage:
      "YouTube, TikTok, Instagram, Facebook, X, Vimeo, VK, Rutube, OK.ru, Pinterest немесе Threads сайтында видеосы бар бетті ашып, белгішені қайта басыңыз. GetCourse сабағы: егер сабақ беті кеңейтімді орнатпас бұрын ашылған болса, оны жаңартыңыз.",
    gcLesson: "GetCourse сабағы",
    gcPick: "Сабақта бірнеше видео бар — керегін таңдаңыз",
    gcVideo: (n) => `Видео ${n}`,
    gcNote: "Жүктеп алу мен біріктіруді браузеріңіз жасайды. Терезені жабуға болады, браузерді — жоқ.",
    gcNoStream: "Ойнатқыштан видеоны алу мүмкін болмады. Сабақ бетін жаңартып, қайта байқап көріңіз.",
    video: "Видео",
    photo: "Түпнұсқа өлшемдегі фото",
    slideshow: "Слайдшоу (видео)",
    gallery: "Фото + слайдшоу",
    audioOnly: "Тек дыбыс (mp3)",
    subtitles: "Субтитрлер (.srt)",
    subtitlesAuto: "автоматты",
    back: "Артқа",
    starting: "Жүктеп алуды бастап жатырмын…",
    waiting: "Сервердегі кезегімді күтіп тұрмын…",
    downloading: "Жүктеп алынуда",
    converting: "Өңделуде",
    left: (eta) => `${eta} қалды`,
    saving: "«Жүктеулер» қалтасына сақталуда…",
    done: "Дайын — файл «Жүктеулер» қалтасында.",
    news: "📣 Жоба жаңалықтары: @videonerdownload",
    again: "Тағы жүктеп алу",
    directDownload: "Видеоны жүктеп алу (mp4)",
    directPhoto: "Фотоны жүктеп алу (jpg)",
    directNote: "Тікелей браузерден — сервердегі кезексіз",
    moreOptions: "Басқа сапалар және дыбыс",
    fallback: "Браузерден болмады — сервер арқылы жүктеп аламын.",
    openSite: "videoner.download сайтын ашу",
    retry: "Қайта байқап көру",
    min: "мин",
    sec: "с",
    errNetwork: "Videoner-мен байланыс жоқ. Интернетті тексеріп, қайта байқап көріңіз.",
    errRateLimit: "Қатарынан тым көп сұраныс. Бір минут күтіп, қайта байқап көріңіз.",
    errUnsupported:
      "Бұл беттен Videoner жүктеп ала алатын видео табылмады. Нақты видеоның немесе жазбаның бетін ашыңыз.",
    errYoutubeDaily: "Желіңіз үшін YouTube-тың тәуліктік лимиті таусылды. Ертең байқап көріңіз.",
    errTooLarge: "Бұл сападағы файл тым үлкен. Төменірек сапаны таңдаңыз.",
    errLogin:
      "Бұл жазба аккаунтқа кірмейінше қолжетімсіз: платформа оны тек авторизацияланған пайдаланушыларға береді. Ашық жазбалар еш қиындықсыз жүктеледі.",
    errRegion: "Автор бұл жазбаны көруді елдер бойынша шектеген — оны жүктеп алу мүмкін емес.",
    errServerBlocked: "Платформа біздің серверге қолжетімділікті уақытша шектеді. Кейінірек байқап көріңіз.",
    errFailed: "Жүктеп алу мүмкін болмады. Қайта байқап көріңіз немесе басқа сапаны таңдаңыз.",
    errGeneric: "Бірдеңе дұрыс болмады. Сәл кейінірек қайта байқап көріңіз.",
    acctButton: (p) => `🔑 ${p} аккаунтын ботқа қосу`,
    acctWarn: (p) =>
      `@VideonerBot боты сіздің ${p} аккаунтыңыз арқылы тек кіргендерге көрінетін нәрселерді жүктеп ала алады: сторис, жабық жазбалар. Платформалар автоматты жүктеп алуды ұнатпайды және аккаунтты шектеуі мүмкін — негізгі емес аккаунтты қосқан дұрыс. Браузер осы сайттың куки файлдарына рұқсат сұрайды; серверге тек ${p} куки файлдары шифрланған түрде жіберіледі.`,
    acctConfirm: "Қосу",
    acctCancel: "Бас тарту",
    acctSending: "Қосып жатырмын…",
    acctDenied: "Кукиге рұқсатсыз аккаунтты қосу мүмкін емес.",
    acctNoLogin: (p) => `Сіз бұл браузерде ${p} жүйесіне кірмегенсіз. Сайтқа кіріп, қайта басыңыз.`,
    acctFailed: "Болмады. Сәл кейінірек қайта байқап көріңіз.",
    acctCodeTitle: (p) => `${p} қосуға арналған код:`,
    acctCodeHelp:
      "Оны @VideonerBot ботына жеке чатта жіберіңіз — өз жүктеп алуларыңыз үшін. Топ үшін — топта /connect КОД жіберіңіз. Код 10 минут жарамды.",
    acctCopy: "Көшіру",
    acctCopied: "Көшірілді",
    acctOpenBot: "Ботты ашу",
    acctNewCode: "Жаңа код алу",
    acctList: "Боттағы қосылымдарым",
    acctRevoke: "Кукиге рұқсатты қайтарып алу",
    acctRevoked:
      "Кукиге рұқсат алынды — кеңейтім оларды енді оқымайды. Бұрын қосылған аккаунттар ботта қалады: оларды «Боттағы қосылымдарым» бөлімінде ажыратуға болады.",
    updateAvailable: (v) => `Жаңа ${v} нұсқасы шықты.`,
    updateHow: "Қалай жаңартуға болады",
    langAuto: "Авто",
    langLabel: "Тіл",
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
    slideshow: "Slideshow (video)",
    gallery: "Photos + slideshow",
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
    news: "📣 Project news: @videonerdownload",
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
    acctRevoke: "Revoke cookie access",
    acctRevoked:
      "Cookie access is revoked — the extension no longer reads them. Accounts you already connected stay in the bot: remove them in “My connections in the bot”.",
    updateAvailable: (v) => `Version ${v} is out.`,
    updateHow: "How to update",
    langAuto: "Auto",
    langLabel: "Language",
  },
};

// Язык окошка: выбранный вручную (список вверху окошка, хранится в
// storage.local под LANG_KEY) или язык браузера — русский, украинский,
// остальным английский. Тот же выбор делают content.js и getcourse.js (им
// модули недоступны). lang и t — живые привязки: loadLang() меняет их до
// первой отрисовки окошка.
export const LANG_KEY = "uiLang";
export const LANG_NAMES = { ru: "Русский", uk: "Українська", kk: "Қазақша", en: "English" };
export const browserLang = pickLang(chrome.i18n.getUILanguage());
export let lang = browserLang;
export let t = TEXTS[lang];

// Страница сайта на текущем языке: английский — без префикса.
export const sitePath = (path) => (lang === "en" ? path : `/${lang}${path}`);

function pickLang(uiLanguage) {
  const base = uiLanguage.toLowerCase().split("-")[0];
  return base in TEXTS ? base : "en";
}

export async function loadLang() {
  const chosen = await chosenLang();
  lang = chosen ?? browserLang;
  t = TEXTS[lang];
}

// null — по языку браузера.
export async function chosenLang() {
  try {
    const value = (await chrome.storage.local.get(LANG_KEY))[LANG_KEY];
    return value in TEXTS ? value : null;
  } catch {
    return null;
  }
}

export async function saveLang(value) {
  if (value) await chrome.storage.local.set({ [LANG_KEY]: value });
  else await chrome.storage.local.remove(LANG_KEY);
}

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
  const latin = lang === "en";
  const locale = { ru: "ru-RU", uk: "uk-UA", kk: "kk-KZ", en: "en-US" }[lang];
  if (gb >= 1) return `~${gb.toLocaleString(locale, { maximumFractionDigits: 1 })} ${latin ? "GB" : "ГБ"}`;
  return `~${Math.max(1, Math.round(bytes / 1024 ** 2))} ${latin ? "MB" : "МБ"}`;
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
