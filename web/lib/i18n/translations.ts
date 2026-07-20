// Лёгкий клиентский i18n. Словари для трёх языков; английский — источник истины
// (тип Translations выводится из него, поэтому es/ru обязаны иметь те же ключи).
import { Platform } from "@/types";

export const LANGUAGES = ["en", "es", "ru"] as const;
export type Language = (typeof LANGUAGES)[number];

export const LANGUAGE_LABELS: Record<Language, string> = {
  en: "English",
  es: "Español",
  ru: "Русский",
};

type PlatformStrings = {
  description: string;
  news: string;
  titleLine1: string;
  titleLine2: string;
  pageDescription: string;
  placeholder: string;
};

const en = {
  nav: {
    home: "Home",
    downloaders: "Downloaders",
    switchTheme: "Switch theme",
    language: "Language",
    comingSoon: "Coming Soon",
  },
  theme: {
    light: "Light",
    dark: "Dark",
    system: "System",
  },
  footer: {
    botCta: "Also available as a Telegram bot:",
    developedBy: "Developed by",
    rights: "All rights reserved.",
  },
  home: {
    new: "New",
    manyFeatures: "Many new features",
    titleLine1: "Download Videos",
    titleLine2: "Fast & Easy",
    subtitle:
      "Your universal video downloader for YouTube, Instagram, TikTok, and more. Choose any quality, from HD to mobile-friendly.",
    subtitleExtra: "No limits, no hassle, just downloads.",
    placeholder: "Paste video URL from any platform...",
    download: "Download",
  },
  video: {
    description: "Description",
    format: "Format",
    selected: "Selected: {quality}",
    videoTab: "video",
    audioTab: "audio",
    converting: "Converting",
    downloading: "Downloading",
    downloadAgain: "Download Again",
    startDownload: "Start Download",
    convertingBtn: "Converting...",
    downloadingBtn: "Downloading...",
  },
  toast: {
    enterUrl: "Please enter a URL",
    enterValidUrl: "Please enter a valid URL",
    platformNotSupported: "This platform is not supported",
    urlNotSupported: "This URL is not supported",
    enterValidPlatformUrl: "Please enter a valid {platform} URL",
    comingSoon: "Coming soon! {name} is not supported yet",
    selectQuality: "Please select a quality",
    downloadStarted: "Download started!",
    downloadCompleted: "Download completed!",
    downloadUrlNotReceived: "Download URL not received",
  },
  platforms: {
    youtube: {
      description: "Download videos from YouTube in HD quality",
      news: "Now with videos and shorts support",
      titleLine1: "Download YouTube",
      titleLine2: "Videos & Shorts",
      pageDescription:
        "Download YouTube videos, Shorts, and audio in high quality formats. Fast, free, and easy to use. Support for 8K, 4K, HD quality and MP3 audio.",
      placeholder: "Paste YouTube URL here...",
    },
    facebook: {
      description: "Save videos from Facebook posts and reels",
      news: "Now with reels support",
      titleLine1: "Download Facebook",
      titleLine2: "Videos & Reels",
      pageDescription:
        "Download Facebook videos and reels in high quality. Fast, free, and easy to use.",
      placeholder: "Paste Facebook URL here...",
    },
    instagram: {
      description: "Download Instagram reels, stories, and posts",
      news: "Now with reels and stories support",
      titleLine1: "Download Instagram",
      titleLine2: "Reels & Stories",
      pageDescription:
        "Download Instagram reels, stories, and posts in high quality. Fast, free, and easy to use.",
      placeholder: "Paste Instagram URL here...",
    },
    tiktok: {
      description: "Download TikTok videos without watermark",
      news: "Now without watermark",
      titleLine1: "Download TikTok",
      titleLine2: "Without Watermark",
      pageDescription:
        "Download TikTok videos without watermark in high quality. Fast, free, and easy to use.",
      placeholder: "Paste TikTok URL here...",
    },
    twitter: {
      description: "Download Twitter videos",
      news: "Now with Twitter video support",
      titleLine1: "Download Twitter",
      titleLine2: "Videos",
      pageDescription:
        "Download Twitter videos in high quality. Fast, free, and easy to use.",
      placeholder: "Paste Twitter URL here...",
    },
  } satisfies Record<Platform, PlatformStrings>,
};

