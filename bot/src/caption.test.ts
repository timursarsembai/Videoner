import { test } from "node:test";
import assert from "node:assert/strict";
import { clip, postDescription, splitTitle } from "./caption.js";
import { messages } from "./i18n.js";

test("description only for social posts", () => {
  assert.equal(postDescription("https://www.instagram.com/reel/x/", " text "), "text");
  assert.equal(postDescription("https://www.youtube.com/watch?v=x", "links…"), undefined);
  assert.equal(postDescription("https://vt.tiktok.com/x/", ""), undefined);
});

test("title and description are not repeated", () => {
  assert.deepEqual(splitTitle("Same #tag", "Same #tag"), { head: "Same #tag" });
  assert.deepEqual(splitTitle("Спб.Сортировочная..", "Спб.Сортировочная..\nХод строительства Всм"), {
    head: "Спб.Сортировочная..",
    extra: "Ход строительства Всм",
  });
  assert.deepEqual(splitTitle("Video by user", "Rain\n#tag"), { head: "Video by user", extra: "Rain\n#tag" });
  assert.equal(clip("a ".repeat(50), 30).endsWith("…"), true);
});

test("caption keeps the post text and stays under 1024", () => {
  const caption = messages.ru.fileCaption("Video by user", "https://www.instagram.com/reel/x/", undefined, "Дождь в горах\n#rain");
  assert.match(caption, /🎬 Video by user\n\nДождь в горах\n#rain\n\nИсточник:/);
  const long = messages.ru.fileCaption("T", "https://www.instagram.com/reel/x/", "https://videoner.download/b/a", "слово ".repeat(400));
  assert.ok(long.length <= 1024);
  assert.ok(long.includes("@videonerdownload"));
});
