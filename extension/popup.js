import { fetchQualities } from "./getcourse-hls.js";
import { mountAccountConnect } from "./account-connect.js";
import { availableUpdate } from "./update-check.js";
import {
  SITE,
  api,
  formatDuration,
  formatEta,
  formatSize,
  friendlyError,
  gcPlayerPrefix,
  getJob,
  isPlatformUrl,
  jobKey,
  sitePath,
  session,
  setJob,
  t,
} from "./shared.js";

// Окошко расширения. Открывается кликом по значку (ссылка — адрес текущей
// вкладки) или кнопкой на странице (ссылка приходит параметром ?url=).
// Само скачивание ведёт background.js, здесь — только выбор и показ хода.

const app = document.getElementById("app");
const params = new URLSearchParams(location.search);
const embedded = params.get("embed") === "1";

// Во встроенном режиме (кнопка на странице, см. content.js) окошко живёт в
// рамке: сообщает ей свою высоту, чтобы рамка была ровно по содержимому, и
// закрывается своим крестиком — клик мимо, как у обычного окошка, тут ничего
// не закрывает. Адресат — "*": домен страницы заранее неизвестен, а кроме
// высоты и просьбы закрыться ничего не уходит.
if (embedded) {
  document.body.classList.add("embed");
  const close = document.getElementById("close");
  close.hidden = false;
  close.addEventListener("click", () => window.parent.postMessage({ videoner: "close" }, "*"));
  new ResizeObserver(() => {
    window.parent.postMessage({ videoner: "height", height: document.documentElement.scrollHeight }, "*");
  }).observe(document.body);
}

// Вкладка и её страница. Firefox даёт окошку в рамке на чужой странице только
// то, что и content script: runtime, storage, i18n — без tabs (проверено
// 29.10.2026). Тогда спрашиваем фоновую часть: она видит, из какой вкладки
// пришло сообщение (background.js, «embed-tab»). В Chrome и в окошке по значку
// tabs есть всегда.
const HAS_TABS = Boolean(chrome.tabs);

async function activeTab() {
  if (!HAS_TABS) return chrome.runtime.sendMessage({ type: "embed-tab" });
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab ?? null;
}

function sendToTab(message, frameId) {
  if (!HAS_TABS) return chrome.runtime.sendMessage({ type: "embed-tab-message", message, frameId });
  return chrome.tabs.sendMessage(tabId, message, frameId === undefined ? undefined : { frameId });
}

function openTab(url) {
  if (HAS_TABS) chrome.tabs.create({ url });
  else window.open(url, "_blank", "noopener");
}

// Ответ /info держим 10 минут: «Скачать ещё» и повторное открытие окошка не
// должны тратить запрос — у расширения на /info строгий лимит.
const INFO_TTL_MS = 10 * 60_000;
const infoKey = (url) => `info:${url}`;

let url = null;
let info = null;
let tabId = null;
// Готовый mp4 на самой странице (page-media.js): тогда первым предлагаем
// скачать его прямо из браузера, а качества сервера — по кнопке.
let media = null;
let serverChoices = false;
// Урок GetCourse: плееры вкладки (getcourse.js), выбранный плеер и его
// качества. Ссылка задачи у урока — getcourse:<хеш видео>.
let tabTitle = null;
let gcPlayers = [];
let gcPlayer = null;
let gcQualities = null;

function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) {
    if (key === "class") node.className = value;
    else if (key.startsWith("on")) node.addEventListener(key.slice(2), value);
    else node.setAttribute(key, value);
  }
  for (const child of children) {
    if (child !== null && child !== undefined) node.append(child);
  }
  return node;
}

function show(...nodes) {
  app.replaceChildren(...nodes.filter((node) => node !== null && node !== undefined));
}

function showLoading(text) {
  show(el("div", { class: "row" }, el("div", { class: "spinner" }), el("span", { class: "muted" }, text)));
}

function showMessage(text, { error = false, actions = [] } = {}) {
  show(el("p", { class: `message${error ? " error" : ""}` }, text), ...actions);
}

function siteButton() {
  return el("button", { class: "secondary", onclick: () => openTab(SITE) }, t.openSite);
}

