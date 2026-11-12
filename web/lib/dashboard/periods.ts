// Периоды графиков дашборда. У каждого графика свой выбор:
//   last:N            — последние N дней, включая сегодня (7, 30, 90, 365);
//   week:YYYY-MM-DD   — календарная неделя с понедельника (дата понедельника);
//   month:YYYY-MM     — календарный месяц;
//   quarter:YYYY-Q    — календарный квартал;
//   year:YYYY         — календарный год;
//   all               — всё время, с первого дня, когда есть данные.
// Границы — полуночи UTC, как время в базе; конец не включается. Текущие
// неделя, месяц, квартал и год обрезаются по сегодняшний день: будущие дни на
// графике выглядели бы как дни без скачиваний.

export type PeriodId = string;

export interface DayRange {
  from: string; // YYYY-MM-DD
  to: string; // YYYY-MM-DD, не включается
}

export const DEFAULT_PERIOD: PeriodId = "last:30";
const LAST_DAYS = [7, 30, 90, 365] as const;
// Сколько прошлых недель предлагать в списке — дальше удобнее месяцами.
const MAX_WEEKS = 26;

const DAY_MS = 24 * 60 * 60 * 1000;

const utcDay = (y: number, m: number, d: number) => new Date(Date.UTC(y, m, d));
const iso = (date: Date) => date.toISOString().slice(0, 10);
const parseIso = (value: string) => new Date(`${value}T00:00:00Z`);
const addDays = (date: Date, days: number) => new Date(date.getTime() + days * DAY_MS);

function today(now: Date): Date {
  return utcDay(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
}

// Понедельник недели, в которую входит дата.
function mondayOf(date: Date): Date {
  return addDays(date, -((date.getUTCDay() + 6) % 7));
}

const quarterOf = (date: Date) => Math.floor(date.getUTCMonth() / 3) + 1;

function clip(range: { from: Date; to: Date }, now: Date): DayRange {
  const tomorrow = addDays(today(now), 1);
  const to = range.to > tomorrow ? tomorrow : range.to;
  return { from: iso(range.from), to: iso(to > range.from ? to : addDays(range.from, 1)) };
}

export function periodRange(id: PeriodId, since: string, now = new Date()): DayRange {
  const [kind, value = ""] = id.split(":");
  const t = today(now);
  if (kind === "last") {
    const days = Math.max(1, Number(value) || 30);
    return clip({ from: addDays(t, -(days - 1)), to: addDays(t, 1) }, now);
  }
  if (kind === "week") {
    const monday = parseIso(value);
    return clip({ from: monday, to: addDays(monday, 7) }, now);
  }
  if (kind === "month") {
    const [y, m] = value.split("-").map(Number);
    return clip({ from: utcDay(y, m - 1, 1), to: utcDay(y, m, 1) }, now);
  }
  if (kind === "quarter") {
    const [y, q] = value.split("-").map(Number);
    return clip({ from: utcDay(y, (q - 1) * 3, 1), to: utcDay(y, q * 3, 1) }, now);
  }
  if (kind === "year") {
    const y = Number(value);
    return clip({ from: utcDay(y, 0, 1), to: utcDay(y + 1, 0, 1) }, now);
  }
  return clip({ from: parseIso(since), to: addDays(t, 1) }, now);
}

// Дни периода по порядку — ключи в том же виде, в каком сервер отдаёт
// date_trunc('day'): ISO полуночи UTC.
// Последний день периода (to в периоде не включается) и входит ли в период
// сегодняшний день — тогда он ещё не закончился. Дни — по UTC.
export function rangeEdges(range: DayRange, now = new Date()): { first: string; last: string; current: boolean } {
  const last = iso(addDays(parseIso(range.to), -1));
  return { first: range.from, last, current: last === iso(today(now)) };
}

export function rangeDayKeys(range: DayRange): string[] {
  const keys: string[] = [];
  for (let d = parseIso(range.from); d < parseIso(range.to); d = addDays(d, 1)) {
    keys.push(d.toISOString());
  }
  return keys;
}

// Сколько раз каждый день недели (1 — понедельник … 7 — воскресенье)
// встречается в периоде — для среднего по дню недели.
export function weekdayOccurrences(range: DayRange): number[] {
  const counts = [0, 0, 0, 0, 0, 0, 0];
  for (let d = parseIso(range.from); d < parseIso(range.to); d = addDays(d, 1)) {
    counts[(d.getUTCDay() + 6) % 7] += 1;
  }
  return counts;
}

const shortDate = (date: Date) =>
  date.toLocaleDateString("ru-RU", { day: "numeric", month: "short", timeZone: "UTC" });

const monthName = (date: Date) => {
  const text = date.toLocaleDateString("ru-RU", { month: "long", year: "numeric", timeZone: "UTC" });
  return text.charAt(0).toUpperCase() + text.slice(1).replace(/ г\.$/, "");
};

const ROMAN = ["I", "II", "III", "IV"];

export interface PeriodGroup {
  label: string;
  options: { id: PeriodId; label: string }[];
}

// Что предлагать в выборе периода: от сегодняшнего дня назад до первого дня
// с данными (since).
export function periodOptions(since: string, now = new Date()): PeriodGroup[] {
  const t = today(now);
  const first = parseIso(since);

  const weeks: PeriodGroup["options"] = [];
  for (let monday = mondayOf(t), i = 0; monday >= mondayOf(first) && i < MAX_WEEKS; monday = addDays(monday, -7), i++) {
    const label =
      i === 0 ? "Эта неделя" : i === 1 ? "Прошлая неделя" : `${shortDate(monday)} – ${shortDate(addDays(monday, 6))}`;
    weeks.push({ id: `week:${iso(monday)}`, label });
  }

  const months: PeriodGroup["options"] = [];
  for (let d = utcDay(t.getUTCFullYear(), t.getUTCMonth(), 1); d >= utcDay(first.getUTCFullYear(), first.getUTCMonth(), 1); d = utcDay(d.getUTCFullYear(), d.getUTCMonth() - 1, 1)) {
    months.push({ id: `month:${iso(d).slice(0, 7)}`, label: monthName(d) });
  }

  const quarters: PeriodGroup["options"] = [];
  const firstQuarter = first.getUTCFullYear() * 4 + quarterOf(first) - 1;
  for (let n = t.getUTCFullYear() * 4 + quarterOf(t) - 1; n >= firstQuarter; n--) {
    const y = Math.floor(n / 4);
    const q = (n % 4) + 1;
    quarters.push({ id: `quarter:${y}-${q}`, label: `${ROMAN[q - 1]} квартал ${y}` });
  }

  const years: PeriodGroup["options"] = [];
  for (let y = t.getUTCFullYear(); y >= first.getUTCFullYear(); y--) {
    years.push({ id: `year:${y}`, label: `${y} год` });
  }

  return [
    { label: "Последние дни", options: LAST_DAYS.map((d) => ({ id: `last:${d}`, label: `Последние ${d} дней` })) },
    { label: "Неделя", options: weeks },
    { label: "Месяц", options: months },
    { label: "Квартал", options: quarters },
    { label: "Год", options: years },
    { label: "Всё время", options: [{ id: "all", label: `Всё время (с ${shortDate(first)} ${first.getUTCFullYear()})` }] },
  ];
}

// Подпись выбранного периода для заголовков («30 дней», «Ноябрь 2026»).
export function periodLabel(id: PeriodId, since: string): string {
  for (const group of periodOptions(since)) {
    const option = group.options.find((o) => o.id === id);
    if (option) return option.label;
  }
  return id;
}
