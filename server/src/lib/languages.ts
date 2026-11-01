// Языки интерфейса Videoner — для статистики по языкам на дашборде.
// Список ОБЯЗАН совпадать с web/lib/i18n/translations.ts (LANGUAGES),
// bot/src/i18n.ts (LANGS) и extension/shared.js (LANG_NAMES): добавляя язык
// туда, добавь и сюда, иначе его пользователи попадут в «Другие».
export const SUPPORTED_LANGUAGES = [
  'om', 'az', 'id', 'ms', 'bs', 'de', 'en', 'es', 'fr', 'ha', 'it', 'sw',
  'ku', 'nl', 'uz', 'pl', 'pt', 'ro', 'sq', 'so', 'tl', 'vi', 'tr', 'tk',
  'av', 'inh', 'kk', 'ky', 'ce', 'ru', 'tt', 'tg', 'uk', 'ar', 'ur', 'fa',
  'ps', 'ckb', 'ug', 'hi', 'bn', 'th', 'am', 'zh', 'ja', 'ko',
] as const;

// Ключи для строк статистики вне списка: язык есть, но мы его не
// поддерживаем, — и язык неизвестен вовсе (сайт и расширение до выката
// записи языка).
export const OTHER_LANGUAGE = 'other';
export const UNKNOWN_LANGUAGE = 'unknown';

const SUPPORTED = new Set<string>(SUPPORTED_LANGUAGES);

// Старые и альтернативные коды тех же языков — как в bot/src/i18n.ts
// detectLang и extension/shared.js pickLang.
const ALIASES: Record<string, string> = {
  in: 'id', // старый код индонезийского
  fil: 'tl', // филиппинский — так его называют браузеры и часть клиентов
  kmr: 'ku', // курманджи по ISO 639-3
  mo: 'ro', // старый код молдавского (румынского)
};

// Язык, который сайт или расширение прислали вместе со скачиванием. Строгая
// форма — 2–3 строчные латинские буквы; всё остальное (в том числе мусор от
// старых клиентов) не записываем вовсе: null.
export function parseUiLang(value: unknown): string | null {
  return typeof value === 'string' && /^[a-z]{2,3}$/.test(value) ? value : null;
}

// Код языка Telegram ("pt-br", "en-US", "fil") → один из поддерживаемых или
// OTHER_LANGUAGE. Пустой код — тоже OTHER_LANGUAGE: человек есть, а языка
// Telegram не сообщил.
export function normalizeLanguageCode(code: string | null | undefined): string {
  const base = (code ?? '').split('-')[0].trim().toLowerCase();
  const mapped = ALIASES[base] ?? base;
  return SUPPORTED.has(mapped) ? mapped : OTHER_LANGUAGE;
}

// Язык, на котором бот на самом деле говорит с человеком: выбранный вручную
// (/language), а если не выбирал — по языку Telegram.
export function effectiveBotLanguage(
  language: string | null | undefined,
  languageCode: string | null | undefined,
): string {
  return normalizeLanguageCode(language ?? languageCode);
}

// Язык скачивания с сайта или из расширения: null — записей до выката
// (UNKNOWN_LANGUAGE), код вне списка — OTHER_LANGUAGE.
export function downloadLanguage(lang: string | null | undefined): string {
  return lang ? normalizeLanguageCode(lang) : UNKNOWN_LANGUAGE;
}