export type Translations = typeof en;

const es: Translations = {
  nav: {
    home: "Inicio",
    downloaders: "Descargadores",
    switchTheme: "Cambiar tema",
    language: "Idioma",
    comingSoon: "Próximamente",
  },
  theme: {
    light: "Claro",
    dark: "Oscuro",
    system: "Sistema",
  },
  footer: {
    botCta: "También disponible como bot de Telegram:",
    developedBy: "Desarrollado por",
    rights: "Todos los derechos reservados.",
  },
  home: {
    new: "Nuevo",
    manyFeatures: "Muchas funciones nuevas",
    titleLine1: "Descarga Videos",
    titleLine2: "Rápido y Fácil",
    subtitle:
      "Tu descargador universal de videos para YouTube, Instagram, TikTok y más. Elige cualquier calidad, desde HD hasta compatible con móviles.",
    subtitleExtra: "Sin límites, sin complicaciones, solo descargas.",
    placeholder: "Pega la URL del video de cualquier plataforma...",
    download: "Descargar",
  },
  video: {
    description: "Descripción",
    format: "Formato",
    selected: "Seleccionado: {quality}",
    videoTab: "video",
    audioTab: "audio",
    converting: "Convirtiendo",
    downloading: "Descargando",
    downloadAgain: "Descargar de nuevo",
    startDownload: "Iniciar descarga",
    convertingBtn: "Convirtiendo...",
    downloadingBtn: "Descargando...",
  },
  toast: {
    enterUrl: "Por favor, introduce una URL",
    enterValidUrl: "Por favor, introduce una URL válida",
    platformNotSupported: "Esta plataforma no es compatible",
    urlNotSupported: "Esta URL no es compatible",
    enterValidPlatformUrl: "Por favor, introduce una URL válida de {platform}",
    comingSoon: "¡Próximamente! {name} aún no es compatible",
    selectQuality: "Por favor, selecciona una calidad",
    downloadStarted: "¡Descarga iniciada!",
    downloadCompleted: "¡Descarga completada!",
    downloadUrlNotReceived: "No se recibió la URL de descarga",
  },
  platforms: {
    youtube: {
      description: "Descarga videos de YouTube en calidad HD",
      news: "Ahora con soporte para videos y shorts",
      titleLine1: "Descarga YouTube",
      titleLine2: "Videos y Shorts",
      pageDescription:
        "Descarga videos, Shorts y audio de YouTube en formatos de alta calidad. Rápido, gratis y fácil de usar. Compatible con calidad 8K, 4K, HD y audio MP3.",
      placeholder: "Pega la URL de YouTube aquí...",
    },
    facebook: {
      description: "Guarda videos de publicaciones y reels de Facebook",
      news: "Ahora con soporte para reels",
      titleLine1: "Descarga Facebook",
      titleLine2: "Videos y Reels",
      pageDescription:
        "Descarga videos y reels de Facebook en alta calidad. Rápido, gratis y fácil de usar.",
      placeholder: "Pega la URL de Facebook aquí...",
    },
    instagram: {
      description: "Descarga reels, historias y publicaciones de Instagram",
      news: "Ahora con soporte para reels e historias",
      titleLine1: "Descarga Instagram",
      titleLine2: "Reels e Historias",
      pageDescription:
        "Descarga reels, historias y publicaciones de Instagram en alta calidad. Rápido, gratis y fácil de usar.",
      placeholder: "Pega la URL de Instagram aquí...",
    },
    tiktok: {
      description: "Descarga videos de TikTok sin marca de agua",
      news: "Ahora sin marca de agua",
      titleLine1: "Descarga TikTok",
      titleLine2: "Sin Marca de Agua",
      pageDescription:
        "Descarga videos de TikTok sin marca de agua en alta calidad. Rápido, gratis y fácil de usar.",
      placeholder: "Pega la URL de TikTok aquí...",
    },
    twitter: {
      description: "Descarga videos de Twitter",
      news: "Ahora con soporte para videos de Twitter",
      titleLine1: "Descarga Twitter",
      titleLine2: "Videos",
      pageDescription:
        "Descarga videos de Twitter en alta calidad. Rápido, gratis y fácil de usar.",
      placeholder: "Pega la URL de Twitter aquí...",
    },
  },
};

