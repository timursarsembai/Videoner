import { test } from "node:test";
import assert from "node:assert/strict";
import { getPost, listPosts } from "./posts";
import { GET } from "../../app/api/blog/channel/route";

test("Reddit release article is available on the site without triggering a channel announcement", async () => {
  const post = getPost("reddit-bot-site", "ru");
  assert.ok(post);
  assert.equal(post.channel, false);
  assert.ok(listPosts("ru").some(p => p.slug === post.slug));
  const feed = await GET().json();
  assert.ok(!feed.posts.some((p: { slug: string }) => p.slug === post.slug));
  assert.ok(feed.posts.some((p: { slug: string }) => p.slug === "reddit"));
});
