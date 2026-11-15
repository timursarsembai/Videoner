import { test } from 'node:test';
import assert from 'node:assert/strict';
import { challengeTarget, targetScore, safeRedditPostUrl, tilesForDetections } from '../selection.mjs';

test('only canonical Reddit post paths may reach the browser', () => {
  assert.deepEqual(safeRedditPostUrl('https://www.reddit.com/r/videos/comments/6rrwyj/title/?x=1'),
    { id: '6rrwyj', url: 'https://www.reddit.com/r/videos/comments/6rrwyj/title/' });
  for (const url of ['http://reddit.com/comments/abc/', 'https://reddit.com.evil.test/comments/abc/',
    'https://127.0.0.1/comments/abc/', 'https://reddit.com/r/videos/', 'file:///comments/abc/']) {
    assert.equal(safeRedditPostUrl(url), null);
  }
});

test('unknown visual tasks are never answered blindly', () => {
  assert.equal(challengeTarget('Select all images with\nfire hydrants'), 'fire hydrants');
  assert.equal(challengeTarget('Select all images with\ncrosswalks\nClick verify once there are none left.'), 'crosswalks');
  assert.equal(challengeTarget('Select all handwritten numbers'), null);
  for (const [name, target] of [['a bus', 'buses'], ['buses', 'buses'], ['a bicycle', 'bicycles'],
    ['a motorcycle', 'motorcycles'], ['a traffic light', 'traffic lights'],
    ['a fire hydrant', 'fire hydrants'], ['palm trees', 'palms']]) {
    assert.equal(challengeTarget(`Select all images with ${name}`), target);
  }
});

test('a high-scoring distractor prevents clicking a low-confidence target', () => {
  assert.equal(targetScore([{ label: 'a bicycle', score: 0.1 }, { label: 'a motorcycle', score: 0.7 }], 'bicycles').selected, false);
  assert.equal(targetScore([{ label: 'a bicycle', score: 0.7 }, { label: 'a motorcycle', score: 0.1 }], 'bicycles').selected, true);
  assert.equal(targetScore([{ label: 'a pedestrian crosswalk with white stripes', score: 0.51 },
    { label: 'a car', score: 0.45 }], 'crosswalks').selected, true);
});

test('a whole-image object selects every intersecting square, excluding unrelated objects', () => {
  assert.deepEqual(tilesForDetections([
    { label: 'motorcycle', score: 0.9, box: { xmin: 0.3, ymin: 0.3, xmax: 0.7, ymax: 0.7 } },
    { label: 'bicycle', score: 0.9, box: { xmin: 0, ymin: 0, xmax: 1, ymax: 1 } },
  ], 'motorcycles', 4), [5, 6, 9, 10]);
  assert.equal(tilesForDetections([], 'crosswalks', 4), null);
});
