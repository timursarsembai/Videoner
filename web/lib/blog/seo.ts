import { localizedHref } from "@/lib/i18n/routing";
import { Language } from "@/lib/i18n/translations";

// Общие куски разметки для поисковиков и LLM-поиска: абсолютные адреса блога
// и JSON-LD организации. Адреса — всегда боевой домен, а не
// NEXT_PUBLIC_APP_URL: canonical у страниц тоже боевой.

export const SITE = "https://videoner.download";

export function absoluteUrl(lang: Language, path: string): string {
  const href = localizedHref(lang, path);
  return href === "/" ? SITE : `${SITE}${href}`;
}

export const blogUrl = (lang: Language) => absoluteUrl(lang, "/blog");
export const postUrl = (lang: Language, slug: string) => absoluteUrl(lang, `/blog/${slug}`);
export const rssUrl = (lang: Language) => absoluteUrl(lang, "/blog/rss.xml");

// Та же организация, что organizationSchema в app/layout.tsx.
export const ORGANIZATION = {
  "@type": "Organization",
  name: "Videoner",
  url: SITE,
  logo: `${SITE}/images/videoner-website-logo.webp`,
};

// Картинка превью для блога — общая app/[locale]/opengraph-image.tsx. Сама
// она к страницам блога не прикрепляется (Next.js отдаёт её только странице
// своего сегмента), поэтому адрес указываем явно — в openGraph.images и в
// JSON-LD. Английская — /opengraph-image без /en: адрес с /en middleware
// редиректит.
export const ogImageUrl = (lang: Language) => absoluteUrl(lang, "/opengraph-image");

export const ogImage = (lang: Language) => ({ url: ogImageUrl(lang), width: 1200, height: 630, alt: "Videoner" });
