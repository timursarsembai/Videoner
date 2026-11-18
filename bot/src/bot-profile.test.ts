import { test } from "node:test";
import assert from "node:assert/strict";
import { botDescription, botShortDescription, contactMessage } from "./bot-profile.js";
import { LANGS } from "./i18n.js";

// Лимиты Telegram: описание до 512, короткое до 120 знаков (UTF-16).
test("описание бота укладывается в лимиты на всех языках", () => {
  for (const lang of LANGS) {
    assert.ok(botDescription(lang).length <= 512, `${lang}: описание ${botDescription(lang).length}`);
    assert.ok(botShortDescription(lang).length <= 120, `${lang}: короткое ${botShortDescription(lang).length}`);
  }
});

test("в описании — сайт на языке человека, канал и контакт; без слов про музыку", () => {
  const ru = botDescription("ru");
  assert.ok(ru.includes("videoner.download/ru/extension"));
  assert.ok(ru.includes("@videonerdownload") && ru.includes("@sarsembai_timur"));
  assert.ok(botDescription("en").includes("🌐 Website: videoner.download\n"));
  for (const lang of LANGS) assert.ok(!/музык|песн|music|song/i.test(botDescription(lang) + botShortDescription(lang)), lang);
});

test("/contact — ник и кнопка", () => {
  const { text, keyboard } = contactMessage("ru");
  assert.equal(text, "✉️ Обратная связь: @sarsembai_timur");
  assert.equal(keyboard.inline_keyboard[0][0].text, "✉️ Написать автору");
});
