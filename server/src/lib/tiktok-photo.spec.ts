import { isTiktokPhotoUrl, tiktokPhotoInfoFromItem, tiktokPhotoUrlFromError } from './tiktok-photo';
import { entryKind, photoTargets, playlistEntries } from './playlist';

describe('tiktok photo posts', () => {
  it('recognizes photo URLs and photo URLs inside yt-dlp errors', () => {
    expect(isTiktokPhotoUrl('https://www.tiktok.com/@a.b/photo/7686999719368854805')).toBe(true);
    expect(isTiktokPhotoUrl('https://www.tiktok.com/@a.b/video/7686999719368854805')).toBe(false);
    expect(
      tiktokPhotoUrlFromError('ERROR: Unsupported URL: https://www.tiktok.com/@a.b/photo/123?_r=1'),
    ).toBe('https://www.tiktok.com/@a.b/photo/123');
    expect(tiktokPhotoUrlFromError('ERROR: Video unavailable')).toBeNull();
  });

  it('turns the page item into a playlist of photos', () => {
    const info = tiktokPhotoInfoFromItem(
      {
        id: '123',
        desc: 'Пост',
        imagePost: {
          images: [
            { imageURL: { urlList: ['https://cdn/a.jpg', 'https://cdn2/a.jpg'] }, imageWidth: 942, imageHeight: 1672 },
            { imageURL: { urlList: ['https://cdn/b.jpg'] }, imageWidth: 1080, imageHeight: 1080 },
          ],
        },
      },
      'https://www.tiktok.com/@a/photo/123',
    );
    expect(playlistEntries(info)).toHaveLength(2);
    expect(entryKind(playlistEntries(info)[0])).toBe('photo');
    expect(photoTargets(info)).toEqual([
      { position: 1, url: 'https://cdn/a.jpg' },
      { position: 2, url: 'https://cdn/b.jpg' },
    ]);
    expect(info.title).toBe('Пост');
  });
});
