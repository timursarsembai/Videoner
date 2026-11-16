import { test } from "node:test";
import assert from "node:assert/strict";
import { pickPromo, PROMO_INTERVAL_MS } from "./promo";

const keys = ["a", "b", "c"];

test("no tip before the 3rd download, then at most one a day, each once", () => {
  let s = { count: 0, last: 0, seen: [] as string[] };
  let r = pickPromo(s, keys, 1e12);
  assert.equal(r.key, null);
  r = pickPromo(r.state, keys, 1e12);
  assert.equal(r.key, null);
  r = pickPromo(r.state, keys, 1e12, () => 0);
  assert.equal(r.key, "a");
  r = pickPromo(r.state, keys, 1e12 + 1000, () => 0);
  assert.equal(r.key, null, "same day");
  r = pickPromo(r.state, keys, 1e12 + PROMO_INTERVAL_MS, () => 0);
  assert.equal(r.key, "b", "next day, unseen only");
  s = { ...r.state, seen: keys };
  assert.equal(pickPromo(s, keys, 1e13).key, null, "all seen");
});
