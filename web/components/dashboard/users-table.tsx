"use client";

import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { BotUserRow, UserJournal } from "@/lib/analytics-api";
import { ChartCard, useAnalytics } from "./chart-card";
import { PROMO_LABELS } from "./block-outcomes";
import { CATEGORY_LABELS } from "./errors-log";
import { PLATFORM_OPTIONS, SOURCE_LABELS } from "./format";
import { formatAttemptTime, formatShortDate, formatShortTime } from "./tables";

// «Все пользователи» (вкладка «Пользователи»): каждый пользователь бота —
// статус, язык, когда пришёл и был, удачи и ошибки по площадкам. Фильтры,
// поиск и сортировка — здесь, в браузере: людей сотни. По нажатию на строку —
// окно с журналом этого человека (UserJournalModal), его же открывают
// таблицы «Заблокировали» и «Разблокировали».

const PAGE_SIZE = 50;

export const USER_STATUS_LABELS: Record<BotUserRow["status"], string> = {
  active: "Активный",
  inactive: "Неактивный",
  blocked: "Заблокировал",
};

const USER_STATUS_CLASSES: Record<BotUserRow["status"], string> = {
  active: "bg-emerald-500/15 text-emerald-600",
  inactive: "bg-foreground/10 text-foreground/60",
  blocked: "bg-red-500/15 text-red-600",
};

const selectClass =
  "h-8 rounded-md border border-input bg-transparent px-2 text-xs outline-none focus-visible:ring-1 focus-visible:ring-ring";

type SortKey = "lastSeenAt" | "firstSeenAt" | "ok" | "failed" | "lastDownloadAt";
const SORTS: { key: SortKey; label: string }[] = [
  { key: "lastSeenAt", label: "Был последним" },
  { key: "firstSeenAt", label: "Пришёл последним" },
  { key: "ok", label: "Больше скачиваний" },
  { key: "failed", label: "Больше ошибок" },
  { key: "lastDownloadAt", label: "Скачивал последним" },
];

// Ссылка на человека в Telegram. Без @username — по ID: tg://user?id=…
// открывает профиль только в приложении Telegram и только если оно этого
// человека «знает» (общий чат); иначе ссылка ничего не откроет.
export function telegramHref(u: { username: string | null; telegramId: string }): string {
  return u.username ? `https://t.me/${u.username}` : `tg://user?id=${u.telegramId}`;
}

export function UserName({ u }: { u: { username: string | null; firstName: string | null; telegramId: string } }) {
  return (
    <>
      <a
        href={telegramHref(u)}
        target="_blank"
        rel="noopener noreferrer"
        className="hover:underline"
        title={u.username ? undefined : "Без @username: ссылка по ID откроется только в приложении Telegram, и то не всегда"}
        onClick={(e) => e.stopPropagation()}
      >
        {u.username ? `@${u.username}` : u.telegramId}
      </a>
      {u.firstName && <span className="ml-2 text-foreground/50">{u.firstName}</span>}
    </>
  );
}

function sortValue(u: BotUserRow, key: SortKey): number {
  if (key === "ok" || key === "failed") return u[key];
  const v = u[key];
  return v ? new Date(v).getTime() : 0;
}

