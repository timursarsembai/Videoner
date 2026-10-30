import { test } from "node:test";
import assert from "node:assert/strict";
import { GroupLimiter, isVideoHostUrl, pickGroupQuality } from "./group.js";

test("ссылки с видеоплощадок узнаются, включая поддомены", () => {
  assert.equal(isVideoHostUrl("https://www.youtube.com/watch?v=abc"), true);
  assert.equal(isVideoHostUrl("https://youtu.be/abc"), true);
  assert.equal(isVideoHostUrl("https://vt.tiktok.com/ZSabc/"), true);
  assert.equal(isVideoHostUrl("https://m.vk.com/video1_2"), true);
  assert.equal(isVideoHostUrl("https://x.com/user/status/1"), true);
});

test("прочие ссылки в группе бот не трогает", () => {
  assert.equal(isVideoHostUrl("https://news.example.com/article"), false);
  assert.equal(isVideoHostUrl("https://notyoutube.com/watch?v=abc"), false);
  assert.equal(isVideoHostUrl("https://docs.google.com/document/d/1"), false);
  assert.equal(isVideoHostUrl("не ссылка"), false);
});

test("качество: 720p, если влезает, иначе первое подходящее", () => {
  const limit = 50;
  assert.equal(pickGroupQuality(["1080p", "720p", "360p"], {}, limit), "720p");
  assert.equal(pickGroupQuality(["1080p", "720p", "360p"], { "1080p": 90, "720p": 60 }, limit), "360p");
  assert.equal(pickGroupQuality(["1080p", "480p"], {}, limit), "1080p");
  assert.equal(pickGroupQuality(["1080p"], { "1080p": 90 }, limit), null);
  assert.equal(pickGroupQuality([], {}, limit), null);
});

test("пост из фотографий берётся как есть", () => {
  assert.equal(pickGroupQuality(["original"], {}, 50), "original");
});

test("лимит группы считается за скользящий час и по каждой группе отдельно", () => {
  const limiter = new GroupLimiter(2, 1000);
  assert.equal(limiter.take(1, 0), true);
  assert.equal(limiter.take(1, 10), true);
  assert.equal(limiter.take(1, 20), false);
  assert.equal(limiter.take(2, 20), true);
  // Первая попытка вышла из окна — место освободилось.
  assert.equal(limiter.take(1, 1001), true);
  assert.equal(limiter.take(1, 1002), false);
});
