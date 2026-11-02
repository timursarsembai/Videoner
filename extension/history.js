// История скачиваний: что человек скачал за последние 30 дней — название,
// ссылка, дата. Только в этом браузере (storage.local), на сервер не уходит.
// Пишет фоновая часть, когда файл сохранён (background.js), читает и очищает
// окошко (popup.js).

export const HISTORY_KEY = "history";
const MAX_AGE_MS = 30 * 24 * 60 * 60_000;
const MAX_ENTRIES = 200;

const fresh = (entries, now = Date.now()) =>
  (Array.isArray(entries) ? entries : []).filter((e) => now - e.at < MAX_AGE_MS).slice(0, MAX_ENTRIES);

async function read() {
  return (await chrome.storage.local.get(HISTORY_KEY))[HISTORY_KEY];
}

// Записи по очереди: два скачивания, закончившиеся одновременно, иначе
// прочитали бы один и тот же список, и одна запись потерялась бы.
let writes = Promise.resolve();

// entry: { url, title, kind } — kind "video", "audio" или "photo"; url может
// быть null (урок GetCourse без адреса страницы). Повторное скачивание той же
// ссылки тем же способом поднимает запись наверх, а не дублирует её.
export function addToHistory({ url, title, kind }) {
  writes = writes
    .then(async () => {
      const entry = { url: url || null, title: title || url || "", kind: kind || "video", at: Date.now() };
      const rest = fresh(await read()).filter((e) => !(entry.url && e.url === entry.url && e.kind === entry.kind));
      await chrome.storage.local.set({ [HISTORY_KEY]: fresh([entry, ...rest]) });
    })
    .catch((e) => console.warn("Videoner: history", e));
  return writes;
}

// Свежие сверху; старше 30 дней не показываем (и при следующей записи их не
// станет).
export async function readHistory() {
  try {
    return fresh(await read());
  } catch {
    return [];
  }
}

export function clearHistory() {
  return chrome.storage.local.remove(HISTORY_KEY);
}
