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

// id плейлиста YouTube из ссылки (/playlist?list=… или ролик с &list=…).
// Миксы (RD…) и личные списки (LL, WL) — не плейлисты. Та же логика, что
// server/src/lib/youtube-playlist.ts.
export function youtubePlaylistId(url) {
  try {
    const u = new URL(url);
    if (!/(^|\.)(youtube\.com|youtu\.be)$/i.test(u.hostname)) return null;
    const list = u.searchParams.get("list");
    if (!list || !/^[\w-]{10,64}$/.test(list) || /^(RD|LL|WL|UL)/.test(list)) return null;
    return list;
  } catch {
    return null;
  }
}

export function isPlaylistPage(url) {
  try {
    return Boolean(youtubePlaylistId(url)) && new URL(url).pathname.replace(/\/$/, "") === "/playlist";
  } catch {
    return false;
  }
}

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
    playlistOffer: "📃 Скачать весь плейлист",
    playlistTitle: (title, n) => `📃 Плейлист${title ? ` «${title}»` : ""}: ${n} видео`,
    playlistHint: "Скачаю по одному, по очереди. Окошко можно закрыть.",
    playlist720: "Плейлист в 720p",
    playlistBest: "Плейлист в лучшем качестве",
    playlistAudio: "Плейлист — только звук (mp3)",
    playlistProgress: (i, n) => `Видео ${i} из ${n}`,
    playlistStats: (done, failed) => `Скачано: ${done}${failed ? ` · не вышло: ${failed}` : ""}`,
    playlistStop: "⏹ Остановить",
    playlistDone: (done, n) => `Плейлист скачан: ${done} из ${n}.`,
    playlistStopped: (done, n) => `Остановлено. Скачано ${done} из ${n}.`,
    playlistLoading: "Получаю список видео…",
    close: "Закрыть",
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
    playlistOffer: "📃 Завантажити весь плейлист",
    playlistTitle: (title, n) => `📃 Плейлист${title ? ` «${title}»` : ""}: ${n} відео`,
    playlistHint: "Завантажу по одному, по черзі. Віконце можна закрити.",
    playlist720: "Плейлист у 720p",
    playlistBest: "Плейлист у найкращій якості",
    playlistAudio: "Плейлист — лише звук (mp3)",
    playlistProgress: (i, n) => `Відео ${i} з ${n}`,
    playlistStats: (done, failed) => `Завантажено: ${done}${failed ? ` · не вийшло: ${failed}` : ""}`,
    playlistStop: "⏹ Зупинити",
    playlistDone: (done, n) => `Плейлист завантажено: ${done} з ${n}.`,
    playlistStopped: (done, n) => `Зупинено. Завантажено ${done} з ${n}.`,
    playlistLoading: "Отримую список відео…",
    close: "Закрити",
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
    playlistOffer: "📃 Бүкіл плейлистті жүктеп алу",
    playlistTitle: (title, n) => `📃 Плейлист${title ? ` «${title}»` : ""}: ${n} видео`,
    playlistHint: "Бір-бірлеп, кезекпен жүктеп аламын. Терезені жабуға болады.",
    playlist720: "Плейлист 720p сапада",
    playlistBest: "Плейлист ең жақсы сапада",
    playlistAudio: "Плейлист — тек дыбыс (mp3)",
    playlistProgress: (i, n) => `Видео ${i} / ${n}`,
    playlistStats: (done, failed) => `Жүктелді: ${done}${failed ? ` · болмады: ${failed}` : ""}`,
    playlistStop: "⏹ Тоқтату",
    playlistDone: (done, n) => `Плейлист жүктелді: ${done} / ${n}.`,
    playlistStopped: (done, n) => `Тоқтатылды. Жүктелді: ${done} / ${n}.`,
    playlistLoading: "Видео тізімін аламын…",
    close: "Жабу",
    updateAvailable: (v) => `Жаңа ${v} нұсқасы шықты.`,
    updateHow: "Қалай жаңартуға болады",
    langAuto: "Авто",
    langLabel: "Тіл",
  },
  // Арабский (MSA). ⁦…⁩ (LRI…PDI) и ⁨…⁩ (FSI…PDI) —
  // невидимые изоляты направления: без них в RTL-тексте «@VideonerBot» и
  // «/connect» показались бы как «VideonerBot@» и «connect/».
  ar: {
    loading: "جارٍ جلب معلومات الفيديو…",
    notVideoPage:
      "افتح صفحة فيديو على YouTube أو TikTok أو Instagram أو Facebook أو X أو Vimeo أو VK أو Rutube أو OK.ru أو Pinterest أو Threads، ثم انقر على الأيقونة مرة أخرى. درس GetCourse: إذا كانت صفحة الدرس مفتوحة قبل تثبيت الإضافة، فأعد تحميلها.",
    gcLesson: "درس GetCourse",
    gcPick: "يحتوي هذا الدرس على عدة مقاطع فيديو — اختر واحدًا",
    gcVideo: (n) => `فيديو ${n}`,
    gcNote: "يتولى متصفحك تنزيل الفيديو ودمجه. يمكنك إغلاق هذه النافذة، لكن لا تغلق المتصفح.",
    gcNoStream: "تعذّر الحصول على الفيديو من المشغّل. أعد تحميل صفحة الدرس وحاول مرة أخرى.",
    video: "فيديو",
    photo: "الصور بحجمها الأصلي",
    slideshow: "عرض شرائح (فيديو)",
    gallery: "الصور + عرض الشرائح",
    audioOnly: "الصوت فقط (mp3)",
    subtitles: "الترجمة (⁦.srt⁩)",
    subtitlesAuto: "مُنشأة تلقائيًا",
    back: "رجوع",
    starting: "جارٍ بدء التنزيل…",
    waiting: "في انتظار دورك على الخادم…",
    downloading: "جارٍ التنزيل",
    converting: "جارٍ المعالجة",
    left: (eta) => `المتبقي ${eta}`,
    saving: "جارٍ الحفظ في «التنزيلات»…",
    done: "تم — الملف في «التنزيلات».",
    news: "📣 أخبار المشروع: ⁦@videonerdownload⁩",
    again: "تنزيل فيديو آخر",
    directDownload: "تنزيل الفيديو (mp4)",
    directPhoto: "تنزيل الصورة (jpg)",
    directNote: "مباشرةً من متصفحك — دون انتظار على الخادم",
    moreOptions: "جودات أخرى والصوت",
    fallback: "تعذّر التنزيل من المتصفح — جارٍ التنزيل عبر الخادم.",
    openSite: "فتح videoner.download",
    retry: "حاول مرة أخرى",
    min: "د",
    sec: "ث",
    errNetwork: "تعذّر الاتصال بـ Videoner. تحقّق من اتصالك بالإنترنت وحاول مرة أخرى.",
    errRateLimit: "طلبات كثيرة متتالية. انتظر دقيقة وحاول مرة أخرى.",
    errUnsupported:
      "لا يوجد في هذه الصفحة فيديو يستطيع Videoner تنزيله. افتح صفحة فيديو أو منشور محدّد.",
    errYoutubeDaily: "استُنفد الحد اليومي لـ YouTube على شبكتك. حاول مرة أخرى غدًا.",
    errTooLarge: "الملف كبير جدًا بهذه الجودة. اختر جودة أقل.",
    errLogin:
      "هذا المنشور متاح فقط للمستخدمين الذين سجّلوا الدخول. أما المنشورات العامة فتُنزَّل دون أي مشكلة.",
    errRegion: "قيّد صاحب المنشور مشاهدته حسب الدولة، لذا لا يمكن تنزيله.",
    errServerBlocked: "تقيّد المنصة وصول خادمنا مؤقتًا. يُرجى المحاولة لاحقًا.",
    errFailed: "فشل التنزيل. حاول مرة أخرى أو اختر جودة أخرى.",
    errGeneric: "حدث خطأ ما. يُرجى المحاولة مرة أخرى بعد قليل.",
    acctButton: (p) => `🔑 ربط حسابك على ${p} بالبوت`,
    acctWarn: (p) =>
      `سيتمكّن ⁦@VideonerBot⁩ من تنزيل ما لا يراه إلا المسجّلون على ${p} باستخدام حسابك: القصص والمنشورات الخاصة. لا تحب المنصات التنزيل الآلي وقد تقيّد الحساب — يُفضَّل ربط حساب ثانوي. سيطلب المتصفح إذنًا بقراءة ملفات تعريف الارتباط (الكوكيز) لهذا الموقع؛ ولن يُرسَل إلى الخادم سوى كوكيز ${p}، وهي مشفّرة.`,
    acctConfirm: "ربط",
    acctCancel: "إلغاء",
    acctSending: "جارٍ الربط…",
    acctDenied: "لا يمكن ربط الحساب دون إذن الوصول إلى الكوكيز.",
    acctNoLogin: (p) => `لم تسجّل الدخول إلى ${p} في هذا المتصفح. سجّل الدخول في الموقع ثم حاول مرة أخرى.`,
    acctFailed: "لم ينجح ذلك. حاول مرة أخرى بعد قليل.",
    acctCodeTitle: (p) => `رمز ربط ${p}:`,
    acctCodeHelp:
      "أرسله إلى ⁦@VideonerBot⁩ في محادثة خاصة — لتنزيلاتك الشخصية. أما للمجموعة، فأرسل ⁦/connect الرمز⁩ في المجموعة. الرمز صالح لمدة 10 دقائق.",
    acctCopy: "نسخ",
    acctCopied: "تم النسخ",
    acctOpenBot: "فتح البوت",
    acctNewCode: "الحصول على رمز جديد",
    acctList: "حساباتي المرتبطة في البوت",
    acctRevoke: "إلغاء إذن الوصول إلى الكوكيز",
    acctRevoked:
      "أُلغي إذن الوصول إلى الكوكيز — لم تعد الإضافة تقرؤها. أما الحسابات التي ربطتها من قبل فتبقى في البوت: يمكنك فصلها من «حساباتي المرتبطة في البوت».",
    playlistOffer: "📃 تنزيل قائمة التشغيل كاملة",
    playlistTitle: (title, n) => `📃 قائمة التشغيل${title ? ` «⁨${title}⁩»` : ""}: ${n} فيديو`,
    playlistHint: "سأنزّلها واحدًا تلو الآخر. يمكنك إغلاق هذه النافذة.",
    playlist720: "قائمة التشغيل بدقة 720p",
    playlistBest: "قائمة التشغيل بأفضل جودة",
    playlistAudio: "قائمة التشغيل — الصوت فقط (mp3)",
    playlistProgress: (i, n) => `الفيديو ${i} من ${n}`,
    playlistStats: (done, failed) => `تم التنزيل: ${done}${failed ? ` · فشل: ${failed}` : ""}`,
    playlistStop: "⏹ إيقاف",
    playlistDone: (done, n) => `اكتمل تنزيل قائمة التشغيل: ${done} من ${n}.`,
    playlistStopped: (done, n) => `تم الإيقاف. تم تنزيل ${done} من ${n}.`,
    playlistLoading: "جارٍ جلب قائمة الفيديوهات…",
    close: "إغلاق",
    updateAvailable: (v) => `صدر الإصدار الجديد ${v}.`,
    updateHow: "كيفية التحديث",
    langAuto: "تلقائي",
    langLabel: "اللغة",
  },
  // Упрощённый китайский. Полноширинная пунктуация в предложениях; латиница
  // (названия площадок, @VideonerBot, /connect) — как есть.
  zh: {
    loading: "正在获取视频信息…",
    notVideoPage:
      "请打开 YouTube、TikTok、Instagram、Facebook、X、Vimeo、VK、Rutube、OK.ru、Pinterest 或 Threads 上的视频页面，然后再次点击图标。GetCourse 课程：如果课程页面是在安装扩展之前打开的，请刷新该页面。",
    gcLesson: "GetCourse 课程",
    gcPick: "本课程包含多个视频，请选择一个",
    gcVideo: (n) => `视频 ${n}`,
    gcNote: "由你的浏览器下载并合并视频。可以关闭此窗口，但不要关闭浏览器。",
    gcNoStream: "无法从播放器获取视频。请刷新课程页面后重试。",
    video: "视频",
    photo: "原始尺寸图片",
    slideshow: "幻灯片（视频）",
    gallery: "图片 + 幻灯片",
    audioOnly: "仅音频（mp3）",
    subtitles: "字幕（.srt）",
    subtitlesAuto: "自动生成",
    back: "返回",
    starting: "正在开始下载…",
    waiting: "正在服务器上排队等候…",
    downloading: "正在下载",
    converting: "正在处理",
    left: (eta) => `剩余 ${eta}`,
    saving: "正在保存到“下载”…",
    done: "完成，文件已保存到“下载”。",
    news: "📣 项目动态：@videonerdownload",
    again: "继续下载",
    directDownload: "下载视频（mp4）",
    directPhoto: "下载图片（jpg）",
    directNote: "直接通过浏览器下载，无需服务器排队",
    moreOptions: "其他画质和音频",
    fallback: "浏览器下载失败，正在通过服务器下载。",
    openSite: "打开 videoner.download",
    retry: "重试",
    min: "分钟",
    sec: "秒",
    errNetwork: "无法连接 Videoner。请检查网络连接后重试。",
    errRateLimit: "连续请求过多。请等待一分钟后重试。",
    errUnsupported:
      "此页面上没有 Videoner 可以下载的视频。请打开具体视频或帖子的页面。",
    errYoutubeDaily: "你所在网络的 YouTube 每日限额已用完。请明天再试。",
    errTooLarge: "该画质的文件太大。请选择较低的画质。",
    errLogin:
      "此帖子仅对已登录用户可见。公开帖子可以正常下载。",
    errRegion: "作者按国家/地区限制了此帖子的观看，因此无法下载。",
    errServerBlocked: "该平台暂时限制了我们服务器的访问。请稍后重试。",
    errFailed: "下载失败。请重试或选择其他画质。",
    errGeneric: "出了点问题。请稍后重试。",
    acctButton: (p) => `🔑 将你的 ${p} 账号连接到机器人`,
    acctWarn: (p) =>
      `@VideonerBot 将能使用你的账号下载 ${p} 上仅登录用户可见的内容：快拍（Stories）、私密帖子。各平台不喜欢自动下载，可能会限制账号，建议连接一个非主要账号。浏览器会请求读取此网站 Cookie 的权限；只有 ${p} 的 Cookie 会以加密方式发送到服务器。`,
    acctConfirm: "连接",
    acctCancel: "取消",
    acctSending: "正在连接…",
    acctDenied: "没有 Cookie 权限，无法连接账号。",
    acctNoLogin: (p) => `你尚未在此浏览器中登录 ${p}。请在该网站登录后重试。`,
    acctFailed: "操作未成功。请稍后重试。",
    acctCodeTitle: (p) => `连接 ${p} 的验证码：`,
    acctCodeHelp:
      "在私聊中将其发送给 @VideonerBot，用于你自己的下载。如需用于群组，请在群组中发送 /connect 验证码。验证码 10 分钟内有效。",
    acctCopy: "复制",
    acctCopied: "已复制",
    acctOpenBot: "打开机器人",
    acctNewCode: "获取新验证码",
    acctList: "我在机器人中的连接",
    acctRevoke: "撤销 Cookie 访问权限",
    acctRevoked:
      "已撤销 Cookie 访问权限，扩展不再读取 Cookie。已连接的账号仍保留在机器人中：可在“我在机器人中的连接”中移除。",
    playlistOffer: "📃 下载整个播放列表",
    playlistTitle: (title, n) => `📃 播放列表${title ? `“${title}”` : ""}：${n} 个视频`,
    playlistHint: "将逐个依次下载。可以关闭此窗口。",
    playlist720: "播放列表（720p）",
    playlistBest: "播放列表（最佳画质）",
    playlistAudio: "播放列表 — 仅音频（mp3）",
    playlistProgress: (i, n) => `第 ${i} 个视频，共 ${n} 个`,
    playlistStats: (done, failed) => `已下载：${done}${failed ? ` · 失败：${failed}` : ""}`,
    playlistStop: "⏹ 停止",
    playlistDone: (done, n) => `播放列表下载完成：${done}/${n}。`,
    playlistStopped: (done, n) => `已停止。已下载 ${done}/${n}。`,
    playlistLoading: "正在获取视频列表…",
    close: "关闭",
    updateAvailable: (v) => `新版本 ${v} 已发布。`,
    updateHow: "如何更新",
    langAuto: "自动",
    langLabel: "语言",
  },
  // Хинди (деванагари), современный разговорный язык; устоявшиеся технические
  // заимствования — как есть. Латиница (названия площадок, @VideonerBot,
  // /connect), западные цифры и GB/MB — как в английском.
  hi: {
    loading: "वीडियो की जानकारी ली जा रही है…",
    notVideoPage:
      "YouTube, TikTok, Instagram, Facebook, X, Vimeo, VK, Rutube, OK.ru, Pinterest या Threads पर किसी वीडियो का पेज खोलें और फिर से आइकन पर क्लिक करें। GetCourse लेसन: अगर लेसन का पेज एक्सटेंशन इंस्टॉल होने से पहले खुला था, तो उसे रीलोड करें।",
    gcLesson: "GetCourse लेसन",
    gcPick: "इस लेसन में कई वीडियो हैं — एक चुनें",
    gcVideo: (n) => `वीडियो ${n}`,
    gcNote: "आपका ब्राउज़र इसे डाउनलोड करके जोड़ता है। आप यह विंडो बंद कर सकते हैं, लेकिन ब्राउज़र नहीं।",
    gcNoStream: "प्लेयर से वीडियो नहीं मिल सका। लेसन का पेज रीलोड करें और फिर से कोशिश करें।",
    video: "वीडियो",
    photo: "ओरिजिनल साइज़ में फ़ोटो",
    slideshow: "स्लाइडशो (वीडियो)",
    gallery: "फ़ोटो + स्लाइडशो",
    audioOnly: "सिर्फ़ ऑडियो (mp3)",
    subtitles: "सबटाइटल (.srt)",
    subtitlesAuto: "अपने-आप बने",
    back: "वापस",
    starting: "डाउनलोड शुरू हो रहा है…",
    waiting: "सर्वर पर खाली जगह का इंतज़ार…",
    downloading: "डाउनलोड हो रहा है",
    converting: "प्रोसेस हो रहा है",
    left: (eta) => `${eta} बाकी`,
    saving: "डाउनलोड्स में सेव हो रहा है…",
    done: "हो गया — फ़ाइल आपके डाउनलोड्स में है।",
    news: "📣 प्रोजेक्ट की खबरें: @videonerdownload",
    again: "एक और डाउनलोड करें",
    directDownload: "वीडियो डाउनलोड करें (mp4)",
    directPhoto: "फ़ोटो डाउनलोड करें (jpg)",
    directNote: "सीधे आपके ब्राउज़र से — सर्वर की कतार के बिना",
    moreOptions: "दूसरी क्वालिटी और ऑडियो",
    fallback: "ब्राउज़र से डाउनलोड नहीं हो सका — सर्वर के ज़रिए डाउनलोड हो रहा है।",
    openSite: "videoner.download खोलें",
    retry: "फिर से कोशिश करें",
    min: "मिनट",
    sec: "सेकंड",
    errNetwork: "Videoner से कनेक्ट नहीं हो पा रहा। अपना इंटरनेट कनेक्शन जाँचें और फिर से कोशिश करें।",
    errRateLimit: "लगातार बहुत ज़्यादा रिक्वेस्ट। एक मिनट रुकें और फिर से कोशिश करें।",
    errUnsupported:
      "इस पेज पर ऐसा कोई वीडियो नहीं है जिसे Videoner डाउनलोड कर सके। किसी खास वीडियो या पोस्ट का पेज खोलें।",
    errYoutubeDaily: "आपके नेटवर्क के लिए YouTube की आज की लिमिट खत्म हो गई है। कल फिर से कोशिश करें।",
    errTooLarge: "इस क्वालिटी में फ़ाइल बहुत बड़ी है। कम क्वालिटी चुनें।",
    errLogin:
      "यह पोस्ट सिर्फ़ साइन-इन किए हुए यूज़र्स के लिए उपलब्ध है। पब्लिक पोस्ट बिना किसी दिक्कत के डाउनलोड होते हैं।",
    errRegion: "लेखक ने इस पोस्ट को देश के हिसाब से सीमित किया है, इसलिए इसे डाउनलोड नहीं किया जा सकता।",
    errServerBlocked: "प्लेटफ़ॉर्म फ़िलहाल हमारे सर्वर को सीमित कर रहा है। कृपया थोड़ी देर बाद फिर से कोशिश करें।",
    errFailed: "डाउनलोड नहीं हो सका। फिर से कोशिश करें या कोई दूसरी क्वालिटी चुनें।",
    errGeneric: "कुछ गड़बड़ हो गई। कृपया थोड़ी देर बाद फिर से कोशिश करें।",
    acctButton: (p) => `🔑 अपना ${p} खाता बॉट से कनेक्ट करें`,
    acctWarn: (p) =>
      `@VideonerBot आपके खाते से ${p} पर वह कंटेंट डाउनलोड कर पाएगा जो सिर्फ़ साइन-इन किए हुए लोगों को दिखता है: स्टोरीज़, प्राइवेट पोस्ट। प्लेटफ़ॉर्म ऑटोमैटिक डाउनलोड पसंद नहीं करते और खाते पर रोक लगा सकते हैं — बेहतर है कोई दूसरा, अतिरिक्त खाता कनेक्ट करें। ब्राउज़र इस साइट की कुकीज़ पढ़ने की अनुमति माँगेगा; सर्वर पर सिर्फ़ ${p} की कुकीज़ एन्क्रिप्ट होकर जाती हैं।`,
    acctConfirm: "कनेक्ट करें",
    acctCancel: "रद्द करें",
    acctSending: "कनेक्ट हो रहा है…",
    acctDenied: "कुकीज़ की अनुमति के बिना खाता कनेक्ट नहीं किया जा सकता।",
    acctNoLogin: (p) => `इस ब्राउज़र में आप ${p} पर साइन इन नहीं हैं। साइट पर साइन इन करें और फिर से कोशिश करें।`,
    acctFailed: "यह नहीं हो सका। थोड़ी देर बाद फिर से कोशिश करें।",
    acctCodeTitle: (p) => `${p} कनेक्ट करने का कोड:`,
    acctCodeHelp:
      "इसे प्राइवेट चैट में @VideonerBot को भेजें — अपने डाउनलोड के लिए। ग्रुप के लिए, ग्रुप में /connect कोड भेजें। कोड 10 मिनट तक मान्य है।",
    acctCopy: "कॉपी करें",
    acctCopied: "कॉपी हो गया",
    acctOpenBot: "बॉट खोलें",
    acctNewCode: "नया कोड पाएँ",
    acctList: "बॉट में मेरे कनेक्शन",
    acctRevoke: "कुकीज़ की अनुमति वापस लें",
    acctRevoked:
      "कुकीज़ की अनुमति वापस ले ली गई — एक्सटेंशन अब उन्हें नहीं पढ़ता। जो खाते आप पहले कनेक्ट कर चुके हैं, वे बॉट में बने रहेंगे: उन्हें “बॉट में मेरे कनेक्शन” में हटाएँ।",
    playlistOffer: "📃 पूरी प्लेलिस्ट डाउनलोड करें",
    playlistTitle: (title, n) => `📃 प्लेलिस्ट${title ? ` "${title}"` : ""}: ${n} वीडियो`,
    playlistHint: "मैं इन्हें एक-एक करके डाउनलोड करूँगा। आप यह विंडो बंद कर सकते हैं।",
    playlist720: "प्लेलिस्ट 720p में",
    playlistBest: "प्लेलिस्ट सबसे अच्छी क्वालिटी में",
    playlistAudio: "प्लेलिस्ट — सिर्फ़ ऑडियो (mp3)",
    playlistProgress: (i, n) => `वीडियो ${i} / ${n}`,
    playlistStats: (done, failed) => `डाउनलोड हुए: ${done}${failed ? ` · नहीं हो सके: ${failed}` : ""}`,
    playlistStop: "⏹ रोकें",
    playlistDone: (done, n) => `प्लेलिस्ट डाउनलोड हो गई: ${n} में से ${done}।`,
    playlistStopped: (done, n) => `रोक दिया गया। ${n} में से ${done} डाउनलोड हुए।`,
    playlistLoading: "वीडियो की सूची ली जा रही है…",
    close: "बंद करें",
    updateAvailable: (v) => `वर्शन ${v} आ गया है।`,
    updateHow: "अपडेट कैसे करें",
    langAuto: "ऑटो",
    langLabel: "भाषा",
  },
  id: {
    loading: "Mengambil info video…",
    notVideoPage:
      "Buka halaman video di YouTube, TikTok, Instagram, Facebook, X, Vimeo, VK, Rutube, OK.ru, Pinterest atau Threads, lalu klik ikonnya lagi. Pelajaran GetCourse: jika halaman pelajaran sudah terbuka sebelum ekstensi dipasang, muat ulang halaman tersebut.",
    gcLesson: "Pelajaran GetCourse",
    gcPick: "Pelajaran ini berisi beberapa video — pilih salah satu",
    gcVideo: (n) => `Video ${n}`,
    gcNote: "Browser Anda yang mengunduh dan menggabungkannya. Jendela ini boleh ditutup, tetapi browser jangan.",
    gcNoStream: "Gagal mengambil video dari pemutar. Muat ulang halaman pelajaran dan coba lagi.",
    video: "Video",
    photo: "Foto ukuran asli",
    slideshow: "Tayangan slide (video)",
    gallery: "Foto + tayangan slide",
    audioOnly: "Hanya audio (mp3)",
    subtitles: "Subtitel (.srt)",
    subtitlesAuto: "otomatis",
    back: "Kembali",
    starting: "Memulai unduhan…",
    waiting: "Menunggu giliran di server…",
    downloading: "Mengunduh",
    converting: "Memproses",
    left: (eta) => `sisa ${eta}`,
    saving: "Menyimpan ke Unduhan…",
    done: "Selesai — file ada di folder Unduhan Anda.",
    news: "📣 Berita proyek: @videonerdownload",
    again: "Unduh yang lain",
    directDownload: "Unduh video (mp4)",
    directPhoto: "Unduh foto (jpg)",
    directNote: "Langsung dari browser Anda — tanpa antrean server",
    moreOptions: "Kualitas lain dan audio",
    fallback: "Unduhan lewat browser gagal — mengunduh lewat server.",
    openSite: "Buka videoner.download",
    retry: "Coba lagi",
    min: "mnt",
    sec: "dtk",
    errNetwork: "Tidak dapat terhubung ke Videoner. Periksa koneksi internet Anda dan coba lagi.",
    errRateLimit: "Terlalu banyak permintaan berturut-turut. Tunggu sebentar lalu coba lagi.",
    errUnsupported:
      "Tidak ada video di halaman ini yang bisa diunduh Videoner. Buka halaman video atau postingan tertentu.",
    errYoutubeDaily: "Batas harian YouTube untuk jaringan Anda sudah habis. Coba lagi besok.",
    errTooLarge: "File dalam kualitas ini terlalu besar. Pilih kualitas yang lebih rendah.",
    errLogin:
      "Postingan ini hanya tersedia bagi pengguna yang sudah masuk. Postingan publik bisa diunduh tanpa masalah.",
    errRegion: "Pembuat membatasi postingan ini berdasarkan negara, jadi tidak bisa diunduh.",
    errServerBlocked: "Platform untuk sementara membatasi akses server kami. Silakan coba lagi nanti.",
    errFailed: "Unduhan gagal. Coba lagi atau pilih kualitas lain.",
    errGeneric: "Terjadi kesalahan. Silakan coba lagi beberapa saat lagi.",
    acctButton: (p) => `🔑 Hubungkan akun ${p} Anda ke bot`,
    acctWarn: (p) =>
      `@VideonerBot akan bisa mengunduh dengan akun ${p} Anda konten yang hanya terlihat oleh pengguna yang sudah masuk: story, postingan privat. Platform tidak menyukai unduhan otomatis dan bisa membatasi akun — sebaiknya hubungkan akun cadangan. Browser akan meminta izin untuk membaca cookie situs ini; hanya cookie ${p} yang dikirim ke server, dalam bentuk terenkripsi.`,
    acctConfirm: "Hubungkan",
    acctCancel: "Batal",
    acctSending: "Menghubungkan…",
    acctDenied: "Akun tidak bisa dihubungkan tanpa izin cookie.",
    acctNoLogin: (p) => `Anda belum masuk ke ${p} di browser ini. Masuk di situsnya lalu coba lagi.`,
    acctFailed: "Tidak berhasil. Coba lagi beberapa saat lagi.",
    acctCodeTitle: (p) => `Kode untuk menghubungkan ${p}:`,
    acctCodeHelp:
      "Kirim kode ini ke @VideonerBot lewat chat pribadi — untuk unduhan Anda sendiri. Untuk grup, kirim /connect KODE di grup tersebut. Kode berlaku 10 menit.",
    acctCopy: "Salin",
    acctCopied: "Tersalin",
    acctOpenBot: "Buka bot",
    acctNewCode: "Dapatkan kode baru",
    acctList: "Koneksi saya di bot",
    acctRevoke: "Cabut akses cookie",
    acctRevoked:
      "Akses cookie sudah dicabut — ekstensi tidak lagi membacanya. Akun yang sudah terhubung tetap ada di bot: putuskan di “Koneksi saya di bot”.",
    playlistOffer: "📃 Unduh seluruh playlist",
    playlistTitle: (title, n) => `📃 Playlist${title ? ` "${title}"` : ""}: ${n} video`,
    playlistHint: "Video akan diunduh satu per satu secara berurutan. Jendela ini boleh ditutup.",
    playlist720: "Playlist dalam 720p",
    playlistBest: "Playlist dalam kualitas terbaik",
    playlistAudio: "Playlist — hanya audio (mp3)",
    playlistProgress: (i, n) => `Video ${i} dari ${n}`,
    playlistStats: (done, failed) => `Terunduh: ${done}${failed ? ` · gagal: ${failed}` : ""}`,
    playlistStop: "⏹ Hentikan",
    playlistDone: (done, n) => `Playlist terunduh: ${done} dari ${n}.`,
    playlistStopped: (done, n) => `Dihentikan. Terunduh ${done} dari ${n}.`,
    playlistLoading: "Mengambil daftar video…",
    close: "Tutup",
    updateAvailable: (v) => `Versi ${v} sudah tersedia.`,
    updateHow: "Cara memperbarui",
    langAuto: "Otomatis",
    langLabel: "Bahasa",
  },
  sw: {
    loading: "Inapata maelezo ya video…",
    notVideoPage:
      "Fungua ukurasa wa video kwenye YouTube, TikTok, Instagram, Facebook, X, Vimeo, VK, Rutube, OK.ru, Pinterest au Threads, kisha bofya ikoni tena. Somo la GetCourse: ikiwa ukurasa wa somo ulikuwa wazi kabla kiendelezi hakijasakinishwa, upakie upya.",
    gcLesson: "Somo la GetCourse",
    gcPick: "Somo hili lina video kadhaa — chagua moja",
    gcVideo: (n) => `Video ${n}`,
    gcNote: "Kivinjari chako ndicho kinachoipakua na kuiunganisha. Unaweza kufunga dirisha hili, lakini si kivinjari.",
    gcNoStream: "Imeshindwa kupata video kutoka kwenye kicheza. Pakia upya ukurasa wa somo kisha ujaribu tena.",
    video: "Video",
    photo: "Picha za ukubwa halisi",
    slideshow: "Onyesho la slaidi (video)",
    gallery: "Picha + onyesho la slaidi",
    audioOnly: "Sauti pekee (mp3)",
    subtitles: "Manukuu (.srt)",
    subtitlesAuto: "ya kiotomatiki",
    back: "Rudi",
    starting: "Inaanza kupakua…",
    waiting: "Inasubiri nafasi kwenye seva…",
    downloading: "Inapakua",
    converting: "Inachakata",
    left: (eta) => `zimebaki ${eta}`,
    saving: "Inahifadhi kwenye Vipakuliwa…",
    done: "Imekamilika — faili iko kwenye Vipakuliwa vyako.",
    news: "📣 Habari za mradi: @videonerdownload",
    again: "Pakua nyingine",
    directDownload: "Pakua video (mp4)",
    directPhoto: "Pakua picha (jpg)",
    directNote: "Moja kwa moja kutoka kwenye kivinjari chako — bila foleni ya seva",
    moreOptions: "Ubora mwingine na sauti",
    fallback: "Kupakua kupitia kivinjari kumeshindwa — inapakua kupitia seva.",
    openSite: "Fungua videoner.download",
    retry: "Jaribu tena",
    min: "dak",
    sec: "sek",
    errNetwork: "Imeshindwa kuunganisha na Videoner. Angalia muunganisho wako wa intaneti kisha ujaribu tena.",
    errRateLimit: "Maombi mengi mno mfululizo. Subiri kidogo kisha ujaribu tena.",
    errUnsupported:
      "Hakuna video kwenye ukurasa huu ambayo Videoner inaweza kupakua. Fungua ukurasa wa video au chapisho mahususi.",
    errYoutubeDaily: "Kikomo cha kila siku cha YouTube kwa mtandao wako kimeisha. Jaribu tena kesho.",
    errTooLarge: "Faili ni kubwa mno kwa ubora huu. Chagua ubora wa chini zaidi.",
    errLogin:
      "Chapisho hili linapatikana tu kwa watumiaji walioingia. Machapisho ya umma yanapakuliwa bila tatizo lolote.",
    errRegion: "Mwandishi amezuia chapisho hili kulingana na nchi, kwa hiyo haliwezi kupakuliwa.",
    errServerBlocked: "Jukwaa linazuia seva yetu kwa muda. Tafadhali jaribu tena baadaye.",
    errFailed: "Kupakua kumeshindwa. Jaribu tena au chagua ubora mwingine.",
    errGeneric: "Hitilafu imetokea. Tafadhali jaribu tena baada ya muda mfupi.",
    acctButton: (p) => `🔑 Unganisha akaunti yako ya ${p} na bot`,
    acctWarn: (p) =>
      `@VideonerBot itaweza kupakua kwa kutumia akaunti yako ya ${p} maudhui yanayoonekana tu kwa watumiaji walioingia: stories, machapisho ya faragha. Majukwaa hayapendi upakuaji wa kiotomatiki na yanaweza kuzuia akaunti — ni bora kuunganisha akaunti ya ziada. Kivinjari kitaomba ruhusa ya kusoma cookies za tovuti hii; cookies za ${p} pekee ndizo hutumwa kwa seva, zikiwa zimesimbwa.`,
    acctConfirm: "Unganisha",
    acctCancel: "Ghairi",
    acctSending: "Inaunganisha…",
    acctDenied: "Akaunti haiwezi kuunganishwa bila ruhusa ya cookies.",
    acctNoLogin: (p) => `Hujaingia kwenye ${p} katika kivinjari hiki. Ingia kwenye tovuti kisha ujaribu tena.`,
    acctFailed: "Imeshindikana. Jaribu tena baada ya muda mfupi.",
    acctCodeTitle: (p) => `Msimbo wa kuunganisha ${p}:`,
    acctCodeHelp:
      "Utume kwa @VideonerBot kwenye gumzo la faragha — kwa vipakuliwa vyako mwenyewe. Kwa kikundi, tuma /connect MSIMBO ndani ya kikundi hicho. Msimbo ni halali kwa dakika 10.",
    acctCopy: "Nakili",
    acctCopied: "Imenakiliwa",
    acctOpenBot: "Fungua bot",
    acctNewCode: "Pata msimbo mpya",
    acctList: "Miunganisho yangu kwenye bot",
    acctRevoke: "Ondoa ruhusa ya cookies",
    acctRevoked:
      "Ruhusa ya cookies imeondolewa — kiendelezi hakizisomi tena. Akaunti ulizokwisha kuunganisha zinabaki kwenye bot: ziondoe katika “Miunganisho yangu kwenye bot”.",
    playlistOffer: "📃 Pakua orodha nzima ya kucheza",
    playlistTitle: (title, n) => `📃 Orodha ya kucheza${title ? ` "${title}"` : ""}: video ${n}`,
    playlistHint: "Nitazipakua moja baada ya nyingine. Unaweza kufunga dirisha hili.",
    playlist720: "Orodha ya kucheza katika 720p",
    playlistBest: "Orodha ya kucheza katika ubora bora zaidi",
    playlistAudio: "Orodha ya kucheza — sauti pekee (mp3)",
    playlistProgress: (i, n) => `Video ${i} kati ya ${n}`,
    playlistStats: (done, failed) => `Zimepakuliwa: ${done}${failed ? ` · zimeshindwa: ${failed}` : ""}`,
    playlistStop: "⏹ Simamisha",
    playlistDone: (done, n) => `Orodha ya kucheza imepakuliwa: ${done} kati ya ${n}.`,
    playlistStopped: (done, n) => `Imesimamishwa. Zimepakuliwa ${done} kati ya ${n}.`,
    playlistLoading: "Inapata orodha ya video…",
    close: "Funga",
    updateAvailable: (v) => `Toleo ${v} limetoka.`,
    updateHow: "Jinsi ya kusasisha",
    langAuto: "Otomatiki",
    langLabel: "Lugha",
  },
  de: {
    loading: "Lade Video-Infos…",
    notVideoPage:
      "Öffne eine Videoseite auf YouTube, TikTok, Instagram, Facebook, X, Vimeo, VK, Rutube, OK.ru, Pinterest oder Threads und klick erneut auf das Symbol. GetCourse-Lektion: War die Seite schon vor der Installation der Erweiterung offen, lade sie neu.",
    gcLesson: "GetCourse-Lektion",
    gcPick: "Die Lektion hat mehrere Videos — wähl eins aus",
    gcVideo: (n) => `Video ${n}`,
    gcNote: "Dein Browser lädt und fügt es zusammen. Das Fenster darfst du schließen, den Browser nicht.",
    gcNoStream: "Video konnte nicht aus dem Player geholt werden. Lade die Lektion neu und versuch es noch mal.",
    video: "Video",
    photo: "Fotos in Originalgröße",
    slideshow: "Diashow (Video)",
    gallery: "Fotos + Diashow",
    audioOnly: "Nur Audio (mp3)",
    subtitles: "Untertitel (.srt)",
    subtitlesAuto: "automatisch",
    back: "Zurück",
    starting: "Starte den Download…",
    waiting: "Warte auf einen freien Platz auf dem Server…",
    downloading: "Lade herunter",
    converting: "Verarbeite",
    left: (eta) => `noch ${eta}`,
    saving: "Speichere in „Downloads“…",
    done: "Fertig — die Datei liegt in „Downloads“.",
    news: "📣 Projekt-News: @videonerdownload",
    again: "Noch eins laden",
    directDownload: "Video laden (mp4)",
    directPhoto: "Foto laden (jpg)",
    directNote: "Direkt aus dem Browser — ohne Server-Warteschlange",
    moreOptions: "Andere Qualitäten und Audio",
    fallback: "Im Browser hat's nicht geklappt — lade über den Server.",
    openSite: "videoner.download öffnen",
    retry: "Noch mal versuchen",
    min: "Min.",
    sec: "s",
    errNetwork: "Keine Verbindung zu Videoner. Prüf dein Internet und versuch es noch mal.",
    errRateLimit: "Zu viele Anfragen hintereinander. Warte eine Minute und versuch es noch mal.",
    errUnsupported:
      "Auf dieser Seite gibt es kein Video, das Videoner laden kann. Öffne die Seite eines bestimmten Videos oder Posts.",
    errYoutubeDaily: "Das tägliche YouTube-Limit für dein Netzwerk ist aufgebraucht. Versuch es morgen.",
    errTooLarge: "Die Datei ist in dieser Qualität zu groß. Wähl eine niedrigere.",
    errLogin:
      "Dieser Beitrag ist nur für angemeldete Nutzer sichtbar. Öffentliche Beiträge lassen sich problemlos laden.",
    errRegion: "Der Autor hat den Beitrag auf bestimmte Länder beschränkt — er lässt sich nicht laden.",
    errServerBlocked: "Die Plattform schränkt unseren Server gerade ein. Versuch es später noch mal.",
    errFailed: "Download fehlgeschlagen. Versuch es noch mal oder wähl eine andere Qualität.",
    errGeneric: "Etwas ist schiefgelaufen. Versuch es etwas später noch mal.",
    acctButton: (p) => `🔑 Dein ${p}-Konto mit dem Bot verbinden`,
    acctWarn: (p) =>
      `@VideonerBot kann dann über dein ${p}-Konto laden, was nur Angemeldete sehen: Storys, private Beiträge. Plattformen mögen keine automatischen Downloads und können das Konto einschränken — verbinde lieber ein Zweitkonto. Der Browser fragt nach der Erlaubnis für die Cookies dieser Seite; an den Server gehen nur die ${p}-Cookies, verschlüsselt.`,
    acctConfirm: "Verbinden",
    acctCancel: "Abbrechen",
    acctSending: "Verbinde…",
    acctDenied: "Ohne Cookie-Erlaubnis lässt sich das Konto nicht verbinden.",
    acctNoLogin: (p) => `Du bist in diesem Browser nicht bei ${p} angemeldet. Melde dich auf der Seite an und versuch es noch mal.`,
    acctFailed: "Hat nicht geklappt. Versuch es etwas später noch mal.",
    acctCodeTitle: (p) => `Code zum Verbinden von ${p}:`,
    acctCodeHelp:
      "Schick ihn @VideonerBot im Privatchat — für deine eigenen Downloads. Für eine Gruppe schick dort /connect CODE. Der Code gilt 10 Minuten.",
    acctCopy: "Kopieren",
    acctCopied: "Kopiert",
    acctOpenBot: "Bot öffnen",
    acctNewCode: "Neuen Code holen",
    acctList: "Meine Verbindungen im Bot",
    acctRevoke: "Cookie-Zugriff entziehen",
    acctRevoked:
      "Cookie-Zugriff entzogen — die Erweiterung liest sie nicht mehr. Schon verbundene Konten bleiben im Bot: trennen kannst du sie unter „Meine Verbindungen im Bot“.",
    playlistOffer: "📃 Ganze Playlist laden",
    playlistTitle: (title, n) => `📃 Playlist${title ? ` „${title}“` : ""}: ${n} Videos`,
    playlistHint: "Ich lade sie nacheinander. Das Fenster darfst du schließen.",
    playlist720: "Playlist in 720p",
    playlistBest: "Playlist in bester Qualität",
    playlistAudio: "Playlist — nur Audio (mp3)",
    playlistProgress: (i, n) => `Video ${i} von ${n}`,
    playlistStats: (done, failed) => `Geladen: ${done}${failed ? ` · fehlgeschlagen: ${failed}` : ""}`,
    playlistStop: "⏹ Stoppen",
    playlistDone: (done, n) => `Playlist geladen: ${done} von ${n}.`,
    playlistStopped: (done, n) => `Gestoppt. Geladen: ${done} von ${n}.`,
    playlistLoading: "Hole die Videoliste…",
    close: "Schließen",
    updateAvailable: (v) => `Version ${v} ist da.`,
    updateHow: "So aktualisierst du",
    langAuto: "Auto",
    langLabel: "Sprache",
  },
  fr: {
    loading: "Récupération des infos de la vidéo…",
    notVideoPage:
      "Ouvrez la page d’une vidéo sur YouTube, TikTok, Instagram, Facebook, X, Vimeo, VK, Rutube, OK.ru, Pinterest ou Threads et cliquez à nouveau sur l’icône. Leçon GetCourse : si la page était ouverte avant l’installation de l’extension, rechargez-la.",
    gcLesson: "Leçon GetCourse",
    gcPick: "Cette leçon contient plusieurs vidéos — choisissez-en une",
    gcVideo: (n) => `Vidéo ${n}`,
    gcNote: "Votre navigateur la télécharge et l’assemble. Vous pouvez fermer cette fenêtre, mais pas le navigateur.",
    gcNoStream: "Impossible de récupérer la vidéo depuis le lecteur. Rechargez la leçon et réessayez.",
    video: "Vidéo",
    photo: "Photos en taille originale",
    slideshow: "Diaporama (vidéo)",
    gallery: "Photos + diaporama",
    audioOnly: "Audio seul (mp3)",
    subtitles: "Sous-titres (.srt)",
    subtitlesAuto: "automatiques",
    back: "Retour",
    starting: "Lancement du téléchargement…",
    waiting: "En attente d’une place libre sur le serveur…",
    downloading: "Téléchargement",
    converting: "Traitement",
    left: (eta) => `encore ${eta}`,
    saving: "Enregistrement dans « Téléchargements »…",
    done: "Terminé — le fichier est dans « Téléchargements ».",
    news: "📣 Actus du projet : @videonerdownload",
    again: "En télécharger une autre",
    directDownload: "Télécharger la vidéo (mp4)",
    directPhoto: "Télécharger la photo (jpg)",
    directNote: "Directement depuis le navigateur — sans file d’attente",
    moreOptions: "Autres qualités et audio",
    fallback: "Échec dans le navigateur — téléchargement via le serveur.",
    openSite: "Ouvrir videoner.download",
    retry: "Réessayer",
    min: "min",
    sec: "s",
    errNetwork: "Impossible de joindre Videoner. Vérifiez votre connexion et réessayez.",
    errRateLimit: "Trop de requêtes d’affilée. Attendez une minute et réessayez.",
    errUnsupported:
      "Aucune vidéo téléchargeable par Videoner sur cette page. Ouvrez la page d’une vidéo ou d’une publication précise.",
    errYoutubeDaily: "La limite quotidienne YouTube de votre réseau est atteinte. Réessayez demain.",
    errTooLarge: "Le fichier est trop lourd dans cette qualité. Choisissez-en une plus basse.",
    errLogin:
      "Cette publication n’est visible que par les utilisateurs connectés. Les publications publiques se téléchargent sans problème.",
    errRegion: "L’auteur a limité cette publication à certains pays — impossible de la télécharger.",
    errServerBlocked: "La plateforme limite temporairement notre serveur. Réessayez plus tard.",
    errFailed: "Le téléchargement a échoué. Réessayez ou choisissez une autre qualité.",
    errGeneric: "Une erreur s’est produite. Réessayez un peu plus tard.",
    acctButton: (p) => `🔑 Connecter votre compte ${p} au bot`,
    acctWarn: (p) =>
      `@VideonerBot pourra télécharger via votre compte ${p} ce que seuls les utilisateurs connectés voient : stories, publications privées. Les plateformes n’aiment pas les téléchargements automatiques et peuvent restreindre le compte — connectez plutôt un compte secondaire. Le navigateur demandera l’autorisation de lire les cookies de ce site ; seuls les cookies ${p} sont envoyés au serveur, chiffrés.`,
    acctConfirm: "Connecter",
    acctCancel: "Annuler",
    acctSending: "Connexion…",
    acctDenied: "Impossible de connecter le compte sans l’autorisation d’accès aux cookies.",
    acctNoLogin: (p) => `Vous n’êtes pas connecté à ${p} dans ce navigateur. Connectez-vous sur le site et réessayez.`,
    acctFailed: "Cela n’a pas marché. Réessayez un peu plus tard.",
    acctCodeTitle: (p) => `Code pour connecter ${p} :`,
    acctCodeHelp:
      "Envoyez-le à @VideonerBot en message privé — pour vos propres téléchargements. Pour un groupe, envoyez /connect CODE dans le groupe. Le code est valable 10 minutes.",
    acctCopy: "Copier",
    acctCopied: "Copié",
    acctOpenBot: "Ouvrir le bot",
    acctNewCode: "Obtenir un nouveau code",
    acctList: "Mes connexions dans le bot",
    acctRevoke: "Retirer l’accès aux cookies",
    acctRevoked:
      "Accès aux cookies retiré — l’extension ne les lit plus. Les comptes déjà connectés restent dans le bot : déconnectez-les dans « Mes connexions dans le bot ».",
    playlistOffer: "📃 Télécharger toute la playlist",
    playlistTitle: (title, n) => `📃 Playlist${title ? ` « ${title} »` : ""} : ${n} vidéos`,
    playlistHint: "Je les télécharge une par une. Vous pouvez fermer cette fenêtre.",
    playlist720: "Playlist en 720p",
    playlistBest: "Playlist en meilleure qualité",
    playlistAudio: "Playlist — audio seul (mp3)",
    playlistProgress: (i, n) => `Vidéo ${i} sur ${n}`,
    playlistStats: (done, failed) => `Téléchargées : ${done}${failed ? ` · échecs : ${failed}` : ""}`,
    playlistStop: "⏹ Arrêter",
    playlistDone: (done, n) => `Playlist téléchargée : ${done} sur ${n}.`,
    playlistStopped: (done, n) => `Arrêté. Téléchargées : ${done} sur ${n}.`,
    playlistLoading: "Récupération de la liste des vidéos…",
    close: "Fermer",
    updateAvailable: (v) => `La version ${v} est disponible.`,
    updateHow: "Comment mettre à jour",
    langAuto: "Auto",
    langLabel: "Langue",
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
    playlistOffer: "📃 Download the whole playlist",
    playlistTitle: (title, n) => `📃 Playlist${title ? ` "${title}"` : ""}: ${n} videos`,
    playlistHint: "I'll download them one by one. You can close this window.",
    playlist720: "Playlist in 720p",
    playlistBest: "Playlist in best quality",
    playlistAudio: "Playlist — audio only (mp3)",
    playlistProgress: (i, n) => `Video ${i} of ${n}`,
    playlistStats: (done, failed) => `Downloaded: ${done}${failed ? ` · failed: ${failed}` : ""}`,
    playlistStop: "⏹ Stop",
    playlistDone: (done, n) => `Playlist downloaded: ${done} of ${n}.`,
    playlistStopped: (done, n) => `Stopped. Downloaded ${done} of ${n}.`,
    playlistLoading: "Getting the list of videos…",
    close: "Close",
    updateAvailable: (v) => `Version ${v} is out.`,
    updateHow: "How to update",
    langAuto: "Auto",
    langLabel: "Language",
  },
};

