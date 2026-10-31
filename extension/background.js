import { checkForUpdate } from "./update-check.js";
import { reportUrl } from "./getcourse-hls.js";
import { remuxLesson } from "./gc-remux.js";
import {
  api,
  downloadStatus,
  fileUrl,
  friendlyError,
  gcPlayerKey,
  gcPlayerPrefix,
  getAllJobs,
  getJob,
  LANG_KEY,
  loadLang,
  safeFileName,
  setJob,
} from "./shared.js";

// Тексты ошибок пишутся здесь и показываются в окошке как есть — поэтому
// язык тот же, что выбран в окошке (shared.js loadLang), и меняется вместе
// с выбором.
void loadLang();
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && LANG_KEY in changes) void loadLang();
});

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

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
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
  // Окошко в рамке на странице в Firefox: без tabs оно не знает своей вкладки
  // и не может спросить её страницу (popup.js, activeTab и sendToTab). Отвечаем
  // только окошку расширения и только про ту вкладку, в которой оно открыто.
  if (message?.type === "embed-tab") {
    if (!isEmbeddedPopup(sender)) return false;
    sendResponse({ id: sender.tab.id, url: sender.tab.url, title: sender.tab.title });
    return false;
  }
  if (message?.type === "embed-tab-message") {
    if (!isEmbeddedPopup(sender)) return false;
    const options = Number.isInteger(message.frameId) ? { frameId: message.frameId } : undefined;
    chrome.tabs.sendMessage(sender.tab.id, message.message, options).then(sendResponse, () => sendResponse(null));
    return true;
  }
  if (message?.type === "embed-storage") {
    if (!isEmbeddedPopup(sender)) return false;
    const area = chrome.storage.session;
    const op =
      message.op === "get" ? area.get(message.keys ?? null)
      : message.op === "set" ? area.set(message.items)
      : message.op === "remove" ? area.remove(message.keys)
      : null;
    if (!op) return false;
    op.then((result) => sendResponse(result ?? {}), () => sendResponse(null));
    return true;
  }
  if (message?.type === "videoner:direct-progress") {
    directProgress(message);
    return false;
  }
  if (message?.type === "videoner:gc-player") {
    // Плеер GetCourse в рамке вкладки (getcourse.js). Ключ на каждую рамку,
    // а не список на вкладку: два плеера урока сообщают о себе одновременно,
    // и общий список терял бы одного из них.
    if (sender.tab?.id !== undefined) {
      chrome.storage.session.set({ [gcPlayerKey(sender.tab.id, sender.frameId)]: message.hash });
    }
    return false;
  }
  if (message?.type === "gc-download") {
    startGetCourse(message).catch((e) => console.error("Videoner: getcourse", e));
    sendResponse({ ok: true });
    return false;
  }
  if (message?.type === "gc-check") {
    checkGetCourse(message.key).catch((e) => console.error("Videoner: getcourse check", e));
    return false;
  }
  // Ход и итог урока принимаем только от своей скрытой страницы.
  if (message?.type?.startsWith("videoner:gc-") && message.type !== "videoner:gc-player" && !isOffscreen(sender)) {
    return false;
  }
  if (message?.type === "videoner:gc-progress") {
    getCourseProgress(message.key, message);
    return false;
  }
  if (message?.type === "videoner:gc-done") {
    getCourseDone(message).catch((e) => console.error("Videoner: getcourse save", e));
    return false;
  }
  if (message?.type === "videoner:gc-failed") {
    console.warn("Videoner: browser download of GetCourse failed, falling back to the server", message.error);
    getCourseFailed(message.key).catch((e) => console.error("Videoner: getcourse fallback", e));
    return false;
  }
  if (message?.type === "playlist") {
    startPlaylist(message).catch((e) => console.error("Videoner: playlist", e));
    sendResponse({ ok: true });
    return false;
  }
  if (message?.type === "playlist-stop") {
    updateJob(playlistKey(message.listId), (job) =>
      job?.state === "playlist" ? { ...job, state: "playlist-stopped", item: null } : undefined,
    );
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

// Изменения storage.session — окошку в рамке Firefox (shared.js, session),
// пока оно открыто.
chrome.runtime.onConnect.addListener((port) => {
  if (port.name !== "embed-storage") return;
  if (!isEmbeddedPopup(port.sender)) {
    port.disconnect();
    return;
  }
  const forward = (changes, area) => {
    if (area === "session") port.postMessage(changes);
  };
  chrome.storage.onChanged.addListener(forward);
  port.onDisconnect.addListener(() => chrome.storage.onChanged.removeListener(forward));
});

function isEmbeddedPopup(sender) {
  return sender.tab?.id !== undefined && sender.url?.startsWith(chrome.runtime.getURL("popup.html"));
}

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
// пометка, что это запасной путь после неудачи в браузере). apiUrl — что
// качать, если это не сама ссылка задачи (у GetCourse ключ задачи — урок, а
// качается адрес его потока).
async function serverDownload({ url, apiUrl, title, kind, quality }, extra = {}) {
  const job = { url, title, kind, quality, ...extra, state: "starting", startedAt: Date.now() };
  await setJob(url, job);

  let started;
  try {
    started = await api(`/download/${kind === "audio" ? "audio" : "video"}`, {
      url: apiUrl ?? url,
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

    // ext — фото-сторис Instagram (page-media.js), остальное — mp4.
    const filename = `${safeFileName(title)}.${media.ext === "jpg" ? "jpg" : "mp4"}`;
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

// ---- GetCourse: урок качает и склеивает браузер (getcourse.js, gc-remux.js) ----
//
// Где склеивается урок, зависит от браузера. В Chrome фоновая часть — service
// worker без URL.createObjectURL, поэтому урок уходит на скрытую страницу
// (chrome.offscreen, gc-offscreen.js) и приходит обратно сообщениями. В
// Firefox скрытых страниц нет, зато фоновая часть — сама страница
// (background.html): урок склеивается прямо здесь.
const OFFSCREEN = Boolean(chrome.offscreen);
// Firefox: уроки, которые склеиваются в этом экземпляре, и готовые файлы,
// ждущие сохранения, — по ключу задачи.
const localLessons = new Set();
const localBlobs = new Map();

// Firefox усыпляет фоновую страницу примерно через 30 секунд без событий, и
// сетевые запросы событием не считаются: урок в 1080p с закрытым окошком
// обрывался посередине (проверено 29.10.2026). Пока урок склеивается, раз в
// несколько секунд пишем метку в storage.session — событие storage.onChanged,
// пришедшее сюда же, продлевает жизнь страницы. Слушатель — на верхнем уровне:
// событие доставляется, только если он есть.
const KEEP_ALIVE_KEY = "keep-alive";
const KEEP_ALIVE_MS = 4_000;
let keepAliveTimer = null;

if (!OFFSCREEN) chrome.storage.onChanged.addListener(() => {});

function keepAlive() {
  if (localLessons.size && !keepAliveTimer) {
    keepAliveTimer = setInterval(() => chrome.storage.session.set({ [KEEP_ALIVE_KEY]: Date.now() }), KEEP_ALIVE_MS);
  } else if (!localLessons.size && keepAliveTimer) {
    clearInterval(keepAliveTimer);
    keepAliveTimer = null;
    chrome.storage.session.remove(KEEP_ALIVE_KEY);
  }
}

chrome.tabs.onRemoved.addListener(async (tabId) => {
  const all = await chrome.storage.session.get(null);
  const keys = Object.keys(all).filter((key) => key.startsWith(gcPlayerPrefix(tabId)));
  if (keys.length) await chrome.storage.session.remove(keys);
});

const OFFSCREEN_URL = "gc-offscreen.html";
const isOffscreen = (sender) => sender.url === chrome.runtime.getURL(OFFSCREEN_URL);

async function hasOffscreen() {
  if (!OFFSCREEN) return false;
  const contexts = await chrome.runtime.getContexts({ contextTypes: ["OFFSCREEN_DOCUMENT"] });
  return contexts.length > 0;
}

// Проверка и создание — внутри одного общего обещания: два урока, запущенные
// подряд, иначе оба увидели бы «страницы нет», и второе создание упало бы.
// Закрывается страница сама, когда у неё не остаётся ни уроков, ни файлов
// (gc-offscreen.js), — фоновая часть её не закрывает и не гоняется с ней.
let offscreenReady = null;

function ensureOffscreen() {
  offscreenReady ??= (async () => {
    if (await hasOffscreen()) return;
    await chrome.offscreen.createDocument({
      url: OFFSCREEN_URL,
      reasons: ["BLOBS"],
      justification: "Join the downloaded pieces of a GetCourse lesson into one mp4 file",
    });
  })().finally(() => {
    offscreenReady = null;
  });
  return offscreenReady;
}

// Страница подтверждает, что взяла урок. Нет ответа — она как раз
// закрывалась: создаём заново и пробуем ещё раз.
async function sendStart(job) {
  for (let attempt = 0; attempt < 2; attempt++) {
    await ensureOffscreen();
    const answer = await chrome.runtime.sendMessage({ target: "gc-offscreen", type: "start", job }).catch(() => null);
    if (answer?.ok) return;
  }
  throw new Error("offscreen did not take the job");
}

const isBrowserGetCourse = (job) => Boolean(job?.gc && job.direct && job.state === "downloading");

async function startGetCourse({ key, title, quality, variantUrl, master }) {
  // Двойной клик: второй запуск не ждёт чтения задачи и отсекается сразу.
  if (localLessons.has(key)) return;
  if (!OFFSCREEN) {
    localLessons.add(key);
    keepAlive();
  }
  const current = await getJob(key);
  if (current && ["starting", "downloading", "saving"].includes(current.state)) {
    if (!OFFSCREEN) {
      localLessons.delete(key);
      keepAlive();
    }
    return;
  }
  await updateJob(key, () => ({
    url: key,
    title,
    kind: "video",
    quality,
    direct: true,
    gc: { master, quality },
    state: "downloading",
    progress: null,
    startedAt: Date.now(),
  }));
  if (!OFFSCREEN) {
    runLocalLesson(key, variantUrl);
    return;
  }
  try {
    await sendStart({ key, variantUrl });
  } catch (e) {
    console.warn("Videoner: offscreen", e);
    await getCourseFailed(key);
  }
}

// Firefox: то же, что делает скрытая страница Chrome, но без сообщений.
async function runLocalLesson(key, variantUrl) {
  try {
    const { href, size } = await remuxLesson(variantUrl, (progress) => getCourseProgress(key, progress));
    localBlobs.set(key, href);
    await getCourseDone({ key, href, size });
  } catch (e) {
    console.warn("Videoner: browser download of GetCourse failed, falling back to the server", e);
    await getCourseFailed(key);
  } finally {
    localLessons.delete(key);
    keepAlive();
  }
}

function getCourseProgress(key, { percentage, eta, downloaded }) {
  updateJob(key, (job) => {
    if (!isBrowserGetCourse(job)) return undefined;
    return { ...job, progress: { phase: "downloading", percentage, eta, downloaded, total: null } };
  });
}

function releaseBlob(key) {
  if (!OFFSCREEN) {
    const href = localBlobs.get(key);
    if (href) URL.revokeObjectURL(href);
    localBlobs.delete(key);
    return;
  }
  chrome.runtime.sendMessage({ target: "gc-offscreen", type: "release", key }).catch(() => {});
}

async function getCourseDone({ key, href, size }) {
  try {
    // Только для урока, который всё ещё качает браузер: если тот уже ушёл на
    // сервер, вторая копия файла не нужна.
    const job = await getJob(key);
    if (!isBrowserGetCourse(job)) return;
    await updateJob(key, (current) => ({ ...current, state: "saving", progress: null }));
    await chromeDownload(href, `${safeFileName(job.title)}.mp4`, key);
    api("/download/report", { url: reportUrl(job.gc.master), fileSize: size, title: job.title }).catch((e) =>
      console.warn("Videoner: report", e)
    );
    await updateJob(key, (current) => ({ ...current, state: "done", progress: null }));
  } catch (e) {
    console.error("Videoner: getcourse save", e);
    await updateJob(key, (current) => ({ ...current, state: "error", error: friendlyError({ message: "failed" }) }));
  } finally {
    releaseBlob(key);
  }
}

// Не вышло в браузере — тот же поток качает сервер (yt-dlp), в том же
// качестве. Подпись потока проверена с чужого IP только на открытом уроке:
// закрытый сервер может и не открыть — тогда честная ошибка. Проверка и
// пометка — в одной записи очереди: два сигнала о сбое подряд не должны
// запустить два скачивания на сервере.
async function getCourseFailed(key) {
  let job = null;
  await updateJob(key, (current) => {
    if (!isBrowserGetCourse(current)) return undefined;
    job = current;
    return { ...current, state: "starting", direct: false, fallback: true, progress: null };
  });
  if (!job) return;
  await jobWrites.get(key);
  await serverDownload(
    { url: key, apiUrl: job.gc.master, title: job.title, kind: "video", quality: job.gc.quality },
    { fallback: true, gc: job.gc }
  );
}

// Сторож: страница могла упасть (например, не хватило памяти на длинный урок
// в 1080p) и больше ничего не прислать. Окошко при открытии просит
// проверить: урок «качается», а страницы нет — отдаём его серверу. В Firefox
// то же самое — урок «качается», а этот экземпляр фоновой части его не ведёт
// (её перезапустили).
async function checkGetCourse(key) {
  const job = await getJob(key);
  if (!isBrowserGetCourse(job)) return;
  const alive = OFFSCREEN ? await hasOffscreen() : localLessons.has(key);
  if (!alive) await getCourseFailed(key);
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

// ---- Плейлисты YouTube ----
//
// Сервер отдаёт список видео (/info/playlist), дальше каждое качается
// обычным серверным скачиванием и сохраняется в «Загрузки» — строго по
// одному. Задача плейлиста живёт под своим ключом (playlist:<id>), отдельно
// от задачи открытого видео. «Остановить» в окошке меняет её состояние, и
// цикл выходит, не дожидаясь текущего файла.

function playlistKey(listId) {
  return `playlist:${listId}`;
}

const playlistRuns = new Set();

async function startPlaylist({ listId, url, mode }) {
  const key = playlistKey(listId);
  if ((await getJob(key))?.state === "playlist") return;
  await setJob(key, { url: key, state: "playlist-loading" });
  let playlist;
  try {
    playlist = await api("/info/playlist", { url });
  } catch (e) {
    await setJob(key, { url: key, state: "error", error: friendlyError(e) });
    return;
  }
  await setJob(key, {
    url: key,
    title: playlist.title,
    state: "playlist",
    // Номер запуска: остановили и тут же запустили снова — старый цикл,
    // ещё ждущий свой файл, видит чужой номер и выходит.
    runId: crypto.randomUUID(),
    playlist: { mode, entries: playlist.entries, index: 0, done: 0, failed: 0 },
    item: null,
  });
  await runPlaylist(key);
}

async function playlistRunning(key, runId) {
  const job = await getJob(key);
  return job?.state === "playlist" && job.runId === runId;
}

async function runPlaylist(key) {
  const first = await getJob(key);
  const runId = first?.runId;
  // Один цикл на запуск: после перезапуска фоновой части resumeJobs зовёт
  // его снова — второй с тем же номером не нужен.
  if (!runId || playlistRuns.has(runId)) return;
  playlistRuns.add(runId);
  const mine = (j) => j?.state === "playlist" && j.runId === runId;
  try {
    for (;;) {
      const job = await getJob(key);
      if (!mine(job)) return;
      const { entries, index } = job.playlist;
      if (index >= entries.length) {
        await updateJob(key, (j) => (mine(j) ? { ...j, state: "playlist-done", item: null } : undefined));
        return;
      }
      const entry = entries[index];
      await updateJob(key, (j) => (mine(j) ? { ...j, item: { title: entry.title, progress: null } } : undefined));
      const result = await downloadPlaylistItem(key, runId, job.playlist.mode, entry).catch((e) => {
        console.error("Videoner: playlist item", entry.url, e);
        // Сервер отказывает всем скачиваниям (лимит трафика YouTube для сети,
        // частота запросов) — следующие видео тоже не пойдут: стоп с причиной.
        if (e?.status === 403 || e?.status === 429) return { fatal: friendlyError(e) };
        return false;
      });
      if (result === "stopped") return;
      if (result?.fatal) {
        await updateJob(key, (j) => (mine(j) ? { ...j, state: "error", error: result.fatal, item: null } : undefined));
        return;
      }
      await updateJob(key, (j) =>
        mine(j)
          ? {
              ...j,
              playlist: {
                ...j.playlist,
                index: index + 1,
                done: j.playlist.done + (result ? 1 : 0),
                failed: j.playlist.failed + (result ? 0 : 1),
              },
            }
          : undefined,
      );
    }
  } finally {
    playlistRuns.delete(runId);
  }
}

// true — сохранено, false — не вышло (идём дальше), "stopped" — остановлено.
async function downloadPlaylistItem(key, runId, mode, entry) {
  const audio = mode === "audio";
  // Сведения о каждом видео не запрашиваем (/info дорогой и под строгим
  // лимитом): качество передаём сразу, сервер возьмёт ближайшее не выше.
  const quality = audio ? "128Kbps" : mode === "hd" ? "2160p" : "720p";
  if (!(await playlistRunning(key, runId))) return "stopped";
  const start = (q) =>
    api(`/download/${audio ? "audio" : "video"}`, { url: entry.url, quality: q, extension: audio ? "mp3" : "mp4" });
  let started;
  try {
    started = await start(quality);
  } catch (e) {
    // Лучшее качество тяжелее предела сервера — тогда 720p.
    if (mode !== "hd" || !/too large/i.test(e?.message ?? "")) throw e;
    started = await start("720p");
  }
  const startedAt = Date.now();
  let failures = 0;
  while (Date.now() - startedAt < MAX_WAIT_MS) {
    await sleep(POLL_MS);
    if (!(await playlistRunning(key, runId))) return "stopped";
    let status;
    try {
      status = await downloadStatus(started.downloadId);
      failures = 0;
    } catch (e) {
      if (++failures >= MAX_NETWORK_FAILURES) return false;
      continue;
    }
    if (status.status === "COMPLETED") {
      await saveFiles({ title: entry.title || "video" }, status);
      return true;
    }
    if (status.status === "FAILED" || status.status === "EXPIRED") return false;
    await updateJob(key, (j) =>
      j?.state === "playlist" && j.runId === runId
        ? { ...j, item: { title: entry.title, progress: status.progress ?? null } }
        : undefined,
    );
  }
  return false;
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
  const offscreenAlive = await hasOffscreen();
  for (const job of await getAllJobs()) {
    // Плейлист продолжаем с того видео, на котором остановились.
    if (job.playlist && job.state === "playlist") {
      void runPlaylist(job.url);
      continue;
    }
    // Остановились посреди получения списка — список уже не придёт.
    if (job.state === "playlist-loading") {
      await setJob(job.url, { ...job, state: "error", error: friendlyError({ message: "failed" }) });
      continue;
    }
    if (active.has(job.url)) continue;
    // Урок GetCourse в Chrome качает скрытая страница, а не этот экземпляр:
    // жива она — её сообщения подхватит и новый. В Firefox урок жил в
    // остановленном экземпляре — ниже он станет ошибкой.
    if (job.gc && job.direct && job.state === "downloading" && offscreenAlive) continue;
    // Прямое скачивание после перезапуска не подхватить: связь со страницей
    // (TikTok) или опрос загрузки (Threads) жили в остановленном экземпляре.
    if (job.direct && (job.state === "downloading" || job.state === "saving")) {
      await setJob(job.url, { ...job, state: "error", error: friendlyError({ message: "failed" }) });
      if (job.gc) releaseBlob(job.url);
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

// Новая версия на сайте — отметка NEW на значке (update-check.js). При запуске
// браузера и после установки или обновления самого расширения.
chrome.runtime.onStartup.addListener(() => void checkForUpdate());
chrome.runtime.onInstalled.addListener(() => void checkForUpdate({ force: true }));
