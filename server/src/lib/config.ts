export const videoQualityLabel = {
  '256x144': '144p',
  '426x240': '240p',
  '640x360': '360p',
  '854x480': '480p',
  '1280x720': '720p',
  '1920x1080': '1080p',
  '2560x1440': '1440p',
  '3840x2160': '2160p',
  '7680x4320': '4320p',
  '144x256': '144p',
  '240x426': '240p',
  '360x640': '360p',
  '480x854': '480p',
  '720x1280': '720p',
  '1080x1920': '1080p',
  '1440x2560': '1440p',
  '2160x3840': '2160p',
  '4320x7680': '4320p',
};

export const audioQualityLabel = {
  '64Kbps': '64K',
  '96Kbps': '96K',
  '128Kbps': '128K',
  '192Kbps': '192K',
  '256Kbps': '256K',
  '320Kbps': '320K',
};

export const audioExtensionLabel = {
  mp3: 'mp3',
  wav: 'wav',
  aac: 'aac',
  m4a: 'm4a',
  opus: 'opus',
  vorbis: 'vorbis',
  flac: 'flac',
};

export const videoExtensionLabel = {
  mp4: 'mp4',
  webm: 'webm',
  mkv: 'mkv',
  ogg: 'ogg',
  flv: 'flv',
};

export type QualityType =
  | keyof typeof videoQualityLabel
  | keyof typeof audioQualityLabel;

export type ExtensionType =
  | keyof typeof videoExtensionLabel
  | keyof typeof audioExtensionLabel;

export const platforms = ['youtube', 'facebook', 'instagram', 'tiktok'];


