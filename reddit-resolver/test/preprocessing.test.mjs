import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rgbToPlanar } from '../tile-model.mjs';

test('model input uses RGB channel planes normalized to 0..1', () => {
  assert.deepEqual([...rgbToPlanar(new Uint8Array([255, 128, 0]), 1, 1, 2)],
    [1, 1, 1, 1, ...Array(4).fill(Math.fround(128 / 255)), 0, 0, 0, 0]);
});

test('centre cropping excludes the borders of a non-square image', () => {
  assert.deepEqual([...rgbToPlanar(new Uint8Array([255, 0, 0, 0, 255, 0, 0, 0, 255]), 3, 1, 1)], [0, 1, 0]);
});
