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

export type VideoInfoResponse = {
  id: string;
  title: string;
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
