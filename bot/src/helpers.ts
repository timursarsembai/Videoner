import { messages, type Lang } from "./i18n.js";

// Раньше весь bot.ts (494 строки) держал это на одном уровне вместе со всеми
// хендлерами — вынесено в отдельный модуль без побочных эффектов при импорте
// (в отличие от bot.ts, который создаёт Bot и в конце вызывает bot.start()),
// чтобы handlers/*.ts могли использовать эти утилиты, не завися от bot.ts.
export const API_URL = process.env.API_URL ?? "http://localhost:3001";
export const API_KEY = process.env.API_KEY ?? "";
// Кому разрешены /grant и /revoke — свой Telegram ID узнать можно у @userinfobot.
export const ADMIN_TELEGRAM_ID = process.env.ADMIN_TELEGRAM_ID
  ? Number(process.env.ADMIN_TELEGRAM_ID)
  : undefined;
// Адрес локального Bot API сервера (поднимает лимит отправки файлов до 2 ГБ).
// Если не задан — используется облачный api.telegram.org с лимитом 50 МБ.
export const BOT_API_ROOT = process.env.BOT_API_ROOT || undefined;
export const CLOUD_SIZE_LIMIT = 48 * 1024 * 1024;

// Без таймаута зависший (не 5xx, а именно hang — например под нагрузкой)
// запрос к серверу мог висеть неограниченно, ломая расчётный 20-минутный
// потолок ожидания в performDownload (400 итераций × 3с) — пользователь
// весь это время видел "⏬ Скачиваю..." без единого сообщения об ошибке.
const API_TIMEOUT_MS = 30_000;

export async function api<T = any>(path: string, body?: unknown): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), API_TIMEOUT_MS);
  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method: body ? "POST" : "GET",
      headers: { "Content-Type": "application/json", "X-API-Key": API_KEY },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
  } catch (e: any) {
    if (e?.name === "AbortError") {
      throw new Error("Request to server timed out");
    }
    throw e;
  } finally {
    clearTimeout(timeout);
  }
  // Сервер/прокси иногда отдаёт не-JSON тело (HTML со страницей 502/504) —
  // без этого res.json() бросал бы SyntaxError, которая долетала бы до
  // пользователя как есть ("Unexpected token < in JSON..."), минуя friendlyError().
  let data: any;
  try {
    data = await res.json();
  } catch {
    throw new Error(`API error ${res.status}`);
  }
  if (!res.ok) {
    throw new Error(Array.isArray(data?.message) ? data.message.join("; ") : data?.message || `API error ${res.status}`);
  }
  return data as T;
}

// Бот проксирует /info одним shared API-ключом на всех Telegram-пользователей —
// без этого один пользователь, засыпающий ссылками, мог бы выесть общий лимит
// у сервера (запрос HD/платного скачивания и так гасится квотой/оплатой, а вот
// /info дергается на КАЖДУЮ присланную ссылку без такой защиты).
const USER_RATE_LIMIT = 20; // ссылок в минуту на одного пользователя
const userRequests = new Map<number, { count: number; resetAt: number }>();

export function checkUserRateLimit(telegramId: number): boolean {
  const now = Date.now();
  const entry = userRequests.get(telegramId);

  if (!entry || entry.resetAt < now) {
    userRequests.set(telegramId, { count: 1, resetAt: now + 60_000 });
    return true;
  }

  if (entry.count >= USER_RATE_LIMIT) {
    return false;
  }

  entry.count++;
  return true;
}

setInterval(() => {
  const now = Date.now();
  for (const [id, entry] of userRequests.entries()) {
    if (entry.resetAt < now) userRequests.delete(id);
  }
}, 60_000);

// 10 бесплатных скачиваний в сутки на пользователя (см. DAILY_FREE_DOWNLOAD_LIMIT на сервере) —
// сверх лимита только подписка (никаких разовых Stars-оплат в боте больше нет вообще).
// Падает открыто (не блокирует скачивание, remaining = Infinity), если сервер недоступен,
// чтобы сбой проверки лимита не клал бота. unlimited (выдаётся через /grant) снимает лимит и HD-гейт целиком.
export async function getQuotaInfo(telegramId?: number): Promise<{ remaining: number; unlimited: boolean }> {
  if (!telegramId) return { remaining: Infinity, unlimited: false };
  // Админ не должен зависеть от состояния БД (isUnlimited можно случайно
  // сбросить /revoke, БД может быть недоступна и т.п.) — байпас чисто в коде бота.
  if (ADMIN_TELEGRAM_ID && telegramId === ADMIN_TELEGRAM_ID) {
    return { remaining: Infinity, unlimited: true };
  }
  try {
    return await api<{ remaining: number; unlimited: boolean }>(`/download/quota?telegramId=${telegramId}`);
  } catch (e) {
    console.error("Quota check failed:", e);
    return { remaining: Infinity, unlimited: false };
  }
}

export function fmtDuration(sec?: number): string {
  if (!sec) return "";
  const m = Math.floor(sec / 60);
  const s = Math.round(sec % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

// Переводит сырые ошибки yt-dlp в понятные пользователю объяснения.
// Instagram/Facebook отдают приватные, возрастные и "чувствительные" ролики
// только залогиненным сессиям — без cookies.txt на сервере такие ссылки не скачать.
export function friendlyError(raw: string, lang: Lang): string {
  const msg = (raw || "").toLowerCase();
  const m = messages[lang];

  if (
    msg.includes("certain audiences") ||
    msg.includes("age-restricted") ||
    msg.includes("age restricted") ||
    msg.includes("sign in") ||
    msg.includes("log in") ||
    msg.includes("login required") ||
    msg.includes("requires authentication") ||
    msg.includes("private")
  ) {
    return m.errorLoginRequired;
  }

  if (msg.includes("unsupported platform") || msg.includes("invalid url")) {
    return m.errorUnsupportedPlatform;
  }

  if (msg.includes("requested format is not available")) {
    return m.errorFormatUnavailable;
  }

  if (msg.includes("no video formats found") || msg.includes("doesn't contain a downloadable video")) {
    return m.errorNoVideoContent;
  }

  return raw;
}
