"use client";

import type { SurveyStats } from "@/lib/analytics-api";
import { ChartCard, EmptyChart, useAnalytics } from "./chart-card";

// Опрос в боте о расшифровке видео (bot/src/survey.ts, 23.11.2026).
const OPTION_LABELS: Record<string, string> = {
  subtitles: "🎬 Субтитры для видео, где их нет",
  text: "📄 Текст из видео целиком",
  summary: "📋 Краткий конспект длинного видео",
  none: "🙅 Ничего из этого",
};

const pct = (n: number, of: number) => (of ? Math.round((n / of) * 100) : 0);

export function SurveyCard() {
  const q = useAnalytics<SurveyStats>("users/survey");
  const d = q.data;
  return (
    <ChartCard
      title="Опрос: нужна ли расшифровка видео"
      hint={
        "Опрос приходит в боте после скачивания (каждому один раз) и разовой рассылкой тем, кто давно не качал. " +
        "Можно выбрать несколько вариантов, поэтому сумма процентов больше 100. Проценты — от ответивших."
      }
      loading={q.loading}
      error={q.error}
    >
      {d && d.shown ? (
        <div className="space-y-3 text-sm">
          <p>
            Показан: <b>{d.shown}</b> · ответили: <b>{d.answered}</b> ({pct(d.answered, d.shown)}%) · нажали «Готово»: {d.done}
          </p>
          <ul className="space-y-1.5">
            {d.options.map((o) => (
              <li key={o}>
                <div className="flex justify-between gap-2">
                  <span>{OPTION_LABELS[o] ?? o}</span>
                  <span className="tabular-nums">
                    {d.totals[o] ?? 0} ({pct(d.totals[o] ?? 0, d.answered)}%)
                  </span>
                </div>
                <div className="mt-0.5 h-1.5 rounded bg-foreground/10">
                  <div className="h-1.5 rounded bg-primary" style={{ width: `${pct(d.totals[o] ?? 0, d.answered)}%` }} />
                </div>
              </li>
            ))}
          </ul>
          {d.byLang.length > 0 && (
            <details>
              <summary className="cursor-pointer text-xs text-foreground/60">По языкам</summary>
              <table className="mt-1 w-full text-xs">
                <thead className="text-muted-foreground">
                  <tr>
                    <th className="text-left font-normal">Язык</th>
                    <th className="text-right font-normal">Ответили</th>
                    {d.options.map((o) => (
                      <th key={o} className="text-right font-normal">
                        {(OPTION_LABELS[o] ?? o).split(" ")[0]}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {d.byLang.map((l) => (
                    <tr key={l.lang}>
                      <td>{l.lang}</td>
                      <td className="text-right tabular-nums">{l.answered}</td>
                      {d.options.map((o) => (
                        <td key={o} className="text-right tabular-nums">
                          {l.totals[o] ?? 0}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </details>
          )}
        </div>
      ) : (
        <EmptyChart height={120}>Опрос ещё никому не показан</EmptyChart>
      )}
    </ChartCard>
  );
}
