// Список прокси сервера (YtdlpProcessService): YOUTUBE_PROXY_URLS через
// запятую, а если его нет — один YOUTUBE_PROXY_URL, как было до 10.11.2026.
// Кавычки вокруг адресов срезаем: в .env и Infisical их ставят по привычке.
export function parseProxyPool(list: string | undefined, single: string | undefined): string[] {
  const clean = (value: string) => value.trim().replace(/^['"]|['"]$/g, '').trim();
  const fromList = (list ?? '').split(',').map(clean).filter(Boolean);
  const all = fromList.length ? fromList : [clean(single ?? '')].filter(Boolean);
  return [...new Set(all)];
}

// Адрес прокси для лога — только хост: логин и пароль в логи не пишем.
export function proxyHost(proxy: string): string {
  try {
    return new URL(proxy).hostname || 'proxy';
  } catch {
    return 'proxy';
  }
}

// Случайный прокси из доступных (решение владельца 15.11.2026): нагрузка
// делится между всеми, а не ложится на первый в списке, пока YouTube его не
// заблокирует. rnd — для тестов.
export function pickRandom<T>(items: readonly T[], rnd: () => number = Math.random): T | undefined {
  if (!items.length) return undefined;
  return items[Math.min(items.length - 1, Math.floor(rnd() * items.length))];
}

// Ключ «ролика» для привязки к прокси. Ссылки на видео у YouTube привязаны к
// адресу, с которого получены метаданные, поэтому метаданные и скачивание
// одного ролика обязаны идти через один прокси — а ссылку человек мог
// прислать в любом виде (youtu.be, shorts, watch?v=…&t=…), отсюда номер
// ролика. Для остальных площадок — ссылка без #якоря.
export function proxyAffinityKey(url: string): string | null {
  const yt =
    /(?:youtube\.com\/(?:watch\?(?:[^#]*&)?v=|shorts\/|live\/|embed\/|v\/)|youtu\.be\/)([\w-]{11})/i.exec(url);
  if (yt) return `youtube:${yt[1]}`;
  try {
    const parsed = new URL(url);
    return `${parsed.hostname.toLowerCase()}${parsed.pathname}${parsed.search}`;
  } catch {
    return null;
  }
}