// Вкладка с видео — активная: и для окошка по значку, и для окошка в рамке
// на самой странице (кнопка на странице открывается только в активной).
async function targetUrl() {
  const tab = await activeTab();
  tabId = tab?.id ?? null;
  // Название вкладки видно только окошку по значку (activeTab); в рамке на
  // плеере его нет.
  tabTitle = tab?.title || null;
  return params.get("url") || tab?.url || null;
}

// Спрашиваем страницу (content.js), есть ли на ней готовый mp4. Нет скрипта
// на странице (не площадка, страницу открыли до установки расширения) — нет
// и прямого пути. Ответ сверяем с адресом: он должен быть про это видео.
async function findMedia() {
  if (tabId === null) return null;
  try {
    const found = await sendToTab({ type: "videoner:media" });
    return found && found.pageUrl === url && found.url ? found : null;
  } catch {
    return null;
  }
}

async function loadInfo() {
  const cached = (await session.get(infoKey(url)))[infoKey(url)];
  if (cached && Date.now() - cached.at < INFO_TTL_MS) return cached.info;
  const fresh = await api("/info", { url });
  await session.set({ [infoKey(url)]: { at: Date.now(), info: fresh } });
  return fresh;
}

function videoCard() {
  const meta = [formatDuration(info.duration), info.uploader].filter(Boolean).join(" · ");
  return el(
    "div",
    { class: "video" },
    info.thumbnail ? el("img", { class: "thumb", src: info.thumbnail, alt: "" }) : null,
    el("div", {}, el("div", { class: "title" }, info.title || url), meta ? el("div", { class: "meta" }, meta) : null)
  );
}

function choice(label, size, onclick) {
  return el(
    "button",
    { class: "choice", onclick },
    el("span", {}, label),
    size ? el("span", { class: "size" }, size) : null
  );
}

function startDownload(kind, quality) {
  chrome.runtime.sendMessage({ type: "download", url, title: info.title, kind, quality });
  showLoading(t.starting);
}

function showChoices() {
  const videoQualities = [...(info.qualities?.video ?? [])].reverse();
  const audio = info.qualities?.audio ?? [];
  const nodes = [videoCard()];

  if (videoQualities.length) {
    // "original" сервер присылает для поста без единого видео: выбирать нечего,
    // снимки забираются в исходном размере.
    const isPhoto = videoQualities.length === 1 && videoQualities[0] === "original";
    nodes.push(el("div", { class: "section-label" }, isPhoto ? t.photo : t.video));
    nodes.push(
      el(
        "div",
        { class: "choices" },
        ...videoQualities.map((q) =>
          choice(q === "original" ? t.photo : q, formatSize(info.sizes?.video?.[q]), () => startDownload("video", q))
        )
      )
    );
  }

  // Как в боте: одна кнопка звука в 128 Кбит/с. У поста из одних фото
  // звуковой дорожки нет — кнопку не показываем.
  if (audio.length) {
    const quality = audio.includes("128Kbps") ? "128Kbps" : audio[0];
    nodes.push(el("div", { class: "spacer" }));
    nodes.push(choice(t.audioOnly, formatSize(info.sizes?.audio?.[quality]), () => startDownload("audio", quality)));
  }

  if (info.subtitles?.length) {
    nodes.push(el("div", { class: "spacer" }));
    nodes.push(choice(t.subtitles, "", showSubtitles));
  }

  show(...nodes);
}

function showSubtitles() {
  const tracks = info.subtitles.map((track) =>
    choice(track.name || track.lang, track.auto ? t.subtitlesAuto : "", async () => {
      showLoading(t.starting);
      const result = await chrome.runtime.sendMessage({ type: "subtitles", url, title: info.title, lang: track.lang });
      if (result?.ok) showMessage(t.done, { actions: [el("button", { class: "secondary", onclick: showChoices }, t.back)] });
      else showMessage(result?.error ?? t.errGeneric, { error: true, actions: [el("button", { class: "secondary", onclick: showChoices }, t.back)] });
    })
  );
  show(
    videoCard(),
    el("div", { class: "section-label" }, t.subtitles),
    el("div", { class: "choices" }, ...tracks),
    el("button", { class: "secondary", onclick: showChoices }, t.back)
  );
}

