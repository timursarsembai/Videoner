import { scrubCookieLines } from './user-cookies';

// Текст ошибки для журнала дашборда (Download.errorMessage, LinkFailure.message):
// без строк из файла кук (ошибка с подключённым входом человека может их
// процитировать), без ссылок — в них бывают логин и пароль прокси и подписи
// CDN, сама ссылка поста хранится отдельно, — в одну строку и коротко.
export function errorText(raw: unknown, max = 500): string {
  const message = raw instanceof Error ? raw.message : String(raw ?? '');
  return scrubCookieLines(message)
    // Обёртка нашего же кода, к причине ничего не добавляет.
    .replace(/^Failed to run yt-dlp command:\s*/i, '')
    .replace(/https?:\/\/\S+/g, '<url>')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max);
}
