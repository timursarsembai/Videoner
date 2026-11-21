// Уточнение непонятных отказов площадок (журнал ошибок 21.11.2026: такие
// падали в «Прочее», а человек получал общий текст).

// Текст региональной блокировки — тот же, что у TikTok (info.service.ts,
// handleError): по нему бот, расширение и журнал ошибок относят отказ к
// «закрыто для нашей страны».
export const REGION_BLOCKED_ERROR =
  "This video is blocked outside the author's country — the platform refuses to serve it to our region.";

// Facebook на ссылке «Поделиться» (/share/v/…, /share/r/…) уводит на страницу
// входа, и yt-dlp падает в generic: «Unsupported URL: https://www.facebook.com/login/?next=…».
// На деле запись видна только вошедшим.
export const FACEBOOK_LOGIN_ERROR =
  'Facebook redirected to the login page: this post is visible only to logged-in users (login required).';

export function isFacebookLoginRedirect(message: string): boolean {
  return /unsupported url:\s*https?:\/\/(?:[a-z]+\.)?facebook\.com\/login/i.test(message);
}

// Номер видео Rutube из ссылки rutube.ru/video/<32 hex>/ (и /shorts/, /play/embed/).
export function rutubeId(url: string): string | null {
  const m = /rutube\.ru\/(?:video|shorts|play\/embed)\/(?:private\/)?([0-9a-f]{32})/i.exec(url);
  return m ? m[1].toLowerCase() : null;
}

// yt-dlp пишет «Unable to download options JSON: HTTP Error 404», а сам Rutube
// в этом ответе объясняет причину: detail.type = "blocking_rule" — правообладатель
// открыл видео только для некоторых стран (фильмы, аниме), наш сервер не в их
// числе. true — блокировка по стране, false — что-то другое, null — не узнали.
export async function rutubeRegionBlocked(url: string, fetchImpl: typeof fetch = fetch): Promise<boolean | null> {
  const id = rutubeId(url);
  if (!id) return null;
  try {
    const response = await fetchImpl(`https://rutube.ru/api/play/options/${id}/?format=json`, {
      signal: AbortSignal.timeout(8000),
    });
    const body = (await response.json().catch(() => null)) as { detail?: { type?: unknown } } | null;
    if (!body) return null;
    return body.detail?.type === 'blocking_rule';
  } catch {
    return null;
  }
}
