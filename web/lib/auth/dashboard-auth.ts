import { createHmac, scryptSync, timingSafeEqual } from "node:crypto";
import { SignJWT, jwtVerify } from "jose";

// Вход в дашборд: логин, пароль и код из Google Authenticator (TOTP).
//
// Пользователь один — владелец, поэтому учётные данные живут в окружении сайта,
// а не в базе: DASHBOARD_USERNAME, DASHBOARD_PASSWORD_HASH, DASHBOARD_TOTP_SECRET.
// Создаёт их scripts/dashboard-setup.mjs. Раньше вход был по общему API-ключу с
// правами администратора: кто узнал ключ, тот и вошёл, второго фактора не было.

export const DASHBOARD_SESSION_DAYS = 7;
const SESSION_AUDIENCE = "videoner-dashboard";

export interface DashboardCredentials {
  username: string;
  passwordHash: string;
  totpSecret: string;
}

// Не заданы все три — входа нет вовсе (а не «вход без пароля»).
export function readCredentials(env = process.env): DashboardCredentials | null {
  const username = env.DASHBOARD_USERNAME?.trim();
  const passwordHash = env.DASHBOARD_PASSWORD_HASH?.trim();
  const totpSecret = env.DASHBOARD_TOTP_SECRET?.trim();
  if (!username || !passwordHash || !totpSecret) return null;
  return { username, passwordHash, totpSecret };
}

function safeEqual(a: Buffer, b: Buffer): boolean {
  return a.length === b.length && timingSafeEqual(a, b);
}

export function safeEqualStrings(a: string, b: string): boolean {
  // Сравниваем хеши одинаковой длины: так время ответа не выдаёт ни длину
  // логина, ни сколько символов совпало.
  const ha = createHmac("sha256", "cmp").update(a).digest();
  const hb = createHmac("sha256", "cmp").update(b).digest();
  return safeEqual(ha, hb);
}

// --- Пароль -----------------------------------------------------------------
//
// Формат: scrypt:N:r:p:соль_hex:хеш_hex. Без знака «$»: docker compose
// подставляет переменные в .env, и «$» в хеше пришлось бы экранировать.

