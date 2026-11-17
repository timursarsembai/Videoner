import { test } from "node:test";
import { InlineKeyboard } from "grammy";
import assert from "node:assert/strict";
import { cardHtml, cardKeyboard, captionParts, platformName, richVideoFileId } from "./rich-card.js";
import { messages, type Lang } from "./i18n.js";

const card = {
  title: "Ролик <b>&</b>",
  url: "https://www.youtube.com/watch?v=09_3KHDNqx4",
  number: 8216,
  quality: "720p",
  extension: "mp4",
  size: 39123797,
  shareUrl: "https://videoner.download/b/KAzimHJK",
};

test("caption parts exist in every language", () => {
  for (const lang of Object.keys(messages) as Lang[]) {
    const p = captionParts(lang);
    assert.ok(p, lang);
    for (const [k, v] of Object.entries(p)) {
      assert.ok(v.length > 0, `${lang} ${k}`);
      assert.ok(!/SRCURL|SHAREURL|@videonerdownload/.test(v), `${lang} ${k}: ${v}`);
    }
    const html = cardHtml(card, lang);
    assert.ok(html?.includes("8 216"), lang);
  }
});

test("card html escapes and links", () => {
  const html = cardHtml(card, "ru")!;
  assert.ok(html.startsWith('<video src="tg://video?id=video"></video>'));
  assert.ok(html.includes("Ролик &lt;b&gt;&amp;&lt;/b&gt;"));
  assert.ok(html.includes(">№8 216</a>"));
  assert.ok(html.includes("<td>YouTube</td>"));
  assert.ok(html.includes("720p · MP4"));
  assert.ok(cardHtml({ ...card, quality: "original" }, "ru")!.includes("<td>MP4</td>"));
  assert.ok(html.includes("Права на видео принадлежат его автору.<br/>Скачано бесплатно через @VideonerBot"));
});

test("keyboard: news, share, copy; extra first", () => {
  const kb = cardKeyboard(card, "ru")!;
  const flat = kb.inline_keyboard.flat().map((b) => b.text);
  assert.deepEqual(flat, ["📣 Новости проекта", "🔗 Поделиться", "📋 Скопировать ссылку"]);
  const noShare = cardKeyboard({ ...card, shareUrl: undefined }, "ru")!;
  assert.deepEqual(noShare.inline_keyboard.flat().map((b) => b.text), ["📣 Новости проекта"]);
  const mp3 = new InlineKeyboard().text("🎵 MP3", "mp3|x");
  const withExtra = cardKeyboard(card, "ru", mp3)!;
  assert.deepEqual(withExtra.inline_keyboard.map((r) => r.map((b) => b.text)), [
    ["🎵 MP3"],
    ["📣 Новости проекта", "🔗 Поделиться"],
    ["📋 Скопировать ссылку"],
  ]);
});

test("platform names and file id", () => {
  assert.equal(platformName("https://vt.tiktok.com/x"), "TikTok");
  assert.equal(platformName("https://youtu.be/x"), "YouTube");
  assert.equal(platformName("https://example.org/x"), "example.org");
  assert.equal(richVideoFileId({ blocks: [{ type: "paragraph" }, { type: "video", video: { file_id: "F" } }] }), "F");
});
