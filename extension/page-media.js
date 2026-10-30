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
//   Instagram — то же устройство, что у Threads (оба — Meta): пост с этим
//             кодом и video_versions[0]. Перешёл к посту внутри сайта (без
//             перезагрузки) — в скриптах страницы поста нет, тогда
//             спрашиваем API сайта, как сама страница.
//             Сторис (/stories/<ник>/<id>) — только через API сайта: Instagram
//             показывает их лишь вошедшим, и сервер Videoner их не получит
//             вовсе (yt-dlp: «This content is unreachable»). Видео — mp4,
//             фото-сторис — jpg (поле ext). Вживую не проверено: на сервере
//             нет аккаунта Instagram (30.10.2026).
//   Facebook  — JSON-скрипты страницы: объект видео с этим id и
//             browser_native_hd_url / _sd_url.
//   Оба CDN отдают mp4 со звуком без Referer — качает chrome.downloads.
//
// Запросы идут из браузера человека с его куками, поэтому скачивается и то,
// что он видит только под своим аккаунтом (закрытые профили, группы), а сами
// куки браузер не покидают. Публичные ролики Instagram и Facebook проверены
// вживую 28.10.2026 без входа (720p, видео и звук). Со входом — устройство
// данных то же, но вживую не проверено: на сервере аккаунта нет. Не нашли —
// null и обычный путь через сервер.
//
// Не взяты: Pinterest (ссылка лежит во внутреннем формате вперемешку с
// соседними пинами), X, VK, Rutube (видео идёт потоком HLS/DASH, не файлом).
// Для них и для любого сбоя здесь — обычный путь через сервер.
//
// Данные страницы описывают видео, с которого страницу открыли. Если площадка
// сменила видео без перезагрузки (лента TikTok), они устарели — тогда сверка
// id/кода с адресом не сходится, и мы честно возвращаем null.
//
// Обычный скрипт, не модуль: content scripts в Chrome модулями не подключаются.

