import test from "node:test";
import assert from "node:assert/strict";
import { messages } from "./i18n.js";
import { shareLinkFor } from "./share-link.js";

test("подпись без ссылки «Поделиться» осталась прежней", () => {
  const caption = messages.ru.fileCaption("Ролик", "https://youtu.be/x");
  assert.ok(caption.endsWith("Скачано бесплатно через @VideonerBot"));
});

test("ссылка «Поделиться» идёт последней строкой подписи", () => {
  const caption = messages.ru.fileCaption("Ролик", "https://youtu.be/x", "https://videoner.download/b/abc");
  assert.ok(caption.endsWith("\n\n🔗 Поделиться: https://videoner.download/b/abc"));
  assert.ok(messages.en.fileCaption("", "https://youtu.be/x", "https://v.d/b/abc").endsWith("🔗 Share: https://v.d/b/abc"));
});

test("без SHARE_LINK_BASE ссылки нет и сервер не спрашиваем", async () => {
  assert.equal(await shareLinkFor("https://youtu.be/x"), undefined);
});