// Язык окошка: выбранный вручную (список вверху окошка, хранится в
// storage.local под LANG_KEY) или язык браузера — русский, украинский,
// казахский, арабский, китайский (zh-CN, zh-TW, zh-HK → zh, по базовому
// коду), хинди (hi, hi-IN → hi), индонезийский (id, id-ID и старый код in → id), суахили (sw, sw-KE, sw-TZ → sw), немецкий (de, de-DE, de-AT, de-CH → de), французский (fr, fr-FR, fr-CA, fr-BE, fr-CH → fr), остальным английский. Тот же выбор делают content.js и getcourse.js
// (им модули недоступны). lang и t — живые привязки:
// loadLang() меняет их до первой отрисовки окошка. Арабский пишется справа
// налево — окошко ставит dir="rtl" (popup.js, isRtl).
export const LANG_KEY = "uiLang";
export const LANG_NAMES = { ru: "Русский", uk: "Українська", kk: "Қазақша", ar: "العربية", zh: "中文", hi: "हिन्दी", id: "Bahasa Indonesia", sw: "Kiswahili", de: "Deutsch", fr: "Français", en: "English" };
export const browserLang = pickLang(chrome.i18n.getUILanguage());
export let lang = browserLang;
export let t = TEXTS[lang];

export const isRtl = () => lang === "ar";

