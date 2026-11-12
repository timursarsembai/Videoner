"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { fetchAttempts, type AttemptRow, type BlockedUser, type TopUser } from "@/lib/analytics-api";
import { PLATFORM_OPTIONS, SOURCE_LABELS } from "./format";
import { countryFlag, countryName } from "./countries";

// Таблицы дашборда: кто заблокировал бота, самые активные пользователи и
// журнал попыток скачивания.

// Время в днях и минутах (без секунд) — для таблиц, где важна дата, а не
// точный момент; пояс тот же, что в журнале попыток.
function formatShortTime(iso: string): string {
  return new Date(iso).toLocaleString("ru-RU", {
    timeZone: "Asia/Almaty",
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatShortDate(iso: string): string {
  return new Date(iso).toLocaleDateString("ru-RU", {
    timeZone: "Asia/Almaty",
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
}

// Насколько точно известно время последнего события — зависит от того, как
// его узнали (BotBlockEvent.source).
function blockEventTime(event: BlockedUser["lastEvent"]): { text: string; hint?: string } {
  if (!event || event.source === "baseline") {
    return { text: "до 29.10.26", hint: "Заблокировал до начала учёта — точная дата неизвестна" };
  }
  if (event.source === "check") {
    return {
      text: `≈ ${formatShortTime(event.at)}`,
      hint: "Время проверки после рассылки; сама блокировка — между рассылкой и проверкой",
    };
  }
  return { text: formatShortTime(event.at) };
}

// Заблокировал, но пользуется дальше: блокировка запрещает боту писать в
// личку, а инлайн-режим и группы работают и без неё.
function activeAfterBlock(u: BlockedUser): boolean {
  return u.blocked && !!u.lastEvent && new Date(u.lastSeenAt) > new Date(u.lastEvent.at);
}

// Сначала свежие события; те, чья дата неизвестна (baseline), — в конце.
function sortBlockedUsers(users: BlockedUser[]): BlockedUser[] {
  const time = (u: BlockedUser) =>
    !u.lastEvent || u.lastEvent.source === "baseline" ? 0 : new Date(u.lastEvent.at).getTime();
  return [...users].sort((a, b) => time(b) - time(a));
}

export function BlockedUsersTable({ users }: { users: BlockedUser[] }) {
  const rows = sortBlockedUsers(users);
  return (
    <div className="rounded-lg border border-border/60 bg-background/60 p-4 lg:col-span-2">
      <h2 className="mb-1 text-sm font-medium text-foreground/70">Заблокировали бота</h2>
      <p className="mb-4 text-xs text-foreground/50">
        Кто заблокировал бота или удалил аккаунт, и кто потом вернулся. «Но пользуется» — заблокировал
        личку с ботом, но качает через инлайн-режим или в группах. Время — по Алматы.
      </p>
      <div className="max-h-[420px] overflow-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="sticky top-0 bg-background text-left text-foreground/60">
            <tr>
              <th className="pb-2 font-medium">Пользователь</th>
              <th className="pb-2 font-medium">Язык</th>
              <th className="pb-2 font-medium">Пришёл</th>
              <th className="pb-2 text-right font-medium">Скачиваний</th>
              <th className="pb-2 pl-4 font-medium">Когда</th>
              <th className="pb-2 font-medium">Сейчас</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((u) => {
              const when = blockEventTime(u.lastEvent);
              return (
                <tr key={u.telegramId} className="border-t border-border/40">
                  <td className="py-2">
                    {u.username ? (
                      <a
                        href={`https://t.me/${u.username}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        @{u.username}
                      </a>
                    ) : (
                      <span className="text-foreground/70">{u.telegramId}</span>
                    )}
                    {u.firstName && <span className="ml-2 text-foreground/50">{u.firstName}</span>}
                  </td>
                  <td className="py-2 text-foreground/60">{u.languageCode ?? "—"}</td>
                  <td className="py-2 tabular-nums text-foreground/60">{formatShortDate(u.firstSeenAt)}</td>
                  <td className="py-2 text-right tabular-nums">{u.downloadCount}</td>
                  <td className="whitespace-nowrap py-2 pl-4 tabular-nums text-foreground/80" title={when.hint}>
                    {when.text}
                  </td>
                  <td className="py-2">
                    <span
                      className={`inline-block rounded px-2 py-0.5 text-xs ${
                        u.blocked ? "bg-red-500/15 text-red-600" : "bg-emerald-500/15 text-emerald-600"
                      }`}
                    >
                      {u.blocked ? "Заблокирован" : "Вернулся"}
                    </span>
                    {activeAfterBlock(u) && (
                      <div
                        className="mt-1 text-xs text-foreground/50"
                        title="Бот не может писать ему в личку, но он качает через инлайн-режим или в группах"
                      >
                        но пользуется · {formatShortDate(u.lastSeenAt)}
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="py-6 text-center text-foreground/40">
                  Пока никто не блокировал бота
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const ATTEMPTS_PAGE_SIZE = 50;

const STATUS_LABELS: Record<string, string> = {
  PENDING: "В очереди",
  DOWNLOADING: "Качается",
  CONVERTING: "Конвертация",
  COMPLETED: "Готово",
  FAILED: "Ошибка",
  EXPIRED: "Удалён по сроку",
};

const STATUS_CLASSES: Record<string, string> = {
  PENDING: "bg-amber-500/15 text-amber-600",
  DOWNLOADING: "bg-sky-500/15 text-sky-600",
  CONVERTING: "bg-sky-500/15 text-sky-600",
  COMPLETED: "bg-emerald-500/15 text-emerald-600",
  FAILED: "bg-red-500/15 text-red-600",
  EXPIRED: "bg-foreground/10 text-foreground/50",
};

// Время в базе хранится в UTC (сервер живёт в UTC), а смотреть на него нужно в
// местном. Часовой пояс задан явно, а не берётся из браузера: журнал часто
// открывают с телефона в поездке, и «19:35» должно означать одно и то же
// время независимо от того, где сейчас находится смотрящий.
export function formatAttemptTime(iso: string): string {
  return new Date(iso).toLocaleString("ru-RU", {
    timeZone: "Asia/Almaty",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

const STATUS_OPTIONS = [
  "PENDING",
  "DOWNLOADING",
  "CONVERTING",
  "COMPLETED",
  "FAILED",
  "EXPIRED",
] as const;

export function AttemptsLog() {
  const [page, setPage] = useState<AttemptRow[]>([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [platform, setPlatform] = useState("");
  const [status, setStatus] = useState("");
  const [source, setSource] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    setLoading(true);
    setError(undefined);
    fetchAttempts(ATTEMPTS_PAGE_SIZE, offset, platform, status, source)
      .then((data) => {
        setPage(data.rows);
        setTotal(data.total);
      })
      .catch((e) => setError(e.message || "Не удалось загрузить журнал"))
      .finally(() => setLoading(false));
  }, [offset, platform, status, source]);

  // Смена фильтра всегда возвращает на первую страницу. Иначе, стоя на
  // 3-й странице общего списка и выбрав платформу с десятком записей,
  // попадаешь на пустой экран за концом выборки — выглядит как «фильтр
  // ничего не нашёл», хотя записи есть.
  const changePlatform = (value: string) => {
    setPlatform(value);
    setOffset(0);
  };
  const changeStatus = (value: string) => {
    setStatus(value);
    setOffset(0);
  };
  const changeSource = (value: string) => {
    setSource(value);
    setOffset(0);
  };

  const from = total === 0 ? 0 : offset + 1;
  const to = Math.min(offset + ATTEMPTS_PAGE_SIZE, total);

  return (
    <section className="rounded-lg border border-border/60 bg-background/60 p-4">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-medium text-foreground/70">
          Журнал попыток скачивания
        </h2>
        <div className="flex flex-wrap items-center gap-2 text-xs text-foreground/50">
          <select
            value={platform}
            onChange={(e) => changePlatform(e.target.value)}
            className="h-8 rounded-md border border-input bg-transparent px-2 text-xs outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="">Все платформы</option>
            {PLATFORM_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <select
            value={status}
            onChange={(e) => changeStatus(e.target.value)}
            className="h-8 rounded-md border border-input bg-transparent px-2 text-xs outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="">Все статусы</option>
            {STATUS_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {STATUS_LABELS[option]}
              </option>
            ))}
          </select>
          <select
            value={source}
            onChange={(e) => changeSource(e.target.value)}
            className="h-8 rounded-md border border-input bg-transparent px-2 text-xs outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="">Все источники</option>
            {Object.entries(SOURCE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <span>
            {from}–{to} из {total}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={offset === 0 || loading}
            onClick={() => setOffset(Math.max(0, offset - ATTEMPTS_PAGE_SIZE))}
          >
            Назад
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={to >= total || loading}
            onClick={() => setOffset(offset + ATTEMPTS_PAGE_SIZE)}
          >
            Вперёд
          </Button>
        </div>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {/* Горизонтальная прокрутка у самой таблицы: на телефоне колонок больше,
          чем помещается, и без этого страница целиком уезжала бы вбок. */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[860px] text-sm">
          <thead className="text-left text-foreground/60">
            <tr>
              <th className="pb-2 font-medium">Время</th>
              <th className="pb-2 font-medium">Пользователь</th>
              <th className="pb-2 font-medium">Источник</th>
              <th className="pb-2 font-medium">Платформа</th>
              <th className="pb-2 font-medium">Статус</th>
              <th className="pb-2 font-medium">Что качали</th>
            </tr>
          </thead>
          <tbody>
            {page.map((row) => (
              <tr key={row.id} className="border-t border-border/40 align-top">
                <td className="whitespace-nowrap py-2 tabular-nums text-foreground/80">
                  {formatAttemptTime(row.createdAt)}
                </td>
                <td className="py-2">
                  {row.user ? (
                    row.user.username ? (
                      <a
                        href={`https://t.me/${row.user.username}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        @{row.user.username}
                      </a>
                    ) : (
                      <span className="text-foreground/70">{row.user.telegramId}</span>
                    )
                  ) : (
                    <span className="text-foreground/40">через сайт/API</span>
                  )}
                </td>
                <td className="py-2 text-foreground/60">
                  {SOURCE_LABELS[row.source] ?? row.source}
                  {row.clientSide ? " · в браузере" : ""}
                  {row.country && (
                    <span className="ml-1" title={countryName(row.country)}>
                      · {countryFlag(row.country)} {row.country}
                    </span>
                  )}
                </td>
                <td className="py-2 text-foreground/60">{row.platform}</td>
                <td className="py-2">
                  <span
                    className={`inline-block rounded px-2 py-0.5 text-xs ${
                      STATUS_CLASSES[row.status] ?? "bg-foreground/10 text-foreground/60"
                    }`}
                  >
                    {STATUS_LABELS[row.status] ?? row.status}
                  </span>
                  {row.errorCategory && (
                    <div className="mt-1 text-xs text-foreground/40">
                      {row.errorCategory}
                    </div>
                  )}
                </td>
                <td className="py-2">
                  {row.title && (
                    <div className="max-w-[420px] truncate" title={row.title}>
                      {row.title}
                    </div>
                  )}
                  <a
                    href={row.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block max-w-[420px] truncate text-xs text-foreground/50 hover:underline"
                    title={row.url}
                  >
                    {row.url}
                  </a>
                </td>
              </tr>
            ))}
            {!loading && page.length === 0 && !error && (
              <tr>
                <td colSpan={6} className="py-6 text-center text-foreground/40">
                  {platform || status || source
                    ? "По выбранному фильтру ничего нет"
                    : "Пока ни одной попытки"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function TopUsersTable({ users }: { users: TopUser[] }) {
  return (
    <div className="max-h-[280px] overflow-y-auto">
      <table className="w-full text-sm">
        <thead className="sticky top-0 bg-background text-left text-foreground/60">
          <tr>
            <th className="pb-2 font-medium">Пользователь</th>
            <th className="pb-2 font-medium">Язык</th>
            <th className="pb-2 text-right font-medium">Скачиваний</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="border-t border-border/40">
              <td className="py-2">
                {u.username ? (
                  <a
                    href={`https://t.me/${u.username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    @{u.username}
                  </a>
                ) : (
                  u.telegramId
                )}
              </td>
              <td className="py-2 text-foreground/60">{u.languageCode ?? "—"}</td>
              <td className="py-2 text-right">{u.downloadCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
