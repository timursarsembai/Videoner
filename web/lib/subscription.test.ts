import { test } from "node:test";
import assert from "node:assert/strict";
import { isPaidVideoQuality } from "./subscription";

// Тот же набор кейсов по смыслу, что в server/src/modules/download/paid-quality.spec.ts
// и bot/src/paid-quality.test.ts — см. комментарий там про то, почему кейсы
// продублированы буквально, а не импортированы из общего файла (три отдельных
// Docker build context, общий файл вне каждого из них не докопируется).
const cases: [name: string, quality: string, available: string[], expected: boolean][] = [
  ["ниже порога — бесплатно", "480", ["480", "720", "1080"], false],
  ["ровно 720p, но есть варианты ниже — платно", "720", ["480", "720", "1080"], true],
  ["ровно 720p — единственный/минимальный вариант — бесплатно", "720", ["720", "1080"], false],
  ["выше 720p — всегда платно, даже если единственный вариант", "1080", ["1080"], true],
  ["выше 720p при наличии более низких вариантов — платно", "1080", ["720", "1080"], true],
  ["нечисловое качество (Facebook hd/sd) — всегда бесплатно", "hd", ["hd", "sd"], false],
  ["720p без информации о доступных качествах — бесплатно (fallback)", "720", [], false],
  ["совсем низкое качество — бесплатно", "144", ["144", "720"], false],
];

for (const [name, quality, available, expected] of cases) {
  test(`isPaidVideoQuality: ${name}`, () => {
    assert.equal(isPaidVideoQuality(quality, available), expected);
  });
}
