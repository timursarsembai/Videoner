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
