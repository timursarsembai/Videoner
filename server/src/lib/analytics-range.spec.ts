import { parseRange, rangeDays } from './analytics-range';

const NOW = new Date('2026-11-05T15:30:00Z');

describe('parseRange', () => {
  it('defaults to the last 30 days including today', () => {
    const r = parseRange(undefined, undefined, undefined, NOW);
    expect(r.to.toISOString()).toBe('2026-11-06T00:00:00.000Z');
    expect(r.from.toISOString()).toBe('2026-10-07T00:00:00.000Z');
    expect(rangeDays(r)).toBe(30);
  });

  it('takes calendar bounds as given, to exclusive', () => {
    const r = parseRange('2026-10-01', '2026-11-01', undefined, NOW);
    expect(r.from.toISOString()).toBe('2026-10-01T00:00:00.000Z');
    expect(rangeDays(r)).toBe(31);
  });

  it('repairs swapped, malformed and too long ranges', () => {
    expect(rangeDays(parseRange('2026-11-03', '2026-11-01', undefined, NOW))).toBe(1);
    expect(parseRange('yesterday', '2026-11-01', undefined, NOW).from.toISOString()).toBe(
      '2026-10-02T00:00:00.000Z',
    );
    expect(rangeDays(parseRange('2000-01-01', '2026-11-01', 100, NOW))).toBe(100);
  });
});