// eslint-disable-next-line no-unused-vars
async function videonerFindPageMedia() {
  try {
    const host = location.hostname.replace(/^(www|m|web)\./, "");
    if (host === "tiktok.com") return tiktokMedia();
    if (host === "threads.net" || host === "threads.com") return threadsMedia();
    if (host === "instagram.com") return await instagramMedia();
    if (host === "facebook.com") return facebookMedia();
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
  return code ? metaPostMedia(postFromScripts(code)) : null;
}

async function instagramMedia() {
  const story = location.pathname.match(/^\/stories\/([^/]+)(?:\/(\d+))?/);
  if (story?.[2]) return storyMedia(await instagramApiItem(story[2]));
  // Адрес вида /stories/<ник>/ без номера — так Instagram открывает все
  // текущие сторис человека. Какая из них на экране, по адресу не понять:
  // берём их все и ищем ту, чья картинка или видео сейчас на странице.
  if (story && story[1] !== "highlights") return storyMedia(await currentStoryOf(story[1]));
  const code = location.pathname.match(/^\/(?:p|reels?|tv)\/([\w-]+)/)?.[1];
  if (!code) return null;
  return metaPostMedia(postFromScripts(code) ?? (await instagramApiPost(code)));
}

// Сторис → что качать: видео или, если его нет, снимок в лучшем размере.
function storyMedia(item) {
  if (!item) return null;
  const title = item.user?.username ? `${item.user.username} story` : "Instagram story";
  const thumbnail = item.image_versions2?.candidates?.[0]?.url || "";
  if (item.video_versions?.[0]?.url) {
    return {
      pageUrl: location.href,
      url: item.video_versions[0].url,
      method: "download",
      title,
      thumbnail,
      duration: item.video_duration || null,
    };
  }
  if (!thumbnail) return null;
  return { pageUrl: location.href, url: thumbnail, method: "download", ext: "jpg", title, thumbnail, duration: null };
}

async function instagramApi(path) {
  const res = await fetch(path, {
    credentials: "include",
    headers: { "X-IG-App-ID": INSTAGRAM_APP_ID },
    signal: AbortSignal.timeout(5_000),
  });
  return res.ok ? res.json() : null;
}

// Файл в CDN Instagram узнаётся по имени без параметров: ссылки на один и тот
// же снимок отличаются подписью в query, а путь у них общий.
function mediaFileName(url) {
  try {
    return new URL(url, location.href).pathname.split("/").pop() || null;
  } catch {
    return null;
  }
}

async function currentStoryOf(username) {
  const profile = await instagramApi(`/api/v1/users/web_profile_info/?username=${encodeURIComponent(username)}`);
  const userId = profile?.data?.user?.id;
  if (!userId) return null;
  const reels = await instagramApi(`/api/v1/feed/reels_media/?reel_ids=${encodeURIComponent(userId)}`);
  const items = reels?.reels?.[userId]?.items ?? reels?.reels_media?.[0]?.items ?? [];
  if (items.length <= 1) return items[0] ?? null;
  // Что сейчас показывает страница: видео и картинки крупнее превью.
  const onScreen = new Set(
    [...document.querySelectorAll("video, img")]
      .filter((node) => node.tagName === "VIDEO" || node.naturalWidth >= 300)
      .flatMap((node) => [node.currentSrc, node.src, node.poster])
      .filter(Boolean)
      .map(mediaFileName)
      .filter(Boolean)
  );
  const urlsOf = (item) => [
    ...(item.video_versions ?? []).map((v) => v.url),
    ...(item.image_versions2?.candidates ?? []).map((c) => c.url),
  ];
  return items.find((item) => urlsOf(item).some((u) => onScreen.has(mediaFileName(u)))) ?? null;
}

// Пост Threads/Instagram → что качать. Карусель (несколько файлов) и пост
// без видео — серверу: он соберёт всё.
function metaPostMedia(post) {
  if (!post || post.carousel_media?.length || !post.video_versions?.[0]?.url) return null;
  return {
    pageUrl: location.href,
    url: post.video_versions[0].url,
    method: "download",
    title: post.caption?.text || post.user?.username || "",
    thumbnail: post.image_versions2?.candidates?.[0]?.url || "",
    duration: post.video_duration || null,
  };
}

function postFromScripts(code) {
  for (const script of document.querySelectorAll('script[type="application/json"]')) {
    const text = script.textContent;
    if (!text.includes(code.slice(0, 11)) || !text.includes("video_versions")) continue;
    const post = findNode(
      JSON.parse(text),
      (node) => sameCode(node.code, code) && ("video_versions" in node || "carousel_media" in node)
    );
    if (post) return post;
  }
  return null;
}

// У постов закрытых аккаунтов Instagram код в адресе длиннее: первые 11
// знаков — код поста, дальше хвост. В данных лежит короткий.
function sameCode(nodeCode, code) {
  return typeof nodeCode === "string" && (nodeCode === code || (nodeCode.length === 11 && code.startsWith(nodeCode)));
}

// Код поста — это его числовой id в base64-алфавите (как в yt-dlp).
const INSTAGRAM_CODE_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
// Публичный id веб-приложения Instagram: без него API сайта отвечает отказом.
const INSTAGRAM_APP_ID = "936619743392459";

function instagramMediaId(code) {
  let id = 0n;
  for (const ch of code.slice(0, 11)) {
    const digit = INSTAGRAM_CODE_ALPHABET.indexOf(ch);
    if (digit < 0) return null;
    id = id * 64n + BigInt(digit);
  }
  return id.toString();
}

// Тот же запрос, что делает сама страница Instagram: с её адреса и с куками
// человека. Без входа ответ — отказ, и тогда остаётся сервер.
async function instagramApiPost(code) {
  const id = instagramMediaId(code);
  if (!id) return null;
  const item = await instagramApiItem(id);
  return item && sameCode(item.code, code) ? item : null;
}

// Запись по числовому id. У сторис id прямо в адресе; ответ сверяем с ним
// (pk — тот же id, у id ещё хвост «_<id автора>»).
async function instagramApiItem(id) {
  const res = await fetch(`/api/v1/media/${id}/info/`, {
    credentials: "include",
    headers: { "X-IG-App-ID": INSTAGRAM_APP_ID },
    // Окошко ждёт этого ответа, прежде чем что-то показать.
    signal: AbortSignal.timeout(5_000),
  });
  if (!res.ok) return null;
  const item = (await res.json())?.items?.[0];
  return item && (String(item.pk) === id || String(item.id ?? "").startsWith(`${id}_`)) ? item : null;
}

function facebookVideoId() {
  if (location.pathname.startsWith("/watch")) return new URLSearchParams(location.search).get("v");
  return location.pathname.match(/\/(?:videos|reel)\/(?:[^/]+\/)?(\d+)/)?.[1] ?? null;
}

// mp4 со звуком: в новых страницах — в videoDeliveryLegacyFields, в старых —
// прямо в объекте видео.
function facebookUrl(video) {
  const fields = video.videoDeliveryLegacyFields ?? video;
  return fields.browser_native_hd_url || fields.browser_native_sd_url || video.playable_url_quality_hd || video.playable_url || null;
}

function facebookMedia() {
  const id = facebookVideoId();
  if (!id || !/^\d+$/.test(id)) return null;
  for (const script of document.querySelectorAll('script[type="application/json"]')) {
    const text = script.textContent;
    if (!text.includes(id) || !(text.includes("browser_native_") || text.includes("playable_url"))) continue;
    const video = findNode(JSON.parse(text), (node) => (node.id === id || node.videoId === id) && !!facebookUrl(node));
    if (!video) continue;
    return {
      pageUrl: location.href,
      url: facebookUrl(video),
      method: "download",
      title: video.title?.text || video.name || facebookPageTitle(),
      thumbnail: video.preferred_thumbnail?.image?.uri || video.thumbnailImage?.uri || "",
      duration: video.length_in_second || (video.playable_duration_in_ms ? video.playable_duration_in_ms / 1000 : null),
    };
  }
  return null;
}

// У Reels своего названия в данных нет — берём заголовок страницы. Он вида
// «36 тыс. просмотров · 872 реакции | подпись | автор»: счётчики в имени
// файла ни к чему.
function facebookPageTitle() {
  const parts = (document.querySelector('meta[property="og:title"]')?.content ?? "").split(" | ");
  if (parts.length > 1 && /\d.*·/.test(parts[0])) parts.shift();
  return parts.join(" | ");
}

// Объект, подходящий под условие, где-то в глубине данных страницы. Обход с
// пределом глубины: данные большие и вложенные, но не бесконечные.
function findNode(node, matches, depth = 0) {
  if (!node || typeof node !== "object" || depth > 60) return null;
  if (!Array.isArray(node) && matches(node)) return node;
  for (const value of Object.values(node)) {
    const found = findNode(value, matches, depth + 1);
    if (found) return found;
  }
  return null;
}
