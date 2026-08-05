export class UnauthorizedError extends Error {
  constructor() {
    super("Unauthorized");
    this.name = "UnauthorizedError";
  }
}

export interface OverviewData {
  totalDownloads: number;
  completedDownloads: number;
  failedDownloads: number;
  successRate: number | null;
  totalStarsRevenue: number;
  totalBotUsers: number;
}

export interface PlatformDatum {
  platform: string;
  count: number;
}

export interface SourceDatum {
  source: string;
  count: number;
}

export interface TimeseriesPoint {
  day: string;
  count: number;
}

export interface TimeseriesData {
  downloads: TimeseriesPoint[];
  newBotUsers: TimeseriesPoint[];
}

export interface ActivityData {
  dau: number;
  wau: number;
  mau: number;
  newUsersLast30Days: number;
  returningUsersLast30Days: number;
}

export interface TopUser {
  id: string;
  telegramId: string;
  username: string | null;
  languageCode: string | null;
  firstSeenAt: string;
  lastSeenAt: string;
  downloadCount: number;
}

export interface ErrorDatum {
  category: string;
  count: number;
}

export interface ErrorTimeseriesPoint {
  day: string;
  category: string;
  count: number;
}

export interface SubscriptionsData {
  activeMonthly: number;
  activeYearly: number;
  activeTotal: number;
  manualUnlimited: number;
  expiring7d: number;
  expiring30d: number;
  mrrStars: number;
  conversionRate: number | null;
  totalBotUsers: number;
  webLoginUsers: number;
}

// Одна попытка скачивания — строка журнала. Отдаются ВСЕ статусы, включая
// успешные: список нужен именно как хронология «кто что запрашивал», а не как
// вторая витрина ошибок (для ошибок есть отдельные графики выше).
export interface AttemptRow {
  id: string;
  createdAt: string;
  status: string;
  platform: string;
  source: string;
  url: string;
  title: string | null;
  errorCategory: string | null;
  fileSize: string | null;
  user: { telegramId: string; username: string | null } | null;
}

export interface AttemptsPage {
  total: number;
  limit: number;
  offset: number;
  rows: AttemptRow[];
}

export interface AnalyticsSnapshot {
  overview: OverviewData;
  platforms: PlatformDatum[];
  sources: SourceDatum[];
  timeseries: TimeseriesData;
  activity: ActivityData;
  topUsers: TopUser[];
  errors: ErrorDatum[];
  errorsTimeseries: ErrorTimeseriesPoint[];
  subscriptions: SubscriptionsData;
}

// Ходит на СВОЙ Next.js-прокси (app/api/dashboard/[...path]/route.ts), а не
// напрямую на NEXT_PUBLIC_API_URL — ключ живёт в httpOnly-cookie на сервере
// и в этот fetch не попадает вообще (браузер прикладывает cookie сам).
async function get<T>(path: string): Promise<T> {
  const res = await fetch(`/api/dashboard${path}`);

  if (res.status === 401) {
    throw new UnauthorizedError();
  }
  if (!res.ok) {
    throw new Error(`Запрос ${path} завершился с ошибкой ${res.status}`);
  }
  return res.json();
}

// Один раз обменивает введённый ключ на httpOnly-сессию (см.
// app/api/dashboard/auth/route.ts) — сам ключ после этого в клиентском JS
// не хранится нигде (ни в памяти, ни тем более в sessionStorage).
export async function loginDashboard(apiKey: string): Promise<void> {
  const res = await fetch("/api/dashboard/auth", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ apiKey }),
  });
  if (!res.ok) {
    throw new UnauthorizedError();
  }
}

export async function logoutDashboard(): Promise<void> {
  await fetch("/api/dashboard/auth", { method: "DELETE" });
}

export async function fetchAnalyticsSnapshot(days: number = 30): Promise<AnalyticsSnapshot> {
  const [
    overview,
    platforms,
    sources,
    timeseries,
    activity,
    topUsers,
    errors,
    errorsTimeseries,
    subscriptions,
  ] = await Promise.all([
    get<OverviewData>("/overview"),
    get<PlatformDatum[]>("/platforms"),
    get<SourceDatum[]>("/sources"),
    get<TimeseriesData>(`/timeseries?days=${days}`),
    get<ActivityData>("/users/activity"),
    get<TopUser[]>("/users/top?limit=20"),
    get<ErrorDatum[]>("/errors"),
    get<ErrorTimeseriesPoint[]>(`/errors/timeseries?days=${days}`),
    get<SubscriptionsData>("/subscriptions"),
  ]);

  return {
    overview,
    platforms,
    sources,
    timeseries,
    activity,
    topUsers,
    errors,
    errorsTimeseries,
    subscriptions,
  };
}


// Журнал грузится ОТДЕЛЬНО от снапшота: у него своя постраничная навигация,
// и тащить его в общий Promise.all значило бы перезапрашивать все графики при
// каждом перелистывании страницы.
export async function fetchAttempts(
  limit: number = 50,
  offset: number = 0,
): Promise<AttemptsPage> {
  return get<AttemptsPage>(`/attempts?limit=${limit}&offset=${offset}`);
}