// Страница сайта на текущем языке: английский — без префикса.
export const sitePath = (path) => (lang === "en" ? path : `/${lang}${path}`);

function pickLang(uiLanguage) {
  let base = uiLanguage.toLowerCase().split("-")[0];
  if (base === "in") base = "id"; // старый код индонезийского
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
  // Арабскому, китайскому, хинди, индонезийскому, суахили и немецкому — латинские GB/MB, как и цифры (ar-u-nu-latn);
  // французскому — свои Go/Mo.
  const latin = lang === "en" || lang === "ar" || lang === "zh" || lang === "hi" || lang === "id" || lang === "sw" || lang === "de";
  const [gbUnit, mbUnit] = lang === "fr" ? ["Go", "Mo"] : latin ? ["GB", "MB"] : ["ГБ", "МБ"];
  const locale = { ru: "ru-RU", uk: "uk-UA", kk: "kk-KZ", ar: "ar-u-nu-latn", zh: "zh-CN", hi: "hi-IN-u-nu-latn", id: "id-ID", sw: "sw-KE", de: "de-DE", fr: "fr-FR", en: "en-US" }[lang];
  if (gb >= 1) return `~${gb.toLocaleString(locale, { maximumFractionDigits: 1 })} ${gbUnit}`;
  return `~${Math.max(1, Math.round(bytes / 1024 ** 2))} ${mbUnit}`;
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
