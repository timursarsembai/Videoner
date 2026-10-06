import { test } from "node:test";
import assert from "node:assert/strict";
import { friendlyError } from "./helpers.js";
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
