import {
  DownloadKeyWord,
  DownloadOptions,
  Platform,
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
  platform?: Platform,
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
    // аудиодорожки; без фолбэка на "b" yt-dlp падает с "Requested format is not available".
    // У Rutube на каждое качество два CDN-зеркала: format_id с суффиксом "-0"
    // (cdn-video-1.rtbcdn.ru) отдаёт файл нормально, "-1" (river-1.rutube.ru)
    // стабильно падает с 403 Forbidden — поэтому "-0" пробуем первым; для
    // остальных площадок такого суффикса не бывает, и эта ветка просто не
    // матчится, откатываясь на прежнюю цепочку без изменений.
    // Facebook присылает не высоту, а ИМЯ формата — 'hd' или 'sd'. Список
    // качеств для него захардкожен (`info.service.ts`, `getPlatformFormats`)
    // именно потому, что размеры прогрессивных форматов заранее неизвестны, и
    // бот с сайтом шлют обратно ровно эти строки. Ни 'p', ни 'x' в них нет,
    // поэтому `height` выше выходит null — и ветка с кодеками ниже для
    // НАСТОЯЩИХ запросов не срабатывала вовсе, работая только на прямые
    // обращения к API с «1080p». Первый заход на этот баг (19.08.2026) я и
    // проверил ровно так — через API, теми качествами, которых ни бот, ни сайт
    // не отправляют, — и фикс уехал в прод мёртвым. Поймано на ревью в тот же
    // день.
    const facebookProgressive =
      platform === 'facebook' && (quality === 'hd' || quality === 'sd')
        ? quality
        : null;

    if (facebookProgressive) {
      // Отдаём ровно тот формат, который выбрал пользователь: `hd`/`sd` у
      // Facebook — это муксованные H.264 + AAC, единственное, что играет на
      // iPhone (все его DASH-потоки — VP9 или AV1, подробности ниже, в общей
      // ветке про кодеки). Кап по разрешению здесь не нужен и невозможен: у
      // этих форматов нет ни ширины, ни высоты в метаданных, а выбор из двух
      // сделан пользователем явно.
      //
      // Фолбэки: `b` — лучший муксованный (то есть тот же `hd`, если id вдруг
      // переименуют), и лишь последним DASH, чтобы редкий пост совсем без
      // прогрессивных форматов скачался хоть в каком-то виде, а не упал.
      formatArr = [
        '-f',
        `${facebookProgressive}/b/bv*+ba`,
        '-S',
        'vcodec:avc1,acodec:aac',
        '--merge-output-format',
        'mp4',
      ];
    } else if (height && platform === 'youtube') {
      // Ярлыки качества в config.ts учитывают ориентацию: и 1920x1080, и
      // 1080x1920 подписаны как "1080p". А фильтр height<=1080 для вертикального
      // ролика значит совсем другое — он режет выбор до 608x1080, то есть отдаёт
      // МЕНЬШЕ, чем обещано в интерфейсе (на "720p" пользователь получал 360x640).
      // Хуже того, на этих промежуточных разрешениях YouTube публикует только
      // VP9/AV1 — H.264 там не существует, и такой файл отказывается принимать
      // WhatsApp, хотя сам он воспроизводится нормально (поймано 05.08.2026).
      //
      // Поэтому кап ставим по ОБЕИМ сторонам, считая длинную как 16:9 от
      // запрошенного качества, а выбор внутри отдаём сортировке: в yt-dlp res —
      // это МЕНЬШАЯ сторона формата, поэтому ориентация учитывается сама, без
      // разбора соотношения сторон на нашей стороне. Дальше предпочитаем
      // H.264+AAC — они есть на всех "настоящих" разрешениях YouTube и
      // гарантируют совместимость с WhatsApp и старыми плеерами.
      //
      // Только для YouTube: на Instagram такой же селектор переключается с
      // муксованного формата на VP9 1080x1920 — выше разрешением, но так же
      // нешарибельно, поэтому остальные площадки оставлены как были.
      // Первым идёт bv (чистая видеодорожка), иначе на горизонтальных роликах
      // подхватывается муксованный HLS (формат 96) вместо DASH.
      const long = Math.round((Number(height) * 16) / 9);
      const cap = `[width<=${long}][height<=${long}]`;
      formatArr = [
        '-f',
        `bv${cap}[ext=mp4]+ba/bv${cap}+ba/bv*${cap}+ba/b${cap}[ext=mp4]/b${cap}/b`,
        '-S',
        `res:${height},vcodec:avc1,acodec:aac`,
        '--merge-output-format',
        'mp4',
      ];
    } else if (
      height &&
      (platform === 'instagram' ||
        platform === 'tiktok' ||
        platform === 'facebook')
    ) {
      // Instagram раздаёт рилс двумя способами: DASH-потоки — ВСЕГДА VP9, и
      // отдельный муксованный mp4 — H.264 + AAC. iPhone не декодирует VP9
      // аппаратно: звук идёт, а картинка стоит на первом кадре (Telegram
      // Desktop тот же файл играет нормально, у него свой декодер, поэтому
      // баг долго выглядел как «показалось»). Поймано 07.08.2026.
      //
      // Прежняя цепочка промахивалась мимо H.264 дважды. Во-первых, у
      // муксованного формата yt-dlp не знает ни ширины, ни высоты, а фильтр
      // `[height<=N]` без «?» выбрасывает всё, где поле неизвестно. Во-вторых,
      // для вертикального ролика `height<=1080` отсекает и 1080x1920, и даже
      // 720x1280 — оставался единственный проходящий VP9 540x960 на 137 кбит/с.
      // То есть на запрос «1080p» приходил файл вчетверо меньше нужного, да
      // ещё и не воспроизводимый на телефоне.
      //
      // Поэтому: «?» в фильтрах (неизвестное разрешение не повод отбросить
      // формат), кап по ОБЕИМ сторонам как у YouTube, и первым идёт `b` —
      // лучший МУКСОВАННЫЙ формат. VP9-потоки видео-только, в `b` они не
      // попадают в принципе, так что H.264 выигрывает не по сортировке, а по
      // самому способу отбора. Сортировка добавлена на случай, если муксованных
      // вариантов станет несколько.
      //
      // Побочный эффект, осознанный: у Instagram муксованный вариант обычно
      // один (720x1280), поэтому выбор качества на рилсах почти не влияет на
      // результат. Отдать вместо него VP9 покрупнее — значит вернуть файл,
      // который не играет у половины пользователей.
      //
      // TikTok здесь же, но по другой причине (найдено 07.08.2026). Он отдаёт
      // два семейства форматов: h264 (576x576) и bytevc1/HEVC (720x720). В
      // списке форматов у ОБОИХ указан звук aac — и для HEVC это неправда:
      // скачанный файл содержит только видеодорожку. Прежняя цепочка брала
      // лучшее по разрешению, то есть ровно HEVC, и с TikTok приходили НЕМЫЕ
      // ролики. Приоритет avc1 возвращает звук ценой 576 вместо 720 —
      // размен очевидный, немое видео не нужно никому. Проверять acodec
      // фильтром бессмысленно: метаданные врут именно про то, что проверяем.
      //
      // Facebook — та же болезнь, что у Instagram, только запущеннее (поймано
      // 19.08.2026). Все его DASH-потоки video-only и кодируются VP9, а на
      // роликах последних месяцев — AV1. Аппаратного декодера ни для VP9, ни
      // для AV1 у большинства iPhone нет, и выходит ровно то же самое: звук
      // идёт, картинка стоит на первом кадре. На десктопе тот же файл играет
      // программным декодером и выглядит исправным, поэтому жалоба приходит
      // только с телефона.
      //
      // H.264 у Facebook лежит в двух прогрессивных форматах — `sd` (360x640)
      // и `hd` (обычно 576-720 по короткой стороне). Ширины и высоты yt-dlp у
      // них не знает, поэтому из списка качеств они выпадают, а прежняя
      // цепочка с `[height<=N]` без «?» выбрасывала их совсем: на «1080p»
      // вертикального рилса единственным проходящим форматом оставался VP9
      // 540x960 — вчетверо меньше обещанного и не воспроизводимый на телефоне,
      // который его и попросил.
      //
      // Сюда Facebook попадает ТОЛЬКО с числовым качеством, то есть от
      // прямых обращений к API: бот и сайт шлют 'hd'/'sd' и уходят в отдельную
      // ветку выше. Разрешения `sd`/`hd` заранее неизвестны, поэтому нужный
      // выбираем по запрошенной высоте: до 480p — `sd`, выше — `hd`. Кап при
      // этом обходится (на «240p» вернётся `sd` 360x640) — осознанно: H.264
      // ниже 360 у Facebook нет вовсе, а VP9 240p не играет на телефоне.
      // Пропадут эти форматы — цепочка откатится на общий отбор, где
      // сортировка по-прежнему предпочтёт avc1.
      //
      // Побочный эффект тот же, что у Instagram: выше ~720p Facebook в H.264
      // не отдаёт, и на «1080p» приходит `hd`. Отдать вместо него AV1
      // 1080x1920 — значит вернуть файл, который на телефоне не играет.
      const long = Math.round((Number(height) * 16) / 9);
      const cap = `[width<=?${long}][height<=?${long}]`;
      // Прогрессивный H.264 Facebook: у остальных площадок этой ветки таких
      // форматов нет, там строка пустая и цепочка остаётся прежней.
      const progressive =
        platform === 'facebook' ? (Number(height) <= 480 ? 'sd/' : 'hd/') : '';
      formatArr = [
        '-f',
        `${progressive}b${cap}/bv*${cap}+ba/b/bv*+ba`,
        '-S',
        `vcodec:avc1,res:${height},acodec:aac`,
        '--merge-output-format',
        'mp4',
      ];
    } else if (height) {
      formatArr = [
        '-f',
        `b[height<=${height}][format_id$=-0]/bv*[height<=${height}][ext=mp4]+ba/bv*[height<=${height}]+ba/b[height<=${height}][ext=mp4]/b[height<=${height}]/b`,
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
  if ((options as any).playlist) {
    // Пост из нескольких файлов: сбой на одном элементе не должен уносить
    // остальные. Без этого фото в смешанной карусели — у него нет ни одного
    // формата — обрывало бы скачивание всего поста.
    // --ignore-errors пропускает сбойный элемент, но yt-dlp всё равно пишет
    // «ERROR: No video formats found» в stderr, и наш обработчик считает это
    // провалом всего поста — видео скачалось, а скачивание помечено сбойным.
    // Второй ключ убирает и саму ошибку: элементы без форматов — это
    // фотографии, мы забираем их отдельно.
    formatArr = formatArr.concat('--ignore-errors', '--ignore-no-formats-error');
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
    // Нет точного размера в карте — подписываем по короткой стороне, тем же
    // правилом, по которому построена сама карта. Иначе пользователь видел
    // сырое «720x864» вместо «720p» (кадр 5:6 из Threads, 11.08.2026).
    qualityLabel:
      videoQualityLabel[format.resolution] ||
      (format.width && format.height
        ? `${Math.min(format.width, format.height)}p`
        : format.resolution),
  }));

  // map to qualityLabel and remove 144p
  const videoFormats = formatsWithQualityLabel
    .filter((format) => format.qualityLabel !== '144p')
    .map((format) => format.qualityLabel);

  return [...new Set(videoFormats)];
};
