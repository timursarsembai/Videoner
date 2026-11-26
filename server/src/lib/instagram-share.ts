// Ссылки «Поделиться» Instagram: instagram.com/share/<код> (владелец 27.11.2026:
// Android-приложение на обеих кнопках даёт только такие, и все они падали с
// «URL not supported»). Код в такой ссылке свой — пост по нему не найти. Простой
// запрос сервера получает от Instagram страницу ошибки, а переход настоящего
// браузера Instagram сразу переадресует на /reel/<код>/ — поэтому раскрывает
// резолвер Threads, у которого уже есть Chromium (threads-resolver/server.js,
// /instagram-share). Раскрытые ссылки помним: повторно Instagram не трогаем.

const SHARE_HOST = /^(?:www\.|m\.)?instagram\.com$/i;
const SHARE_PATH = /^\/share\/(?:(?:reel|p)\/)?[A-Za-z0-9_-]+\/?$/;
const POST_URL = /^https:\/\/www\.instagram\.com\/(?:reel|p|tv)\/[A-Za-z0-9_-]+\/$/;

const CACHE_MS = 7 * 24 * 60 * 60 * 1000;
const CACHE_MAX = 5000;
const cache = new Map<string, { url: string; until: number }>();

export function isInstagramShareUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return (u.protocol === 'https:' || u.protocol === 'http:') && SHARE_HOST.test(u.hostname) && SHARE_PATH.test(u.pathname);
  } catch {
    return false;
  }
}

function cacheKey(url: string): string {
  const u = new URL(url);
  return u.pathname.replace(/\/+$/, '');
}

// Ссылка на пост или null, если раскрыть не вышло.
export async function resolveInstagramShare(
  url: string,
  fetchImpl: typeof fetch = fetch,
  now = Date.now(),
): Promise<string | null> {
  if (!isInstagramShareUrl(url)) return null;
  const key = cacheKey(url);
  const hit = cache.get(key);
  if (hit && hit.until > now) return hit.url;
  const base = (process.env.THREADS_RESOLVER_URL ?? 'http://threads-resolver:4417').replace(/\/+$/, '');
  try {
    const response = await fetchImpl(`${base}/instagram-share?url=${encodeURIComponent(url)}`, {
      signal: AbortSignal.timeout(60_000),
    });
    const body = (await response.json().catch(() => null)) as { ok?: boolean; url?: unknown } | null;
    if (!body?.ok || typeof body.url !== 'string' || !POST_URL.test(body.url)) {
      console.warn(`[instagram-share] не раскрыли ${key}`);
      return null;
    }
    cache.delete(key);
    cache.set(key, { url: body.url, until: now + CACHE_MS });
    while (cache.size > CACHE_MAX) cache.delete(cache.keys().next().value as string);
    return body.url;
  } catch (error: any) {
    console.warn(`[instagram-share] резолвер не ответил для ${key}: ${error?.message ?? error}`);
    return null;
  }
}
