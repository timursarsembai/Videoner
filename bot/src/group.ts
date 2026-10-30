// Режим для групп: чистая часть, без Telegram и сервера (проверяется
// group.test.ts). Сетевая часть — handlers/group.ts.
//
// В группе бот видит все сообщения подряд, и большинство ссылок там — не на
// видео: новости, документы, профили. Отвечать на каждую ошибкой нельзя —
// это спам в чужом чате. Поэтому заранее отбираем ссылки только с площадок,
// которые умеет сервер (список — как в server/src/validate/url.ts), а что
// сервер всё же не разобрал, бот пропускает молча.

const VIDEO_HOSTS = [
  "youtube.com",
  "youtu.be",
  "tiktok.com",
  "instagram.com",
  "facebook.com",
  "fb.watch",
  "twitter.com",
  "x.com",
  "vimeo.com",
  "vk.com",
  "vk.ru",
  "vkvideo.ru",
  "rutube.ru",
  "ok.ru",
  "pinterest.com",
  "pin.it",
  "threads.net",
  "threads.com",
];

export function isVideoHostUrl(url: string): boolean {
  let host: string;
  try {
    host = new URL(url).hostname.toLowerCase();
  } catch {
    return false;
  }
  return VIDEO_HOSTS.some((h) => host === h || host.endsWith(`.${h}`));
}

// Сколько ссылок из одного сообщения берём. Больше — скорее подборка, чем
// просьба скачать, и бот завалил бы чат файлами.
export const GROUP_LINKS_PER_MESSAGE = 3;

// Качество без выбора: в группе кнопок нет. 720p — как в инлайн-режиме;
// тяжелее предела Telegram не берём. "original" — пост из одних фотографий,
// другого качества у него нет.
export function pickGroupQuality(available: string[], sizes: Record<string, number>, fileLimit: number): string | null {
  if (available.includes("original")) return "original";
  const fits = available.filter((q) => !(sizes[q] > fileLimit));
  if (!fits.length) return null;
  return fits.find((q) => q === "720p") ?? fits[0];
}

// Лимит скачиваний на группу за скользящий час. Суточный лимит считается по
// людям, но в активном чате их много, и без общего потолка одна группа могла
// бы съесть трафик YouTube за всех.
export class GroupLimiter {
  private hits = new Map<number, number[]>();

  constructor(
    private readonly limit: number,
    private readonly windowMs = 60 * 60_000,
  ) {}

  // true — можно качать (попытка засчитана), false — потолок достигнут.
  take(chatId: number, now = Date.now()): boolean {
    const fresh = (this.hits.get(chatId) ?? []).filter((t) => now - t < this.windowMs);
    if (fresh.length >= this.limit) {
      this.hits.set(chatId, fresh);
      return false;
    }
    fresh.push(now);
    this.hits.set(chatId, fresh);
    return true;
  }
}
