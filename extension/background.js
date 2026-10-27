import { api, downloadStatus, fileUrl, friendlyError, getAllJobs, getJob, safeFileName, setJob } from "./shared.js";

// Фоновая часть: запускает скачивание на сервере, следит за ним и сохраняет
// готовый файл в «Загрузки». Окошко (popup.js) только показывает состояние из
// chrome.storage.session — оно закрывается при любом клике мимо, и держать
// скачивание в нём нельзя.

const POLL_MS = 2_000;
// Предел ожидания готовности. Бот ждёт 45 минут файлы до 2 ГБ; расширению
// сервер разрешает файлы тяжелее (как сайту), поэтому запас — час.
const MAX_WAIT_MS = 60 * 60_000;
// Сколько сбоев связи подряд терпим, прежде чем сдаться.
const MAX_NETWORK_FAILURES = 15;

// Ссылки, за которыми прямо сейчас следит этот экземпляр фоновой части. Не
// даёт запустить второй опрос той же задачи, если окошко прислало команду
// повторно.
const active = new Set();

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type === "download") {
    startDownload(message).catch((e) => console.error("Videoner: download", e));
    sendResponse({ ok: true });
    return false;
  }
  if (message?.type === "direct") {
    startDirect(message).catch((e) => console.error("Videoner: direct", e));
    sendResponse({ ok: true });
    return false;
  }
  if (message?.type === "videoner:direct-progress") {
    directProgress(message);
    return false;
  }
  if (message?.type === "subtitles") {
    // Субтитры сервер готовит за несколько секунд и отдаёт сразу, без
    // отслеживания хода — окошко ждёт ответа.
    downloadSubtitles(message)
      .then(() => sendResponse({ ok: true }))
      .catch((e) => sendResponse({ ok: false, error: friendlyError(e) }));
    return true;
  }
  return false;
});

async function startDownload({ url, title, kind, quality }) {
  if (active.has(url)) return;
  active.add(url);
  try {
    await serverDownload({ url, title, kind, quality });
  } finally {
    active.delete(url);
  }
}

// Скачивание через сервер. extra — дополнительные поля задачи (например,
// пометка, что это запасной путь после неудачи в браузере).
async function serverDownload({ url, title, kind, quality }, extra = {}) {
  const job = { url, title, kind, quality, ...extra, state: "starting", startedAt: Date.now() };
  await setJob(url, job);

  let started;
  try {
    started = await api(`/download/${kind === "audio" ? "audio" : "video"}`, {
      url,
      quality,
      extension: kind === "audio" ? "mp3" : "mp4",
    });
  } catch (e) {
    await setJob(url, { ...job, state: "error", error: friendlyError(e) });
    return;
  }

  await follow({ ...job, state: "downloading", downloadId: started.downloadId });
}

// ---- Скачивание силами браузера (TikTok, Threads — см. page-media.js) ----
//
// Ход прямого скачивания пишут двое: эта функция и сообщения страницы о
// прогрессе. Записи по одной ссылке выстраиваем в очередь, иначе запоздавший
// процент мог бы затереть «готово».
const jobWrites = new Map();

function updateJob(url, mutate) {
  const next = (jobWrites.get(url) ?? Promise.resolve()).then(async () => {
    const job = await getJob(url);
    const updated = mutate(job);
    if (updated !== undefined) await setJob(url, updated);
  });
  jobWrites.set(url, next.catch(() => {}));
  return next;
}

const CHROME_DOWNLOAD_POLL_MS = 1_000;

async function startDirect({ url, tabId, media }) {
  if (active.has(url)) return;
  active.add(url);
  try {
    const title = media.title;
    await updateJob(url, () => ({ url, title, kind: "video", direct: true, state: "downloading", progress: null, startedAt: Date.now() }));

    const filename = `${safeFileName(title)}.mp4`;
    let size;
    try {
      size = media.method === "page-fetch"
        ? await pageFetch(tabId, media.url, filename, url)
        : await chromeDownload(media.url, filename, url);
    } catch (e) {
      console.warn("Videoner: browser download failed, falling back to the server", e);
      await fallbackToServer(url, title);
      return;
    }

    // Отчёт — только для статистики: его сбой не должен портить человеку
    // скачанный файл.
    api("/download/report", { url, fileSize: size, title }).catch((e) => console.warn("Videoner: report", e));
    await updateJob(url, (job) => ({ ...job, state: "done", progress: null }));
  } finally {
    active.delete(url);
  }
}

// TikTok: качает страница (content.js) — её запрос несёт Referer, без
// которого CDN отвечает 403. Отвечает размером скачанного.
async function pageFetch(tabId, mediaUrl, filename, jobUrl) {
  const result = await chrome.tabs.sendMessage(tabId, { type: "videoner:page-fetch", url: mediaUrl, filename, jobUrl });
  if (!result?.ok) throw new Error(result?.error ?? "page fetch failed");
  return result.size;
}

function directProgress({ jobUrl, received, total }) {
  updateJob(jobUrl, (job) => {
    if (!job?.direct || job.state !== "downloading") return undefined;
    const percentage = total ? (received / total) * 100 : null;
    return { ...job, progress: { phase: "downloading", percentage, eta: null, downloaded: received, total } };
  });
}

// Threads: обычная загрузка браузера. Ход — из chrome.downloads.search.
async function chromeDownload(mediaUrl, filename, jobUrl) {
  const id = await chrome.downloads.download({ url: mediaUrl, filename, conflictAction: "uniquify" });
  for (;;) {
    await sleep(CHROME_DOWNLOAD_POLL_MS);
    const [item] = await chrome.downloads.search({ id });
    if (!item) throw new Error("download disappeared");
    if (item.state === "complete") return item.fileSize || item.bytesReceived;
    if (item.state === "interrupted") throw new Error(item.error || "interrupted");
    const total = item.totalBytes > 0 ? item.totalBytes : null;
    directProgress({ jobUrl, received: item.bytesReceived, total });
  }
}

