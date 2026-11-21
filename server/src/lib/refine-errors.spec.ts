import { categorizeError } from './error-category';
import { userCookiesMayHelp } from './user-cookies';
import { FACEBOOK_LOGIN_ERROR, REGION_BLOCKED_ERROR, isFacebookLoginRedirect, rutubeId, rutubeRegionBlocked } from './refine-errors';

const reply = (body: unknown) => (async () => ({ json: async () => body })) as unknown as typeof fetch;
const FB_RAW =
  'WARNING: [generic] Falling back on generic information extractor ERROR: Unsupported URL: https://www.facebook.com/login/?next=https%3A%2F%2Fwww.facebook.com%2Fstory.php';

describe('refine-errors', () => {
  it('Facebook: переход на страницу входа — «нужен вход», пробуем аккаунт человека', () => {
    expect(isFacebookLoginRedirect(FB_RAW)).toBe(true);
    expect(isFacebookLoginRedirect('ERROR: Unsupported URL: https://example.com/login')).toBe(false);
    expect(categorizeError(FB_RAW)).toBe('LOGIN_REQUIRED');
    expect(userCookiesMayHelp(FB_RAW)).toBe(true);
    expect(categorizeError(FACEBOOK_LOGIN_ERROR)).toBe('LOGIN_REQUIRED');
  });

  it('Rutube: номер видео и блокировка по стране', async () => {
    const url = 'https://rutube.ru/video/831dddcf3e7c46b879c926a6401fa8c6/';
    expect(rutubeId(url)).toBe('831dddcf3e7c46b879c926a6401fa8c6');
    expect(rutubeId('https://rutube.ru/channel/123/')).toBeNull();
    expect(await rutubeRegionBlocked(url, reply({ detail: { type: 'blocking_rule' } }))).toBe(true);
    expect(await rutubeRegionBlocked(url, reply({ detail: { type: 'not_found' } }))).toBe(false);
    expect(await rutubeRegionBlocked(url, (async () => { throw new Error('net'); }) as unknown as typeof fetch)).toBeNull();
    expect(categorizeError(REGION_BLOCKED_ERROR)).toBe('REGION_BLOCKED');
  });
});
