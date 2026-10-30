import { LANGUAGES, Language } from "./translations";

const SITE = "https://videoner.download";

// en — дефолтная локаль без префикса (/vimeo), остальные — с префиксом
// (/ru/vimeo, /uk/vimeo). Список префиксов повторяет middleware.ts и
// next-sitemap.config.js: те не импортируют словари.
export const PREFIXED_LOCALES = LANGUAGES.filter((l) => l !== "en");

export const OG_LOCALE: Record<Language, string> = {
  en: "en_US",
  es: "es_ES",
  ru: "ru_RU",
  uk: "uk_UA",
  kk: "kk_KZ",
};

export function localizedHref(language: Language, href: string): string {
  if (href === "#" || href.startsWith("http")) return href;
  if (language === "en") return href;
  return href === "/" ? `/${language}` : `/${language}${href}`;
}

// hreflang-альтернативы страницы для метаданных: path — путь без префикса
// ("/" для главной, "/youtube").
export function languageAlternates(path: string): Record<string, string> {
  const url = (lang: Language) => {
    const href = localizedHref(lang, path);
    return href === "/" ? SITE : `${SITE}${href}`;
  };
  return {
    ...Object.fromEntries(LANGUAGES.map((l) => [l, url(l)])),
    "x-default": url("en"),
  };
}

// Убирает текущий локальный префикс из пути, чтобы построить ссылку на ту же
// страницу под другой локалью.
export function stripLocalePrefix(pathname: string): string {
  const [, first, rest] = pathname.match(/^\/([a-z]{2})(\/.*)?$/) ?? [];
  if (first && (PREFIXED_LOCALES as readonly string[]).includes(first)) return rest || "/";
  return pathname;
}
