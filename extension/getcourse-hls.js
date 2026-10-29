// HLS-поток урока GetCourse: разбор плейлистов. Общее для окошка (качества из
// master-плейлиста) и gc-offscreen.js (список кусочков одного качества).
// Плейлисты отдаются с Access-Control-Allow-Origin: *, поэтому страница
// расширения читает их сама, без доступа к доменам GetCourse.

async function fetchText(url) {
  const res = await fetch(url, { credentials: "omit" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const text = await res.text();
  // Бывает, что вместо плейлиста приходит JSON со ссылкой на него.
  if (!text.trimStart().startsWith("#EXTM3U")) {
    try {
      const nested = JSON.parse(text)?.url;
      if (typeof nested === "string" && nested.startsWith("https://")) return fetchText(nested);
    } catch {
      // не JSON — ниже честная ошибка
    }
    throw new Error("not a playlist");
  }
  return text;
}

function attributes(line) {
  const result = {};
  for (const match of line.matchAll(/([A-Z0-9-]+)=("[^"]*"|[^,]*)/g)) {
    result[match[1]] = match[2].replace(/^"|"$/g, "");
  }
  return result;
}

// Качества урока, от лучшего к худшему: { quality: "720p", bandwidth, url }.
// В master-плейлисте каждое качество повторено для нескольких CDN (PATHWAY-ID)
// — берём первую копию: CDN плеер перечисляет в порядке предпочтения.
export async function fetchQualities(masterUrl) {
  const text = await fetchText(masterUrl);
  const lines = text.split(/\r?\n/);
  const byHeight = new Map();
  for (let i = 0; i < lines.length; i++) {
    if (!lines[i].startsWith("#EXT-X-STREAM-INF:")) continue;
    const attrs = attributes(lines[i].slice("#EXT-X-STREAM-INF:".length));
    const uri = lines.slice(i + 1).find((line) => line.trim() && !line.startsWith("#"));
    if (!uri) continue;
    const [w, h] = (attrs.RESOLUTION ?? "").split("x").map(Number);
    // Подпись — по меньшей стороне, как у остальных площадок: вертикальное
    // 720x1280 — это «720p».
    const height = w && h ? Math.min(w, h) : 0;
    if (!height || byHeight.has(height)) continue;
    byHeight.set(height, {
      quality: `${height}p`,
      bandwidth: Number(attrs.BANDWIDTH) || 0,
      url: new URL(uri.trim(), masterUrl).href,
    });
  }
  return [...byHeight.entries()].sort((a, b) => b[0] - a[0]).map(([, variant]) => variant);
}

// Кусочки одного качества и общая длительность в секундах (сумма EXTINF).
// Шифрование (EXT-X-KEY с методом не NONE) и кусочки fMP4 (EXT-X-MAP)
// браузерная склейка не умеет — тогда ошибка, и фоновая часть отдаст урок
// серверу: yt-dlp справится с обычным AES-128.
export async function fetchSegments(variantUrl) {
  const text = await fetchText(variantUrl);
  if (/^#EXT-X-KEY:(?!.*METHOD=NONE)/m.test(text)) throw new Error("encrypted");
  if (/^#EXT-X-MAP:/m.test(text)) throw new Error("fmp4 segments");
  const lines = text.split(/\r?\n/).map((line) => line.trim());
  const segments = lines
    .filter((line) => line && !line.startsWith("#"))
    .map((line) => new URL(line, variantUrl).href);
  if (!segments.length) throw new Error("empty playlist");
  const duration = lines
    .filter((line) => line.startsWith("#EXTINF:"))
    .reduce((sum, line) => sum + (parseFloat(line.slice("#EXTINF:".length)) || 0), 0);
  return { segments, duration };
}

// Адрес потока без подписи и данных ученика (jwt, user-id) — для отчёта о
// скачивании: серверу нужна только площадка, а не доступ к уроку.
export function reportUrl(masterUrl) {
  const url = new URL(masterUrl);
  return `${url.origin}${url.pathname}`;
}
