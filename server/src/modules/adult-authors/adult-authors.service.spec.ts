import { AdultAuthorsService } from './adult-authors.service';

function fakePrisma(rows: { platform: string; nick: string }[]) {
  const upserts: unknown[] = [];
  return {
    upserts,
    adultAuthor: {
      findMany: async () => rows,
      upsert: async (args: unknown) => {
        upserts.push(args);
        return {};
      },
    },
  };
}

describe('AdultAuthorsService', () => {
  it('запрещает посты аккаунтов из базы — по автору из ответа и по нику в ссылке', async () => {
    const prisma = fakePrisma([{ platform: 'twitter', nick: 'themiabrooks' }]);
    const s = new AdultAuthorsService(prisma as never);
    await s.onModuleInit();
    expect(s.isBlocked('twitter', { uploader_id: 'TheMiaBrooks' }, 'https://x.com/other/status/1')).toBe(true);
    expect(s.isBlocked('twitter', null, 'https://x.com/themiabrooks/status/1')).toBe(true);
    expect(s.isBlocked('twitter', { uploader_id: 'nasa' }, 'https://x.com/nasa/status/1')).toBe(false);
    expect(s.isBlocked('reddit', { uploader_id: 'themiabrooks' }, 'https://reddit.com/r/x')).toBe(false);
  });

  it('запоминает автора помеченного поста сразу и пишет в базу', async () => {
    const prisma = fakePrisma([]);
    const s = new AdultAuthorsService(prisma as never);
    await s.onModuleInit();
    s.remember('twitter', null, 'https://x.com/Kaeleepar/status/123');
    expect(s.isBlocked('twitter', { uploader_id: 'kaeleepar' }, 'https://x.com/i/status/9')).toBe(true);
    expect(prisma.upserts).toHaveLength(1);
    s.remember('reddit', { uploader_id: 'someone' }, 'https://reddit.com/r/x');
    expect(prisma.upserts).toHaveLength(1);
  });
});
