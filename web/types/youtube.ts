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
  qualityLabel: string;
  video_ext: string;
}

export type VideoInfo = {
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
