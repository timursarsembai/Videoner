import { test } from "node:test";
import assert from "node:assert/strict";
import { Bot } from "grammy";
import type { Update } from "grammy/types";
import { registerGroupHandlers } from "./handlers/group.js";
import { registerAccountHandlers } from "./handlers/accounts.js";
import { registerLanguageHandlers } from "./handlers/language.js";

// Порядок обработчиков в grammY проверяется только живой цепочкой: групповой
// блок (bot.chatType) встаёт в неё в момент создания, и команда, объявленная
// на bot позже, до своего обработчика не доходит — так /settings в группе
// молча терялась. Здесь бот настоящий, а Telegram и сервер подменены.

// Сервера Videoner в тесте нет: запрос настроек падает, и бот берёт настройки
// по умолчанию (так он и должен вести себя при недоступном сервере).

function makeBot() {
  const bot = new Bot("1:test", {
    botInfo: {
      id: 1,
      is_bot: true,
      first_name: "Videoner",
      username: "VideonerBot",
      can_join_groups: true,
      can_read_all_group_messages: true,
      supports_inline_queries: true,
      can_connect_to_business: false,
      has_main_web_app: false,
    } as any,
  });
  const sent: { method: string; payload: any }[] = [];
  bot.api.config.use(async (_prev, method, payload) => {
    sent.push({ method, payload });
    if (method === "getChatMember") {
      return { ok: true, result: { status: "creator", user: { id: 42, is_bot: false, first_name: "A" } } } as any;
    }
    return { ok: true, result: { message_id: 100, date: 0, chat: { id: -100, type: "supergroup" } } } as any;
  });
  // Порядок — как в bot.ts.
  registerAccountHandlers(bot);
  registerLanguageHandlers(bot);
  registerGroupHandlers(bot);
  return { bot, sent };
}

function groupText(text: string): Update {
  return {
    update_id: 1,
    message: {
      message_id: 5,
      date: 0,
      chat: { id: -100, type: "supergroup", title: "Тест" },
      from: { id: 42, is_bot: false, first_name: "A", language_code: "ru" },
      text,
      entities: text.startsWith("/") ? [{ type: "bot_command", offset: 0, length: text.split(" ")[0].length }] : [],
    },
  } as Update;
}

test("/settings в группе доходит до своего обработчика", async () => {
  const { bot, sent } = makeBot();
  await bot.handleUpdate(groupText("/settings@VideonerBot"));
  const reply = sent.find((s) => s.method === "sendMessage");
  assert.ok(reply, "бот должен ответить на /settings");
  assert.match(reply.payload.text, /Настройки бота в этой группе/);
});

test("обычная фраза в группе остаётся без ответа", async () => {
  const { bot, sent } = makeBot();
  await bot.handleUpdate(groupText("всем привет"));
  assert.equal(sent.filter((s) => s.method === "sendMessage").length, 0);
});

test("/connect и /accounts в группе доходят до своих обработчиков", async () => {
  for (const cmd of ["/connect@VideonerBot ABC-234", "/accounts@VideonerBot"]) {
    const { bot, sent } = makeBot();
    await bot.handleUpdate(groupText(cmd));
    assert.ok(sent.some((s) => s.method === "sendMessage"), `бот должен ответить на ${cmd}`);
  }
});

function privateText(text: string): Update {
  return {
    update_id: 2,
    message: {
      message_id: 6,
      date: 0,
      chat: { id: 42, type: "private", first_name: "A" },
      from: { id: 42, is_bot: false, first_name: "A", language_code: "ru" },
      text,
      entities: text.startsWith("/") ? [{ type: "bot_command", offset: 0, length: text.split(" ")[0].length }] : [],
    },
  } as Update;
}

test("в личке код подключения перехватывается, обычный текст идёт дальше", async () => {
  const { bot, sent } = makeBot();
  let passed = false;
  bot.on("message:text", () => {
    passed = true;
  });
  await bot.handleUpdate(privateText("ABC-234"));
  assert.equal(passed, false, "код не должен уйти обработчику ссылок");
  assert.ok(sent.some((s) => s.method === "sendMessage"));
  await bot.handleUpdate(privateText("просто текст"));
  assert.equal(passed, true, "обычный текст должен дойти до обработчика ссылок");
});

test("/language: в группе — язык группы, в личке — свой", async () => {
  {
    const { bot, sent } = makeBot();
    await bot.handleUpdate(groupText("/language@VideonerBot"));
    const reply = sent.find((s) => s.method === "sendMessage");
    assert.match(reply?.payload.text ?? "", /в этой группе/);
    const buttons = reply!.payload.reply_markup.inline_keyboard.flat().map((b: any) => b.callback_data);
    assert.ok(buttons.includes("lg|g|uk") && buttons.includes("lg|g|auto"));
  }
  {
    const { bot, sent } = makeBot();
    await bot.handleUpdate(privateText("/language"));
    const reply = sent.find((s) => s.method === "sendMessage");
    const buttons = reply?.payload.reply_markup.inline_keyboard.flat().map((b: any) => b.callback_data) ?? [];
    assert.ok(buttons.includes("lg|u|uk") && buttons.includes("lg|u|auto"));
  }
});

test("кнопка «Язык» в /settings открывает выбор языка", async () => {
  const { bot, sent } = makeBot();
  await bot.handleUpdate({
    update_id: 3,
    callback_query: {
      id: "c1",
      chat_instance: "x",
      data: "gs|lang",
      from: { id: 42, is_bot: false, first_name: "A", language_code: "ru" },
      message: { message_id: 7, date: 0, chat: { id: -100, type: "supergroup", title: "Тест" }, text: "⚙️" },
    },
  } as Update);
  const edit = sent.find((s) => s.method === "editMessageText");
  assert.match(edit?.payload.text ?? "", /в этой группе/);
});