export function hashPassword(password: string, salt: Buffer, N = 16384, r = 8, p = 1): string {
  const hash = scryptSync(password, salt, 64, { N, r, p, maxmem: 64 * 1024 * 1024 });
  return `scrypt:${N}:${r}:${p}:${salt.toString("hex")}:${hash.toString("hex")}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const parts = stored.split(":");
  if (parts.length !== 6 || parts[0] !== "scrypt") return false;
  const [, n, r, p, saltHex, hashHex] = parts;
  const expected = Buffer.from(hashHex, "hex");
  try {
    const actual = scryptSync(password, Buffer.from(saltHex, "hex"), expected.length, {
      N: Number(n),
      r: Number(r),
      p: Number(p),
      maxmem: 64 * 1024 * 1024,
    });
    return safeEqual(actual, expected);
  } catch {
    return false;
  }
}

// --- TOTP (RFC 6238), как в Google Authenticator: SHA-1, 30 с, 6 цифр -----------

const BASE32 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

export function base32Decode(input: string): Buffer {
  const clean = input.toUpperCase().replace(/[\s=-]/g, "");
  let bits = 0;
  let value = 0;
  const out: number[] = [];
  for (const char of clean) {
    const index = BASE32.indexOf(char);
    if (index === -1) throw new Error("Invalid base32 secret");
    value = (value << 5) | index;
    bits += 5;
    if (bits >= 8) {
      out.push((value >>> (bits - 8)) & 0xff);
      bits -= 8;
    }
  }
  return Buffer.from(out);
}

export function hotp(key: Buffer, counter: number, digits = 6): string {
  const msg = Buffer.alloc(8);
  msg.writeBigUInt64BE(BigInt(counter));
  const mac = createHmac("sha1", key).update(msg).digest();
  const offset = mac[mac.length - 1] & 0x0f;
  const code = (mac.readUInt32BE(offset) & 0x7fffffff) % 10 ** digits;
  return code.toString().padStart(digits, "0");
}

// Номер 30-секундного шага, которому соответствует код, или null. Принимаем
// и соседние шаги: часы телефона редко идут секунда в секунду с сервером.
export function matchTotp(
  secret: string,
  code: string,
  nowMs = Date.now(),
  window = 1,
): number | null {
  if (!/^\d{6}$/.test(code)) return null;
  const key = base32Decode(secret);
  const current = Math.floor(nowMs / 1000 / 30);
  for (let delta = -window; delta <= window; delta++) {
    const counter = current + delta;
    if (safeEqualStrings(hotp(key, counter), code)) return counter;
  }
  return null;
}

// Уже принятый код повторно не годится: подсмотренный или перехваченный код
// иначе работал бы ещё до минуты.
let lastAcceptedCounter = -1;

export function acceptTotpOnce(counter: number): boolean {
  if (counter <= lastAcceptedCounter) return false;
  lastAcceptedCounter = counter;
  return true;
}

export function resetTotpReplayGuard() {
  lastAcceptedCounter = -1;
}

// --- Защита от подбора ------------------------------------------------------

const MAX_FAILURES = 5;
const LOCK_MS = 15 * 60 * 1000;
const failures = new Map<string, { count: number; firstAt: number }>();

// true — с этого адреса пока нельзя пробовать.
export function isLockedOut(ip: string, nowMs = Date.now()): boolean {
  const entry = failures.get(ip);
  if (!entry) return false;
  if (nowMs - entry.firstAt > LOCK_MS) {
    failures.delete(ip);
    return false;
  }
  return entry.count >= MAX_FAILURES;
}

export function recordFailure(ip: string, nowMs = Date.now()) {
  const entry = failures.get(ip);
  if (!entry || nowMs - entry.firstAt > LOCK_MS) {
    failures.set(ip, { count: 1, firstAt: nowMs });
  } else {
    entry.count++;
  }
}

export function clearFailures(ip: string) {
  failures.delete(ip);
}

export function resetLockouts() {
  failures.clear();
}

// --- Сессия -----------------------------------------------------------------
//
// Подписанный токен вместо API-ключа в cookie. Отдельная audience не даёт
// подсунуть сюда токен обычного входа на сайте, подписанный тем же секретом.

function sessionKey(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET is not configured");
  return new TextEncoder().encode(secret);
}

// Отпечаток текущих учётных данных. Новый пароль или новый секрет (скрипт
// настройки перезапустили, например после потери телефона) обрывает все
// выданные сессии: иначе украденная cookie жила бы до 7 дней.
function credentialsVersion(credentials: DashboardCredentials): string {
  return createHmac("sha256", "dashboard-session")
    .update(`${credentials.username}\n${credentials.passwordHash}\n${credentials.totpSecret}`)
    .digest("hex")
    .slice(0, 16);
}

export async function createDashboardSession(credentials: DashboardCredentials): Promise<string> {
  return new SignJWT({ sub: credentials.username, ver: credentialsVersion(credentials) })
    .setProtectedHeader({ alg: "HS256" })
    .setAudience(SESSION_AUDIENCE)
    .setIssuedAt()
    .setExpirationTime(`${DASHBOARD_SESSION_DAYS}d`)
    .sign(sessionKey());
}

export async function verifyDashboardSession(token: string | undefined): Promise<boolean> {
  const credentials = readCredentials();
  if (!token || !credentials) return false;
  try {
    const { payload } = await jwtVerify(token, sessionKey(), { audience: SESSION_AUDIENCE });
    return (
      payload.sub === credentials.username && payload.ver === credentialsVersion(credentials)
    );
  } catch {
    return false;
  }
}
