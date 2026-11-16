import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parsePost, pageRefusal } from '../post.mjs';

function post(attributes = {}, players = []) {
  return { matchedPost: true, attributes: { id: 't3_6rrwyj', 'post-type': 'video', 'post-title': 'Test',
    'content-href': 'https://v.redd.it/zv89llsvexdz', ...attributes }, players };
}

test('the explicit age gate wins over the generic community-not-found shell', () => {
  assert.equal(pageRefusal('Community not found\nMature Content\nThis page may contain sensitive or adult content that’s not for everyone. To view it, please log in to confirm your age.'), 'REDDIT_ADULT_CONTENT');
  assert.equal(pageRefusal('Community not found'), 'REDDIT_POST_UNAVAILABLE');
  assert.equal(pageRefusal('Prove your humanity'), null);
});

test('only the requested post supplies media', () => {
  assert.throws(() => parsePost(post({ id: 't3_other' }), '6rrwyj'), /POST_MISMATCH/);
  assert.throws(() => parsePost({ matchedPost: false }, '6rrwyj'), /POST_MISMATCH/);
});

test('adult flags on the post or player stop extraction', () => {
  for (const flag of ['nsfw', 'is-nsfw', 'post-is-nsfw']) {
    assert.throws(() => parsePost(post({ [flag]: '' }), '6rrwyj'), /ADULT_CONTENT/);
    assert.throws(() => parsePost(post({}, [{ attributes: { [flag]: '' } }]), '6rrwyj'), /ADULT_CONTENT/);
  }
});

test('DASH manifests handle old and new media filenames without guessing audio URLs', () => {
  const media = parsePost(post(), '6rrwyj');
  assert.equal(media.dash_url, 'https://v.redd.it/zv89llsvexdz/DASHPlaylist.mpd');
  assert.equal(media.over_18, false); assert.equal(media.age_verified, true);
});

test('a crosspost must verify its source before returning any media', () => {
  const media = parsePost(post({ 'content-href': 'https://www.reddit.com/r/videos/comments/abc123/original/' }), '6rrwyj');
  assert.equal(media.kind, 'crosspost');
  assert.equal(media.source_url, 'https://www.reddit.com/r/videos/comments/abc123/original/');
  const relative = parsePost(post({ 'post-type': 'crosspost', 'is-crosspost': '',
    'content-href': '/r/aww/comments/x7xpyo/original/' }), '6rrwyj');
  assert.equal(relative.source_url, 'https://www.reddit.com/r/aww/comments/x7xpyo/original/');
  assert.throws(() => parsePost(post({ 'is-crosspost': '' }), '6rrwyj'), /AGE_UNVERIFIED/);
  assert.throws(() => parsePost(post({ 'post-type': 'crosspost',
    'content-href': '//example.com/comments/x7xpyo/' }), '6rrwyj'), /AGE_UNVERIFIED/);
  assert.throws(() => parsePost(post({ 'post-type': 'crosspost' }), '6rrwyj'), /AGE_UNVERIFIED/);
});

test('single i.redd.it images are photos, unrelated URLs are refused', () => {
  const image = parsePost(post({ 'post-type': 'image', 'content-href': 'https://i.redd.it/abc123.jpg' }), '6rrwyj');
  assert.equal(image.kind, 'photo'); assert.equal(image.image_url, 'https://i.redd.it/abc123.jpg');
  assert.throws(() => parsePost(post({ 'content-href': 'https://127.0.0.1/private' }), '6rrwyj'), /NO_MEDIA/);
});
