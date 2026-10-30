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
  webLoginUsers: number;
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

// Активные на конкретный день (UTC): DAU — в этот день, WAU и MAU — разные
// пользователи за 7 и 30 дней по этот день включительно.
export interface ActiveDailyPoint {
  day: string;
  dau: number;
  wau: number;
  mau: number;
}

// Активные пользователи за календарную неделю (с понедельника).
export interface ActiveWeeklyPoint {
  week: string;
  users: number;
}

// Активные пользователи за календарный месяц.
export interface ActiveMonthlyPoint {
  month: string;
  users: number;
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

// Успешные скачивания площадки за день (или месяц, тогда в поле month).
// bytes — скачано из сети (у YouTube это трафик прокси), cachedBytes — отдано
// повторно из кеша, не потратив трафика.
export interface TrafficPoint {
  day?: string;
  month?: string;
  platform: string;
  count: number;
  bytes: number;
  cachedBytes: number;
}

export interface ErrorTimeseriesPoint {
  day: string;
  category: string;
  count: number;
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
  // Файл скачал сам браузер (расширение), а не сервер.
  clientSide: boolean;
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

// Новые пользователи и блокировки бота за период (день, неделя с
// понедельника или месяц, UTC).
export interface BlockedPoint {
  period: string;
  newUsers: number;
  blocked: number;
  unblocked: number;
}

// Кто заблокировал бота (blocked) или блокировал и вернулся. source
// последнего события: telegram — время точное, check — время проверки после
// рассылки (сама блокировка раньше), baseline — до начала учёта 29.10.2026.
export interface BlockedUser {
  telegramId: string;
  username: string | null;
  firstName: string | null;
  languageCode: string | null;
  firstSeenAt: string;
  downloadCount: number;
  blocked: boolean;
  lastEvent: { blocked: boolean; source: string; at: string } | null;
}

export interface BlockedData {
  total: number;
  blocked: number;
  daily: BlockedPoint[];
  weekly: BlockedPoint[];
  monthly: BlockedPoint[];
  users: BlockedUser[];
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
  trafficDaily: TrafficPoint[];
  trafficMonthly: TrafficPoint[];
  activeDaily: ActiveDailyPoint[];
  activeWeekly: ActiveWeeklyPoint[];
  activeMonthly: ActiveMonthlyPoint[];
  blocked: BlockedData;
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

export class TooManyAttemptsError extends Error {
  constructor() {
    super("Too many attempts");
    this.name = "TooManyAttemptsError";
  }
}

// Вход по логину, паролю и коду из Google Authenticator. Сервер сайта ставит
// httpOnly-cookie с сессией (см. app/api/dashboard/auth/route.ts); сам ответ
// никаких секретов в клиентский JS не возвращает.
export async function loginDashboard(username: string, password: string, code: string): Promise<void> {
  const res = await fetch("/api/dashboard/auth", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password, code }),
  });
  if (res.status === 429) throw new TooManyAttemptsError();
  if (res.status === 503) throw new Error("Вход в дашборд не настроен на сервере");
  if (!res.ok) throw new UnauthorizedError();
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
    trafficDaily,
    trafficMonthly,
    activeDaily,
    activeWeekly,
    activeMonthly,
    blocked,
  ] = await Promise.all([
    get<OverviewData>(`/overview?days=${days}`),
    get<PlatformDatum[]>("/platforms"),
    get<SourceDatum[]>("/sources"),
    get<TimeseriesData>(`/timeseries?days=${days}`),
    get<ActivityData>("/users/activity"),
    get<TopUser[]>("/users/top?limit=20"),
    get<ErrorDatum[]>("/errors"),
    get<ErrorTimeseriesPoint[]>(`/errors/timeseries?days=${days}`),
    get<TrafficPoint[]>(`/traffic/daily?days=${days}`),
    get<TrafficPoint[]>("/traffic/monthly"),
    get<ActiveDailyPoint[]>(`/users/active/daily?days=${days}`),
    get<ActiveWeeklyPoint[]>("/users/active/weekly?weeks=26"),
    get<ActiveMonthlyPoint[]>("/users/active/monthly"),
    get<BlockedData>(`/users/blocked?days=${days}`),
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
    trafficDaily,
    trafficMonthly,
    activeDaily,
    activeWeekly,
    activeMonthly,
    blocked,
  };
}


// Журнал грузится ОТДЕЛЬНО от снапшота: у него своя постраничная навигация,
// и тащить его в общий Promise.all значило бы перезапрашивать все графики при
// каждом перелистывании страницы.
export async function fetchAttempts(
  limit: number = 50,
  offset: number = 0,
  platform?: string,
  status?: string,
  source?: string,
): Promise<AttemptsPage> {
  // Пустой фильтр не отправляем вовсе: "platform=" сервер обязан был бы
  // отличать от отсутствия параметра, а так этот случай просто не возникает.
  const params = new URLSearchParams({
    limit: String(limit),
    offset: String(offset),
  });
  if (platform) params.set("platform", platform);
  if (status) params.set("status", status);
  if (source) params.set("source", source);
  return get<AttemptsPage>(`/attempts?${params.toString()}`);
}
