import { api, t } from "./shared.js";

// Кнопка «Подключить аккаунт к боту» внизу окошка: человек уже вошёл на
// площадку в этом браузере, и бот @VideonerBot сможет качать от его аккаунта
// то, что видно только вошедшим (сторис Instagram, закрытые записи).
//
// Как это устроено:
//   1. Доступ к кукам — необязательное разрешение (optional_permissions в
//      manifest): браузер спрашивает его только здесь, по нажатию, и только
//      для сайтов этой площадки. Без такого подхода новое разрешение
//      отключило бы расширение у всех при обновлении до подтверждения.
//   2. Куки площадки уходят на сервер Videoner напрямую (POST
//      /api/ext/user-cookies/codes) — сервер оставляет только куки этой
//      площадки, шифрует их и отдаёт одноразовый код на 10 минут.
//   3. Человек отправляет код боту: в личку — для себя, в группе
//      /connect КОД — для группы. Сами куки через чат не проходят.
//
// Только в окошке по значку: во встроенном окошке на странице Firefox не даёт
// ни cookies, ни permissions. И только в сборке с сайта: в сборке для каталога
// Mozilla разрешения cookies нет (scripts/pack-extension.sh) — тогда кнопки нет.

const PLATFORMS = {
  instagram: { label: "Instagram", domains: ["instagram.com"] },
  facebook: { label: "Facebook", domains: ["facebook.com"] },
  youtube: { label: "YouTube", domains: ["youtube.com", "google.com"] },
  twitter: { label: "X", domains: ["x.com", "twitter.com"] },
  vk: { label: "VK", domains: ["vk.com", "vk.ru", "vkvideo.ru"] },
  tiktok: { label: "TikTok", domains: ["tiktok.com"] },
};

const BOT_URL = "https://t.me/VideonerBot";
// Бот сразу покажет список подключений (/start accounts): расширение само его
// показать не может — оно не знает, чей это Telegram.
const ACCOUNTS_URL = `${BOT_URL}?start=accounts`;

export function platformOfUrl(url) {
  let host;
  try {
    host = new URL(url).hostname.toLowerCase();
  } catch {
    return null;
  }
  // Threads узнаёт пользователя по входу в Instagram.
  if (/(^|\.)threads\.(net|com)$/.test(host)) return "instagram";
  for (const [key, p] of Object.entries(PLATFORMS)) {
    if (p.domains.some((d) => host === d || host.endsWith(`.${d}`))) return key;
  }
  return null;
}

function available() {
  const optional = chrome.runtime.getManifest().optional_permissions ?? [];
  return Boolean(chrome.permissions) && optional.includes("cookies");
}

function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k.startsWith("on")) node.addEventListener(k.slice(2), v);
    else node.setAttribute(k, v);
  }
  node.append(...children.filter(Boolean));
  return node;
}

// Всё, что браузер хранит для доменов площадки. Лишнее отбросит сервер, но и
// отправляем мы только домены этой площадки, а не весь браузер.
async function collectCookies(platform) {
  const all = [];
  for (const domain of PLATFORMS[platform].domains) {
    all.push(...(await chrome.cookies.getAll({ domain })));
  }
  return all.map(({ domain, hostOnly, path, secure, expirationDate, name, value }) => ({
    domain,
    hostOnly,
    path,
    secure,
    expirationDate,
    name,
    value,
  }));
}

// Chrome закрывает окошко, когда показывает запрос разрешения, — всё
// начатое в нём пропадает, и после «Разрешить» человек снова видел исходную
// кнопку. Поэтому помним в storage.local: «начали подключать» (PENDING) — при
// следующем открытии сразу продолжаем; «код готов» (CODE) — показываем его
// снова, пока он жив, даже если окошко закрылось.
const PENDING = "acctPending";
const CODE = "acctCode";
const PENDING_TTL_MS = 5 * 60_000;

async function stored(key) {
  try {
    return (await chrome.storage.local.get(key))[key] ?? null;
  } catch {
    return null;
  }
}

