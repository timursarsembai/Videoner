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
  howTo: string[];
  faq: { q: string; a: string }[];
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
  content: {
    howToTitle: "How to Download {platform} Videos",
    faqTitle: "Frequently Asked Questions",
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
    captchaNotReady: "Please wait a moment for the security check to finish, then try again",
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
      howTo: [
        "Copy the video link from your browser's address bar, or tap Share on the YouTube app.",
        "Paste it into the box above and press Download.",
        "Pick a quality — up to 4K/8K for video, or MP3 for audio only.",
        "Your file starts downloading immediately, no sign-in required.",
      ],
      faq: [
        { q: "Is downloading YouTube videos with Videoner free?", a: "Yes, downloading through the website is completely free, no account required." },
        { q: "What video quality can I download?", a: "Videoner offers every resolution YouTube provides for that video — from 360p up to 4K/8K where available — plus MP3 audio extraction." },
        { q: "Can I download private or age-restricted videos?", a: "Only publicly accessible YouTube videos are supported; private, unlisted-to-you, or login-required content can't be downloaded." },
        { q: "Is it legal to download videos from YouTube?", a: "Download only videos you have the right to save — your own content, Creative Commons–licensed videos, or anything the creator allows. Respect YouTube's Terms of Service and copyright law." },
        { q: "How long is my downloaded file available?", a: "Converted files stay on the server for about an hour, so save them to your device right after downloading." },
      ],
    },
    facebook: {
      description: "Save videos from Facebook posts and reels",
      news: "Now with reels support",
      titleLine1: "Download Facebook",
      titleLine2: "Videos & Reels",
      pageDescription:
        "Download Facebook videos and reels in high quality. Fast, free, and easy to use.",
      placeholder: "Paste Facebook URL here...",
      howTo: [
        "Open the video or reel on Facebook and copy its link (tap the three dots → Copy Link).",
        "Paste the link above and hit Download.",
        "Choose MP4 quality or extract the audio as MP3.",
        "The file downloads straight to your device — no Facebook account needed.",
      ],
      faq: [
        { q: "Is downloading Facebook videos with Videoner free?", a: "Yes, no account or payment needed on the website." },
        { q: "What video quality can I download?", a: "Videoner grabs the highest quality Facebook provides for that video or reel, in MP4, plus an MP3 audio option." },
        { q: "Can I download private videos?", a: "Only public posts, videos, and reels work — private or friends-only content isn't accessible." },
        { q: "Is it legal to download videos from Facebook?", a: "Only download videos you have permission to save; respect the creator's rights and Facebook's Terms of Service." },
        { q: "How long is my downloaded file available?", a: "Files are kept for about an hour after conversion, then automatically removed — download promptly." },
      ],
    },
    instagram: {
      description: "Download Instagram reels, stories, and posts",
      news: "Now with reels and stories support",
      titleLine1: "Download Instagram",
      titleLine2: "Reels & Stories",
      pageDescription:
        "Download Instagram reels, stories, and posts in high quality. Fast, free, and easy to use.",
      placeholder: "Paste Instagram URL here...",
      howTo: [
        "Open the Reel, post, or story on Instagram and tap the paper-plane icon → Copy Link.",
        "Paste the link into the box above.",
        "Select your preferred quality and format.",
        "Download starts instantly — no login or app installation required.",
      ],
      faq: [
        { q: "Is downloading Instagram content with Videoner free?", a: "Yes, completely free through the website." },
        { q: "What video quality can I download?", a: "Full available quality for reels, posts, and stories, in MP4 or MP3." },
        { q: "Can I download from private accounts?", a: "Only public Instagram accounts and posts are supported; private-account content can't be downloaded." },
        { q: "Is it legal to download videos from Instagram?", a: "Download only what you're allowed to save — respect the creator and Instagram's Terms of Service." },
        { q: "How long is my downloaded file available?", a: "Files live on the server for about an hour before automatic deletion." },
      ],
    },
    tiktok: {
      description: "Download TikTok videos without watermark",
      news: "Now without watermark",
      titleLine1: "Download TikTok",
      titleLine2: "Without Watermark",
      pageDescription:
        "Download TikTok videos without watermark in high quality. Fast, free, and easy to use.",
      placeholder: "Paste TikTok URL here...",
      howTo: [
        "Tap Share on the TikTok video, then Copy Link.",
        "Paste the link above and press Download.",
        "Get the clean MP4 — no TikTok watermark — or the MP3 audio.",
        "Save it straight to your device.",
      ],
      faq: [
        { q: "Is downloading TikTok videos with Videoner free?", a: "Yes, no account needed." },
        { q: "What video quality can I download?", a: "The best quality TikTok provides for that video, without the TikTok watermark, plus MP3 audio." },
        { q: "Can I download from private accounts?", a: "Only videos from public TikTok accounts can be downloaded." },
        { q: "Is it legal to download videos from TikTok?", a: "Download videos you have the right to save, credit the creator, and respect TikTok's Terms of Service." },
        { q: "How long is my downloaded file available?", a: "Downloaded files stay on the server roughly an hour, then get deleted automatically." },
      ],
    },
    twitter: {
      description: "Download Twitter videos",
      news: "Now with Twitter video support",
      titleLine1: "Download Twitter",
      titleLine2: "Videos",
      pageDescription:
        "Download Twitter videos in high quality. Fast, free, and easy to use.",
      placeholder: "Paste Twitter URL here...",
      howTo: [
        "Tap Share under the tweet and choose Copy Link (or copy the URL from your browser).",
        "Paste it into the box above.",
        "Pick the video quality you want.",
        "Download begins right away — no X/Twitter account needed.",
      ],
      faq: [
        { q: "Is downloading Twitter/X videos with Videoner free?", a: "Yes, free and no account required." },
        { q: "What video quality can I download?", a: "Every quality X/Twitter offers for that video, in MP4, plus MP3." },
        { q: "Can I download from private accounts?", a: "Only tweets from public accounts work; protected/private accounts aren't supported." },
        { q: "Is it legal to download videos from Twitter/X?", a: "Download content you have the right to save, respecting the poster's rights and the platform's Terms of Service." },
        { q: "How long is my downloaded file available?", a: "Files are removed automatically about an hour after they're generated." },
      ],
    },
    vimeo: {
      description: "Download videos from Vimeo in high quality",
      news: "Now with Vimeo support",
      titleLine1: "Download Vimeo",
      titleLine2: "Videos",
      pageDescription:
        "Download Vimeo videos in high quality. Fast, free, and easy to use.",
      placeholder: "Paste Vimeo URL here...",
      howTo: [
        "Open Vimeo and copy the video link (or tap Share → Copy Link on mobile).",
        "Paste the link into the box above and hit Download.",
        "Pick a quality and format — MP4 for video, MP3 if you just want the audio.",
        "Your download starts immediately; no account or software install needed.",
      ],
      faq: [
        { q: "Is downloading Vimeo videos with Videoner free?", a: "Yes — downloading through the website doesn't cost anything or require an account." },
        { q: "What video quality can I download?", a: "Videoner offers every quality Vimeo makes available for that video, up to the original upload resolution, including HD and 4K where the creator provided it." },
        { q: "Can I download private or password-protected Vimeo videos?", a: "No — Videoner only works with publicly accessible Vimeo links. Private, password-protected, or restricted-access videos can't be downloaded." },
        { q: "Is it legal to download videos from Vimeo?", a: "Downloading is meant for videos you have the right to save — your own content, Creative Commons–licensed videos, or anything the creator has explicitly allowed for download. Respect the original creator's copyright and Vimeo's terms of service." },
        { q: "How long is my downloaded file available?", a: "Files are generated on demand and kept on the server for about an hour before being automatically deleted, so save it to your device right after the download finishes." },
      ],
    },
    vk: {
      description: "Download videos and clips from VK",
      news: "Now with VK support",
      titleLine1: "Download VK",
      titleLine2: "Videos & Clips",
      pageDescription:
        "Download VK videos and clips in high quality. Fast, free, and easy to use.",
      placeholder: "Paste VK URL here...",
      howTo: [
        "Open the video or clip on VK (vk.com or VK Video) and copy its link from the address bar or the Share button.",
        "Paste the link above and press Download.",
        "Choose the available quality and format.",
        "The file downloads directly — you don't need to be logged in to VK.",
      ],
      faq: [
        { q: "Is downloading VK videos with Videoner free?", a: "Yes, downloading via the website costs nothing." },
        { q: "What video quality can I download?", a: "All qualities VK provides for that video or clip, plus MP3 audio." },
        { q: "Do I need to log in to VK?", a: "No — the video must be public. Videoner doesn't log in to VK, so private, friends-only, or login-required videos can't be downloaded." },
        { q: "Is it legal to download videos from VK?", a: "Only download videos you have the right to save, respecting VK's Terms of Service and the uploader's rights." },
        { q: "How long is my downloaded file available?", a: "Files are kept about an hour on the server, then deleted automatically." },
      ],
    },
    rutube: {
      description: "Download videos from Rutube",
      news: "Now with Rutube support",
      titleLine1: "Download Rutube",
      titleLine2: "Videos",
      pageDescription:
        "Download Rutube videos in high quality. Fast, free, and easy to use.",
      placeholder: "Paste Rutube URL here...",
      howTo: [
        "Open the video on Rutube and copy its link from the address bar or the Share button.",
        "Paste it into the box above.",
        "Select quality and format (video or audio).",
        "Download starts right away, no Rutube account required.",
      ],
      faq: [
        { q: "Is downloading Rutube videos with Videoner free?", a: "Yes, no cost or account needed." },
        { q: "What video quality can I download?", a: "Every quality Rutube offers, in MP4, plus MP3 audio." },
        { q: "Do I need to log in to Rutube?", a: "No — Videoner works only with publicly available Rutube videos; no login is used or required." },
        { q: "Is it legal to download videos from Rutube?", a: "Download only content you're allowed to save, respecting Rutube's Terms of Service and the creator's rights." },
        { q: "How long is my downloaded file available?", a: "Files stay on the server for about an hour before automatic removal." },
      ],
    },
    okru: {
      description: "Download videos from OK.ru (Odnoklassniki)",
      news: "Now with OK.ru support",
      titleLine1: "Download OK.ru",
      titleLine2: "Videos",
      pageDescription:
        "Download OK.ru (Odnoklassniki) videos in high quality. Fast, free, and easy to use.",
      placeholder: "Paste OK.ru URL here...",
      howTo: [
        "Open the video on OK.ru (Odnoklassniki) and copy its link from the address bar.",
        "Paste the link into the box above and hit Download.",
        "Choose your quality and format.",
        "The download begins immediately — no OK.ru login needed.",
      ],
      faq: [
        { q: "Is downloading OK.ru videos with Videoner free?", a: "Yes, completely free." },
        { q: "What video quality can I download?", a: "Full quality range OK.ru provides for that video, plus MP3." },
        { q: "Do I need to log in to OK.ru?", a: "No — only public OK.ru (Odnoklassniki) videos work. Videoner never logs into an account, so private videos aren't accessible." },
        { q: "Is it legal to download videos from OK.ru?", a: "Only download videos you have the right to save, respecting OK.ru's Terms of Service and the uploader's rights." },
        { q: "How long is my downloaded file available?", a: "Files are automatically deleted roughly an hour after being generated." },
      ],
    },
    pinterest: {
      description: "Download videos from Pinterest pins",
      news: "Now with Pinterest support",
      titleLine1: "Download Pinterest",
      titleLine2: "Videos & Pins",
      pageDescription:
        "Download videos from Pinterest pins in high quality. Fast, free, and easy to use. Note: only video pins can be downloaded — photo-only pins aren't supported.",
      placeholder: "Paste Pinterest URL here...",
      howTo: [
        "Open the pin on Pinterest and tap Share → Copy Link (or copy the URL from your browser).",
        "Paste the link into the box above and press Download.",
        "Choose your preferred quality and format.",
        "Your file downloads immediately — no account needed.",
      ],
      faq: [
        { q: "Is downloading Pinterest videos with Videoner free?", a: "Yes, downloading through the website is completely free, no account required." },
        { q: "What quality can I download?", a: "Videoner offers every quality Pinterest provides for that pin's video, plus MP3 audio extraction." },
        { q: "Can I download photos or images from Pinterest?", a: "No — only video pins can be downloaded. If a pin is photo-only, there's no video file to extract." },
        { q: "Can I download private or board-restricted pins?", a: "Only publicly accessible pins are supported; private boards and login-restricted content can't be downloaded." },
        { q: "Is it legal to download videos from Pinterest?", a: "Download only pins you have the right to save — your own content or anything the creator allows. Respect Pinterest's Terms of Service and copyright law." },
        { q: "How long is my downloaded file available?", a: "Converted files stay on the server for about an hour, so save them to your device right after downloading." },
      ],
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
  content: {
    howToTitle: "Cómo descargar videos de {platform}",
    faqTitle: "Preguntas frecuentes",
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
    captchaNotReady: "Espera un momento a que termine la verificación de seguridad e inténtalo de nuevo",
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
      howTo: [
        "Copia el enlace del video desde la barra de direcciones o usa el botón «Compartir» en la app de YouTube.",
        "Pégalo en el campo de arriba y pulsa «Descargar».",
        "Elige la calidad — hasta 4K/8K para video, o MP3 solo para audio.",
        "La descarga empieza al instante, sin necesidad de iniciar sesión.",
      ],
      faq: [
        { q: "¿Es gratis descargar videos de YouTube con Videoner?", a: "Sí, descargar desde el sitio web es completamente gratuito, no se necesita cuenta." },
        { q: "¿Qué calidad de video puedo descargar?", a: "Videoner ofrece todas las calidades disponibles para ese video en YouTube, desde 360p hasta 4K/8K si están disponibles, además de extracción de audio en MP3." },
        { q: "¿Puedo descargar videos privados o con restricción de edad?", a: "Solo se admiten videos públicos de YouTube; los videos privados o que requieran inicio de sesión no se pueden descargar." },
        { q: "¿Es legal descargar videos de YouTube?", a: "Descarga solo videos que tengas derecho a guardar — tu propio contenido, videos con licencia Creative Commons o lo que el creador permita. Respeta los Términos de Servicio de YouTube y los derechos de autor." },
        { q: "¿Cuánto tiempo está disponible mi archivo descargado?", a: "El archivo permanece en el servidor cerca de una hora, así que guárdalo en tu dispositivo justo después de la descarga." },
      ],
    },
    facebook: {
      description: "Guarda videos de publicaciones y reels de Facebook",
      news: "Ahora con soporte para reels",
      titleLine1: "Descarga Facebook",
      titleLine2: "Videos y Reels",
      pageDescription:
        "Descarga videos y reels de Facebook en alta calidad. Rápido, gratis y fácil de usar.",
      placeholder: "Pega la URL de Facebook aquí...",
      howTo: [
        "Abre el video o reel en Facebook y copia su enlace (los tres puntos → «Copiar enlace»).",
        "Pega el enlace arriba y pulsa «Descargar».",
        "Elige la calidad en MP4 o extrae el audio en MP3.",
        "El archivo se descarga directo a tu dispositivo, sin necesidad de cuenta de Facebook.",
      ],
      faq: [
        { q: "¿Es gratis descargar videos de Facebook con Videoner?", a: "Sí, no se necesita cuenta ni pago en el sitio web." },
        { q: "¿Qué calidad de video puedo descargar?", a: "Videoner obtiene la mejor calidad disponible para ese video o reel, en MP4, además de la opción de audio MP3." },
        { q: "¿Puedo descargar videos privados?", a: "Solo funcionan publicaciones, videos y reels públicos; el contenido privado o solo para amigos no es accesible." },
        { q: "¿Es legal descargar videos de Facebook?", a: "Descarga solo videos que tengas permiso de guardar; respeta los derechos del creador y los Términos de Servicio de Facebook." },
        { q: "¿Cuánto tiempo está disponible mi archivo descargado?", a: "Los archivos se conservan cerca de una hora tras la conversión y luego se eliminan automáticamente — descarga a tiempo." },
      ],
    },
    instagram: {
      description: "Descarga reels, historias y publicaciones de Instagram",
      news: "Ahora con soporte para reels e historias",
      titleLine1: "Descarga Instagram",
      titleLine2: "Reels e Historias",
      pageDescription:
        "Descarga reels, historias y publicaciones de Instagram en alta calidad. Rápido, gratis y fácil de usar.",
      placeholder: "Pega la URL de Instagram aquí...",
      howTo: [
        "Abre el reel, publicación o historia en Instagram y toca el ícono de avión de papel → «Copiar enlace».",
        "Pega el enlace en el campo de arriba.",
        "Elige la calidad y el formato que prefieras.",
        "La descarga empieza al instante, sin inicio de sesión ni instalar apps.",
      ],
      faq: [
        { q: "¿Es gratis descargar contenido de Instagram con Videoner?", a: "Sí, completamente gratis desde el sitio web." },
        { q: "¿Qué calidad de video puedo descargar?", a: "Toda la calidad disponible para reels, publicaciones e historias, en MP4 o MP3." },
        { q: "¿Puedo descargar de cuentas privadas?", a: "Solo se admiten cuentas y publicaciones públicas de Instagram; el contenido de cuentas privadas no se puede descargar." },
        { q: "¿Es legal descargar videos de Instagram?", a: "Descarga solo lo que tengas permitido guardar — respeta al creador y los Términos de Servicio de Instagram." },
        { q: "¿Cuánto tiempo está disponible mi archivo descargado?", a: "Los archivos permanecen en el servidor cerca de una hora antes de eliminarse automáticamente." },
      ],
    },
    tiktok: {
      description: "Descarga videos de TikTok sin marca de agua",
      news: "Ahora sin marca de agua",
      titleLine1: "Descarga TikTok",
      titleLine2: "Sin Marca de Agua",
      pageDescription:
        "Descarga videos de TikTok sin marca de agua en alta calidad. Rápido, gratis y fácil de usar.",
      placeholder: "Pega la URL de TikTok aquí...",
      howTo: [
        "Toca «Compartir» en el video de TikTok y luego «Copiar enlace».",
        "Pega el enlace arriba y pulsa «Descargar».",
        "Obtén el MP4 limpio, sin marca de agua de TikTok, o el audio en MP3.",
        "Guarda el archivo en tu dispositivo.",
      ],
      faq: [
        { q: "¿Es gratis descargar videos de TikTok con Videoner?", a: "Sí, no se necesita cuenta." },
        { q: "¿Qué calidad de video puedo descargar?", a: "La mejor calidad disponible para ese video en TikTok, sin marca de agua, además de MP3." },
        { q: "¿Puedo descargar de cuentas privadas?", a: "Solo se pueden descargar videos de cuentas públicas de TikTok." },
        { q: "¿Es legal descargar videos de TikTok?", a: "Descarga videos que tengas derecho a guardar, da crédito al creador y respeta los Términos de Servicio de TikTok." },
        { q: "¿Cuánto tiempo está disponible mi archivo descargado?", a: "Los archivos descargados permanecen en el servidor cerca de una hora y luego se eliminan automáticamente." },
      ],
    },
    twitter: {
      description: "Descarga videos de Twitter",
      news: "Ahora con soporte para videos de Twitter",
      titleLine1: "Descarga Twitter",
      titleLine2: "Videos",
      pageDescription:
        "Descarga videos de Twitter en alta calidad. Rápido, gratis y fácil de usar.",
      placeholder: "Pega la URL de Twitter aquí...",
      howTo: [
        "Toca «Compartir» debajo del tuit y elige «Copiar enlace» (o copia la URL desde el navegador).",
        "Pégalo en el campo de arriba.",
        "Elige la calidad de video que prefieras.",
        "La descarga comienza de inmediato, sin necesidad de cuenta de X/Twitter.",
      ],
      faq: [
        { q: "¿Es gratis descargar videos de Twitter/X con Videoner?", a: "Sí, gratis y sin necesidad de cuenta." },
        { q: "¿Qué calidad de video puedo descargar?", a: "Toda la calidad disponible para ese video en X/Twitter, en MP4, además de MP3." },
        { q: "¿Puedo descargar de cuentas privadas?", a: "Solo funcionan tuits de cuentas públicas; las cuentas protegidas (privadas) no son compatibles." },
        { q: "¿Es legal descargar videos de Twitter/X?", a: "Descarga contenido que tengas derecho a guardar, respetando al autor y los términos de la plataforma." },
        { q: "¿Cuánto tiempo está disponible mi archivo descargado?", a: "Los archivos se eliminan automáticamente cerca de una hora después de generarse." },
      ],
    },
    vimeo: {
      description: "Descarga videos de Vimeo en alta calidad",
      news: "Ahora con soporte para Vimeo",
      titleLine1: "Descarga Vimeo",
      titleLine2: "Videos",
      pageDescription:
        "Descarga videos de Vimeo en alta calidad. Rápido, gratis y fácil de usar.",
      placeholder: "Pega la URL de Vimeo aquí...",
      howTo: [
        "Abre Vimeo y copia el enlace del video (o toca «Compartir» → «Copiar enlace» en el móvil).",
        "Pégalo en el campo de arriba y pulsa «Descargar».",
        "Elige calidad y formato — MP4 para video, MP3 si solo quieres el audio.",
        "La descarga empieza de inmediato, sin cuenta ni instalar programas.",
      ],
      faq: [
        { q: "¿Es gratis descargar videos de Vimeo con Videoner?", a: "Sí, descargar desde el sitio web es gratis y sin cuenta." },
        { q: "¿Qué calidad de video puedo descargar?", a: "Videoner ofrece toda la calidad disponible para ese video en Vimeo, hasta la resolución original, incluyendo HD y 4K si están disponibles." },
        { q: "¿Puedo descargar videos privados o protegidos con contraseña?", a: "No — solo funcionan enlaces públicos de Vimeo; los videos privados, protegidos con contraseña o restringidos no se pueden descargar." },
        { q: "¿Es legal descargar videos de Vimeo?", a: "Descarga solo lo que tengas derecho a guardar — tu propio contenido, Creative Commons o lo que el creador permita. Respeta los derechos de autor y los Términos de Servicio de Vimeo." },
        { q: "¿Cuánto tiempo está disponible mi archivo descargado?", a: "El archivo permanece en el servidor cerca de una hora — guárdalo en tu dispositivo justo después de descargarlo." },
      ],
    },
    vk: {
      description: "Descarga videos y clips de VK",
      news: "Ahora con soporte para VK",
      titleLine1: "Descarga VK",
      titleLine2: "Videos y Clips",
      pageDescription:
        "Descarga videos y clips de VK en alta calidad. Rápido, gratis y fácil de usar.",
      placeholder: "Pega la URL de VK aquí...",
      howTo: [
        "Abre el video o clip en VK (vk.com o VK Video) y copia el enlace desde la barra de direcciones o el botón «Compartir».",
        "Pégalo arriba y pulsa «Descargar».",
        "Elige la calidad y el formato disponibles.",
        "El archivo se descarga directamente, sin necesidad de iniciar sesión en VK.",
      ],
      faq: [
        { q: "¿Es gratis descargar videos de VK con Videoner?", a: "Sí, descargar desde el sitio web no cuesta nada." },
        { q: "¿Qué calidad de video puedo descargar?", a: "Todas las calidades disponibles para ese video o clip en VK, además de audio en MP3." },
        { q: "¿Necesito iniciar sesión en VK?", a: "No — el video debe ser público. Videoner no inicia sesión en VK, así que los videos privados, solo para amigos o que requieran inicio de sesión no se pueden descargar." },
        { q: "¿Es legal descargar videos de VK?", a: "Descarga solo lo que tengas derecho a guardar, respetando los Términos de Servicio de VK y los derechos del autor." },
        { q: "¿Cuánto tiempo está disponible mi archivo descargado?", a: "Los archivos se conservan en el servidor cerca de una hora antes de eliminarse automáticamente." },
      ],
    },
    rutube: {
      description: "Descarga videos de Rutube",
      news: "Ahora con soporte para Rutube",
      titleLine1: "Descarga Rutube",
      titleLine2: "Videos",
      pageDescription:
        "Descarga videos de Rutube en alta calidad. Rápido, gratis y fácil de usar.",
      placeholder: "Pega la URL de Rutube aquí...",
      howTo: [
        "Abre el video en Rutube y copia el enlace desde la barra de direcciones o el botón «Compartir».",
        "Pégalo en el campo de arriba.",
        "Elige calidad y formato (video o audio).",
        "La descarga empieza de inmediato, sin necesidad de cuenta de Rutube.",
      ],
      faq: [
        { q: "¿Es gratis descargar videos de Rutube con Videoner?", a: "Sí, sin costo y sin cuenta." },
        { q: "¿Qué calidad de video puedo descargar?", a: "Todas las calidades disponibles para el video en Rutube, en MP4, además de MP3." },
        { q: "¿Necesito iniciar sesión en Rutube?", a: "No — Videoner solo funciona con videos públicamente disponibles en Rutube; no se usa ni se requiere inicio de sesión." },
        { q: "¿Es legal descargar videos de Rutube?", a: "Descarga solo contenido que tengas derecho a guardar, respetando los términos de Rutube y los derechos del creador." },
        { q: "¿Cuánto tiempo está disponible mi archivo descargado?", a: "Los archivos permanecen en el servidor cerca de una hora antes de eliminarse automáticamente." },
      ],
    },
    okru: {
      description: "Descarga videos de OK.ru (Odnoklassniki)",
      news: "Ahora con soporte para OK.ru",
      titleLine1: "Descarga OK.ru",
      titleLine2: "Videos",
      pageDescription:
        "Descarga videos de OK.ru (Odnoklassniki) en alta calidad. Rápido, gratis y fácil de usar.",
      placeholder: "Pega la URL de OK.ru aquí...",
      howTo: [
        "Abre el video en OK.ru (Odnoklassniki) y copia el enlace desde la barra de direcciones.",
        "Pega el enlace arriba y pulsa «Descargar».",
        "Elige calidad y formato.",
        "La descarga empieza de inmediato, sin iniciar sesión en OK.ru.",
      ],
      faq: [
        { q: "¿Es gratis descargar videos de OK.ru con Videoner?", a: "Sí, completamente gratis." },
        { q: "¿Qué calidad de video puedo descargar?", a: "Todo el rango de calidad disponible para el video en OK.ru, además de MP3." },
        { q: "¿Necesito iniciar sesión en OK.ru?", a: "No — solo funcionan videos públicos de OK.ru (Odnoklassniki). Videoner nunca inicia sesión en una cuenta, así que los videos privados no son accesibles." },
        { q: "¿Es legal descargar videos de OK.ru?", a: "Descarga solo lo que tengas derecho a guardar, respetando los términos de OK.ru y los derechos del autor." },
        { q: "¿Cuánto tiempo está disponible mi archivo descargado?", a: "Los archivos se eliminan automáticamente cerca de una hora después de generarse." },
      ],
    },
    pinterest: {
      description: "Descarga videos de los pines de Pinterest",
      news: "Ahora con soporte para Pinterest",
      titleLine1: "Descarga Pinterest",
      titleLine2: "Videos y Pines",
      pageDescription:
        "Descarga videos de pines de Pinterest en alta calidad. Rápido, gratis y fácil de usar. Nota: solo se pueden descargar pines de video — los pines que son solo foto no son compatibles.",
      placeholder: "Pega la URL de Pinterest aquí...",
      howTo: [
        "Abre el pin en Pinterest y toca «Compartir» → «Copiar enlace» (o copia la URL desde el navegador).",
        "Pega el enlace en el campo de arriba y pulsa «Descargar».",
        "Elige la calidad y el formato que prefieras.",
        "La descarga empieza de inmediato — no se necesita cuenta.",
      ],
      faq: [
        { q: "¿Es gratis descargar videos de Pinterest con Videoner?", a: "Sí, descargar desde el sitio web es completamente gratuito, no se necesita cuenta." },
        { q: "¿Qué calidad de video puedo descargar?", a: "Videoner ofrece todas las calidades disponibles para el video de ese pin, además de extracción de audio en MP3." },
        { q: "¿Puedo descargar fotos o imágenes de Pinterest?", a: "No — solo se pueden descargar pines de video. Si un pin es solo foto, no hay ningún archivo de video que extraer." },
        { q: "¿Puedo descargar pines privados o de tableros restringidos?", a: "Solo se admiten pines públicamente accesibles; los tableros privados y el contenido que requiere inicio de sesión no se pueden descargar." },
        { q: "¿Es legal descargar videos de Pinterest?", a: "Descarga solo pines que tengas derecho a guardar — tu propio contenido o lo que el creador permita. Respeta los Términos de Servicio de Pinterest y los derechos de autor." },
        { q: "¿Cuánto tiempo está disponible mi archivo descargado?", a: "El archivo permanece en el servidor cerca de una hora, así que guárdalo en tu dispositivo justo después de la descarga." },
      ],
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
  content: {
    howToTitle: "Как скачать видео с {platform}",
    faqTitle: "Часто задаваемые вопросы",
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
    captchaNotReady: "Подожди немного, пока пройдёт проверка безопасности, и попробуй снова",
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
      howTo: [
        "Скопируйте ссылку на видео из адресной строки браузера или через кнопку «Поделиться» в приложении YouTube.",
        "Вставьте ссылку в поле выше и нажмите «Скачать».",
        "Выберите качество — вплоть до 4K/8K для видео, или MP3 для аудио.",
        "Загрузка начнётся сразу, без входа в аккаунт.",
      ],
      faq: [
        { q: "Бесплатно ли скачивать видео с YouTube через Videoner?", a: "Да, скачивание через сайт полностью бесплатно, аккаунт не нужен." },
        { q: "В каком качестве можно скачать видео?", a: "Videoner предлагает все качества, доступные для этого видео на YouTube — от 360p до 4K/8K, если они есть, — плюс извлечение аудио в MP3." },
        { q: "Можно ли скачать приватные или возрастные видео?", a: "Поддерживаются только публично доступные видео с YouTube; приватные или требующие входа в аккаунт ролики скачать нельзя." },
        { q: "Законно ли скачивать видео с YouTube?", a: "Скачивайте только то, на что у вас есть право — свой контент, видео с лицензией Creative Commons или то, что разрешил автор. Соблюдайте условия использования YouTube и авторские права." },
        { q: "Как долго хранится скачанный файл?", a: "Готовый файл хранится на сервере около часа, поэтому сохраните его на устройство сразу после скачивания." },
      ],
    },
    facebook: {
      description: "Сохраняйте видео из постов и Reels Facebook",
      news: "Теперь с поддержкой Reels",
      titleLine1: "Скачать с Facebook",
      titleLine2: "Видео и Reels",
      pageDescription:
        "Скачивайте видео и Reels из Facebook в высоком качестве. Быстро, бесплатно и просто.",
      placeholder: "Вставьте ссылку Facebook сюда...",
      howTo: [
        "Откройте видео или Reels в Facebook и скопируйте ссылку (три точки → «Скопировать ссылку»).",
        "Вставьте ссылку выше и нажмите «Скачать».",
        "Выберите качество MP4 или извлеките аудио в MP3.",
        "Файл сразу загрузится на устройство — аккаунт Facebook не требуется.",
      ],
      faq: [
        { q: "Бесплатно ли скачивать видео с Facebook через Videoner?", a: "Да, ни аккаунт, ни оплата на сайте не нужны." },
        { q: "В каком качестве можно скачать видео?", a: "Videoner берёт максимальное качество, доступное для этого видео или Reels, в MP4, плюс аудио в MP3." },
        { q: "Можно ли скачать приватные видео?", a: "Работают только публичные посты, видео и Reels — приватный контент или «только для друзей» недоступен." },
        { q: "Законно ли скачивать видео с Facebook?", a: "Скачивайте только то, на что у вас есть разрешение, уважайте права автора и условия Facebook." },
        { q: "Как долго хранится скачанный файл?", a: "Файлы хранятся около часа после конвертации, затем автоматически удаляются — скачивайте вовремя." },
      ],
    },
    instagram: {
      description: "Скачивайте Reels, истории и посты Instagram",
      news: "Теперь с поддержкой Reels и историй",
      titleLine1: "Скачать с Instagram",
      titleLine2: "Reels и истории",
      pageDescription:
        "Скачивайте Reels, истории и посты Instagram в высоком качестве. Быстро, бесплатно и просто.",
      placeholder: "Вставьте ссылку Instagram сюда...",
      howTo: [
        "Откройте Reels, пост или историю в Instagram и нажмите на значок «бумажный самолётик» → «Скопировать ссылку».",
        "Вставьте ссылку в поле выше.",
        "Выберите нужное качество и формат.",
        "Загрузка начнётся мгновенно — вход в аккаунт и установка приложений не нужны.",
      ],
      faq: [
        { q: "Бесплатно ли скачивать контент Instagram через Videoner?", a: "Да, полностью бесплатно через сайт." },
        { q: "В каком качестве можно скачать видео?", a: "Полное доступное качество для Reels, постов и историй, в MP4 или MP3." },
        { q: "Можно ли скачать из закрытых аккаунтов?", a: "Поддерживаются только публичные аккаунты и посты Instagram; контент из закрытых аккаунтов скачать нельзя." },
        { q: "Законно ли скачивать видео из Instagram?", a: "Скачивайте только то, что вам разрешено сохранять — уважайте автора и условия использования Instagram." },
        { q: "Как долго хранится скачанный файл?", a: "Файлы хранятся на сервере около часа, затем удаляются автоматически." },
      ],
    },
    tiktok: {
      description: "Скачивайте видео TikTok без водяного знака",
      news: "Теперь без водяного знака",
      titleLine1: "Скачать с TikTok",
      titleLine2: "Без водяного знака",
      pageDescription:
        "Скачивайте видео TikTok без водяного знака в высоком качестве. Быстро, бесплатно и просто.",
      placeholder: "Вставьте ссылку TikTok сюда...",
      howTo: [
        "Нажмите «Поделиться» на видео в TikTok, затем «Скопировать ссылку».",
        "Вставьте ссылку выше и нажмите «Скачать».",
        "Получите чистый MP4 без водяного знака TikTok или аудио в MP3.",
        "Сохраните файл на устройство.",
      ],
      faq: [
        { q: "Бесплатно ли скачивать видео из TikTok через Videoner?", a: "Да, аккаунт не нужен." },
        { q: "В каком качестве можно скачать видео?", a: "Максимальное качество, доступное для этого видео в TikTok, без водяного знака, плюс MP3." },
        { q: "Можно ли скачать из закрытых аккаунтов?", a: "Скачать можно только видео из публичных аккаунтов TikTok." },
        { q: "Законно ли скачивать видео из TikTok?", a: "Скачивайте видео, на которые у вас есть право, указывайте авторство и уважайте условия использования TikTok." },
        { q: "Как долго хранится скачанный файл?", a: "Скачанные файлы хранятся на сервере около часа, затем удаляются автоматически." },
      ],
    },
    twitter: {
      description: "Скачивайте видео из Twitter",
      news: "Теперь с поддержкой видео Twitter",
      titleLine1: "Скачать с Twitter",
      titleLine2: "Видео",
      pageDescription:
        "Скачивайте видео из Twitter в высоком качестве. Быстро, бесплатно и просто.",
      placeholder: "Вставьте ссылку Twitter сюда...",
      howTo: [
        "Нажмите «Поделиться» под твитом и выберите «Скопировать ссылку» (или скопируйте URL из браузера).",
        "Вставьте её в поле выше.",
        "Выберите нужное качество видео.",
        "Загрузка начнётся сразу — аккаунт X/Twitter не требуется.",
      ],
      faq: [
        { q: "Бесплатно ли скачивать видео из Twitter через Videoner?", a: "Да, бесплатно и без аккаунта." },
        { q: "В каком качестве можно скачать видео?", a: "Всё качество, доступное для этого видео в X/Twitter, в MP4, плюс MP3." },
        { q: "Можно ли скачать из закрытых аккаунтов?", a: "Работают только твиты из публичных аккаунтов; защищённые (приватные) аккаунты не поддерживаются." },
        { q: "Законно ли скачивать видео из Twitter/X?", a: "Скачивайте контент, на который у вас есть право, уважая автора и условия платформы." },
        { q: "Как долго хранится скачанный файл?", a: "Файлы автоматически удаляются примерно через час после создания." },
      ],
    },
    vimeo: {
      description: "Скачивайте видео с Vimeo в высоком качестве",
      news: "Теперь с поддержкой Vimeo",
      titleLine1: "Скачать с Vimeo",
      titleLine2: "Видео",
      pageDescription:
        "Скачивайте видео с Vimeo в высоком качестве. Быстро, бесплатно и просто.",
      placeholder: "Вставьте ссылку Vimeo сюда...",
      howTo: [
        "Откройте Vimeo и скопируйте ссылку на видео (или нажмите «Поделиться» → «Скопировать ссылку» на мобильном).",
        "Вставьте ссылку в поле выше и нажмите «Скачать».",
        "Выберите качество и формат — MP4 для видео, MP3, если нужно только аудио.",
        "Загрузка начнётся сразу, без аккаунта и установки программ.",
      ],
      faq: [
        { q: "Бесплатно ли скачивать видео с Vimeo через Videoner?", a: "Да, скачивание через сайт бесплатно и без аккаунта." },
        { q: "В каком качестве можно скачать видео?", a: "Videoner предлагает все качества, доступные для этого видео на Vimeo, вплоть до исходного разрешения, включая HD и 4K, если они есть." },
        { q: "Можно ли скачать приватные или защищённые паролем видео?", a: "Нет — работают только публично доступные ссылки Vimeo; приватные, защищённые паролем или ограниченные видео скачать нельзя." },
        { q: "Законно ли скачивать видео с Vimeo?", a: "Скачивайте только то, на что у вас есть право — свой контент, Creative Commons или то, что разрешил автор. Уважайте авторские права и условия Vimeo." },
        { q: "Как долго хранится скачанный файл?", a: "Файл хранится на сервере около часа, сохраните его на устройство сразу после загрузки." },
      ],
    },
    vk: {
      description: "Скачивайте видео и клипы из VK",
      news: "Теперь с поддержкой VK",
      titleLine1: "Скачать с VK",
      titleLine2: "Видео и клипы",
      pageDescription:
        "Скачивайте видео и клипы из VK в высоком качестве. Быстро, бесплатно и просто.",
      placeholder: "Вставьте ссылку VK сюда...",
      howTo: [
        "Откройте видео или клип в VK (vk.com или VK Видео) и скопируйте ссылку из адресной строки или через кнопку «Поделиться».",
        "Вставьте ссылку выше и нажмите «Скачать».",
        "Выберите доступное качество и формат.",
        "Файл загрузится напрямую — входить в аккаунт VK не нужно.",
      ],
      faq: [
        { q: "Бесплатно ли скачивать видео из VK через Videoner?", a: "Да, скачивание через сайт ничего не стоит." },
        { q: "В каком качестве можно скачать видео?", a: "Все качества, доступные для этого видео или клипа в VK, плюс аудио в MP3." },
        { q: "Нужен ли вход в аккаунт VK?", a: "Нет — видео должно быть публичным. Videoner не входит в VK, поэтому приватные, «только для друзей» или требующие входа видео скачать нельзя." },
        { q: "Законно ли скачивать видео из VK?", a: "Скачивайте только то, на что у вас есть право, уважая условия использования VK и права автора." },
        { q: "Как долго хранится скачанный файл?", a: "Файлы хранятся на сервере около часа, затем удаляются автоматически." },
      ],
    },
    rutube: {
      description: "Скачивайте видео с Rutube",
      news: "Теперь с поддержкой Rutube",
      titleLine1: "Скачать с Rutube",
      titleLine2: "Видео",
      pageDescription:
        "Скачивайте видео с Rutube в высоком качестве. Быстро, бесплатно и просто.",
      placeholder: "Вставьте ссылку Rutube сюда...",
      howTo: [
        "Откройте видео на Rutube и скопируйте ссылку из адресной строки или через кнопку «Поделиться».",
        "Вставьте её в поле выше.",
        "Выберите качество и формат (видео или аудио).",
        "Загрузка начнётся сразу, аккаунт Rutube не нужен.",
      ],
      faq: [
        { q: "Бесплатно ли скачивать видео с Rutube через Videoner?", a: "Да, без оплаты и без аккаунта." },
        { q: "В каком качестве можно скачать видео?", a: "Все качества, доступные для видео на Rutube, в MP4, плюс MP3." },
        { q: "Нужен ли вход в аккаунт Rutube?", a: "Нет — Videoner работает только с публично доступными видео Rutube; вход в аккаунт не используется и не требуется." },
        { q: "Законно ли скачивать видео с Rutube?", a: "Скачивайте только контент, на который у вас есть право, уважая условия Rutube и права автора." },
        { q: "Как долго хранится скачанный файл?", a: "Файлы хранятся на сервере около часа перед автоматическим удалением." },
      ],
    },
    okru: {
      description: "Скачивайте видео из OK.ru (Одноклассники)",
      news: "Теперь с поддержкой OK.ru",
      titleLine1: "Скачать с OK.ru",
      titleLine2: "Видео",
      pageDescription:
        "Скачивайте видео из OK.ru (Одноклассники) в высоком качестве. Быстро, бесплатно и просто.",
      placeholder: "Вставьте ссылку OK.ru сюда...",
      howTo: [
        "Откройте видео на OK.ru (Одноклассники) и скопируйте ссылку из адресной строки.",
        "Вставьте ссылку в поле выше и нажмите «Скачать».",
        "Выберите качество и формат.",
        "Загрузка начнётся сразу — вход в OK.ru не нужен.",
      ],
      faq: [
        { q: "Бесплатно ли скачивать видео с OK.ru через Videoner?", a: "Да, полностью бесплатно." },
        { q: "В каком качестве можно скачать видео?", a: "Весь диапазон качества, доступный для видео на OK.ru, плюс MP3." },
        { q: "Нужен ли вход в аккаунт OK.ru?", a: "Нет — работают только публичные видео OK.ru (Одноклассники). Videoner никогда не входит в аккаунт, поэтому приватные видео недоступны." },
        { q: "Законно ли скачивать видео с OK.ru?", a: "Скачивайте только то, на что у вас есть право, уважая условия OK.ru и права автора." },
        { q: "Как долго хранится скачанный файл?", a: "Файлы автоматически удаляются примерно через час после создания." },
      ],
    },
    pinterest: {
      description: "Скачивайте видео с пинов Pinterest",
      news: "Теперь с поддержкой Pinterest",
      titleLine1: "Скачать с Pinterest",
      titleLine2: "Видео и пины",
      pageDescription:
        "Скачивайте видео из пинов Pinterest в высоком качестве. Быстро, бесплатно и просто. Обратите внимание: скачать можно только видео-пины — пины с одной картинкой не поддерживаются.",
      placeholder: "Вставьте ссылку Pinterest сюда...",
      howTo: [
        "Откройте пин в Pinterest и нажмите «Поделиться» → «Скопировать ссылку» (или скопируйте URL из браузера).",
        "Вставьте ссылку в поле выше и нажмите «Скачать».",
        "Выберите нужное качество и формат.",
        "Загрузка начнётся сразу — аккаунт не нужен.",
      ],
      faq: [
        { q: "Бесплатно ли скачивать видео с Pinterest через Videoner?", a: "Да, скачивание через сайт полностью бесплатно, аккаунт не нужен." },
        { q: "В каком качестве можно скачать видео?", a: "Videoner предлагает все качества, доступные для видео в этом пине, плюс извлечение аудио в MP3." },
        { q: "Можно ли скачать фото или картинки с Pinterest?", a: "Нет — скачать можно только видео-пины. Если пин содержит только фото, видео-файла для скачивания просто нет." },
        { q: "Можно ли скачать приватные пины или пины с закрытых досок?", a: "Поддерживаются только публично доступные пины; приватные доски и контент, требующий входа в аккаунт, скачать нельзя." },
        { q: "Законно ли скачивать видео с Pinterest?", a: "Скачивайте только то, на что у вас есть право — свой контент или то, что разрешил автор. Соблюдайте условия использования Pinterest и авторские права." },
        { q: "Как долго хранится скачанный файл?", a: "Готовый файл хранится на сервере около часа, поэтому сохраните его на устройство сразу после скачивания." },
      ],
    },
  },
};

export const translations: Record<Language, Translations> = { en, es, ru };
