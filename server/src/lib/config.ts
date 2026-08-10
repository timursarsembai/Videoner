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
  // Кадры 4:5 и 1:1 — обычные для Instagram и Threads. Без них подпись
  // качества откатывалась к сырому «720x900» вместо «720p»: карта расписана
  // только по 16:9, а у этих площадок вертикаль часто не 16:9.
  '720x900': '720p',
  '900x720': '720p',
  '720x720': '720p',
  '1080x1350': '1080p',
  '1350x1080': '1080p',
  '1080x1080': '1080p',
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

// Скачиваний на пользователя за скользящие 24 часа. Лимит существует только
// ради устойчивости сервиса и снять его нельзя никакими деньгами: платных
// функций в сервисе нет вовсе. Счётчик общий для сайта и бота.
export const DAILY_DOWNLOAD_LIMIT = 20;


