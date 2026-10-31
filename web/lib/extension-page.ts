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
};
