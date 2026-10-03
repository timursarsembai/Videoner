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

const hasVideo = (f: SizedFormat) => !!f.vcodec && f.vcodec !== 'none';
const hasAudio = (f: SizedFormat) => !!f.acodec && f.acodec !== 'none';

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
  // Тот же кап по обеим сторонам, что и в селекторе формата: «720p» — это и
  // 1280x720, и вертикальный 720x1280. Вверх: у 480p длинная сторона 854.
  const long = Math.ceil((height * 16) / 9);
  const preferAvc = platform === 'youtube';
  const candidates = formats
    .filter(
      (f) =>
        hasVideo(f) &&
        f.width &&
        f.height &&
        f.width <= long &&
        f.height <= long,
    )
    .sort((a, b) => {
      const res =
        Math.min(b.width ?? 0, b.height ?? 0) -
        Math.min(a.width ?? 0, a.height ?? 0);
      if (res !== 0) return res;
      if (preferAvc) {
        const avc =
          Number(b.vcodec?.startsWith('avc1')) -
          Number(a.vcodec?.startsWith('avc1'));
        if (avc !== 0) return avc;
      }
      return (b.tbr ?? 0) - (a.tbr ?? 0);
    });
  const video = candidates[0];
  if (!video) return null;
  const videoSize = formatSize(video, duration);
  if (videoSize === null) return null;
  if (hasAudio(video)) return videoSize;

  // Видео без звука — к нему докачается лучшая дорожка (у YouTube — AAC).
  const audio = formats
    .filter((f) => hasAudio(f) && !hasVideo(f))
    .sort((a, b) => {
      if (preferAvc) {
        const aac =
          Number(b.acodec?.startsWith('mp4a')) -
          Number(a.acodec?.startsWith('mp4a'));
        if (aac !== 0) return aac;
      }
      return (b.tbr ?? 0) - (a.tbr ?? 0);
    })[0];
  const audioSize = audio ? formatSize(audio, duration) : null;
  return videoSize + (audioSize ?? 0);
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
