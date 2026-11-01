import { Language } from "@/lib/i18n/translations";

// Тексты страницы videoner.download/extension. Отдельно от общего словаря:
// страница рисуется на сервере по локали из адреса, как юридические
// документы (lib/legal), а не через клиентский контекст языка.

export interface ExtensionPageText {
  metaTitle: string;
  title: string;
  summary: string;
  failedVideo: string;
  failedVideoHint: string;
  openVideo: string;
  version: string;
  browsersTitle: string;
  browsers: string;
  mobile: string;
  getcourseTitle: string;
  getcourse: string;
  privacyTitle: string;
  privacy: string;
  stepsTitle: string;
  steps: string[];
  // Firefox: своя установка — подписанный .xpi ставится кнопкой с сайта.
  browsersFirefox: string;
  firefoxSoon: string;
  chromeTitle: string;
  chromeHint: string;
  firefoxTitle: string;
  firefoxHint: string;
  yourBrowser: string;
  soon: string;
  firefoxStepsTitle: string;
  firefoxSteps: string[];
  // Обновление в Chrome: автообновления вне магазина Chrome нет, расширение
  // само сообщает о новой версии и ведёт сюда (#update).
  updateTitle: string;
  updateSteps: string[];
  back: string;
}

export const extensionPage: Record<Language, ExtensionPageText> = {
  ru: {
    metaTitle: "Расширение Videoner для браузера",
    title: "Videoner для браузера",
    summary:
      "Расширение добавляет кнопку «Скачать» на страницы видео и качает прямо в браузере. Instagram, Facebook, TikTok и Threads оно скачивает под вашим входом на площадке — так скачиваются и закрытые записи, которые вы видите в своём аккаунте, и ролики, которые площадка не отдала нашему серверу.",
    failedVideo: "Видео, которое не удалось скачать на сайте или в боте:",
    failedVideoHint:
      "Установите расширение, войдите на площадку в этом же браузере, откройте видео и нажмите «Скачать» в правом нижнем углу.",
    openVideo: "Открыть видео",
    version: "Версия",
    browsersTitle: "Где работает",
    browsers:
      "Google Chrome, Яндекс Браузер, Microsoft Edge, Opera, Brave, Vivaldi и другие браузеры на основе Chromium — на компьютере.",
    mobile: "На телефонах и планшетах расширения не поддерживаются — там скачивайте через сайт или Telegram-бот.",
    getcourseTitle: "Уроки GetCourse",
    getcourse:
      "Откройте урок в школе на GetCourse под своим входом: в правом верхнем углу плеера появится кнопка «Скачать», а значок Videoner покажет все видео урока. Браузер сам скачивает урок и собирает его в mp4 — файл не проходит через наш сервер. Если в браузере не получилось, урок в том же качестве скачает наш сервер: тогда ему уходит ссылка на видео из плеера.",
    privacyTitle: "Ваш вход остаётся у вас",
    privacy:
      "Расширение не спрашивает пароль: запрос к площадке делает ваш собственный браузер, а нашему серверу уходит только короткий отчёт для статистики — ссылка, размер файла и название. Куки уходят на сервер только если вы сами нажмёте «Подключить аккаунт к боту» — и только куки этой площадки, зашифрованно.",
    stepsTitle: "Как установить в Chrome, Яндекс Браузер, Edge и Opera",
    steps: [
      "Скачайте архив и распакуйте его — появится папка videoner-extension с номером версии в названии.",
      "Откройте страницу расширений: в адресной строке наберите chrome://extensions (в Edge — edge://extensions, в Opera — opera://extensions).",
      "Включите «Режим разработчика» — переключатель вверху страницы.",
      "Нажмите «Загрузить распакованное расширение» и выберите эту папку — ту, в которой лежит файл manifest.json.",
      "Готово: на странице видео появится кнопка «Скачать», а значок Videoner — на панели браузера.",
    ],
    browsersFirefox: "Mozilla Firefox 128 и новее — тоже на компьютере.",
    firefoxSoon:
      "Версия для Firefox скоро появится. Пока расширение работает в Chrome, Яндекс Браузере, Edge, Opera и других браузерах на основе Chromium.",
    chromeTitle: "Chrome, Яндекс Браузер, Edge, Opera",
    chromeHint: "Архив .zip — установка за пару минут",
    firefoxTitle: "Firefox",
    firefoxHint: "Установка в один клик",
    yourBrowser: "Ваш браузер",
    soon: "Скоро",
    firefoxStepsTitle: "Как установить в Firefox",
    firefoxSteps: [
      "Нажмите кнопку Firefox вверху этой страницы.",
      "Firefox спросит, разрешить ли сайту videoner.download установить дополнение, — нажмите «Продолжить установку».",
      "В окошке «Добавить Videoner?» нажмите «Добавить».",
      "Готово: на странице видео появится кнопка «Скачать», а значок Videoner — на панели браузера. Обновления Firefox будет ставить сам.",
    ],
    updateTitle: "Как обновить в Chrome, Яндекс Браузере, Edge и Opera",
    updateSteps: [
      "Когда выходит новая версия, на значке Videoner появляется отметка NEW, а в окошке — ссылка сюда.",
      "Скачайте архив кнопкой Chrome вверху этой страницы и распакуйте его в ту же папку, куда распаковывали раньше, с заменой файлов.",
      "Откройте страницу расширений (chrome://extensions, browser://extensions в Яндекс Браузере, edge://extensions) и нажмите «Обновить» — круговую стрелку на карточке Videoner.",
    ],
    back: "На главную",
  },
  en: {
    metaTitle: "Videoner browser extension",
    title: "Videoner for your browser",
    summary:
      "The extension adds a Download button to video pages and downloads right in your browser. Instagram, Facebook, TikTok and Threads are downloaded with your own sign-in — so private posts you can see in your account work too, as do videos the platform didn't give to our server.",
    failedVideo: "The video that couldn't be downloaded on the site or in the bot:",
    failedVideoHint:
      "Install the extension, sign in to the platform in this browser, open the video and click Download in the bottom-right corner.",
    openVideo: "Open the video",
    version: "Version",
    browsersTitle: "Where it works",
    browsers:
      "Google Chrome, Yandex Browser, Microsoft Edge, Opera, Brave, Vivaldi and other Chromium-based browsers — on a computer.",
    mobile: "Phones and tablets don't support extensions — use the website or the Telegram bot there.",
    getcourseTitle: "GetCourse lessons",
    getcourse:
      "Open a lesson in a GetCourse school while signed in: a Download button appears in the top-right corner of the player, and the Videoner icon lists every video in the lesson. Your browser downloads the lesson and assembles it into an mp4 itself — the file doesn’t pass through our server. If that fails, our server downloads the lesson in the same quality instead; in that case it receives the video link from the player.",
    privacyTitle: "Your sign-in stays with you",
    privacy:
      "The extension never asks for a password: your own browser makes the request to the platform, and our server only gets a short report for statistics — the link, file size and title. Cookies go to the server only if you press \"Connect account to the bot\" yourself — and only that platform's cookies, encrypted.",
    stepsTitle: "How to install in Chrome, Yandex Browser, Edge and Opera",
    steps: [
      "Download the archive and unzip it — you'll get a videoner-extension folder with the version number in its name.",
      "Open the extensions page: type chrome://extensions in the address bar (edge://extensions in Edge, opera://extensions in Opera).",
      "Turn on Developer mode — the switch at the top of the page.",
      "Click “Load unpacked” and choose that folder — the one that contains manifest.json.",
      "Done: video pages get a Download button, and the Videoner icon appears in the browser toolbar.",
    ],
    browsersFirefox: "Mozilla Firefox 128 or later — also on a computer.",
    firefoxSoon:
      "The Firefox version is coming soon. For now the extension works in Chrome, Yandex Browser, Edge, Opera and other Chromium-based browsers.",
    chromeTitle: "Chrome, Yandex Browser, Edge, Opera",
    chromeHint: "A .zip archive — installs in a couple of minutes",
    firefoxTitle: "Firefox",
    firefoxHint: "One-click install",
    yourBrowser: "Your browser",
    soon: "Coming soon",
    firefoxStepsTitle: "How to install in Firefox",
    firefoxSteps: [
      "Click the Firefox button at the top of this page.",
      "Firefox asks whether to let videoner.download install an add-on — click “Continue to Installation”.",
      "In the “Add Videoner?” prompt, click “Add”.",
      "Done: video pages get a Download button, and the Videoner icon appears in the toolbar. Firefox installs updates by itself.",
    ],
    updateTitle: "How to update in Chrome, Yandex Browser, Edge and Opera",
    updateSteps: [
      "When a new version is out, the Videoner icon shows a NEW badge and the popup links here.",
      "Download the archive with the Chrome button at the top of this page and unpack it into the same folder as before, replacing the files.",
      "Open the extensions page (chrome://extensions, browser://extensions in Yandex Browser, edge://extensions) and press Reload — the circular arrow on the Videoner card.",
    ],
    back: "Home",
  },
  es: {
    metaTitle: "Extensión de Videoner para el navegador",
    title: "Videoner para tu navegador",
    summary:
      "La extensión añade un botón Descargar a las páginas de video y descarga directamente en tu navegador. Instagram, Facebook, TikTok y Threads se descargan con tu propia sesión: así funcionan también las publicaciones privadas que ves en tu cuenta y los videos que la plataforma no entregó a nuestro servidor.",
    failedVideo: "El video que no se pudo descargar en el sitio o en el bot:",
    failedVideoHint:
      "Instala la extensión, inicia sesión en la plataforma en este navegador, abre el video y pulsa Descargar en la esquina inferior derecha.",
    openVideo: "Abrir el video",
    version: "Versión",
    browsersTitle: "Dónde funciona",
    browsers:
      "Google Chrome, Yandex Browser, Microsoft Edge, Opera, Brave, Vivaldi y otros navegadores basados en Chromium, en un ordenador.",
    mobile: "Los teléfonos y tabletas no admiten extensiones: allí usa el sitio web o el bot de Telegram.",
    getcourseTitle: "Lecciones de GetCourse",
    getcourse:
      "Abre una lección de una escuela en GetCourse con tu sesión iniciada: aparecerá un botón Descargar en la esquina superior derecha del reproductor, y el icono de Videoner mostrará todos los videos de la lección. Tu navegador descarga la lección y la convierte en mp4 por sí mismo: el archivo no pasa por nuestro servidor. Si no lo consigue, nuestro servidor descarga la lección en la misma calidad; en ese caso recibe el enlace del video del reproductor.",
    privacyTitle: "Tu sesión se queda contigo",
    privacy:
      "La extensión nunca pide contraseñas: la solicitud a la plataforma la hace tu propio navegador, y nuestro servidor solo recibe un breve informe para estadísticas: el enlace, el tamaño del archivo y el título. Las cookies llegan al servidor solo si pulsas tú mismo «Conectar cuenta al bot», y solo las de esa plataforma, cifradas.",
    stepsTitle: "Cómo instalarla en Chrome, Yandex Browser, Edge y Opera",
    steps: [
      "Descarga el archivo y descomprímelo: obtendrás una carpeta videoner-extension con el número de versión en el nombre.",
      "Abre la página de extensiones: escribe chrome://extensions en la barra de direcciones (edge://extensions en Edge, opera://extensions en Opera).",
      "Activa el Modo de desarrollador con el interruptor de la parte superior.",
      "Pulsa «Cargar descomprimida» y elige esa carpeta: la que contiene el archivo manifest.json.",
      "Listo: las páginas de video tendrán un botón Descargar y el icono de Videoner aparecerá en la barra del navegador.",
    ],
    browsersFirefox: "Mozilla Firefox 128 o posterior, también en un ordenador.",
    firefoxSoon:
      "La versión para Firefox llegará pronto. Por ahora la extensión funciona en Chrome, Yandex Browser, Edge, Opera y otros navegadores basados en Chromium.",
    chromeTitle: "Chrome, Yandex Browser, Edge, Opera",
    chromeHint: "Archivo .zip: se instala en un par de minutos",
    firefoxTitle: "Firefox",
    firefoxHint: "Instalación en un clic",
    yourBrowser: "Tu navegador",
    soon: "Próximamente",
    firefoxStepsTitle: "Cómo instalarla en Firefox",
    firefoxSteps: [
      "Pulsa el botón de Firefox en la parte superior de esta página.",
      "Firefox preguntará si permites que videoner.download instale un complemento: pulsa «Continuar con la instalación».",
      "En la ventana «¿Añadir Videoner?», pulsa «Añadir».",
      "Listo: las páginas de video tendrán un botón Descargar y el icono de Videoner aparecerá en la barra. Firefox instalará las actualizaciones por sí mismo.",
    ],
    updateTitle: "Cómo actualizar en Chrome, Yandex Browser, Edge y Opera",
    updateSteps: [
      "Cuando sale una versión nueva, el icono de Videoner muestra la marca NEW y la ventana enlaza aquí.",
      "Descarga el archivo con el botón de Chrome arriba en esta página y descomprímelo en la misma carpeta que antes, reemplazando los archivos.",
      "Abre la página de extensiones (chrome://extensions, browser://extensions en Yandex Browser, edge://extensions) y pulsa Recargar, la flecha circular de la tarjeta de Videoner.",
    ],
    back: "Inicio",
  },
  uk: {
    metaTitle: "Розширення Videoner для браузера",
    title: "Videoner для браузера",
    summary:
      "Розширення додає кнопку «Завантажити» на сторінки відео й завантажує просто в браузері. Instagram, Facebook, TikTok і Threads воно завантажує під вашим входом на платформі — так завантажуються і закриті дописи, які ви бачите у своєму акаунті, і ролики, які платформа не віддала нашому серверу.",
    failedVideo: "Відео, яке не вдалося завантажити на сайті або в боті:",
    failedVideoHint:
      "Встановіть розширення, увійдіть на платформу в цьому ж браузері, відкрийте відео й натисніть «Завантажити» в правому нижньому куті.",
    openVideo: "Відкрити відео",
    version: "Версія",
    browsersTitle: "Де працює",
    browsers:
      "Google Chrome, Яндекс Браузер, Microsoft Edge, Opera, Brave, Vivaldi та інші браузери на основі Chromium — на комп'ютері.",
    mobile: "На телефонах і планшетах розширення не підтримуються — там завантажуйте через сайт або Telegram-бот.",
    getcourseTitle: "Уроки GetCourse",
    getcourse:
      "Відкрийте урок у школі на GetCourse під своїм входом: у правому верхньому куті плеєра з'явиться кнопка «Завантажити», а значок Videoner покаже всі відео уроку. Браузер сам завантажує урок і збирає його в mp4 — файл не проходить через наш сервер. Якщо в браузері не вийшло, урок у тій самій якості завантажить наш сервер: тоді йому надсилається посилання на відео з плеєра.",
    privacyTitle: "Ваш вхід залишається у вас",
    privacy:
      "Розширення не запитує пароль: запит до платформи робить ваш власний браузер, а нашому серверу надсилається лише короткий звіт для статистики — посилання, розмір файлу й назва. Куки надсилаються на сервер, лише якщо ви самі натиснете «Підключити акаунт до бота», — і лише куки цієї платформи, у зашифрованому вигляді.",
    stepsTitle: "Як встановити в Chrome, Яндекс Браузер, Edge і Opera",
    steps: [
      "Завантажте архів і розпакуйте його — з'явиться папка videoner-extension з номером версії в назві.",
      "Відкрийте сторінку розширень: в адресному рядку введіть chrome://extensions (в Edge — edge://extensions, в Opera — opera://extensions).",
      "Увімкніть «Режим розробника» — перемикач угорі сторінки.",
      "Натисніть «Завантажити розпаковане розширення» й виберіть цю папку — ту, в якій лежить файл manifest.json.",
      "Готово: на сторінці відео з'явиться кнопка «Завантажити», а значок Videoner — на панелі браузера.",
    ],
    browsersFirefox: "Mozilla Firefox 128 і новіші — теж на комп'ютері.",
    firefoxSoon:
      "Версія для Firefox незабаром з'явиться. Поки що розширення працює в Chrome, Яндекс Браузері, Edge, Opera та інших браузерах на основі Chromium.",
    chromeTitle: "Chrome, Яндекс Браузер, Edge, Opera",
    chromeHint: "Архів .zip — встановлення за кілька хвилин",
    firefoxTitle: "Firefox",
    firefoxHint: "Встановлення в один клік",
    yourBrowser: "Ваш браузер",
    soon: "Незабаром",
    firefoxStepsTitle: "Як встановити у Firefox",
    firefoxSteps: [
      "Натисніть кнопку Firefox угорі цієї сторінки.",
      "Firefox запитає, чи дозволити сайту videoner.download встановити доповнення, — натисніть «Продовжити встановлення».",
      "У віконці «Додати Videoner?» натисніть «Додати».",
      "Готово: на сторінці відео з'явиться кнопка «Завантажити», а значок Videoner — на панелі браузера. Оновлення Firefox встановлюватиме сам.",
    ],
    updateTitle: "Як оновити в Chrome, Яндекс Браузері, Edge і Opera",
    updateSteps: [
      "Коли виходить нова версія, на значку Videoner з'являється позначка NEW, а у віконці — посилання сюди.",
      "Завантажте архів кнопкою Chrome угорі цієї сторінки й розпакуйте його в ту саму папку, куди розпаковували раніше, із заміною файлів.",
      "Відкрийте сторінку розширень (chrome://extensions, browser://extensions у Яндекс Браузері, edge://extensions) і натисніть «Оновити» — кругову стрілку на картці Videoner.",
    ],
    back: "На головну",
  },
  kk: {
    metaTitle: "Браузерге арналған Videoner кеңейтімі",
    title: "Браузерге арналған Videoner",
    summary:
      "Кеңейтім бейне беттеріне «Жүктеп алу» батырмасын қосады және тікелей браузерде жүктеп алады. Instagram, Facebook, TikTok және Threads-тен ол платформаға сіздің кіруіңізбен жүктеп алады — осылайша өз аккаунтыңызда көретін жабық жазбалар да, платформа біздің серверге бермеген роликтер де жүктеп алынады.",
    failedVideo: "Сайтта немесе ботта жүктеп алу мүмкін болмаған бейне:",
    failedVideoHint:
      "Кеңейтімді орнатыңыз, дәл осы браузерде платформаға кіріңіз, бейнені ашып, төменгі оң жақ бұрыштағы «Жүктеп алу» батырмасын басыңыз.",
    openVideo: "Бейнені ашу",
    version: "Нұсқа",
    browsersTitle: "Қай жерде жұмыс істейді",
    browsers:
      "Google Chrome, Яндекс Браузер, Microsoft Edge, Opera, Brave, Vivaldi және Chromium негізіндегі басқа браузерлер — компьютерде.",
    mobile: "Телефондар мен планшеттерде кеңейтімдерге қолдау көрсетілмейді — онда сайт немесе Telegram-бот арқылы жүктеп алыңыз.",
    getcourseTitle: "GetCourse сабақтары",
    getcourse:
      "GetCourse-тағы мектептің сабағын өз кіруіңізбен ашыңыз: ойнатқыштың жоғарғы оң жақ бұрышында «Жүктеп алу» батырмасы пайда болады, ал Videoner белгішесі сабақтың барлық бейнесін көрсетеді. Браузер сабақты өзі жүктеп алып, оны mp4 етіп жинайды — файл біздің сервер арқылы өтпейді. Егер браузерде шықпаса, сабақты дәл сондай сапада біздің сервер жүктеп алады: бұл жағдайда оған ойнатқыштағы бейненің сілтемесі жіберіледі.",
    privacyTitle: "Кіру деректеріңіз өзіңізде қалады",
    privacy:
      "Кеңейтім құпиясөз сұрамайды: платформаға сұрауды сіздің өз браузеріңіз жасайды, ал біздің серверге статистика үшін қысқа есеп қана жіберіледі — сілтеме, файл өлшемі және атауы. Cookie файлдары серверге сіз өзіңіз «Аккаунтты ботқа қосу» батырмасын басқанда ғана жіберіледі — тек сол платформаның cookie файлдары және шифрланған түрде.",
    stepsTitle: "Chrome, Яндекс Браузер, Edge және Opera-ға қалай орнатуға болады",
    steps: [
      "Мұрағатты жүктеп алып, мұрағаттан шығарыңыз — атауында нұсқа нөмірі бар videoner-extension қалтасы пайда болады.",
      "Кеңейтімдер бетін ашыңыз: мекенжай жолына chrome://extensions деп теріңіз (Edge-те — edge://extensions, Opera-да — opera://extensions).",
      "«Әзірлеуші режимі» ауыстырғышын қосыңыз — ол беттің жоғарғы жағында (орысша интерфейсте — «Режим разработчика»).",
      "Буып-түйілмеген кеңейтімді жүктеу батырмасын басыңыз (орысша интерфейсте — «Загрузить распакованное расширение») және сол қалтаны таңдаңыз — ішінде manifest.json файлы жатқан қалтаны.",
      "Дайын: бейне бетінде «Жүктеп алу» батырмасы, ал браузер панелінде Videoner белгішесі пайда болады.",
    ],
    browsersFirefox: "Mozilla Firefox 128 және одан жаңа нұсқалары — бұл да компьютерде.",
    firefoxSoon:
      "Firefox-қа арналған нұсқа жақында шығады. Әзірге кеңейтім Chrome, Яндекс Браузер, Edge, Opera және Chromium негізіндегі басқа браузерлерде жұмыс істейді.",
    chromeTitle: "Chrome, Яндекс Браузер, Edge, Opera",
    chromeHint: ".zip мұрағаты — бірнеше минутта орнатылады",
    firefoxTitle: "Firefox",
    firefoxHint: "Бір басумен орнату",
    yourBrowser: "Сіздің браузеріңіз",
    soon: "Жақында",
    firefoxStepsTitle: "Firefox-қа қалай орнатуға болады",
    firefoxSteps: [
      "Осы беттің жоғарғы жағындағы Firefox батырмасын басыңыз.",
      "Firefox videoner.download сайтына қосымшаны орнатуға рұқсат беру-бермеуді сұрайды — орнатуды жалғастыру батырмасын басыңыз (орысша интерфейсте — «Продолжить установку»).",
      "Videoner-ді қосу туралы терезеде (орысша интерфейсте — «Добавить Videoner?») қосу батырмасын басыңыз (орысша — «Добавить»).",
      "Дайын: бейне бетінде «Жүктеп алу» батырмасы, ал браузер панелінде Videoner белгішесі пайда болады. Жаңартуларды Firefox өзі орнатады.",
    ],
    updateTitle: "Chrome, Яндекс Браузер, Edge және Opera-да қалай жаңартуға болады",
    updateSteps: [
      "Жаңа нұсқа шыққанда Videoner белгішесінде NEW белгісі, ал терезеде осы бетке сілтеме пайда болады.",
      "Осы беттің жоғарғы жағындағы Chrome батырмасымен мұрағатты жүктеп алып, оны бұрын шығарған қалтаңызға файлдарды ауыстыра отырып мұрағаттан шығарыңыз.",
      "Кеңейтімдер бетін ашыңыз (chrome://extensions, Яндекс Браузерде browser://extensions, edge://extensions) және Videoner карточкасындағы дөңгелек көрсеткіні — «Жаңарту» батырмасын басыңыз (орысша интерфейсте — «Обновить»).",
    ],
    back: "Басты бетке",
  },
  ar: {
    metaTitle: "إضافة Videoner للمتصفح",
    title: "Videoner في متصفحك",
    summary:
      "تضيف الإضافة زر «تحميل» إلى صفحات الفيديو وتحمّل مباشرة في متصفحك. تُحمَّل مقاطع Instagram وFacebook وTikTok وThreads باستخدام تسجيل دخولك أنت — لذا تعمل أيضًا المنشورات الخاصة التي تراها في حسابك، وكذلك المقاطع التي لم تمنحها المنصة لخادمنا.",
    failedVideo: "الفيديو الذي تعذّر تحميله على الموقع أو في البوت:",
    failedVideoHint:
      "ثبّت الإضافة، وسجّل الدخول إلى المنصة في هذا المتصفح نفسه، ثم افتح الفيديو واضغط «تحميل» في الزاوية السفلية اليمنى.",
    openVideo: "افتح الفيديو",
    version: "الإصدار",
    browsersTitle: "أين تعمل",
    browsers:
      "Google Chrome وYandex Browser وMicrosoft Edge وOpera وBrave وVivaldi وغيرها من المتصفحات المبنية على Chromium — على الكمبيوتر.",
    mobile: "لا تدعم الهواتف والأجهزة اللوحية الإضافات — استخدم عليها الموقع أو بوت Telegram.",
    getcourseTitle: "دروس GetCourse",
    getcourse:
      "افتح درسًا في مدرسة على GetCourse وأنت مسجّل الدخول: سيظهر زر «تحميل» في الزاوية العلوية اليمنى من المشغّل، وتعرض أيقونة Videoner كل مقاطع الفيديو في الدرس. يحمّل متصفحك الدرس ويجمّعه في ملف mp4 بنفسه — لا يمر الملف عبر خادمنا. وإذا فشل ذلك، يحمّل خادمنا الدرس بالجودة نفسها بدلًا منه؛ وفي هذه الحالة يتلقى رابط الفيديو من المشغّل.",
    privacyTitle: "تسجيل دخولك يبقى معك",
    privacy:
      "لا تطلب الإضافة كلمة مرور أبدًا: متصفحك نفسه هو من يرسل الطلب إلى المنصة، ولا يتلقى خادمنا سوى تقرير قصير للإحصاءات — الرابط وحجم الملف والعنوان. لا تُرسَل ملفات تعريف الارتباط (cookies) إلى الخادم إلا إذا ضغطت بنفسك «ربط الحساب بالبوت» — وتُرسَل ملفات تلك المنصة فقط، مشفّرة.",
    stepsTitle: "كيفية التثبيت في Chrome وYandex Browser وEdge وOpera",
    steps: [
      "حمّل الأرشيف وفك ضغطه — سيظهر مجلد videoner-extension يحمل رقم الإصدار في اسمه.",
      "افتح صفحة الإضافات: اكتب chrome://extensions في شريط العنوان (edge://extensions في Edge، وopera://extensions في Opera).",
      "فعّل «وضع مطوّر البرامج» — المفتاح في أعلى الصفحة.",
      "اضغط «تحميل إضافة غير مُجمّعة» واختر ذلك المجلد — المجلد الذي يحتوي على ملف manifest.json.",
      "تم: سيظهر زر «تحميل» في صفحات الفيديو، وأيقونة Videoner في شريط أدوات المتصفح.",
    ],
    browsersFirefox: "Mozilla Firefox 128 أو أحدث — على الكمبيوتر أيضًا.",
    firefoxSoon:
      "نسخة Firefox قادمة قريبًا. حاليًا تعمل الإضافة في Chrome وYandex Browser وEdge وOpera وغيرها من المتصفحات المبنية على Chromium.",
    chromeTitle: "Chrome وYandex Browser وEdge وOpera",
    chromeHint: "أرشيف zip — يُثبَّت في دقيقتين",
    firefoxTitle: "Firefox",
    firefoxHint: "تثبيت بنقرة واحدة",
    yourBrowser: "متصفحك",
    soon: "قريبًا",
    firefoxStepsTitle: "كيفية التثبيت في Firefox",
    firefoxSteps: [
      "اضغط زر Firefox في أعلى هذه الصفحة.",
      "سيسألك Firefox هل تسمح لموقع videoner.download بتثبيت إضافة — اضغط «متابعة التثبيت».",
      "في نافذة «إضافة Videoner؟» اضغط «أضِف».",
      "تم: سيظهر زر «تحميل» في صفحات الفيديو، وأيقونة Videoner في شريط الأدوات. يثبّت Firefox التحديثات بنفسه.",
    ],
    updateTitle: "كيفية التحديث في Chrome وYandex Browser وEdge وOpera",
    updateSteps: [
      "عند صدور إصدار جديد تظهر على أيقونة Videoner شارة NEW، وفي النافذة المنبثقة رابط إلى هذه الصفحة.",
      "حمّل الأرشيف بزر Chrome في أعلى هذه الصفحة وفك ضغطه في المجلد نفسه الذي استخدمته من قبل، مع استبدال الملفات.",
      "افتح صفحة الإضافات (chrome://extensions، أو browser://extensions في Yandex Browser، أو edge://extensions) واضغط «إعادة التحميل» — السهم الدائري على بطاقة Videoner.",
    ],
    back: "الرئيسية",
  },
  zh: {
    metaTitle: "Videoner 浏览器扩展",
    title: "Videoner 浏览器版",
    summary:
      "扩展会在视频页面上添加“下载”按钮，直接在浏览器中下载。Instagram、Facebook、TikTok 和 Threads 的视频会使用你自己的登录状态下载，因此你在自己账号里能看到的私密帖子也能下载，平台没有提供给我们服务器的视频同样可以下载。",
    failedVideo: "在网站或机器人中未能下载的视频：",
    failedVideoHint:
      "安装扩展，在同一个浏览器中登录该平台，打开视频，然后点击右下角的“下载”。",
    openVideo: "打开视频",
    version: "版本",
    browsersTitle: "支持的浏览器",
    browsers:
      "Google Chrome、Yandex Browser、Microsoft Edge、Opera、Brave、Vivaldi 以及其他基于 Chromium 的浏览器（电脑端）。",
    mobile: "手机和平板不支持扩展，请在这些设备上使用网站或 Telegram 机器人下载。",
    getcourseTitle: "GetCourse 课程",
    getcourse:
      "登录后在 GetCourse 学校中打开一节课：播放器右上角会出现“下载”按钮，点击 Videoner 图标可以看到这节课的所有视频。浏览器会自行下载课程并合成为 mp4 文件，文件不经过我们的服务器。如果在浏览器中下载失败，则改由我们的服务器以相同画质下载这节课，此时服务器会收到播放器中的视频链接。",
    privacyTitle: "你的登录信息只留在你这里",
    privacy:
      "扩展从不索要密码：向平台发出请求的是你自己的浏览器，我们的服务器只会收到一份用于统计的简短报告，包括链接、文件大小和标题。只有当你自己点击“将账号连接到机器人”时，Cookie 才会发送到服务器，而且只发送该平台的 Cookie，并经过加密。",
    stepsTitle: "如何在 Chrome、Yandex Browser、Edge 和 Opera 中安装",
    steps: [
      "下载压缩包并解压，会出现一个名称中带有版本号的 videoner-extension 文件夹。",
      "打开扩展程序页面：在地址栏输入 chrome://extensions（Edge 中为 edge://extensions，Opera 中为 opera://extensions）。",
      "打开页面顶部的“开发者模式”开关。",
      "点击“加载已解压的扩展程序”，选择该文件夹，即包含 manifest.json 文件的那个文件夹。",
      "完成：视频页面上会出现“下载”按钮，浏览器工具栏上会出现 Videoner 图标。",
    ],
    browsersFirefox: "Mozilla Firefox 128 及以上版本（同样是电脑端）。",
    firefoxSoon:
      "Firefox 版即将推出。目前扩展可在 Chrome、Yandex Browser、Edge、Opera 及其他基于 Chromium 的浏览器中使用。",
    chromeTitle: "Chrome、Yandex Browser、Edge、Opera",
    chromeHint: ".zip 压缩包，几分钟即可装好",
    firefoxTitle: "Firefox",
    firefoxHint: "一键安装",
    yourBrowser: "你的浏览器",
    soon: "即将推出",
    firefoxStepsTitle: "如何在 Firefox 中安装",
    firefoxSteps: [
      "点击本页顶部的 Firefox 按钮。",
      "Firefox 会询问是否允许 videoner.download 安装附加组件，点击“继续安装”。",
      "在“添加 Videoner？”提示中点击“添加”。",
      "完成：视频页面上会出现“下载”按钮，工具栏上会出现 Videoner 图标。Firefox 会自动安装更新。",
    ],
    updateTitle: "如何在 Chrome、Yandex Browser、Edge 和 Opera 中更新",
    updateSteps: [
      "有新版本发布时，Videoner 图标上会显示 NEW 标记，弹出窗口中会有指向本页的链接。",
      "用本页顶部的 Chrome 按钮下载压缩包，解压到之前解压的同一个文件夹中，并替换原有文件。",
      "打开扩展程序页面（chrome://extensions，Yandex Browser 中为 browser://extensions，edge://extensions），然后点击“重新加载”，即 Videoner 卡片上的圆形箭头。",
    ],
    back: "返回首页",
  },  hi: {
    metaTitle: "Videoner ब्राउज़र एक्सटेंशन",
    title: "आपके ब्राउज़र के लिए Videoner",
    summary:
      "एक्सटेंशन वीडियो पेजों पर “डाउनलोड” बटन जोड़ता है और सीधे आपके ब्राउज़र में डाउनलोड करता है। Instagram, Facebook, TikTok और Threads से वीडियो आपके अपने लॉगिन से डाउनलोड होते हैं — इसलिए आपके अकाउंट में दिखने वाली प्राइवेट पोस्ट भी डाउनलोड हो जाती हैं, और वे वीडियो भी जो प्लेटफ़ॉर्म ने हमारे सर्वर को नहीं दिए।",
    failedVideo: "वह वीडियो जो वेबसाइट या बॉट में डाउनलोड नहीं हो सका:",
    failedVideoHint:
      "एक्सटेंशन इंस्टॉल करें, इसी ब्राउज़र में प्लेटफ़ॉर्म पर लॉग इन करें, वीडियो खोलें और नीचे दाएँ कोने में “डाउनलोड” पर क्लिक करें।",
    openVideo: "वीडियो खोलें",
    version: "वर्शन",
    browsersTitle: "कहाँ काम करता है",
    browsers:
      "Google Chrome, Yandex Browser, Microsoft Edge, Opera, Brave, Vivaldi और Chromium पर आधारित दूसरे ब्राउज़र — कंप्यूटर पर।",
    mobile: "फ़ोन और टैबलेट पर एक्सटेंशन काम नहीं करते — वहाँ वेबसाइट या Telegram बॉट से डाउनलोड करें।",
    getcourseTitle: "GetCourse के लेसन",
    getcourse:
      "GetCourse पर किसी स्कूल का लेसन अपने लॉगिन से खोलें: प्लेयर के ऊपर दाएँ कोने में “डाउनलोड” बटन दिखेगा, और Videoner आइकन लेसन के सभी वीडियो की सूची दिखाएगा। आपका ब्राउज़र खुद लेसन डाउनलोड करके उसे mp4 में जोड़ता है — फ़ाइल हमारे सर्वर से होकर नहीं जाती। अगर ब्राउज़र में यह नहीं हो पाया, तो हमारा सर्वर उसी क्वालिटी में लेसन डाउनलोड कर देगा; ऐसे में उसे प्लेयर से वीडियो का लिंक भेजा जाता है।",
    privacyTitle: "आपका लॉगिन आपके पास ही रहता है",
    privacy:
      "एक्सटेंशन कभी पासवर्ड नहीं माँगता: प्लेटफ़ॉर्म को रिक्वेस्ट आपका अपना ब्राउज़र भेजता है, और हमारे सर्वर को आँकड़ों के लिए सिर्फ़ एक छोटी रिपोर्ट मिलती है — लिंक, फ़ाइल का साइज़ और टाइटल। कुकीज़ सर्वर पर तभी जाती हैं जब आप खुद “अकाउंट को बॉट से जोड़ें” दबाते हैं — और सिर्फ़ उसी प्लेटफ़ॉर्म की कुकीज़, एन्क्रिप्टेड रूप में।",
    stepsTitle: "Chrome, Yandex Browser, Edge और Opera में कैसे इंस्टॉल करें",
    steps: [
      "आर्काइव डाउनलोड करें और उसे अनज़िप करें — videoner-extension नाम का एक फ़ोल्डर बनेगा, जिसके नाम में वर्शन नंबर होगा।",
      "एक्सटेंशन पेज खोलें: एड्रेस बार में chrome://extensions टाइप करें (Edge में edge://extensions, Opera में opera://extensions)।",
      "“डेवलपर मोड” चालू करें — यह स्विच पेज के ऊपर है।",
      "“अनपैक्ड लोड करें” पर क्लिक करें और वही फ़ोल्डर चुनें — जिसमें manifest.json फ़ाइल है।",
      "हो गया: वीडियो पेजों पर “डाउनलोड” बटन दिखेगा, और ब्राउज़र टूलबार में Videoner आइकन दिखेगा।",
    ],
    browsersFirefox: "Mozilla Firefox 128 या नया — यह भी कंप्यूटर पर।",
    firefoxSoon:
      "Firefox वर्शन जल्द आ रहा है। फ़िलहाल एक्सटेंशन Chrome, Yandex Browser, Edge, Opera और Chromium पर आधारित दूसरे ब्राउज़रों में काम करता है।",
    chromeTitle: "Chrome, Yandex Browser, Edge, Opera",
    chromeHint: ".zip आर्काइव — कुछ ही मिनटों में इंस्टॉल",
    firefoxTitle: "Firefox",
    firefoxHint: "एक क्लिक में इंस्टॉल",
    yourBrowser: "आपका ब्राउज़र",
    soon: "जल्द आ रहा है",
    firefoxStepsTitle: "Firefox में कैसे इंस्टॉल करें",
    firefoxSteps: [
      "इस पेज के ऊपर Firefox बटन पर क्लिक करें।",
      "Firefox पूछेगा कि क्या videoner.download को ऐड-ऑन इंस्टॉल करने देना है — “इंस्टॉलेशन जारी रखें” पर क्लिक करें।",
      "“Videoner जोड़ें?” विंडो में “जोड़ें” पर क्लिक करें।",
      "हो गया: वीडियो पेजों पर “डाउनलोड” बटन दिखेगा, और टूलबार में Videoner आइकन दिखेगा। अपडेट Firefox खुद इंस्टॉल करेगा।",
    ],
    updateTitle: "Chrome, Yandex Browser, Edge और Opera में कैसे अपडेट करें",
    updateSteps: [
      "नया वर्शन आने पर Videoner आइकन पर NEW का निशान दिखता है, और पॉप-अप में यहाँ का लिंक होता है।",
      "इस पेज के ऊपर Chrome बटन से आर्काइव डाउनलोड करें और उसे उसी फ़ोल्डर में अनज़िप करें जहाँ पहले किया था, फ़ाइलों को बदलते हुए।",
      "एक्सटेंशन पेज खोलें (chrome://extensions, Yandex Browser में browser://extensions, edge://extensions) और “फिर से लोड करें” दबाएँ — Videoner कार्ड पर गोल तीर।",
    ],
    back: "होम पेज",
  },
  id: {
    metaTitle: "Ekstensi browser Videoner",
    title: "Videoner untuk browser Anda",
    summary:
      "Ekstensi ini menambahkan tombol Unduh di halaman video dan mengunduh langsung di browser Anda. Video dari Instagram, Facebook, TikTok, dan Threads diunduh dengan login Anda sendiri — jadi postingan privat yang bisa Anda lihat di akun Anda juga bisa diunduh, begitu pula video yang tidak diberikan platform ke server kami.",
    failedVideo: "Video yang tidak berhasil diunduh di situs atau di bot:",
    failedVideoHint:
      "Pasang ekstensi, masuk ke platform di browser ini, buka videonya, lalu klik Unduh di pojok kanan bawah.",
    openVideo: "Buka video",
    version: "Versi",
    browsersTitle: "Di mana ekstensi ini berfungsi",
    browsers:
      "Google Chrome, Yandex Browser, Microsoft Edge, Opera, Brave, Vivaldi, dan browser berbasis Chromium lainnya — di komputer.",
    mobile: "Ponsel dan tablet tidak mendukung ekstensi — di sana, unduh lewat situs atau bot Telegram.",
    getcourseTitle: "Pelajaran GetCourse",
    getcourse:
      "Buka pelajaran di sekolah GetCourse dengan login Anda: tombol Unduh akan muncul di pojok kanan atas pemutar, dan ikon Videoner menampilkan semua video dalam pelajaran tersebut. Browser Anda sendiri yang mengunduh pelajaran dan menggabungkannya menjadi mp4 — file tidak melewati server kami. Jika gagal di browser, server kami akan mengunduh pelajaran dalam kualitas yang sama; dalam hal ini server menerima link video dari pemutar.",
    privacyTitle: "Login Anda tetap milik Anda",
    privacy:
      "Ekstensi tidak pernah meminta kata sandi: permintaan ke platform dikirim oleh browser Anda sendiri, dan server kami hanya menerima laporan singkat untuk statistik — link, ukuran file, dan judul. Cookie dikirim ke server hanya jika Anda sendiri menekan \"Hubungkan akun ke bot\" — dan hanya cookie dari platform tersebut, dalam bentuk terenkripsi.",
    stepsTitle: "Cara memasang di Chrome, Yandex Browser, Edge, dan Opera",
    steps: [
      "Unduh arsipnya dan ekstrak — akan muncul folder videoner-extension dengan nomor versi di namanya.",
      "Buka halaman ekstensi: ketik chrome://extensions di bilah alamat (edge://extensions di Edge, opera://extensions di Opera).",
      "Aktifkan «Mode developer» — tombol geser di bagian atas halaman.",
      "Klik «Muat yang belum dibuka» lalu pilih folder tersebut — folder yang berisi file manifest.json.",
      "Selesai: tombol Unduh muncul di halaman video, dan ikon Videoner muncul di toolbar browser.",
    ],
    browsersFirefox: "Mozilla Firefox 128 atau yang lebih baru — juga di komputer.",
    firefoxSoon:
      "Versi untuk Firefox segera hadir. Untuk saat ini ekstensi berfungsi di Chrome, Yandex Browser, Edge, Opera, dan browser berbasis Chromium lainnya.",
    chromeTitle: "Chrome, Yandex Browser, Edge, Opera",
    chromeHint: "Arsip .zip — terpasang dalam beberapa menit",
    firefoxTitle: "Firefox",
    firefoxHint: "Pasang dengan satu klik",
    yourBrowser: "Browser Anda",
    soon: "Segera hadir",
    firefoxStepsTitle: "Cara memasang di Firefox",
    firefoxSteps: [
      "Klik tombol Firefox di bagian atas halaman ini.",
      "Firefox akan bertanya apakah videoner.download boleh memasang add-on — klik «Lanjutkan ke Pemasangan».",
      "Di jendela «Tambahkan Videoner?», klik «Tambah».",
      "Selesai: tombol Unduh muncul di halaman video, dan ikon Videoner muncul di toolbar. Firefox akan memasang pembaruan secara otomatis.",
    ],
    updateTitle: "Cara memperbarui di Chrome, Yandex Browser, Edge, dan Opera",
    updateSteps: [
      "Saat versi baru tersedia, ikon Videoner menampilkan label NEW dan jendela pop-up berisi link ke halaman ini.",
      "Unduh arsip dengan tombol Chrome di bagian atas halaman ini dan ekstrak ke folder yang sama seperti sebelumnya, dengan menimpa file lama.",
      "Buka halaman ekstensi (chrome://extensions, browser://extensions di Yandex Browser, edge://extensions) dan tekan Muat ulang — ikon panah melingkar di kartu Videoner.",
    ],
    back: "Beranda",
  },
  sw: {
    metaTitle: "Kiendelezi cha kivinjari cha Videoner",
    title: "Videoner kwa kivinjari chako",
    summary:
      "Kiendelezi kinaongeza kitufe cha Pakua kwenye kurasa za video na kupakua moja kwa moja ndani ya kivinjari chako. Video za Instagram, Facebook, TikTok na Threads zinapakuliwa kwa kutumia akaunti yako mwenyewe — kwa hiyo machapisho ya faragha unayoyaona kwenye akaunti yako yanafanya kazi pia, vivyo hivyo video ambazo jukwaa halikuipa seva yetu.",
    failedVideo: "Video ambayo haikuweza kupakuliwa kwenye tovuti au kwenye boti:",
    failedVideoHint:
      "Sakinisha kiendelezi, ingia kwenye jukwaa katika kivinjari hiki, fungua video na ubofye Pakua kwenye kona ya chini kulia.",
    openVideo: "Fungua video",
    version: "Toleo",
    browsersTitle: "Kinafanya kazi wapi",
    browsers:
      "Google Chrome, Yandex Browser, Microsoft Edge, Opera, Brave, Vivaldi na vivinjari vingine vinavyotegemea Chromium — kwenye kompyuta.",
    mobile: "Simu na tableti hazitumii viendelezi — huko pakua kupitia tovuti au boti ya Telegram.",
    getcourseTitle: "Masomo ya GetCourse",
    getcourse:
      "Fungua somo katika shule ya GetCourse ukiwa umeingia: kitufe cha Pakua kitaonekana kwenye kona ya juu kulia ya kicheza video, na aikoni ya Videoner itaonyesha video zote za somo hilo. Kivinjari chako chenyewe kinapakua somo na kuliunganisha kuwa mp4 — faili haipiti kwenye seva yetu. Ikishindikana kwenye kivinjari, seva yetu itapakua somo kwa ubora uleule badala yake; katika hali hiyo inapokea kiungo cha video kutoka kwenye kicheza video.",
    privacyTitle: "Akaunti yako inabaki kwako",
    privacy:
      "Kiendelezi hakiombi nenosiri kamwe: ombi kwa jukwaa linatumwa na kivinjari chako mwenyewe, na seva yetu inapokea tu ripoti fupi kwa ajili ya takwimu — kiungo, ukubwa wa faili na kichwa. Vidakuzi (cookies) vinatumwa kwenye seva tu ikiwa wewe mwenyewe utabonyeza \"Unganisha akaunti na boti\" — na ni vidakuzi vya jukwaa hilo pekee, vikiwa vimesimbwa.",
    stepsTitle: "Jinsi ya kusakinisha kwenye Chrome, Yandex Browser, Edge na Opera",
    steps: [
      "Pakua faili la kumbukumbu (archive) na ulifungue (unzip) — folda ya videoner-extension yenye nambari ya toleo katika jina lake itaonekana.",
      "Fungua ukurasa wa viendelezi: andika chrome://extensions kwenye upau wa anwani (edge://extensions kwenye Edge, opera://extensions kwenye Opera).",
      "Washa “Developer mode” (hali ya msanidi programu) — swichi iliyo juu ya ukurasa.",
      "Bofya “Load unpacked” (pakia kiendelezi kilichofunguliwa) na uchague folda hiyo — ile iliyo na faili manifest.json.",
      "Imekamilika: kurasa za video zinapata kitufe cha Pakua, na aikoni ya Videoner inaonekana kwenye upau wa zana wa kivinjari.",
    ],
    browsersFirefox: "Mozilla Firefox 128 au toleo jipya zaidi — pia kwenye kompyuta.",
    firefoxSoon:
      "Toleo la Firefox linakuja hivi karibuni. Kwa sasa kiendelezi kinafanya kazi kwenye Chrome, Yandex Browser, Edge, Opera na vivinjari vingine vinavyotegemea Chromium.",
    chromeTitle: "Chrome, Yandex Browser, Edge, Opera",
    chromeHint: "Faili la .zip — linasakinishwa kwa dakika chache",
    firefoxTitle: "Firefox",
    firefoxHint: "Usakinishaji kwa kubofya mara moja",
    yourBrowser: "Kivinjari chako",
    soon: "Inakuja hivi karibuni",
    firefoxStepsTitle: "Jinsi ya kusakinisha kwenye Firefox",
    firefoxSteps: [
      "Bofya kitufe cha Firefox kilicho juu ya ukurasa huu.",
      "Firefox itauliza kama iruhusu videoner.download kusakinisha nyongeza (add-on) — bofya “Continue to Installation” (Endelea na Usakinishaji).",
      "Kwenye dirisha la “Add Videoner?”, bofya “Add” (Ongeza).",
      "Imekamilika: kurasa za video zinapata kitufe cha Pakua, na aikoni ya Videoner inaonekana kwenye upau wa zana. Firefox husakinisha masasisho yenyewe.",
    ],
    updateTitle: "Jinsi ya kusasisha kwenye Chrome, Yandex Browser, Edge na Opera",
    updateSteps: [
      "Toleo jipya linapotoka, aikoni ya Videoner inaonyesha alama ya NEW na dirisha lake linaleta kiungo cha ukurasa huu.",
      "Pakua faili la kumbukumbu kwa kitufe cha Chrome kilicho juu ya ukurasa huu na ulifungue kwenye folda ileile kama awali, ukibadilisha faili za zamani.",
      "Fungua ukurasa wa viendelezi (chrome://extensions, browser://extensions kwenye Yandex Browser, edge://extensions) na ubonyeze “Reload” (Pakia upya) — mshale wa duara kwenye kadi ya Videoner.",
    ],
    back: "Mwanzo",
  },
  de: {
    metaTitle: "Videoner Browser-Erweiterung",
    title: "Videoner für deinen Browser",
    summary:
      "Die Erweiterung fügt Videoseiten einen Download-Button hinzu und lädt direkt in deinem Browser herunter. Instagram, Facebook, TikTok und Threads werden mit deiner eigenen Anmeldung heruntergeladen – so klappt es auch bei privaten Beiträgen, die du in deinem Konto siehst, und bei Videos, die die Plattform unserem Server nicht herausgegeben hat.",
    failedVideo: "Das Video, das auf der Website oder im Bot nicht heruntergeladen werden konnte:",
    failedVideoHint:
      "Installiere die Erweiterung, melde dich in diesem Browser bei der Plattform an, öffne das Video und klicke unten rechts auf „Download“.",
    openVideo: "Video öffnen",
    version: "Version",
    browsersTitle: "Wo sie funktioniert",
    browsers:
      "Google Chrome, Yandex Browser, Microsoft Edge, Opera, Brave, Vivaldi und andere Chromium-basierte Browser – am Computer.",
    mobile: "Handys und Tablets unterstützen keine Erweiterungen – nutze dort die Website oder den Telegram-Bot.",
    getcourseTitle: "GetCourse-Lektionen",
    getcourse:
      "Öffne eine Lektion in einer GetCourse-Schule, während du angemeldet bist: Oben rechts im Player erscheint ein Download-Button, und das Videoner-Symbol listet alle Videos der Lektion auf. Dein Browser lädt die Lektion selbst herunter und setzt sie zu einer mp4 zusammen – die Datei läuft nicht über unseren Server. Klappt das nicht, lädt unser Server die Lektion in derselben Qualität herunter; dafür bekommt er den Videolink aus dem Player.",
    privacyTitle: "Deine Anmeldung bleibt bei dir",
    privacy:
      "Die Erweiterung fragt nie nach einem Passwort: Die Anfrage an die Plattform stellt dein eigener Browser, und unser Server bekommt nur einen kurzen Bericht für die Statistik – Link, Dateigröße und Titel. Cookies gehen nur dann an den Server, wenn du selbst auf „Konto mit dem Bot verbinden“ klickst – und nur die Cookies dieser Plattform, verschlüsselt.",
    stepsTitle: "Installation in Chrome, Yandex Browser, Edge und Opera",
    steps: [
      "Lade das Archiv herunter und entpacke es – es erscheint ein Ordner videoner-extension mit der Versionsnummer im Namen.",
      "Öffne die Erweiterungsseite: Gib chrome://extensions in die Adressleiste ein (edge://extensions in Edge, opera://extensions in Opera).",
      "Aktiviere den „Entwicklermodus“ – der Schalter oben auf der Seite.",
      "Klicke auf „Entpackte Erweiterung laden“ und wähle diesen Ordner – den, in dem die Datei manifest.json liegt.",
      "Fertig: Videoseiten bekommen einen Download-Button, und das Videoner-Symbol erscheint in der Browser-Symbolleiste.",
    ],
    browsersFirefox: "Mozilla Firefox 128 oder neuer – ebenfalls am Computer.",
    firefoxSoon:
      "Die Firefox-Version kommt bald. Bis dahin funktioniert die Erweiterung in Chrome, Yandex Browser, Edge, Opera und anderen Chromium-basierten Browsern.",
    chromeTitle: "Chrome, Yandex Browser, Edge, Opera",
    chromeHint: "Ein .zip-Archiv – in ein paar Minuten installiert",
    firefoxTitle: "Firefox",
    firefoxHint: "Installation mit einem Klick",
    yourBrowser: "Dein Browser",
    soon: "Demnächst",
    firefoxStepsTitle: "Installation in Firefox",
    firefoxSteps: [
      "Klicke oben auf dieser Seite auf den Firefox-Button.",
      "Firefox fragt, ob videoner.download ein Add-on installieren darf – klicke auf „Weiter zur Installation“.",
      "Klicke im Fenster „Videoner hinzufügen?“ auf „Hinzufügen“.",
      "Fertig: Videoseiten bekommen einen Download-Button, und das Videoner-Symbol erscheint in der Symbolleiste. Updates installiert Firefox selbst.",
    ],
    updateTitle: "Update in Chrome, Yandex Browser, Edge und Opera",
    updateSteps: [
      "Sobald eine neue Version erscheint, zeigt das Videoner-Symbol ein NEW-Badge, und das Pop-up verlinkt hierher.",
      "Lade das Archiv über den Chrome-Button oben auf dieser Seite herunter und entpacke es in denselben Ordner wie zuvor – die Dateien werden ersetzt.",
      "Öffne die Erweiterungsseite (chrome://extensions, browser://extensions in Yandex Browser, edge://extensions) und klicke auf „Neu laden“ – den Kreispfeil auf der Videoner-Karte.",
    ],
    back: "Startseite",
  },
  fr: {
    metaTitle: "Extension de navigateur Videoner",
    title: "Videoner pour votre navigateur",
    summary:
      "L’extension ajoute un bouton Télécharger aux pages vidéo et télécharge directement dans votre navigateur. Instagram, Facebook, TikTok et Threads sont téléchargés avec votre propre connexion : cela fonctionne donc aussi pour les publications privées que vous voyez dans votre compte, et pour les vidéos que la plateforme n’a pas transmises à notre serveur.",
    failedVideo: "La vidéo qui n’a pas pu être téléchargée sur le site ou dans le bot :",
    failedVideoHint:
      "Installez l’extension, connectez-vous à la plateforme dans ce navigateur, ouvrez la vidéo et cliquez sur « Télécharger » en bas à droite.",
    openVideo: "Ouvrir la vidéo",
    version: "Version",
    browsersTitle: "Où elle fonctionne",
    browsers:
      "Google Chrome, Yandex Browser, Microsoft Edge, Opera, Brave, Vivaldi et les autres navigateurs basés sur Chromium, sur ordinateur.",
    mobile: "Les téléphones et tablettes ne prennent pas en charge les extensions : utilisez-y le site ou le bot Telegram.",
    getcourseTitle: "Cours GetCourse",
    getcourse:
      "Ouvrez une leçon dans une école GetCourse en étant connecté : un bouton « Télécharger » apparaît en haut à droite du lecteur, et l’icône Videoner affiche toutes les vidéos de la leçon. Votre navigateur télécharge lui-même la leçon et l’assemble en mp4 : le fichier ne passe pas par notre serveur. Si cela échoue, notre serveur télécharge la leçon dans la même qualité ; il reçoit alors le lien de la vidéo depuis le lecteur.",
    privacyTitle: "Votre connexion reste chez vous",
    privacy:
      "L’extension ne demande jamais de mot de passe : c’est votre propre navigateur qui envoie la requête à la plateforme, et notre serveur ne reçoit qu’un bref rapport pour les statistiques (lien, taille du fichier et titre). Les cookies ne sont envoyés au serveur que si vous cliquez vous-même sur « Connecter le compte au bot », et uniquement les cookies de cette plateforme, chiffrés.",
    stepsTitle: "Installation dans Chrome, Yandex Browser, Edge et Opera",
    steps: [
      "Téléchargez l’archive et décompressez-la : un dossier videoner-extension portant le numéro de version dans son nom apparaît.",
      "Ouvrez la page des extensions : saisissez chrome://extensions dans la barre d’adresse (edge://extensions dans Edge, opera://extensions dans Opera).",
      "Activez le « Mode développeur » : l’interrupteur en haut de la page.",
      "Cliquez sur « Charger l’extension non empaquetée » et choisissez ce dossier, celui qui contient le fichier manifest.json.",
      "C’est fait : les pages vidéo affichent un bouton Télécharger, et l’icône Videoner apparaît dans la barre d’outils du navigateur.",
    ],
    browsersFirefox: "Mozilla Firefox 128 ou version ultérieure, également sur ordinateur.",
    firefoxSoon:
      "La version pour Firefox arrive bientôt. En attendant, l’extension fonctionne dans Chrome, Yandex Browser, Edge, Opera et les autres navigateurs basés sur Chromium.",
    chromeTitle: "Chrome, Yandex Browser, Edge, Opera",
    chromeHint: "Une archive .zip, installée en quelques minutes",
    firefoxTitle: "Firefox",
    firefoxHint: "Installation en un clic",
    yourBrowser: "Votre navigateur",
    soon: "Bientôt",
    firefoxStepsTitle: "Installation dans Firefox",
    firefoxSteps: [
      "Cliquez sur le bouton Firefox en haut de cette page.",
      "Firefox vous demande s’il faut autoriser videoner.download à installer un module complémentaire : cliquez sur « Continuer l’installation ».",
      "Dans la fenêtre « Ajouter Videoner ? », cliquez sur « Ajouter ».",
      "C’est fait : les pages vidéo affichent un bouton Télécharger, et l’icône Videoner apparaît dans la barre d’outils. Firefox installe les mises à jour tout seul.",
    ],
    updateTitle: "Mise à jour dans Chrome, Yandex Browser, Edge et Opera",
    updateSteps: [
      "Quand une nouvelle version sort, l’icône Videoner affiche un badge NEW et la fenêtre de l’extension renvoie vers cette page.",
      "Téléchargez l’archive avec le bouton Chrome en haut de cette page et décompressez-la dans le même dossier qu’avant, en remplaçant les fichiers.",
      "Ouvrez la page des extensions (chrome://extensions, browser://extensions dans Yandex Browser, edge://extensions) et cliquez sur « Actualiser », la flèche circulaire sur la carte Videoner.",
    ],
    back: "Accueil",
  },
  it: {
    metaTitle: "Estensione Videoner per browser",
    title: "Videoner per il tuo browser",
    summary:
      "L’estensione aggiunge un pulsante Scarica alle pagine dei video e scarica direttamente nel browser. Instagram, Facebook, TikTok e Threads vengono scaricati con il tuo accesso: così funzionano anche i post privati che vedi nel tuo account e i video che la piattaforma non ha fornito al nostro server.",
    failedVideo: "Il video che non è stato possibile scaricare sul sito o nel bot:",
    failedVideoHint:
      "Installa l’estensione, accedi alla piattaforma in questo browser, apri il video e clicca su «Scarica» in basso a destra.",
    openVideo: "Apri il video",
    version: "Versione",
    browsersTitle: "Dove funziona",
    browsers:
      "Google Chrome, Yandex Browser, Microsoft Edge, Opera, Brave, Vivaldi e gli altri browser basati su Chromium, da computer.",
    mobile: "Smartphone e tablet non supportano le estensioni: lì usa il sito o il bot Telegram.",
    getcourseTitle: "Lezioni GetCourse",
    getcourse:
      "Apri una lezione in una scuola GetCourse dopo aver effettuato l’accesso: nell’angolo in alto a destra del player compare il pulsante «Scarica», e l’icona di Videoner mostra tutti i video della lezione. È il tuo browser a scaricare la lezione e a unirla in un mp4: il file non passa dal nostro server. Se non ci riesce, la lezione viene scaricata nella stessa qualità dal nostro server, che in quel caso riceve il link del video dal player.",
    privacyTitle: "Il tuo accesso resta tuo",
    privacy:
      "L’estensione non chiede mai la password: è il tuo browser a inviare la richiesta alla piattaforma, e il nostro server riceve solo un breve resoconto per le statistiche (link, dimensione del file e titolo). I cookie vengono inviati al server solo se premi tu «Collega l’account al bot», e solo quelli di quella piattaforma, cifrati.",
    stepsTitle: "Come installarla su Chrome, Yandex Browser, Edge e Opera",
    steps: [
      "Scarica l’archivio ed estrailo: comparirà una cartella videoner-extension con il numero di versione nel nome.",
      "Apri la pagina delle estensioni: digita chrome://extensions nella barra degli indirizzi (edge://extensions in Edge, opera://extensions in Opera).",
      "Attiva la «Modalità sviluppatore»: l’interruttore in cima alla pagina.",
      "Clicca su «Carica estensione non pacchettizzata» e scegli quella cartella, cioè quella che contiene il file manifest.json.",
      "Fatto: le pagine dei video avranno il pulsante Scarica e l’icona di Videoner comparirà nella barra degli strumenti del browser.",
    ],
    browsersFirefox: "Mozilla Firefox 128 o successivo, sempre da computer.",
    firefoxSoon:
      "La versione per Firefox arriverà presto. Per ora l’estensione funziona su Chrome, Yandex Browser, Edge, Opera e gli altri browser basati su Chromium.",
    chromeTitle: "Chrome, Yandex Browser, Edge, Opera",
    chromeHint: "Archivio .zip: si installa in un paio di minuti",
    firefoxTitle: "Firefox",
    firefoxHint: "Installazione con un clic",
    yourBrowser: "Il tuo browser",
    soon: "In arrivo",
    firefoxStepsTitle: "Come installarla su Firefox",
    firefoxSteps: [
      "Clicca sul pulsante Firefox in cima a questa pagina.",
      "Firefox ti chiede se consentire a videoner.download di installare un componente aggiuntivo: clicca su «Continua l’installazione».",
      "Nella finestra «Aggiungere Videoner?» clicca su «Aggiungi».",
      "Fatto: le pagine dei video avranno il pulsante Scarica e l’icona di Videoner comparirà nella barra degli strumenti. Gli aggiornamenti li installa Firefox da solo.",
    ],
    updateTitle: "Come aggiornarla su Chrome, Yandex Browser, Edge e Opera",
    updateSteps: [
      "Quando esce una nuova versione, l’icona di Videoner mostra il badge NEW e la finestra dell’estensione rimanda a questa pagina.",
      "Scarica l’archivio con il pulsante Chrome in cima a questa pagina ed estrailo nella stessa cartella di prima, sostituendo i file.",
      "Apri la pagina delle estensioni (chrome://extensions, browser://extensions in Yandex Browser, edge://extensions) e clicca su «Ricarica», la freccia circolare sulla scheda di Videoner.",
    ],
    back: "Home",
  },
  pt: {
    metaTitle: "Extensão Videoner para navegador",
    title: "Videoner para o seu navegador",
    summary:
      "A extensão adiciona um botão Baixar às páginas de vídeo e baixa direto no navegador. Instagram, Facebook, TikTok e Threads são baixados com o seu próprio login — assim funcionam também as publicações privadas que você vê na sua conta e os vídeos que a plataforma não liberou para o nosso servidor.",
    failedVideo: "O vídeo que não foi possível baixar no site ou no bot:",
    failedVideoHint:
      "Instale a extensão, entre na plataforma neste navegador, abra o vídeo e clique em “Baixar” no canto inferior direito.",
    openVideo: "Abrir o vídeo",
    version: "Versão",
    browsersTitle: "Onde funciona",
    browsers:
      "Google Chrome, Yandex Browser, Microsoft Edge, Opera, Brave, Vivaldi e outros navegadores baseados em Chromium — no computador.",
    mobile: "Celulares e tablets não suportam extensões — neles, use o site ou o bot do Telegram.",
    getcourseTitle: "Aulas do GetCourse",
    getcourse:
      "Abra uma aula de uma escola no GetCourse com o seu login: o botão “Baixar” aparece no canto superior direito do player, e o ícone do Videoner lista todos os vídeos da aula. O próprio navegador baixa a aula e a junta em um mp4 — o arquivo não passa pelo nosso servidor. Se isso não der certo, o nosso servidor baixa a aula na mesma qualidade; nesse caso, ele recebe o link do vídeo a partir do player.",
    privacyTitle: "Seu login fica com você",
    privacy:
      "A extensão nunca pede senha: é o seu próprio navegador que faz a requisição à plataforma, e o nosso servidor recebe só um breve relatório para estatísticas — o link, o tamanho do arquivo e o título. Os cookies só vão para o servidor se você mesmo clicar em “Conectar a conta ao bot” — e apenas os cookies daquela plataforma, criptografados.",
    stepsTitle: "Como instalar no Chrome, Yandex Browser, Edge e Opera",
    steps: [
      "Baixe o arquivo e descompacte — vai aparecer uma pasta videoner-extension com o número da versão no nome.",
      "Abra a página de extensões: digite chrome://extensions na barra de endereços (edge://extensions no Edge, opera://extensions no Opera).",
      "Ative o “Modo do desenvolvedor” — o botão no topo da página.",
      "Clique em “Carregar sem compactação” e escolha essa pasta — a que contém o manifest.json.",
      "Pronto: as páginas de vídeo ganham um botão Baixar, e o ícone do Videoner aparece na barra de ferramentas do navegador.",
    ],
    browsersFirefox: "Mozilla Firefox 128 ou mais recente — também no computador.",
    firefoxSoon:
      "A versão para Firefox chega em breve. Por enquanto, a extensão funciona no Chrome, Yandex Browser, Edge, Opera e outros navegadores baseados em Chromium.",
    chromeTitle: "Chrome, Yandex Browser, Edge, Opera",
    chromeHint: "Arquivo .zip — instala em poucos minutos",
    firefoxTitle: "Firefox",
    firefoxHint: "Instalação com um clique",
    yourBrowser: "Seu navegador",
    soon: "Em breve",
    firefoxStepsTitle: "Como instalar no Firefox",
    firefoxSteps: [
      "Clique no botão Firefox no topo desta página.",
      "O Firefox pergunta se deve permitir que videoner.download instale um complemento — clique em “Continuar a instalação”.",
      "Na janela “Adicionar Videoner?”, clique em “Adicionar”.",
      "Pronto: as páginas de vídeo ganham um botão Baixar, e o ícone do Videoner aparece na barra de ferramentas. O Firefox instala as atualizações sozinho.",
    ],
    updateTitle: "Como atualizar no Chrome, Yandex Browser, Edge e Opera",
    updateSteps: [
      "Quando sai uma versão nova, o ícone do Videoner mostra o selo NEW e a janela da extensão leva para esta página.",
      "Baixe o arquivo com o botão Chrome no topo desta página e descompacte na mesma pasta de antes, substituindo os arquivos.",
      "Abra a página de extensões (chrome://extensions, browser://extensions no Yandex Browser, edge://extensions) e clique em “Recarregar” — a seta circular no card do Videoner.",
    ],
    back: "Início",
  },
  tr: {
    metaTitle: "Videoner tarayıcı eklentisi",
    title: "Tarayıcınız için Videoner",
    summary:
      "Eklenti, video sayfalarına bir İndir düğmesi ekler ve indirmeyi doğrudan tarayıcınızda yapar. Instagram, Facebook, TikTok ve Threads kendi oturumunuzla indirilir — böylece hesabınızda görebildiğiniz gizli gönderiler ve platformun sunucumuza vermediği videolar da indirilebilir.",
    failedVideo: "Sitede veya botta indirilemeyen video:",
    failedVideoHint:
      "Eklentiyi yükleyin, bu tarayıcıda platforma giriş yapın, videoyu açın ve sağ alt köşedeki “İndir” düğmesine tıklayın.",
    openVideo: "Videoyu aç",
    version: "Sürüm",
    browsersTitle: "Nerede çalışır",
    browsers:
      "Google Chrome, Yandex Browser, Microsoft Edge, Opera, Brave, Vivaldi ve Chromium tabanlı diğer tarayıcılar — bilgisayarda.",
    mobile: "Telefonlar ve tabletler eklentileri desteklemez — orada web sitesini veya Telegram botunu kullanın.",
    getcourseTitle: "GetCourse dersleri",
    getcourse:
      "Giriş yapmışken bir GetCourse okulunda ders açın: oynatıcının sağ üst köşesinde bir İndir düğmesi belirir, Videoner simgesi ise dersteki tüm videoları listeler. Tarayıcınız dersi kendisi indirir ve tek bir mp4 dosyasında birleştirir — dosya sunucumuzdan geçmez. Bu başarısız olursa dersi aynı kalitede sunucumuz indirir; bu durumda video bağlantısını oynatıcıdan alır.",
    privacyTitle: "Oturumunuz sizde kalır",
    privacy:
      "Eklenti hiçbir zaman şifre istemez: platforma isteği kendi tarayıcınız gönderir, sunucumuz ise istatistik için yalnızca kısa bir rapor alır — bağlantı, dosya boyutu ve başlık. Çerezler sunucuya yalnızca “Hesabı bota bağla” düğmesine kendiniz bastığınızda gönderilir — ve yalnızca o platformun çerezleri, şifrelenmiş olarak.",
    stepsTitle: "Chrome, Yandex Browser, Edge ve Opera'ya nasıl yüklenir",
    steps: [
      "Arşivi indirin ve açın — adında sürüm numarası olan bir videoner-extension klasörü oluşur.",
      "Eklentiler sayfasını açın: adres çubuğuna chrome://extensions yazın (Edge'de edge://extensions, Opera'da opera://extensions).",
      "Sayfanın üst kısmındaki anahtarla “Geliştirici modu”nu açın.",
      "“Paketlenmemiş öğe yükle”ye tıklayın ve o klasörü seçin — içinde manifest.json bulunan klasörü.",
      "Hepsi bu: video sayfalarında bir İndir düğmesi belirir, Videoner simgesi de tarayıcı araç çubuğunda görünür.",
    ],
    browsersFirefox: "Mozilla Firefox 128 veya üzeri — yine bilgisayarda.",
    firefoxSoon:
      "Firefox sürümü çok yakında geliyor. Şimdilik eklenti Chrome, Yandex Browser, Edge, Opera ve Chromium tabanlı diğer tarayıcılarda çalışıyor.",
    chromeTitle: "Chrome, Yandex Browser, Edge, Opera",
    chromeHint: "Bir .zip arşivi — birkaç dakikada yüklenir",
    firefoxTitle: "Firefox",
    firefoxHint: "Tek tıkla kurulum",
    yourBrowser: "Tarayıcınız",
    soon: "Çok yakında",
    firefoxStepsTitle: "Firefox'a nasıl yüklenir",
    firefoxSteps: [
      "Bu sayfanın üst kısmındaki Firefox düğmesine tıklayın.",
      "Firefox, videoner.download sitesinin bir eklenti yüklemesine izin verilip verilmeyeceğini sorar — “Kuruluma devam et”e tıklayın.",
      "“Videoner eklensin mi?” penceresinde “Ekle”ye tıklayın.",
      "Hepsi bu: video sayfalarında bir İndir düğmesi belirir, Videoner simgesi de araç çubuğunda görünür. Firefox güncellemeleri kendisi yükler.",
    ],
    updateTitle: "Chrome, Yandex Browser, Edge ve Opera'da nasıl güncellenir",
    updateSteps: [
      "Yeni bir sürüm çıktığında Videoner simgesinde NEW etiketi görünür ve açılır pencere buraya bağlantı verir.",
      "Arşivi bu sayfanın üst kısmındaki Chrome düğmesiyle indirin ve dosyaların üzerine yazarak öncekiyle aynı klasöre açın.",
      "Eklentiler sayfasını açın (chrome://extensions, Yandex Browser'da browser://extensions, edge://extensions) ve “Yeniden yükle”ye basın — Videoner kartındaki dairesel ok.",
    ],
    back: "Ana sayfa",
  },
  uz: {
    metaTitle: "Videoner brauzer kengaytmasi",
    title: "Brauzeringiz uchun Videoner",
    summary:
      "Kengaytma video sahifalariga «Yuklab olish» tugmasini qoʻshadi va videoni toʻgʻridan-toʻgʻri brauzeringizda yuklab oladi. Instagram, Facebook, TikTok va Threads sizning shu platformadagi akkauntingiz orqali yuklab olinadi — shuning uchun akkauntingizda koʻrinadigan yopiq postlar ham, platforma serverimizga bermagan videolar ham yuklanadi.",
    failedVideo: "Saytda yoki botda yuklab boʻlmagan video:",
    failedVideoHint:
      "Kengaytmani oʻrnating, shu brauzerda platformaga kiring, videoni oching va oʻng pastki burchakdagi «Yuklab olish» tugmasini bosing.",
    openVideo: "Videoni ochish",
    version: "Versiya",
    browsersTitle: "Qayerda ishlaydi",
    browsers:
      "Google Chrome, Yandex Browser, Microsoft Edge, Opera, Brave, Vivaldi va Chromium asosidagi boshqa brauzerlar — kompyuterda.",
    mobile: "Telefon va planshetlarda kengaytmalar ishlamaydi — u yerda sayt yoki Telegram-botdan foydalaning.",
    getcourseTitle: "GetCourse darslari",
    getcourse:
      "GetCourse maktabidagi darsni oʻz akkauntingiz bilan oching: pleyerning oʻng yuqori burchagida «Yuklab olish» tugmasi paydo boʻladi, Videoner belgisi esa darsdagi barcha videolarni koʻrsatadi. Brauzer darsni oʻzi yuklab oladi va mp4 faylga yigʻadi — fayl serverimiz orqali oʻtmaydi. Agar brauzerda bu ishlamasa, darsni xuddi shu sifatda serverimiz yuklab oladi: bu holda unga pleyerdagi video havolasi yuboriladi.",
    privacyTitle: "Akkauntingiz oʻzingizda qoladi",
    privacy:
      "Kengaytma hech qachon parol soʻramaydi: platformaga soʻrovni brauzeringizning oʻzi yuboradi, serverimiz esa statistika uchun faqat qisqa hisobot oladi — havola, fayl hajmi va nomi. Cookie fayllar serverga faqat «Akkauntni botga ulash» tugmasini oʻzingiz bossangizgina yuboriladi — va faqat oʻsha platformaning cookie fayllari, shifrlangan holda.",
    stepsTitle: "Chrome, Yandex Browser, Edge va Operaʼga qanday oʻrnatiladi",
    steps: [
      "Arxivni yuklab oling va uni oching (zipdan chiqaring) — nomida versiya raqami boʻlgan videoner-extension papkasi paydo boʻladi.",
      "Kengaytmalar sahifasini oching: manzil satriga chrome://extensions deb yozing (Edgeʼda — edge://extensions, Operaʼda — opera://extensions).",
      "Sahifaning yuqorisidagi «Developer mode» (Dasturchi rejimi) tugmachasini yoqing.",
      "«Load unpacked» (Ochilgan kengaytmani yuklash) tugmasini bosing va oʻsha papkani tanlang — ichida manifest.json fayli bor papkani.",
      "Tayyor: video sahifalarida «Yuklab olish» tugmasi, brauzer panelida esa Videoner belgisi paydo boʻladi.",
    ],
    browsersFirefox: "Mozilla Firefox 128 va undan yangi versiyalar — ham kompyuterda.",
    firefoxSoon:
      "Firefox versiyasi tez orada chiqadi. Hozircha kengaytma Chrome, Yandex Browser, Edge, Opera va Chromium asosidagi boshqa brauzerlarda ishlaydi.",
    chromeTitle: "Chrome, Yandex Browser, Edge, Opera",
    chromeHint: ".zip arxiv — bir-ikki daqiqada oʻrnatiladi",
    firefoxTitle: "Firefox",
    firefoxHint: "Bir bosishda oʻrnatish",
    yourBrowser: "Sizning brauzeringiz",
    soon: "Tez orada",
    firefoxStepsTitle: "Firefoxʼga qanday oʻrnatiladi",
    firefoxSteps: [
      "Ushbu sahifaning yuqorisidagi Firefox tugmasini bosing.",
      "Firefox videoner.download saytiga qoʻshimcha oʻrnatishga ruxsat berish-bermaslikni soʻraydi — «Continue to Installation» (Oʻrnatishni davom ettirish) tugmasini bosing.",
      "«Add Videoner?» (Videoner qoʻshilsinmi?) oynasida «Add» (Qoʻshish) tugmasini bosing.",
      "Tayyor: video sahifalarida «Yuklab olish» tugmasi, panelda esa Videoner belgisi paydo boʻladi. Yangilanishlarni Firefox oʻzi oʻrnatadi.",
    ],
    updateTitle: "Chrome, Yandex Browser, Edge va Operaʼda qanday yangilanadi",
    updateSteps: [
      "Yangi versiya chiqqanda Videoner belgisida NEW belgisi paydo boʻladi, oynachada esa shu sahifaga havola chiqadi.",
      "Ushbu sahifaning yuqorisidagi Chrome tugmasi bilan arxivni yuklab oling va uni avvalgi papkaga fayllarni almashtirib oching.",
      "Kengaytmalar sahifasini oching (chrome://extensions, Yandex Browserʼda browser://extensions, edge://extensions) va Videoner kartasidagi «Reload» (Yangilash) — aylana strelka tugmasini bosing.",
    ],
    back: "Bosh sahifa",
  },
  fa: {
    metaTitle: "افزونه مرورگر Videoner",
    title: "Videoner برای مرورگر شما",
    summary:
      "این افزونه یک دکمه «دانلود» به صفحه‌های ویدیو اضافه می‌کند و دانلود را مستقیم در مرورگر شما انجام می‌دهد. ویدیوهای Instagram، Facebook، TikTok و Threads با حساب خود شما دانلود می‌شوند؛ به همین دلیل پست‌های خصوصی که در حساب‌تان می‌بینید و ویدیوهایی که پلتفرم به سرور ما نداده است هم دانلود می‌شوند.",
    failedVideo: "ویدیویی که در سایت یا ربات دانلود نشد:",
    failedVideoHint:
      "افزونه را نصب کنید، در همین مرورگر وارد حساب خود در آن پلتفرم شوید، ویدیو را باز کنید و روی «دانلود» در گوشه پایین سمت راست کلیک کنید.",
    openVideo: "باز کردن ویدیو",
    version: "نسخه",
    browsersTitle: "کجا کار می‌کند",
    browsers:
      "Google Chrome، Yandex Browser، Microsoft Edge، Opera، Brave، Vivaldi و دیگر مرورگرهای مبتنی بر Chromium، روی کامپیوتر.",
    mobile: "گوشی‌ها و تبلت‌ها از افزونه پشتیبانی نمی‌کنند؛ در آن‌ها از سایت یا ربات Telegram استفاده کنید.",
    getcourseTitle: "درس‌های GetCourse",
    getcourse:
      "درسی را در یک مدرسه GetCourse در حالی که وارد حساب خود هستید باز کنید: دکمه «دانلود» در گوشه بالا سمت راست پخش‌کننده ظاهر می‌شود و آیکون Videoner همه ویدیوهای درس را نشان می‌دهد. مرورگر شما خودش درس را دانلود می‌کند و آن را به یک فایل mp4 تبدیل می‌کند؛ فایل از سرور ما عبور نمی‌کند. اگر این کار در مرورگر انجام نشد، سرور ما درس را با همان کیفیت دانلود می‌کند؛ در این حالت لینک ویدیو از پخش‌کننده به سرور فرستاده می‌شود.",
    privacyTitle: "حساب شما نزد خودتان می‌ماند",
    privacy:
      "افزونه هرگز رمز عبور نمی‌خواهد: درخواست به پلتفرم را مرورگر خود شما می‌فرستد و سرور ما فقط یک گزارش کوتاه برای آمار دریافت می‌کند: لینک، حجم فایل و عنوان. کوکی‌ها فقط وقتی به سرور فرستاده می‌شوند که خودتان «اتصال حساب به ربات» را بزنید، و آن هم فقط کوکی‌های همان پلتفرم، به‌صورت رمزگذاری‌شده.",
    stepsTitle: "نحوه نصب در Chrome، Yandex Browser، Edge و Opera",
    steps: [
      "آرشیو را دانلود و از حالت فشرده خارج کنید؛ پوشه‌ای به نام videoner-extension که شماره نسخه در نامش است ظاهر می‌شود.",
      "صفحه افزونه‌ها را باز کنید: در نوار آدرس ‎chrome://extensions را تایپ کنید (در Edge ‎edge://extensions و در Opera ‎opera://extensions).",
      "«حالت برنامه‌نویس» (Developer mode) را روشن کنید؛ کلید آن در بالای صفحه است.",
      "روی «بارگیری موارد بسته‌بندی‌نشده» (Load unpacked) کلیک کنید و همان پوشه را انتخاب کنید؛ پوشه‌ای که فایل manifest.json در آن است.",
      "تمام: در صفحه‌های ویدیو دکمه «دانلود» و در نوار ابزار مرورگر آیکون Videoner ظاهر می‌شود.",
    ],
    browsersFirefox: "Mozilla Firefox نسخه 128 و جدیدتر، آن هم روی کامپیوتر.",
    firefoxSoon:
      "نسخه Firefox به‌زودی منتشر می‌شود. فعلاً افزونه در Chrome، Yandex Browser، Edge، Opera و دیگر مرورگرهای مبتنی بر Chromium کار می‌کند.",
    chromeTitle: "Chrome، Yandex Browser، Edge، Opera",
    chromeHint: "آرشیو .zip؛ نصب در چند دقیقه",
    firefoxTitle: "Firefox",
    firefoxHint: "نصب با یک کلیک",
    yourBrowser: "مرورگر شما",
    soon: "به‌زودی",
    firefoxStepsTitle: "نحوه نصب در Firefox",
    firefoxSteps: [
      "روی دکمه Firefox در بالای همین صفحه کلیک کنید.",
      "Firefox می‌پرسد که آیا به videoner.download اجازه نصب افزونه داده شود؛ روی «ادامه نصب» کلیک کنید.",
      "در پنجره «Videoner افزوده شود؟» روی «افزودن» کلیک کنید.",
      "تمام: در صفحه‌های ویدیو دکمه «دانلود» و در نوار ابزار آیکون Videoner ظاهر می‌شود. Firefox به‌روزرسانی‌ها را خودش نصب می‌کند.",
    ],
    updateTitle: "نحوه به‌روزرسانی در Chrome، Yandex Browser، Edge و Opera",
    updateSteps: [
      "وقتی نسخه جدیدی منتشر شود، روی آیکون Videoner نشان NEW ظاهر می‌شود و پنجره افزونه به این صفحه لینک می‌دهد.",
      "آرشیو را با دکمه Chrome در بالای همین صفحه دانلود کنید و آن را در همان پوشه قبلی از حالت فشرده خارج کنید و فایل‌ها را جایگزین کنید.",
      "صفحه افزونه‌ها را باز کنید (‎chrome://extensions، در Yandex Browser ‎browser://extensions، یا ‎edge://extensions) و «بارگیری مجدد» (Reload) را بزنید؛ همان فلش دایره‌ای روی کارت Videoner.",
    ],
    back: "صفحه اصلی",
  },
  vi: {
    metaTitle: "Tiện ích trình duyệt Videoner",
    title: "Videoner cho trình duyệt của bạn",
    summary:
      "Tiện ích thêm nút “Tải xuống” vào các trang video và tải ngay trong trình duyệt của bạn. Instagram, Facebook, TikTok và Threads được tải bằng chính tài khoản đăng nhập của bạn — vì vậy tải được cả bài đăng riêng tư mà bạn xem được trong tài khoản, lẫn những video mà nền tảng không cho máy chủ của chúng tôi tải.",
    failedVideo: "Video không tải được trên trang web hoặc trong bot:",
    failedVideoHint:
      "Cài tiện ích, đăng nhập vào nền tảng trên chính trình duyệt này, mở video và nhấn “Tải xuống” ở góc dưới bên phải.",
    openVideo: "Mở video",
    version: "Phiên bản",
    browsersTitle: "Hoạt động ở đâu",
    browsers:
      "Google Chrome, Yandex Browser, Microsoft Edge, Opera, Brave, Vivaldi và các trình duyệt khác dựa trên Chromium — trên máy tính.",
    mobile: "Điện thoại và máy tính bảng không hỗ trợ tiện ích — trên đó hãy dùng trang web hoặc bot Telegram.",
    getcourseTitle: "Bài học GetCourse",
    getcourse:
      "Mở một bài học trong trường GetCourse khi đã đăng nhập: nút “Tải xuống” sẽ xuất hiện ở góc trên bên phải trình phát, và biểu tượng Videoner sẽ liệt kê mọi video trong bài học. Trình duyệt của bạn tự tải bài học và ghép thành tệp mp4 — tệp không đi qua máy chủ của chúng tôi. Nếu không tải được trong trình duyệt, máy chủ của chúng tôi sẽ tải bài học với cùng chất lượng; khi đó máy chủ nhận link video từ trình phát.",
    privacyTitle: "Thông tin đăng nhập vẫn ở lại với bạn",
    privacy:
      "Tiện ích không bao giờ hỏi mật khẩu: chính trình duyệt của bạn gửi yêu cầu đến nền tảng, còn máy chủ của chúng tôi chỉ nhận một báo cáo ngắn để thống kê — link, dung lượng tệp và tiêu đề. Cookie chỉ được gửi lên máy chủ khi chính bạn nhấn “Kết nối tài khoản với bot” — và chỉ cookie của nền tảng đó, ở dạng mã hóa.",
    stepsTitle: "Cách cài đặt trên Chrome, Yandex Browser, Edge và Opera",
    steps: [
      "Tải tệp nén về và giải nén — sẽ xuất hiện thư mục videoner-extension có số phiên bản trong tên.",
      "Mở trang tiện ích: gõ chrome://extensions vào thanh địa chỉ (trên Edge là edge://extensions, trên Opera là opera://extensions).",
      "Bật “Chế độ dành cho nhà phát triển” — công tắc ở đầu trang.",
      "Nhấn “Tải tiện ích đã giải nén” và chọn thư mục đó — thư mục có chứa tệp manifest.json.",
      "Xong: trên các trang video sẽ có nút “Tải xuống”, và biểu tượng Videoner xuất hiện trên thanh công cụ của trình duyệt.",
    ],
    browsersFirefox: "Mozilla Firefox 128 trở lên — cũng trên máy tính.",
    firefoxSoon:
      "Phiên bản cho Firefox sắp ra mắt. Hiện tại tiện ích hoạt động trên Chrome, Yandex Browser, Edge, Opera và các trình duyệt khác dựa trên Chromium.",
    chromeTitle: "Chrome, Yandex Browser, Edge, Opera",
    chromeHint: "Tệp nén .zip — cài đặt trong vài phút",
    firefoxTitle: "Firefox",
    firefoxHint: "Cài đặt bằng một cú nhấp",
    yourBrowser: "Trình duyệt của bạn",
    soon: "Sắp ra mắt",
    firefoxStepsTitle: "Cách cài đặt trên Firefox",
    firefoxSteps: [
      "Nhấn nút Firefox ở đầu trang này.",
      "Firefox sẽ hỏi có cho phép videoner.download cài tiện ích hay không — nhấn “Tiếp tục cài đặt”.",
      "Trong hộp thoại “Thêm Videoner?”, nhấn “Thêm”.",
      "Xong: trên các trang video sẽ có nút “Tải xuống”, và biểu tượng Videoner xuất hiện trên thanh công cụ. Firefox sẽ tự cài các bản cập nhật.",
    ],
    updateTitle: "Cách cập nhật trên Chrome, Yandex Browser, Edge và Opera",
    updateSteps: [
      "Khi có phiên bản mới, biểu tượng Videoner sẽ hiện nhãn NEW và cửa sổ tiện ích có link dẫn đến đây.",
      "Tải tệp nén bằng nút Chrome ở đầu trang này và giải nén vào đúng thư mục cũ, ghi đè các tệp.",
      "Mở trang tiện ích (chrome://extensions, browser://extensions trên Yandex Browser, edge://extensions) và nhấn “Tải lại” — mũi tên vòng tròn trên thẻ Videoner.",
    ],
    back: "Trang chủ",
  },
  bn: {
    metaTitle: "Videoner ব্রাউজার এক্সটেনশন",
    title: "আপনার ব্রাউজারের জন্য Videoner",
    summary:
      "এক্সটেনশনটি ভিডিও পেজে একটি “ডাউনলোড” বাটন যোগ করে এবং সরাসরি আপনার ব্রাউজারেই ডাউনলোড করে। Instagram, Facebook, TikTok ও Threads আপনার নিজের লগ ইন দিয়ে ডাউনলোড হয় — তাই আপনার অ্যাকাউন্টে যেসব প্রাইভেট পোস্ট আপনি দেখতে পান সেগুলোও ডাউনলোড হয়, আর যেসব ভিডিও প্ল্যাটফর্ম আমাদের সার্ভারকে দেয়নি সেগুলোও।",
    failedVideo: "যে ভিডিও সাইটে বা বটে ডাউনলোড করা যায়নি:",
    failedVideoHint:
      "এক্সটেনশনটি ইনস্টল করুন, এই ব্রাউজারেই প্ল্যাটফর্মে লগ ইন করুন, ভিডিওটি খুলুন এবং নিচের ডান কোণে “ডাউনলোড” চাপুন।",
    openVideo: "ভিডিওটি খুলুন",
    version: "ভার্সন",
    browsersTitle: "কোথায় কাজ করে",
    browsers:
      "Google Chrome, Yandex Browser, Microsoft Edge, Opera, Brave, Vivaldi এবং Chromium-ভিত্তিক অন্যান্য ব্রাউজার — কম্পিউটারে।",
    mobile: "ফোন ও ট্যাবলেটে এক্সটেনশন সমর্থিত নয় — সেখানে ওয়েবসাইট বা Telegram বট ব্যবহার করুন।",
    getcourseTitle: "GetCourse লেসন",
    getcourse:
      "লগ ইন অবস্থায় GetCourse স্কুলের একটি লেসন খুলুন: প্লেয়ারের ওপরের ডান কোণে একটি “ডাউনলোড” বাটন আসবে, আর Videoner আইকনে লেসনের সব ভিডিওর তালিকা দেখা যাবে। আপনার ব্রাউজার নিজেই লেসনটি ডাউনলোড করে mp4-এ জুড়ে দেয় — ফাইলটি আমাদের সার্ভারের মধ্য দিয়ে যায় না। ব্রাউজারে না হলে আমাদের সার্ভার একই কোয়ালিটিতে লেসনটি ডাউনলোড করে দেয়; সে ক্ষেত্রে সার্ভার প্লেয়ার থেকে ভিডিওর লিংক পায়।",
    privacyTitle: "আপনার লগ ইন আপনার কাছেই থাকে",
    privacy:
      "এক্সটেনশন কখনো পাসওয়ার্ড চায় না: প্ল্যাটফর্মে রিকোয়েস্ট পাঠায় আপনার নিজের ব্রাউজার, আর আমাদের সার্ভার পরিসংখ্যানের জন্য শুধু একটি ছোট রিপোর্ট পায় — লিংক, ফাইলের সাইজ ও শিরোনাম। কুকি সার্ভারে যায় শুধু তখনই, যখন আপনি নিজে “বটের সঙ্গে অ্যাকাউন্ট যুক্ত করুন” চাপেন — এবং শুধু সেই প্ল্যাটফর্মের কুকি, এনক্রিপ্ট করা অবস্থায়।",
    stepsTitle: "Chrome, Yandex Browser, Edge ও Opera-তে কীভাবে ইনস্টল করবেন",
    steps: [
      "আর্কাইভটি ডাউনলোড করে আনজিপ করুন — নামে ভার্সন নম্বরসহ একটি videoner-extension ফোল্ডার তৈরি হবে।",
      "এক্সটেনশন পেজ খুলুন: অ্যাড্রেস বারে chrome://extensions লিখুন (Edge-এ edge://extensions, Opera-তে opera://extensions)।",
      "“Developer mode” (ডেভেলপার মোড) চালু করুন — পেজের ওপরের দিকের সুইচটি।",
      "“Load unpacked” চাপুন এবং সেই ফোল্ডারটি বেছে নিন — যেটির ভেতরে manifest.json ফাইল আছে।",
      "হয়ে গেছে: ভিডিও পেজে একটি “ডাউনলোড” বাটন আসবে, আর ব্রাউজারের টুলবারে Videoner আইকন দেখা যাবে।",
    ],
    browsersFirefox: "Mozilla Firefox 128 বা তার পরের ভার্সন — এটিও কম্পিউটারে।",
    firefoxSoon:
      "Firefox ভার্সন শীঘ্রই আসছে। আপাতত এক্সটেনশনটি Chrome, Yandex Browser, Edge, Opera এবং Chromium-ভিত্তিক অন্যান্য ব্রাউজারে কাজ করে।",
    chromeTitle: "Chrome, Yandex Browser, Edge, Opera",
    chromeHint: "একটি .zip আর্কাইভ — কয়েক মিনিটে ইনস্টল হয়",
    firefoxTitle: "Firefox",
    firefoxHint: "এক ক্লিকে ইনস্টল",
    yourBrowser: "আপনার ব্রাউজার",
    soon: "শীঘ্রই আসছে",
    firefoxStepsTitle: "Firefox-এ কীভাবে ইনস্টল করবেন",
    firefoxSteps: [
      "এই পেজের ওপরের Firefox বাটনে ক্লিক করুন।",
      "Firefox জিজ্ঞেস করবে videoner.download-কে অ্যাড-অন ইনস্টল করতে দেবে কি না — “Continue to Installation” চাপুন।",
      "“Add Videoner?” উইন্ডোতে “Add” চাপুন।",
      "হয়ে গেছে: ভিডিও পেজে একটি “ডাউনলোড” বাটন আসবে, আর টুলবারে Videoner আইকন দেখা যাবে। Firefox নিজে থেকেই আপডেট ইনস্টল করে।",
    ],
    updateTitle: "Chrome, Yandex Browser, Edge ও Opera-তে কীভাবে আপডেট করবেন",
    updateSteps: [
      "নতুন ভার্সন এলে Videoner আইকনে NEW ব্যাজ দেখা যাবে, আর এক্সটেনশনের পপআপে এই পেজের লিংক থাকবে।",
      "এই পেজের ওপরের Chrome বাটন দিয়ে আর্কাইভটি ডাউনলোড করুন এবং আগের ফোল্ডারেই আনজিপ করুন, ফাইলগুলো রিপ্লেস করে।",
      "এক্সটেনশন পেজ খুলুন (chrome://extensions, Yandex Browser-এ browser://extensions, edge://extensions) এবং “Reload” চাপুন — Videoner কার্ডের গোল তীর চিহ্নটি।",
    ],
    back: "হোম",
  },
  ur: {
    metaTitle: "Videoner براؤزر ایکسٹینشن",
    title: "آپ کے براؤزر کے لیے Videoner",
    summary:
      "یہ ایکسٹینشن ویڈیو صفحات پر “ڈاؤن لوڈ” بٹن شامل کرتی ہے اور براہ راست آپ کے براؤزر میں ڈاؤن لوڈ کرتی ہے۔ Instagram، Facebook، TikTok اور Threads آپ کے اپنے سائن ان سے ڈاؤن لوڈ ہوتے ہیں — اس لیے وہ پرائیویٹ پوسٹس بھی ڈاؤن لوڈ ہو جاتی ہیں جو آپ اپنے اکاؤنٹ میں دیکھ سکتے ہیں، اور وہ ویڈیوز بھی جو پلیٹ فارم نے ہمارے سرور کو نہیں دیں۔",
    failedVideo: "وہ ویڈیو جو سائٹ یا بوٹ میں ڈاؤن لوڈ نہیں ہو سکی:",
    failedVideoHint:
      "ایکسٹینشن انسٹال کریں، اسی براؤزر میں پلیٹ فارم پر سائن ان کریں، ویڈیو کھولیں اور نیچے دائیں کونے میں “ڈاؤن لوڈ” پر کلک کریں۔",
    openVideo: "ویڈیو کھولیں",
    version: "ورژن",
    browsersTitle: "کہاں کام کرتی ہے",
    browsers:
      "Google Chrome، Yandex Browser، Microsoft Edge، Opera، Brave، Vivaldi اور Chromium پر مبنی دیگر براؤزرز — کمپیوٹر پر۔",
    mobile: "فونز اور ٹیبلٹس پر ایکسٹینشنز سپورٹ نہیں ہوتیں — وہاں ویب سائٹ یا Telegram بوٹ استعمال کریں۔",
    getcourseTitle: "GetCourse کے اسباق",
    getcourse:
      "سائن ان کر کے GetCourse اسکول میں کوئی سبق کھولیں: پلیئر کے اوپر دائیں کونے میں “ڈاؤن لوڈ” بٹن ظاہر ہوگا، اور Videoner آئیکن سبق کی تمام ویڈیوز دکھائے گا۔ آپ کا براؤزر خود سبق ڈاؤن لوڈ کر کے اسے mp4 فائل میں جوڑتا ہے — فائل ہمارے سرور سے نہیں گزرتی۔ اگر براؤزر میں یہ کام نہ ہو سکے تو ہمارا سرور وہی سبق اسی کوالٹی میں ڈاؤن لوڈ کرتا ہے؛ اس صورت میں سرور کو پلیئر سے ویڈیو کا لنک بھیجا جاتا ہے۔",
    privacyTitle: "آپ کا سائن ان آپ ہی کے پاس رہتا ہے",
    privacy:
      "ایکسٹینشن کبھی پاس ورڈ نہیں مانگتی: پلیٹ فارم کو درخواست آپ کا اپنا براؤزر بھیجتا ہے، اور ہمارے سرور کو اعداد و شمار کے لیے صرف ایک مختصر رپورٹ ملتی ہے — لنک، فائل کا سائز اور عنوان۔ کوکیز سرور کو صرف تب بھیجی جاتی ہیں جب آپ خود “اکاؤنٹ کو بوٹ سے جوڑیں” دبائیں — اور وہ بھی صرف اسی پلیٹ فارم کی کوکیز، انکرپٹڈ صورت میں۔",
    stepsTitle: "Chrome، Yandex Browser، Edge اور Opera میں کیسے انسٹال کریں",
    steps: [
      "آرکائیو ڈاؤن لوڈ کریں اور اسے ان زپ کریں — videoner-extension نام کا ایک فولڈر بنے گا جس کے نام میں ورژن نمبر شامل ہوگا۔",
      "ایکسٹینشنز کا صفحہ کھولیں: ایڈریس بار میں ‎chrome://extensions ٹائپ کریں (Edge میں ‎edge://extensions، Opera میں ‎opera://extensions)۔",
      "“Developer mode” آن کریں — اس کا سوئچ صفحے کے اوپر ہے۔",
      "“Load unpacked” پر کلک کریں اور وہی فولڈر منتخب کریں — جس میں manifest.json فائل موجود ہے۔",
      "ہو گیا: ویڈیو صفحات پر “ڈاؤن لوڈ” بٹن آ جائے گا، اور براؤزر کے ٹول بار میں Videoner آئیکن ظاہر ہوگا۔",
    ],
    browsersFirefox: "Mozilla Firefox 128 یا اس سے نیا ورژن — یہ بھی کمپیوٹر پر۔",
    firefoxSoon:
      "Firefox ورژن جلد آ رہا ہے۔ فی الحال ایکسٹینشن Chrome، Yandex Browser، Edge، Opera اور Chromium پر مبنی دیگر براؤزرز میں کام کرتی ہے۔",
    chromeTitle: "Chrome، Yandex Browser، Edge، Opera",
    chromeHint: "‎.zip آرکائیو — چند منٹ میں انسٹالیشن",
    firefoxTitle: "Firefox",
    firefoxHint: "ایک کلک میں انسٹالیشن",
    yourBrowser: "آپ کا براؤزر",
    soon: "جلد آ رہا ہے",
    firefoxStepsTitle: "Firefox میں کیسے انسٹال کریں",
    firefoxSteps: [
      "اس صفحے کے اوپر Firefox بٹن پر کلک کریں۔",
      "Firefox پوچھے گا کہ کیا videoner.download کو ایڈ آن انسٹال کرنے کی اجازت دی جائے — “Continue to Installation” پر کلک کریں۔",
      "“Add Videoner?” والی ونڈو میں “Add” پر کلک کریں۔",
      "ہو گیا: ویڈیو صفحات پر “ڈاؤن لوڈ” بٹن آ جائے گا، اور ٹول بار میں Videoner آئیکن ظاہر ہوگا۔ اپ ڈیٹس Firefox خود انسٹال کرتا ہے۔",
    ],
    updateTitle: "Chrome، Yandex Browser، Edge اور Opera میں کیسے اپ ڈیٹ کریں",
    updateSteps: [
      "نیا ورژن آنے پر Videoner آئیکن پر NEW کا نشان ظاہر ہوتا ہے اور پاپ اپ میں اس صفحے کا لنک ہوتا ہے۔",
      "اس صفحے کے اوپر Chrome بٹن سے آرکائیو ڈاؤن لوڈ کریں اور اسے اسی فولڈر میں ان زپ کریں جہاں پہلے کیا تھا، پرانی فائلوں کو تبدیل کرتے ہوئے۔",
      "ایکسٹینشنز کا صفحہ کھولیں (‎chrome://extensions، Yandex Browser میں ‎browser://extensions، ‎edge://extensions) اور “Reload” دبائیں — Videoner کارڈ پر گول تیر۔",
    ],
    back: "ہوم پیج",
  },
};
