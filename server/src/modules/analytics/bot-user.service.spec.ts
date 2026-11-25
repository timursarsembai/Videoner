import { BotUserService, PROMO_MIN_DOWNLOADS } from './bot-user.service';

// Подсказки после скачивания: правила выбора (сама запись — условный INSERT,
// он проверен на копии базы при разработке).
function service(opts: { blocked?: boolean; extension?: boolean; successful: number; shows: { key: string; ago: number }[]; inserted?: number; answer?: string[] }) {
  const prisma = {
    botUser: {
      findUnique: jest.fn().mockResolvedValue({
        id: 'u1',
        blockedAt: opts.blocked ? new Date() : null,
        extensionLinkedAt: opts.extension ? new Date() : null,
      }),
    },
    download: { count: jest.fn().mockResolvedValue(opts.successful) },
    promoShow: {
      findMany: jest
        .fn()
        .mockResolvedValue(opts.shows.map((s) => ({ key: s.key, shownAt: new Date(Date.now() - s.ago) }))),
    },
    surveyAnswer: {
      findMany: jest.fn().mockResolvedValue(opts.answer ? [{ survey: 'transcribe', choices: opts.answer }] : []),
    },
    $executeRaw: jest.fn().mockResolvedValue(opts.inserted ?? 1),
    $transaction: jest.fn(),
  };
  prisma.$transaction.mockImplementation((fn: (tx: unknown) => unknown) => fn(prisma));
  return { svc: new BotUserService(prisma as any), prisma };
}

const DAY = 24 * 60 * 60 * 1000;

describe('BotUserService.nextPromo', () => {
  it('waits for enough successful downloads', async () => {
    const { svc, prisma } = service({ successful: PROMO_MIN_DOWNLOADS - 1, shows: [] });
    expect(await svc.nextPromo(1, ['channel'])).toBeNull();
    expect(prisma.$executeRaw).not.toHaveBeenCalled();
  });

  it('shows the Reddit news first, from the first successful download', async () => {
    expect(await service({ successful: 1, shows: [] }).svc.nextPromo(1, ['channel', 'reddit'], () => 0)).toBe('reddit');
    expect(await service({ successful: 10, shows: [] }).svc.nextPromo(1, ['channel', 'reddit'], () => 0)).toBe('reddit');
    expect(await service({ successful: 0, shows: [] }).svc.nextPromo(1, ['reddit'])).toBeNull();
    expect(await service({ successful: 1, shows: [{ key: 'reddit', ago: 2 * DAY }] }).svc.nextPromo(1, ['channel', 'reddit'])).toBeNull();
  });

  it('shows nothing to blocked users or within a day of the last tip', async () => {
    expect(await service({ blocked: true, successful: 10, shows: [] }).svc.nextPromo(1, ['channel'])).toBeNull();
    expect(
      await service({ successful: 10, shows: [{ key: 'reddit', ago: DAY / 2 }] }).svc.nextPromo(1, ['channel']),
    ).toBeNull();
  });

  it('picks a random unseen tip', async () => {
    const { svc } = service({ successful: 10, shows: [{ key: 'reddit', ago: 2 * DAY }] });
    expect(await svc.nextPromo(1, ['reddit', 'channel', 'audio'], () => 0.99)).toBe('audio');
    expect(await svc.nextPromo(1, ['reddit', 'channel', 'audio'], () => 0)).toBe('channel');
  });

  it('stops when every tip was seen or a parallel call won', async () => {
    expect(
      await service({ successful: 10, shows: [{ key: 'channel', ago: 3 * DAY }] }).svc.nextPromo(1, ['channel']),
    ).toBeNull();
    expect(await service({ successful: 10, shows: [], inserted: 0 }).svc.nextPromo(1, ['channel'])).toBeNull();
  });

  it('skips the extension tip for people who connected an account from the extension', async () => {
    const { svc } = service({ extension: true, successful: 10, shows: [] });
    expect(await svc.nextPromo(1, ['extension'])).toBeNull();
    expect(await svc.nextPromo(1, ['extension', 'audio'], () => 0)).toBe('audio');
  });
});

describe('BotUserService.nextPromo: survey', () => {
  const run = (shows: { key: string; ago: number }[], answer?: string[]) => service({ successful: 10, shows, answer });

  it('never comes to people who voted, even without a recorded show', async () => {
    expect(await run([], ['text']).svc.nextPromo(1, ['survey'])).toBeNull();
    expect(await run([{ key: 'survey', ago: 8 * DAY }], ['none']).svc.nextPromo(1, ['survey'])).toBeNull();
    expect(await run([], ['text']).svc.nextPromo(1, ['survey', 'channel'])).toBe('channel');
  });

  it('comes once more after a week without a vote, then never', async () => {
    expect(await run([{ key: 'survey', ago: 6 * DAY }]).svc.nextPromo(1, ['survey'])).toBeNull();
    const { svc, prisma } = run([{ key: 'survey', ago: 8 * DAY }], []);
    expect(await svc.nextPromo(1, ['survey'])).toBe('survey');
    expect(prisma.$executeRaw.mock.calls.flat()).toContain('survey-again');
    expect(
      await run([{ key: 'survey', ago: 30 * DAY }, { key: 'survey-again', ago: 20 * DAY }]).svc.nextPromo(1, ['survey']),
    ).toBeNull();
  });
});

describe('BotUserService.promoCandidates', () => {
  it('lists what fits now without recording a show', async () => {
    const { svc, prisma } = service({ extension: true, successful: 10, shows: [{ key: 'reddit', ago: 2 * DAY }] });
    expect((await svc.promoCandidates(1, ['reddit', 'extension', 'channel']))?.fresh).toEqual(['channel']);
    expect(prisma.$executeRaw).not.toHaveBeenCalled();
  });
});
