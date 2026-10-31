// Подключённые аккаунты (куки людей) — чистая часть, без Telegram и сервера
// (accounts.test.ts). Сетевая — handlers/accounts.ts, хранение — сервер
// (server/src/modules/user-cookies).

// Код от кнопки «Подключить аккаунт» в расширении: «ABC-234». Только
// заглавные из алфавита сервера (без 0/O, 1/I/L), иначе обычное слово в личке
// приняли бы за код.
export const CONNECT_CODE_RE = /^\s*([A-HJ-NP-Z2-9]{3})-?([A-HJ-NP-Z2-9]{3})\s*$/;
const STRICT_CODE_RE = /^\s*([A-HJ-NP-Z2-9]{3})-([A-HJ-NP-Z2-9]{3})\s*$/;

// strict — только с дефисом, как код показывает расширение: голое сообщение
// в личке или в группе иначе путалось бы с обычным словом («PRAVDA»). После
// команды /connect дефис необязателен — там намерение и так ясно.
export function parseConnectCode(text: string, { strict = false } = {}): string | null {
  const m = (strict ? STRICT_CODE_RE : CONNECT_CODE_RE).exec(text);
  return m ? `${m[1]}-${m[2]}` : null;
}

// Где действуют куки: личка человека или одна группа. В личке id чата и есть
// id человека, но пишем через userId — так область не зависит от того,
// откуда пришёл запрос.
export function cookieScopeFor(chat: { id: number; type: string }, userId: number): string {
  return chat.type === "private" ? `user:${userId}` : `chat:${chat.id}`;
}

// Текст cookies.txt или JSON из расширения, вставленный сообщением.
export function looksLikeCookiesText(text: string): boolean {
  const t = text.trim();
  if (t.startsWith("# Netscape HTTP Cookie File") || t.startsWith("# HTTP Cookie File")) return true;
  // Строки Netscape: 7 полей через табуляцию, первое — домен.
  // Табуляции при вставке с телефона могут превратиться в пробелы.
  if (t.split("\n").some((line) => /^#?(HttpOnly_)?\.?[a-z0-9.-]+\.[a-z]{2,}[\t ]+(TRUE|FALSE)[\t ]/i.test(line))) return true;
  return t.startsWith("[") && t.includes('"domain"') && t.includes('"value"');
}

export const PLATFORM_LABELS: Record<string, string> = {
  instagram: "Instagram",
  facebook: "Facebook",
  youtube: "YouTube",
  twitter: "X",
  vk: "VK",
  tiktok: "TikTok",
};

export function platformLabel(platform: string): string {
  return PLATFORM_LABELS[platform] ?? platform;
}

// Причина отказа сервера в тексте ошибки («Cookies rejected: no-session»).
export function rejectionReason(message: string): "no-session" | "unknown" | "unavailable" | "not-found" | "too-large" | null {
  if (/cookies rejected: no-session/i.test(message)) return "no-session";
  if (/cookies rejected/i.test(message)) return "unknown";
  if (/not configured/i.test(message)) return "unavailable";
  if (/code not found/i.test(message)) return "not-found";
  if (/too large/i.test(message)) return "too-large";
  return null;
}
