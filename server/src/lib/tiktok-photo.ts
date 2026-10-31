// Фото-посты TikTok (листаются картинки, а не видео): yt-dlp их не умеет —
// на адрес /@автор/photo/<id> он отвечает «Unsupported URL», на /video/<id> —
// «No video formats found». Картинки же лежат на странице того же поста как
// /video/<id>, в JSON для гидрации (itemStruct.imagePost.images). Разбираем
// его сами и отдаём в форме ответа yt-dlp — плейлист из фото без форматов,
// как карусель Instagram (lib/playlist.ts), дальше всё работает как с ней:
// альбом фото, слайдшоу (lib/slideshow.ts), «фото и слайдшоу».

const PHOTO_RE = /^https?:\/\/(?:www\.|m\.)?tiktok\.com\/@([\w.-]+)\/photo\/(\d+)/i;
// Так yt-dlp пишет развёрнутую короткую ссылку (vt.tiktok.com/…) в ошибке.
const PHOTO_IN_TEXT_RE = /https?:\/\/(?:www\.|m\.)?tiktok\.com\/@[\w.-]+\/photo\/\d+/i;

const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36';

export function isTiktokPhotoUrl(url: string): boolean {
  return PHOTO_RE.test(url);
}

// Адрес фото-поста из текста ошибки yt-dlp (короткая ссылка, которая
// развернулась в /photo/). null — ошибка про другое.
export function tiktokPhotoUrlFromError(message: string): string | null {
  if (!/unsupported url|no video formats found/i.test(message)) return null;
  return message.match(PHOTO_IN_TEXT_RE)?.[0] ?? null;
}

type ImagePostItem = {
  id?: string;
  desc?: string;
  author?: { uniqueId?: string; nickname?: string };
  imagePost?: {
    title?: string;
    images?: { imageURL?: { urlList?: string[] }; imageWidth?: number; imageHeight?: number }[];
  };
};

// Ответ в форме yt-dlp: плейлист, элементы без форматов (= фото), снимок —
// последняя запись thumbnails (bestPhotoUrl).
export function tiktokPhotoInfoFromItem(item: ImagePostItem, url: string): any {
  const images = (item.imagePost?.images ?? []).filter((img) => img.imageURL?.urlList?.length);
  if (!images.length) throw new Error('TikTok photo post has no images');
  const id = item.id ?? url.match(PHOTO_RE)?.[2] ?? 'tiktok';
  const author = item.author?.nickname || item.author?.uniqueId;
  const title = (item.desc || item.imagePost?.title || (author ? `TikTok · ${author}` : 'TikTok photo')).trim();
  return {
    _type: 'playlist',
    id,
    title,
    extractor: 'tiktok:photo',
    extractor_key: 'TikTokPhoto',
    webpage_url: url,
    uploader: author,
    thumbnail: images[0].imageURL!.urlList![0],
    entries: images.map((img, i) => ({
      id: `${id}-${i + 1}`,
      title,
      formats: [],
      width: img.imageWidth,
      height: img.imageHeight,
      thumbnail: img.imageURL!.urlList![0],
      thumbnails: [{ url: img.imageURL!.urlList![0], width: img.imageWidth, height: img.imageHeight }],
    })),
  };
}

export async function fetchTiktokPhotoInfo(url: string): Promise<any> {
  const m = url.match(PHOTO_RE);
  if (!m) throw new Error('Not a TikTok photo URL');
  const [, user, id] = m;
  const res = await fetch(`https://www.tiktok.com/@${user}/video/${id}`, {
    headers: { 'User-Agent': USER_AGENT, 'Accept-Language': 'en-US,en;q=0.9' },
    signal: AbortSignal.timeout(20_000),
  });
  if (!res.ok) throw new Error(`TikTok photo post: HTTP ${res.status}`);
  const html = await res.text();
  const json = html.match(/<script id="__UNIVERSAL_DATA_FOR_REHYDRATION__"[^>]*>([\s\S]*?)<\/script>/)?.[1];
  if (!json) throw new Error('TikTok photo post: no page data');
  const detail = JSON.parse(json)?.__DEFAULT_SCOPE__?.['webapp.video-detail'];
  const item = detail?.itemInfo?.itemStruct as ImagePostItem | undefined;
  // Удалённый или закрытый пост TikTok отдаёт без itemStruct, со statusCode.
  if (!item) throw new Error(`TikTok photo post unavailable (status ${detail?.statusCode ?? 'unknown'})`);
  return tiktokPhotoInfoFromItem(item, `https://www.tiktok.com/@${user}/photo/${id}`);
}
