// Проверка, кто из пользователей бота его заблокировал. Сообщений не шлёт:
// sendChatAction («печатает…» на пару секунд, без уведомления) отвечает 403
// с причиной: «bot was blocked by the user» — заблокировал, «user is
// deactivated» — удалил аккаунт, «can't initiate conversation» — ни разу не
// запускал бота (вошёл только на сайт через Telegram). Последних в
// заблокировавшие не записываем.
//
// Запуск — внутри контейнера videoner-server (там BOT_TOKEN и база):
//   docker cp scripts/check-blocked.mjs videoner-server:/app/
//   docker exec videoner-server node /app/check-blocked.mjs
//   docker exec videoner-server node /app/check-blocked.mjs --since-broadcast /tmp/broadcast-extension.sent
//   docker exec videoner-server node /app/check-blocked.mjs --save
//
// --since-broadcast <журнал рассылки> — сверка с журналом: кто получил
// рассылку, а сейчас бота заблокировал.
// --save — записать результат в базу (BotUser.blockedAt и BotBlockEvent с
// source "check"), как это делает сервер. Нужно, если бот какое-то время не
// получал сообщения о блокировках. С --since-broadcast заблокировавшие ещё до
// рассылки записываются как "baseline": когда они заблокировали, неизвестно,
// и на графиках по периодам их нет.

import { readFileSync } from "node:fs";
import prismaClient from "@prisma/client";

const TOKEN = process.env.BOT_TOKEN;
const DELAY_MS = 100;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function check(chatId) {
  for (;;) {
    const res = await fetch(`https://api.telegram.org/bot${TOKEN}/sendChatAction`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, action: "typing" }),
    });
    const body = await res.json().catch(() => ({}));
    if (res.status === 429) {
      await sleep(((body.parameters?.retry_after ?? 5) + 1) * 1000);
      continue;
    }
    if (res.ok) return "active";
    const description = body.description ?? "";
    if (res.status === 403 && /blocked by the user/i.test(description)) return "blocked";
    if (res.status === 403 && /deactivated/i.test(description)) return "deleted";
    if (res.status === 403 && /initiate conversation/i.test(description)) return "never-started";
    if (res.status === 400 && /chat not found/i.test(description)) return "deleted";
    return `error ${res.status} ${body.description ?? ""}`;
  }
}

async function main() {
  if (!TOKEN) throw new Error("BOT_TOKEN не задан");
  const logIndex = process.argv.indexOf("--since-broadcast");
  const broadcast = new Map();
  if (logIndex !== -1) {
    for (const line of readFileSync(process.argv[logIndex + 1], "utf8").split("\n").filter(Boolean)) {
      const [id, outcome] = line.split(" ");
      broadcast.set(id, outcome);
    }
  }

  const prisma = new prismaClient.PrismaClient();
  try {
    const save = process.argv.includes("--save");
    // blockedAt — только для --save: без него скрипт работает и на базе до
    // миграции bot_block_events.
    const users = await prisma.botUser.findMany({
      select: { id: true, telegramId: true, ...(save ? { blockedAt: true } : {}) },
    });
    const counts = {};
    const afterBroadcast = [];
    for (const user of users) {
      const id = String(user.telegramId);
      const state = await check(id);
      counts[state] = (counts[state] ?? 0) + 1;
      if (state !== "active" && broadcast.get(id) === "ok") afterBroadcast.push(`${id} ${state}`);
      const blocked = state === "blocked" || state === "deleted";
      if (save && (blocked || state === "active") && blocked !== Boolean(user.blockedAt)) {
        const before = broadcast.get(id);
        const source = blocked && before && before !== "ok" ? "baseline" : "check";
        const at = new Date();
        await prisma.$transaction([
          prisma.botUser.update({ where: { id: user.id }, data: { blockedAt: blocked ? at : null } }),
          prisma.botBlockEvent.create({ data: { botUserId: user.id, blocked, source, at } }),
        ]);
        counts[`saved ${source}`] = (counts[`saved ${source}`] ?? 0) + 1;
      }
      await sleep(DELAY_MS);
    }
    console.log(`Всего ${users.length}:`, counts);
    if (logIndex !== -1) {
      console.log(`Получили рассылку, а теперь недоступны: ${afterBroadcast.length}`);
      for (const line of afterBroadcast) console.log("  " + line);
    }
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
