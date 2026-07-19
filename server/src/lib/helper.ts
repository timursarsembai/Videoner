import {
  DownloadKeyWord,
  DownloadOptions,
  ProgressType,
  StreamKeyWord,
  StreamOptions,
} from 'src/types';
import { formatBytes, percentage, secondsToHms, thr } from './utils';
import { YtdlpVideoInfo } from 'src/types/youtube';
import {
  videoQualityLabel,
  audioQualityLabel,
  videoExtensionLabel,
  audioExtensionLabel,
} from './config';

export function stringToProgress(str: string): ProgressType | undefined {
  try {
    if (!str.includes('bright')) thr();

    const jsonStr = str.split('\r')?.[1]?.trim()?.split('-')?.[1];
    if (!jsonStr) thr();

    const object = JSON.parse(jsonStr);

    const total = isNaN(Number(object.total))
      ? Number(object.total_estimate)
      : Number(object.total);

    return {
      status: object.status,
      downloaded: Number(object.downloaded),
      downloaded_str: formatBytes(object.downloaded),
      total: total,
      total_str: formatBytes(total),
      speed: Number(object.speed),
      speed_str: formatBytes(object.speed) + '/s',
      eta: Number(object.eta),
      eta_str: secondsToHms(object.eta),
      percentage: percentage(object.downloaded, total),
      percentage_str: percentage(object.downloaded, total) + '%',
    };
  } catch (err) {
    return undefined;
  }
}

const ByQualityAudio = {
  highest: '0',
  '64Kbps': '64K',
  '96Kbps': '96K',
  '128Kbps': '128K',
  '192Kbps': '192K',
  '256Kbps': '256K',
  '320Kbps': '320K',
  lowest: '10',
};

export function parseDownloadOptions<T extends DownloadKeyWord>(
  options?: DownloadOptions<T>,
) {
  if (!options || Object.keys(options).length === 0) {
    return ['-f', 'bv*+ba'];
  }

  let formatArr: string[] = [];
  const { filter, quality, command, format, output } = options;

  if (command && command.length) {
    return command;
  }

  if (filter === 'audioonly') {
    formatArr = [
      '-x',
      '--audio-format',
      format ? format : 'mp3',
      '--audio-quality',
      ByQualityAudio[quality] || '5',
    ];
  }

  if (filter === 'mergevideo') {
    // quality can be 1080p or 1920x1080 handle both separat
    const height = quality?.includes('x')
      ? quality?.split('x')[1]
      : quality?.includes('p')
        ? quality?.split('p')[0]
        : null;

    // Цепочка фолбэков: у YouTube видео и аудио лежат отдельными потоками (bv*+ba),
    // а у TikTok/Instagram/Twitter ролик — один муксованный файл (b) без отдельной
    // аудиодорожки; без фолбэка на "b" yt-dlp падает с "Requested format is not available"
    if (height) {
      formatArr = [
        '-f',
        `bv*[height<=${height}][ext=mp4]+ba/bv*[height<=${height}]+ba/b[height<=${height}][ext=mp4]/b[height<=${height}]/b`,
        '--merge-output-format',
        'mp4',
      ];
    } else {
      formatArr = [
        '-f',
        'bv*[ext=mp4]+ba/bv*+ba/b[ext=mp4]/b',
        '--merge-output-format',
        'mp4',
      ];
    }
  }

  if ((options as any).embedSubs) {
    formatArr = formatArr.concat('--embed-subs');
  }
  if ((options as any).embedThumbnail) {
    formatArr = formatArr.concat('--embed-thumbnail');
  }

  return formatArr;
}

export const getVideoFormats = (info: YtdlpVideoInfo) => {
  const formats = info.formats.filter((format) => format.ext !== 'mhtml');

  // where width and  height is not null
  const allVideoFormats = formats.filter(
    (format) => format.width && format.height,
  );

  // get unique by height
  const uniqueVideoFormats = allVideoFormats.filter(
    (format, index, self) =>
      index === self.findIndex((t) => t.height === format.height),
  );

  // map to qualityLabel
  const formatsWithQualityLabel = uniqueVideoFormats.map((format) => ({
    ...format,
    qualityLabel: videoQualityLabel[format.resolution] || format.resolution,
  }));

  // map to qualityLabel and remove 144p
  const videoFormats = formatsWithQualityLabel
    .filter((format) => format.qualityLabel !== '144p')
    .map((format) => format.qualityLabel);

  return [...new Set(videoFormats)];
};
