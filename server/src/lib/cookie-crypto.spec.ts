import { randomBytes } from 'crypto';
import { cookieCryptoEnabled, decryptCookies, encryptCookies } from './cookie-crypto';

describe('cookie crypto', () => {
  const saved = process.env.USER_COOKIES_KEY;
  afterEach(() => {
    process.env.USER_COOKIES_KEY = saved;
  });

  it('round-trips and uses a fresh iv every time', () => {
    process.env.USER_COOKIES_KEY = randomBytes(32).toString('base64');
    const a = encryptCookies('sessionid\tabc');
    const b = encryptCookies('sessionid\tabc');
    expect(a.equals(b)).toBe(false);
    expect(decryptCookies(a)).toBe('sessionid\tabc');
  });

  it('refuses tampered data and a wrong key', () => {
    process.env.USER_COOKIES_KEY = randomBytes(32).toString('base64');
    const blob = encryptCookies('secret');
    blob[blob.length - 1] ^= 1;
    expect(() => decryptCookies(blob)).toThrow();
    const good = encryptCookies('secret');
    process.env.USER_COOKIES_KEY = randomBytes(32).toString('base64');
    expect(() => decryptCookies(good)).toThrow();
  });

  it('is disabled without a valid 32-byte key', () => {
    delete process.env.USER_COOKIES_KEY;
    expect(cookieCryptoEnabled()).toBe(false);
    process.env.USER_COOKIES_KEY = Buffer.from('short').toString('base64');
    expect(cookieCryptoEnabled()).toBe(false);
    expect(() => encryptCookies('x')).toThrow();
  });
});
