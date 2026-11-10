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
