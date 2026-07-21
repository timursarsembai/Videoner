"use client";

import { useEffect, useState, type FormEvent } from "react";
import {
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
  ANALYTICS_KEY_STORAGE,
  UnauthorizedError,
  fetchAnalyticsSnapshot,
  type AnalyticsSnapshot,
} from "@/lib/analytics-api";

const PLATFORM_COLORS: Record<string, string> = {
  YOUTUBE: "#ef4444",
  TIKTOK: "#111827",
  INSTAGRAM: "#ec4899",
  FACEBOOK: "#3b82f6",
  TWITTER: "#0ea5e9",
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

function mergeTimeseries(snapshot: AnalyticsSnapshot) {
  const map = new Map<string, { day: string; downloads: number; newUsers: number }>();
  for (const point of snapshot.timeseries.downloads) {
    const key = formatDay(point.day);
    map.set(key, { day: key, downloads: point.count, newUsers: 0 });
  }
  for (const point of snapshot.timeseries.newBotUsers) {
    const key = formatDay(point.day);
    const existing = map.get(key);
    if (existing) {
      existing.newUsers = point.count;
    } else {
      map.set(key, { day: key, downloads: 0, newUsers: point.count });
    }
  }
  return Array.from(map.values());
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-border/60 bg-background/60 p-4">
      <div className="text-sm text-foreground/60">{label}</div>
      <div className="mt-1 text-2xl font-semibold">{value}</div>
    </div>
  );
}

function ApiKeyForm({ onSubmit, error }: { onSubmit: (key: string) => void; error?: string }) {
  const [value, setValue] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (value.trim()) onSubmit(value.trim());
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-lg border border-border/60 bg-background/60 p-6 shadow-sm"
      >
        <h1 className="mb-4 text-lg font-semibold">Analytics</h1>
        <input
          type="password"
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="API ключ дашборда"
          className="mb-3 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
        />
        {error && <p className="mb-3 text-sm text-destructive">{error}</p>}
        <Button type="submit" className="w-full">
          Войти
        </Button>
      </form>
    </div>
  );
}

export default function AnalyticsPage() {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [snapshot, setSnapshot] = useState<AnalyticsSnapshot | null>(null);
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem(ANALYTICS_KEY_STORAGE);
    if (stored) setApiKey(stored);
  }, []);

  useEffect(() => {
    if (!apiKey) return;
    setLoading(true);
    setError(undefined);
    fetchAnalyticsSnapshot(apiKey)
      .then(setSnapshot)
      .catch((e) => {
        if (e instanceof UnauthorizedError) {
          sessionStorage.removeItem(ANALYTICS_KEY_STORAGE);
          setApiKey(null);
          setError("Неверный или отозванный ключ");
        } else {
          setError(e.message || "Не удалось загрузить данные");
        }
      })
      .finally(() => setLoading(false));
  }, [apiKey]);

  const handleKeySubmit = (key: string) => {
    sessionStorage.setItem(ANALYTICS_KEY_STORAGE, key);
    setApiKey(key);
  };

  if (!apiKey) {
    return <ApiKeyForm onSubmit={handleKeySubmit} error={error} />;
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
        <Button
          variant="outline"
          onClick={() => {
            sessionStorage.removeItem(ANALYTICS_KEY_STORAGE);
            setApiKey(null);
          }}
        >
          Ввести ключ заново
        </Button>
      </div>
    );
  }

  if (!snapshot) return null;

  const { overview, platforms, sources, activity, topUsers, errors } = snapshot;
  const timeseries = mergeTimeseries(snapshot);

  return (
    <div className="min-h-screen bg-background px-4 py-8 text-foreground sm:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Videoner Analytics</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              sessionStorage.removeItem(ANALYTICS_KEY_STORAGE);
              setApiKey(null);
            }}
          >
            Выйти
          </Button>
        </div>

        <section className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          <StatCard label="Скачиваний всего" value={overview.totalDownloads} />
          <StatCard label="Успешных" value={overview.completedDownloads} />
          <StatCard label="Ошибок" value={overview.failedDownloads} />
          <StatCard
            label="Успешность"
            value={
              overview.successRate !== null
                ? `${Math.round(overview.successRate * 100)}%`
                : "—"
            }
          />
          <StatCard label="Выручка, ⭐" value={overview.totalStarsRevenue} />
          <StatCard label="Пользователей бота" value={overview.totalBotUsers} />
        </section>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <StatCard label="DAU" value={activity.dau} />
          <StatCard label="WAU" value={activity.wau} />
          <StatCard label="MAU" value={activity.mau} />
          <StatCard
            label="Новые / вернувшиеся за 30 дн."
            value={`${activity.newUsersLast30Days} / ${activity.returningUsersLast30Days}`}
          />
        </section>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-lg border border-border/60 bg-background/60 p-4">
            <h2 className="mb-4 text-sm font-medium text-foreground/70">
              Скачивания и новые пользователи, 30 дней
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
                        {u.username ? `@${u.username}` : u.telegramId}
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
      </div>
    </div>
  );
}