const ru: Translations = {
  nav: {
    home: "Главная",
    downloaders: "Загрузчики",
    switchTheme: "Сменить тему",
    language: "Язык",
    comingSoon: "Скоро",
  },
  theme: {
    light: "Светлая",
    dark: "Тёмная",
    system: "Системная",
  },
  footer: {
    botCta: "Также доступен в виде Telegram-бота:",
    developedBy: "Разработано",
    rights: "Все права защищены.",
  },
  home: {
    new: "Новое",
    manyFeatures: "Много новых функций",
    titleLine1: "Скачивайте видео",
    titleLine2: "Быстро и легко",
    subtitle:
      "Ваш универсальный загрузчик видео для YouTube, Instagram, TikTok и других платформ. Выбирайте любое качество — от HD до мобильного.",
    subtitleExtra: "Без ограничений, без хлопот — просто скачивайте.",
    placeholder: "Вставьте ссылку на видео с любой платформы...",
    download: "Скачать",
  },
  video: {
    description: "Описание",
    format: "Формат",
    selected: "Выбрано: {quality}",
    videoTab: "видео",
    audioTab: "аудио",
    converting: "Конвертация",
    downloading: "Загрузка",
    downloadAgain: "Скачать снова",
    startDownload: "Начать загрузку",
    convertingBtn: "Конвертация...",
    downloadingBtn: "Загрузка...",
  },
  toast: {
    enterUrl: "Пожалуйста, введите ссылку",
    enterValidUrl: "Пожалуйста, введите корректную ссылку",
    platformNotSupported: "Эта платформа не поддерживается",
    urlNotSupported: "Эта ссылка не поддерживается",
    enterValidPlatformUrl: "Пожалуйста, введите корректную ссылку {platform}",
    comingSoon: "Скоро! {name} пока не поддерживается",
    selectQuality: "Пожалуйста, выберите качество",
    downloadStarted: "Загрузка началась!",
    downloadCompleted: "Загрузка завершена!",
    downloadUrlNotReceived: "Ссылка на загрузку не получена",
  },
  platforms: {
    youtube: {
      description: "Скачивайте видео с YouTube в HD-качестве",
      news: "Теперь с поддержкой видео и Shorts",
      titleLine1: "Скачать с YouTube",
      titleLine2: "Видео и Shorts",
      pageDescription:
        "Скачивайте видео, Shorts и аудио с YouTube в высоком качестве. Быстро, бесплатно и просто. Поддержка 8K, 4K, HD и аудио MP3.",
      placeholder: "Вставьте ссылку YouTube сюда...",
    },
    facebook: {
      description: "Сохраняйте видео из постов и Reels Facebook",
      news: "Теперь с поддержкой Reels",
      titleLine1: "Скачать с Facebook",
      titleLine2: "Видео и Reels",
      pageDescription:
        "Скачивайте видео и Reels из Facebook в высоком качестве. Быстро, бесплатно и просто.",
      placeholder: "Вставьте ссылку Facebook сюда...",
    },
    instagram: {
      description: "Скачивайте Reels, истории и посты Instagram",
      news: "Теперь с поддержкой Reels и историй",
      titleLine1: "Скачать с Instagram",
      titleLine2: "Reels и истории",
      pageDescription:
        "Скачивайте Reels, истории и посты Instagram в высоком качестве. Быстро, бесплатно и просто.",
      placeholder: "Вставьте ссылку Instagram сюда...",
    },
    tiktok: {
      description: "Скачивайте видео TikTok без водяного знака",
      news: "Теперь без водяного знака",
      titleLine1: "Скачать с TikTok",
      titleLine2: "Без водяного знака",
      pageDescription:
        "Скачивайте видео TikTok без водяного знака в высоком качестве. Быстро, бесплатно и просто.",
      placeholder: "Вставьте ссылку TikTok сюда...",
    },
    twitter: {
      description: "Скачивайте видео из Twitter",
      news: "Теперь с поддержкой видео Twitter",
      titleLine1: "Скачать с Twitter",
      titleLine2: "Видео",
      pageDescription:
        "Скачивайте видео из Twitter в высоком качестве. Быстро, бесплатно и просто.",
      placeholder: "Вставьте ссылку Twitter сюда...",
    },
  },
};

export const translations: Record<Language, Translations> = { en, es, ru };
