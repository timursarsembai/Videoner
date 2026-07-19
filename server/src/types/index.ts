export type BinPathType = {
  ytdlpPath: string;
  ffmpegPath: string;
};

export enum VideoQuality {
  '144p' = '144p',
  '240p' = '240p',
  '360p' = '360p',
  '480p' = '480p',
  '720p' = '720p',
  '1080p' = '1080p',
  '1440p' = '1440p',
  '2160p' = '2160p',
}

export enum AudioQuality {
  'worst' = 'worst',
  'best' = 'best',
}

export enum VideoFormat {
  'mp4' = 'mp4',
  'mkv' = 'mkv',
  'webm' = 'webm',
  'flv' = 'flv',
  'ogg' = 'ogg',
}

export enum AudioFormat {
  'aac' = 'aac',
  'flac' = 'flac',
  'mp3' = 'mp3',
  'm4a' = 'm4a',
  'opus' = 'opus',
  'vorbis' = 'vorbis',
  'wav' = 'wav',
}

export type StreamQualityOptions = {
  videoonly: VideoQuality;
  audioonly: 'highest' | 'lowest';
  audioandvideo: 'highest' | 'lowest';
};

export type DownloadQualityOptions = {
  mergevideo: VideoQuality;
  audioonly: AudioQuality;
};

export type DownloadFormatOptions = {
  mergevideo: VideoFormat;
  audioonly: AudioFormat;
};

export type OutputType = {
  output?:
    | {
        outDir: string;
        fileName?: string | 'default';
      }
    | string;
};

export type StreamKeyWord = keyof StreamQualityOptions;

export type StreamOptions<F extends StreamKeyWord> = {
  filter: F;
  quality?: StreamQualityOptions[F];
  command?: string[];
};

export type DownloadKeyWord = keyof DownloadQualityOptions;

export type DownloadOptions<F extends DownloadKeyWord> = (F extends 'mergevideo'
  ? {
      filter: F;
      quality?: DownloadQualityOptions[F];
      format?: DownloadFormatOptions[F];
      embedSubs?: boolean;
      embedThumbnail?: boolean;
      command?: string[];
    }
  : {
      filter: F;
      quality?: DownloadQualityOptions[F];
      format?: DownloadFormatOptions[F];
      embedSubs?: boolean;
      embedThumbnail?: boolean;
      command?: string[];
    }) &
  OutputType;

export type AsyncOptions<F extends DownloadKeyWord> = {
  onProgress: () => void;
} & DownloadOptions<F>;

export type PipeType<T> = (
  destination: NodeJS.WritableStream,
  options?: {
    end?: boolean;
  },
) => T;

export interface VideoInfo {
  id: string;
  title: string;
  formats: object[];
  thumbnails: object[];
  thumbnail: string;
  description: string;
  uploader: string;
  duration: string;
  view_count: string;
  upload_date: string;
}

export type ThumbnailsOptions = {
  quality?: 'max' | 'hq' | 'mq' | 'sd' | 'default';
  type?: 'jpg' | 'webp';
};

export type ProgressType = {
  status: 'downloading' | 'converting' | 'finished';
  downloaded: number;
  downloaded_str: string;
  total: number;
  total_str: string;
  speed: number;
  speed_str: string;
  eta: number;
  eta_str: string;
  percentage: number;
  percentage_str: string;
};

export type Platform =
  | 'facebook'
  | 'instagram'
  | 'tiktok'
  | 'youtube'
  | 'twitter';
