import { test } from "node:test";
import assert from "node:assert/strict";
import {
  acceptTotpOnce,
  base32Decode,
  clearFailures,
  createDashboardSession,
  hashPassword,
  hotp,
  isLockedOut,
  matchTotp,
  recordFailure,
  resetLockouts,
  resetTotpReplayGuard,
  verifyDashboardSession,
  verifyPassword,
} from "./dashboard-auth";
import { randomBytes } from "node:crypto";
// @ts-expect-error — обычный JS-скрипт без типов
import * as setup from "../../scripts/dashboard-setup.mjs";

// Эталонный секрет из RFC 6238 (ASCII "12345678901234567890").
const RFC_SECRET = "GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ";

test("TOTP совпадает с эталонными значениями RFC 6238", () => {
  const key = base32Decode(RFC_SECRET);
  assert.equal(key.toString(), "12345678901234567890");
  // В RFC 8-значные коды; Google Authenticator показывает последние 6 цифр.
  assert.equal(hotp(key, Math.floor(59 / 30)), "287082");
  assert.equal(hotp(key, Math.floor(1111111109 / 30)), "081804");
  assert.equal(hotp(key, Math.floor(1234567890 / 30)), "005924");
});

test("код принимается в соседнем 30-секундном шаге, но не дальше", () => {
  const key = base32Decode(RFC_SECRET);
  const now = 1234567890 * 1000;
  const step = Math.floor(1234567890 / 30);
  assert.equal(matchTotp(RFC_SECRET, hotp(key, step), now), step);
  assert.equal(matchTotp(RFC_SECRET, hotp(key, step - 1), now), step - 1);
  assert.equal(matchTotp(RFC_SECRET, hotp(key, step - 2), now), null);
  assert.equal(matchTotp(RFC_SECRET, "abc123", now), null);
});

test("один и тот же код дважды не принимается", () => {
  resetTotpReplayGuard();
  assert.equal(acceptTotpOnce(100), true);
  assert.equal(acceptTotpOnce(100), false);
  assert.equal(acceptTotpOnce(99), false);
  assert.equal(acceptTotpOnce(101), true);
});

test("пароль проверяется по хешу scrypt", () => {
  const stored = hashPassword("correct horse battery", Buffer.alloc(16, 7));
  assert.match(stored, /^scrypt:16384:8:1:[0-9a-f]{32}:[0-9a-f]{128}$/);
  assert.equal(verifyPassword("correct horse battery", stored), true);
  assert.equal(verifyPassword("correct horse batterY", stored), false);
  assert.equal(verifyPassword("anything", "garbage"), false);
});

test("после 5 неудач с адреса вход закрыт на 15 минут", () => {
  resetLockouts();
  const t0 = 1_000_000;
  for (let i = 0; i < 5; i++) recordFailure("1.2.3.4", t0);
  assert.equal(isLockedOut("1.2.3.4", t0 + 1000), true);
  assert.equal(isLockedOut("5.6.7.8", t0 + 1000), false);
  assert.equal(isLockedOut("1.2.3.4", t0 + 15 * 60 * 1000 + 1), false);
  recordFailure("9.9.9.9", t0);
  clearFailures("9.9.9.9");
  assert.equal(isLockedOut("9.9.9.9", t0), false);
});

test("сессия обрывается при смене пароля или секрета", async () => {
  process.env.SESSION_SECRET = "test-secret";
  const credentials = {
    username: "owner",
    passwordHash: hashPassword("pw-1234567890", Buffer.alloc(16, 1)),
    totpSecret: RFC_SECRET,
  };
  process.env.DASHBOARD_USERNAME = credentials.username;
  process.env.DASHBOARD_PASSWORD_HASH = credentials.passwordHash;
  process.env.DASHBOARD_TOTP_SECRET = credentials.totpSecret;

  const token = await createDashboardSession(credentials);
  assert.equal(await verifyDashboardSession(token), true);
  assert.equal(await verifyDashboardSession(undefined), false);
  assert.equal(await verifyDashboardSession("not-a-token"), false);

  process.env.DASHBOARD_TOTP_SECRET = "JBSWY3DPEHPK3PXP";
  assert.equal(await verifyDashboardSession(token), false);
});

test("скрипт настройки выдаёт то, что сайт примет", () => {
  for (let i = 0; i < 100; i++) {
    const bytes = randomBytes(20);
    assert.ok(base32Decode(setup.base32Encode(bytes)).equals(bytes));
  }
  const stored = setup.hashPassword("a long enough password");
  assert.equal(verifyPassword("a long enough password", stored), true);
  assert.equal(verifyPassword("another password", stored), false);
  // Код, который покажет Google Authenticator, совпадёт с проверкой сайта.
  const key = randomBytes(20);
  const secret = setup.base32Encode(key);
  const now = Date.now();
  const step = Math.floor(now / 1000 / 30);
  assert.equal(matchTotp(secret, setup.hotp(key, step), now), step);
});
