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
      "Скачайте архив и распакуйте его — появится папка videoner-extension.",
      "Откройте страницу расширений: в адресной строке наберите chrome://extensions (в Edge — edge://extensions, в Opera — opera://extensions).",
      "Включите «Режим разработчика» — переключатель вверху страницы.",
      "Нажмите «Загрузить распакованное расширение» и выберите папку videoner-extension.",
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
      "Download the archive and unzip it — you'll get a videoner-extension folder.",
      "Open the extensions page: type chrome://extensions in the address bar (edge://extensions in Edge, opera://extensions in Opera).",
      "Turn on Developer mode — the switch at the top of the page.",
      "Click “Load unpacked” and choose the videoner-extension folder.",
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
      "Descarga el archivo y descomprímelo: obtendrás la carpeta videoner-extension.",
      "Abre la página de extensiones: escribe chrome://extensions en la barra de direcciones (edge://extensions en Edge, opera://extensions en Opera).",
      "Activa el Modo de desarrollador con el interruptor de la parte superior.",
      "Pulsa «Cargar descomprimida» y elige la carpeta videoner-extension.",
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
      "Завантажте архів і розпакуйте його — з'явиться папка videoner-extension.",
      "Відкрийте сторінку розширень: в адресному рядку введіть chrome://extensions (в Edge — edge://extensions, в Opera — opera://extensions).",
      "Увімкніть «Режим розробника» — перемикач угорі сторінки.",
      "Натисніть «Завантажити розпаковане розширення» й виберіть папку videoner-extension.",
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
};
