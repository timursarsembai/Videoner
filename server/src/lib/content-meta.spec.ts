import { contentMeta, hashtagsOf, subredditOf } from './content-meta';

describe('contentMeta', () => {
  it('YouTube: автор канала и категория площадки', () => {
    expect(
      contentMeta({ uploader: 'Канал', uploader_id: '@kanal', uploader_url: 'https://www.youtube.com/@kanal', categories: ['Entertainment'], title: 'Ролик #юмор' } as any, 'youtube', 'https://youtu.be/x'),
    ).toEqual({ authorName: 'Канал', authorId: '@kanal', authorUrl: 'https://www.youtube.com/@kanal', category: 'Entertainment', hashtags: ['юмор'] });
  });

  it('Instagram без uploader — автор из «Video by <ник>»', () => {
    const m = contentMeta({ title: 'Video by japmei' } as any, 'instagram', 'https://www.instagram.com/p/X/');
    expect(m).toMatchObject({ authorName: 'japmei', authorUrl: 'https://www.instagram.com/japmei/', category: null });
  });

  it('TikTok: ник из ссылки, Reddit: сабреддит как категория', () => {
    expect(contentMeta({} as any, 'tiktok', 'https://www.tiktok.com/@some.user/video/1')).toMatchObject({ authorId: 'some.user' });
    expect(subredditOf('https://www.reddit.com/r/Funny/comments/abc/x/')).toBe('r/funny');
    expect(contentMeta({} as any, 'reddit', 'https://www.reddit.com/r/Cooking/comments/a/')).toMatchObject({ category: 'r/cooking' });
  });

  it('ссылки не http(s) не принимаем', () => {
    expect(contentMeta({ uploader: 'A', uploader_url: 'javascript:alert(1)' } as any, 'vk', 'https://vk.com/x').authorUrl).toBeNull();
  });

  it('хэштеги: теги площадки и #слова, без повторов, не больше 15', () => {
    expect(hashtagsOf({ tags: ['#Food', 'food'], title: '#Рецепт и #food', description: '' } as any)).toEqual(['рецепт', 'food']);
    const many = Array.from({ length: 30 }, (_, i) => `#tag${i}`).join(' ');
    expect(hashtagsOf({ title: many } as any)).toHaveLength(15);
  });
});