function startDirectDownload() {
  chrome.runtime.sendMessage({ type: "direct", url, tabId, media });
  showLoading(t.starting);
}

function showDirect() {
  show(
    videoCard(),
    el("button", { class: "primary", onclick: startDirectDownload }, media?.ext === "jpg" ? t.directPhoto : t.directDownload),
    el("div", { class: "note" }, t.directNote),
    el("button", { class: "secondary", onclick: showServerChoices }, t.moreOptions)
  );
}

// Качества сервера — /info. Без прямого пути это обычный экран, с ним —
// по кнопке «Другие качества и звук».
async function showServerChoices() {
  showLoading(t.loading);
  try {
    info = await loadInfo();
  } catch (e) {
    showMessage(friendlyError(e), {
      error: true,
      actions: [media ? el("button", { class: "secondary", onclick: showDirect }, t.back) : siteButton()],
    });
    return;
  }
  serverChoices = true;
  showChoices();
}

// ---- GetCourse ----

// Плееры урока из реестра фоновой части. Каждый переспрашиваем: рамка могла
// исчезнуть (переход к другому уроку), такие из реестра убираем.
async function findGetCoursePlayers() {
  if (tabId === null) return [];
  const prefix = gcPlayerPrefix(tabId);
  const keys = Object.keys(await session.get()).filter((key) => key.startsWith(prefix));
  const answers = await Promise.all(
    keys.map((key) =>
      sendToTab({ type: "videoner:gc-ping" }, Number(key.slice(prefix.length))).catch(() => null)
    )
  );
  const dead = keys.filter((_, i) => !answers[i]?.master);
  if (dead.length) await session.remove(dead);
  // Одно и то же видео, вставленное в урок дважды, — один пункт.
  const byHash = new Map();
  for (const player of answers) if (player?.master && !byHash.has(player.hash)) byHash.set(player.hash, player);
  return [...byHash.values()];
}

function gcTitle(index) {
  const base = tabTitle || t.gcLesson;
  return gcPlayers.length > 1 ? `${base} (${index + 1})` : base;
}

async function openGetCourse(player) {
  gcPlayer = player;
  gcQualities = null;
  url = `getcourse:${player.hash}`;
  info = { title: gcTitle(gcPlayers.indexOf(player)), thumbnail: player.thumbnail, duration: player.duration };
  chrome.runtime.sendMessage({ type: "gc-check", key: url }).catch(() => {});
  render(await getJob(url));
}

function showPlayerList() {
  gcPlayer = null;
  url = null;
  show(
    el("div", { class: "section-label" }, t.gcPick),
    el(
      "div",
      { class: "choices" },
      ...gcPlayers.map((player, index) =>
        choice(t.gcVideo(index + 1), formatDuration(player.duration), () => openGetCourse(player))
      )
    )
  );
}

async function showGcChoices() {
  const back = gcPlayers.length > 1 ? el("button", { class: "secondary", onclick: showPlayerList }, t.back) : null;
  if (!gcQualities) {
    showLoading(t.loading);
    try {
      gcQualities = await fetchQualities(gcPlayer.master);
    } catch (e) {
      console.warn("Videoner: getcourse master", e);
      gcQualities = [];
    }
    // Пока грузились качества, урок могли запустить из другого окошка (кнопка
    // на плеере и значок) — тогда показываем ход, а не выбор.
    const job = await getJob(url);
    if (job) return render(job);
  }
  if (!gcQualities.length) {
    gcQualities = null;
    showMessage(t.gcNoStream, { error: true, actions: back ? [back] : [] });
    return;
  }
  const estimate = (variant) => (variant.bandwidth && info.duration ? (variant.bandwidth * info.duration) / 8 : null);
  show(
    videoCard(),
    el("div", { class: "section-label" }, t.video),
    el(
      "div",
      { class: "choices" },
      ...gcQualities.map((variant) =>
        choice(variant.quality, formatSize(estimate(variant)), () => {
          chrome.runtime.sendMessage({
            type: "gc-download",
            key: url,
            title: info.title,
            quality: variant.quality,
            variantUrl: variant.url,
            master: gcPlayer.master,
          });
          showLoading(t.starting);
        })
      )
    ),
    el("div", { class: "note" }, t.gcNote),
    back
  );
}

