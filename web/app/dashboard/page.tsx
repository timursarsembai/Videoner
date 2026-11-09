"use client";

import { useCallback, useEffect, useState, type ComponentType, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  TooManyAttemptsError,
  UnauthorizedError,
  analyticsQuery,
  loginDashboard,
  logoutDashboard,
  type ActivityData,
  type BlockedSummary,
  type OverviewData,
  type TopUser,
} from "@/lib/analytics-api";
import { ChartCard, DashboardContext, useAnalytics } from "@/components/dashboard/chart-card";
import {
  ActiveDailyChart,
  ActivePeriodChart,
  BlockedChart,
  DownloadStatCards,
  DownloadsUsersChart,
  ErrorsByCategoryChart,
  ErrorsByPlatformChart,
  ErrorsTimeseriesChart,
  PlatformCountsChart,
  PlatformsPie,
  SourcesPie,
  StatCard,
  TrafficChart,
  VolumePie,
  WeekdayChart,
} from "@/components/dashboard/charts";
import { CountriesTab } from "@/components/dashboard/countries";
import { LanguagesTab } from "@/components/dashboard/languages";
import { AttemptsLog, BlockedUsersTable, TopUsersTable } from "@/components/dashboard/tables";

// Дашборд. У каждого графика свой выбор периода (по умолчанию последние 30
// дней) — общего переключателя в шапке нет. Графики вкладки грузятся одним
// пакетным запросом (lib/analytics-api.ts, analyticsQuery).

// Вкладки дашборда. Выбранная живёт в адресе (#users и т. п.): обновление
// страницы и ссылка из закладок открывают ту же вкладку.
const DASHBOARD_TABS = [
  { id: "overview", label: "Обзор" },
  { id: "users", label: "Пользователи" },
  { id: "downloads", label: "Скачивания" },
  { id: "errors", label: "Ошибки" },
  { id: "languages", label: "Языки" },
  { id: "countries", label: "Страны" },
  { id: "log", label: "Журнал" },
] as const;

type DashboardTab = (typeof DASHBOARD_TABS)[number]["id"];

function tabFromHash(): DashboardTab {
  const id = window.location.hash.slice(1);
  return DASHBOARD_TABS.find((t) => t.id === id)?.id ?? "overview";
}

const blockedShare = (b: BlockedSummary) =>
  `${b.blocked} (${b.total ? ((b.blocked / b.total) * 100).toFixed(1) : 0}%)`;
const BLOCKED_HINT = (b: BlockedSummary) =>
  `Из ${b.total} пользователей бота, включая удаливших аккаунт. Учёт по дням — с 29.10.2026`;

// Карточки без периода: пользователи бота и DAU/WAU/MAU считаются от
// «сейчас», блокировки — текущее состояние.
function UserStatCards({ full }: { full: boolean }) {
  const overview = useAnalytics<OverviewData>("overview");
  const activity = useAnalytics<ActivityData>("users/activity");
  const blocked = useAnalytics<BlockedSummary>("users/blocked");
  const o = overview.data;
  const a = activity.data;
  const b = blocked.data;
  const dots = "…";
  return (
    <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      <StatCard label="Пользователей бота" value={o?.totalBotUsers ?? dots} />
      <StatCard label="DAU" value={a?.dau ?? dots} hint="Активных пользователей за последние сутки" />
      {full && <StatCard label="WAU" value={a?.wau ?? dots} hint="Активных пользователей за последние 7 дней" />}
      <StatCard label="MAU" value={a?.mau ?? dots} hint="Активных пользователей за последние 30 дней" />
      {full && (
        <StatCard
          label="Новые / вернувшиеся за 30 дн."
          value={a ? `${a.newUsersLast30Days} / ${a.returningUsersLast30Days}` : dots}
        />
      )}
      {full && <StatCard label="Входили на сайт через Telegram" value={o?.webLoginUsers ?? dots} />}
      <StatCard label="Заблокировали бота" value={b ? blockedShare(b) : dots} hint={b ? BLOCKED_HINT(b) : undefined} />
    </section>
  );
}

function BlockedUsersSection() {
  const blocked = useAnalytics<BlockedSummary>("users/blocked");
  return <BlockedUsersTable users={blocked.data?.users ?? []} />;
}

function TopUsersSection() {
  const top = useAnalytics<TopUser[]>("users/top", { limit: 20 });
  return (
    <ChartCard title="Топ пользователей" hint="Больше всего скачиваний за всё время" loading={top.loading} error={top.error}>
      <TopUsersTable users={top.data ?? []} />
    </ChartCard>
  );
}

function OverviewTab() {
  return (
    <>
      <DownloadStatCards />
      <UserStatCards full={false} />
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <DownloadsUsersChart />
        <BlockedChart unit="day" />
      </section>
    </>
  );
}

