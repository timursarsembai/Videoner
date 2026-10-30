import { Language } from "@/lib/i18n/translations";

// Подписи блога (страницы app/[locale]/blog, пост в канале).
export const NEWS_CHANNEL_URL = "https://t.me/videonerdownload";

export const blogUi: Record<
  Language,
  {
    title: string;
    description: string;
    readMore: string;
    back: string;
    allPosts: string;
    channel: string;
    channelCta: string;
    readOnSite: string;
    // Пост в канале обрезан по лимиту Telegram.
    readFull: string;
    dateLocale: string;
  }
> = {
  ru: {
    title: "Блог Videoner",
    description: "Новости проекта: что появилось в боте, на сайте и в расширении и как этим пользоваться.",
    readMore: "Читать",
    back: "Все статьи",
    allPosts: "Блог",
    channel: "Новости в Telegram",
    channelCta: "Новости проекта — в Telegram-канале @videonerdownload.",
    readOnSite: "Читать на сайте",
    readFull: "Читать полностью на сайте",
    dateLocale: "ru-RU",
  },
  uk: {
    title: "Блог Videoner",
    description: "Новини проєкту: що з'явилося в боті, на сайті й у розширенні та як цим користуватися.",
    readMore: "Читати",
    back: "Усі статті",
    allPosts: "Блог",
    channel: "Новини в Telegram",
    channelCta: "Новини проєкту — у Telegram-каналі @videonerdownload.",
    readOnSite: "Читати на сайті",
    readFull: "Читати повністю на сайті",
    dateLocale: "uk-UA",
  },
  kk: {
    title: "Videoner блогы",
    description: "Жоба жаңалықтары: ботта, сайтта және кеңейтімде не пайда болды және оны қалай пайдалану керек.",
    readMore: "Оқу",
    back: "Барлық мақалалар",
    allPosts: "Блог",
    channel: "Telegram-дағы жаңалықтар",
    channelCta: "Жоба жаңалықтары — @videonerdownload Telegram-арнасында.",
    readOnSite: "Сайтта оқу",
    readFull: "Сайтта толық оқу",
    dateLocale: "kk-KZ",
  },
  es: {
    title: "Blog de Videoner",
    description: "Novedades del proyecto: qué hay de nuevo en el bot, la web y la extensión, y cómo usarlo.",
    readMore: "Leer",
    back: "Todos los artículos",
    allPosts: "Blog",
    channel: "Noticias en Telegram",
    channelCta: "Las novedades del proyecto, en el canal de Telegram @videonerdownload.",
    readOnSite: "Leer en la web",
    readFull: "Leer completo en la web",
    dateLocale: "es-ES",
  },
  en: {
    title: "Videoner blog",
    description: "Project news: what's new in the bot, on the site and in the extension, and how to use it.",
    readMore: "Read",
    back: "All posts",
    allPosts: "Blog",
    channel: "News on Telegram",
    channelCta: "Project news is on the Telegram channel @videonerdownload.",
    readOnSite: "Read on the site",
    readFull: "Read the full post on the site",
    dateLocale: "en-US",
  },
};

export function formatPostDate(date: string, lang: Language): string {
  return new Intl.DateTimeFormat(blogUi[lang].dateLocale, { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(
    new Date(`${date}T00:00:00Z`),
  );
}
