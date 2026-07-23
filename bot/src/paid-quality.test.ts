import { test } from "node:test";
import assert from "node:assert/strict";
import { isPaidQuality } from "./paid-quality.js";

// Тот же набор кейсов по смыслу, что в server/src/modules/download/paid-quality.spec.ts
// и web/lib/subscription.test.ts — см. комментарий там про то, почему кейсы
// продублированы буквально, а не импортированы из общего файла.
const cases: [name: string, kind: string, quality: string, available: string[], expected: boolean][] = [
  ["ниже порога — бесплатно", "v", "480", ["480", "720", "1080"], false],
  ["ровно 720p, но есть варианты ниже — платно", "v", "720", ["480", "720", "1080"], true],
  ["ровно 720p — единственный/минимальный вариант — бесплатно", "v", "720", ["720", "1080"], false],
  ["выше 720p — всегда платно, даже если единственный вариант", "v", "1080", ["1080"], true],
  ["выше 720p при наличии более низких вариантов — платно", "v", "1080", ["720", "1080"], true],
  ["нечисловое качество (Facebook hd/sd) — всегда бесплатно", "v", "hd", ["hd", "sd"], false],
  ["720p без информации о доступных качествах — бесплатно (fallback)", "v", "720", [], false],
  ["совсем низкое качество — бесплатно", "v", "144", ["144", "720"], false],
  // Специфично для бота (kind): аудио всегда бесплатно, вне зависимости от "quality".
  ["аудио — всегда бесплатно, каким бы ни было quality", "a", "1080", ["1080"], false],
];

for (const [name, kind, quality, available, expected] of cases) {
  test(`isPaidQuality: ${name}`, () => {
    assert.equal(isPaidQuality(kind, quality, available), expected);
  });
}
