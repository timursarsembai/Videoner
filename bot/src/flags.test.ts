import { test } from "node:test";
import assert from "node:assert/strict";
import { parseFlag, stripFlags } from "./flags.js";

test("flags after a link", () => {
  assert.equal(parseFlag("https://youtu.be/x -audio"), "audio");
  assert.equal(parseFlag("https://youtu.be/x —mp3"), "audio");
  assert.equal(parseFlag("https://youtu.be/x -HD"), "hd");
  assert.equal(parseFlag("-hd https://youtu.be/x -audio"), "audio");
  assert.equal(parseFlag("https://example.com/a-hd"), null);
  assert.equal(parseFlag("https://youtu.be/x?t=-hd"), null);
  assert.equal(parseFlag("смотри https://youtu.be/x"), null);
  assert.equal(stripFlags("https://youtu.be/x -audio").trim(), "https://youtu.be/x");
});
