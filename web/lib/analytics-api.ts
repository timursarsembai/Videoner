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
  // Отказы площадки при разборе ссылки (до скачивания не дошло).
  linkFailures: number;
  // За всё время, независимо от периода карточки.
  allTimeTotal: number;
  allTimeCompleted: number;
  webLoginUsers: number;
  totalBotUsers: number;
}

export interface PlatformDatum {
  platform: string;
  count: number;
}

export interface RedditCounters {
  completed: number;
  failed: number;
  pending: number;
  linkFailures: number;
  policyRefusals: number;
  cached: number;
  bytes: number;
}

export interface RedditSummaryData {
  totals: RedditCounters;
  daily: (RedditCounters & { day: string; source: 'BOT' | 'WEB' })[];
  successRate: number | null;
}

export interface SourceDatum {
  source: string;
  count: number;
}

// Попытки скачивания и новые пользователи бота за день — каждый день
// периода, включая пустые.
export interface TimeseriesPoint {
  day: string;
  downloads: number;
  newUsers: number;
}

// Успешные скачивания за день недели (1 — понедельник … 7 — воскресенье)
// из одного источника, за период.
export interface WeekdayPoint {
  weekday: number;
  source: string;
  count: number;
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

// Активные пользователи за календарную неделю (с понедельника) или месяц.
export interface ActivePeriodPoint {
  period: string;
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

// Успешные скачивания площадки за день или календарный месяц (period).
// bytes — скачано из сети (у YouTube это трафик прокси), cachedBytes — отдано
// повторно из кеша, не потратив трафика.
export interface TrafficPoint {
  period: string;
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

// Строка журнала ошибок (/analytics/errors/log): повторы одной ссылки одним
// человеком на одном этапе с одной причиной склеены, count — сколько их было.
export interface ErrorLogRow {
  stage: "download" | "link";
  platform: string;
  source: string;
  category: string;
  country: string | null;
  url: string | null;
  message: string | null;
  lastAt: string;
  firstAt: string;
  count: number;
  username: string | null;
  telegramId: string | null;
}

export interface ErrorLogPage {
  total: number;
  rows: ErrorLogRow[];
}

// Ошибки за день по площадке (/analytics/errors/platforms); площадка — в
// нижнем регистре, как в ссылке: "instagram", "youtube".
export interface ErrorPlatformPoint {
  day: string;
  platform: string;
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
  // Страна посетителя сайта или расширения (код ISO), у бота null.
  country: string | null;
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
  lastSeenAt: string;
  downloadCount: number;
  blocked: boolean;
  lastEvent: { blocked: boolean; source: string; at: string } | null;
  // За всё время: скачанные файлы и ошибки (упавшие скачивания и отказы при
  // разборе ссылки — по пользователю только с 12.11.2026), по площадкам.
  ok: number;
  failed: number;
  platforms: UserPlatformOutcome[];
}

// platform — строчными: youtube, okru…
export interface UserPlatformOutcome {
  platform: string;
  ok: number;
  failed: number;
}

// Группа пользователей бота по исходу их попыток за всё время.
export interface OutcomeGroup {
  users: number;
  none: number;
  failedOnly: number;
  mixed: number;
  okOnly: number;
}

export interface BlockedOutcomes {
  groups: { blocked: OutcomeGroup; active: OutcomeGroup };
  // Только заблокировавшие сейчас; users — сколько из них пробовали площадку.
  platforms: (UserPlatformOutcome & { users: number })[];
}

// Подсказки после скачивания в боте и блокировки в 48 часов после них
// (server analytics.service promo).
export interface PromoStats {
  since: string | null;
  keys: { key: string; shown: number; blocked: number; last: string }[];
  baseline: { days: number; blocked: number };
}

// Все пользователи бота (server analytics.service allUsers) — таблица «Все
// пользователи» на вкладке «Пользователи».
export interface BotUserRow {
  telegramId: string;
  username: string | null;
  firstName: string | null;
  languageCode: string | null;
  firstSeenAt: string;
  lastSeenAt: string;
  lastDownloadAt: string | null;
  blockedAt: string | null;
  extension: boolean;
  webLogin: boolean;
  // Подписан на канал новостей — по проверке раз в сутки; null — не проверяли.
  inChannel: boolean | null;
  status: "active" | "inactive" | "blocked";
  ok: number;
  failed: number;
  platforms: UserPlatformOutcome[];
}

// Журнал одного пользователя (server analytics.service userJournal).
export interface UserJournal {
  telegramId: string;
  username: string | null;
  firstName: string | null;
  languageCode: string | null;
  firstSeenAt: string;
  lastSeenAt: string;
  blockedAt: string | null;
  instantVideo: boolean;
  extensionLinkedAt: string | null;
  lastWebLoginAt: string | null;
  inChannel: boolean | null;
  inChannelCheckedAt: string | null;
  ok: number;
  failed: number;
  truncated: boolean;
  entries: {
    at: string;
    kind: "download" | "link-failure";
    url: string;
    platform: string;
    source: string;
    ok: boolean;
    pending: boolean;
    status: string;
    number: number | null;
    errorCategory: string | null;
    fromCache: boolean;
    title: string | null;
    fileSize: number | null;
  }[];
  blocks: { blocked: boolean; source: string; at: string }[];
  promos: { key: string; at: string }[];
}

export interface BlockedSummary {
  total: number;
  blocked: number;
  users: BlockedUser[];
}

// Строка статистики по языкам за период. lang — код языка интерфейса
// (как в LANGUAGES), "other" — язык вне списка, "unknown" — не известен
// (скачивания сайта и расширения до начала записи языка, бот без
// пользователя). Пользователи — только бота: язык выбранный вручную, иначе
// по языку Telegram. Скачивания — только успешные.
export interface LanguageStatsRow {
  lang: string;
  usersTotal: number;
  usersActive: number;
  usersNew: number;
  botDownloads: number;
  webDownloads: number;
  extensionDownloads: number;
  totalDownloads: number;
}

// Успешные скачивания сайта и расширения из одной страны за период. country —
// код ISO 3166-1 alpha-2 или "unknown" (до начала записи страны или без
// заголовка Cloudflare).
export interface CountryStatsRow {
  country: string;
  webDownloads: number;
  extensionDownloads: number;
  totalDownloads: number;
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

// Запросы графиков собираются в пакет: всё, что графики попросили за один
// проход отрисовки, уходит одним GET /analytics/batch. У каждого графика свой
// период, и по запросу на график дашборд быстро упирался бы в лимит частоты
// сервера (он общий для всех запросов сайта). Одинаковые запросы (два графика
// с одними данными и периодом) уходят один раз.
export type AnalyticsParams = Record<string, string | number | undefined>;

interface PendingQuery {
  key: string;
  name: string;
  params: AnalyticsParams;
  resolve: (value: unknown) => void;
  reject: (reason: unknown) => void;
}

// Столько же принимает сервер (MAX_BATCH в analytics.controller.ts).
const MAX_BATCH = 40;
let pending: PendingQuery[] = [];
let flushTimer: ReturnType<typeof setTimeout> | null = null;

export function analyticsQuery<T>(name: string, params: AnalyticsParams = {}): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    pending.push({
      key: JSON.stringify([name, params]),
      name,
      params,
      resolve: resolve as (value: unknown) => void,
      reject,
    });
    flushTimer ??= setTimeout(flushQueries, 0);
  });
}

async function flushQueries() {
  flushTimer = null;
  const queue = pending;
  pending = [];
  const byKey = new Map<string, PendingQuery[]>();
  for (const query of queue) byKey.set(query.key, [...(byKey.get(query.key) ?? []), query]);
  const unique = Array.from(byKey.values());
  for (let i = 0; i < unique.length; i += MAX_BATCH) {
    void sendBatch(unique.slice(i, i + MAX_BATCH));
  }
}

async function sendBatch(groups: PendingQuery[][]) {
  const items = groups.map((group, i) => ({ id: String(i), name: group[0].name, ...group[0].params }));
  const settle = (i: number, ok: boolean, value: unknown) =>
    groups[i].forEach((q) => (ok ? q.resolve(value) : q.reject(value)));
  try {
    const result = await get<Record<string, unknown>>(`/batch?q=${encodeURIComponent(JSON.stringify(items))}`);
    groups.forEach((_, i) => {
      const value = result[String(i)];
      const failed = value && typeof value === "object" && "error" in value && Object.keys(value).length === 1;
      if (value === undefined || failed) {
        settle(i, false, new Error(failed ? String((value as { error: unknown }).error) : "Нет ответа"));
      } else {
        settle(i, true, value);
      }
    });
  } catch (error) {
    groups.forEach((_, i) => settle(i, false, error));
  }
}

// Журнал грузится ОТДЕЛЬНО от графиков: у него своя постраничная навигация,
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
