"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import type { ErrorLogPage } from "@/lib/analytics-api";
import { ChartCard, usePeriodQuery } from "./chart-card";
import { countryFlag, countryName } from "./countries";
import { ERROR_COLORS, PLATFORM_OPTIONS, SOURCE_LABELS } from "./format";
import { formatAttemptTime } from "./tables";

// Журнал ошибок (вкладка «Ошибки»): упавшие скачивания и отказы при разборе
// ссылки — кто, какая ссылка, когда и что именно сказала площадка. Повторы
// одной ссылки одним человеком склеены в строку «×N».
//
// Текст ошибки и пользователь у отказов разбора ссылки — с 12.11.2026, у
// упавших скачиваний текст — тоже с этого дня; у более ранних записей их нет.

const PAGE_SIZE = 50;

const CATEGORY_LABELS: Record<string, string> = {
  LOGIN_REQUIRED: "Нужен вход",
  YOUTUBE_AUTH_REQUIRED: "Антибот YouTube",
  SERVER_BLOCKED: "Площадка не пустила сервер",
  REGION_BLOCKED: "Региональный запрет",
  FORMAT_UNAVAILABLE: "Нет такого качества",
  NO_VIDEO_CONTENT: "Нет видео",
  UNSUPPORTED_PLATFORM: "Не поддерживается",
  TIMEOUT: "Таймаут",
  OTHER: "Прочее",
};

const STAGE_LABELS: Record<string, string> = {
  link: "Разбор ссылки",
  download: "Скачивание",
};

const selectClass =
  "h-8 rounded-md border border-input bg-transparent px-2 text-xs outline-none focus-visible:ring-1 focus-visible:ring-ring";

export function ErrorsLog() {
  const [platform, setPlatform] = useState("");
  const [category, setCategory] = useState("");
  const [offset, setOffset] = useState(0);
  const q = usePeriodQuery<ErrorLogPage>("errors/log", {
    platform: platform || undefined,
    category: category || undefined,
    limit: PAGE_SIZE,
    offset,
  });
  // Новый период — с первой страницы, как и смена фильтра.
  useEffect(() => setOffset(0), [q.period]);

  const rows = q.data?.rows ?? [];
  const total = q.data?.total ?? 0;
  const from = total === 0 ? 0 : offset + 1;
  const to = Math.min(offset + PAGE_SIZE, total);

  return (
    <ChartCard
      title={`Журнал ошибок — ${q.label.toLowerCase()}`}
      hint="Упавшие скачивания и отказы при разборе ссылки; повторы одной ссылки одним человеком — одной строкой. Время — Алматы."
      period={q.period}
      onPeriod={q.setPeriod}
      loading={q.loading}
      error={q.error}
      wide
      controls={
        <>
          <select
            value={platform}
            onChange={(e) => {
              setPlatform(e.target.value);
              setOffset(0);
            }}
            className={selectClass}
            aria-label="Площадка"
          >
            <option value="">Все площадки</option>
            {PLATFORM_OPTIONS.map((p) => (
              <option key={p} value={p.toLowerCase()}>
                {p}
              </option>
            ))}
          </select>
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setOffset(0);
            }}
            className={selectClass}
            aria-label="Причина"
          >
            <option value="">Все причины</option>
            {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </>
      }
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] text-sm">
          <thead className="text-left text-foreground/60">
            <tr>
              <th className="pb-2 pr-4 font-medium">Время</th>
              <th className="pb-2 pr-4 font-medium">Пользователь</th>
              <th className="pb-2 pr-4 font-medium">Площадка</th>
              <th className="pb-2 pr-4 font-medium">Этап</th>
              <th className="pb-2 pr-4 font-medium">Причина</th>
              <th className="pb-2 pr-4 font-medium">Ссылка и ошибка</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={`${row.lastAt}-${i}`} className="border-t border-border/40 align-top">
                <td className="whitespace-nowrap py-2 pr-4 tabular-nums text-foreground/80">
                  {formatAttemptTime(row.lastAt)}
                  {row.count > 1 && (
                    <div
                      className="text-xs text-foreground/50"
                      title={`Первая попытка: ${formatAttemptTime(row.firstAt)}`}
                    >
                      ×{row.count}, с {formatAttemptTime(row.firstAt).slice(12)}
                    </div>
                  )}
                </td>
                <td className="py-2 pr-4">
                  {row.username ? (
                    <a
                      href={`https://t.me/${row.username}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      @{row.username}
                    </a>
                  ) : row.telegramId ? (
                    <span className="text-foreground/70">{row.telegramId}</span>
                  ) : null}
                  <div className="text-xs text-foreground/50">
                    {SOURCE_LABELS[row.source] ?? row.source}
                    {row.country && (
                      <span title={countryName(row.country)}>
                        {" "}
                        · {countryFlag(row.country)} {row.country}
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-2 pr-4 text-foreground/70">{row.platform.toUpperCase()}</td>
                <td className="whitespace-nowrap py-2 pr-4 text-foreground/60">{STAGE_LABELS[row.stage] ?? row.stage}</td>
                <td className="py-2 pr-4">
                  <span
                    className="inline-flex items-center gap-1.5 whitespace-nowrap text-xs"
                    title={row.category}
                  >
                    <span
                      className="inline-block h-2 w-2 rounded-full"
                      style={{ background: ERROR_COLORS[row.category] ?? "#9ca3af" }}
                    />
                    {CATEGORY_LABELS[row.category] ?? row.category}
                  </span>
                </td>
                <td className="py-2">
                  {row.url ? (
                    <a
                      href={row.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block max-w-[460px] truncate text-xs text-foreground/70 hover:underline"
                      title={row.url}
                    >
                      {row.url}
                    </a>
                  ) : (
                    <span className="text-xs text-foreground/40">ссылка не сохранена</span>
                  )}
                  {row.message ? (
                    <div className="mt-0.5 max-w-[460px] break-words text-xs text-foreground/50">{row.message}</div>
                  ) : (
                    <div className="mt-0.5 text-xs text-foreground/30">текст ошибки не сохранён</div>
                  )}
                </td>
              </tr>
            ))}
            {!q.loading && rows.length === 0 && !q.error && (
              <tr>
                <td colSpan={6} className="py-6 text-center text-foreground/40">
                  {platform || category ? "По выбранному фильтру ошибок нет" : "За период ошибок нет"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="mt-3 flex items-center justify-end gap-2 text-xs text-foreground/50">
        <span>
          {from}–{to} из {total}
        </span>
        <Button
          variant="outline"
          size="sm"
          disabled={offset === 0 || q.loading}
          onClick={() => setOffset(Math.max(0, offset - PAGE_SIZE))}
        >
          Назад
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={to >= total || q.loading}
          onClick={() => setOffset(offset + PAGE_SIZE)}
        >
          Вперёд
        </Button>
      </div>
    </ChartCard>
  );
}
