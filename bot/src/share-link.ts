import { api } from "./helpers.js";

// Адрес сайта, на котором живёт короткая ссылка-приглашение
// (videoner.download/b/<код> → t.me/<бот>?start=<код>, см. handlers/invite.ts).
// Не задан — строки «Поделиться» в подписи нет, остальное работает как раньше.
const SHARE_LINK_BASE = (process.env.SHARE_LINK_BASE ?? "").replace(/\/+$/, "");

// Подпись ждёт ссылку перед отправкой файла, поэтому долго ждать нельзя:
// медленный сервер не должен задерживать сам файл. Не успели — подпись без неё.
const SHARE_LINK_TIMEOUT_MS = 3_000;

// Один ролик качают многие, а код у ссылки постоянный — незачем спрашивать
// сервер каждый раз. Кеш просто сбрасывается целиком, когда разрастается.
const CACHE_LIMIT = 5_000;
const cache = new Map<string, string>();

/** Ссылка «Поделиться» для подписи под файлом или undefined, если её нет. Не бросает. */
export async function shareLinkFor(url: string): Promise<string | undefined> {
  if (!SHARE_LINK_BASE) return undefined;
  const cached = cache.get(url);
  if (cached) return cached;

  let timer: NodeJS.Timeout | undefined;
  try {
    const { code } = await Promise.race([
      api<{ code: string }>("/share-links", { url }),
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new Error("timeout")), SHARE_LINK_TIMEOUT_MS);
      }),
    ]);
    const link = `${SHARE_LINK_BASE}/b/${code}`;
    if (cache.size >= CACHE_LIMIT) cache.clear();
    cache.set(url, link);
    return link;
  } catch (e: any) {
    console.error(`Ссылка «Поделиться» для ${url} не получена:`, e?.message ?? e);
    return undefined;
  } finally {
    clearTimeout(timer);
  }
}
