"use client";

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { BlockedOutcomes, OutcomeGroup } from "@/lib/analytics-api";
import { ChartCard, EmptyChart, useAnalytics } from "./chart-card";

// Связь блокировок бота с ошибками скачивания (вкладка «Пользователи»): за
// всё время, без выбора периода — блокировка считается по состоянию «сейчас».

const OUTCOMES: { key: keyof Omit<OutcomeGroup, "users">; label: string; color: string }[] = [
  { key: "none", label: "Ничего не скачал", color: "#9ca3af" },
  { key: "failedOnly", label: "Только ошибки", color: "#ef4444" },
  { key: "mixed", label: "И ошибки, и удачи", color: "#f59e0b" },
  { key: "okOnly", label: "Только удачно", color: "#22c55e" },
];

const OUTCOMES_HINT =
  "Доля пользователей бота по исходу всех их попыток. Ошибка — упавшее скачивание или отказ при разборе " +
  "ссылки; отказы при разборе привязаны к пользователю только с 12.11.2026, раньше они не видны. " +
  "«Ничего не скачал» — не присылал ссылок или все отказы были до 12.11.2026.";

const pct = (n: number, total: number) => (total ? Math.round((n / total) * 1000) / 10 : 0);

export function BlockedOutcomesChart() {
  const q = useAnalytics<BlockedOutcomes>("users/blocked/outcomes");
  const groups = q.data?.groups;
  const data = groups
    ? [
        { name: `Заблокировали (${groups.blocked.users})`, group: groups.blocked },
        { name: `Остальные (${groups.active.users})`, group: groups.active },
      ].map(({ name, group }) => {
        const row: Record<string, string | number> = { name };
        for (const o of OUTCOMES) {
          row[o.key] = pct(group[o.key], group.users);
          row[`${o.key}N`] = group[o.key];
        }
        return row;
      })
    : [];
  return (
    <ChartCard title="Блокировки и ошибки — за всё время" hint={OUTCOMES_HINT} loading={q.loading} error={q.error}>
      {data.length ? (
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data} layout="vertical" margin={{ left: 8, right: 16 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis type="number" domain={[0, 100]} unit="%" fontSize={12} />
            <YAxis type="category" dataKey="name" width={130} fontSize={12} />
            <Tooltip
              formatter={(value, name, item) => {
                const o = OUTCOMES.find((x) => x.label === name);
                const count = o ? item.payload[`${o.key}N`] : "";
                return [`${value}% (${count} чел.)`, name];
              }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            {OUTCOMES.map((o) => (
              <Bar key={o.key} dataKey={o.key} name={o.label} stackId="a" fill={o.color} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <EmptyChart height={220}>Нет данных</EmptyChart>
      )}
    </ChartCard>
  );
}

export function BlockedPlatformsChart() {
  const q = useAnalytics<BlockedOutcomes>("users/blocked/outcomes");
  const data = (q.data?.platforms ?? []).map((p) => ({ ...p, name: p.platform.toUpperCase() }));
  return (
    <ChartCard
      title="Где качали заблокировавшие — за всё время"
      hint="Попытки тех, кто сейчас заблокировал бота: удачные скачивания и ошибки по площадкам. В подсказке — сколько человек пробовали площадку."
      loading={q.loading}
      error={q.error}
    >
      {data.length ? (
        <ResponsiveContainer width="100%" height={Math.max(160, data.length * 36 + 60)}>
          <BarChart data={data} layout="vertical" margin={{ left: 8, right: 16 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis type="number" allowDecimals={false} fontSize={12} />
            <YAxis type="category" dataKey="name" width={90} fontSize={12} />
            <Tooltip labelFormatter={(label, items) => `${label} · ${items?.[0]?.payload?.users ?? 0} чел.`} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="ok" name="Удачно" stackId="a" fill="#22c55e" />
            <Bar dataKey="failed" name="Ошибки" stackId="a" fill="#ef4444" />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <EmptyChart height={160}>Заблокировавшие ничего не пробовали скачать</EmptyChart>
      )}
    </ChartCard>
  );
}
