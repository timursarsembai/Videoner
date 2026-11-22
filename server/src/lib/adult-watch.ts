import { wouldBlockAdult } from './blocked-content';

// Наблюдение за теми, кто ищет 18+ (решение владельца 22.11.2026). Человек,
// которому за неделю хотя бы 3 раза отказали как «18+», — «под наблюдением»:
// для него посты X проверяются строже — признаки тихого режима
// (wouldBlockAdult: слова, значки, «rate me 1-10») уже запрещают, а не только
// считаются. Смотрим и на сам пост, и на всё, что раньше качали у этого
// автора: подписи у таких аккаунтов часто безобидные («running a little
// late»), а признаки — в соседних постах. Остальным людям ничего не меняется.
// Через 30 дней без новых отказов наблюдение снимается само; отказы строгого
// фильтра тоже считаются отказами и продлевают его.
//
// Человека не блокируем: обычные видео из X и другие площадки ему доступны.
// Здесь — чистые правила без базы (modules/adult-authors).

export const WATCH_MIN_REFUSALS = 3;
export const WATCH_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;
export const WATCH_KEEP_MS = 30 * 24 * 60 * 60 * 1000;
// Сколько истории отказов достаточно, чтобы решить: окно в 7 дней, конец
// которого не старше 30 дней.
export const WATCH_LOOKBACK_MS = WATCH_KEEP_MS + WATCH_WINDOW_MS;

// Текст начинается с «Adult content:» — бот, сайт и расширение показывают то
// же «контент для взрослых», журнал ошибок кладёт в «18+». Отличается от
// ADULT_AUTHOR_ERROR, чтобы дашборд считал такие отказы отдельно.
export const ADULT_WATCH_ERROR = 'Adult content: this X post looks like 18+ content; Videoner does not download it.';

// Под наблюдением ли человек по времени его отказов 18+.
export function isWatched(refusals: Date[], now = Date.now()): boolean {
  const times = refusals.map((d) => d.getTime()).filter((t) => t <= now && t > now - WATCH_LOOKBACK_MS).sort((a, b) => a - b);
  if (!times.length || times[times.length - 1] <= now - WATCH_KEEP_MS) return false;
  // Есть ли 3 отказа в пределах 7 дней, последний из которых — не старше 30 дней.
  for (let i = WATCH_MIN_REFUSALS - 1; i < times.length; i++) {
    if (times[i] > now - WATCH_KEEP_MS && times[i] - times[i - WATCH_MIN_REFUSALS + 1] <= WATCH_WINDOW_MS) return true;
  }
  return false;
}

// Есть ли признаки 18+ в ответе yt-dlp о посте X: подпись, описание, имя автора.
export function adultHintInInfo(info: unknown): boolean {
  if (!info || typeof info !== 'object') return false;
  const str = (v: unknown) => (typeof v === 'string' ? v.slice(0, 3000) : '');
  const i = info as { title?: unknown; description?: unknown; uploader?: unknown; entries?: unknown };
  const first = Array.isArray(i.entries) ? (i.entries[0] as typeof i | undefined) : undefined;
  return wouldBlockAdult({
    title: [str(i.title), str(i.description), str(first?.title), str(first?.description)].join('\n'),
    author: str(i.uploader) || str(first?.uploader),
  });
}