function UsersTab() {
  return (
    <>
      <UserStatCards full />
      <h2 className="text-base font-semibold">Активность</h2>
      {/* Дни до 27.10.2026 восстановлены из скачиваний и дат визитов (см.
          миграцию user_activity_days) и чуть ниже настоящих. */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ActiveDailyChart metric="dau" wide />
        <ActiveDailyChart metric="wau" />
        <ActiveDailyChart metric="mau" />
        <ActivePeriodChart unit="week" />
        <ActivePeriodChart unit="month" />
      </section>
      <h2 className="text-base font-semibold">Приток и отток</h2>
      {/* Новые пользователи — за всё время; учёт блокировок — с 29.10.2026:
          заблокировавшие раньше входят в карточку «Заблокировали бота», но
          не в графики (дата их блокировки неизвестна). */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <BlockedChart unit="day" wide />
        <BlockedChart unit="week" />
        <BlockedChart unit="month" />
        <BlockedUsersSection />
      </section>
      <h2 className="text-base font-semibold">Самые активные</h2>
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <TopUsersSection />
      </section>
    </>
  );
}

function DownloadsTab() {
  return (
    <>
      <DownloadStatCards />
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <DownloadsUsersChart />
        <WeekdayChart />
        <PlatformCountsChart />
        <PlatformsPie />
        <SourcesPie />
      </section>
      <h2 className="text-base font-semibold">Объём</h2>
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <TrafficChart unit="day" />
        <TrafficChart unit="month" />
        <VolumePie />
      </section>
    </>
  );
}

function ErrorsTab() {
  return (
    <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <ErrorsByCategoryChart />
      <ErrorsTimeseriesChart />
      <ErrorsByPlatformChart />
    </section>
  );
}

const TAB_CONTENT: Record<DashboardTab, ComponentType> = {
  overview: OverviewTab,
  users: UsersTab,
  downloads: DownloadsTab,
  errors: ErrorsTab,
  languages: LanguagesTab,
  countries: CountriesTab,
  log: AttemptsLog,
};

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
  // undefined — ещё не знаем (первая проверка не завершилась), true/false —
  // есть ли действующая httpOnly-сессия дашборда на сервере.
  const [authenticated, setAuthenticated] = useState<boolean | undefined>(undefined);
  // С какого дня есть данные — для «всего времени» и списков периодов.
  const [since, setSince] = useState<string | null>(null);
  const [error, setError] = useState<string | undefined>();
  const [refreshKey, setRefreshKey] = useState(0);
  const [tab, setTab] = useState<DashboardTab>("overview");
  // Открытые вкладки остаются смонтированными (скрытыми): выбранные на их
  // графиках периоды не сбрасываются при переходе туда и обратно.
  const [visited, setVisited] = useState<Set<DashboardTab>>(new Set(["overview"]));

  // Вкладку из адреса читаем после монтирования: на сервере window нет, а
  // разная разметка сервера и клиента сломала бы гидратацию.
  useEffect(() => {
    const sync = () => {
      const t = tabFromHash();
      setTab(t);
      setVisited((v) => new Set(v).add(t));
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  const changeTab = (id: DashboardTab) => {
    setTab(id);
    setVisited((v) => new Set(v).add(id));
    window.history.replaceState(null, "", id === "overview" ? window.location.pathname : `#${id}`);
  };

  const loggedOut = authenticated === false;

  // Первый запрос заодно проверяет сессию: httpOnly-cookie (если есть)
  // браузер приложит сам, а 401 однозначно скажет «сессии нет».
  useEffect(() => {
    if (loggedOut) return;
    setError(undefined);
    analyticsQuery<{ since: string }>("since")
      .then((data) => {
        setSince(data.since);
        setAuthenticated(true);
      })
      .catch((e) => {
        if (e instanceof UnauthorizedError) setAuthenticated(false);
        else setError(e instanceof Error ? e.message : "Не удалось загрузить данные");
      });
  }, [loggedOut]);

  const onUnauthorized = useCallback(() => setAuthenticated(false), []);

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
    setSince(null);
    setAuthenticated(false);
  };

  if (authenticated === false) {
    return <LoginForm onSubmit={handleLogin} error={error} />;
  }

  if (error && !since) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-foreground/60">
        <p>{error}</p>
        <Button variant="outline" onClick={handleLogout}>
          Войти заново
        </Button>
      </div>
    );
  }

  if (!since) {
    return <div className="flex min-h-screen items-center justify-center text-foreground/60">Загрузка...</div>;
  }

  return (
    <DashboardContext.Provider value={{ since, refreshKey, onUnauthorized }}>
      <div className="min-h-screen bg-background px-4 py-8 text-foreground sm:px-8">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-xl font-semibold">Videoner Analytics</h1>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setRefreshKey((k) => k + 1)}>
                Обновить
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                Выйти
              </Button>
            </div>
          </div>

          <nav className="-mx-4 flex gap-1 overflow-x-auto border-b border-border/60 px-4 sm:mx-0 sm:px-0">
            {DASHBOARD_TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => changeTab(t.id)}
                className={`-mb-px whitespace-nowrap border-b-2 px-3 py-2 text-sm ${
                  tab === t.id
                    ? "border-foreground font-medium text-foreground"
                    : "border-transparent text-foreground/60 hover:text-foreground"
                }`}
              >
                {t.label}
              </button>
            ))}
          </nav>

          {DASHBOARD_TABS.filter((t) => visited.has(t.id)).map((t) => {
            const Content = TAB_CONTENT[t.id];
            return (
              <div key={t.id} hidden={tab !== t.id} className="space-y-6">
                <Content />
              </div>
            );
          })}
        </div>
      </div>
    </DashboardContext.Provider>
  );
}
