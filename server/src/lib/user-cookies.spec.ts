import {
  cookiePlatformFor,
  extractPlatformCookies,
  parseCookies,
  scrubCookieLines,
  sessionFailureKind,
  userCookiesMayHelp,
} from './user-cookies';

const FUTURE = Math.floor(Date.now() / 1000) + 3600 * 24 * 30;
const PAST = Math.floor(Date.now() / 1000) - 3600;

function netscape(rows: string[][]): string {
  return ['# Netscape HTTP Cookie File', ...rows.map((r) => r.join('\t'))].join('\n');
}

describe('user cookies', () => {
  it('keeps only the chosen platform and requires a session cookie', () => {
    const text = netscape([
      ['.instagram.com', 'TRUE', '/', 'TRUE', String(FUTURE), 'sessionid', 'abc'],
      ['.instagram.com', 'TRUE', '/', 'TRUE', String(FUTURE), 'csrftoken', 'x'],
      ['.mail.google.com', 'TRUE', '/', 'TRUE', String(FUTURE), 'SID', 'secret-mail'],
      ['.bank.example', 'TRUE', '/', 'TRUE', String(FUTURE), 'session', 'money'],
    ]);
    const res = extractPlatformCookies(text, 'instagram');
    expect(res.ok).toBe(true);
    if (!res.ok) return;
    expect(res.count).toBe(2);
    expect(res.netscape).toContain('sessionid\tabc');
    expect(res.netscape).not.toContain('secret-mail');
    expect(res.netscape).not.toContain('money');
  });

  it('detects the platform when not given', () => {
    const text = netscape([['.x.com', 'TRUE', '/', 'TRUE', String(FUTURE), 'auth_token', 't']]);
    const res = extractPlatformCookies(text);
    expect(res.ok && res.platform).toBe('twitter');
  });

  it('rejects files without a login', () => {
    const guest = netscape([['.instagram.com', 'TRUE', '/', 'TRUE', String(FUTURE), 'csrftoken', 'x']]);
    expect(extractPlatformCookies(guest, 'instagram')).toEqual({ ok: false, reason: 'no-session' });
    const expired = netscape([['.instagram.com', 'TRUE', '/', 'TRUE', String(PAST), 'sessionid', 'old']]);
    expect(extractPlatformCookies(expired, 'instagram')).toEqual({ ok: false, reason: 'no-session' });
    expect(extractPlatformCookies('nonsense', 'instagram')).toEqual({ ok: false, reason: 'empty' });
  });

  it('reads #HttpOnly_ lines and the chrome.cookies JSON shape', () => {
    const httpOnly = '#HttpOnly_.instagram.com\tTRUE\t/\tTRUE\t' + FUTURE + '\tsessionid\tabc';
    expect(parseCookies(httpOnly)).toHaveLength(1);
    const json = JSON.stringify([
      { domain: '.instagram.com', hostOnly: false, path: '/', secure: true, expirationDate: FUTURE + 0.5, name: 'sessionid', value: 'abc' },
      { domain: 'www.instagram.com', hostOnly: true, path: '/', secure: true, name: 'ig_nrcb', value: '1' },
    ]);
    const res = extractPlatformCookies(json, 'instagram');
    expect(res.ok).toBe(true);
    if (!res.ok) return;
    expect(res.netscape).toContain(`.instagram.com\tTRUE\t/\tTRUE\t${FUTURE}\tsessionid\tabc`);
    expect(res.netscape).toContain('www.instagram.com\tFALSE\t/\tTRUE\t0\tig_nrcb\t1');
  });

  it('drops fields that would break the file format', () => {
    const json = JSON.stringify([
      { domain: '.instagram.com', path: '/', secure: true, expirationDate: FUTURE, name: 'sessionid', value: 'abc' },
      { domain: '.instagram.com', path: '/', secure: true, expirationDate: FUTURE, name: 'evil', value: 'a\nb' },
    ]);
    const res = extractPlatformCookies(json, 'instagram');
    expect(res.ok && res.netscape.includes('evil')).toBe(false);
  });

  it('reads Netscape lines whose tabs became spaces (pasted from a phone)', () => {
    const text = `# Netscape HTTP Cookie File\n.instagram.com TRUE / TRUE ${FUTURE} sessionid abc\n.instagram.com TRUE / TRUE ${FUTURE} csrftoken x`;
    const res = extractPlatformCookies(text, 'instagram');
    expect(res.ok && res.count).toBe(2);
    expect(res.ok && res.netscape).toContain('sessionid\tabc');
  });

  it('maps threads to instagram cookies', () => {
    expect(cookiePlatformFor('threads')).toBe('instagram');
    expect(cookiePlatformFor('rutube')).toBeNull();
  });

  it('tells a dead session from an ambiguous answer and a rate limit', () => {
    expect(sessionFailureKind('ERROR: checkpoint_required')).toBe('dead');
    expect(sessionFailureKind('HTTP Error 401: Unauthorized')).toBe('dead');
    expect(sessionFailureKind('[instagram:story] 1: This content is unreachable. Use --cookies')).toBe('ambiguous');
    expect(sessionFailureKind('Requested content is not available, rate-limit reached or login required')).toBeNull();
    expect(sessionFailureKind('Please wait a few minutes before you try again')).toBeNull();
    expect(sessionFailureKind('Video unavailable')).toBeNull();
  });

  it('tries user cookies only for login-like failures', () => {
    expect(userCookiesMayHelp('This content is unreachable')).toBe(true);
    expect(userCookiesMayHelp('This video is private')).toBe(true);
    expect(userCookiesMayHelp("Sign in to confirm you're not a bot")).toBe(false);
    expect(userCookiesMayHelp('Read timed out')).toBe(false);
  });

  it('scrubs lines that may carry cookie values', () => {
    const msg = 'ERROR: boom\nWARNING: skipping cookie file entry due to invalid length: x\n.instagram.com\tTRUE\t/\tTRUE\t0\tsessionid\tsecret';
    expect(scrubCookieLines(msg)).toBe('ERROR: boom');
    // Обычная ошибка про вход остаётся целиком: по ней бот объясняет сторис.
    const story = 'ERROR: [instagram:story] 1: This content is unreachable. Use --cookies-from-browser or --cookies';
    expect(scrubCookieLines(story)).toBe(story);
  });
});
