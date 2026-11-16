import { test } from "node:test";
import assert from "node:assert/strict";
import { formatDownloadNumber } from "./download-number";

test("download number groups digits with no-break spaces", () => {
  assert.equal(formatDownloadNumber(8097), "8 097");
  assert.equal(formatDownloadNumber(12), "12");
  assert.equal(formatDownloadNumber(1234567), "1 234 567");
});
