import { test } from "node:test";
import assert from "node:assert/strict";
import { friendlyError, instagramAttachmentUrl } from "./helpers.js";
import { LANGS, messages } from "./i18n.js";

const RAW =
  "WARNING: old yt-dlp ERROR: [threads] Instagram attachment of this Threads post is unavailable: https://www.instagram.com/p/DQx_1-a/";

test("Threads с записью Instagram: понятный текст и ссылка для кнопки", () => {
  for (const lang of LANGS) {
    assert.equal(friendlyError(RAW, lang), messages[lang].errorThreadsInstagramAttachment, lang);
    assert.ok(messages[lang].copyInstagramLink.startsWith("📋"), lang);
  }
  assert.equal(instagramAttachmentUrl(RAW), "https://www.instagram.com/p/DQx_1-a/");
  assert.equal(instagramAttachmentUrl("ERROR: something else https://www.instagram.com/p/X/"), null);
  assert.equal(instagramAttachmentUrl("Instagram attachment of this Threads post is unavailable: https://evil.example/p/X/"), null);
});
