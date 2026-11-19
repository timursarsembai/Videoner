import { adultAuthorNicks, nickFromInfo, nickFromUrl } from './adult-authors';

describe('adult-authors', () => {
  it('берёт ник из ссылки X', () => {
    expect(nickFromUrl('https://x.com/TheMiaBrooks/status/2123065768329793980/video/1')).toBe('themiabrooks');
    expect(nickFromUrl('https://mobile.twitter.com/piper_16/status/123456')).toBe('piper_16');
    expect(nickFromUrl('https://x.com/i/status/123456')).toBeNull();
    expect(nickFromUrl('https://x.com/themiabrooks')).toBeNull();
    expect(nickFromUrl('https://notx.com/themiabrooks/status/123456')).toBeNull();
  });

  it('берёт ник из ответа yt-dlp, в том числе из поста с несколькими видео', () => {
    expect(nickFromInfo({ uploader_id: 'MelissaStarova' })).toBe('melissastarova');
    expect(nickFromInfo({ entries: [{ uploader_id: 'evaaamar1e' }] })).toBe('evaaamar1e');
    expect(nickFromInfo({ uploader_id: '123 not a nick' })).toBeNull();
    expect(nickFromInfo(null)).toBeNull();
  });

  it('проверяет только X и оба ника сразу', () => {
    const url = 'https://x.com/someone/status/123456';
    expect(adultAuthorNicks('twitter', { uploader_id: 'MickyLuxLux' }, url)).toEqual(['mickyluxlux', 'someone']);
    expect(adultAuthorNicks('twitter', { uploader_id: 'Someone' }, url)).toEqual(['someone']);
    expect(adultAuthorNicks('reddit', { uploader_id: 'someone' }, url)).toEqual([]);
  });
});
