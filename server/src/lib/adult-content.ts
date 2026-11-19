import { playlistEntries } from './playlist';

// Контент для взрослых Videoner не скачивает (решение владельца 15.11.2026):
// ни на одной площадке, в том числе от подключённого аккаунта человека.
// Распознаём по меткам самих площадок — анализа кадров нет. YouTube 18+ не
// блокируем: отметку там ставят и на насилие, новости, ужасы, а порно на
// YouTube запрещено правилами.
//
// Тексты — английские метки: бот (bot/src/helpers.ts friendlyError), сайт
// (web/components/common/DownloadErrorToast.tsx) и категория журнала ошибок
// (lib/error-category.ts) узнают их по началу «Adult content». Слов «sign in»,
// «log in», «private» в них нет нарочно: иначе бот и сайт приняли бы отказ за
// «нужен вход» и предложили подключить аккаунт.
export const ADULT_CONTENT_ERROR =
  'Adult content: the platform marked this post as 18+; Videoner does not download such content.';

// X не отдаёт твит без входа и вместо него присылает пустую заглушку: так он
// прячет «деликатный» контент. Так же, возможно, выглядят и твиты закрытых
// аккаунтов — поэтому текст для человека осторожный («обычно так помечен 18+»).
export const ADULT_TWEET_ERROR =
  'Adult content (X age-restricted tweet): X hides this tweet from viewers without an account; Videoner does not download 18+ content.';

export const TWEET_NO_VIDEO_ERROR = 'Tweet without video: there is no video in this tweet.';

// Площадки, чья отметка 18+ означает именно контент для взрослых.
const ADULT_FLAG_PLATFORMS = new Set(['twitter', 'reddit']);

export function isAdultContent(platform: string, info: any): boolean {
  if (!info || !ADULT_FLAG_PLATFORMS.has(platform)) return false;
  const flagged = (item: any) => Boolean(item) && ((item.age_limit ?? 0) >= 18 || item.over_18 === true);
  return flagged(info) || playlistEntries(info).some(flagged);
}

// Номер твита из ссылки x.com/<ник>/status/<id>.
export function tweetId(url: string): string | null {
  const match = /\/status(?:es)?\/(\d{5,25})/.exec(url);
  return match ? match[1] : null;
}

// Скрыт ли твит от тех, кто не вошёл. Спрашиваем у X тот же публичный адрес,
// которым X встраивает твиты на чужие сайты: обычный твит он отдаёт целиком
// (__typename "Tweet"), скрытый — пустой заглушкой "TweetTombstone".
// null — не удалось узнать (сеть, неожиданный ответ): тогда отвечаем как раньше.
export async function tweetHiddenFromGuests(
  url: string,
  fetchImpl: typeof fetch = fetch,
): Promise<boolean | null> {
  const id = tweetId(url);
  if (!id) return null;
  // Тот же расчёт токена, что у виджета X; сам токен X почти не проверяет.
  const token = ((Number(id) / 1e15) * Math.PI).toString(36).replace(/(0+|\.)/g, '');
  try {
    const response = await fetchImpl(
      `https://cdn.syndication.twimg.com/tweet-result?id=${id}&lang=en&token=${token}`,
      { signal: AbortSignal.timeout(8000) },
    );
    if (!response.ok) return null;
    const body = (await response.json()) as { __typename?: string };
    if (body.__typename === 'TweetTombstone') return true;
    if (body.__typename === 'Tweet') return false;
    return null;
  } catch {
    return null;
  }
}
