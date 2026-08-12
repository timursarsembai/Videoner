export interface VideoFormat {
  format_id: string;
  format_note?: string;
  ext: string;
  protocol: string;
  acodec: string;
  vcodec: string;
  url: string;
  width?: number;
  height?: number;
  fps?: number;
  filesize?: number;
  filesize_approx?: number;
  format: string;
  resolution: string;
  tbr?: number;
  quality: number;
  video_ext: string;
}

export interface YtdlpVideoInfo {
  // Карусель (пост из нескольких файлов) приходит от yt-dlp как плейлист:
  // _type === 'playlist' и массив entries вместо собственных formats.
  // Ключ --dump-single-json обязателен: обычный --dump-json печатает по
  // объекту НА КАЖДЫЙ элемент, и JSON.parse всего вывода падает на второй
  // строке (ровно эта ошибка и всплывала на каруселях Instagram).
  _type?: string;
  entries?: YtdlpVideoInfo[];
  // Размеры самого ролика (не формата) — yt-dlp кладёт их и у элементов
  // карусели, по ним отличаем вертикальное от горизонтального в списке.
  width?: number;
  height?: number;
  id: string;
  title: string;
  formats: VideoFormat[];
  thumbnail: string;
  description: string;
  timestamp: number;
  uploader: string;
  uploader_id: string;
  uploader_url: string;
  channel_id: string;
  channel_url: string;
  duration: number;
  view_count: number;
  like_count?: number;
  comment_count?: number;
  categories: string[];
  tags: string[];
  is_live: boolean;
  was_live?: boolean;
  live_status?: string;
  availability: string;
  original_url: string;
}

// Элемент карусели в ответе /info. Для обычного поста массив items содержит
// ровно одну запись — так и сайту, и боту не нужно две разных ветки.
export type VideoInfoItem = {
  index: number;
  id: string;
  kind: 'video' | 'photo';
  width?: number;
  height?: number;
  duration?: number;
  thumbnail?: string;
};

export type VideoInfoResponse = {
  id: string;
  title: string;
  itemCount: number;
  items: VideoInfoItem[];
  qualities: {
    video: string[];
    audio: string[];
  };
  thumbnail: string;
  description: string;
  uploader: string;
  timestamp: number;
  uploaderUrl: string;
  categories: string[];
  tags: string[];
  duration: number;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  extensions: {
    video: string[];
    audio: string[];
  };
};

export type PlaylistVideoInfo = {
  id: string;
  url: string;
  title: string;
  description: string | null;
  duration: number;
  channel_id: string;
  channel: string;
  channel_url: string;
  uploader: string;
  uploader_id: string;
  uploader_url: string;
  thumbnails: {
    url: string;
    height: number;
    width: number;
  }[];
  view_count: number;
  live_status: null;
  webpage_url: string;
  original_url: string;
  webpage_url_basename: string;
  webpage_url_domain: string;
  playlist_count: number;
  playlist: string;
  playlist_id: string;
  playlist_title: string;
  playlist_uploader: string;
  playlist_uploader_id: string;
  playlist_channel: string;
  playlist_channel_id: string;
  playlist_webpage_url: string;
  n_entries: number;
  playlist_index: number;
  __last_playlist_index: number;
  playlist_autonumber: number;
  epoch: number;
  duration_string: string;
  release_year: null;
};
