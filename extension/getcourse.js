// Плеер урока GetCourse. Страница школы — на её собственном домене, а плеер —
// iframe `…/sign-player/?json=…` на доменах GetCourse, одних для всех школ:
// этот скрипт работает только в нём (manifest.json), поэтому расширению не
// нужен доступ ко всем сайтам.
//
// В странице плеера лежат его настройки (window.configs): адрес HLS-потока
// masterPlaylistUrl, превью, длительность. Скрипт сообщает о плеере фоновой
// части — окошко по значку покажет все плееры вкладки (в уроке их бывает
// несколько) — и ставит в углу плеера свою кнопку «Скачать». Сам поток качает
// и склеивает в mp4 браузер (background.js, gc-offscreen.js) — со входом
// ученика, и сервер урок не видит.
//
// Разобрано 29.10.2026 на открытой странице formfactor.getcourse.ru/materials:
// поток без шифрования, видео и звук в одних кусочках .ts (H.264 + AAC), у
// плейлистов и кусочков Access-Control-Allow-Origin: *.

(() => {
  if (window.__videonerGetCourse) return;
  window.__videonerGetCourse = true;

  const player = readPlayer();
  if (!player) return;

  // Окошко спрашивает, жив ли плеер и что в нём, — по frameId из реестра
  // фоновой части.
  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message?.type !== "videoner:gc-ping") return false;
    sendResponse(player);
    return false;
  });
  chrome.runtime.sendMessage({ type: "videoner:gc-player", hash: player.hash }).catch(() => {});

  addButton();

  // Настройки плеера — JSON в строке `window.configs = {…}` встроенного
  // скрипта. Переменную страницы content script не видит (у него свой мир),
  // текст скрипта — видит.
  function readPlayer() {
    for (const script of document.querySelectorAll("script:not([src])")) {
      const text = script.textContent;
      const at = text.indexOf("window.configs");
      if (at === -1) continue;
      const start = text.indexOf("{", at);
      const end = start === -1 ? -1 : objectEnd(text, start);
      if (end === -1) continue;
      let configs;
      try {
        configs = JSON.parse(text.slice(start, end + 1));
      } catch {
        continue;
      }
      if (typeof configs?.masterPlaylistUrl !== "string" || !configs.masterPlaylistUrl.startsWith("https://")) continue;
      return {
        hash: String(configs.videoHash ?? configs.masterPlaylistUrl),
        master: configs.masterPlaylistUrl,
        thumbnail: typeof configs.previewUrl === "string" ? configs.previewUrl : null,
        duration: Number(configs.videoDuration) || null,
      };
    }
    return null;
  }

  // Конец JSON-объекта, начатого в start: считаем скобки, пропуская строки.
  // «До последней }» в скрипте не годится — после настроек может идти код.
  function objectEnd(text, start) {
    let depth = 0;
    let inString = false;
    for (let i = start; i < text.length; i++) {
      const c = text[i];
      if (inString) {
        if (c === "\\") i++;
        else if (c === '"') inString = false;
      } else if (c === '"') inString = true;
      else if (c === "{") depth++;
      else if (c === "}" && --depth === 0) return i;
    }
    return -1;
  }

  // Кнопка в правом верхнем углу плеера: снизу у него свои кнопки. По клику
  // над плеером открывается то же окошко, что по значку расширения, в рамке.
  // Всё в закрытом Shadow DOM, как кнопка на страницах площадок (content.js).
  function addButton() {
    const ui = chrome.i18n.getUILanguage().toLowerCase();
    const l = ui.startsWith("uk") ? "uk" : ui.startsWith("ru") ? "ru" : "en";
    // Язык — как в content.js: сначала по браузеру, потом по выбору в окошке.
    const LABELS = { ru: "Скачать", uk: "Завантажити", en: "Download" };
    const HIDES = { ru: "Скрыть кнопку", uk: "Сховати кнопку", en: "Hide the button" };
    const PANEL_WIDTH = 340;

    const host = document.createElement("div");
    host.style.cssText = "all: initial; position: fixed; z-index: 2147483647; right: 10px; top: 10px;";
    const root = host.attachShadow({ mode: "closed" });
    const style = document.createElement("style");
    style.textContent = `
      :host { all: initial; }
      .wrap { position: relative; font: 13px/1.2 system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; }
      .btn {
        display: flex; align-items: center; gap: 6px; margin-left: auto;
        padding: 5px 11px 5px 5px; border: none; border-radius: 999px;
        background: #6a65d4; color: #fff; cursor: pointer; opacity: 0.85;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3); font: inherit; font-weight: 600;
      }
      .btn:hover, .btn:focus-visible { opacity: 1; background: #5a55c4; }
      .btn img { width: 18px; height: 18px; border-radius: 5px; }
      .hide {
        position: absolute; top: -5px; left: -5px; width: 16px; height: 16px;
        border: none; border-radius: 50%; background: #3a3950; color: #fff;
        font: 11px/16px system-ui, sans-serif; text-align: center; cursor: pointer;
        padding: 0; opacity: 0; transition: opacity 0.15s;
      }
      .wrap:hover .hide, .hide:focus-visible { opacity: 1; }
      .panel {
        position: absolute; right: 0; top: 36px; width: min(${PANEL_WIDTH}px, calc(100vw - 20px));
        height: 200px; max-height: calc(100vh - 56px); border: none; border-radius: 12px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.35); display: none;
      }
      .panel.open { display: block; }
    `;
    const wrap = document.createElement("div");
    wrap.className = "wrap";
    const button = document.createElement("button");
    button.className = "btn";
    button.type = "button";
    const icon = document.createElement("img");
    icon.alt = "";
    icon.src = chrome.runtime.getURL("icons/icon-32.png");
    const label = document.createElement("span");
    label.textContent = LABELS[l];
    button.append(icon, label);
    const hideButton = document.createElement("button");
    hideButton.className = "hide";
    hideButton.type = "button";
    hideButton.textContent = "×";
    const applyHide = (code) => {
      hideButton.title = HIDES[code];
      hideButton.setAttribute("aria-label", HIDES[code]);
    };
    applyHide(l);
    chrome.storage.local
      .get("uiLang")
      .then(({ uiLang }) => {
        if (!(uiLang in LABELS)) return;
        label.textContent = LABELS[uiLang];
        applyHide(uiLang);
      })
      .catch(() => {});
    const panel = document.createElement("iframe");
    panel.className = "panel";
    panel.title = "Videoner";
    wrap.append(button, hideButton, panel);
    root.append(style, wrap);

    function closePanel() {
      panel.classList.remove("open");
      panel.src = "about:blank";
    }

    button.addEventListener("click", () => {
      if (panel.classList.contains("open")) {
        closePanel();
        return;
      }
      panel.src = chrome.runtime.getURL(`popup.html?embed=1&gc=${encodeURIComponent(player.hash)}`);
      panel.classList.add("open");
    });
    hideButton.addEventListener("click", () => host.remove());

    window.addEventListener("message", (event) => {
      if (event.source !== panel.contentWindow || !event.data || event.data.videoner === undefined) return;
      if (event.data.videoner === "height" && Number.isFinite(event.data.height)) {
        panel.style.height = `${Math.ceil(event.data.height)}px`;
      } else if (event.data.videoner === "close") {
        closePanel();
      }
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && panel.classList.contains("open")) closePanel();
    });
    // Во весь экран кнопка мешала бы смотреть.
    document.addEventListener("fullscreenchange", () => {
      host.style.display = document.fullscreenElement ? "none" : "";
      if (document.fullscreenElement) closePanel();
    });

    document.documentElement.append(host);
  }
})();
