// Разовая рассылка пользователям бота: «у Videoner появилось расширение для
// браузера». Короткий текст согласован с владельцем 29.10.2026.
//
// Запуск — внутри контейнера videoner-server (там BOT_TOKEN, ADMIN_CHAT_ID,
// база и @prisma/client). Скрипт кладётся в /app, чтобы найти node_modules:
//   docker cp scripts/broadcast-extension.mjs videoner-server:/app/
//   docker exec videoner-server node /app/broadcast-extension.mjs --test
//   docker exec videoner-server node /app/broadcast-extension.mjs --dry
//   docker exec videoner-server node /app/broadcast-extension.mjs --send
//
// --test — оба варианта только в ADMIN_CHAT_ID; --dry — сколько кому уйдёт,
// без отправки; --send — всем.
//
// Почему осторожно — см. server/src/modules/nudge/nudge.service.ts: массовые
// сообщения от бота быстро собирают жалобы на спам. Поэтому: только днём по
// Алматы, пауза между сообщениями, и каждому строго одно — отправленные
// записываются в SENT_LOG, и повторный запуск их пропускает.

import { appendFileSync, existsSync, readFileSync } from "node:fs";
import prismaClient from "@prisma/client";

const TOKEN = process.env.BOT_TOKEN;
const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID;
// /app у пользователя контейнера только для чтения. Журнал в /tmp пропадёт
// при пересоздании контейнера — после рассылки его копируют на хост.
const SENT_LOG = "/tmp/broadcast-extension.sent";
const SEND_DELAY_MS = 400;
// 06:00–17:00 UTC = 11:00–22:00 по Алматы (владелец, 29.10.2026). --any-time
// снимает проверку — только по прямой просьбе владельца.
const WINDOW_START_UTC = 6;
const WINDOW_END_UTC = 17;
const ANY_TIME = process.argv.includes("--any-time");

// Русский — тем, у кого язык Telegram русский или украинский; остальным —
// английский.
const RU_LANGUAGES = ["ru", "uk"];

const MESSAGES = {
  ru: {
    text:
      "🧩 <b>Videoner теперь есть в браузере</b>\n\n" +
      "Кнопка «Скачать» прямо на странице видео: YouTube, Instagram, TikTok, VK и другие площадки, закрытые видео из вашего аккаунта и уроки GetCourse.\n\n" +
      "Для Chrome, Яндекс Браузера, Edge и Opera на компьютере. Установка — пара минут 👇",
    button: "Скачать расширение",
    url: "https://videoner.download/ru/extension",
  },
  en: {
    text:
      "🧩 <b>Videoner is now in your browser</b>\n\n" +
      "A Download button right on the video page: YouTube, Instagram, TikTok, VK and more, private videos from your account and GetCourse lessons.\n\n" +
      "For Chrome, Edge, Opera and Yandex Browser on a computer. Takes a couple of minutes to install 👇",
    button: "Download the extension",
    url: "https://videoner.download/extension",
  },
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function languageFor(languageCode) {
  const lang = (languageCode ?? "").slice(0, 2).toLowerCase();
  return RU_LANGUAGES.includes(lang) ? "ru" : "en";
}

async function send(chatId, lang) {
  const message = MESSAGES[lang];
  for (;;) {
    const res = await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message.text,
        parse_mode: "HTML",
        link_preview_options: { is_disabled: true },
        reply_markup: { inline_keyboard: [[{ text: message.button, url: message.url }]] },
      }),
    });
    const body = await res.json().catch(() => ({}));
    // Telegram просит подождать — ждём сколько сказано и шлём то же снова.
    if (res.status === 429) {
      await sleep(((body.parameters?.retry_after ?? 5) + 1) * 1000);
      continue;
    }
    return { ok: res.ok && body.ok === true, status: res.status, description: body.description ?? "" };
  }
}

function readSent() {
  if (!existsSync(SENT_LOG)) return new Set();
  return new Set(
    readFileSync(SENT_LOG, "utf8")
      .split("\n")
      .filter(Boolean)
      .map((line) => line.split(" ")[0]),
  );
}

async function main() {
  if (!TOKEN || !ADMIN_CHAT_ID) throw new Error("BOT_TOKEN и ADMIN_CHAT_ID должны быть заданы");
  const mode = ["--test", "--dry", "--send"].find((flag) => process.argv.includes(flag));
  if (!mode) throw new Error("Укажите --test, --dry или --send");

  if (mode === "--test") {
    for (const lang of ["ru", "en"]) {
      const result = await send(ADMIN_CHAT_ID, lang);
      console.log(lang, result.ok ? "отправлено" : `ошибка ${result.status}: ${result.description}`);
    }
    return;
  }

  const prisma = new prismaClient.PrismaClient();
  try {
    const users = await prisma.botUser.findMany({
      select: { telegramId: true, languageCode: true },
      orderBy: { firstSeenAt: "asc" },
    });
    const sent = readSent();
    // Админ уже видел сообщение в --test.
    const queue = users.filter((user) => !sent.has(String(user.telegramId)) && String(user.telegramId) !== String(ADMIN_CHAT_ID));
    const byLang = { ru: 0, en: 0 };
    for (const user of queue) byLang[languageFor(user.languageCode)]++;
    console.log(`Всего ${users.length}, уже отправлено ${users.length - queue.length}, в очереди ${queue.length} (ru ${byLang.ru}, en ${byLang.en})`);
    if (mode === "--dry") return;

    const counts = { sent: 0, blocked: 0, failed: 0 };
    for (const user of queue) {
      const hour = new Date().getUTCHours();
      if (!ANY_TIME && (hour < WINDOW_START_UTC || hour >= WINDOW_END_UTC)) {
        console.log(`Вне окна ${WINDOW_START_UTC}:00–${WINDOW_END_UTC}:00 UTC — остановлено, повторный запуск продолжит`);
        break;
      }
      const id = String(user.telegramId);
      const result = await send(id, languageFor(user.languageCode));
      // В журнал — и неудачи: заблокировавшим бота повторно слать бессмысленно,
      // а остальные ошибки разберём по журналу вручную.
      const outcome = result.ok ? "ok" : result.status === 403 ? "blocked" : `failed ${result.status} ${result.description}`;
      appendFileSync(SENT_LOG, `${id} ${outcome}\n`);
      if (result.ok) counts.sent++;
      else if (result.status === 403) counts.blocked++;
      else counts.failed++;
      await sleep(SEND_DELAY_MS);
    }
    const summary = `Рассылка о расширении: доставлено ${counts.sent}, заблокировали бота ${counts.blocked}, ошибок ${counts.failed}.`;
    console.log(summary);
    await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: ADMIN_CHAT_ID, text: summary }),
    });
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
