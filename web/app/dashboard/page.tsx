"use client";

import { useEffect, useState, type FormEvent } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Button } from "@/components/ui/button";
import {
  TooManyAttemptsError,
  UnauthorizedError,
  fetchAnalyticsSnapshot,
  fetchAttempts,
  loginDashboard,
  logoutDashboard,
  type AnalyticsSnapshot,
  type AttemptRow,
  type ErrorTimeseriesPoint,
  type TrafficPoint,
} from "@/lib/analytics-api";

const PERIOD_OPTIONS = [7, 30, 90] as const;

const PLATFORM_COLORS: Record<string, string> = {
  YOUTUBE: "#ef4444",
  TIKTOK: "#111827",
  INSTAGRAM: "#ec4899",
  FACEBOOK: "#3b82f6",
  TWITTER: "#0ea5e9",
  THREADS: "#374151",
  VIMEO: "#14b8a6",
  VK: "#6366f1",
  RUTUBE: "#f97316",
  OKRU: "#eab308",
  PINTEREST: "#be123c",
};

const SOURCE_COLORS: Record<string, string> = {
  BOT: "#0ea5e9",
  WEB: "#22c55e",
  API: "#9ca3af",
};

const SOURCE_LABELS: Record<string, string> = {
  BOT: "Бот",
  WEB: "Сайт",
  API: "API",
};

const ERROR_COLORS: Record<string, string> = {
  LOGIN_REQUIRED: "#f59e0b",
  UNSUPPORTED_PLATFORM: "#6b7280",
  FORMAT_UNAVAILABLE: "#8b5cf6",
  YOUTUBE_AUTH_REQUIRED: "#ef4444",
  TIMEOUT: "#3b82f6",
  OTHER: "#9ca3af",
};

function formatDay(iso: string): string {
  return new Date(iso).toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
  });
}

// Ключ мержа — СЫРОЙ ISO-день (не отформатированный "ДД.ММ"), и в конце
// сортировка по нему же: раньше два независимо отсортированных источника
// (downloads/newBotUsers) сливались через first-seen порядок вставки в
// Map — если день был только в одном из массивов, он попадал в конец
// вместо своего места по дате, ломая линию тренда на графике.
function mergeTimeseries(snapshot: AnalyticsSnapshot) {
  const map = new Map<string, { day: string; downloads: number; newUsers: number }>();
  for (const point of snapshot.timeseries.downloads) {
    map.set(point.day, { day: formatDay(point.day), downloads: point.count, newUsers: 0 });
  }
  for (const point of snapshot.timeseries.newBotUsers) {
    const existing = map.get(point.day);
    if (existing) {
      existing.newUsers = point.count;
    } else {
      map.set(point.day, { day: formatDay(point.day), downloads: 0, newUsers: point.count });
    }
  }
  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, value]) => value);
}

function mergeErrorsTimeseries(rows: ErrorTimeseriesPoint[]) {
  const categories = Array.from(new Set(rows.map((r) => r.category))).sort();
  const map = new Map<string, Record<string, string | number>>();
  for (const row of rows) {
    const existing = map.get(row.day) ?? { day: formatDay(row.day) };
    existing[row.category] = row.count;
    map.set(row.day, existing);
  }
  const data = Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, row]) => {
      for (const category of categories) {
        if (!(category in row)) row[category] = 0;
      }
      return row;
    });
  return { data, categories };
}

// Дни периода целиком, включая те, где не было ни одного скачивания: иначе
// на графике объёма пустой день просто исчезал бы, и ось сжималась бы.
// Ключ — тот же ISO-формат полуночи UTC, в котором сервер отдаёт date_trunc.
function periodDayKeys(days: number): string[] {
  const now = new Date();
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const keys: string[] = [];
  for (let i = days - 1; i >= 0; i--) {
    keys.push(new Date(today - i * 24 * 60 * 60 * 1000).toISOString());
  }
  return keys;
}

