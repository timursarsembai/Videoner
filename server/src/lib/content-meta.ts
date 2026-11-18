import type { YtdlpVideoInfo } from '../types/youtube';

// Кто автор и о чём видео — для дашборда («Популярные авторы», темы).
// Владелец 18.11.2026: видеть, откуда больше всего качают, по всем
// площадкам. У каждой площадки своё:
//   автор     — uploader/channel из yt-dlp; у Instagram запасной путь —
//               заголовок вида «Video by <ник>», у TikTok — @ник в ссылке;
//   категория — YouTube отдаёт свою (categories), у Reddit роль категории
//               играет сабреддит (r/<имя> из ссылки); у остальных её нет;
//   хэштеги   — теги площадки и #слова из названия и описания: по ним видно
//               тему у TikTok, Instagram, Threads и прочих.
export type ContentMeta = {
  authorName: string | null;
  authorId: string | null;
  authorUrl: string | null;
  category: string | null;
  hashtags: string[];
};

const MAX_HASHTAGS = 15;
const HASHTAG_RE = /#([\p{L}\p{M}\p{N}_]{2,50})/gu;

const clean = (v: unknown, max = 200): string | null =>
  typeof v === 'string' && v.trim() ? v.trim().slice(0, max) : null;

// Ссылка на профиль — только http(s): её показывает дашборд как ссылку.
const safeUrl = (v: unknown): string | null => {
  const s = clean(v, 500);
  return s && /^https?:\/\//i.test(s) ? s : null;
};

export function subredditOf(url: string): string | null {
  const m = /reddit\.com\/r\/([A-Za-z0-9_]{2,30})(?:\/|$|\?)/i.exec(url);
  return m ? `r/${m[1].toLowerCase()}` : null;
}

export function tiktokHandleOf(url: string): string | null {
  const m = /tiktok\.com\/@([A-Za-z0-9_.]{2,40})/i.exec(url);
  return m ? m[1] : null;
}

export function instagramTitleAuthor(title: string | undefined | null): string | null {
  const m = /^(?:video|photo|post|reel) by ([A-Za-z0-9_.]{1,40})$/i.exec((title ?? '').trim());
  return m ? m[1] : null;
}

export function hashtagsOf(info: Partial<YtdlpVideoInfo>): string[] {
  const out = new Set<string>();
  for (const t of Array.isArray(info.tags) ? info.tags : []) {
    if (typeof t !== 'string') continue;
    const tag = t.trim().replace(/^#/, '').toLowerCase();
    if (tag.length >= 2 && tag.length <= 50) out.add(tag);
    if (out.size >= MAX_HASHTAGS) return [...out];
  }
  const text = `${info.title ?? ''}\n${info.description ?? ''}`;
  for (const m of text.matchAll(HASHTAG_RE)) {
    out.add(m[1].toLowerCase());
    if (out.size >= MAX_HASHTAGS) break;
  }
  return [...out];
}

export function contentMeta(info: Partial<YtdlpVideoInfo> & Record<string, unknown>, platform: string | null, url: string): ContentMeta {
  let authorName = clean(info.uploader) ?? clean(info.channel) ?? clean(info.creator);
  let authorId = clean(info.uploader_id, 100) ?? clean(info.channel_id, 100);
  let authorUrl = safeUrl(info.uploader_url) ?? safeUrl(info.channel_url);

  if (platform === 'instagram' && !authorName) {
    const nick = instagramTitleAuthor(info.title);
    if (nick) {
      authorName = nick;
      authorId ??= nick;
      authorUrl ??= `https://www.instagram.com/${nick}/`;
    }
  }
  if (platform === 'tiktok') {
    const nick = tiktokHandleOf(url);
    if (nick) {
      authorId ??= nick;
      authorName ??= nick;
      authorUrl ??= `https://www.tiktok.com/@${nick}`;
    }
  }

  const category =
    platform === 'youtube'
      ? clean(Array.isArray(info.categories) ? info.categories[0] : null, 60)
      : platform === 'reddit'
        ? subredditOf(url) ?? (clean(info.subreddit, 30) ? `r/${String(info.subreddit).toLowerCase()}` : null)
        : null;

  return { authorName, authorId, authorUrl, category, hashtags: hashtagsOf(info) };
}