// Не вышло в браузере — тот же ролик через сервер, в лучшем качестве из
// /info (его окошко обычно уже запрашивало — берём из кеша).
async function fallbackToServer(url, title) {
  await updateJob(url, (job) => ({ ...job, state: "starting", direct: false, fallback: true, progress: null }));
  let info;
  try {
    info = await infoFor(url);
  } catch (e) {
    await updateJob(url, (job) => ({ ...job, state: "error", error: friendlyError(e) }));
    return;
  }
  const quality = bestVideoQuality(info.qualities?.video ?? []);
  if (!quality) {
    await updateJob(url, (job) => ({ ...job, state: "error", error: friendlyError({ message: "failed" }) }));
    return;
  }
  // Дождаться очереди записей: иначе поздний процент лёг бы поверх задачи сервера.
  await jobWrites.get(url);
  await serverDownload({ url, title: info.title || title, kind: "video", quality }, { fallback: true });
}

async function infoFor(url) {
  const key = `info:${url}`;
  const cached = (await chrome.storage.session.get(key))[key];
  if (cached?.info) return cached.info;
  const info = await api("/info", { url });
  await chrome.storage.session.set({ [key]: { at: Date.now(), info } });
  return info;
}

// «1080p» > «720p» > …; нечисловые («original», «hd») — в конце, но годятся,
// если других нет.
function bestVideoQuality(qualities) {
  const score = (q) => parseInt(q, 10) || 0;
  return [...qualities].sort((a, b) => score(b) - score(a))[0] ?? null;
}

// Опрос статуса до готовности. Каждый шаг пишет состояние в storage — это же
// вызов API расширения, и Chrome не усыпляет фоновую часть, пока он идёт.
async function follow(job) {
  await setJob(job.url, job);
  let failures = 0;

  while (Date.now() - job.startedAt < MAX_WAIT_MS) {
    await sleep(POLL_MS);

    // Человек мог нажать «Скачать ещё» и сбросить задачу — тогда не мешаем.
    const current = await getJob(job.url);
    if (!current || current.downloadId !== job.downloadId) return;

    let status;
    try {
      status = await downloadStatus(job.downloadId);
      failures = 0;
    } catch (e) {
      if (++failures < MAX_NETWORK_FAILURES) continue;
      await setJob(job.url, { ...job, state: "error", error: friendlyError(e) });
      return;
    }

    if (status.status === "COMPLETED") {
      await setJob(job.url, { ...job, state: "saving", progress: null });
      try {
        await saveFiles(job, status);
        await setJob(job.url, { ...job, state: "done", progress: null });
      } catch (e) {
        console.error("Videoner: save", e);
        await setJob(job.url, { ...job, state: "error", error: friendlyError(e) });
      }
      return;
    }
    if (status.status === "FAILED" || status.status === "EXPIRED") {
      await setJob(job.url, { ...job, state: "error", error: friendlyError({ message: "failed" }) });
      return;
    }

    job = { ...job, progress: status.progress ?? null };
    await setJob(job.url, job);
  }

  await setJob(job.url, { ...job, state: "error", error: friendlyError({ message: "failed" }) });
}

// Пост из нескольких файлов (карусель) приходит списком items, обычное
// скачивание — одним downloadUrl.
async function saveFiles(job, status) {
  const files = status.items?.length > 1
    ? status.items.map((item) => item.filename)
    : [status.downloadUrl ?? status.items?.[0]?.filename];
  const base = safeFileName(job.title);

  for (const [index, file] of files.entries()) {
    if (!file) throw new Error("failed");
    const ext = String(file).split(".").pop();
    const suffix = files.length > 1 ? ` (${index + 1})` : "";
    await chrome.downloads.download({
      url: fileUrl(file),
      filename: `${base}${suffix}.${ext}`,
      conflictAction: "uniquify",
    });
  }
}

async function downloadSubtitles({ url, title, lang }) {
  const { fileName } = await api("/download/subtitles", { url, lang, title });
  await chrome.downloads.download({
    url: fileUrl(fileName),
    filename: `${safeFileName(title)}.${safeFileName(lang, "subtitles")}.srt`,
    conflictAction: "uniquify",
  });
}

// Фоновую часть Chrome может остановить и запустить заново посреди
// скачивания. Подхватываем незаконченные задачи — иначе окошко вечно
// показывало бы застывший процент.
// Остановка посреди сохранения повторит опрос: статус снова скажет «готово»,
// и файл сохранится (в худшем случае — второй копией). Задача, застрявшая на
// запуске, номера скачивания не получила — следить не за чем.
async function resumeJobs() {
  for (const job of await getAllJobs()) {
    if (active.has(job.url)) continue;
    // Прямое скачивание после перезапуска не подхватить: связь со страницей
    // (TikTok) или опрос загрузки (Threads) жили в остановленном экземпляре.
    if (job.direct && job.state === "downloading") {
      await setJob(job.url, { ...job, state: "error", error: friendlyError({ message: "failed" }) });
      continue;
    }
    if (job.state === "starting" && !job.downloadId) {
      await setJob(job.url, { ...job, state: "error", error: friendlyError({ message: "failed" }) });
      continue;
    }
    if ((job.state !== "downloading" && job.state !== "saving") || !job.downloadId) continue;
    active.add(job.url);
    follow({ ...job, state: "downloading" })
      .catch((e) => console.error("Videoner: resume", e))
      .finally(() => active.delete(job.url));
  }
}

resumeJobs();
