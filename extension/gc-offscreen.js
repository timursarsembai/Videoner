/* global muxjs */
import { fetchSegments } from "./getcourse-hls.js";

// Скрытая страница расширения (chrome.offscreen): качает урок GetCourse по
// кусочкам и склеивает их в mp4. Фоновая часть сама этого не может: у неё нет
// URL.createObjectURL, а без него готовый файл не отдать в «Загрузки».
//
// Кусочки — MPEG-TS; mux.js перекладывает их в фрагментированный mp4 без
// перекодирования. Файл копится в памяти до конца и сохраняется целиком —
// сорок минут в 1080p это около гигабайта.

// Кусочков в работе одновременно: по одному сорокаминутный урок (~700
// кусочков по 3 секунды) качался бы долго, а больше — без толку для CDN.
const CONCURRENCY = 6;
const RETRIES = 3;
const PROGRESS_EVERY_MS = 1_000;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Готовые файлы ждут, пока фоновая часть сохранит их в «Загрузки».
const blobs = new Map();
let running = 0;
let closing = false;

// Нечего качать и нечего отдавать — закрываемся сами и освобождаем память.
// Фоновая часть страницу не закрывает: так она не убьёт урок, который
// только что сюда пришёл.
function closeIfIdle() {
  if (running || blobs.size) return;
  closing = true;
  window.close();
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.target !== "gc-offscreen") return false;
  if (message.type === "start") {
    // Уже закрываемся — не отвечаем: фоновая часть создаст страницу заново.
    if (closing) return false;
    running++;
    run(message.job)
      .catch((e) => {
        chrome.runtime.sendMessage({ type: "videoner:gc-failed", key: message.job.key, error: String(e?.message ?? e) });
      })
      .finally(() => {
        running--;
        closeIfIdle();
      });
    sendResponse({ ok: true });
  } else if (message.type === "release") {
    const href = blobs.get(message.key);
    if (href) URL.revokeObjectURL(href);
    blobs.delete(message.key);
    closeIfIdle();
  }
  return false;
});

async function fetchSegment(url, signal) {
  for (let attempt = 0; ; attempt++) {
    try {
      const res = await fetch(url, { credentials: "omit", signal });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return new Uint8Array(await res.arrayBuffer());
    } catch (e) {
      if (signal.aborted || attempt >= RETRIES) throw e;
      await sleep(1_000 * (attempt + 1));
    }
  }
}

// mux.js пишет в заголовок фрагментированного mp4 длительность «неизвестна»
// (0xFFFFFFFF): плееры, которые верят заголовку, показали бы у 35-минутного
// урока 13 часов (0xFFFFFFFF / 90 000). Вписываем настоящую — из плейлиста —
// в mvhd, tkhd и mdhd, каждую в шкале своего бокса.
const CONTAINERS = new Set(["moov", "trak", "mdia"]);

function setDurations(init, seconds) {
  if (!(seconds > 0)) return;
  const view = new DataView(init.buffer, init.byteOffset, init.byteLength);
  const type = (at) => String.fromCharCode(init[at + 4], init[at + 5], init[at + 6], init[at + 7]);
  let movieTimescale = 0;

  // mux.js пишет боксы версии 0 (поля по 4 байта); версию 1 не трогаем.
  const walk = (start, end) => {
    for (let at = start; at + 8 <= end; ) {
      const size = view.getUint32(at);
      if (size < 8 || at + size > end) return;
      const name = type(at);
      const version = view.getUint8(at + 8);
      if (version === 0) {
        if (name === "mvhd") {
          movieTimescale = view.getUint32(at + 20);
          view.setUint32(at + 24, Math.min(Math.round(seconds * movieTimescale), 0xfffffffe));
        } else if (name === "tkhd" && movieTimescale) {
          view.setUint32(at + 28, Math.min(Math.round(seconds * movieTimescale), 0xfffffffe));
        } else if (name === "mdhd") {
          const timescale = view.getUint32(at + 20);
          view.setUint32(at + 24, Math.min(Math.round(seconds * timescale), 0xfffffffe));
        }
      }
      if (CONTAINERS.has(name)) walk(at + 8, at + size);
      at += size;
    }
  };
  walk(0, init.byteLength);
}

async function run({ key, variantUrl }) {
  const { segments, duration } = await fetchSegments(variantUrl);
  const controller = new AbortController();
  const parts = [];
  let size = 0;

  const transmuxer = new muxjs.mp4.Transmuxer({ remux: true });
  transmuxer.on("data", (segment) => {
    // Заголовок файла (initSegment) приходит с каждой порцией — нужен один.
    if (!parts.length) {
      setDurations(segment.initSegment, duration);
      parts.push(segment.initSegment);
      size += segment.initSegment.byteLength;
    }
    parts.push(segment.data);
    size += segment.data.byteLength;
  });

  // Окно из CONCURRENCY запросов вперёд, а склейка — строго по порядку.
  const inFlight = [];
  const launch = (i) => {
    inFlight[i] = fetchSegment(segments[i], controller.signal);
    // Ошибку заберёт await ниже; без этого она всплыла бы как необработанная.
    inFlight[i].catch(() => {});
  };
  for (let i = 0; i < Math.min(CONCURRENCY, segments.length); i++) launch(i);

  const startedAt = Date.now();
  let reportedAt = 0;
  try {
    for (let i = 0; i < segments.length; i++) {
      const bytes = await inFlight[i];
      inFlight[i] = null;
      if (i + CONCURRENCY < segments.length) launch(i + CONCURRENCY);
      transmuxer.push(bytes);
      transmuxer.flush();

      if (Date.now() - reportedAt > PROGRESS_EVERY_MS) {
        reportedAt = Date.now();
        const done = i + 1;
        const perSegment = (Date.now() - startedAt) / done;
        chrome.runtime.sendMessage({
          type: "videoner:gc-progress",
          key,
          percentage: (done / segments.length) * 100,
          eta: ((segments.length - done) * perSegment) / 1000,
          downloaded: size,
        });
      }
    }
  } catch (e) {
    controller.abort();
    throw e;
  }
  if (!size) throw new Error("empty file");

  const href = URL.createObjectURL(new Blob(parts, { type: "video/mp4" }));
  blobs.set(key, href);
  chrome.runtime.sendMessage({ type: "videoner:gc-done", key, href, size });
}
