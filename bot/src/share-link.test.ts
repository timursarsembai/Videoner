import test from "node:test";
import assert from "node:assert/strict";
import { messages } from "./i18n.js";
import { shareLinkFor } from "./share-link.js";

test("подпись без ссылки «Поделиться» заканчивается каналом новостей", () => {
  const caption = messages.ru.fileCaption("Ролик", "https://youtu.be/x");
  assert.ok(caption.endsWith("Скачано бесплатно через @VideonerBot\n📣 Новости проекта: @videonerdownload"));
});

test("ссылка «Поделиться» идёт последней строкой подписи", () => {
  const caption = messages.ru.fileCaption("Ролик", "https://youtu.be/x", "https://videoner.download/b/abc");
  assert.ok(caption.endsWith("\n\n🔗 Поделиться: https://videoner.download/b/abc"));
  assert.ok(messages.en.fileCaption("", "https://youtu.be/x", "https://v.d/b/abc").endsWith("🔗 Share: https://v.d/b/abc"));
});

test("без SHARE_LINK_BASE ссылки нет и сервер не спрашиваем", async () => {
  assert.equal(await shareLinkFor("https://youtu.be/x"), undefined);
});

test("строка «Поделиться» не выводит подпись за лимит Telegram в 1024 символа", () => {
  const longSource = "https://www.facebook.com/watch?v=1&" + "x".repeat(870);
  const caption = messages.ru.fileCaption("Ролик", longSource, "https://videoner.download/b/abc");
  assert.ok(!caption.includes("Поделиться"));
  assert.equal(caption, messages.ru.fileCaption("Ролик", longSource));
});

test("необязательные строки подписи не выводят её за лимит Telegram", () => {
  const longUrl = "https://www.facebook.com/share/v/" + "x".repeat(870);
  const caption = messages.ru.fileCaption("Ролик", longUrl, "https://videoner.download/b/abc");
  assert.ok(caption.length <= 1024);
  assert.ok(!caption.includes("@videonerdownload"));
  assert.ok(caption.includes(longUrl));
});
