// Аккаунты 18+ (решение владельца 19.11.2026). X помечает 18+ не каждый пост:
// у одних и тех же авторов часть постов X скрывает, а часть того же характера
// отдаёт. Поэтому, если X хоть раз пометил пост аккаунта, дальше не качаем ни
// один пост этого аккаунта. Сам список — таблица AdultAuthor
// (modules/adult-authors), здесь — чистые правила без базы.
//
// Пока только X: на Reddit пометка 18+ — свойство сабреддита, а не автора.
export const ADULT_AUTHOR_PLATFORMS = new Set(['twitter']);

// Текст начинается с «Adult content:» — бот, сайт и расширение показывают
// обычное «контент для взрослых», журнал ошибок кладёт в «18+».
export const ADULT_AUTHOR_ERROR =
  'Adult content: this X account posts 18+ content; Videoner does not download it.';

// Первые части адреса x.com, которые не ники.
const NOT_NICKS = new Set(['i', 'home', 'intent', 'search', 'explore', 'hashtag', 'share', 'settings', 'messages', 'notifications']);

// Ник X — до 15 латинских букв, цифр и «_».
function cleanNick(v: unknown): string | null {
  if (typeof v !== 'string') return null;
  const nick = v.trim().replace(/^@/, '').toLowerCase();
  return /^[a-z0-9_]{1,15}$/.test(nick) && !NOT_NICKS.has(nick) ? nick : null;
}

// Ник из ссылки x.com/<ник>/status/<номер>. В ссылку можно вписать любой ник
// (X откроет твит по номеру), поэтому для проверки «можно ли качать» главное —
// автор из ответа площадки, а ник из ссылки — только дополнительно.
export function nickFromUrl(url: string): string | null {
  const m = /^https?:\/\/(?:[a-z0-9-]+\.)?(?:x|twitter)\.com\/([^/?#]+)\/status(?:es)?\/\d/i.exec(url.trim());
  return m ? cleanNick(m[1]) : null;
}

// Ник автора из ответа yt-dlp: у X uploader_id — это ник (screen_name).
export function nickFromInfo(info: unknown): string | null {
  if (!info || typeof info !== 'object') return null;
  const i = info as { uploader_id?: unknown; entries?: unknown };
  const own = cleanNick(i.uploader_id);
  if (own) return own;
  const first = Array.isArray(i.entries) ? (i.entries[0] as { uploader_id?: unknown } | undefined) : undefined;
  return cleanNick(first?.uploader_id);
}

// Все ники, по которым проверять пост: из ответа площадки и из ссылки.
export function adultAuthorNicks(platform: string | null | undefined, info: unknown, url: string): string[] {
  if (!platform || !ADULT_AUTHOR_PLATFORMS.has(platform)) return [];
  return [...new Set([nickFromInfo(info), nickFromUrl(url)].filter((n): n is string => !!n))];
}
