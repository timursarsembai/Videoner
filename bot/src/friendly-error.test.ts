import { test } from "node:test";
import assert from "node:assert/strict";
import { extensionLinkFor, friendlyError } from "./helpers.js";
import { messages } from "./i18n.js";

test("Instagram: пустой ответ — понятный текст, а не сырой yt-dlp", () => {
  // Дословно то, что получил человек 06.10.2026.
  const raw =
    "[Instagram] DeCw3TCIRDE: Instagram sent an empty media response. Check if this post is accessible in your browser without being logged-in. If it is not, then use --cookies-from-browser or --cookies for the authentication.";
  assert.equal(friendlyError(raw, "ru"), messages.ru.errorPlatformRefused);
  assert.equal(friendlyError(raw, "en"), messages.en.errorPlatformRefused);
});

test("антибот-проверка YouTube — не «нужен вход»", () => {
  const raw = "Sign in to confirm you’re not a bot. Use --cookies-from-browser or --cookies";
  assert.equal(friendlyError(raw, "ru"), messages.ru.errorPlatformRefused);
});

test("закрытая запись по-прежнему объясняется как закрытая", () => {
  assert.equal(friendlyError("This video is private", "ru"), messages.ru.errorLoginRequired);
});

test("нераспознанная ошибка — общий текст на языке человека", () => {
  assert.equal(friendlyError("ERROR: something odd happened", "ru"), messages.ru.errorUnknown);
  assert.equal(friendlyError("ERROR: something odd happened", "en"), messages.en.errorUnknown);
});

test("свои переведённые тексты не заменяются", () => {
  assert.equal(friendlyError(messages.ru.downloadTimeout, "ru"), messages.ru.downloadTimeout);
  assert.equal(friendlyError(messages.en.downloadFailed, "en"), messages.en.downloadFailed);
});

test("Threads: пост без видимого медиа — своё объяснение, а не общий текст", () => {
  // Дословно то, что сервер отдаёт по посту DeYFuUkmnev (12.10.2026).
  const raw =
    "[threads] DeYFuUkmnev: No video or photo is visible in this Threads post: it is either a text-only post, or its media is shown only to signed-in users and cannot be downloaded without logging in";
  assert.equal(friendlyError(raw, "ru"), messages.ru.errorThreadsNoMedia);
  assert.equal(friendlyError(raw, "en"), messages.en.errorThreadsNoMedia);
});

test("расширение предлагаем, только где оно качает в браузере и поможет", () => {
  const ig = "https://www.instagram.com/reel/DeCw3TCIRDE/";
  const refused = "Instagram sent an empty media response. Check if this post is accessible in your browser without being logged-in.";
  assert.equal(
    extensionLinkFor(refused, ig, "ru"),
    `https://videoner.download/ru/extension?url=${encodeURIComponent(ig)}`,
  );
  assert.equal(
    extensionLinkFor("This video is private", "https://www.tiktok.com/@a/video/1", "en"),
    `https://videoner.download/extension?url=${encodeURIComponent("https://www.tiktok.com/@a/video/1")}`,
  );
  assert.ok(extensionLinkFor("No video or photo is visible in this Threads post", "https://www.threads.com/@a/post/X", "ru"));
  // YouTube расширение качает тем же сервером — не поможет.
  assert.equal(extensionLinkFor("This video is private", "https://www.youtube.com/watch?v=x", "ru"), null);
  // Региональная блокировка — вход тут ни при чём.
  assert.equal(extensionLinkFor("status code 10231", "https://www.tiktok.com/@a/video/1", "ru"), null);
  // Обычный сбой — не повод.
  assert.equal(extensionLinkFor("ERROR: something odd happened", ig, "ru"), null);
  // Чужой домен, похожий на площадку.
  assert.equal(extensionLinkFor("This video is private", "https://notinstagram.com/reel/x", "ru"), null);
});

test("сторис Instagram — честно: бот их не качает, расширение — да", () => {
  // Дословно из лога 30.10.2026 (ссылка на сторис из группы).
  const raw =
    "[instagram:story] 4019154360952804279: This content is unreachable. Use --cookies-from-browser or --cookies for the authentication.";
  assert.equal(friendlyError(raw, "ru"), messages.ru.errorInstagramStory);
  const url = "https://www.instagram.com/stories/someone/4019154360952804279";
  assert.match(extensionLinkFor(raw, url, "ru") ?? "", /\/ru\/extension\?url=/);
});

test("сторис по ссылке без номера — просим ссылку на конкретную", () => {
  const raw = "[instagram:story] auto.01kk: story link without an id";
  assert.equal(friendlyError(raw, "ru"), messages.ru.errorStoryNeedsId);
});
