// Куда вести за расширением и как понять браузер — одно на страницу
// расширения (app/[locale]/extension) и окошко в углу сайта
// (components/common/ExtensionPromo.tsx), чтобы они не решали по-разному.

// Firefox ставит расширение из каталога дополнений Mozilla (с 1.6.10). Без
// языка в адресе: каталог сам откроется на языке браузера.
export const FIREFOX_AMO = "https://addons.mozilla.org/firefox/addon/videoner-video-downloader/";

// Телефоны и планшеты: расширения там не ставятся (Firefox для Android
// дополнения не из каталога Mozilla не берёт, а Chrome на телефоне их не знает).
export function isMobileUserAgent(userAgent: string): boolean {
  return /Android|Mobile|iPhone|iPad/.test(userAgent);
}

export function isFirefoxUserAgent(userAgent: string): boolean {
  return /Firefox\//.test(userAgent) && !isMobileUserAgent(userAgent);
}

// Chrome, Edge, Opera, Яндекс Браузер, Brave, Vivaldi пишут «Chrome/» в
// user-agent; Safari — нет.
export function isChromiumUserAgent(userAgent: string): boolean {
  return /Chrome\//.test(userAgent) && !isFirefoxUserAgent(userAgent) && !isMobileUserAgent(userAgent);
}
