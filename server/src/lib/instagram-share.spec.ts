import { isInstagramShareUrl, resolveInstagramShare } from './instagram-share';

const reply = (body: unknown) => jest.fn().mockResolvedValue({ json: async () => body }) as unknown as typeof fetch;

describe('instagram-share', () => {
  it('узнаёт ссылки «Поделиться» и только их', () => {
    expect(isInstagramShareUrl('https://www.instagram.com/share/BAAfgKm-F8')).toBe(true);
    expect(isInstagramShareUrl('https://instagram.com/share/_zaTXqZES/')).toBe(true);
    expect(isInstagramShareUrl('https://www.instagram.com/share/reel/BAAfgKm-F8?igsh=x')).toBe(true);
    expect(isInstagramShareUrl('https://www.instagram.com/reel/DewN5b3CjhX/')).toBe(false);
    expect(isInstagramShareUrl('https://evil.example/share/BAAfgKm-F8')).toBe(false);
    expect(isInstagramShareUrl('https://www.instagram.com/share/a/b/c')).toBe(false);
  });

  it('раскрывает через резолвер и помнит ответ', async () => {
    const f = reply({ ok: true, url: 'https://www.instagram.com/reel/DewN5b3CjhX/' });
    expect(await resolveInstagramShare('https://www.instagram.com/share/AAA111', f)).toBe('https://www.instagram.com/reel/DewN5b3CjhX/');
    expect(await resolveInstagramShare('https://instagram.com/share/AAA111/', f)).toBe('https://www.instagram.com/reel/DewN5b3CjhX/');
    expect(f).toHaveBeenCalledTimes(1);
  });

  it('не верит чужим адресам и сбоям резолвера', async () => {
    expect(await resolveInstagramShare('https://www.instagram.com/share/BBB222', reply({ ok: true, url: 'https://evil.example/reel/x/' }))).toBeNull();
    expect(await resolveInstagramShare('https://www.instagram.com/share/BBB333', reply({ ok: false }))).toBeNull();
    const boom = jest.fn().mockRejectedValue(new Error('down')) as unknown as typeof fetch;
    expect(await resolveInstagramShare('https://www.instagram.com/share/BBB444', boom)).toBeNull();
  });
});
