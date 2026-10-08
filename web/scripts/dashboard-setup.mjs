#!/usr/bin/env node
// Настройка входа в дашборд: логин, пароль и Google Authenticator.
//
// Запуск на сервере (нужен только Docker, Node.js на хосте не требуется):
//
//   docker run --rm -it -v /home/aksak/apps/Videoner/web/scripts:/s:ro \
//     node:20-alpine node /s/dashboard-setup.mjs
//
// Скрипт спросит логин и пароль, создаст секрет для Google Authenticator,
// попросит ввести первый код из приложения и выведет три строки для .env.
// Пароль нигде не сохраняется — только его хеш. Повторный запуск выдаёт
// новый секрет: старый код и все открытые сессии перестанут работать.
//
// Формат хеша и проверка кода совпадают с lib/auth/dashboard-auth.ts.

import { createHmac, randomBytes, scryptSync } from "node:crypto";
import readline from "node:readline";
import { pathToFileURL } from "node:url";

const BASE32 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

export function base32Encode(buf) {
  let bits = 0;
  let value = 0;
  let out = "";
  for (const byte of buf) {
    value = (value << 8) | byte;
    bits += 8;
    while (bits >= 5) {
      out += BASE32[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  if (bits > 0) out += BASE32[(value << (5 - bits)) & 31];
  return out;
}

export function hotp(key, counter) {
  const msg = Buffer.alloc(8);
  msg.writeBigUInt64BE(BigInt(counter));
  const mac = createHmac("sha1", key).update(msg).digest();
  const offset = mac[mac.length - 1] & 0x0f;
  return ((mac.readUInt32BE(offset) & 0x7fffffff) % 1_000_000).toString().padStart(6, "0");
}

function totpMatches(key, code) {
  const current = Math.floor(Date.now() / 1000 / 30);
  return [-1, 0, 1].some((d) => hotp(key, current + d) === code);
}

export function hashPassword(password) {
  const N = 16384, r = 8, p = 1;
  const salt = randomBytes(16);
  const hash = scryptSync(password, salt, 64, { N, r, p, maxmem: 64 * 1024 * 1024 });
  return `scrypt:${N}:${r}:${p}:${salt.toString("hex")}:${hash.toString("hex")}`;
}

let rl;

function ask(question) {
  return new Promise((resolve) => rl.question(question, (answer) => resolve(answer)));
}

// Ввод без эха: символы пароля на экран не выводятся.
function askHidden(question) {
  return new Promise((resolve) => {
    const write = rl._writeToOutput;
    rl._writeToOutput = (s) => {
      if (s.includes(question)) write.call(rl, s);
    };
    rl.question(question, (answer) => {
      rl._writeToOutput = write;
      process.stdout.write("\n");
      resolve(answer);
    });
  });
}

async function main() {
  if (!process.stdin.isTTY) {
    console.error("Запустите с флагом -it, чтобы можно было ввести пароль.");
    process.exit(1);
  }
  rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });

  console.log("\nНастройка входа в дашборд Videoner\n");

  let username = "";
  while (!username) username = (await ask("Логин: ")).trim();

  let password = "";
  for (;;) {
    password = await askHidden("Пароль (не меньше 12 символов): ");
    if (password.length < 12) {
      console.log("Слишком короткий пароль.");
      continue;
    }
    const again = await askHidden("Повторите пароль: ");
    if (again === password) break;
    console.log("Пароли не совпали, ещё раз.");
  }

  const secretBytes = randomBytes(20);
  const secret = base32Encode(secretBytes);
  const label = encodeURIComponent(`Videoner Dashboard:${username}`);
  const uri = `otpauth://totp/${label}?secret=${secret}&issuer=${encodeURIComponent("Videoner Dashboard")}&algorithm=SHA1&digits=6&period=30`;

  console.log("\nДобавьте аккаунт в Google Authenticator:");
  console.log("  «+» → «Ввести ключ настройки»");
  console.log("  Название: Videoner Dashboard");
  console.log(`  Ключ:     ${secret.match(/.{1,4}/g).join(" ")}`);
  console.log("  Тип ключа: по времени\n");
  console.log("Или отсканируйте QR-код. Нарисовать его в терминале можно так");
  console.log("(после `sudo apt install qrencode`):");
  console.log(`  qrencode -t ansiutf8 '${uri}'\n`);

  for (;;) {
    const code = (await ask("Код из приложения для проверки: ")).replace(/\s/g, "");
    if (totpMatches(secretBytes, code)) break;
    console.log("Код не подошёл. Проверьте время на телефоне и введите новый код.");
  }

  console.log("\nГотово. Добавьте эти строки в /home/aksak/apps/Videoner/.env");
  console.log("(если такие уже есть — замените):\n");
  console.log(`DASHBOARD_USERNAME=${username}`);
  console.log(`DASHBOARD_PASSWORD_HASH=${hashPassword(password)}`);
  console.log(`DASHBOARD_TOTP_SECRET=${secret}`);
  console.log("\nИ перезапустите сайт — или скажите об этом Claude.\n");
  rl.close();
}

// Диалог — только при прямом запуске; импорт (тест совместимости с сайтом,
// lib/auth/dashboard-auth.test.ts) берёт одни функции.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
