// Страница конкретного видео или поста, а не главная, лента или профиль:
// только на таких content.js показывает кнопку «Скачать». Правила путей —
// те же, что в проверке ссылок сайта (web/lib/validations/url.ts), иначе
// кнопка вела бы туда, где сервер всё равно откажет. Обычный скрипт, а не
// модуль: content scripts в Chrome модулями не подключаются.

// eslint-disable-next-line no-unused-vars
function videonerIsVideoPage(href) {
  let url;
  try {
    url = new URL(href);
  } catch {
    return false;
  }
  const host = url.hostname.toLowerCase().replace(/^(www|m|web|mobile)\./, "");
  const path = url.pathname.toLowerCase();

  switch (host) {
    case "youtube.com":
    case "music.youtube.com":
      if (path === "/watch") return url.searchParams.has("v");
      return /^\/(shorts|live)\/[\w-]+/.test(path);
    case "tiktok.com":
      return /^\/@[\w.-]+\/(video|photo)\/\d+/.test(path);
    case "instagram.com":
      return /^\/(p|reel|reels|tv|stories)\/[^/]+/.test(path);
    case "facebook.com":
      if (path.startsWith("/watch")) return url.searchParams.has("v");
      return /^\/(videos|reel|story|share)\/./.test(path);
    case "x.com":
    case "twitter.com":
      return /^\/\w+\/status\/\d+/.test(path);
    case "vimeo.com":
      return /\/\d+(\/|$)/.test(path);
    case "vk.com":
    case "vk.ru":
    case "vkvideo.ru":
      return /^\/(video|clip)-?\d+_\d+/.test(path);
    case "rutube.ru":
      return /^\/(video|shorts)\/[\w-]+/.test(path);
    case "ok.ru":
      return /^\/video\/\d+/.test(path);
    case "threads.net":
    case "threads.com":
      return /^\/(@[^/]+\/post|t)\/[\w-]+/.test(path);
    default:
      if (/^([a-z]{2}\.)?pinterest\.[a-z.]{2,}$/.test(host)) return /^\/pin\/\d+/.test(path);
      return false;
  }
}
