import { test } from "node:test";
import assert from "node:assert/strict";
import { getPost, listPosts } from "./posts";
import { GET } from "../../app/api/blog/channel/route";

// Статья о Reddit в боте и на сайте опубликована 16.11.2026 по решению
// владельца (раньше была черновиком в docs/drafts): она есть на сайте и в
// ленте для канала, рядом со вчерашней статьёй о расширении.
test("Reddit bot/site article is published on the site and in the channel feed", async () => {
  const post = getPost("reddit-bot-site", "ru");
  assert.ok(post);
  assert.equal(post.channel, true);
  assert.ok(listPosts("ru").some(p => p.slug === "reddit-bot-site"));
  const feed = await GET().json();
  assert.ok(feed.posts.some((p: { slug: string }) => p.slug === "reddit-bot-site"));
  assert.ok(feed.posts.some((p: { slug: string }) => p.slug === "reddit"));
});

test("every language has the Reddit bot/site article", () => {
  for (const lang of ["en", "kk", "ky", "ar", "zh"] as const) {
    assert.ok(getPost("reddit-bot-site", lang), lang);
  }
});
