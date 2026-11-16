import { test } from 'node:test';
import assert from 'node:assert/strict';
import { RedditResolver } from '../resolver.mjs';

const url = 'https://www.reddit.com/r/videos/comments/6rrwyj/';
test('public metadata requests are deduplicated and cache values cannot be mutated by callers', async () => {
  const resolver = new RedditResolver(); let calls = 0;
  resolver.resolvePost = async () => { calls++; return { id: '6rrwyj', title: 'original' }; };
  const [a, b] = await Promise.all([resolver.resolve(url), resolver.resolve(url)]);
  a.title = 'changed';
  assert.equal(b.title, 'original'); assert.equal(calls, 1);
  assert.equal((await resolver.resolve(url)).title, 'original');
});

test('failed browser requests do not get cached and open a cooldown', async () => {
  const resolver = new RedditResolver();
  resolver.resolvePost = async () => { throw new Error('REDDIT_RATE_LIMITED'); };
  await assert.rejects(resolver.resolve(url), /RATE_LIMITED/);
  await assert.rejects(resolver.resolve(url), /BUSY/);
  assert.equal(resolver.cache.size, 0); assert.equal(resolver.pending.size, 0);
});

test('adult refusal does not poison the browser session or cooldown', async () => {
  const resolver = new RedditResolver();
  resolver.resolvePost = async () => { throw new Error('REDDIT_ADULT_CONTENT'); };
  await assert.rejects(resolver.resolve(url), /ADULT_CONTENT/);
  assert.equal(resolver.cooldownUntil, 0);
});

test('a second unrelated URL cannot start another browser job in parallel', async () => {
  const resolver = new RedditResolver(); let release;
  resolver.resolvePost = () => new Promise(resolve => { release = resolve; });
  const running = resolver.resolve(url);
  await Promise.resolve();
  await assert.rejects(resolver.resolve('https://www.reddit.com/comments/abc123/'), /BUSY/);
  release({ id: '6rrwyj' }); await running;
});