function formatMonth(iso: string): string {
  return new Date(iso).toLocaleDateString("ru-RU", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

const BYTE_UNITS = [
  { label: "ГБ", size: 1024 ** 3 },
  { label: "МБ", size: 1024 ** 2 },
  { label: "КБ", size: 1024 },
];

// Единица — по самому большому значению графика, одна на всю ось: подписи
// «0,3 ГБ» и «300 МБ» вперемешку на одной шкале читаются хуже.
function pickByteUnit(max: number) {
  return BYTE_UNITS.find((unit) => max >= unit.size) ?? BYTE_UNITS[BYTE_UNITS.length - 1];
}

function formatBytes(bytes: number): string {
  const unit = pickByteUnit(bytes);
  const value = bytes / unit.size;
  return `${value.toLocaleString("ru-RU", { maximumFractionDigits: value < 10 ? 2 : 1 })} ${unit.label}`;
}

function PlatformSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-8 rounded-md border border-input bg-transparent px-2 text-xs outline-none focus-visible:ring-1 focus-visible:ring-ring"
    >
      {PLATFORM_OPTIONS.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

// Объём скачанного одной площадкой: из сети и из кеша, стопкой. Площадка
// выбирается у каждого графика своя, по умолчанию YouTube — ради него всё и
// затевалось: его трафик идёт через прокси с оплатой за гигабайты.
function TrafficChart({
  title,
  rows,
  periodKeys,
  keyOf,
  formatKey,
}: {
  title: string;
  rows: TrafficPoint[];
  // Все точки оси по порядку; без них — только те, где есть данные.
  periodKeys?: string[];
  keyOf: (row: TrafficPoint) => string;
  formatKey: (key: string) => string;
}) {
  const [platform, setPlatform] = useState("YOUTUBE");

  const byKey = new Map<string, { bytes: number; cachedBytes: number }>();
  for (const row of rows) {
    if (row.platform !== platform) continue;
    byKey.set(keyOf(row), { bytes: row.bytes, cachedBytes: row.cachedBytes });
  }
  const keys = periodKeys ?? Array.from(byKey.keys()).sort();
  const max = Math.max(0, ...keys.map((k) => (byKey.get(k)?.bytes ?? 0) + (byKey.get(k)?.cachedBytes ?? 0)));
  const unit = pickByteUnit(max);
  const data = keys.map((key) => ({
    label: formatKey(key),
    bytes: (byKey.get(key)?.bytes ?? 0) / unit.size,
    cachedBytes: (byKey.get(key)?.cachedBytes ?? 0) / unit.size,
  }));
  const total = keys.reduce((sum, k) => sum + (byKey.get(k)?.bytes ?? 0), 0);
  const cached = keys.reduce((sum, k) => sum + (byKey.get(k)?.cachedBytes ?? 0), 0);
  const round = (v: number) => v.toLocaleString("ru-RU", { maximumFractionDigits: 2 });

  return (
    <div className="rounded-lg border border-border/60 bg-background/60 p-4">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-medium text-foreground/70">{title}</h2>
          <p className="mt-1 text-xs text-foreground/40">
            Из сети {formatBytes(total)}, из кеша {formatBytes(cached)}
          </p>
        </div>
        <PlatformSelect value={platform} onChange={setPlatform} />
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis dataKey="label" fontSize={12} />
          <YAxis fontSize={12} unit={` ${unit.label}`} width={70} />
          <Tooltip formatter={(value) => `${round(Number(value))} ${unit.label}`} />
          <Legend />
          <Bar dataKey="bytes" name="Из сети" stackId="traffic" fill={PLATFORM_COLORS[platform] ?? "#9ca3af"} />
          <Bar dataKey="cachedBytes" name="Из кеша (без трафика)" stackId="traffic" fill="#9ca3af" fillOpacity={0.5} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// Число успешных скачиваний по дням — отдельной линией на каждую площадку.
function mergePlatformCounts(rows: TrafficPoint[], keys: string[]) {
  const platforms = Array.from(new Set(rows.map((r) => r.platform))).sort();
  const byDay = new Map<string, Record<string, number>>();
  for (const row of rows) {
    const day = byDay.get(row.day ?? "") ?? {};
    day[row.platform] = row.count;
    byDay.set(row.day ?? "", day);
  }
  const data = keys.map((key) => {
    const counts = byDay.get(key) ?? {};
    const point: Record<string, string | number> = { day: formatDay(key) };
    for (const platform of platforms) point[platform] = counts[platform] ?? 0;
    return point;
  });
  return { data, platforms };
}

// Сколько скачано из сети каждой площадкой за период.
function platformVolume(rows: TrafficPoint[]) {
  const totals = new Map<string, number>();
  for (const row of rows) {
    totals.set(row.platform, (totals.get(row.platform) ?? 0) + row.bytes);
  }
  return Array.from(totals.entries())
    .filter(([, bytes]) => bytes > 0)
    .map(([platform, bytes]) => ({ platform, bytes }))
    .sort((a, b) => b.bytes - a.bytes);
}

function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="rounded-lg border border-border/60 bg-background/60 p-4">
      <div className="text-sm text-foreground/60">{label}</div>
      <div className="mt-1 text-2xl font-semibold">{value}</div>
      {hint && <div className="mt-1 text-xs text-foreground/40">{hint}</div>}
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
function formatAttemptTime(iso: string): string {
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

// Порядок как в prisma/schema.prisma (enum Downloaders) — чтобы список в
// фильтре не расходился с тем, что реально может прийти из базы.
const PLATFORM_OPTIONS = [
  "YOUTUBE",
  "FACEBOOK",
  "INSTAGRAM",
  "TIKTOK",
  "TWITTER",
  "VIMEO",
  "VK",
  "RUTUBE",
  "OKRU",
  "PINTEREST",
  "THREADS",
] as const;

const STATUS_OPTIONS = [
  "PENDING",
  "DOWNLOADING",
  "CONVERTING",
  "COMPLETED",
  "FAILED",
  "EXPIRED",
] as const;

function AttemptsLog() {
  const [page, setPage] = useState<AttemptRow[]>([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [platform, setPlatform] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    setLoading(true);
    setError(undefined);
    fetchAttempts(ATTEMPTS_PAGE_SIZE, offset, platform, status)
      .then((data) => {
        setPage(data.rows);
        setTotal(data.total);
      })
      .catch((e) => setError(e.message || "Не удалось загрузить журнал"))
      .finally(() => setLoading(false));
  }, [offset, platform, status]);

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

  const from = total === 0 ? 0 : offset + 1;
  const to = Math.min(offset + ATTEMPTS_PAGE_SIZE, total);

  return (
    <section className="mt-6 rounded-lg border border-border/60 bg-background/60 p-4">
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
                  {platform || status
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

function LoginForm({
  onSubmit,
  error,
}: {
  onSubmit: (username: string, password: string, code: string) => Promise<void>;
  error?: string;
}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password || code.length !== 6) return;
    setSubmitting(true);
    try {
      await onSubmit(username.trim(), password, code);
    } finally {
      // Код одноразовый: после любой попытки поле очищаем, нужен свежий.
      setCode("");
      setSubmitting(false);
    }
  };

  const inputClass =
    "mb-3 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-1 focus-visible:ring-ring";

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-lg border border-border/60 bg-background/60 p-6 shadow-sm"
      >
        <h1 className="mb-4 text-lg font-semibold">Analytics</h1>
        <input
          autoFocus
          autoComplete="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Логин"
          className={inputClass}
        />
        <input
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Пароль"
          className={inputClass}
        />
        <input
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
          placeholder="Код из Google Authenticator"
          className={`${inputClass} tracking-widest`}
        />
        {error && <p className="mb-3 text-sm text-destructive">{error}</p>}
        <Button
          type="submit"
          className="w-full"
          disabled={submitting || !username.trim() || !password || code.length !== 6}
        >
          {submitting ? "Проверяю…" : "Войти"}
        </Button>
      </form>
    </div>
  );
}

export default function AnalyticsPage() {
  // undefined — ещё не знаем (первая попытка загрузки не завершилась),
  // true/false — есть ли действующая httpOnly-сессия дашборда на сервере.
  const [authenticated, setAuthenticated] = useState<boolean | undefined>(undefined);
  const [snapshot, setSnapshot] = useState<AnalyticsSnapshot | null>(null);
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [days, setDays] = useState<number>(30);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    // Ключ больше не хранится в клиентском JS — на каждую загрузку страницы
    // просто пробуем запрос; httpOnly-cookie (если есть) браузер приложит сам,
    // а 401 однозначно скажет "сессии нет", без отдельной проверки заранее.
    if (authenticated === false) return;
    setLoading(true);
    setError(undefined);
    fetchAnalyticsSnapshot(days)
      .then((data) => {
        setSnapshot(data);
        setAuthenticated(true);
      })
      .catch((e) => {
        if (e instanceof UnauthorizedError) {
          setAuthenticated(false);
        } else {
          setError(e.message || "Не удалось загрузить данные");
        }
      })
      .finally(() => setLoading(false));
  }, [authenticated, days, refreshKey]);

  const handleLogin = async (username: string, password: string, code: string) => {
    try {
      await loginDashboard(username, password, code);
      setError(undefined);
      setAuthenticated(true);
    } catch (e) {
      if (e instanceof TooManyAttemptsError) {
        setError("Слишком много попыток — попробуйте через 15 минут");
      } else if (e instanceof UnauthorizedError) {
        setError("Неверный логин, пароль или код");
      } else {
        setError(e instanceof Error ? e.message : "Не удалось войти");
      }
    }
  };

  const handleLogout = async () => {
    await logoutDashboard();
    setSnapshot(null);
    setAuthenticated(false);
  };

  if (authenticated === false) {
    return <LoginForm onSubmit={handleLogin} error={error} />;
  }

  if (loading && !snapshot) {
    return (
      <div className="flex min-h-screen items-center justify-center text-foreground/60">
        Загрузка...
      </div>
    );
  }

  if (error && !snapshot) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-foreground/60">
        <p>{error}</p>
        <Button variant="outline" onClick={handleLogout}>
          Войти заново
        </Button>
      </div>
    );
  }

  if (!snapshot) return null;

  const { overview, platforms, sources, activity, topUsers, errors } = snapshot;
  const timeseries = mergeTimeseries(snapshot);
  const { data: errorsTimeseriesData, categories: errorCategories } = mergeErrorsTimeseries(
    snapshot.errorsTimeseries
  );
  const dayKeys = periodDayKeys(days);
  const { data: platformCountsData, platforms: countedPlatforms } = mergePlatformCounts(
    snapshot.trafficDaily,
    dayKeys
  );
  const volume = platformVolume(snapshot.trafficDaily);

  return (
    <div className="min-h-screen bg-background px-4 py-8 text-foreground sm:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-xl font-semibold">Videoner Analytics</h1>
          <div className="flex items-center gap-2">
            <div className="flex overflow-hidden rounded-md border border-border/60">
              {PERIOD_OPTIONS.map((d) => (
                <button
                  key={d}
                  onClick={() => setDays(d)}
                  className={`px-3 py-1.5 text-sm ${
                    days === d
                      ? "bg-foreground text-background"
                      : "bg-transparent text-foreground/70 hover:bg-foreground/5"
                  }`}
                >
                  {d} дн.
                </button>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              disabled={loading}
              onClick={() => setRefreshKey((k) => k + 1)}
            >
              {loading ? "Обновляю…" : "Обновить"}
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              Выйти
            </Button>
          </div>
        </div>

        <section className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {/* Четыре счётчика ниже — за выбранный период и только бот с
              сайтом: запросы напрямую в API — это проверки при разработке. */}
          <StatCard label="Попыток" value={overview.totalDownloads} hint={`За ${days} дн., бот и сайт`} />
          <StatCard
            label="Успешных"
            value={overview.completedDownloads}
            hint="Включая файлы, уже удалённые с диска"
          />
          <StatCard label="Ошибок" value={overview.failedDownloads} hint={`За ${days} дн., бот и сайт`} />
          <StatCard
            label="Успешность"
            value={
              overview.successRate !== null
                ? `${Math.round(overview.successRate * 100)}%`
                : "—"
            }
            hint="Успешные из завершённых"
          />
          <StatCard label="Пользователей бота" value={overview.totalBotUsers} />
          <StatCard label="Входили на сайт через Telegram" value={overview.webLoginUsers} />
        </section>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <StatCard label="DAU" value={activity.dau} hint="Активных пользователей за последние сутки" />
          <StatCard label="WAU" value={activity.wau} hint="Активных пользователей за последние 7 дней" />
          <StatCard label="MAU" value={activity.mau} hint="Активных пользователей за последние 30 дней" />
          <StatCard
            label="Новые / вернувшиеся за 30 дн."
            value={`${activity.newUsersLast30Days} / ${activity.returningUsersLast30Days}`}
          />
        </section>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-lg border border-border/60 bg-background/60 p-4">
            <h2 className="mb-4 text-sm font-medium text-foreground/70">
              Скачивания и новые пользователи, {days} дней
            </h2>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={timeseries}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="day" fontSize={12} />
                <YAxis fontSize={12} allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="downloads"
                  name="Скачивания"
                  stroke="#ef4444"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="newUsers"
                  name="Новые пользователи"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-lg border border-border/60 bg-background/60 p-4">
            <h2 className="mb-4 text-sm font-medium text-foreground/70">
              Платформы
            </h2>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={platforms}
                  dataKey="count"
                  nameKey="platform"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={(entry) => `${entry.platform}: ${entry.count}`}
                >
                  {platforms.map((p) => (
                    <Cell
                      key={p.platform}
                      fill={PLATFORM_COLORS[p.platform] ?? "#9ca3af"}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <TrafficChart
            title={`Объём скачанного по дням, ${days} дней`}
            rows={snapshot.trafficDaily}
            periodKeys={dayKeys}
            keyOf={(row) => row.day ?? ""}
            formatKey={formatDay}
          />

          <TrafficChart
            title="Объём скачанного по месяцам"
            rows={snapshot.trafficMonthly}
            keyOf={(row) => row.month ?? ""}
            formatKey={formatMonth}
          />

          <div className="rounded-lg border border-border/60 bg-background/60 p-4">
            <h2 className="mb-4 text-sm font-medium text-foreground/70">
              Успешные скачивания по платформам, {days} дней
            </h2>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={platformCountsData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="day" fontSize={12} />
                <YAxis fontSize={12} allowDecimals={false} />
                <Tooltip />
                <Legend />
                {countedPlatforms.map((platform) => (
                  <Line
                    key={platform}
                    type="monotone"
                    dataKey={platform}
                    name={platform}
                    stroke={PLATFORM_COLORS[platform] ?? "#9ca3af"}
                    strokeWidth={2}
                    dot={false}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-lg border border-border/60 bg-background/60 p-4">
            <h2 className="mb-4 text-sm font-medium text-foreground/70">
              Объём по платформам, {days} дней
            </h2>
            {volume.length ? (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={volume}
                    dataKey="bytes"
                    nameKey="platform"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={(entry) => `${entry.platform}: ${formatBytes(entry.bytes)}`}
                  >
                    {volume.map((v) => (
                      <Cell key={v.platform} fill={PLATFORM_COLORS[v.platform] ?? "#9ca3af"} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatBytes(Number(value))} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="py-24 text-center text-sm text-foreground/40">За период нет данных о размере файлов</p>
            )}
          </div>

          <div className="rounded-lg border border-border/60 bg-background/60 p-4">
            <h2 className="mb-4 text-sm font-medium text-foreground/70">
              Бот vs сайт
            </h2>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={sources}
                  dataKey="count"
                  nameKey="source"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={(entry) => `${SOURCE_LABELS[entry.source] ?? entry.source}: ${entry.count}`}
                >
                  {sources.map((s) => (
                    <Cell key={s.source} fill={SOURCE_COLORS[s.source] ?? "#9ca3af"} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, _name, props) => [value, SOURCE_LABELS[props.payload.source] ?? props.payload.source]} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-lg border border-border/60 bg-background/60 p-4">
            <h2 className="mb-4 text-sm font-medium text-foreground/70">
              Ошибки по категориям
            </h2>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={errors}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="category" fontSize={11} interval={0} angle={-20} textAnchor="end" height={70} />
                <YAxis fontSize={12} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" name="Ошибок">
                  {errors.map((e) => (
                    <Cell key={e.category} fill={ERROR_COLORS[e.category] ?? "#9ca3af"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-lg border border-border/60 bg-background/60 p-4 lg:col-span-2">
            <h2 className="mb-4 text-sm font-medium text-foreground/70">
              Ошибки по дням — динамика по категориям
            </h2>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={errorsTimeseriesData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="day" fontSize={12} />
                <YAxis fontSize={12} allowDecimals={false} />
                <Tooltip />
                <Legend />
                {errorCategories.map((category) => (
                  <Area
                    key={category}
                    type="monotone"
                    dataKey={category}
                    name={category}
                    stackId="errors"
                    stroke={ERROR_COLORS[category] ?? "#9ca3af"}
                    fill={ERROR_COLORS[category] ?? "#9ca3af"}
                    fillOpacity={0.5}
                  />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-lg border border-border/60 bg-background/60 p-4">
            <h2 className="mb-4 text-sm font-medium text-foreground/70">
              Топ пользователей
            </h2>
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
                  {topUsers.map((u) => (
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
                      <td className="py-2 text-foreground/60">
                        {u.languageCode ?? "—"}
                      </td>
                      <td className="py-2 text-right">{u.downloadCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <AttemptsLog />
      </div>
    </div>
  );
}
