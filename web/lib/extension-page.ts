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
      "Расширение не спрашивает пароль и не передаёт куки: запрос к площадке делает ваш собственный браузер. Нашему серверу уходит только короткий отчёт для статистики — ссылка, размер файла и название.",
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
      "The extension never asks for a password and never sends cookies: your own browser makes the request to the platform. Our server only gets a short report for statistics — the link, file size and title.",
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
      "La extensión nunca pide contraseñas ni envía cookies: la solicitud a la plataforma la hace tu propio navegador. Nuestro servidor solo recibe un breve informe para estadísticas: el enlace, el tamaño del archivo y el título.",
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
    back: "Inicio",
  },
};
