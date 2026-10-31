// Плейлисты YouTube: бот, сайт и расширение качают их по одному видео
// (POST /info/playlist отдаёт список, дальше каждое видео — обычное
// скачивание).

const YT_HOSTS = /(^|\.)(youtube\.com|youtu\.be)$/i;

// id плейлиста из ссылки — /playlist?list=… или ролик с &list=…. Миксы
// YouTube (RD…) бесконечны и собираются под человека, «Понравившиеся» (LL) и
// «Смотреть позже» (WL) — личные: такие не считаем плейлистом.
export function youtubePlaylistId(url: string): string | null {
  let u: URL;
  try {
    u = new URL(url);
  } catch {
    return null;
  }
  if (!YT_HOSTS.test(u.hostname)) return null;
  const list = u.searchParams.get('list');
  if (!list || !/^[\w-]{10,64}$/.test(list) || /^(RD|LL|WL|UL)/.test(list)) return null;
  return list;
}

export type PlaylistEntry = { url: string; title: string; duration?: number };

// Ответ yt-dlp --flat-playlist → список видео. Удалённые и закрытые ролики
// YouTube оставляет в плейлисте заглушками — их не берём.
export function playlistEntriesFromFlat(info: any): PlaylistEntry[] {
  const entries: any[] = Array.isArray(info?.entries) ? info.entries : [];
  return entries
    .filter((e) => e?.id && !/^\[(private|deleted) video\]$/i.test(e.title ?? ''))
    .map((e) => ({
      url: `https://www.youtube.com/watch?v=${e.id}`,
      title: e.title ?? '',
      duration: typeof e.duration === 'number' ? e.duration : undefined,
    }));
}