function store(key, value) {
  return chrome.storage.local.set({ [key]: value }).catch(() => {});
}

function forget(key) {
  return chrome.storage.local.remove(key).catch(() => {});
}

export async function mountAccountConnect(container, tabUrl) {
  const platform = platformOfUrl(tabUrl);
  if (!platform || !available()) return;
  const { label, domains } = PLATFORMS[platform];
  const origins = domains.map((d) => `https://*.${d}/*`);
  container.hidden = false;

  const show = (...nodes) => container.replaceChildren(...nodes);

  const accountsLink = () =>
    el("button", { class: "link muted-link", type: "button", onclick: () => chrome.tabs.create({ url: ACCOUNTS_URL }) }, t.acctList);

  const start = () =>
    show(
      el("button", { class: "link", type: "button", onclick: confirm }, t.acctButton(label)),
      el("br"),
      accountsLink()
    );

  const confirm = () =>
    show(
      el("p", { class: "note" }, t.acctWarn(label)),
      el(
        "div",
        { class: "row" },
        el("button", { class: "primary", type: "button", onclick: connect }, t.acctConfirm),
        el("button", { class: "secondary", type: "button", onclick: start }, t.acctCancel)
      )
    );

  const fail = (text) =>
    show(el("p", { class: "message error" }, text), el("button", { class: "secondary", type: "button", onclick: start }, t.back));

  // permissions.request — первым же вызовом в обработчике нажатия: браузер
  // разрешает его только как прямой ответ на действие человека. Отметку
  // «начали» ставим без await перед ним — запрос должен уйти сразу.
  async function connect() {
    void store(PENDING, { platform, at: Date.now() });
    let granted;
    try {
      granted = await chrome.permissions.request({ permissions: ["cookies"], origins });
    } catch {
      granted = false;
    }
    if (!granted) {
      await forget(PENDING);
      return fail(t.acctDenied);
    }
    await createCode();
  }

  async function createCode() {
    await forget(PENDING);
    show(el("p", { class: "muted" }, t.acctSending));
    let cookies;
    try {
      cookies = await collectCookies(platform);
    } catch {
      return fail(t.acctFailed);
    }
    if (!cookies.length) return fail(t.acctNoLogin(label));
    let res;
    try {
      res = await api("/user-cookies/codes", { raw: JSON.stringify(cookies), platform });
    } catch (e) {
      // Сервер проверил: куки есть, а входа среди них нет.
      return fail(/no-session|rejected/i.test(e?.message ?? "") ? t.acctNoLogin(label) : t.acctFailed);
    }
    await store(CODE, { platform, code: res.code, expiresAt: new Date(res.expiresAt).getTime() });
    showCode(res.code);
  }

  function showCode(value) {
    const code = el("div", { class: "code" }, value);
    const copy = el("button", { class: "secondary", type: "button" }, t.acctCopy);
    copy.addEventListener("click", async () => {
      await navigator.clipboard.writeText(value).catch(() => {});
      copy.textContent = t.acctCopied;
    });
    show(
      el("p", {}, t.acctCodeTitle(label)),
      code,
      el("p", { class: "note" }, t.acctCodeHelp),
      el(
        "div",
        { class: "row" },
        copy,
        el("button", { class: "primary", type: "button", onclick: () => chrome.tabs.create({ url: BOT_URL }) }, t.acctOpenBot)
      ),
      el("button", { class: "link", type: "button", onclick: confirm }, t.acctNewCode),
      el("br"),
      accountsLink()
    );
  }

  // Код ещё жив — показываем его. Только что разрешили доступ (окошко
  // закрылось на запросе) — продолжаем сами, без повторных нажатий.
  const code = await stored(CODE);
  if (code?.platform === platform && code.expiresAt > Date.now()) return showCode(code.code);
  const pending = await stored(PENDING);
  if (pending?.platform === platform && Date.now() - pending.at < PENDING_TTL_MS) {
    const granted = await chrome.permissions.contains({ permissions: ["cookies"], origins }).catch(() => false);
    if (granted) return createCode();
    await forget(PENDING);
  }
  start();
}
