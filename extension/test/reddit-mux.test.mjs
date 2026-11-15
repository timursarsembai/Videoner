// Склейка видео и звука Reddit (reddit-mux.js). Запуск: node --test extension/test/reddit-mux.test.mjs
// Файлы fixtures — 2 секунды testsrc и синуса, фрагментированные mp4 из
// ffmpeg (frag_keyframe+empty_moov+default_base_moof), как DASH-файлы Reddit:
// по одной дорожке номер 1 в каждом.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const here = new URL(".", import.meta.url);
vm.runInThisContext(readFileSync(new URL("../reddit-mux.js", here), "utf8"));
const read = (name) => new Uint8Array(readFileSync(new URL(`fixtures/${name}`, here)));

const u32 = (b, at) => ((b[at] << 24) >>> 0) + (b[at + 1] << 16) + (b[at + 2] << 8) + b[at + 3];
const type = (b, at) => String.fromCharCode(...b.subarray(at + 4, at + 8));
function boxes(b, start = 0, end = b.length) {
  const out = [];
  for (let at = start; at + 8 <= end; at += u32(b, at)) out.push({ type: type(b, at), start: at, size: u32(b, at) });
  return out;
}
const children = (b, box) => boxes(b, box.start + 8, box.start + box.size);

test("видео и звук — один mp4 с дорожками 1 и 2", () => {
  const video = read("video.mp4");
  const audio = read("audio.mp4");
  const out = globalThis.videonerMergeFmp4(video, audio, 2);
  const top = boxes(out);
  assert.deepEqual(top.slice(0, 2).map((x) => x.type), ["ftyp", "moov"]);
  assert.ok(!top.some((x) => x.type === "sidx" || x.type === "mfra"));

  const moov = children(out, top[1]);
  const traks = moov.filter((x) => x.type === "trak");
  const ids = traks.map((trak) => {
    const tkhd = children(out, trak).find((x) => x.type === "tkhd");
    return u32(out, tkhd.start + (out[tkhd.start + 8] === 1 ? 28 : 20));
  });
  assert.deepEqual(ids, [1, 2]);
  const mvex = moov.find((x) => x.type === "mvex");
  const trexIds = children(out, mvex).filter((x) => x.type === "trex").map((x) => u32(out, x.start + 12));
  assert.deepEqual(trexIds, [1, 2]);

  // Все кусочки обоих файлов, номера mfhd по порядку, обе дорожки встречаются.
  const moofs = (b) => boxes(b).filter((x) => x.type === "moof");
  const merged = moofs(out);
  assert.equal(merged.length, moofs(video).length + moofs(audio).length);
  const tracks = new Set();
  merged.forEach((moof, i) => {
    const parts = children(out, moof);
    const mfhd = parts.find((x) => x.type === "mfhd");
    assert.equal(u32(out, mfhd.start + 12), i + 1);
    const traf = parts.find((x) => x.type === "traf");
    const tfhd = children(out, traf).find((x) => x.type === "tfhd");
    tracks.add(u32(out, tfhd.start + 12));
  });
  assert.deepEqual([...tracks].sort(), [1, 2]);
});

test("не фрагментированный файл — понятная ошибка", () => {
  assert.throws(() => globalThis.videonerMergeFmp4(new Uint8Array(16), read("audio.mp4"), 0));
});
