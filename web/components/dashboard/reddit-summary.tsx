"use client";

import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts';
import type { RedditSummaryData } from '@/lib/analytics-api';
import { rangeDayKeys } from '@/lib/dashboard/periods';
import { ChartCard, ScrollableChart, usePeriodQuery } from './chart-card';
import { StatCard } from './charts';
import { formatBytes, formatDay } from './format';

const SERIES = [
  { key: 'completed', label: 'Успешных', color: '#22c55e' },
  { key: 'failed', label: 'Ошибки скачивания', color: '#dc2626' },
  { key: 'linkFailures', label: 'Отказы разбора ссылки', color: '#f59e0b' },
  { key: 'policyRefusals', label: 'Контент 18+ (не качаем)', color: '#7c3aed' },
] as const;

export function RedditSummary({ compact = false }: { compact?: boolean }) {
  const q = usePeriodQuery<RedditSummaryData>('reddit', {}, 'last:7');
  const totals = q.data?.totals;
  const rows = q.data?.daily ?? [];
  const data = rangeDayKeys(q.range).map(iso => {
    const day = iso.slice(0, 10);
    const values = rows.filter(row => row.day === day);
    return { label: formatDay(iso), ...Object.fromEntries(SERIES.map(series =>
      [series.key, values.reduce((sum, row) => sum + row[series.key], 0)])) };
  });
  const value = (n: number | undefined) => n === undefined ? '…' : n;
  return <ChartCard title={`Reddit — ${q.label.toLowerCase()}`} hint="Бот и сайт; дни по UTC. Текущий день ещё не завершён."
    period={q.period} onPeriod={q.setPeriod} loading={q.loading} error={q.error} wide>
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      <StatCard label="Успешных" value={value(totals?.completed)} />
      <StatCard label="Ошибки скачивания" value={value(totals?.failed)} />
      <StatCard label="Отказы разбора ссылки" value={value(totals?.linkFailures)} />
      <StatCard label="Успешность сохранения" value={q.data ? q.data.successRate === null ? '—' : `${(q.data.successRate * 100).toFixed(1)}%` : '…'} />
      <StatCard label="В работе" value={value(totals?.pending)} />
      <StatCard label="Контент 18+ (не качаем)" value={value(totals?.policyRefusals)} />
      <StatCard label="Из кеша" value={value(totals?.cached)} />
      <StatCard label="Объём файлов" value={totals ? formatBytes(totals.bytes) : '…'} />
    </div>
    <p className="mt-4 text-xs text-foreground/50">Успешность — среди завершённых скачиваний файлов. Отказы разбора ссылки и 18+ считаются отдельно. Объём файлов не является расходом прокси.</p>
    {!compact && <div className="mt-6"><ScrollableChart points={data.length} pointWidth={42}
      legend={SERIES.map(s => ({ label: s.label, color: s.color }))}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
        <XAxis dataKey="label" fontSize={12} /><YAxis allowDecimals={false} fontSize={12} /><Tooltip />
        {SERIES.map(s => <Bar key={s.key} dataKey={s.key} name={s.label} fill={s.color} stackId="reddit" />)}
      </BarChart>
    </ScrollableChart></div>}
  </ChartCard>;
}
