import { DownloadSource } from '@prisma/client';

// Области кук людей (UserCookiesService), которые можно попробовать для
// запроса, — по порядку. Два замка от чужих запросов:
//   1. контроллеры (/info, /download/*) вырезают cookieScope и
//      cookieFallbackScope у всего, что не подписано ботом (lib/bot-auth.ts);
//   2. здесь — запросы сайта и расширения отбрасываются ещё раз по source,
//      который их прокси ставит всегда (web/lib/api-proxy.ts).
//
// cookieFallbackScope — в группе: если к самой группе вход площадки не
// подключён, ссылку того, кто её прислал, можно скачать его личным входом.
// Только его собственным: область должна быть user:<telegramId> этого же
// запроса, иначе бот (или его ошибка) мог бы подставить чужой вход.
export function userCookieScopes(meta: {
  source?: DownloadSource | string;
  cookieScope?: unknown;
  cookieFallbackScope?: unknown;
  telegramId?: unknown;
}): string[] {
  if (meta.source === DownloadSource.WEB || meta.source === DownloadSource.EXTENSION) return [];
  const scopes: string[] = [];
  if (typeof meta.cookieScope === 'string') scopes.push(meta.cookieScope);
  if (
    typeof meta.cookieFallbackScope === 'string' &&
    typeof meta.cookieScope === 'string' &&
    meta.cookieScope.startsWith('chat:') &&
    Number.isSafeInteger(meta.telegramId) &&
    meta.cookieFallbackScope === `user:${meta.telegramId}`
  ) {
    scopes.push(meta.cookieFallbackScope);
  }
  return scopes;
}
