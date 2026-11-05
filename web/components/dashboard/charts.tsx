"use client";

import { useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type {
  ActiveDailyPoint,
  ActivePeriodPoint,
  BlockedPoint,
  ErrorDatum,
  ErrorTimeseriesPoint,
  OverviewData,
  PlatformDatum,
  SourceDatum,
  TimeseriesPoint,
  TrafficPoint,
  WeekdayPoint,
} from "@/lib/analytics-api";
import { rangeDayKeys, weekdayOccurrences } from "@/lib/dashboard/periods";
import { ChartCard, EmptyChart, ScrollableChart, usePeriodQuery } from "./chart-card";
import {
  ERROR_COLORS,
  PLATFORM_COLORS,
  PLATFORM_OPTIONS,
  SOURCE_COLORS,
  SOURCE_LABELS,
  formatBytes,
  formatDay,
  formatMonth,
  formatWeek,
  pickByteUnit,
} from "./format";

// Графики дашборда. Каждый сам выбирает период (по умолчанию последние 30
// дней) и сам загружает данные; длинные графики листаются по горизонтали.

// Ширина одной точки: линиям хватает меньше, чем столбикам.
const LINE_POINT = 14;
const BAR_POINT = 16;

const lower = (text: string) => text.charAt(0).toLowerCase() + text.slice(1);

export function StatCard({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div className="rounded-lg border border-border/60 bg-background/60 p-4">
      <div className="text-sm text-foreground/60">{label}</div>
      <div className="mt-1 text-2xl font-semibold">{value}</div>
      {hint && <div className="mt-1 text-xs text-foreground/40">{hint}</div>}
    </div>
  );
}

// Счётчики скачиваний за выбранный период: бот, сайт и расширение, без
// запросов напрямую в API (это проверки при разработке).
export function DownloadStatCards() {
  const q = usePeriodQuery<OverviewData>("overview");
  const o = q.data;
  const value = (n: number | undefined) => (n === undefined ? "…" : n);
  return (
    <ChartCard
      title={`Скачивания — ${lower(q.label)}`}
      hint="Бот, сайт и расширение; успешные — включая файлы, уже удалённые с диска"
      period={q.period}
      onPeriod={q.setPeriod}
      loading={q.loading}
      error={q.error}
    >
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Попыток" value={value(o?.totalDownloads)} />
        <StatCard label="Успешных" value={value(o?.completedDownloads)} />
        <StatCard label="Ошибок" value={value(o?.failedDownloads)} />
        <StatCard
          label="Успешность"
          value={o ? (o.successRate !== null ? `${Math.round(o.successRate * 100)}%` : "—") : "…"}
          hint="Успешные из завершённых"
        />
      </div>
    </ChartCard>
  );
}

export function DownloadsUsersChart({ wide = false }: { wide?: boolean }) {
  const q = usePeriodQuery<TimeseriesPoint[]>("timeseries");
  const data = (q.data ?? []).map((p) => ({ ...p, label: formatDay(p.day) }));
  return (
    <ChartCard
      title={`Скачивания и новые пользователи — ${lower(q.label)}`}
      hint="Попытки скачивания (бот, сайт и расширение) и впервые пришедшие в бот или на сайт за день (UTC)"
      period={q.period}
      onPeriod={q.setPeriod}
      loading={q.loading}
      error={q.error}
      wide={wide}
    >
      <ScrollableChart
        points={data.length}
        pointWidth={LINE_POINT}
        legend={[
          { label: "Скачивания", color: "#ef4444" },
          { label: "Новые пользователи", color: "#3b82f6" },
        ]}
      >
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis dataKey="label" fontSize={12} />
          <YAxis fontSize={12} allowDecimals={false} />
          <Tooltip />
          <Line type="monotone" dataKey="downloads" name="Скачивания" stroke="#ef4444" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="newUsers" name="Новые пользователи" stroke="#3b82f6" strokeWidth={2} dot={false} />
        </LineChart>
      </ScrollableChart>
    </ChartCard>
  );
}

const WEEKDAYS = ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Воскресенье"];
const WEEKDAYS_SHORT = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
const WEEKDAY_SOURCES = ["BOT", "WEB", "EXTENSION"] as const;

// В какие дни недели качают больше: успешные скачивания за период по дням
// недели, стопкой по источникам. В подсказке — среднее за один такой день:
// в месяце понедельников бывает и четыре, и пять, и сумма это скрывает.
export function WeekdayChart() {
  const q = usePeriodQuery<WeekdayPoint[]>("weekdays");
  const occurrences = weekdayOccurrences(q.range);
  const data = WEEKDAYS.map((name, i) => {
    const point: Record<string, string | number> = { label: WEEKDAYS_SHORT[i], name, total: 0, average: 0 };
    for (const source of WEEKDAY_SOURCES) point[source] = 0;
    for (const row of q.data ?? []) {
      if (row.weekday !== i + 1) continue;
      point[row.source] = row.count;
      point.total = Number(point.total) + row.count;
    }
    point.average = occurrences[i] ? Number(point.total) / occurrences[i] : 0;
    return point;
  });
  const best = data.reduce((a, b) => (Number(b.average) > Number(a.average) ? b : a), data[0]);
  const hasData = data.some((d) => Number(d.total) > 0);
  const round = (n: number) => n.toLocaleString("ru-RU", { maximumFractionDigits: 1 });

  return (
    <ChartCard
      title={`Скачивания по дням недели — ${lower(q.label)}`}
      hint={
        hasData
          ? `Успешные скачивания (UTC). Больше всего в среднем — ${String(best.name).toLowerCase()}: ${round(Number(best.average))} в день`
          : "Успешные скачивания (UTC)"
      }
      period={q.period}
      onPeriod={q.setPeriod}
      loading={q.loading}
      error={q.error}
    >
      {hasData ? (
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis dataKey="label" fontSize={12} />
            <YAxis fontSize={12} allowDecimals={false} />
            <Tooltip
              labelFormatter={(_label, payload) => {
                const p = payload?.[0]?.payload as { name: string; total: number; average: number } | undefined;
                return p ? `${p.name}: ${p.total}, в среднем ${round(p.average)} в день` : "";
              }}
            />
            <Legend align="right" />
            {WEEKDAY_SOURCES.map((source) => (
              <Bar key={source} dataKey={source} name={SOURCE_LABELS[source]} stackId="weekday" fill={SOURCE_COLORS[source]} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <EmptyChart>{q.loading ? "Загрузка…" : "За период нет успешных скачиваний"}</EmptyChart>
      )}
    </ChartCard>
  );
}

// Число успешных скачиваний по дням — отдельной линией на каждую площадку.
export function PlatformCountsChart() {
  const q = usePeriodQuery<TrafficPoint[]>("traffic/daily");
  const rows = q.data ?? [];
  const platforms = Array.from(new Set(rows.map((r) => r.platform))).sort();
  const byDay = new Map<string, Record<string, number>>();
  for (const row of rows) byDay.set(row.period, { ...(byDay.get(row.period) ?? {}), [row.platform]: row.count });
  const data = rangeDayKeys(q.range).map((key) => {
    const counts = byDay.get(key) ?? {};
    const point: Record<string, string | number> = { label: formatDay(key) };
    for (const platform of platforms) point[platform] = counts[platform] ?? 0;
    return point;
  });

  return (
    <ChartCard
      title={`Успешные скачивания по платформам — ${lower(q.label)}`}
      period={q.period}
      onPeriod={q.setPeriod}
      loading={q.loading}
      error={q.error}
    >
      <ScrollableChart
        points={data.length}
        pointWidth={LINE_POINT}
        legend={platforms.map((p) => ({ label: p, color: PLATFORM_COLORS[p] ?? "#9ca3af" }))}
      >
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis dataKey="label" fontSize={12} />
          <YAxis fontSize={12} allowDecimals={false} />
          <Tooltip />
          {platforms.map((platform) => (
            <Line
              key={platform}
              type="monotone"
              dataKey={platform}
              name={platform}
              stroke={PLATFORM_COLORS[platform] ?? "#9ca3af"}
              strokeWidth={2}
              dot={false}
            />
          ))}
        </LineChart>
      </ScrollableChart>
    </ChartCard>
  );
}

export function PlatformsPie() {
  const q = usePeriodQuery<PlatformDatum[]>("platforms");
  const data = q.data ?? [];
  return (
    <ChartCard
      title={`Платформы — ${lower(q.label)}`}
      hint="Все попытки скачивания, включая неудачные"
      period={q.period}
      onPeriod={q.setPeriod}
      loading={q.loading}
      error={q.error}
    >
      {data.length ? (
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={data}
              dataKey="count"
              nameKey="platform"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={(entry) => `${entry.platform}: ${entry.count}`}
            >
              {data.map((p) => (
                <Cell key={p.platform} fill={PLATFORM_COLORS[p.platform] ?? "#9ca3af"} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <EmptyChart>{q.loading ? "Загрузка…" : "За период нет скачиваний"}</EmptyChart>
      )}
    </ChartCard>
  );
}

export function SourcesPie() {
  const q = usePeriodQuery<SourceDatum[]>("sources");
  const data = q.data ?? [];
  return (
    <ChartCard
      title={`Бот, сайт и расширение — ${lower(q.label)}`}
      hint="Все попытки скачивания по источникам"
      period={q.period}
      onPeriod={q.setPeriod}
      loading={q.loading}
      error={q.error}
    >
      {data.length ? (
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={data}
              dataKey="count"
              nameKey="source"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={(entry) => `${SOURCE_LABELS[entry.source] ?? entry.source}: ${entry.count}`}
            >
              {data.map((s) => (
                <Cell key={s.source} fill={SOURCE_COLORS[s.source] ?? "#9ca3af"} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, _name, props) => [value, SOURCE_LABELS[props.payload.source] ?? props.payload.source]}
            />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <EmptyChart>{q.loading ? "Загрузка…" : "За период нет скачиваний"}</EmptyChart>
      )}
    </ChartCard>
  );
}

function PlatformSelect({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label="Платформа"
      className="h-8 rounded-md border border-input bg-transparent px-2 text-xs outline-none focus-visible:ring-1 focus-visible:ring-ring"
    >
      {PLATFORM_OPTIONS.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

// Объём скачанного одной площадкой по дням или месяцам: из сети и из кеша,
// стопкой. Площадка выбирается у каждого графика своя, по умолчанию YouTube —
// его трафик идёт через прокси с оплатой за гигабайты.
export function TrafficChart({ unit }: { unit: "day" | "month" }) {
  const q = usePeriodQuery<TrafficPoint[]>(unit === "day" ? "traffic/daily" : "traffic/monthly");
  const [platform, setPlatform] = useState("YOUTUBE");

  const byKey = new Map<string, { bytes: number; cachedBytes: number }>();
  for (const row of q.data ?? []) {
    if (row.platform === platform) byKey.set(row.period, { bytes: row.bytes, cachedBytes: row.cachedBytes });
  }
  const keys = unit === "day" ? rangeDayKeys(q.range) : Array.from(byKey.keys()).sort();
  const format = unit === "day" ? formatDay : formatMonth;
  const max = Math.max(0, ...keys.map((k) => (byKey.get(k)?.bytes ?? 0) + (byKey.get(k)?.cachedBytes ?? 0)));
  const byteUnit = pickByteUnit(max);
  const data = keys.map((key) => ({
    label: format(key),
    bytes: (byKey.get(key)?.bytes ?? 0) / byteUnit.size,
    cachedBytes: (byKey.get(key)?.cachedBytes ?? 0) / byteUnit.size,
  }));
  const total = keys.reduce((sum, k) => sum + (byKey.get(k)?.bytes ?? 0), 0);
  const cached = keys.reduce((sum, k) => sum + (byKey.get(k)?.cachedBytes ?? 0), 0);
  const round = (v: number) => v.toLocaleString("ru-RU", { maximumFractionDigits: 2 });

  return (
    <ChartCard
      title={`Объём скачанного по ${unit === "day" ? "дням" : "месяцам"} — ${lower(q.label)}`}
      hint={`Из сети ${formatBytes(total)}, из кеша ${formatBytes(cached)}`}
      period={q.period}
      onPeriod={q.setPeriod}
      controls={<PlatformSelect value={platform} onChange={setPlatform} />}
      loading={q.loading}
      error={q.error}
    >
      <ScrollableChart
        points={data.length}
        pointWidth={unit === "day" ? BAR_POINT : 60}
        yAxisWidth={75}
        legend={[
          { label: "Из сети", color: PLATFORM_COLORS[platform] ?? "#9ca3af" },
          { label: "Из кеша (без трафика)", color: "#9ca3af" },
        ]}
      >
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis dataKey="label" fontSize={12} />
          <YAxis fontSize={12} unit={` ${byteUnit.label}`} width={70} />
          <Tooltip formatter={(value) => `${round(Number(value))} ${byteUnit.label}`} />
          <Bar dataKey="bytes" name="Из сети" stackId="traffic" fill={PLATFORM_COLORS[platform] ?? "#9ca3af"} />
          <Bar dataKey="cachedBytes" name="Из кеша (без трафика)" stackId="traffic" fill="#9ca3af" fillOpacity={0.5} />
        </BarChart>
      </ScrollableChart>
    </ChartCard>
  );
}

// Сколько скачано из сети каждой площадкой за период.
export function VolumePie() {
  const q = usePeriodQuery<TrafficPoint[]>("traffic/daily");
  const totals = new Map<string, number>();
  for (const row of q.data ?? []) totals.set(row.platform, (totals.get(row.platform) ?? 0) + row.bytes);
  const volume = Array.from(totals.entries())
    .filter(([, bytes]) => bytes > 0)
    .map(([platform, bytes]) => ({ platform, bytes }))
    .sort((a, b) => b.bytes - a.bytes);

  return (
    <ChartCard
      title={`Объём по платформам — ${lower(q.label)}`}
      period={q.period}
      onPeriod={q.setPeriod}
      loading={q.loading}
      error={q.error}
    >
      {volume.length ? (
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={volume}
              dataKey="bytes"
              nameKey="platform"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={(entry) => `${entry.platform}: ${formatBytes(entry.bytes)}`}
            >
              {volume.map((v) => (
                <Cell key={v.platform} fill={PLATFORM_COLORS[v.platform] ?? "#9ca3af"} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => formatBytes(Number(value))} />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <EmptyChart>{q.loading ? "Загрузка…" : "За период нет данных о размере файлов"}</EmptyChart>
      )}
    </ChartCard>
  );
}

const ACTIVE_METRICS = {
  dau: { label: "DAU", hint: "Активных за календарный день (UTC); сегодняшний ещё растёт" },
  wau: { label: "WAU", hint: "Активных за 7 дней на каждую дату" },
  mau: { label: "MAU", hint: "Активных за 30 дней на каждую дату" },
} as const;

export function ActiveDailyChart({ metric, wide = false }: { metric: keyof typeof ACTIVE_METRICS; wide?: boolean }) {
  const q = usePeriodQuery<ActiveDailyPoint[]>("users/active/daily");
  const data = (q.data ?? []).map((p) => ({ ...p, label: formatDay(p.day) }));
  const { label, hint } = ACTIVE_METRICS[metric];
  return (
    <ChartCard
      title={`${label} по дням — ${lower(q.label)}`}
      hint={hint}
      period={q.period}
      onPeriod={q.setPeriod}
      loading={q.loading}
      error={q.error}
      wide={wide}
    >
      <ScrollableChart points={data.length} pointWidth={LINE_POINT}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis dataKey="label" fontSize={12} />
          <YAxis fontSize={12} allowDecimals={false} />
          <Tooltip />
          <Line type="monotone" dataKey={metric} name={label} stroke="#3b82f6" strokeWidth={2} dot={false} />
        </LineChart>
      </ScrollableChart>
    </ChartCard>
  );
}

// Активные пользователи по календарным неделям или месяцам, которые
// пересекаются с периодом; крайние считаются целиком.
export function ActivePeriodChart({ unit }: { unit: "week" | "month" }) {
  const q = usePeriodQuery<ActivePeriodPoint[]>(unit === "week" ? "users/active/weekly" : "users/active/monthly");
  const format = unit === "week" ? formatWeek : formatMonth;
  const data = (q.data ?? []).map((p) => ({ label: format(p.period), users: p.users }));
  return (
    <ChartCard
      title={`Активные пользователи по ${unit === "week" ? "неделям" : "месяцам"} — ${lower(q.label)}`}
      hint={
        unit === "week"
          ? "Разных пользователей за неделю с понедельника (подпись — её понедельник); текущая ещё растёт"
          : "Разных пользователей за календарный месяц; текущий ещё растёт"
      }
      period={q.period}
      onPeriod={q.setPeriod}
      loading={q.loading}
      error={q.error}
    >
      <ScrollableChart points={data.length} pointWidth={unit === "week" ? 44 : 60}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis dataKey="label" fontSize={12} />
          <YAxis fontSize={12} allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="users" name="Активных" fill="#3b82f6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ScrollableChart>
    </ChartCard>
  );
}

const BLOCKED_UNITS = {
  day: { query: "users/blocked/daily", title: "по дням", format: formatDay, width: BAR_POINT },
  week: { query: "users/blocked/weekly", title: "по неделям", format: formatWeek, width: 60 },
  month: { query: "users/blocked/monthly", title: "по месяцам", format: formatMonth, width: 72 },
} as const;

// Приток и отток: новые пользователи, блокировки и разблокировки бота — три
// серии в одних единицах (люди), поэтому одна ось.
export function BlockedChart({ unit, wide = false }: { unit: keyof typeof BLOCKED_UNITS; wide?: boolean }) {
  const config = BLOCKED_UNITS[unit];
  const q = usePeriodQuery<BlockedPoint[]>(config.query);
  const data = (q.data ?? []).map((p) => ({ ...p, label: config.format(p.period) }));
  return (
    <ChartCard
      title={`Новые пользователи и блокировки ${config.title} — ${lower(q.label)}`}
      hint="Сколько человек впервые пришли в бот или на сайт, заблокировали и разблокировали бота (UTC); блокировки — с 29.10.2026"
      period={q.period}
      onPeriod={q.setPeriod}
      loading={q.loading}
      error={q.error}
      wide={wide}
    >
      <ScrollableChart
        points={data.length}
        pointWidth={config.width}
        legend={[
          { label: "Новые пользователи", color: "#3b82f6" },
          { label: "Заблокировали", color: "#ef4444" },
          { label: "Разблокировали", color: "#22c55e" },
        ]}
      >
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis dataKey="label" fontSize={12} />
          <YAxis fontSize={12} allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="newUsers" name="Новые пользователи" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          <Bar dataKey="blocked" name="Заблокировали" fill="#ef4444" radius={[4, 4, 0, 0]} />
          <Bar dataKey="unblocked" name="Разблокировали" fill="#22c55e" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ScrollableChart>
    </ChartCard>
  );
}

export function ErrorsByCategoryChart() {
  const q = usePeriodQuery<ErrorDatum[]>("errors");
  const data = q.data ?? [];
  return (
    <ChartCard
      title={`Ошибки по категориям — ${lower(q.label)}`}
      period={q.period}
      onPeriod={q.setPeriod}
      loading={q.loading}
      error={q.error}
    >
      {data.length ? (
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis dataKey="category" fontSize={11} interval={0} angle={-20} textAnchor="end" height={70} />
            <YAxis fontSize={12} allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" name="Ошибок">
              {data.map((e) => (
                <Cell key={e.category} fill={ERROR_COLORS[e.category] ?? "#9ca3af"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <EmptyChart>{q.loading ? "Загрузка…" : "За период ошибок нет"}</EmptyChart>
      )}
    </ChartCard>
  );
}

// Ошибки по дням стопкой по категориям. Дни без ошибок — нулями, чтобы ось
// не сжималась.
export function ErrorsTimeseriesChart() {
  const q = usePeriodQuery<ErrorTimeseriesPoint[]>("errors/timeseries");
  const rows = q.data ?? [];
  const categories = Array.from(new Set(rows.map((r) => r.category))).sort();
  const byDay = new Map<string, Record<string, number>>();
  for (const row of rows) byDay.set(row.day, { ...(byDay.get(row.day) ?? {}), [row.category]: row.count });
  const data = rangeDayKeys(q.range).map((key) => {
    const point: Record<string, string | number> = { label: formatDay(key) };
    for (const category of categories) point[category] = byDay.get(key)?.[category] ?? 0;
    return point;
  });

  return (
    <ChartCard
      title={`Ошибки по дням — ${lower(q.label)}`}
      hint="Динамика по категориям (UTC)"
      period={q.period}
      onPeriod={q.setPeriod}
      loading={q.loading}
      error={q.error}
      wide
    >
      <ScrollableChart
        points={data.length}
        pointWidth={LINE_POINT}
        legend={categories.map((c) => ({ label: c, color: ERROR_COLORS[c] ?? "#9ca3af" }))}
      >
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis dataKey="label" fontSize={12} />
          <YAxis fontSize={12} allowDecimals={false} />
          <Tooltip />
          {categories.map((category) => (
            <Area
              key={category}
              type="monotone"
              dataKey={category}
              name={category}
              stackId="errors"
              stroke={ERROR_COLORS[category] ?? "#9ca3af"}
              fill={ERROR_COLORS[category] ?? "#9ca3af"}
              fillOpacity={0.5}
            />
          ))}
        </AreaChart>
      </ScrollableChart>
    </ChartCard>
  );
}
