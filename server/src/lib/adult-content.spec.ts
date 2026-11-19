import { isAdultContent, tweetHiddenFromGuests, tweetId } from './adult-content';
import { categorizeError } from './error-category';
import { ADULT_CONTENT_ERROR, ADULT_TWEET_ERROR, TWEET_NO_VIDEO_ERROR } from './adult-content';

const reply = (body: unknown, ok = true) =>
  (async () => ({ ok, json: async () => body })) as unknown as typeof fetch;

describe('adult-content', () => {
  it('X и Reddit с отметкой 18+ — взрослый контент, YouTube 18+ — нет', () => {
    expect(isAdultContent('twitter', { age_limit: 18 })).toBe(true);
    expect(isAdultContent('reddit', { over_18: true })).toBe(true);
    expect(isAdultContent('twitter', { _type: 'playlist', entries: [{ age_limit: 0 }, { age_limit: 18 }] })).toBe(true);
    expect(isAdultContent('twitter', { age_limit: 0 })).toBe(false);
    expect(isAdultContent('youtube', { age_limit: 18 })).toBe(false);
  });

  it('Reddit: 18+ в обычном сабреддите без признаков откровенного — пропускаем', () => {
    const rock = { over_18: true, subreddit_over18: false, title: 'Jhon Perlaza threw a rock at the referee' };
    expect(isAdultContent('reddit', rock)).toBe(false);
    expect(isAdultContent('reddit', { ...rock, subreddit_over18: true })).toBe(true);
    expect(isAdultContent('reddit', { over_18: true, title: rock.title })).toBe(true);
    expect(isAdultContent('reddit', { ...rock, title: 'onlyfans leak 🍑' })).toBe(true);
    expect(isAdultContent('reddit', { ...rock, description: 'nsfw nudes' })).toBe(true);
    expect(isAdultContent('reddit', { ...rock, title: '[NSFW] Horrible leg break, 18+' })).toBe(false);
    expect(isAdultContent('twitter', { age_limit: 18, subreddit_over18: false, title: 'goal' })).toBe(true);
  });

  it('номер твита из ссылки', () => {
    expect(tweetId('https://x.com/a/status/2121375429936156786?s=46')).toBe('2121375429936156786');
    expect(tweetId('https://x.com/a/status/2119800847857291362/video/1')).toBe('2119800847857291362');
    expect(tweetId('https://x.com/a')).toBeNull();
  });

  it('заглушка X — скрытый твит, обычный ответ — нет, сбой — неизвестно', async () => {
    const url = 'https://x.com/a/status/2121375429936156786';
    expect(await tweetHiddenFromGuests(url, reply({ __typename: 'TweetTombstone', tombstone: {} }))).toBe(true);
    expect(await tweetHiddenFromGuests(url, reply({ __typename: 'Tweet' }))).toBe(false);
    expect(await tweetHiddenFromGuests(url, reply({}, false))).toBeNull();
  });

  it('категории журнала ошибок', () => {
    expect(categorizeError(ADULT_CONTENT_ERROR)).toBe('ADULT_CONTENT');
    expect(categorizeError(ADULT_TWEET_ERROR)).toBe('ADULT_CONTENT');
    expect(categorizeError(TWEET_NO_VIDEO_ERROR)).toBe('NO_VIDEO_CONTENT');
  });
});