export function AllUsersTable({ onOpen }: { onOpen: (telegramId: string) => void }) {
  const q = useAnalytics<BotUserRow[]>("users/all");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [platform, setPlatform] = useState("");
  const [channel, setChannel] = useState("");
  const [sort, setSort] = useState<SortKey>("lastSeenAt");
  const [offset, setOffset] = useState(0);

  const all = q.data ?? [];
  const rows = useMemo(() => {
    const needle = search.trim().toLowerCase().replace(/^@/, "");
    return all
      .filter((u) => !status || u.status === status)
      .filter((u) => !platform || u.platforms.some((p) => p.platform === platform.toLowerCase()))
      .filter((u) => !channel || (channel === "yes" ? u.inChannel === true : channel === "no" ? u.inChannel === false : u.inChannel === null))
      .filter(
        (u) =>
          !needle ||
          u.telegramId.includes(needle) ||
          (u.username ?? "").toLowerCase().includes(needle) ||
          (u.firstName ?? "").toLowerCase().includes(needle),
      )
      .sort((a, b) => sortValue(b, sort) - sortValue(a, sort));
  }, [all, search, status, platform, channel, sort]);
  // Фильтр сменился — с первой страницы.
  useEffect(() => setOffset(0), [search, status, platform, channel, sort]);

  const counts = useMemo(() => {
    const c = { active: 0, inactive: 0, blocked: 0 };
    for (const u of all) c[u.status]++;
    return {
      ...c,
      inChannel: all.filter((u) => u.inChannel === true).length,
      notInChannel: all.filter((u) => u.inChannel === false).length,
      channelUnknown: all.filter((u) => u.inChannel === null).length,
    };
  }, [all]);
  // После обновления данных список мог стать короче текущей страницы.
  const start = offset < rows.length ? offset : Math.max(0, Math.floor((rows.length - 1) / PAGE_SIZE) * PAGE_SIZE);
  const page = rows.slice(start, start + PAGE_SIZE);

  return (
    <ChartCard
      title={`Все пользователи бота · ${all.length}`}
      hint="Активный — удачно скачивал за последние 30 дней (как на странице «Videoner в цифрах»), заблокировал — сейчас, неактивный — остальные. «Удачно / ошибок» и «Где» — за всё время, без API; отказы при разборе ссылки — с 12.11.2026. «В канале» — подписка на @videonerdownload, проверяется раз в сутки. Время — по Алматы. Нажмите на строку — откроется журнал пользователя."
      loading={q.loading}
      error={q.error}
      wide
    >
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Поиск: @username, имя или ID"
          className="h-8 w-56 rounded-md border border-input bg-transparent px-2 text-xs outline-none focus-visible:ring-1 focus-visible:ring-ring"
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)} className={selectClass} aria-label="Статус">
          <option value="">Все статусы</option>
          {(Object.keys(USER_STATUS_LABELS) as BotUserRow["status"][]).map((s) => (
            <option key={s} value={s}>
              {USER_STATUS_LABELS[s]} · {counts[s]}
            </option>
          ))}
        </select>
        <select value={platform} onChange={(e) => setPlatform(e.target.value)} className={selectClass} aria-label="Площадка">
          <option value="">Все площадки</option>
          {PLATFORM_OPTIONS.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
        <select value={channel} onChange={(e) => setChannel(e.target.value)} className={selectClass} aria-label="Канал">
          <option value="">Канал: все</option>
          <option value="yes">В канале · {counts.inChannel}</option>
          <option value="no">Не в канале · {counts.notInChannel}</option>
          {counts.channelUnknown > 0 && <option value="unknown">Не проверяли · {counts.channelUnknown}</option>}
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)} className={selectClass} aria-label="Сортировка">
          {SORTS.map((s) => (
            <option key={s.key} value={s.key}>
              {s.label}
            </option>
          ))}
        </select>
        <span className="text-xs text-foreground/50">Найдено: {rows.length}</span>
      </div>
      <div className="max-h-[560px] overflow-auto">
        <table className="w-full min-w-[900px] text-sm">
          <thead className="sticky top-0 bg-background text-left text-foreground/60">
            <tr>
              <th className="pb-2 font-medium">Пользователь</th>
              <th className="pb-2 font-medium">Статус</th>
              <th className="pb-2 font-medium">Язык</th>
              <th className="pb-2 font-medium" title="Подписан на канал @videonerdownload — по проверке раз в сутки">
                В канале
              </th>
              <th className="pb-2 font-medium">Пришёл</th>
              <th className="pb-2 font-medium">Был</th>
              <th className="pb-2 text-right font-medium">Удачно / ошибок</th>
              <th className="pb-2 pl-4 font-medium">Где</th>
            </tr>
          </thead>
          <tbody>
            {page.map((u) => (
              <tr
                key={u.telegramId}
                className="cursor-pointer border-t border-border/40 hover:bg-foreground/5"
                onClick={() => onOpen(u.telegramId)}
              >
                <td className="py-2">
                  <UserName u={u} />
                  {u.extension && (
                    <span className="ml-2 text-xs text-foreground/40" title="Подключал аккаунт из расширения">
                      🧩
                    </span>
                  )}
                </td>
                <td className="py-2">
                  <span className={`inline-block rounded px-2 py-0.5 text-xs ${USER_STATUS_CLASSES[u.status]}`}>
                    {USER_STATUS_LABELS[u.status]}
                  </span>
                </td>
                <td className="py-2 text-foreground/60">{u.languageCode ?? "—"}</td>
                <td className="py-2">
                  {u.inChannel === true ? (
                    <span className="text-emerald-600">да</span>
                  ) : u.inChannel === false ? (
                    <span className="text-foreground/40">нет</span>
                  ) : (
                    <span className="text-foreground/30" title="Ещё не проверяли">?</span>
                  )}
                </td>
                <td className="py-2 tabular-nums text-foreground/60">{formatShortDate(u.firstSeenAt)}</td>
                <td className="py-2 tabular-nums text-foreground/60">{formatShortDate(u.lastSeenAt)}</td>
                <td className="whitespace-nowrap py-2 text-right tabular-nums">
                  <span className="text-emerald-600">{u.ok}</span>
                  <span className="text-foreground/40"> / </span>
                  <span className={u.failed ? "text-red-600" : "text-foreground/40"}>{u.failed}</span>
                </td>
                <td className="py-2 pl-4 text-xs text-foreground/70">
                  {u.platforms.length
                    ? u.platforms.map((p) => (
                        <span key={p.platform} className="mr-2 inline-block whitespace-nowrap">
                          {p.platform.toUpperCase()} {p.ok}
                          {p.failed > 0 && <span className="text-red-600"> / {p.failed}</span>}
                        </span>
                      ))
                    : "—"}
                </td>
              </tr>
            ))}
            {!q.loading && page.length === 0 && (
              <tr>
                <td colSpan={8} className="py-6 text-center text-foreground/40">
                  Никого не нашлось
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {rows.length > PAGE_SIZE && (
        <div className="mt-3 flex items-center justify-between text-xs text-foreground/60">
          <span>
            {start + 1}–{Math.min(start + PAGE_SIZE, rows.length)} из {rows.length}
          </span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={start === 0} onClick={() => setOffset(Math.max(0, start - PAGE_SIZE))}>
              Назад
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={start + PAGE_SIZE >= rows.length}
              onClick={() => setOffset(start + PAGE_SIZE)}
            >
              Дальше
            </Button>
          </div>
        </div>
      )}
    </ChartCard>
  );
}

