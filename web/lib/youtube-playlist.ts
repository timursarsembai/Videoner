// Ссылка на страницу плейлиста YouTube (/playlist?list=…). Миксы (RD…) и
// личные списки (LL, WL) — не плейлисты; та же логика, что
// server/src/lib/youtube-playlist.ts.
export function isYoutubePlaylistPage(url: string): boolean {
  try {
    const u = new URL(url);
    if (!/(^|\.)(youtube\.com|youtu\.be)$/i.test(u.hostname)) return false;
    const list = u.searchParams.get("list");
    if (!list || !/^[\w-]{10,64}$/.test(list) || /^(RD|LL|WL|UL)/.test(list)) return false;
    return u.pathname.replace(/\/$/, "") === "/playlist";
  } catch {
    return false;
  }
}
