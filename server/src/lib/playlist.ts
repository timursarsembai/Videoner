import { VideoInfoItem, YtdlpVideoInfo } from 'src/types/youtube';

// Пост из нескольких файлов (карусель Instagram, тред) приходит от yt-dlp как
// плейлист. Разбор держим в одном месте: и /info, и скачивание должны считать
// количество элементов ОДИНАКОВО — иначе сервер скачает три файла, а отдаст
// один, и расхождение всплывёт только у пользователя.

/** Элементы поста. Для обычного одиночного поста — он сам, одним элементом. */
export function playlistEntries(info: YtdlpVideoInfo): YtdlpVideoInfo[] {
  if (info?._type === 'playlist' && Array.isArray(info.entries)) {
    return info.entries.filter(Boolean);
  }
  return [info];
}

export function isPlaylist(info: YtdlpVideoInfo): boolean {
  return playlistEntries(info).length > 1;
}

/**
 * Элемент без единого формата — это фотография: yt-dlp кладёт снимки поста в
 * thumbnails и оставляет formats пустым (см. _extract_product_media в его
 * экстракторе Instagram). Скачивать их научимся вторым этапом, но различать
 * нужно уже сейчас: иначе фото в смешанной карусели молча превратится в
 * «не удалось скачать».
 */
export function entryKind(entry: YtdlpVideoInfo): 'video' | 'photo' {
  return (entry?.formats?.length ?? 0) > 0 ? 'video' : 'photo';
}

// Площадки, у которых мы умеем забирать фотографии. Ключ
// --ignore-no-formats-error включается только для них: на остальных
// «в посте нет видео» — это осмысленная ошибка, и глушить её нельзя,
// иначе вместо понятного сообщения человек получит пустое скачивание.
// Pinterest сюда попадает даром: его экстрактор в yt-dlp собирает варианты
// картинки в thumbnails и оставляет formats пустым ровно так же, как это делают
// Instagram и Threads, — то есть пин с картинкой для нас неотличим от элемента
// -фотографии. Оговорка одна: полноразмерного варианта Pinterest не отдаёт,
// самый крупный обычно 564 пикселя по ширине (замер 13.08.2026).
export const PHOTO_PLATFORMS = ['instagram', 'threads', 'pinterest'];

// Расширения, по которым файл поста опознаётся как фотография. В норме мы
// кладём снимки только как .jpg (см. savePhoto), но если перекодировать не
// удалось, файл остаётся в исходном виде — и должен всё равно считаться
// фотографией, а не видео.
const PHOTO_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'heic'];

export function isPhotoExtension(ext: string): boolean {
  return PHOTO_EXTENSIONS.includes(ext.toLowerCase());
}

/**
 * Расширение снимка — по самим байтам, а Content-Type лишь подсказка на случай
 * незнакомой сигнатуры.
 *
 * Нужно для запасного пути, когда перекодировать в JPEG не удалось и файл
 * сохраняется как есть. Смотреть тут в первую очередь на заголовок ответа было
 * бы непоследовательно: раз мы уже знаем, что это не JPEG (сигнатуру проверили
 * перед перекодировкой), назвать файл .jpg по умолчанию значило бы вернуть ту
 * самую ошибку, ради которой всё это и делается.
 */
export function photoExtension(
  bytes: Buffer,
  contentType: string | null,
): string {
  const ascii = (from: number, to: number) =>
    bytes.subarray(from, to).toString('latin1');

  if (bytes.length >= 12 && ascii(0, 4) === 'RIFF' && ascii(8, 12) === 'WEBP') {
    return 'webp';
  }
  if (bytes.length >= 8 && bytes[0] === 0x89 && ascii(1, 4) === 'PNG') {
    return 'png';
  }
  // HEIC — контейнер ISO-BMFF: после размера бокса идёт 'ftyp', следом марка.
  if (
    bytes.length >= 12 &&
    ascii(4, 8) === 'ftyp' &&
    ['heic', 'heix', 'hevc', 'heim', 'heis', 'mif1', 'msf1'].includes(
      ascii(8, 12),
    )
  ) {
    return 'heic';
  }
  if (bytes.length >= 2 && bytes[0] === 0xff && bytes[1] === 0xd8) {
    return 'jpg';
  }

  const type = (contentType || '').split(';')[0].trim().toLowerCase();
  return (
    {
      'image/jpeg': 'jpg',
      'image/jpg': 'jpg',
      'image/png': 'png',
      'image/webp': 'webp',
      'image/heic': 'heic',
      'image/heif': 'heic',
    }[type] || 'jpg'
  );
}

/**
 * Ссылка на полноразмерную фотографию элемента.
 *
 * yt-dlp кладёт снимки в thumbnails и переворачивает список кандидатов из
 * image_versions2, поэтому САМЫЙ КРУПНЫЙ — последний. Размеры в них не
 * заполнены (width/height пустые), выбрать «наибольший» по полям нельзя;
 * ориентир — только порядок. Проверено на посте с одним фото: последний
 * вариант отдал 1350x1688, предпоследний 1080x1350, а первый вообще
 * квадратную обрезку 1080x1080.
 */
export function bestPhotoUrl(entry: YtdlpVideoInfo): string | undefined {
  const thumbnails = (entry as any)?.thumbnails as
    | { url?: string }[]
    | undefined;
  if (!thumbnails?.length) return undefined;
  return thumbnails[thumbnails.length - 1]?.url;
}

/** Элементы-фотографии вместе с их местом в посте (нумерация с единицы). */
export function photoTargets(
  info: YtdlpVideoInfo,
): { position: number; url: string }[] {
  return playlistEntries(info)
    .map((entry, index) => ({ entry, position: index + 1 }))
    .filter((item) => entryKind(item.entry) === 'photo')
    .map((item) => ({ position: item.position, url: bestPhotoUrl(item.entry) }))
    .filter((item): item is { position: number; url: string } =>
      Boolean(item.url),
    );
}

export function hasVideoEntries(info: YtdlpVideoInfo): boolean {
  return playlistEntries(info).some((entry) => entryKind(entry) === 'video');
}

export function describeItems(info: YtdlpVideoInfo): VideoInfoItem[] {
  return playlistEntries(info).map((entry, index) => ({
    index: index + 1,
    id: entry?.id ?? `${index + 1}`,
    kind: entryKind(entry),
    width: entry?.width,
    height: entry?.height,
    duration: entry?.duration,
    thumbnail: entry?.thumbnail,
  }));
}

/**
 * Длительность поста для проверки лимита: у плейлиста собственной нет, а
 * складывать элементы неверно — ограничение задумано на один ролик. Берём
 * самый длинный.
 */
export function longestDuration(info: YtdlpVideoInfo): number | undefined {
  const durations = playlistEntries(info)
    .map((entry) => entry?.duration)
    .filter((d): d is number => typeof d === 'number');
  return durations.length ? Math.max(...durations) : undefined;
}
