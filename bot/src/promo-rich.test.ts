import { test } from "node:test";
import assert from "node:assert/strict";
import { LANGS } from "./i18n.js";
import { BOT_PROMOS } from "./promo.js";
import { promoHtml, promoKeyboard, promoRichMessage } from "./promo-rich.js";
import { PROMO_RICH_TEXTS } from "./promo-rich-texts.js";

const WITH_BUTTON = new Set(["channel", "extension", "group", "inline", "share"]);

test("подсказки-карточки есть на всех языках и для всех подсказок", () => {
  for (const lang of LANGS) {
    for (const key of BOT_PROMOS) {
      const t = PROMO_RICH_TEXTS[lang]?.[key];
      assert.ok(t?.title.trim(), `${lang}/${key}: нет заголовка`);
      assert.ok(t.body?.trim() || t.before?.trim(), `${lang}/${key}: нет текста`);
      assert.equal(Boolean(t.button?.trim()), WITH_BUTTON.has(key), `${lang}/${key}: кнопка`);
      const html = promoHtml(key, lang)!;
      assert.match(html, /^<h3>/);
      assert.doesNotMatch(html, /\{url\}|без рекламы/i);
      const kb = promoKeyboard(key, lang);
      assert.equal(Boolean(kb), WITH_BUTTON.has(key), `${lang}/${key}: клавиатура`);
    }
  }
});

test("подсказка-карточка: пример в рамке, список, направление текста", () => {
  assert.match(promoHtml("audio", "ru")!, /<pre>https:\/\/youtu\.be\/… -audio<\/pre>/);
  assert.match(promoHtml("extension", "ru")!, /<ul><li>.+<\/li><\/ul>/);
  assert.match(promoHtml("inline", "ru")!, /<p>.+<\/p>\n<pre>@VideonerBot ссылка<\/pre>\n<p>.+<\/p>/);
  assert.equal(promoRichMessage("reddit", "ar")!.is_rtl, true);
  assert.equal("is_rtl" in promoRichMessage("reddit", "ru")!, false);
});

test("подсказка-карточка: кнопки ведут куда нужно", () => {
  const btn = (key: Parameters<typeof promoKeyboard>[0]) => promoKeyboard(key, "en")!.inline_keyboard[0][0] as any;
  assert.equal(btn("channel").url, "https://t.me/videonerdownload");
  assert.equal(btn("extension").url, "https://videoner.download/extension");
  assert.equal(btn("group").url, "https://t.me/VideonerBot?startgroup=true");
  assert.deepEqual(btn("inline").switch_inline_query_chosen_chat, { query: "", allow_user_chats: true, allow_group_chats: true });
  assert.deepEqual(btn("share").copy_text, { text: "https://t.me/VideonerBot" });
});

// Владелец: в подсказках не писать «музыка» и «песни» ни на каком языке.
test("в подсказках нет слов про музыку", () => {
  const banned = /музык|песн|песен|music|musique|música|musica|musik|muziek|muzyk|موسيقى|موسیقی|音乐|音楽|음악|संगीत|🎵/i;
  for (const lang of LANGS) assert.doesNotMatch(JSON.stringify(PROMO_RICH_TEXTS[lang]), banned, lang);
});
