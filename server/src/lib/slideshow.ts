// Слайдшоу из фото поста (фото-посты TikTok, карусели из одних снимков):
// по просьбе человека сервер склеивает снимки в одно видео — без звука.
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

// Слайдшоу имеет смысл, когда снимков больше одного.
export function photoQualities(photoCount: number): string[] {
  return photoCount > 1 ? ['original', SLIDESHOW, GALLERY] : ['original'];
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
