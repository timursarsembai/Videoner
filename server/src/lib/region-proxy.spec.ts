import { isRegionBlock, RegionMemory } from './region-proxy';

describe('region-proxy', () => {
  it('узнаёт отказ TikTok «закрыто для страны»', () => {
    expect(isRegionBlock('ERROR: [TikTok] 7709303058416651572: Video not available, status code 10231', 'tiktok')).toBe(true);
    expect(isRegionBlock('statusMsg: cross_border_violation', 'tiktok')).toBe(true);
  });

  it('не трогает другие ошибки и площадки', () => {
    expect(isRegionBlock('Video not available, status code 10204', 'tiktok')).toBe(false);
    expect(isRegionBlock('status code 10231', 'vk')).toBe(false);
    expect(isRegionBlock('This video is not available in your country', 'rutube')).toBe(false);
    expect(isRegionBlock('status code 10231', null)).toBe(false);
  });

  it('помнит ролик, пока не истёк срок', () => {
    const m = new RegionMemory(1000, 10);
    const url = 'https://www.tiktok.com/@a/video/1';
    expect(m.has(url, 0)).toBe(false);
    m.remember(url, 0);
    expect(m.has(url + '#x', 500)).toBe(true);
    expect(m.has('https://www.tiktok.com/@a/video/2', 500)).toBe(false);
    expect(m.has(url, 1500)).toBe(false);
    expect(m.has(undefined)).toBe(false);
  });

  it('не копит больше предела', () => {
    const m = new RegionMemory(1000, 2);
    for (const n of [1, 2, 3]) m.remember(`https://www.tiktok.com/@a/video/${n}`, 0);
    expect(m.has('https://www.tiktok.com/@a/video/1', 1)).toBe(false);
    expect(m.has('https://www.tiktok.com/@a/video/3', 1)).toBe(true);
  });
});