function fmtSize(bytes: number | null): string {
  if (!bytes) return "";
  const mb = bytes / 1024 / 1024;
  return mb >= 1 ? `${mb.toFixed(1)} МБ` : `${Math.max(1, Math.round(bytes / 1024))} КБ`;
}

const BLOCK_SOURCE_HINT: Record<string, string> = {
  telegram: "",
  check: " (≈, время проверки)",
  baseline: " (до начала учёта)",
};

// Окно с журналом одного пользователя: сводка, все скачивания и отказы при
// разборе ссылки (последние 500), блокировки и показанные подсказки.
export function UserJournalModal({ telegramId, onClose }: { telegramId: string; onClose: () => void }) {
  const q = useAnalytics<UserJournal>("users/journal", { telegramId });
  const [platform, setPlatform] = useState("");
  const [onlyFailed, setOnlyFailed] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [onClose]);

  const j = q.data;
  const platforms = useMemo(() => [...new Set((j?.entries ?? []).map((e) => e.platform))].sort(), [j]);
  const entries = (j?.entries ?? []).filter(
    (e) => (!platform || e.platform === platform) && (!onlyFailed || (!e.ok && !e.pending)),
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 sm:p-8"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-5xl rounded-lg border border-border bg-background p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 rounded p-1 text-foreground/60 hover:bg-foreground/10"
          aria-label="Закрыть"
        >
          <X className="h-5 w-5" />
        </button>
        {q.loading && !j && <p className="py-10 text-center text-sm text-foreground/50">Загружаю…</p>}
        {q.error && <p className="py-10 text-center text-sm text-red-600">{q.error}</p>}
        {j && (
          <>
            <h2 className="pr-8 text-lg font-semibold">
              <UserName u={j} />
            </h2>
            <dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1 text-sm sm:grid-cols-4">
              <Item label="Telegram ID" value={j.telegramId} />
              <Item label="Язык" value={j.languageCode ?? "—"} />
              <Item label="Пришёл" value={formatShortTime(j.firstSeenAt)} />
              <Item label="Был" value={formatShortTime(j.lastSeenAt)} />
              <Item
                label="Бот"
                value={j.blockedAt ? `заблокировал ${formatShortTime(j.blockedAt)}` : "не заблокирован"}
              />
              <Item label="Удачно / ошибок" value={`${j.ok} / ${j.failed}`} />
              <Item
                label="Расширение"
                value={j.extensionLinkedAt ? `подключал аккаунт ${formatShortDate(j.extensionLinkedAt)}` : "—"}
              />
              <Item label="Сайт через Telegram" value={j.lastWebLoginAt ? formatShortDate(j.lastWebLoginAt) : "—"} />
              <Item
                label="Канал @videonerdownload"
                value={
                  j.inChannel === null
                    ? "не проверяли"
                    : `${j.inChannel ? "подписан" : "не подписан"}${j.inChannelCheckedAt ? ` (проверка ${formatShortDate(j.inChannelCheckedAt)})` : ""}`
                }
              />
              <Item label="«Сразу видео»" value={j.instantVideo ? "включён" : "выключен"} />
            </dl>

            {(j.blocks.length > 0 || j.promos.length > 0) && (
              <div className="mt-3 flex flex-wrap gap-x-8 gap-y-1 text-xs text-foreground/70">
                {j.blocks.length > 0 && (
                  <div>
                    <span className="text-foreground/50">Блокировки: </span>
                    {j.blocks.map((b, i) => (
                      <span key={i} className="mr-3 whitespace-nowrap">
                        {b.blocked ? "⛔ заблокировал" : "✅ вернулся"} {formatShortTime(b.at)}
                        {BLOCK_SOURCE_HINT[b.source] ?? ""}
                      </span>
                    ))}
                  </div>
                )}
                {j.promos.length > 0 && (
                  <div>
                    <span className="text-foreground/50">Подсказки: </span>
                    {j.promos.map((p) => (
                      <span key={p.key} className="mr-3 whitespace-nowrap">
                        {PROMO_LABELS[p.key] ?? p.key} {formatShortTime(p.at)}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <select value={platform} onChange={(e) => setPlatform(e.target.value)} className={selectClass} aria-label="Площадка">
                <option value="">Все площадки</option>
                {platforms.map((p) => (
                  <option key={p} value={p}>
                    {p.toUpperCase()}
                  </option>
                ))}
              </select>
              <label className="flex items-center gap-1 text-xs text-foreground/70">
                <input type="checkbox" checked={onlyFailed} onChange={(e) => setOnlyFailed(e.target.checked)} />
                только ошибки
              </label>
              <span className="text-xs text-foreground/50">
                Записей: {entries.length}
                {j.truncated && ` (последние ${j.entries.length})`}
              </span>
            </div>

            <div className="mt-2 max-h-[60vh] overflow-auto">
              <table className="w-full min-w-[760px] text-sm">
                <thead className="sticky top-0 bg-background text-left text-foreground/60">
                  <tr>
                    <th className="pb-2 font-medium">Когда</th>
                    <th className="pb-2 font-medium">Откуда</th>
                    <th className="pb-2 font-medium">Площадка</th>
                    <th className="pb-2 font-medium">Итог</th>
                    <th className="pb-2 font-medium">Ссылка</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((e, i) => (
                    <tr key={i} className="border-t border-border/40 align-top">
                      <td className="whitespace-nowrap py-1.5 pr-3 tabular-nums text-foreground/70">{formatAttemptTime(e.at)}</td>
                      <td className="py-1.5 pr-3 text-foreground/70">{SOURCE_LABELS[e.source] ?? e.source}</td>
                      <td className="py-1.5 pr-3">{e.platform.toUpperCase()}</td>
                      <td className="py-1.5 pr-3">
                        {e.ok ? (
                          <span className="text-emerald-600">
                            №{e.number}
                            {e.fromCache && <span className="text-foreground/40"> · из кеша</span>}
                            {e.fileSize ? <span className="text-foreground/40"> · {fmtSize(e.fileSize)}</span> : null}
                          </span>
                        ) : e.pending ? (
                          <span className="text-foreground/50">качается…</span>
                        ) : (
                          <span className="text-red-600">
                            {e.kind === "link-failure" ? "Разбор ссылки: " : ""}
                            {CATEGORY_LABELS[e.errorCategory ?? ""] ?? (e.status === "FAILED" ? "Ошибка" : e.status)}
                          </span>
                        )}
                      </td>
                      <td className="max-w-[360px] py-1.5">
                        {e.title && <div className="truncate text-xs text-foreground/60">{e.title}</div>}
                        <a href={e.url} target="_blank" rel="noopener noreferrer nofollow" className="break-all text-xs hover:underline">
                          {e.url}
                        </a>
                      </td>
                    </tr>
                  ))}
                  {entries.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-foreground/40">
                        Записей нет
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Item({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-foreground/50">{label}</dt>
      <dd className="tabular-nums">{value}</dd>
    </div>
  );
}
