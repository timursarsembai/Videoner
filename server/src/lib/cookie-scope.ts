import { DownloadSource } from '@prisma/client';

// Область кук человека (UserCookiesService) из запроса. Два замка:
//   1. контроллеры (/info, /download/*) вырезают cookieScope у всего, что не
//      подписано ботом (lib/bot-auth.ts) — ключа API для этого мало;
//   2. здесь — запросы сайта и расширения отбрасываются ещё раз по source,
//      который их прокси ставит всегда (web/lib/api-proxy.ts).
export function userCookieScope(meta: { source?: DownloadSource | string; cookieScope?: unknown }): string | undefined {
  if (meta.source === DownloadSource.WEB || meta.source === DownloadSource.EXTENSION) return undefined;
  return typeof meta.cookieScope === 'string' ? meta.cookieScope : undefined;
}
