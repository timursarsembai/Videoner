import { test } from "node:test";
import assert from "node:assert/strict";
import { getPost, listPosts } from "./posts";
import { GET } from "../../app/api/blog/channel/route";

test("Reddit release draft is excluded from the site and the channel feed", async () => {
  const post = getPost("reddit-bot-site", "ru");
  assert.equal(post, null);
  assert.ok(!listPosts("ru").some(p => p.slug === "reddit-bot-site"));
  const feed = await GET().json();
  assert.ok(!feed.posts.some((p: { slug: string }) => p.slug === "reddit-bot-site"));
  assert.ok(feed.posts.some((p: { slug: string }) => p.slug === "reddit"));
});
