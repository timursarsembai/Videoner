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
  // Только у YouTube и только если субтитры у ролика есть. Необязательное:
  // сайт может оказаться новее сервера, и тогда поля просто нет.
  subtitles?: SubtitleTrack[];
};

// lang уходит обратно на сервер как есть; auto — распознанная речь, а не
// субтитры автора (см. server/src/lib/subtitles.ts).
export type SubtitleTrack = {
  lang: string;
  name: string;
  auto: boolean;
};
