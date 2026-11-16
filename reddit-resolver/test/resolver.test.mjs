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

test('unavailable posts keep the warm session and repeated refusals avoid another browser request', async () => {
  const resolver = new RedditResolver(); let calls = 0; let closed = 0;
  resolver.close = async () => { closed++; };
  resolver.resolvePost = async parsed => {
    calls++;
    if (parsed.id === '6rrwyj') throw new Error('REDDIT_POST_UNAVAILABLE');
    return { id: parsed.id };
  };
  await assert.rejects(resolver.resolve(url), /POST_UNAVAILABLE/);
  await assert.rejects(resolver.resolve(url), /POST_UNAVAILABLE/);
  assert.equal(calls, 1); assert.equal(closed, 0); assert.equal(resolver.cooldownUntil, 0);
  assert.equal((await resolver.resolve('https://www.reddit.com/comments/abc123/')).id, 'abc123');
  resolver.refusals.get('6rrwyj').expires = 0;
  await assert.rejects(resolver.resolve(url), /POST_UNAVAILABLE/);
  assert.equal(calls, 3);
});

test('a failed image challenge gets one fresh session within the original request deadline', async () => {
  for (const code of ['REDDIT_IMAGES_TIMEOUT', 'REDDIT_CHALLENGE_REJECTED', 'REDDIT_UNSUPPORTED_CHALLENGE']) {
    const resolver = new RedditResolver(); let calls = 0; let closed = 0; const deadlines = [];
    resolver.close = async () => { closed++; };
    resolver.resolvePost = async (_parsed, _visited, deadline) => {
      deadlines.push(deadline);
      if (++calls === 1) throw new Error(code);
      return { id: '6rrwyj' };
    };
    assert.equal((await resolver.resolve(url)).id, '6rrwyj');
    assert.equal(calls, 2); assert.equal(closed, 1); assert.equal(deadlines[0], deadlines[1]);
  }
});

test('a challenge failure cannot cause unbounded retries', async () => {
  const resolver = new RedditResolver(); let calls = 0;
  resolver.resolvePost = async () => { calls++; throw new Error('REDDIT_IMAGES_TIMEOUT'); };
  await assert.rejects(resolver.resolve(url), /IMAGES_TIMEOUT/);
  assert.equal(calls, 2);
});

test('verified sources are reused without opening the browser and expire normally', async () => {
  const resolver = new RedditResolver(); let sessions = 0;
  resolver.session = async () => { sessions++; throw new Error('test-browser'); };
  const source = { id: '6rrwyj', over_18: false, age_verified: true, title: 'source' };
  resolver.remember('6rrwyj', source);
  source.title = 'caller mutation';
  const result = await resolver.resolvePost({ id: '6rrwyj', url }, new Set(), Date.now() + 1000);
  result.title = 'result mutation';
  assert.equal(resolver.cache.get('6rrwyj').value.title, 'source'); assert.equal(sessions, 0);
  resolver.cache.get('6rrwyj').expires = 0;
  await assert.rejects(resolver.resolvePost({ id: '6rrwyj', url }, new Set(), Date.now() + 1000), /test-browser/);
  assert.equal(sessions, 1);
});

test('a crosspost reuses a verified source without extending its verification lifetime', async () => {
  const resolver = new RedditResolver(); let pages = 0;
  const expires = Date.now() + 30000;
  resolver.remember('abc123', { id: 'abc123', kind: 'photo', age_verified: true, over_18: false,
    image_url: 'https://i.redd.it/example.jpg' }, expires);
  const page = { route: async () => {}, goto: async () => {}, waitForTimeout: async () => {},
    locator: () => ({ count: async () => 1 }), close: async () => {},
    evaluate: async () => ({ matchedPost: true, attributes: { id: 't3_6rrwyj', 'post-type': 'crosspost',
      'content-href': '/r/cats/comments/abc123/' } }) };
  resolver.session = async () => ({ newPage: async () => { pages++; return page; } });
  try {
    const result = await resolver.resolve(url);
    assert.equal(result.source_post_id, 'abc123'); assert.equal(result.id, '6rrwyj');
    assert.equal(result.age_verified, true); assert.equal(pages, 1);
    assert.equal(resolver.cache.get('6rrwyj').expires, expires);
  } finally { await resolver.close(); }
});

test('a second unrelated URL cannot start another browser job in parallel', async () => {
  const resolver = new RedditResolver(); let release;
  resolver.resolvePost = () => new Promise(resolve => { release = resolve; });
  const running = resolver.resolve(url);
  await Promise.resolve();
  await assert.rejects(resolver.resolve('https://www.reddit.com/comments/abc123/'), /BUSY/);
  release({ id: '6rrwyj' }); await running;
});
