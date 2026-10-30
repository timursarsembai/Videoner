import { DownloadSource } from '@prisma/client';

// Область кук человека (UserCookiesService) из запроса — только для запросов
// бота. Сайт и расширение ходят через прокси сайта, который всегда ставит им
// source WEB/EXTENSION (web/lib/api-proxy.ts) и само поле вырезает; поэтому
// подставить чужую группу оттуда нельзя, даже прислав cookieScope руками.
export function userCookieScope(meta: { source?: DownloadSource | string; cookieScope?: unknown }): string | undefined {
  if (meta.source === DownloadSource.WEB || meta.source === DownloadSource.EXTENSION) return undefined;
  return typeof meta.cookieScope === 'string' ? meta.cookieScope : undefined;
}
