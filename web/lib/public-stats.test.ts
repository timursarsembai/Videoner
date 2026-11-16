import { test } from "node:test";
import assert from "node:assert/strict";
import { roundDown } from "./public-stats";

test("rounds down to two significant digits with a plus", () => {
  assert.deepEqual(roundDown(8149), { value: 8100, plus: true });
  assert.deepEqual(roundDown(8100), { value: 8100, plus: false });
  assert.deepEqual(roundDown(316), { value: 310, plus: true });
  assert.deepEqual(roundDown(123456), { value: 120000, plus: true });
  assert.deepEqual(roundDown(99), { value: 99, plus: false });
  assert.deepEqual(roundDown(0), { value: 0, plus: false });
});
