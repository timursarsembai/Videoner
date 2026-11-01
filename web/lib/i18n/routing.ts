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
  ar: "ar_AR",
  zh: "zh_CN",
  hi: "hi_IN",
  id: "id_ID",
  sw: "sw_KE",
  de: "de_DE",
  fr: "fr_FR",
  it: "it_IT",
  pt: "pt_BR",
  uz: "uz_UZ",
  tr: "tr_TR",
  fa: "fa_IR",
  vi: "vi_VN",
  bn: "bn_BD",
  ur: "ur_PK",
  pl: "pl_PL",
  ja: "ja_JP",
  ko: "ko_KR",
  th: "th_TH",
  am: "am_ET",
  om: "om_ET",
  ha: "ha_NG",
  so: "so_SO",
  az: "az_AZ",
  ky: "ky_KG",
  tg: "tg_TJ",
  ms: "ms_MY",
  nl: "nl_NL",
  ro: "ro_RO",
  tl: "tl_PH",
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
