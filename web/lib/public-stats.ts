// Цифры страницы «Videoner в цифрах» (app/[locale]/stats): сервер считает их
// не чаще раза в час (server public-stats.service.ts) и сам держит кеш.

export interface PublicStats {
  updatedAt: string;
  since: string | null;
  downloads: number;
  bySource: { source: string; count: number }[];
  byPlatform: { platform: string; count: number }[];
  botUsers: number;
  activeBotUsers: number;
  countries: number;
}

const API_URL = process.env.API_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL;
const API_KEY = process.env.API_KEY;

export async function fetchPublicStats(): Promise<PublicStats | null> {
  if (!API_URL || !API_KEY) return null;
  try {
    const res = await fetch(`${API_URL}/stats/public`, {
      headers: { "X-API-Key": API_KEY },
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as PublicStats;
    // Сервер поменял поля — лучше «недоступно», чем NaN на публичной странице.
    return Number.isFinite(data?.downloads) && Number.isFinite(data?.botUsers) && Array.isArray(data?.bySource) ? data : null;
  } catch {
    return null;
  }
}

// «8 100+»: округляем вниз до двух значащих цифр, чтобы цифра не устаревала
// за день и не обещала больше, чем есть. Меньше сотни — как есть.
export function roundDown(n: number): { value: number; plus: boolean } {
  if (n < 100) return { value: n, plus: false };
  const step = 10 ** (Math.floor(Math.log10(n)) - 1);
  const value = Math.floor(n / step) * step;
  return { value, plus: value < n };
}

export function formatRounded(n: number, locale: string): string {
  const { value, plus } = roundDown(n);
  return `${new Intl.NumberFormat(locale).format(value)}${plus ? "+" : ""}`;
}
