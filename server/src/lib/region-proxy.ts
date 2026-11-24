import { proxyAffinityKey } from './proxy-pool';

// Казахстанский адрес для роликов, закрытых «для других стран» (владелец
// 24.11.2026). TikTok отвечает нашему серверу (его адрес TikTok считает
// французским) «status code 10231» / cross_border_violation, если автор
// открыл ролик только для своей страны. Большинство таких ссылок — от
// казахстанских авторов: из 5 прошлых отказов 4 открылись с адреса в
// Казахстане. Rutube и VK так не лечатся — их ролики открыты только для России.
//
// Адрес — SOCKS-туннель на личный сервер владельца в Казахстане
// (REGION_PROXY_URL, сервис kz-tunnel в docker-compose.prod.yml). Через него
// идут и сведения о ролике, и сам файл, поэтому — только после такого отказа,
// а не всё подряд.

const REGION_PLATFORMS: ReadonlySet<string> = new Set(['tiktok']);

export function isRegionBlock(message: string, platform: string | null): boolean {
  if (!platform || !REGION_PLATFORMS.has(platform)) return false;
  return /status code 10231|cross_border_violation/i.test(message);
}

// Ролики, открывшиеся через Казахстан: скачивание идёт сразу туда, без
// заведомо провальной попытки напрямую. Ссылки на файл у TikTok привязаны к
// адресу, с которого получены сведения о ролике.
export class RegionMemory {
  private readonly until = new Map<string, number>();

  constructor(
    private readonly ttlMs = 6 * 60 * 60 * 1000,
    private readonly max = 5000,
  ) {}

  remember(url: string | undefined, now = Date.now()): void {
    const key = url ? proxyAffinityKey(url) : null;
    if (!key) return;
    this.until.delete(key);
    this.until.set(key, now + this.ttlMs);
    while (this.until.size > this.max) {
      this.until.delete(this.until.keys().next().value as string);
    }
  }

  has(url: string | undefined, now = Date.now()): boolean {
    const key = url ? proxyAffinityKey(url) : null;
    if (!key) return false;
    const until = this.until.get(key);
    if (until === undefined) return false;
    if (until > now) return true;
    this.until.delete(key);
    return false;
  }
}
