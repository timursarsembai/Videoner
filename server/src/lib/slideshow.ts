// Слайдшоу из фото поста (фото-посты TikTok, карусели из одних снимков):
// по просьбе человека сервер склеивает снимки в одно видео. Если у поста есть
// своя звуковая дорожка (у фото-постов TikTok — music.playUrl, см.
// lib/tiktok-photo.ts), видео идёт со звуком: снимки сменяют друг друга по
// кругу, пока играет звук, — как в самом TikTok. Без дорожки — без звука.
//
// Качества в /info для поста из одних фото (info.service):
//   original  — сами фото (альбом), как раньше;
//   slideshow — только видео-слайдшоу;
//   gallery   — видео-слайдшоу и все фото одним альбомом.

export const SLIDESHOW = 'slideshow';
export const GALLERY = 'gallery';

export function isSlideshowQuality(quality: string | undefined): boolean {
  return quality === SLIDESHOW || quality === GALLERY;
}

// Слайдшоу имеет смысл, когда снимков больше одного или у поста есть звук:
// тогда и один снимок со звуком — полноценное видео.
export function photoQualities(photoCount: number, hasAudio = false): string[] {
  return photoCount > 1 || hasAudio ? ['original', SLIDESHOW, GALLERY] : ['original'];
}

// Звуковая дорожка фото-поста. Кладёт её в ответ разборщик площадки
// (tiktokPhotoInfoFromItem) — у yt-dlp такого поля нет.
export interface PostAudio {
  url: string;
  // Длина в секундах, если площадка её сообщила.
  duration?: number;
  title?: string;
}

export function postAudio(info: any): PostAudio | null {
  const audio = info?.vn_audio;
  return audio && typeof audio.url === 'string' && /^https:\/\//.test(audio.url) ? audio : null;
}

// Потолок длины видео со звуком: дорожки TikTok бывают и по 10 минут, но
// часовое видео из одной картинки — это уже не то, что человек просил.
export const MAX_AUDIO_SLIDESHOW_SECONDS = 30 * 60;

// Длина слайдшоу со звуком: пока играет дорожка, но не короче одного круга
// снимков (короткий звук тогда повторяется) и не длиннее потолка.
export function audioSlideshowSeconds(photoCount: number, audioSeconds: number | undefined): number {
  const cycle = photoCount * SECONDS_PER_PHOTO;
  const audio = audioSeconds && audioSeconds > 0 ? audioSeconds : cycle;
  return Math.min(Math.max(cycle, audio), MAX_AUDIO_SLIDESHOW_SECONDS);
}

// Сколько секунд показывается каждый снимок.
export const SECONDS_PER_PHOTO = 3;
// Кадр вертикальный, как у TikTok; снимки другой формы вписываются с полями.
const WIDTH = 1080;
const HEIGHT = 1920;
const FPS = 30;

// Аргументы ffmpeg: каждый снимок — отдельный вход, повторённый на
// SECONDS_PER_PHOTO секунд, приведённый к одному кадру и склеенный по порядку.
export function slideshowArgs(images: string[], output: string): string[] {
  const inputs = images.flatMap((image) => ['-loop', '1', '-t', String(SECONDS_PER_PHOTO), '-i', image]);
  const scaled = images
    .map(
      (_, i) =>
        `[${i}:v]scale=${WIDTH}:${HEIGHT}:force_original_aspect_ratio=decrease,` +
        `pad=${WIDTH}:${HEIGHT}:(ow-iw)/2:(oh-ih)/2:color=black,setsar=1,fps=${FPS},format=yuv420p[v${i}]`,
    )
    .join(';');
  const concat = `${images.map((_, i) => `[v${i}]`).join('')}concat=n=${images.length}:v=1:a=0[out]`;
  return [
    '-v', 'error', '-y',
    ...inputs,
    '-filter_complex', `${scaled};${concat}`,
    '-map', '[out]',
    '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '23',
    '-r', String(FPS),
    '-movflags', '+faststart',
    output,
  ];
}

// Звук к готовому немому слайдшоу. Видео не перекодируется (-c:v copy): один
// круг снимков просто повторяется (-stream_loop) — так и десятиминутная
// дорожка под одну картинку собирается за секунды. Короткий звук тоже
// повторяется; всё обрезается по seconds.
export function addAudioArgs(video: string, audio: string, seconds: number, output: string): string[] {
  return [
    '-v', 'error', '-y',
    '-stream_loop', '-1', '-i', video,
    '-stream_loop', '-1', '-i', audio,
    '-map', '0:v:0', '-map', '1:a:0',
    '-c:v', 'copy',
    '-c:a', 'aac', '-b:a', '128k',
    '-t', String(seconds),
    '-movflags', '+faststart',
    output,
  ];
}
