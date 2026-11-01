// Список языков сайта и их названия. Отдельно от словарей (translations.ts),
// чтобы страницы, которым нужны только коды и названия языков (дашборд),
// не тащили в сборку тексты на всех языках.

// Порядок — как в меню выбора языка: по названию языка на нём самом,
// сначала латиница по алфавиту, затем кириллица, затем остальные письменности.
// Тот же порядок в боте (bot/src/i18n.ts LANGS) и расширении (shared.js LANG_NAMES).
export const LANGUAGES = ["om", "az", "id", "ms", "bs", "de", "en", "es", "fr", "ha", "it", "sw", "ku", "nl", "uz", "pl", "pt", "ro", "sq", "so", "tl", "vi", "tr", "tk", "av", "inh", "kk", "ky", "ce", "ru", "tt", "tg", "uk", "ar", "ur", "fa", "ps", "ckb", "ug", "hi", "bn", "th", "am", "zh", "ja", "ko"] as const;
export type Language = (typeof LANGUAGES)[number];

// Языки с письмом справа налево (арабское письмо): для них вёрстка
// зеркалится (dir="rtl").
const RTL_LANGUAGES: readonly string[] = ["ar", "fa", "ur", "ps", "ckb", "ug"];

export function isRtl(language: Language): boolean {
  return RTL_LANGUAGES.includes(language);
}

export const LANGUAGE_LABELS: Record<Language, string> = {
  en: "English",
  es: "Español",
  ru: "Русский",
  uk: "Українська",
  kk: "Қазақша",
  ar: "العربية",
  zh: "中文",
  hi: "हिन्दी",
  id: "Bahasa Indonesia",
  sw: "Kiswahili",
  de: "Deutsch",
  fr: "Français",
  it: "Italiano",
  pt: "Português",
  uz: "Oʻzbekcha",
  tr: "Türkçe",
  fa: "فارسی",
  vi: "Tiếng Việt",
  bn: "বাংলা",
  ur: "اردو",
  pl: "Polski",
  ja: "日本語",
  ko: "한국어",
  th: "ไทย",
  am: "አማርኛ",
  om: "Afaan Oromoo",
  ha: "Hausa",
  so: "Soomaali",
  az: "Azərbaycanca",
  ky: "Кыргызча",
  tg: "Тоҷикӣ",
  ms: "Bahasa Melayu",
  nl: "Nederlands",
  ro: "Română",
  ps: "پښتو",
  ckb: "کوردی (سۆرانی)",
  ku: "Kurdî (Kurmancî)",
  ug: "ئۇيغۇرچە",
  tk: "Türkmençe",
  tt: "Татарча",
  sq: "Shqip",
  bs: "Bosanski",
  ce: "Нохчийн",
  inh: "ГӀалгӀай",
  av: "Авар мацӀ",
  tl: "Tagalog",
};
