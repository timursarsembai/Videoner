import { SITE } from "./shared.js";

// Новая версия для Chrome и других браузеров на Chromium. Автообновления вне
// магазина Chrome нет: распакованное расширение браузер не обновляет, а
// .crx не из магазина Chrome на Windows и Mac не ставит. Поэтому расширение
// само раз в 12 часов сверяется с сайтом и, если вышла новая версия, ставит на
// значок отметку NEW, а окошко показывает ссылку на инструкцию
// (videoner.download/extension#update).
//
// Сборка для Firefox обновляется сама (update_url или каталог Mozilla) — там
// проверка не нужна.

const LATEST_URL = `${SITE}/extension/latest.json`;
const LATEST = "updLatest";
const CHECKED_AT = "updCheckedAt";
const INTERVAL_MS = 12 * 60 * 60_000;

function isFirefoxBuild() {
  return Boolean(chrome.runtime.getManifest().browser_specific_settings?.gecko);
}

function currentVersion() {
  return chrome.runtime.getManifest().version;
}

// «1.10.0» новее «1.9.3»: сравниваем по числам, а не строками.
export function isNewer(candidate, current) {
  const a = String(candidate).split(".").map(Number);
  const b = String(current).split(".").map(Number);
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    const x = a[i] || 0;
    const y = b[i] || 0;
    if (x !== y) return x > y;
  }
  return false;
}

async function setBadge(latest) {
  const has = Boolean(latest) && isNewer(latest, currentVersion());
  await chrome.action.setBadgeText({ text: has ? "NEW" : "" }).catch(() => {});
  if (has) await chrome.action.setBadgeBackgroundColor({ color: "#6a65d4" }).catch(() => {});
}

export async function checkForUpdate({ force = false } = {}) {
  if (isFirefoxBuild()) return null;
  let state = {};
  try {
    state = await chrome.storage.local.get([LATEST, CHECKED_AT]);
  } catch {
    // Хранилище недоступно — просто проверяем без памяти.
  }
  if (!force && state[CHECKED_AT] && Date.now() - state[CHECKED_AT] < INTERVAL_MS) {
    await setBadge(state[LATEST]);
    return state[LATEST] ?? null;
  }
  try {
    const res = await fetch(LATEST_URL, { cache: "no-store" });
    if (!res.ok) throw new Error(String(res.status));
    const { version } = await res.json();
    if (typeof version !== "string" || !/^\d+(\.\d+){1,3}$/.test(version)) throw new Error("bad version");
    await chrome.storage.local.set({ [LATEST]: version, [CHECKED_AT]: Date.now() }).catch(() => {});
    await setBadge(version);
    return version;
  } catch {
    // Нет сети или сайта — попробуем в следующий раз, человеку это не важно.
    await setBadge(state[LATEST]);
    return state[LATEST] ?? null;
  }
}

// Для окошка: номер новой версии или null.
export async function availableUpdate() {
  const latest = await checkForUpdate();
  return latest && isNewer(latest, currentVersion()) ? latest : null;
}
