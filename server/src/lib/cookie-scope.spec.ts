import { userCookieScopes } from './cookie-scope';

describe('cookie scopes', () => {
  it('group first, then the sender\'s own private login', () => {
    expect(userCookieScopes({ cookieScope: 'chat:-100', cookieFallbackScope: 'user:42', telegramId: 42 })).toEqual([
      'chat:-100',
      'user:42',
    ]);
  });

  it('never someone else\'s private login', () => {
    expect(userCookieScopes({ cookieScope: 'chat:-100', cookieFallbackScope: 'user:7', telegramId: 42 })).toEqual(['chat:-100']);
    expect(userCookieScopes({ cookieScope: 'chat:-100', cookieFallbackScope: 'user:42' })).toEqual(['chat:-100']);
    // В личке запасной области нет.
    expect(userCookieScopes({ cookieScope: 'user:42', cookieFallbackScope: 'user:42', telegramId: 42 })).toEqual(['user:42']);
  });

  it('nothing for site and extension requests', () => {
    expect(userCookieScopes({ source: 'WEB', cookieScope: 'chat:-100' })).toEqual([]);
    expect(userCookieScopes({ source: 'EXTENSION', cookieScope: 'user:1' })).toEqual([]);
  });
});
