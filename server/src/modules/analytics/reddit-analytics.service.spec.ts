import { RedditAnalyticsService } from './reddit-analytics.service';

describe('Reddit dashboard summary', () => {
  const range = { from: new Date('2026-11-16T00:00:00Z'), to: new Date('2026-11-17T00:00:00Z') };
  it('does not mix metadata refusals, policy refusals and pending work into file success rate', async () => {
    const daily = [
      { day: '2026-11-16', source: 'BOT', completed: 2, failed: 0, pending: 0, linkFailures: 1, policyRefusals: 0, cached: 1, bytes: 300 },
      { day: '2026-11-16', source: 'WEB', completed: 0, failed: 1, pending: 4, linkFailures: 8, policyRefusals: 3, cached: 0, bytes: 0 },
    ];
    const service = new RedditAnalyticsService({ $queryRaw: jest.fn().mockResolvedValue(daily) } as any);
    const result = await service.summary(range);
    expect(result.successRate).toBeCloseTo(2 / 3);
    expect(result.totals).toEqual({ completed: 2, failed: 1, pending: 4, linkFailures: 9, policyRefusals: 3, cached: 1, bytes: 300 });
  });
  it('does not claim a success percentage when no file download has finished', async () => {
    const service = new RedditAnalyticsService({ $queryRaw: jest.fn().mockResolvedValue([]) } as any);
    expect((await service.summary(range)).successRate).toBeNull();
  });
});
