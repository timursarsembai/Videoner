// Куки, которые люди подключают боту сами (модуль user-cookies): разбор,
// фильтр по площадке, проверка, что это действительно вход.
//
// Приходят в двух видах:
//   - файл cookies.txt (формат Netscape — его пишут расширения-экспортёры и
//     понимает yt-dlp);
//   - JSON-массив из chrome.cookies.getAll (кнопка в расширении Videoner).
// Хранится и отдаётся yt-dlp всегда Netscape-текст.
//
// Берём ТОЛЬКО куки доменов выбранной площадки: экспортёр нередко выгружает
// весь браузер разом (почта, банк), а хранить чужие сессии нам незачем — это
// чистый риск для человека.

export type CookiePlatform = 'instagram' | 'facebook' | 'youtube' | 'twitter' | 'vk' | 'tiktok';

interface PlatformCookies {
  // Домены, куки которых нужны yt-dlp для этой площадки.
  domains: string[];
  // Хотя бы одна из этих кук — признак того, что человек вошёл. Без неё
  // файл бесполезен: площадка всё равно увидит гостя.
  session: string[];
}

export const COOKIE_PLATFORMS: Record<CookiePlatform, PlatformCookies> = {
  instagram: { domains: ['instagram.com'], session: ['sessionid'] },
  // Threads узнаёт пользователя по кукам Instagram — отдельной записи не нужно.
  facebook: { domains: ['facebook.com'], session: ['c_user', 'xs'] },
  youtube: {
    domains: ['youtube.com', 'google.com'],
    session: ['SAPISID', '__Secure-3PSID', 'SID', 'LOGIN_INFO'],
  },
  twitter: { domains: ['x.com', 'twitter.com'], session: ['auth_token'] },
  vk: { domains: ['vk.com', 'vk.ru', 'vkvideo.ru'], session: ['remixsid', 'remixnsid'] },
  tiktok: { domains: ['tiktok.com'], session: ['sessionid', 'sid_tt'] },
};

// Площадка ссылки (getPlatform) → чьи куки ей подходят.
export function cookiePlatformFor(platform: string | null): CookiePlatform | null {
  if (!platform) return null;
  if (platform === 'threads') return 'instagram';
  return (platform in COOKIE_PLATFORMS ? platform : null) as CookiePlatform | null;
}

export interface ParsedCookie {
  domain: string;
  includeSubdomains: boolean;
  path: string;
  secure: boolean;
  // Unix-время в секундах; 0 — сессионная кука.
  expires: number;
  name: string;
  value: string;
}

function domainMatches(cookieDomain: string, platformDomain: string): boolean {
  const d = cookieDomain.replace(/^\./, '').toLowerCase();
  return d === platformDomain || d.endsWith(`.${platformDomain}`);
}

function parseNetscape(text: string): ParsedCookie[] {
  const out: ParsedCookie[] = [];
  for (const rawLine of text.split(/\r?\n/)) {
    // «#HttpOnly_» — так экспортёры помечают httpOnly-куки; это не комментарий.
    const line = rawLine.startsWith('#HttpOnly_') ? rawLine.slice('#HttpOnly_'.length) : rawLine;
    if (!line.trim() || line.startsWith('#')) continue;
    const parts = line.split('\t');
    if (parts.length < 7) continue;
    const [domain, flag, path, secure, expires, name, ...rest] = parts;
    out.push({
      domain,
      includeSubdomains: flag.toUpperCase() === 'TRUE',
      path: path || '/',
      secure: secure.toUpperCase() === 'TRUE',
      expires: Number(expires) || 0,
      name,
      value: rest.join('\t'),
    });
  }
  return out;
}

// Формат chrome.cookies.Cookie.
function parseJson(text: string): ParsedCookie[] {
  const data = JSON.parse(text);
  if (!Array.isArray(data)) return [];
  return data
    .filter((c) => c && typeof c.domain === 'string' && typeof c.name === 'string' && typeof c.value === 'string')
    .map((c) => ({
      domain: c.domain,
      includeSubdomains: !c.hostOnly,
      path: typeof c.path === 'string' ? c.path : '/',
      secure: !!c.secure,
      expires: typeof c.expirationDate === 'number' ? Math.floor(c.expirationDate) : 0,
      name: c.name,
      value: c.value,
    }));
}

export function parseCookies(text: string): ParsedCookie[] {
  const trimmed = text.trim();
  if (trimmed.startsWith('[')) {
    try {
      return parseJson(trimmed);
    } catch {
      return [];
    }
  }
  return parseNetscape(text);
}

// Табуляции и переводы строк внутри полей сломали бы формат Netscape.
const SAFE_FIELD = /^[^\t\r\n]*$/;