function showStart() {
  if (gcPlayer) showGcChoices();
  else if (media && !serverChoices) showDirect();
  else showChoices();
}

async function resetJob() {
  await setJob(url, null);
  showStart();
}

function showProgress(job) {
  const p = job.progress;
  let text;
  let percent = null;
  if (job.state === "starting") {
    text = job.fallback ? t.fallback : t.starting;
  } else if (job.direct && !Number.isFinite(p?.percentage)) {
    // Прямое скачивание без известного размера: процента нет, но идёт.
    text = `${t.downloading}…`;
  } else if (!p) {
    // Статус уже есть, а хода ещё нет — задача ждёт свободного места на
    // сервере (или только что запустилась).
    text = t.waiting;
  } else {
    percent = Math.max(0, Math.min(100, Math.round(p.percentage ?? 0)));
    const eta = formatEta(p.eta);
    text = `${p.phase === "converting" ? t.converting : t.downloading} ${percent}%${eta ? ` · ${t.left(eta)}` : ""}`;
  }
  const bar = el("div", { class: `progress${percent === null ? " indeterminate" : ""}` }, el("div"));
  if (percent !== null) bar.firstChild.style.width = `${percent}%`;
  show(videoCard(), bar, el("div", { class: "muted" }, text));
}

function render(job) {
  if (!job) return showStart();
  switch (job.state) {
    case "starting":
    case "downloading":
      return showProgress(job);
    case "saving":
      return showLoading(t.saving);
    case "done":
      return showMessage(t.done, { actions: [videoCard(), el("button", { class: "primary", onclick: resetJob }, t.again)] });
    case "error":
      return showMessage(job.error || t.errGeneric, {
        error: true,
        actions: [el("button", { class: "primary", onclick: resetJob }, t.retry)],
      });
    default:
      return showStart();
  }
}

async function main() {
  // Ход скачивания пишет background.js — окошко просто перерисовывается.
  session.onChanged(async (changes) => {
    // null — связь с фоновой частью восстановлена (Firefox, см. shared.js):
    // изменения за время разрыва не пришли, перечитываем задачу.
    if (changes === null) {
      if (url) render(await getJob(url));
      return;
    }
    const change = url && changes[jobKey(url)];
    if (change) render(change.newValue ?? null);
  });

  // Вышла новая версия (только сборки для Chromium, см. update-check.js) —
  // строка со ссылкой на инструкцию над основным содержимым.
  void availableUpdate().then((version) => {
    if (!version || embedded) return;
    const box = document.getElementById("update");
    box.replaceChildren(
      document.createTextNode(`${t.updateAvailable(version)} `),
      Object.assign(document.createElement("a"), {
        href: `${SITE}${sitePath("/extension")}#update`,
        target: "_blank",
        textContent: t.updateHow,
      })
    );
    box.hidden = false;
  });

  url = await targetUrl();
  // Кнопка «Подключить аккаунт к боту» — на любой странице площадки, не
  // только на странице видео (account-connect.js).
  if (!embedded && url) mountAccountConnect(document.getElementById("account"), url);
  // Урок GetCourse: школа на своём домене, видео — в плеере GetCourse внутри
  // страницы. Кнопка на самом плеере присылает хеш своего видео (?gc=).
  const gcHash = params.get("gc");
  if (gcHash || !url || !isPlatformUrl(url)) {
    const players = await findGetCoursePlayers();
    gcPlayers = gcHash ? players.filter((player) => player.hash === gcHash) : players;
    if (gcPlayers.length === 1) return openGetCourse(gcPlayers[0]);
    if (gcPlayers.length > 1) return showPlayerList();
    showMessage(t.notVideoPage, { actions: [siteButton()] });
    return;
  }

  media = await findMedia();
  if (media) {
    // Название и обложку берём со страницы — /info не нужен, пока человек не
    // попросит другие качества.
    info = { title: media.title, thumbnail: media.thumbnail, duration: media.duration };
  } else {
    showLoading(t.loading);
    try {
      info = await loadInfo();
    } catch (e) {
      showMessage(friendlyError(e), { error: true, actions: [siteButton()] });
      return;
    }
  }

  render(await getJob(url));
}

main();
