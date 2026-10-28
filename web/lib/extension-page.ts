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
  download: string;
  version: string;
  browsersTitle: string;
  browsers: string;
  mobile: string;
  privacyTitle: string;
  privacy: string;
  stepsTitle: string;
  steps: string[];
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
    download: "Скачать расширение (.zip)",
    version: "Версия",
    browsersTitle: "Где работает",
    browsers:
      "Google Chrome, Яндекс Браузер, Microsoft Edge, Opera, Brave, Vivaldi и другие браузеры на основе Chromium — на компьютере.",
    mobile: "На телефонах и планшетах расширения не поддерживаются — там скачивайте через сайт или Telegram-бот.",
    privacyTitle: "Ваш вход остаётся у вас",
    privacy:
      "Расширение не спрашивает пароль и не передаёт куки: запрос к площадке делает ваш собственный браузер. Нашему серверу уходит только короткий отчёт для статистики — ссылка, размер файла и название.",
    stepsTitle: "Как установить",
    steps: [
      "Скачайте архив и распакуйте его — появится папка videoner-extension.",
      "Откройте страницу расширений: в адресной строке наберите chrome://extensions (в Edge — edge://extensions, в Opera — opera://extensions).",
      "Включите «Режим разработчика» — переключатель вверху страницы.",
      "Нажмите «Загрузить распакованное расширение» и выберите папку videoner-extension.",
      "Готово: на странице видео появится кнопка «Скачать», а значок Videoner — на панели браузера.",
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
    download: "Download the extension (.zip)",
    version: "Version",
    browsersTitle: "Where it works",
    browsers:
      "Google Chrome, Yandex Browser, Microsoft Edge, Opera, Brave, Vivaldi and other Chromium-based browsers — on a computer.",
    mobile: "Phones and tablets don't support extensions — use the website or the Telegram bot there.",
    privacyTitle: "Your sign-in stays with you",
    privacy:
      "The extension never asks for a password and never sends cookies: your own browser makes the request to the platform. Our server only gets a short report for statistics — the link, file size and title.",
    stepsTitle: "How to install",
    steps: [
      "Download the archive and unzip it — you'll get a videoner-extension folder.",
      "Open the extensions page: type chrome://extensions in the address bar (edge://extensions in Edge, opera://extensions in Opera).",
      "Turn on Developer mode — the switch at the top of the page.",
      "Click “Load unpacked” and choose the videoner-extension folder.",
      "Done: video pages get a Download button, and the Videoner icon appears in the browser toolbar.",
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
    download: "Descargar la extensión (.zip)",
    version: "Versión",
    browsersTitle: "Dónde funciona",
    browsers:
      "Google Chrome, Yandex Browser, Microsoft Edge, Opera, Brave, Vivaldi y otros navegadores basados en Chromium, en un ordenador.",
    mobile: "Los teléfonos y tabletas no admiten extensiones: allí usa el sitio web o el bot de Telegram.",
    privacyTitle: "Tu sesión se queda contigo",
    privacy:
      "La extensión nunca pide contraseñas ni envía cookies: la solicitud a la plataforma la hace tu propio navegador. Nuestro servidor solo recibe un breve informe para estadísticas: el enlace, el tamaño del archivo y el título.",
    stepsTitle: "Cómo instalarla",
    steps: [
      "Descarga el archivo y descomprímelo: obtendrás la carpeta videoner-extension.",
      "Abre la página de extensiones: escribe chrome://extensions en la barra de direcciones (edge://extensions en Edge, opera://extensions en Opera).",
      "Activa el Modo de desarrollador con el interruptor de la parte superior.",
      "Pulsa «Cargar descomprimida» y elige la carpeta videoner-extension.",
      "Listo: las páginas de video tendrán un botón Descargar y el icono de Videoner aparecerá en la barra del navegador.",
    ],
    back: "Inicio",
  },
};
