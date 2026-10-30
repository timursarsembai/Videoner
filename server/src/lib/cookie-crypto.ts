import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

// Шифрование кук пользователей (UserCookie.data, CookieConnectCode.data).
// AES-256-GCM: кроме тайны даёт и проверку целостности — подменённые в базе
// байты не расшифруются, а не превратятся в чужие куки.
//
// Ключ — USER_COOKIES_KEY, 32 байта в base64, хранится в Infisical (проект
// videoner, prod) и только в окружении сервера. Без ключа подключение кук
// выключено целиком (isEnabled), а не хранит их открытыми. Потеря ключа =
// потеря всех подключённых кук (люди подключат заново), поэтому менять его
// можно, но только осознанно.
//
// Формат: iv (12 байт) | tag (16 байт) | шифротекст.

const IV_BYTES = 12;
const TAG_BYTES = 16;

function key(): Buffer | null {
  const raw = process.env.USER_COOKIES_KEY;
  if (!raw) return null;
  const buf = Buffer.from(raw, 'base64');
  return buf.length === 32 ? buf : null;
}

export function cookieCryptoEnabled(): boolean {
  return key() !== null;
}

export function encryptCookies(plain: string): Buffer {
  const k = key();
  if (!k) throw new Error('USER_COOKIES_KEY is not configured');
  const iv = randomBytes(IV_BYTES);
  const cipher = createCipheriv('aes-256-gcm', k, iv);
  const body = Buffer.concat([cipher.update(plain, 'utf8'), cipher.final()]);
  return Buffer.concat([iv, cipher.getAuthTag(), body]);
}

export function decryptCookies(blob: Buffer | Uint8Array): string {
  const k = key();
  if (!k) throw new Error('USER_COOKIES_KEY is not configured');
  const buf = Buffer.from(blob);
  const iv = buf.subarray(0, IV_BYTES);
  const tag = buf.subarray(IV_BYTES, IV_BYTES + TAG_BYTES);
  const decipher = createDecipheriv('aes-256-gcm', k, iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(buf.subarray(IV_BYTES + TAG_BYTES)), decipher.final()]).toString('utf8');
}
