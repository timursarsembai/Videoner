export const ANALYTICS_KEY_STORAGE = "videoner_analytics_key";

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

export interface AnalyticsSnapshot {
  overview: OverviewData;
  platforms: PlatformDatum[];
  sources: SourceDatum[];
  timeseries: TimeseriesData;
  activity: ActivityData;
  topUsers: TopUser[];
  errors: ErrorDatum[];
}

async function get<T>(path: string, apiKey: string): Promise<T> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const res = await fetch(`${baseUrl}/analytics${path}`, {
    headers: { "X-API-Key": apiKey },
  });

  if (res.status === 401) {
    throw new UnauthorizedError();
  }
  if (!res.ok) {
    throw new Error(`Запрос ${path} завершился с ошибкой ${res.status}`);
  }
  return res.json();
}

export async function fetchAnalyticsSnapshot(
  apiKey: string
): Promise<AnalyticsSnapshot> {
  const [overview, platforms, sources, timeseries, activity, topUsers, errors] =
    await Promise.all([
      get<OverviewData>("/overview", apiKey),
      get<PlatformDatum[]>("/platforms", apiKey),
      get<SourceDatum[]>("/sources", apiKey),
      get<TimeseriesData>("/timeseries?days=30", apiKey),
      get<ActivityData>("/users/activity", apiKey),
      get<TopUser[]>("/users/top?limit=20", apiKey),
      get<ErrorDatum[]>("/errors", apiKey),
    ]);

  return { overview, platforms, sources, timeseries, activity, topUsers, errors };
}
