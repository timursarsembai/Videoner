import { test } from "node:test";
import assert from "node:assert/strict";
import {
  DEFAULT_GROUP_SETTINGS,
  GroupLimiter,
  SettingsCache,
  isVideoHostUrl,
  nextCaption,
  onlyLinks,
  pickGroupQuality,
} from "./group.js";

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
  assert.equal(pickGroupQuality(["original", "slideshow", "gallery"], {}, limit), "gallery");
  assert.equal(pickGroupQuality(["original"], {}, limit), "original");
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

test("максимальное качество — лучшее из влезающих", () => {
  assert.equal(pickGroupQuality(["1080p", "720p"], {}, 50, "max"), "1080p");
  assert.equal(pickGroupQuality(["1080p", "720p"], { "1080p": 90 }, 50, "max"), "720p");
  assert.equal(pickGroupQuality(["original"], {}, 50, "max"), "original");
});

test("подпись переключается по кругу", () => {
  assert.equal(nextCaption("full"), "short");
  assert.equal(nextCaption("short"), "none");
  assert.equal(nextCaption("none"), "full");
});

test("удаляем только сообщение из одних ссылок", () => {
  const u = "https://vt.tiktok.com/ZSabc/";
  assert.equal(onlyLinks(u, [u]), true);
  assert.equal(onlyLinks(`  ${u}\n`, [u]), true);
  assert.equal(onlyLinks(`(${u}).`, [u]), true);
  assert.equal(onlyLinks(`${u} ${u}2`, [u, `${u}2`]), true);
  assert.equal(onlyLinks(`смотри ${u}`, [u]), false);
  assert.equal(onlyLinks(`${u} 😂`, [u]), false);
});

test("кеш настроек живёт заданное время", () => {
  const cache = new SettingsCache(1000);
  cache.set(1, { ...DEFAULT_GROUP_SETTINGS, deleteLinks: true }, 0);
  assert.equal(cache.get(1, 999)?.deleteLinks, true);
  assert.equal(cache.get(1, 1000), undefined);
  assert.equal(cache.get(2, 0), undefined);
});

test("максимальное качество без известных размеров — не выше 1080p", () => {
  assert.equal(pickGroupQuality(["2160p", "1440p", "1080p", "720p"], {}, 50, "max"), "1080p");
  assert.equal(pickGroupQuality(["2160p", "1080p"], { "1080p": 40 }, 50, "max"), "1080p");
  assert.equal(pickGroupQuality(["2160p", "1440p"], {}, 50, "max"), "1440p");
});
