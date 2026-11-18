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

test("пост Threads с записью Instagram: сразу берём саму запись", async () => {
  const { infoWithInstagramFallback } = await import("./helpers.js");
  const asked: string[] = [];
  const got = await infoWithInstagramFallback("https://www.threads.com/share/X", async (u) => {
    asked.push(u);
    if (u.includes("threads")) throw new Error(RAW);
    return { title: "ok" };
  });
  assert.deepEqual(asked, ["https://www.threads.com/share/X", "https://www.instagram.com/p/DQx_1-a/"]);
  assert.deepEqual(got, { info: { title: "ok" }, url: "https://www.instagram.com/p/DQx_1-a/" });

  // Другая ошибка — пробрасываем как есть, второго запроса нет.
  let calls = 0;
  await assert.rejects(
    infoWithInstagramFallback("https://www.threads.com/share/Y", async () => {
      calls++;
      throw new Error("No video or photo is visible in this Threads post");
    }),
    /No video or photo/,
  );
  assert.equal(calls, 1);
});
