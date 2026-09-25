// Очередь ссылок: одна ссылка в работе, остальные ждут, и ничто не теряется и
// не качается дважды. Сеть здесь не нужна — модуль чистый (см. queue.ts).
import test from "node:test";
import assert from "node:assert/strict";
import { LinkQueues, QUEUE_LIMIT, extractUrls } from "./queue.js";

const me = { chatId: 1, userId: 7 };
const key = LinkQueues.key(1, 7);

test("первая ссылка начинается сразу, остальные ждут своей очереди", () => {
  const q = new LinkQueues();
  const r = q.enqueue(key, me, ["https://a", "https://b", "https://c"]);
  assert.equal(r.startNow, "https://a");
  assert.equal(r.queued, 2);
  assert.equal(r.waiting, 2);
  assert.deepEqual(q.get(key)?.pending, ["https://b", "https://c"]);
});

test("ссылка, присланная во время работы, встаёт в конец, а не начинается", () => {
  const q = new LinkQueues();
  q.enqueue(key, me, ["https://a"]);
  const r = q.enqueue(key, me, ["https://b"]);
  assert.equal(r.startNow, null);
  assert.equal(r.waiting, 1);
  assert.equal(q.get(key)?.current?.url, "https://a");
});

test("следующая ссылка достаётся только по закрытию текущей и по порядку", () => {
  const q = new LinkQueues();
  q.enqueue(key, me, ["https://a", "https://b", "https://c"]);
  const first = q.get(key)!.current!;
  const second = q.finish(key, first.token);
  assert.equal(second?.url, "https://b");
  assert.equal(second?.phase, "analyzing");
  const third = q.finish(key, second!.token);
  assert.equal(third?.url, "https://c");
  assert.equal(q.finish(key, third!.token), null);
  // Пустая очередь не остаётся висеть в памяти.
  assert.equal(q.get(key), undefined);
});

test("повторное закрытие той же ссылки не выбрасывает следующую", () => {
  // Таймер пропуска и нажатие кнопки могут прийти почти одновременно.
  const q = new LinkQueues();
  q.enqueue(key, me, ["https://a", "https://b", "https://c"]);
  const first = q.get(key)!.current!;
  q.finish(key, first.token);
  assert.equal(q.finish(key, first.token), null);
  assert.equal(q.get(key)?.current?.url, "https://b");
  assert.deepEqual(q.get(key)?.pending, ["https://c"]);
});

test("одну и ту же ссылку второй раз не добавляем", () => {
  const q = new LinkQueues();
  q.enqueue(key, me, ["https://a", "https://b"]);
  const r = q.enqueue(key, me, ["https://a", "https://b", "https://c"]);
  assert.equal(r.duplicates, 2);
  assert.equal(r.queued, 1);
});

test("сверх предела ссылки не принимаем и говорим сколько", () => {
  const q = new LinkQueues();
  const urls = Array.from({ length: QUEUE_LIMIT + 3 }, (_, i) => `https://v/${i}`);
  const r = q.enqueue(key, me, urls);
  assert.equal(r.overLimit, 3);
  assert.equal(1 + q.get(key)!.pending.length, QUEUE_LIMIT);
});

test("у разных людей очереди свои", () => {
  const q = new LinkQueues();
  q.enqueue(key, me, ["https://a"]);
  const other = LinkQueues.key(1, 8);
  const r = q.enqueue(other, { chatId: 1, userId: 8 }, ["https://a"]);
  assert.equal(r.startNow, "https://a");
  assert.equal(r.duplicates, 0);
});

test("сброс по лимиту убирает всё и говорит, сколько ждало", () => {
  const q = new LinkQueues();
  q.enqueue(key, me, ["https://a", "https://b", "https://c"]);
  assert.equal(q.clear(key), 2);
  assert.equal(q.get(key), undefined);
});

test("ссылки достаются из любого текста, без хвостовой пунктуации", () => {
  assert.deepEqual(
    extractUrls("вот: https://youtu.be/abc, и ещё (https://www.tiktok.com/@x/video/1).\nhttps://vk.com/video-1_2"),
    ["https://youtu.be/abc", "https://www.tiktok.com/@x/video/1", "https://vk.com/video-1_2"],
  );
  assert.deepEqual(extractUrls("просто текст"), []);
  // Параметры ссылки не режем — только хвост.
  assert.deepEqual(extractUrls("https://www.youtube.com/watch?v=abc&t=10"), ["https://www.youtube.com/watch?v=abc&t=10"]);
});
