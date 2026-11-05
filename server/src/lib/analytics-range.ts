// Период графика на дашборде: [from, to) по полуночам UTC. Каждый график
// выбирает свой период сам (последние 7/30/90/365 дней, календарные неделя,
// месяц, квартал, год или всё время) и присылает его датами YYYY-MM-DD —
// to не включается. Время в базе — UTC, периоды считаются так же.

export interface DateRange {
  from: Date;
  to: Date;
}

const DAY_MS = 24 * 60 * 60 * 1000;
const ISO_DAY = /^\d{4}-\d{2}-\d{2}$/;
const DEFAULT_DAYS = 30;
// Потолок длины периода: «всё время» с запасом на годы вперёд.
export const MAX_RANGE_DAYS = 3700;

function parseDay(value: unknown): Date | null {
  if (typeof value !== 'string' || !ISO_DAY.test(value)) return null;
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function todayUtc(now: Date): Date {
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

// Нет дат или они кривые — последние 30 дней, включая сегодня. Перепутанные
// границы и слишком длинный период не ошибка: подрезаем до разумного.
export function parseRange(
  from: unknown,
  to: unknown,
  maxDays = MAX_RANGE_DAYS,
  now = new Date(),
): DateRange {
  const end = parseDay(to) ?? new Date(todayUtc(now).getTime() + DAY_MS);
  let start = parseDay(from) ?? new Date(end.getTime() - DEFAULT_DAYS * DAY_MS);
  if (start >= end) start = new Date(end.getTime() - DAY_MS);
  if (end.getTime() - start.getTime() > maxDays * DAY_MS) {
    start = new Date(end.getTime() - maxDays * DAY_MS);
  }
  return { from: start, to: end };
}

export function rangeDays(range: DateRange): number {
  return Math.round((range.to.getTime() - range.from.getTime()) / DAY_MS);
}
