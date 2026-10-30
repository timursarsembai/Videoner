/* global videonerIsVideoPage, videonerFindPageMedia */
// Кнопка «Скачать» на странице видео. Плавающая, в углу экрана, а не вставка
// рядом с плеером: у одиннадцати площадок своя вёрстка, и вставки ломались бы
// при каждом их редизайне. По клику над кнопкой открывается то же окошко,
// что по значку расширения (popup.html?embed=1), — в рамке, со ссылкой на
// текущее видео.
//
// Всё живёт в закрытом Shadow DOM: стили площадки не достают до кнопки, а
// скрипты площадки — до её содержимого.

(() => {
  if (window.top !== window || window.__videonerButton) return;
  window.__videonerButton = true;

  // Язык — как в окошке (shared.js): выбранный вручную (storage.local,
  // uiLang) или язык браузера. Выбор читается асинхронно, поэтому сначала
  // подпись по браузеру, потом — по выбору.
  const ui = chrome.i18n.getUILanguage().toLowerCase();
  const l = ui.startsWith("uk") ? "uk" : ui.startsWith("ru") ? "ru" : "en";
  const LABELS = { ru: "Скачать", uk: "Завантажити", en: "Download" };
  const HIDES = {
    ru: "Скрыть кнопку для этого видео",
    uk: "Сховати кнопку для цього відео",
    en: "Hide the button for this video",
  };
  const PANEL_WIDTH = 360;

  const host = document.createElement("div");
  host.style.cssText = "all: initial; position: fixed; z-index: 2147483647; right: 20px; bottom: 96px;";
  const root = host.attachShadow({ mode: "closed" });
  // Разметка собирается через createElement, а не innerHTML: YouTube включает
  // Trusted Types, и присваивание HTML-строки там может быть запрещено.
  const style = document.createElement("style");
  style.textContent = `
      :host { all: initial; }
      .wrap { position: relative; font: 14px/1.2 system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; }
      .btn {
        display: flex; align-items: center; gap: 8px;
        padding: 8px 14px 8px 8px; border: none; border-radius: 999px;
        background: #6a65d4; color: #fff; cursor: pointer;
        box-shadow: 0 4px 14px rgba(0, 0, 0, 0.25); font: inherit; font-weight: 600;
      }
      .btn:hover { background: #5a55c4; }
      .btn img { width: 22px; height: 22px; border-radius: 6px; }
      .hide {
        position: absolute; top: -6px; right: -6px; width: 18px; height: 18px;
        border: none; border-radius: 50%; background: #3a3950; color: #fff;
        font: 12px/18px system-ui, sans-serif; text-align: center; cursor: pointer;
        padding: 0; opacity: 0; transition: opacity 0.15s;
      }
      .wrap:hover .hide, .hide:focus-visible { opacity: 1; }
      .panel {
        position: absolute; right: 0; bottom: 52px; width: ${PANEL_WIDTH}px; height: 200px;
        max-height: calc(100vh - 170px); border: none; border-radius: 12px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.35); display: none;
      }
      .panel.open { display: block; }
  `;
  const wrap = document.createElement("div");
  wrap.className = "wrap";
  // Рамка окошка создаётся только на время, пока окошко открыто (openPanel).
  // Вставленная заранее рамка заставляла Chrome проверять политику
  // безопасности страницы при каждом появлении кнопки, и на сайтах с
  // report-only CSP (Threads) в «Ошибки» расширения сыпалось
  // «upgrade-insecure-requests is ignored…» — не наша ошибка, но шум.
  let panel = null;
  const button = document.createElement("button");
  button.className = "btn";
  button.type = "button";
  button.append(document.createElement("img"), document.createElement("span"));
  const hideButton = document.createElement("button");
  hideButton.className = "hide";
  hideButton.type = "button";
  hideButton.textContent = "×";
  wrap.append(button, hideButton);
  root.append(style, wrap);

  button.querySelector("img").alt = "";
  button.querySelector("img").src = chrome.runtime.getURL("icons/icon-48.png");
  function applyLang(code) {
    button.querySelector("span").textContent = LABELS[code];
    hideButton.title = HIDES[code];
    hideButton.setAttribute("aria-label", HIDES[code]);
  }
  applyLang(l);
  chrome.storage.local
    .get("uiLang")
    .then(({ uiLang }) => uiLang in LABELS && applyLang(uiLang))
    .catch(() => {});

  let currentHref = null;
  // Видео, для которого человек скрыл кнопку крестиком: до перехода к другому.
  let hiddenFor = null;

  // Удаляем рамку целиком, а не прячем: закрытое окошко не должно оставаться
  // загруженным и присылать сообщения.
  function closePanel() {
    panel?.remove();
    panel = null;
  }

  function openPanel() {
    panel = document.createElement("iframe");
    panel.className = "panel open";
    panel.title = "Videoner";
    panel.src = chrome.runtime.getURL(`popup.html?embed=1&url=${encodeURIComponent(location.href)}`);
    wrap.prepend(panel);
  }

  button.addEventListener("click", () => {
    if (panel) closePanel();
    else openPanel();
  });

  hideButton.addEventListener("click", () => {
    hiddenFor = location.href;
    closePanel();
    update();
  });

  // Окошко в рамке сообщает свою высоту и просьбу закрыться (см. popup.js).
  // Принимаем только от своей рамки: остальные сообщения страницы не наши.
  window.addEventListener("message", (event) => {
    if (!panel || event.source !== panel.contentWindow || !event.data || event.data.videoner === undefined) return;
    if (event.data.videoner === "height" && Number.isFinite(event.data.height)) {
      panel.style.height = `${Math.ceil(event.data.height)}px`;
    } else if (event.data.videoner === "close") {
      closePanel();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && panel) closePanel();
  });

  function update() {
    const href = location.href;
    if (href !== currentHref) {
      // Перешли к другому видео (на YouTube, TikTok и др. страница при этом
      // не перезагружается) — окошко про прошлое видео больше не к месту.
      currentHref = href;
      closePanel();
      if (hiddenFor && hiddenFor !== href) hiddenFor = null;
    }
    const show = videonerIsVideoPage(href) && hiddenFor !== href && !document.fullscreenElement;
    if (show && !host.isConnected) document.documentElement.append(host);
    if (!show && host.isConnected) host.remove();
  }

  // Скачивание силами браузера (см. page-media.js, background.js). Окошко
  // спрашивает, есть ли на странице готовый mp4; фоновая часть просит скачать
  // его отсюда — запрос со страницы площадки несёт её Referer, без которого
  // CDN TikTok отвечает 403.
  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message?.type === "videoner:media") {
      // Ответ асинхронный: Instagram может спросить API сайта.
      videonerFindPageMedia().then(sendResponse, () => sendResponse(null));
      return true;
    }
    if (message?.type === "videoner:page-fetch") {
      pageFetch(message)
        .then((size) => sendResponse({ ok: true, size }))
        .catch((e) => sendResponse({ ok: false, error: String(e?.message ?? e) }));
      return true;
    }
    return false;
  });

  // Ход сообщаем не чаще раза в полсекунды: чаще окошку не нужно.
  const PROGRESS_EVERY_MS = 500;

  async function pageFetch({ url, filename, jobUrl }) {
    const res = await fetch(url, { credentials: "include" });
    if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);
    const total = Number(res.headers.get("content-length")) || null;
    const reader = res.body.getReader();
    const chunks = [];
    let received = 0;
    let reportedAt = 0;
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
      received += value.length;
      if (Date.now() - reportedAt > PROGRESS_EVERY_MS) {
        reportedAt = Date.now();
        chrome.runtime.sendMessage({ type: "videoner:direct-progress", jobUrl, received, total }).catch(() => {});
      }
    }
    if (!received) throw new Error("empty file");

    // Ссылка на blob страницы с атрибутом download: такой файл браузер
    // сохраняет в «Загрузки» под нашим именем, как обычную загрузку.
    const href = URL.createObjectURL(new Blob(chunks, { type: res.headers.get("content-type") || "video/mp4" }));
    const link = document.createElement("a");
    link.href = href;
    link.download = filename;
    link.click();
    setTimeout(() => URL.revokeObjectURL(href), 60_000);
    return received;
  }

  update();
  // Смена адреса без перезагрузки страницы не порождает общего события, на
  // которое можно положиться на всех площадках, — проще сверять адрес.
  setInterval(update, 1000);
  document.addEventListener("fullscreenchange", update);
})();
