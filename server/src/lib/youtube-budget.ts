// Ограничения YouTube ради экономии трафика прокси.
//
// YouTube с IP дата-центра без прокси не работает (см. alwaysProxyPlatforms в
// ytdlp-process.service.ts), а прокси оплачивается за гигабайты. Именно
// YouTube съедает почти весь трафик: качают с него больше всего, и ролики там
// длиннее и крупнее, чем у остальных площадок. Поэтому для него три рычага:
// потолок качества, потолок пониже для длинных роликов и суточный лимит
// трафика на человека.
//
// Все значения задаются переменными окружения, чтобы подкручивать их по
// остатку трафика без правки кода и пересборки — достаточно перезапустить
// сервер с новым .env.

function envNumber(name: string, fallback: number): number {
  const raw = process.env[name];
  if (raw === undefined || raw.trim() === '') return fallback;
  const value = Number(raw);
  return Number.isFinite(value) && value >= 0 ? value : fallback;
}

// Потолок качества по короткой стороне кадра: 720 — это и 1280x720, и
// вертикальный 720x1280. 1080p весит примерно вдвое больше 720p, а 4K — ещё в
// несколько раз больше.
export function youtubeMaxHeight(duration?: number | null): number {
  const max = envNumber('YOUTUBE_MAX_HEIGHT', 720) || 720;
  const longMinutes = envNumber('YOUTUBE_LONG_VIDEO_MINUTES', 30);
  const longMax = envNumber('YOUTUBE_LONG_MAX_HEIGHT', 480) || max;
  // Длинные ролики дают основной объём: один часовой весит как десятки шортсов.
  if (longMinutes > 0 && duration && duration >= longMinutes * 60) {
    return Math.min(max, longMax);
  }
  return max;
}

// Высота из подписи качества: «720p» -> 720, «1280x720» -> 720 (короткая
// сторона, как в подписях из config.ts). Остальное (например «original»)
// качеством по высоте не является.
export function qualityHeight(quality: string | null | undefined): number | null {
  if (!quality) return null;
  const sized = /^(\d+)x(\d+)$/.exec(quality);
  if (sized) return Math.min(Number(sized[1]), Number(sized[2]));
  const labeled = /^(\d+)p$/.exec(quality);
  return labeled ? Number(labeled[1]) : null;
}

// Список качеств для выбора: только то, что не выше потолка. Порядок не
// меняем — сайт берёт из него качество по умолчанию.
export function capYoutubeQualities(
  qualities: string[],
  duration?: number | null,
): string[] {
  const cap = youtubeMaxHeight(duration);
  const allowed = qualities.filter((q) => {
    const height = qualityHeight(q);
    return height === null || height <= cap;
  });
  // У ролика все форматы выше потолка (так не бывает на настоящем YouTube, но
  // пустой список оставил бы человека без единой кнопки) — предлагаем сам
  // потолок, селектор формата возьмёт лучшее, что в него помещается.
  return allowed.length ? allowed : [`${cap}p`];
}

// Качество, которое реально скачиваем. Сервер не доверяет списку из /info:
// запрос могут прислать напрямую в API, или бот держит клавиатуру, показанную
// до смены потолка.
export function capYoutubeQuality<T extends string>(
  quality: T,
  duration?: number | null,
): T {
  const cap = youtubeMaxHeight(duration);
  const height = qualityHeight(quality);
  if (height === null || height <= cap) return quality;
  return `${cap}p` as T;
}

// Суточный лимит трафика YouTube на одного человека, в байтах. 0 — без лимита.
export function youtubeDailyLimitBytes(): number {
  return Math.round(envNumber('YOUTUBE_DAILY_GB', 2) * 1024 ** 3);
}
