// Код страны посетителя сайта и расширения (Download.country). Приходит из
// заголовка CF-IPCountry, который Cloudflare ставит каждому запросу (прокси
// сайта пересылает его серверу как clientCountry). Сохраняем только
// настоящий код ISO 3166-1 alpha-2: служебные XX (страна неизвестна) и T1
// (сеть Tor) — как null.
export function parseCountry(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const code = value.trim().toUpperCase();
  if (!/^[A-Z]{2}$/.test(code) || code === 'XX' || code === 'T1') return null;
  return code;
}
