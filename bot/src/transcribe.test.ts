import { test } from "node:test";
import assert from "node:assert/strict";

process.env.ADMIN_TELEGRAM_ID = "466006519";
const { canTranscribe, transcriptFileName } = await import("./transcribe.js");

test("«Текст из видео» — только владельцу и только в личке", () => {
  assert.equal(canTranscribe(466006519, 466006519), true);
  assert.equal(canTranscribe(466006519, -100123), false);
  assert.equal(canTranscribe(1, 1), false);
  assert.equal(canTranscribe(undefined, 1), false);
});

test("имя файла с текстом", () => {
  assert.equal(transcriptFileName("Урок 1: ИИ-агент / Instagram"), "Урок_1_ИИ_агент_Instagram.txt");
  assert.equal(transcriptFileName(""), "text.txt");
  assert.equal(transcriptFileName(undefined), "text.txt");
});
