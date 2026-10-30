// Сторис Instagram по подключённому входу человека (UserCookie).
//
// Разбор сторис в yt-dlp сломан (30.10.2026, nightly 2026.08.18): с рабочими
// куками он отвечает «You need to log in», хотя тот же вход нормально
// получает сторис запросом GET /api/v1/media/<id>/info/ — им же пользуется
// само веб-приложение Instagram и наше расширение (extension/page-media.js).
// Поэтому метаданные сторис берём этим запросом и приводим к виду ответа
// yt-dlp: дальше скачивание идёт обычной цепочкой (видео — yt-dlp по готовым
// данным, --load-info-json; фото — как снимки постов).

const STORY_RE = /^https?:\/\/(?:www\.|m\.)?instagram\.com\/stories\/([^/?#]+)\/(\d+)/i;

// Публичный id веб-приложения Instagram: без него API сайта отвечает отказом.
const IG_APP_ID = '936619743392459';
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0 Safari/537.36';

export function instagramStoryId(url: string): string | null {
  return STORY_RE.exec(url)?.[2] ?? null;
}

// Netscape-текст → заголовок Cookie и csrftoken (его Instagram ждёт ещё и
// заголовком).
function cookieHeader(netscape: string): { cookie: string; csrf: string } {
  const pairs = netscape
    .split('\n')
    .filter((l) => l.includes('\t') && !l.startsWith('#'))
    .map((l) => l.split('\t'))
    .filter((f) => f.length >= 7)
    .map((f) => [f[5], f[6]] as const);
  return {
    cookie: pairs.map(([n, v]) => `${n}=${v}`).join('; '),
    csrf: pairs.find(([n]) => n === 'csrftoken')?.[1] ?? '',
  };
}

// Запись API → объект в форме ответа yt-dlp (только поля, которые читает
// наша цепочка: formats, thumbnails, title, duration, размеры).
export function storyInfoFromItem(item: any, url: string): any {
  const username = item?.user?.username ?? '';
  const candidates: any[] = item?.image_versions2?.candidates ?? [];
  const videos: any[] = item?.video_versions ?? [];
  const best = videos[0];
  return {
    id: String(item.pk),
    title: username ? `Story by ${username}` : 'Instagram story',
    extractor: 'instagram:story',
    extractor_key: 'InstagramStory',
    webpage_url: url,
    original_url: url,
    uploader: username,
    uploader_id: username,
    timestamp: item?.taken_at,
    duration: item?.video_duration,
    width: best?.width ?? candidates[0]?.width,
    height: best?.height ?? candidates[0]?.height,
    thumbnail: candidates[0]?.url,
    // У yt-dlp миниатюры идут от меньшей к большей, и снимок берётся последним
    // (lib/playlist.ts bestPhotoUrl); Instagram отдаёт наоборот — разворачиваем.
    thumbnails: [...candidates].reverse().map((c) => ({ url: c.url, width: c.width, height: c.height })),
    // Видео у Instagram — готовый mp4 со звуком: один формат на вариант.
    formats: videos.map((v, i) => ({
      format_id: `story-${i}`,
      url: v.url,
      ext: 'mp4',
      width: v.width,
      height: v.height,
      vcodec: 'avc1',
      acodec: 'mp4a',
      protocol: 'https',
    })),
    ext: best ? 'mp4' : 'jpg',
  };
}

export async function fetchInstagramStoryInfo(url: string, netscape: string): Promise<any> {
  const id = instagramStoryId(url);
  if (!id) throw new Error('Not an Instagram story URL');
  const { cookie, csrf } = cookieHeader(netscape);
  const res = await fetch(`https://www.instagram.com/api/v1/media/${id}/info/`, {
    headers: {
      cookie,
      'x-ig-app-id': IG_APP_ID,
      'x-csrftoken': csrf,
      'user-agent': UA,
      referer: 'https://www.instagram.com/',
    },
    redirect: 'manual',
    signal: AbortSignal.timeout(20_000),
  });
  // Перенаправление на вход и 401/403 — вход больше не принимают
  // (UserCookiesService засчитает отказ этому аккаунту).
  if (res.status === 401 || res.status === 403 || (res.status >= 300 && res.status < 400)) {
    throw new Error(`[instagram:story] ${id}: HTTP Error 401: Unauthorized (login not accepted)`);
  }
  if (!res.ok) throw new Error(`[instagram:story] ${id}: HTTP Error ${res.status}`);
  const data: any = await res.json().catch(() => null);
  const item = data?.items?.[0];
  // Сторис истекла или её удалили — к входу отношения не имеет.
  if (!item || String(item.pk) !== id) throw new Error(`[instagram:story] ${id}: Video unavailable: the story has expired or was deleted`);
  return storyInfoFromItem(item, url);
}
