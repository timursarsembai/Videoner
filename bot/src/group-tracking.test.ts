import { test } from "node:test";
import assert from "node:assert/strict";
import { resetGroupTracking, trackGroupDownload, trackGroupLink } from "./group-tracking.js";

test("учёт групп: ссылка — не чаще раза в 30 минут, участники — раз в сутки", async () => {
  resetGroupTracking();
  const sent: any[] = [];
  const realFetch = globalThis.fetch;
  globalThis.fetch = (async (url: string, init: any) => {
    sent.push({ url: String(url), body: JSON.parse(init.body) });
    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { "Content-Type": "application/json" } });
  }) as any;
  let counts = 0;
  const tg = { getChatMemberCount: async () => (counts++, 42) } as any;
  const chat = { id: -100777, type: "supergroup", title: "Тест", username: "test_group" } as any;
  try {
    trackGroupLink(tg, chat);
    trackGroupLink(tg, chat);
    trackGroupDownload(chat.id);
    await new Promise((r) => setTimeout(r, 50));
  } finally {
    globalThis.fetch = realFetch;
  }
  const events = sent.filter((s) => s.url.endsWith("/bot-groups/event")).map((s) => s.body);
  assert.equal(events.filter((e) => e.event === "seen").length, 1);
  assert.deepEqual(events.find((e) => e.event === "seen"), {
    chatId: -100777, title: "Тест", type: "supergroup", username: "test_group", event: "seen", members: 42,
  });
  assert.deepEqual(events.find((e) => e.event === "download"), { chatId: -100777, event: "download" });
  assert.equal(counts, 1);
});
