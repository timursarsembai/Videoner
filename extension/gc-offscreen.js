import { remuxLesson } from "./gc-remux.js";

// Скрытая страница расширения (chrome.offscreen, только Chrome): склеивает
// уроки GetCourse (gc-remux.js). Фоновая часть Chrome сама этого не может: у
// неё нет URL.createObjectURL, а без него готовый файл не отдать в
// «Загрузки». В Firefox страница не нужна — см. background.js.

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

async function run({ key, variantUrl }) {
  const { href, size } = await remuxLesson(variantUrl, (progress) => {
    chrome.runtime.sendMessage({ type: "videoner:gc-progress", key, ...progress });
  });
  blobs.set(key, href);
  chrome.runtime.sendMessage({ type: "videoner:gc-done", key, href, size });
}
