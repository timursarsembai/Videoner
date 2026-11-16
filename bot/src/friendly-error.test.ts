import { test } from "node:test";
import assert from "node:assert/strict";
import { extensionLinkFor, extensionPageFor, failedDownloadText, friendlyError, isYoutubeDailyLimitError, siteLinkFor } from "./helpers.js";
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

test("ссылки для файлов больше 2 ГБ ведут к этому видео на сайте и в расширении", () => {
  const url = "https://www.youtube.com/watch?v=abc&t=5";
  assert.equal(siteLinkFor(url, "en"), `https://videoner.download/${url}`);
  assert.equal(siteLinkFor(url, "ru"), `https://videoner.download/ru/${url}`);
  assert.equal(
    extensionPageFor(url, "ru"),
    `https://videoner.download/ru/extension?url=${encodeURIComponent(url)}`,
  );
  assert.equal(extensionPageFor(url, "en"), `https://videoner.download/extension?url=${encodeURIComponent(url)}`);
});

test("отказ по суточному лимиту YouTube переводится и узнаётся", () => {
  const raw = "Daily YouTube limit for your account reached (25 GB per day) — try again later";
  assert.ok(isYoutubeDailyLimitError(raw));
  assert.ok(!isYoutubeDailyLimitError("Daily YouTube limit for your network reached (10 GB per day)"));
  assert.equal(friendlyError(raw, "ru"), messages.ru.errorYoutubeDailyLimit(25));
  assert.ok(friendlyError(raw, "en").includes("25 GB"));
});

test("Instagram ограничил анонимный доступ с нашего адреса — «площадка не отдала», не общий текст", () => {
  // Дословно из логов 05.11.2026.
  const raw =
    "[Instagram] DfVBWzxuw5J: The webpage request was redirected to the login page. You have exceeded the rate-limit for accessing posts anonymously. Use --cookies-from-browser or --cookies for the authentication.";
  assert.equal(friendlyError(raw, "ru"), messages.ru.errorPlatformRefused);
});

test("сервер не получил файл от площадки (403) — честное «площадка не отдала»", () => {
  assert.equal(failedDownloadText("SERVER_BLOCKED", "ru"), messages.ru.errorPlatformRefused);
  assert.equal(failedDownloadText("OTHER", "ru"), messages.ru.downloadFailed);
  assert.equal(failedDownloadText(null, "ru"), messages.ru.downloadFailed);
  assert.equal(friendlyError(messages.ru.errorPlatformRefused, "ru"), messages.ru.errorPlatformRefused);
  assert.equal(friendlyError("ERROR: unable to download video data: HTTP Error 403: Forbidden", "ru"), messages.ru.errorPlatformRefused);
});

test("friendlyError: страница звука Instagram", () => {
  assert.equal(
    friendlyError("Instagram audio page: this link opens a sound page, not a video — send a link to a reel that uses this sound.", "ru"),
    messages.ru.errorInstagramAudioPage,
  );
});

test("friendlyError: контент 18+ и твит без видео — свои тексты, без предложения войти", () => {
  const m = messages.ru;
  assert.equal(
    friendlyError("Adult content (X age-restricted tweet): X hides this tweet from viewers without an account; Videoner does not download 18+ content.", "ru"),
    m.errorTweetAdultHidden,
  );
  assert.equal(
    friendlyError("Adult content: the platform marked this post as 18+; Videoner does not download such content.", "ru"),
    m.errorAdultContent,
  );
  assert.equal(friendlyError("Tweet without video: there is no video in this tweet.", "ru"), m.errorTweetNoVideo);
  assert.equal(
    extensionLinkFor("Adult content (X age-restricted tweet): X hides this tweet from viewers without an account; Videoner does not download 18+ content.", "https://x.com/a/status/1", "ru"),
    null,
  );
});

test("download number line: grouped digits, localized label, nothing for bad input", async () => {
  const { downloadNumberLine } = await import("./helpers.js");
  assert.equal(downloadNumberLine(8097, "ru"), "⬇️ Скачивание №8 097");
  assert.equal(downloadNumberLine(1234567, "en"), "⬇️ Download #1 234 567");
  assert.equal(downloadNumberLine(12, "en"), "⬇️ Download #12");
  assert.equal(downloadNumberLine(null, "ru"), undefined);
  assert.equal(downloadNumberLine(0, "ru"), undefined);
  assert.equal(downloadNumberLine("5", "ru"), undefined);
});

test("file caption ends its main part with the download number", async () => {
  const { messages } = await import("./i18n.js");
  const c = messages.ru.fileCaption("Видео", "https://x.com/a/status/1", undefined, undefined, "⬇️ Скачивание №7");
  assert.ok(c.includes("Скачано бесплатно через @VideonerBot\n⬇️ Скачивание №7"));
  assert.ok(!messages.ru.fileCaption("Видео", "https://x.com/a/status/1").includes("№"));
});

test("promo tips: every language has every bot tip, extension link is localized, ≤200 chars", async () => {
  const { BOT_PROMOS, promoText } = await import("./promo.js");
  const { LANGS } = await import("./i18n.js");
  for (const lang of LANGS) {
    for (const key of BOT_PROMOS) {
      const text = promoText(key, lang);
      assert.ok(text.length > 10 && text.length <= 200, `${lang}.${key}`);
      assert.ok(!text.includes("{url}"), `${lang}.${key}`);
    }
  }
  assert.ok(promoText("extension", "ru").includes("videoner.download/ru/extension"));
  assert.ok(promoText("extension", "en").includes("videoner.download/extension"));
});

test("download number line becomes a hidden link to the stats page", async () => {
  const { numberLinkEntities, downloadNumberLine } = await import("./helpers.js");
  const { messages } = await import("./i18n.js");
  const line = downloadNumberLine(8097, "ru")!;
  const caption = messages.ru.fileCaption("🎬 ⬇️ Видео", "https://x.com/a/status/1", "https://t.me/x", undefined, line);
  const [e] = numberLinkEntities(caption)!;
  assert.equal(caption.slice(e.offset, e.offset + e.length), line);
  assert.equal(e.url, "https://videoner.download/ru/stats");
  const en = messages.en.fileCaption("Video", "https://x.com/a/status/1", undefined, undefined, downloadNumberLine(12, "en"));
  assert.equal(numberLinkEntities(en)![0].url, "https://videoner.download/stats");
  assert.equal(numberLinkEntities(messages.ru.fileCaption("Видео", "https://x.com/a/status/1")), undefined);
  // UTF-16: эмодзи до строки сдвигают смещение на две единицы, как у Telegram.
  const ar = messages.ar.fileCaption("😀😀", "https://x.com/a/status/1", undefined, undefined, downloadNumberLine(5, "ar"));
  const [a] = numberLinkEntities(ar)!;
  assert.equal(ar.slice(a.offset, a.offset + a.length), downloadNumberLine(5, "ar"));
});
