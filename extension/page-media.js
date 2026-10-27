// Готовый mp4 одним файлом прямо со страницы — чтобы браузер скачал его сам,
// без сервера (content.js, background.js). Только там, где это проверено
// вживую 27.10.2026:
//
//   TikTok  — данные страницы __UNIVERSAL_DATA_FOR_REHYDRATION__, ролик без
//             водяного знака в video.playAddr. CDN отдаёт его только с
//             Referer страницы TikTok, поэтому качает content.js (fetch со
//             страницы), а не chrome.downloads — тот Referer не ставит.
//   Threads — JSON-скрипты страницы: пост с этим кодом, video_versions[0].
//             CDN отдаёт без Referer, качает chrome.downloads.
//
// Не взяты: Instagram и Facebook (без входа видео не показывают — проверить
// не на чем), Pinterest (ссылка лежит во внутреннем формате вперемешку с
// соседними пинами), X, VK, Rutube (видео идёт потоком HLS/DASH, не файлом).
// Для них и для любого сбоя здесь — обычный путь через сервер.
//
// Данные страницы описывают видео, с которого страницу открыли. Если площадка
// сменила видео без перезагрузки (лента TikTok), они устарели — тогда сверка
// id/кода с адресом не сходится, и мы честно возвращаем null.
//
// Обычный скрипт, не модуль: content scripts в Chrome модулями не подключаются.

// eslint-disable-next-line no-unused-vars
function videonerFindPageMedia() {
  try {
    const host = location.hostname.replace(/^www\./, "");
    if (host === "tiktok.com") return tiktokMedia();
    if (host === "threads.net" || host === "threads.com") return threadsMedia();
  } catch (e) {
    console.debug("Videoner: page media", e);
  }
  return null;
}

function tiktokMedia() {
  const id = location.pathname.match(/\/video\/(\d+)/)?.[1];
  const script = document.getElementById("__UNIVERSAL_DATA_FOR_REHYDRATION__");
  if (!id || !script) return null;
  const item = JSON.parse(script.textContent)?.__DEFAULT_SCOPE__?.["webapp.video-detail"]?.itemInfo?.itemStruct;
  // Пост из фотографий (imagePost) — это слайдшоу, а не ролик: его отдаёт сервер.
  if (!item || String(item.id) !== id || item.imagePost || !item.video?.playAddr) return null;
  return {
    pageUrl: location.href,
    url: item.video.playAddr,
    method: "page-fetch",
    title: item.desc || item.author?.nickname || "",
    thumbnail: item.video.cover || item.video.originCover || "",
    duration: item.video.duration || null,
  };
}

function threadsMedia() {
  const code = location.pathname.match(/\/post\/([\w-]+)/)?.[1];
  if (!code) return null;
  for (const script of document.querySelectorAll('script[type="application/json"]')) {
    const text = script.textContent;
    if (!text.includes(code) || !text.includes("video_versions")) continue;
    const post = findPost(JSON.parse(text), code);
    // Карусель (несколько файлов) и пост без видео — серверу: он соберёт всё.
    if (!post || post.carousel_media?.length || !post.video_versions?.[0]?.url) continue;
    return {
      pageUrl: location.href,
      url: post.video_versions[0].url,
      method: "download",
      title: post.caption?.text || post.user?.username || "",
      thumbnail: post.image_versions2?.candidates?.[0]?.url || "",
      duration: post.video_duration || null,
    };
  }
  return null;
}

// Объект поста с данным кодом где-то в глубине данных страницы. Обход с
// пределом глубины: данные большие и вложенные, но не бесконечные.
function findPost(node, code, depth = 0) {
  if (!node || typeof node !== "object" || depth > 60) return null;
  if (node.code === code && ("video_versions" in node || "carousel_media" in node)) return node;
  for (const value of Object.values(node)) {
    const found = findPost(value, code, depth + 1);
    if (found) return found;
  }
  return null;
}
