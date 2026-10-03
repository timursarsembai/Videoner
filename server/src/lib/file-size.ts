import { DownloadSource } from '@prisma/client';
import { qualityHeight } from './youtube-budget';

// Примерный размер файла до скачивания — для подписи на кнопках качества и
// для отказа заранее, если файл заведомо не пролезет (боту Telegram не даёт
// отправить больше 2 ГБ, и человек полчаса ждал загрузку, которая всё равно
// не дошла бы до него).
//
// Именно ПРИМЕРНЫЙ: выбор формата делает yt-dlp (lib/helper.ts,
// parseDownloadOptions), а здесь повторена только его суть — лучшее
// разрешение не выше выбранного, у YouTube с предпочтением H.264, плюс
// звуковая дорожка, если видео пришло без неё. Неизвестный размер — null:
// тогда и подпись не ставим, и скачивание не запрещаем.

interface SizedFormat {
  format_id?: string;
  ext?: string;
  vcodec?: string;
  acodec?: string;
  width?: number;
  height?: number;
  filesize?: number;
  filesize_approx?: number;
  tbr?: number;
  source_preference?: number;
}

interface SizedInfo {
  duration?: number;
  formats?: SizedFormat[];
}

function formatSize(format: SizedFormat, duration?: number): number | null {
  if (format.filesize) return format.filesize;
  if (format.filesize_approx) return format.filesize_approx;
  // tbr — общий битрейт в кбит/с: потоковые форматы (HLS у VK, Rutube)
  // размера не сообщают, но битрейт и длительность знают почти всегда.
  if (format.tbr && duration) return Math.round(format.tbr * 125 * duration);
  return null;
}

// Кодек неизвестен (VK отдаёт прогрессивные url240..url2160 вовсе без него) —
// значит, это обычный файл со звуком: yt-dlp считает так же.
const hasVideo = (f: SizedFormat) => f.vcodec !== 'none' && !!f.height;
const hasAudio = (f: SizedFormat) =>
  f.acodec ? f.acodec !== 'none' : !f.vcodec;
// Ширины у прогрессивных файлов VK нет — тогда известна только высота.
const shortSide = (f: SizedFormat) =>
  f.width ? Math.min(f.width, f.height ?? 0) : (f.height ?? 0);
const longSide = (f: SizedFormat) =>
  f.width ? Math.max(f.width, f.height ?? 0) : (f.height ?? 0);

export function estimateVideoSize(
  info: SizedInfo,
  quality: string,
  platform: string,
): number | null {
  const formats = (info.formats ?? []).filter((f) => f.ext !== 'mhtml');
  const duration = info.duration;

  // Facebook присылает имя формата, а не высоту (см. parseDownloadOptions).
  if (platform === 'facebook' && (quality === 'hd' || quality === 'sd')) {
    const format = formats.find((f) => f.format_id === quality);
    return format ? formatSize(format, duration) : null;
  }

  const height = qualityHeight(quality);
  if (!height) return null;
  // Тот же кап, что и в селекторе формата: короткая сторона не выше
  // выбранного качества, длинная — не больше 16:9 от него. «720p» — это и
  // 1280x720, и вертикальный 720x1280. Вверх: у 480p длинная сторона 854.
  const long = Math.ceil((height * 16) / 9);
  const isYoutube = platform === 'youtube';
  const candidates = formats
    .filter(
      (f) => hasVideo(f) && shortSide(f) <= height && longSide(f) <= long,
    )
    .sort((a, b) => {
      // Не YouTube: yt-dlp берёт форматы, которые площадка пометила
      // предпочтительными (у VK это прогрессивные url240..url2160, хотя
      // рядом лежат DASH и HLS того же разрешения). Проверено на живом
      // ролике VK 03.10.2026.
      if (!isYoutube) {
        const pref = (b.source_preference ?? 0) - (a.source_preference ?? 0);
        if (pref !== 0) return pref;
      }
      const res = shortSide(b) - shortSide(a);
      if (res !== 0) return res;
      // YouTube: селектор просит H.264 (-S vcodec:avc1).
      if (isYoutube) {
        const avc =
          Number(b.vcodec?.startsWith('avc1')) -
          Number(a.vcodec?.startsWith('avc1'));
        if (avc !== 0) return avc;
      }
      return (b.tbr ?? 0) - (a.tbr ?? 0);
    });
  const video = candidates[0];
  if (!video) return null;

  let videoSize = formatSize(video, duration);
  if (videoSize === null) {
    // Размер выбранного неизвестен (те же url240 у VK) — берём самый
    // скромный битрейт среди форматов того же разрешения: прогрессивный файл
    // обычно ближе всего к нему (240p: оценка ~130 МБ, настоящий файл
    // 124,7 МБ). Это общий битрейт со звуком, дорожку не добавляем.
    const rates = formats
      .filter((f) => hasVideo(f) && shortSide(f) === shortSide(video) && f.tbr)
      .map((f) => f.tbr as number);
    if (!rates.length || !duration) return null;
    return Math.round(Math.min(...rates) * 125 * duration);
  }
  if (hasAudio(video)) return videoSize;

  // Видео без звука — к нему докачается лучшая дорожка (у YouTube — AAC).
  const audio = formats
    .filter((f) => f.acodec && f.acodec !== 'none' && f.vcodec === 'none')
    .sort((a, b) => {
      if (isYoutube) {
        const aac =
          Number(b.acodec?.startsWith('mp4a')) -
          Number(a.acodec?.startsWith('mp4a'));
        if (aac !== 0) return aac;
      }
      return (b.tbr ?? 0) - (a.tbr ?? 0);
    })[0];
  const audioSize = audio ? formatSize(audio, duration) : null;
  videoSize += audioSize ?? 0;
  return videoSize;
}

// mp3 с заданным битрейтом: размер зависит только от длительности.
export function estimateAudioSize(
  info: SizedInfo,
  quality: string,
): number | null {
  const kbps = /^(\d+)Kbps$/.exec(quality);
  if (!kbps || !info.duration) return null;
  return Math.round(Number(kbps[1]) * 125 * info.duration);
}

export function estimateSizes(
  info: SizedInfo,
  platform: string,
  qualities: { video: string[]; audio: string[] },
): { video: Record<string, number>; audio: Record<string, number> } {
  const video: Record<string, number> = {};
  const audio: Record<string, number> = {};
  for (const q of qualities.video) {
    const size = estimateVideoSize(info, q, platform);
    if (size) video[q] = size;
  }
  for (const q of qualities.audio) {
    const size = estimateAudioSize(info, q);
    if (size) audio[q] = size;
  }
  return { video, audio };
}

function envMegabytes(name: string, fallback: number): number {
  const value = Number(process.env[name]);
  return (Number.isFinite(value) && value > 0 ? value : fallback) * 1024 ** 2;
}

// Предел размера файла по источнику запроса. Бот упирается в Telegram:
// локальный Bot API принимает от бота до 2000 МБ. У сайта ограничение своё —
// место на диске и терпение человека; 4 ГБ — с запасом для любого ролика в
// разумном качестве.
export function maxFileBytes(source?: DownloadSource | string): number {
  return source === DownloadSource.BOT
    ? envMegabytes('MAX_FILE_SIZE_BOT_MB', 2000)
    : envMegabytes('MAX_FILE_SIZE_WEB_MB', 4096);
}

export function formatGigabytes(bytes: number): string {
  return `${(bytes / 1024 ** 3).toFixed(1)} GB`;
}
