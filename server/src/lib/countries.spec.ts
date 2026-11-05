import { parseCountry } from './countries';

describe('parseCountry', () => {
  it('keeps ISO alpha-2 codes', () => {
    expect(parseCountry('KZ')).toBe('KZ');
    expect(parseCountry(' ru ')).toBe('RU');
  });

  it('drops Cloudflare service codes and garbage', () => {
    expect(parseCountry('XX')).toBeNull();
    expect(parseCountry('T1')).toBeNull();
    expect(parseCountry('KAZ')).toBeNull();
    expect(parseCountry('')).toBeNull();
    expect(parseCountry(undefined)).toBeNull();
    expect(parseCountry(7)).toBeNull();
  });
});
