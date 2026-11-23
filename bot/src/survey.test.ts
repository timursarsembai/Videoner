import { test } from "node:test";
import assert from "node:assert/strict";
import { LANGS } from "./i18n.js";
import { SURVEY_TEXTS } from "./survey-texts.js";
import { SURVEY_OPTIONS, surveyKeyboard } from "./survey.js";

test("опрос: тексты на всех языках, кнопки влезают в лимит Telegram", () => {
  for (const lang of LANGS) {
    const t = SURVEY_TEXTS[lang];
    assert.ok(t?.title && t.body && t.done && t.thanks && t.pickOne, `${lang}: не все тексты`);
    for (const o of SURVEY_OPTIONS) assert.ok(t.options[o]?.trim(), `${lang}/${o}`);
    const kb = surveyKeyboard(lang, ["text"]).inline_keyboard;
    assert.equal(kb.length, SURVEY_OPTIONS.length + 1);
    for (const row of kb) for (const b of row) assert.ok(Buffer.byteLength((b as any).callback_data) <= 64);
    assert.match(kb[1][0].text, /^☑️ /);
    assert.doesNotMatch(kb[0][0].text, /^☑️ /);
  }
});
