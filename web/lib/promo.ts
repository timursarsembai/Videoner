// Подсказки о Videoner после удачного скачивания на сайте — те же правила,
// что в боте (server BotUserService.nextPromo): каждую человек видит один
// раз, не чаще одной в сутки и начиная с 3-го удачного скачивания. Помнит их
// только этот браузер (localStorage): входа на сайте для скачивания нет.
export const SITE_PROMOS = ["redditSite", "extension", "channel", "share"] as const;
export type SitePromo = (typeof SITE_PROMOS)[number];

export const PROMO_MIN_DOWNLOADS = 3;
export const PROMO_INTERVAL_MS = 24 * 60 * 60 * 1000;

export interface PromoState {
  count: number;
  last: number;
  seen: string[];
}

const STORAGE_KEY = "videoner.promo";

// Чистая часть: учесть ещё одно удачное скачивание и решить, что показать.
export function pickPromo(
  state: PromoState,
  keys: readonly string[],
  now: number,
  rnd: () => number = Math.random,
): { state: PromoState; key: string | null } {
  const next = { ...state, count: state.count + 1 };
  if (next.count < PROMO_MIN_DOWNLOADS || now - next.last < PROMO_INTERVAL_MS) return { state: next, key: null };
  const fresh = keys.filter((k) => !next.seen.includes(k));
  if (!fresh.length) return { state: next, key: null };
  const key = fresh[Math.floor(rnd() * fresh.length)];
  return { state: { ...next, last: now, seen: [...next.seen, key] }, key };
}

function load(): PromoState {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null");
    if (raw && typeof raw.count === "number" && typeof raw.last === "number" && Array.isArray(raw.seen)) return raw;
  } catch {
    // Хранилище недоступно (приватный режим) — просто без подсказок по счёту.
  }
  return { count: 0, last: 0, seen: [] };
}

// Подсказка после этого скачивания или null. Без доступного хранилища
// ничего не показываем: иначе подсказки шли бы при каждом скачивании.
export function nextSitePromo(): SitePromo | null {
  try {
    localStorage.setItem(`${STORAGE_KEY}.probe`, "1");
    localStorage.removeItem(`${STORAGE_KEY}.probe`);
  } catch {
    return null;
  }
  const { state, key } = pickPromo(load(), SITE_PROMOS, Date.now());
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    return null;
  }
  return key as SitePromo | null;
}
