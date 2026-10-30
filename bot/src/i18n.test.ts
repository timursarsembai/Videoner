import { test } from "node:test";
import assert from "node:assert/strict";
import { detectLang, sitePath } from "./i18n.js";
import { fmtSize } from "./helpers.js";

test("picks the language from Telegram's language_code", () => {
  assert.equal(detectLang("uk"), "uk");
  assert.equal(detectLang("UK-ua"), "uk");
  assert.equal(detectLang("ru"), "ru");
  assert.equal(detectLang("de"), "en");
  assert.equal(detectLang(undefined), "en");
});

test("builds site paths and sizes per language", () => {
  assert.equal(sitePath("en", "/extension"), "/extension");
  assert.equal(sitePath("uk", "/extension"), "/uk/extension");
  assert.equal(fmtSize(1.5 * 1024 ** 3, "uk"), "1,5 ГБ");
  assert.equal(fmtSize(10 * 1024 ** 2, "en"), "10 MB");
});
