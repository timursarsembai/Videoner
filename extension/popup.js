import {
  SITE,
  api,
  formatDuration,
  formatEta,
  formatSize,
  friendlyError,
  getJob,
  isPlatformUrl,
  jobKey,
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

// Ответ /info держим 10 минут: «Скачать ещё» и повторное открытие окошка не
// должны тратить запрос — у расширения на /info строгий лимит.
const INFO_TTL_MS = 10 * 60_000;
const infoKey = (url) => `info:${url}`;

let url = null;
let info = null;

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
  app.replaceChildren(...nodes);
}

function showLoading(text) {
  show(el("div", { class: "row" }, el("div", { class: "spinner" }), el("span", { class: "muted" }, text)));
}

function showMessage(text, { error = false, actions = [] } = {}) {
  show(el("p", { class: `message${error ? " error" : ""}` }, text), ...actions);
}

function siteButton() {
  return el("button", { class: "secondary", onclick: () => chrome.tabs.create({ url: SITE }) }, t.openSite);
}

async function targetUrl() {
  const fromParam = params.get("url");
  if (fromParam) return fromParam;
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab?.url ?? null;
}

async function loadInfo() {
  const cached = (await chrome.storage.session.get(infoKey(url)))[infoKey(url)];
  if (cached && Date.now() - cached.at < INFO_TTL_MS) return cached.info;
  const fresh = await api("/info", { url });
  await chrome.storage.session.set({ [infoKey(url)]: { at: Date.now(), info: fresh } });
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

async function resetJob() {
  await setJob(url, null);
  showChoices();
}

function showProgress(job) {
  const p = job.progress;
  let text;
  let percent = null;
  if (job.state === "starting") {
    text = t.starting;
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
  if (!job) return showChoices();
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
      return showChoices();
  }
}

async function main() {
  url = await targetUrl();
  if (!url || !isPlatformUrl(url)) {
    showMessage(t.notVideoPage, { actions: [siteButton()] });
    return;
  }

  showLoading(t.loading);
  try {
    info = await loadInfo();
  } catch (e) {
    showMessage(friendlyError(e), { error: true, actions: [siteButton()] });
    return;
  }

  render(await getJob(url));

  // Ход скачивания пишет background.js — окошко просто перерисовывается.
  chrome.storage.session.onChanged.addListener((changes) => {
    const change = changes[jobKey(url)];
    if (change) render(change.newValue ?? null);
  });
}

main();
