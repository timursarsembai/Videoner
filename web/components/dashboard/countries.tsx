"use client";

import { Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from "recharts";
import type { CountryStatsRow } from "@/lib/analytics-api";
import { ChartCard, EmptyChart, ScrollableChart, usePeriodQuery } from "./chart-card";
import { COUNTRY_TRACKING_SINCE, SOURCE_COLORS, SOURCE_LABELS, formatLongDate } from "./format";

// Вкладка «Страны»: скачивания сайта и расширения по странам. Страну
// определяет Cloudflare по IP посетителя (заголовок CF-IPCountry); бота здесь
// нет — Telegram не сообщает ботам, откуда человек.

const UNKNOWN = "unknown";

const regionNames = (() => {
  try {
    return new Intl.DisplayNames(["ru"], { type: "region" });
  } catch {
    return null;
  }
})();

export function countryName(code: string): string {
  if (code === UNKNOWN) return "Не определена";
  try {
    return regionNames?.of(code) ?? code;
  } catch {
    return code;
  }
}

// Флаг из кода страны: две буквы → два «региональных индикатора» Unicode.
export function countryFlag(code: string): string {
  if (!/^[A-Z]{2}$/.test(code)) return "🌐";
  return String.fromCodePoint(...Array.from(code, (c) => 0x1f1e6 + c.charCodeAt(0) - 65));
}

const trackingNote = `Страна записывается с ${formatLongDate(COUNTRY_TRACKING_SINCE)}; раньше — «Не определена». Только успешные скачивания сайта и расширения: бот страну не знает.`;

function CountriesTable() {
  const q = usePeriodQuery<CountryStatsRow[]>("countries");
  const rows = q.data ?? [];
  // «Не определена» — всегда внизу: это не страна.
  const sorted = [...rows].sort(
    (a, b) => Number(a.country === UNKNOWN) - Number(b.country === UNKNOWN) || b.totalDownloads - a.totalDownloads,
  );
  const total = rows.reduce((sum, r) => sum + r.totalDownloads, 0);
  const sum = (key: "webDownloads" | "extensionDownloads") => rows.reduce((acc, r) => acc + r[key], 0);
  const share = (n: number) => (total ? `${((n / total) * 100).toLocaleString("ru-RU", { maximumFractionDigits: 1 })}%` : "—");

  return (
    <ChartCard
      title={`Страны — ${q.label.toLowerCase()}`}
      hint={trackingNote}
      period={q.period}
      onPeriod={q.setPeriod}
      loading={q.loading}
      error={q.error}
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] text-sm">
          <thead className="text-left text-foreground/60">
            <tr>
              <th className="pb-2 font-medium">Страна</th>
              <th className="pb-2 pl-3 text-right font-medium">{SOURCE_LABELS.WEB}</th>
              <th className="pb-2 pl-3 text-right font-medium">{SOURCE_LABELS.EXTENSION}</th>
              <th className="pb-2 pl-3 text-right font-medium">Всего</th>
              <th className="pb-2 pl-3 text-right font-medium">Доля</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((r) => (
              <tr key={r.country} className="border-t border-border/40">
                <td className="py-2">
                  <span className="mr-2">{countryFlag(r.country)}</span>
                  <span className={r.country === UNKNOWN ? "text-foreground/60" : ""}>{countryName(r.country)}</span>
                  {r.country !== UNKNOWN && <span className="ml-2 text-xs text-foreground/50">{r.country}</span>}
                </td>
                <td className={`py-2 pl-3 text-right tabular-nums ${r.webDownloads ? "" : "text-foreground/30"}`}>
                  {r.webDownloads}
                </td>
                <td className={`py-2 pl-3 text-right tabular-nums ${r.extensionDownloads ? "" : "text-foreground/30"}`}>
                  {r.extensionDownloads}
                </td>
                <td className="py-2 pl-3 text-right font-medium tabular-nums">{r.totalDownloads}</td>
                <td className="py-2 pl-3 text-right tabular-nums text-foreground/60">{share(r.totalDownloads)}</td>
              </tr>
            ))}
            {!sorted.length && !q.loading && (
              <tr>
                <td colSpan={5} className="py-8 text-center text-foreground/40">
                  За период нет скачиваний с сайта и из расширения
                </td>
              </tr>
            )}
          </tbody>
          {sorted.length > 0 && (
            <tfoot>
              <tr className="border-t-2 border-border/60 font-medium">
                <td className="py-2">Итого</td>
                <td className="py-2 pl-3 text-right tabular-nums">{sum("webDownloads")}</td>
                <td className="py-2 pl-3 text-right tabular-nums">{sum("extensionDownloads")}</td>
                <td className="py-2 pl-3 text-right tabular-nums">{total}</td>
                <td className="py-2 pl-3 text-right tabular-nums">100%</td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </ChartCard>
  );
}

function CountriesTopChart() {
  const q = usePeriodQuery<CountryStatsRow[]>("countries");
  const top = (q.data ?? [])
    .filter((r) => r.country !== UNKNOWN && r.totalDownloads > 0)
    .sort((a, b) => b.totalDownloads - a.totalDownloads)
    .slice(0, 15)
    .map((r) => ({ ...r, label: `${countryFlag(r.country)} ${countryName(r.country)}` }));
  const height = Math.max(160, top.length * 32 + 60);

  return (
    <ChartCard
      title={`Топ-15 стран по скачиваниям — ${q.label.toLowerCase()}`}
      period={q.period}
      onPeriod={q.setPeriod}
      loading={q.loading}
      error={q.error}
    >
      {top.length ? (
        <ScrollableChart points={0} height={height}>
          <BarChart data={top} layout="vertical" margin={{ left: 8, right: 16 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis type="number" fontSize={12} allowDecimals={false} />
            <YAxis type="category" dataKey="label" fontSize={12} width={170} interval={0} />
            <Tooltip />
            <Legend />
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
        <EmptyChart>{q.loading ? "Загрузка…" : "За период нет скачиваний с известной страной"}</EmptyChart>
      )}
    </ChartCard>
  );
}

export function CountriesTab() {
  return (
    <section className="grid grid-cols-1 gap-6">
      <CountriesTable />
      <CountriesTopChart />
    </section>
  );
}
