import { test } from "node:test";
import assert from "node:assert/strict";
import { periodOptions, periodRange, rangeDayKeys, rangeEdges, weekdayOccurrences } from "./periods";

const NOW = new Date("2026-11-05T15:00:00Z"); // четверг
const SINCE = "2026-07-20";

test("последние N дней включают сегодня", () => {
  assert.deepEqual(periodRange("last:7", SINCE, NOW), { from: "2026-10-30", to: "2026-11-06" });
  assert.equal(rangeDayKeys(periodRange("last:30", SINCE, NOW)).length, 30);
});

test("текущие неделя, месяц, квартал и год обрезаются по сегодня", () => {
  assert.deepEqual(periodRange("week:2026-11-02", SINCE, NOW), { from: "2026-11-02", to: "2026-11-06" });
  assert.deepEqual(periodRange("month:2026-11", SINCE, NOW), { from: "2026-11-01", to: "2026-11-06" });
  assert.deepEqual(periodRange("quarter:2026-4", SINCE, NOW), { from: "2026-10-01", to: "2026-11-06" });
  assert.deepEqual(periodRange("year:2026", SINCE, NOW), { from: "2026-01-01", to: "2026-11-06" });
});

test("прошедшие календарные периоды целиком", () => {
  assert.deepEqual(periodRange("month:2026-10", SINCE, NOW), { from: "2026-10-01", to: "2026-11-01" });
  assert.deepEqual(periodRange("quarter:2026-3", SINCE, NOW), { from: "2026-07-01", to: "2026-10-01" });
  assert.deepEqual(periodRange("all", SINCE, NOW), { from: SINCE, to: "2026-11-06" });
});

test("варианты — от сегодня до первого дня с данными", () => {
  const groups = Object.fromEntries(periodOptions(SINCE, NOW).map((g) => [g.label, g.options.map((o) => o.id)]));
  assert.deepEqual(groups["Месяц"], ["month:2026-11", "month:2026-10", "month:2026-09", "month:2026-08", "month:2026-07"]);
  assert.deepEqual(groups["Квартал"], ["quarter:2026-4", "quarter:2026-3"]);
  assert.deepEqual(groups["Год"], ["year:2026"]);
  assert.equal(groups["Неделя"][0], "week:2026-11-02");
  assert.equal(groups["Неделя"].at(-1), "week:2026-07-20");
});

test("сколько раз каждый день недели входит в период", () => {
  // 2–8 ноября 2026: ровно одна неделя с понедельника.
  assert.deepEqual(weekdayOccurrences({ from: "2026-11-02", to: "2026-11-09" }), [1, 1, 1, 1, 1, 1, 1]);
  assert.deepEqual(weekdayOccurrences({ from: "2026-11-02", to: "2026-11-04" }), [1, 1, 0, 0, 0, 0, 0]);
});

test("края периода: последний день — накануне to, текущий — если это сегодня", () => {
  assert.deepEqual(rangeEdges(periodRange("last:30", SINCE, NOW), NOW), { first: "2026-10-07", last: "2026-11-05", current: true });
  assert.deepEqual(rangeEdges(periodRange("month:2026-10", SINCE, NOW), NOW), { first: "2026-10-01", last: "2026-10-31", current: false });
});