export function toNetscape(cookies: ParsedCookie[]): string {
  const lines = ['# Netscape HTTP Cookie File'];
  for (const c of cookies) {
    if (![c.domain, c.path, c.name, c.value].every((f) => SAFE_FIELD.test(f))) continue;
    // Флаг поддоменов в Netscape должен совпадать с точкой в начале домена.
    const domain = c.includeSubdomains && !c.domain.startsWith('.') ? `.${c.domain}` : c.domain;
    lines.push(
      [domain, c.includeSubdomains ? 'TRUE' : 'FALSE', c.path, c.secure ? 'TRUE' : 'FALSE', String(c.expires), c.name, c.value].join('\t'),
    );
  }
  return lines.join('\n') + '\n';
}

export type ExtractResult =
  | { ok: true; platform: CookiePlatform; netscape: string; count: number }
  | { ok: false; reason: 'empty' | 'no-session' | 'unknown-platform' };

// Куки только этой площадки. platform не задан — определяем сами: первая
// площадка, для которой в файле есть кука входа.
export function extractPlatformCookies(text: string, platform?: CookiePlatform): ExtractResult {
  const all = parseCookies(text);
  if (!all.length) return { ok: false, reason: 'empty' };

  const candidates = platform ? [platform] : (Object.keys(COOKIE_PLATFORMS) as CookiePlatform[]);
  let sawPlatformCookies = false;
  for (const p of candidates) {
    const conf = COOKIE_PLATFORMS[p];
    const mine = all.filter((c) => conf.domains.some((d) => domainMatches(c.domain, d)));
    if (!mine.length) continue;
    sawPlatformCookies = true;
    const now = Math.floor(Date.now() / 1000);
    const hasSession = mine.some((c) => conf.session.includes(c.name) && c.value && (c.expires === 0 || c.expires > now));
    if (!hasSession) continue;
    return { ok: true, platform: p, netscape: toNetscape(mine), count: mine.length };
  }
  return { ok: false, reason: sawPlatformCookies ? 'no-session' : platform ? 'empty' : 'unknown-platform' };
}

// Что значит отказ площадки для подключённого входа.
//   dead      — вход точно не действует (сессию разлогинили, аккаунт требует
//               проверку): засчитываем сразу.
//   ambiguous — «нужен вход» / «недоступно»: так же отвечают про удалённый
//               пост, истёкшую сторис или закрытый профиль, на который
//               аккаунт не подписан. Засчитываем, только если другой аккаунт
//               пула тот же ролик получил (UserCookiesService) — иначе любой
//               участник группы выключил бы весь пул парой мёртвых ссылок.
//   null      — к входу отношения не имеет (ограничение по частоте, ролик
//               удалён, сбой сети).
const DEAD_SESSION_PATTERNS = [/checkpoint_required/i, /challenge_required/i, /http error 401/i, /401:?\s*unauthorized/i];
const AMBIGUOUS_PATTERNS = [/login required/i, /requires authentication/i, /this content is unreachable/i];
const RATE_LIMIT_PATTERNS = [/rate-?limit/i, /please wait a few minutes/i, /too many requests/i, /http error 429/i];

export function sessionFailureKind(message: string): 'dead' | 'ambiguous' | null {
  if (DEAD_SESSION_PATTERNS.some((re) => re.test(message))) return 'dead';
  if (RATE_LIMIT_PATTERNS.some((re) => re.test(message))) return null;
  if (AMBIGUOUS_PATTERNS.some((re) => re.test(message))) return 'ambiguous';
  return null;
}

// Стоит ли вообще пробовать подключённые куки после неудачи обычного пути:
// только если отказ похож на «нужен вход». Антибот-проверка YouTube, сбой
// прокси или сети — не повод гонять запрос от личного аккаунта человека.
export function userCookiesMayHelp(message: string): boolean {
  if (/confirm you.?re not a bot/i.test(message)) return false;
  return [
    /login required/i,
    /requires authentication/i,
    /this content is unreachable/i,
    /only available for registered users/i,
    /private/i,
    /cannot parse data/i,
    /empty media response/i,
    /without being logged-in/i,
    /sign in/i,
    /log in/i,
  ].some((re) => re.test(message));
}

// Ошибка, полученная с куками человека, уходит дальше — в ответ API и в чат.
// yt-dlp пишет «skipping cookie file entry …» со строкой файла целиком;
// убираем такие строки и всё, что похоже на строку Netscape (табуляции).
export function scrubCookieLines(message: string): string {
  return message
    .split('\n')
    .filter((line) => !/cookie file entry/i.test(line) && !line.includes('\t'))
    .join('\n');
}
