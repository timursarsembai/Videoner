import { contentMeta } from './content-meta';
import { mentionsIslam, topicText, topicsOf, wordsPattern, type TopicItem } from './sensitive-topics';
import type { YtdlpVideoInfo } from '../types/youtube';

// Темы, которые Videoner не скачивает (решение владельца 18.11.2026):
//   эзотерика — запрещена сразу, по строгому списку слов и авторов;
//   прочие религии, кроме ислама, — пока «тихо»: ничего не запрещаем, а в
//   дашборде видно, что было бы запрещено (wouldBlockReligion). Включим после
//   недели проверки ошибок.
// Слово про ислам в названии, хэштегах или имени автора разрешает видео
// всегда: так проходят исламские лекции о порче и сглазе, о других верованиях
// и диспуты с христианами. Запрещённый автор — запрещён всегда.
//
// Список слов для запрета нарочно уже, чем для подсчёта (sensitive-topics.ts):
// «магия», «руны», «медитация», «зодиак», «чакры», «гороскоп», «аффирмации»,
// «амулет», «полнолуние» встречаются в играх, фильмах и видео для сна — их
// только считаем. Слова и авторов согласовал владелец 18.11.2026.
//
// Текст ошибки — английский, бот (friendlyError), сайт (DownloadErrorToast),
// расширение (shared.js friendlyError) и журнал ошибок (error-category.ts)
// узнают его по началу «Blocked content». О теме видео человеку не говорим.
export const BLOCKED_CONTENT_ERROR = 'Blocked content: Videoner does not download this video.';

// Ники в нижнем регистре.
const BLOCKED_AUTHORS = new Set(['olga_taro_guru']);

const ESOTERIC_BLOCK = wordsPattern([
  'таро=', 'таролог', 'расклад таро', 'гадани', 'гадалк', 'гадаю=', 'погадаю', 'приворот', 'отворот', 'порча=', 'порчи=', 'порчей=',
  // «порчу» само по себе — ещё и «я всё порчу», поэтому только в сочетаниях.
  'снять порчу', 'снятие порчи', 'навести порчу', 'навели порчу', 'на порчу', 'сглаз', 'натальн', 'астролог', 'нумеролог', 'матрица судьбы', 'матрицы судьбы',
  'матрице судьбы', 'дизайн человека', 'экстрасенс', 'ясновид', 'ченнелинг', 'хиромант', 'бал ашу', 'балгер',
  // «taro» без «t» не берём: это и клубень таро, и японское имя Таро.
  'tarot', 'astrolog', 'numerolog', 'natal chart', 'human design', 'psychic', 'palmistry', 'witchcraft',
]);

export function isBlockedAuthor(...names: (string | null | undefined)[]): boolean {
  return names.some((n) => !!n && BLOCKED_AUTHORS.has(n.trim().replace(/^@/, '').toLowerCase()));
}

// null — можно качать; иначе — почему нельзя (для журнала).
export function blockedReason(item: TopicItem & { authorId?: string | null }): 'author' | 'esoteric' | null {
  if (isBlockedAuthor(item.author, item.authorId)) return 'author';
  const text = topicText(item);
  if (mentionsIslam(text)) return null;
  return ESOTERIC_BLOCK.test(text) ? 'esoteric' : null;
}

// Тихий режим для религий: было бы запрещено, если бы запрет был включён.
export function wouldBlockReligion(item: TopicItem): boolean {
  if (isBlockedAuthor(item.author)) return false;
  const topics = topicsOf(item);
  return !topics.includes('islam') && topics.some((t) => t === 'christianity' || t === 'judaism' || t === 'eastern' || t === 'religion_other');
}

// Площадки, где описание — это подпись к посту (у Instagram название из
// yt-dlp — «Video by <ник>», а сам текст лежит в описании). У YouTube
// описание длинное и со ссылками на что угодно — его не смотрим.
const CAPTION_PLATFORMS = new Set(['instagram', 'tiktok', 'threads', 'facebook', 'twitter', 'reddit', 'pinterest', 'vk']);

// Ответ yt-dlp (одно видео или пост из нескольких) → запрещено ли.
export function blockedInfo(info: unknown, platform: string | null, url: string): 'author' | 'esoteric' | null {
  if (!info || typeof info !== 'object') return null;
  const meta = contentMeta(info as Partial<YtdlpVideoInfo> & Record<string, unknown>, platform, url);
  const str = (v: unknown) => (typeof v === 'string' ? v.slice(0, 3000) : '');
  const { title, description } = info as { title?: unknown; description?: unknown };
  return blockedReason({
    title: [str(title), platform && CAPTION_PLATFORMS.has(platform) ? str(description) : ''].join('\n'),
    hashtags: meta.hashtags,
    author: meta.authorName,
    authorId: meta.authorId,
  });
}
