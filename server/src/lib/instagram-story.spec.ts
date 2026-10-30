import { instagramStoryId, isInstagramStoryUrl, storyInfoFromItem } from './instagram-story';
import { entryKind, photoTargets } from './playlist';

describe('instagram story', () => {
  it('finds the story id in links', () => {
    expect(instagramStoryId('https://instagram.com/stories/raykov_nikita/4019148598951912741/')).toBe('4019148598951912741');
    expect(instagramStoryId('https://www.instagram.com/stories/a.b.c/123?utm_source=x')).toBe('123');
    expect(instagramStoryId('https://www.instagram.com/p/ABC/')).toBeNull();
    expect(instagramStoryId('https://www.instagram.com/stories/auto.01kk/')).toBeNull();
  });

  it('treats a stories link without an id as a story link, but not highlights', () => {
    expect(isInstagramStoryUrl('https://www.instagram.com/stories/auto.01kk/')).toBe(true);
    expect(isInstagramStoryUrl('https://www.instagram.com/stories/auto.01kk/123/')).toBe(true);
    expect(isInstagramStoryUrl('https://www.instagram.com/stories/highlights/1789/')).toBe(false);
    expect(isInstagramStoryUrl('https://www.instagram.com/reel/ABC/')).toBe(false);
  });

  it('maps a video story to a yt-dlp-like info with formats', () => {
    const info = storyInfoFromItem(
      {
        pk: '1',
        user: { username: 'nik' },
        video_duration: 7.5,
        video_versions: [{ url: 'https://cdn/v.mp4', width: 720, height: 1280 }],
        image_versions2: { candidates: [{ url: 'https://cdn/p.jpg', width: 720, height: 1280 }] },
      },
      'https://instagram.com/stories/nik/1/',
    );
    expect(info.title).toBe('Story by nik');
    expect(entryKind(info)).toBe('video');
    expect(info.formats[0]).toMatchObject({ url: 'https://cdn/v.mp4', height: 1280, ext: 'mp4' });
    expect(info.duration).toBe(7.5);
  });

  it('maps a photo story to the photo path', () => {
    const info = storyInfoFromItem(
      {
        pk: '2',
        user: { username: 'nik' },
        image_versions2: {
          candidates: [
            { url: 'https://cdn/p.jpg', width: 1080, height: 1920 },
            { url: 'https://cdn/small.jpg', width: 320, height: 568 },
          ],
        },
      },
      'https://instagram.com/stories/nik/2/',
    );
    expect(entryKind(info)).toBe('photo');
    expect(photoTargets(info)).toEqual([{ position: 1, url: 'https://cdn/p.jpg' }]);
  });
});
