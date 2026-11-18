"use client";

import type { BotGroups } from "@/lib/analytics-api";
import { ChartCard, useAnalytics } from "./chart-card";
import { formatShortDate, formatShortTime } from "./tables";

// Вкладка «Группы»: группы, куда добавлен бот. Списка своих групп Telegram
// боту не даёт — бот записывает их сам (bot/src/group-tracking.ts): при
// добавлении и при первой ссылке в группе. Учёт с 18.11.2026, поэтому группы,
// куда бота добавили раньше и где с тех пор не присылали ссылок, сюда не попали.

function Stat({ label, value, hint }: { label: string; value: number | string; hint?: string }) {
  return (
    <div className="rounded-lg border border-border/60 p-4" title={hint}>
      <div className="text-xs text-foreground/60">{label}</div>
      <div className="mt-1 text-2xl font-semibold tabular-nums">{value}</div>
    </div>
  );
}

export function GroupsTab() {
  const q = useAnalytics<BotGroups>("groups");
  const d = q.data;
  return (
    <>
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="Всего групп" value={d?.total ?? "—"} hint="Все, о которых знает бот, включая те, откуда его удалили" />
        <Stat label="Бот сейчас в группе" value={d?.present ?? "—"} />
        <Stat label="Активны за 7 дней" value={d?.activeWeek ?? "—"} hint="Ссылка, видео или добавление бота за последнюю неделю" />
        <Stat label="Видео в группы" value={d?.downloads ?? "—"} hint="Сколько видео бот прислал в группы с 18.11.2026" />
      </section>
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartCard
          title={`Группы · ${d?.groups.length ?? 0}`}
          hint="Учёт с 18.11.2026: группа попадает сюда, когда бота добавляют или когда в ней присылают ссылку. Ссылка есть только у открытых групп. Участников бот уточняет раз в сутки. Время — по Алматы."
          loading={q.loading}
          error={q.error}
          wide
        >
          <div className="max-h-[640px] overflow-auto">
            <table className="w-full min-w-[820px] text-sm">
              <thead className="sticky top-0 bg-background text-left text-foreground/60">
                <tr>
                  <th className="pb-2 font-medium">Группа</th>
                  <th className="pb-2 font-medium">Статус</th>
                  <th className="pb-2 text-right font-medium">Участников</th>
                  <th className="pb-2 text-right font-medium">Видео</th>
                  <th className="pb-2 pl-4 font-medium">Добавили</th>
                  <th className="pb-2 font-medium">Последняя активность</th>
                </tr>
              </thead>
              <tbody>
                {(d?.groups ?? []).map((g) => {
                  const last = g.lastActivityAt;
                  return (
                    <tr key={g.chatId} className="border-t border-border/40">
                      <td className="py-2">
                        <div>{g.title ?? "Без названия"}</div>
                        <div className="text-xs text-foreground/50">
                          {g.username ? (
                            <a href={`https://t.me/${g.username}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
                              t.me/{g.username}
                            </a>
                          ) : (
                            "закрытая"
                          )}{" "}
                          · {g.chatId}
                        </div>
                      </td>
                      <td className="py-2">
                        {g.removedAt ? (
                          <span className="inline-block rounded bg-red-500/15 px-2 py-0.5 text-xs text-red-600" title={`Удалили ${formatShortTime(g.removedAt)}`}>
                            Удалили бота
                          </span>
                        ) : (
                          <span className="inline-block rounded bg-emerald-500/15 px-2 py-0.5 text-xs text-emerald-600">В группе</span>
                        )}
                      </td>
                      <td className="py-2 text-right tabular-nums">{g.members ?? "—"}</td>
                      <td className="py-2 text-right tabular-nums">{g.downloads}</td>
                      <td className="py-2 pl-4 text-foreground/70">
                        {g.addedAt ? formatShortDate(g.addedAt) : <span title="Бота добавили до начала учёта">раньше</span>}
                        {g.addedById && (
                          <a href={`tg://user?id=${g.addedById}`} className="ml-2 text-xs text-foreground/50 hover:underline">
                            кем: {g.addedById}
                          </a>
                        )}
                      </td>
                      <td className="py-2 text-foreground/70">{last ? formatShortTime(last) : "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {d && !d.groups.length && (
              <p className="py-6 text-center text-sm text-foreground/50">
                Пока ни одной: группы появятся, когда бота добавят или в группе пришлют ссылку.
              </p>
            )}
          </div>
        </ChartCard>
      </section>
    </>
  );
}
