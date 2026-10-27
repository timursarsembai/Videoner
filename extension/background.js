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
    const job = { url, title, kind, quality, state: "starting", startedAt: Date.now() };
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
  } finally {
    active.delete(url);
  }
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
