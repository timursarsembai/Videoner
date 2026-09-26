import test from "node:test";
import assert from "node:assert/strict";
import { orderTracks, SUBTITLE_BUTTONS } from "./subtitles.js";

const track = (lang: string, auto = false) => ({ lang, name: lang, auto });

test("русский, английский и казахский — первыми, остальные в порядке площадки", () => {
  const ordered = orderTracks([track("ja"), track("en"), track("de-DE"), track("kk"), track("ru")]);
  assert.deepEqual(ordered.map((t) => t.lang), ["ru", "en", "kk", "ja", "de-DE"]);
});

test("распознанная речь ранжируется по своему языку", () => {
  const ordered = orderTracks([track("ja"), track("ru-orig", true)]);
  assert.deepEqual(ordered.map((t) => t.lang), ["ru-orig", "ja"]);
});

test("кнопок не больше предела", () => {
  const many = Array.from({ length: SUBTITLE_BUTTONS + 5 }, (_, i) => track(`x${i}`));
  assert.equal(orderTracks(many).length, SUBTITLE_BUTTONS);
});

test("исходный список не меняется", () => {
  const source = [track("ja"), track("ru")];
  orderTracks(source);
  assert.deepEqual(source.map((t) => t.lang), ["ja", "ru"]);
});
