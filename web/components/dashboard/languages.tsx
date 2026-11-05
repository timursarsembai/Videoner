"use client";

import { Fragment, useState } from "react";
import { Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from "recharts";
import type { LanguageStatsRow } from "@/lib/analytics-api";
import { LANGUAGE_LABELS, type Language } from "@/lib/i18n/languages";
import { ChartCard, EmptyChart, ScrollableChart, usePeriodQuery } from "./chart-card";
import { LANGUAGE_TRACKING_SINCE, SOURCE_COLORS, SOURCE_LABELS, formatLongDate } from "./format";

// Вкладка «Языки»: пользователи бота и скачивания по языку интерфейса.

// Название языка на нём самом (как в переключателе языков сайта) и код.
// "other" и "unknown" — служебные строки сервера (server/src/lib/languages.ts).
function languageLabel(code: string): string {
  if (code === "other") return "Другие";
  if (code === "unknown") return "Не указан";
  return LANGUAGE_LABELS[code as Language] ?? code;
}

const isServiceLanguage = (code: string) => code === "other" || code === "unknown";

type LanguageSortKey =
  | "activity"
  | "usersTotal"
  | "usersActive"
  | "usersNew"
  | "botDownloads"
  | "webDownloads"
  | "extensionDownloads"
  | "totalDownloads";

const LANGUAGE_COLUMNS: { key: Exclude<LanguageSortKey, "activity">; label: string; group: "users" | "downloads" }[] = [
  { key: "usersTotal", label: "Всего", group: "users" },
  { key: "usersActive", label: "Активных", group: "users" },
  { key: "usersNew", label: "Новых", group: "users" },
  { key: "botDownloads", label: "Бот", group: "downloads" },
  { key: "webDownloads", label: "Сайт", group: "downloads" },
  { key: "extensionDownloads", label: "Расширение", group: "downloads" },
  { key: "totalDownloads", label: "Всего", group: "downloads" },
];

// «Активность» по умолчанию — скачивания за период, при равенстве — активные
// и все пользователи бота. «Другие» и «Не указан» всегда внизу, над итогом:
// это не языки, и наверху они только мешали бы.
function sortLanguageRows(rows: LanguageStatsRow[], key: LanguageSortKey): LanguageStatsRow[] {
  const byActivity = (a: LanguageStatsRow, b: LanguageStatsRow) =>
    b.totalDownloads - a.totalDownloads || b.usersActive - a.usersActive || b.usersTotal - a.usersTotal;
  return [...rows].sort((a, b) => {
    const service = Number(isServiceLanguage(a.lang)) - Number(isServiceLanguage(b.lang));
    if (service) return service;
    if (key !== "activity") {
      const diff = b[key] - a[key];
      if (diff) return diff;
    }
    return byActivity(a, b) || a.lang.localeCompare(b.lang);
  });
}

function LanguagesTable() {
  const q = usePeriodQuery<LanguageStatsRow[]>("languages");
  const rows = q.data ?? [];
  const [sortKey, setSortKey] = useState<LanguageSortKey>("activity");
  const sorted = sortLanguageRows(rows, sortKey);
  const totals = LANGUAGE_COLUMNS.reduce(
    (acc, c) => ({ ...acc, [c.key]: rows.reduce((sum, r) => sum + r[c.key], 0) }),
    {} as Record<(typeof LANGUAGE_COLUMNS)[number]["key"], number>
  );
  const sinceText = formatLongDate(LANGUAGE_TRACKING_SINCE);

  const header = (key: LanguageSortKey, label: string, className = "") => (
    <th className={`pb-2 font-medium ${className}`}>
      <button
        type="button"
        onClick={() => setSortKey(key)}
        className={`hover:text-foreground ${sortKey === key ? "text-foreground" : ""}`}
      >
        {label}
        {sortKey === key ? " ↓" : ""}
      </button>
    </th>
  );

  return (
    <ChartCard
      title={`Языки — ${q.label.toLowerCase()}`}
      hint="Пользователи бота — по языку бота (выбранному вручную или языку Telegram): всего — пришедшие до конца периода, активные и новые — за период. Скачивания — успешные за период; бот — по языку пользователя, сайт и расширение — по языку интерфейса. Нажмите на заголовок, чтобы отсортировать."
      period={q.period}
      onPeriod={q.setPeriod}
      loading={q.loading}
      error={q.error}
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-sm">
          <thead className="text-left text-foreground/60">
            <tr>
              <th className="pb-1 font-medium" />
              <th colSpan={3} className="pb-1 text-right font-medium">
                Пользователи бота
              </th>
              <th colSpan={4} className="pb-1 text-right font-medium">
                Скачивания
              </th>
            </tr>
            <tr>
              {header("activity", "Язык")}
              {LANGUAGE_COLUMNS.map((c) => (
                <Fragment key={c.key}>
                  {header(c.key, c.label, `text-right ${c.key === "botDownloads" ? "pl-6" : "pl-3"}`)}
                </Fragment>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((r) => (
              <tr key={r.lang} className="border-t border-border/40">
                <td className="py-2">
                  <span className={isServiceLanguage(r.lang) ? "text-foreground/60" : ""}>
                    {languageLabel(r.lang)}
                  </span>
                  {!isServiceLanguage(r.lang) && (
                    <span className="ml-2 text-xs text-foreground/50">{r.lang}</span>
                  )}
                </td>
                {LANGUAGE_COLUMNS.map((c) => (
                  <td
                    key={c.key}
                    className={`py-2 text-right tabular-nums ${c.key === "botDownloads" ? "pl-6" : "pl-3"} ${
                      c.key === "totalDownloads" ? "font-medium" : ""
                    } ${r[c.key] === 0 ? "text-foreground/30" : ""}`}
                  >
                    {r[c.key]}
                  </td>
                ))}
              </tr>
            ))}
            {!sorted.length && (
              <tr>
                <td colSpan={8} className="py-8 text-center text-foreground/40">
                  Нет данных
                </td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-border/60 font-medium">
              <td className="py-2">Итого</td>
              {LANGUAGE_COLUMNS.map((c) => (
                <td
                  key={c.key}
                  className={`py-2 text-right tabular-nums ${c.key === "botDownloads" ? "pl-6" : "pl-3"}`}
                >
                  {totals[c.key]}
                </td>
              ))}
            </tr>
          </tfoot>
        </table>
      </div>
      <p className="mt-3 text-xs text-foreground/50">
        Язык сайта и расширения записывается с {sinceText}; раньше — «Не указан».
      </p>
    </ChartCard>
  );
}

function LanguagesTopChart() {
  const q = usePeriodQuery<LanguageStatsRow[]>("languages");
  // Топ-15 по скачиваниям — только настоящие языки: «Не указан» до выката
  // записи языка забирал бы почти весь сайт и расширение.
  const top = (q.data ?? [])
    .filter((r) => !isServiceLanguage(r.lang) && r.totalDownloads > 0)
    .sort((a, b) => b.totalDownloads - a.totalDownloads)
    .slice(0, 15)
    .map((r) => ({ ...r, label: `${languageLabel(r.lang)} (${r.lang})` }));

  return (
    <ChartCard
      title={`Топ-15 языков по скачиваниям — ${q.label.toLowerCase()}`}
      period={q.period}
      onPeriod={q.setPeriod}
      loading={q.loading}
      error={q.error}
    >
      {top.length ? (
        <ScrollableChart points={0} height={Math.max(160, top.length * 32 + 60)}>
          <BarChart data={top} layout="vertical" margin={{ left: 8, right: 16 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis type="number" fontSize={12} allowDecimals={false} />
            <YAxis type="category" dataKey="label" fontSize={12} width={150} interval={0} />
            <Tooltip />
            <Legend />
            <Bar dataKey="botDownloads" name={SOURCE_LABELS.BOT} stackId="downloads" fill={SOURCE_COLORS.BOT} />
            <Bar dataKey="webDownloads" name={SOURCE_LABELS.WEB} stackId="downloads" fill={SOURCE_COLORS.WEB} />
            <Bar
              dataKey="extensionDownloads"
              name={SOURCE_LABELS.EXTENSION}
              stackId="downloads"
              fill={SOURCE_COLORS.EXTENSION}
            />
          </BarChart>
        </ScrollableChart>
      ) : (
        <EmptyChart>{q.loading ? "Загрузка…" : "За период нет скачиваний с известным языком"}</EmptyChart>
      )}
    </ChartCard>
  );
}

export function LanguagesTab() {
  return (
    <section className="grid grid-cols-1 gap-6">
      <LanguagesTable />
      <LanguagesTopChart />
    </section>
  );
}
