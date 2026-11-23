"use client";

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { BlockedOutcomes, OutcomeGroup, PromoStats } from "@/lib/analytics-api";
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

// Подсказки после скачивания в боте (bot/src/promo.ts): не стали ли из-за них
// чаще блокировать бота. Сравнение — дни, когда человек скачивал без
// подсказки.
export const PROMO_LABELS: Record<string, string> = {
  reddit: "Теперь и Reddit",
  extension: "Расширение",
  channel: "Канал новостей",
  group: "Бот в группе",
  audio: "-audio → mp3",
  inline: "Видео в любой чат",
  share: "Расскажите друзьям",
  donate: "Поддержать проект",
  survey: "Опрос: расшифровка видео",
};

export function PromoBlocksCard() {
  const q = useAnalytics<PromoStats>("users/promo");
  const d = q.data;
  const shown = d?.keys.reduce((n, k) => n + k.shown, 0) ?? 0;
  const blocked = d?.keys.reduce((n, k) => n + k.blocked, 0) ?? 0;
  return (
    <ChartCard
      title="Подсказки после скачивания и блокировки"
      hint={
        "Сколько раз бот показал каждую подсказку и сколько из увидевших заблокировали бота в течение 48 часов. " +
        "Для сравнения — дни без подсказки: человек скачивал в боте и подсказку не получал; заблокировал ли он бота " +
        "в 48 часов после этого. Считается с первого показа."
      }
      loading={q.loading}
      error={q.error}
    >
      {d && d.keys.length ? (
        <div className="space-y-3 text-sm">
          <p>
            После подсказки: <b>{pct(blocked, shown)}%</b> ({blocked} из {shown}) · без подсказки:{" "}
            <b>{pct(d.baseline.blocked, d.baseline.days)}%</b> ({d.baseline.blocked} из {d.baseline.days} дней)
          </p>
          <table className="w-full">
            <thead className="text-muted-foreground">
              <tr>
                <th className="text-left font-normal">Подсказка</th>
                <th className="text-right font-normal">Показов</th>
                <th className="text-right font-normal">Заблокировали за 48 ч</th>
              </tr>
            </thead>
            <tbody>
              {d.keys.map((k) => (
                <tr key={k.key}>
                  <td>{PROMO_LABELS[k.key] ?? k.key}</td>
                  <td className="text-right tabular-nums">{k.shown}</td>
                  <td className="text-right tabular-nums">
                    {k.blocked} ({pct(k.blocked, k.shown)}%)
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyChart height={120}>Подсказок ещё не было</EmptyChart>
      )}
    </ChartCard>
  );
}
