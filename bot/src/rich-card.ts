import { GrammyError, InlineKeyboard, type Api, type InputFile } from "grammy";
import { clip, splitTitle } from "./caption.js";
import { EXTENSION_PAGE_BASE, fmtSize } from "./helpers.js";
import { NEWS_CHANNEL, messages, sitePath, type Lang } from "./i18n.js";

// Карточка видео в личке (Bot API «rich messages», sendRichMessage): видео
// прямо в сообщении, под ним название, таблица (номер скачивания, площадка,
// качество, размер, источник), строка о правах и кнопки «Новости проекта»,
// «Поделиться», «Скопировать ссылку». Всё, что было в подписи fileCaption,
// здесь тоже есть: тексты источника, прав, канала и «Поделиться» берём из неё
// же, а не переводим заново. Не принял Telegram карточку — вызывающий
// отправляет видео по-старому (sendVideoCard).

export type VideoCard = {
  title: string;
  url: string;
  description?: string;
  number?: unknown;
  quality: string;
  extension: string;
  size?: number;
  shareUrl?: string;
};

const RTL = new Set<Lang>(["ar", "fa", "ur", "ps", "ckb", "ug"]);

const PLATFORMS: [RegExp, string][] = [
  [/(^|\.)(youtube\.com|youtu\.be)$/, "YouTube"],
  [/(^|\.)tiktok\.com$/, "TikTok"],
  [/(^|\.)instagram\.com$/, "Instagram"],
  [/(^|\.)(facebook\.com|fb\.watch|fb\.com)$/, "Facebook"],
  [/(^|\.)(twitter\.com|x\.com)$/, "X (Twitter)"],
  [/(^|\.)vimeo\.com$/, "Vimeo"],
  [/(^|\.)(vk\.com|vk\.ru|vkvideo\.ru)$/, "VK"],
  [/(^|\.)rutube\.ru$/, "Rutube"],
  [/(^|\.)ok\.ru$/, "OK.ru"],
  [/(^|\.)(pinterest\.[a-z.]+|pin\.it)$/, "Pinterest"],
  [/(^|\.)threads\.(net|com)$/, "Threads"],
  [/(^|\.)(reddit\.com|redd\.it)$/, "Reddit"],
];

function host(url: string): string | undefined {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return undefined;
  }
}

export function platformName(url: string): string | undefined {
  const h = host(url);
  if (!h) return undefined;
  return PLATFORMS.find(([re]) => re.test(h))?.[1] ?? h;
}

// Ссылка покороче для таблицы: без схемы и www, не длиннее 40 знаков.
function shortUrl(url: string): string {
  return clip(url.replace(/^https?:\/\/(www\.)?/, ""), 40);
}

function esc(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// Подписи из fileCaption: «Источник», строки о правах, «📣 Новости проекта»,
// «🔗 Поделиться». Подставляем метки и режем по строкам — так карточка
// говорит ровно теми же словами, что подпись, на всех 46 языках.
type CaptionParts = { source: string; rights: string; news: string; share: string };
const SRC = "SRCURL";
const SHARE = "SHAREURL";
const label = (line: string, token: string) => line.replace(token, "").replace(/[:：]\s*$/, "").trim();
const partsCache = new Map<Lang, CaptionParts | null>();
export function captionParts(lang: Lang): CaptionParts | null {
  if (partsCache.has(lang)) return partsCache.get(lang)!;
  let parts: CaptionParts | null = null;
  const lines = messages[lang].fileCaption("", SRC, SHARE, undefined, undefined).split("\n");
  const src = lines.findIndex((l) => l.includes(SRC));
  const news = lines.findIndex((l) => l.includes(NEWS_CHANNEL));
  const share = lines.find((l) => l.includes(SHARE));
  if (src >= 0 && news > src && share) {
    parts = {
      source: label(lines[src], SRC),
      rights: lines.slice(src + 1, news).join("\n").trim(),
      news: label(lines[news], NEWS_CHANNEL),
      share: label(share, SHARE),
    };
  }
  partsCache.set(lang, parts);
  return parts;
}

// «№8 216»: строка downloadNo без «⬇️» и без слова «Скачивание», которое
// уже стоит в левом столбце.
function numberValue(n: unknown, lang: Lang): string | undefined {
  if (typeof n !== "number" || !Number.isInteger(n) || n <= 0) return undefined;
  const m = messages[lang];
  const digits = String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  const full = m.downloadNo(digits).replace(/^⬇️\s*/, "");
  const value = full.replace(m.cardNumber, "").trim();
  return value.includes(digits) ? value : digits;
}

function qualityValue(card: VideoCard, lang: Lang): string {
  const m = messages[lang];
  const q =
    card.quality === "slideshow"
      ? m.slideshowButton.replace(/^\S+\s+/, "")
      : card.quality === "gallery"
        ? m.galleryButton.replace(/^\S+\s+/, "")
        : card.quality;
  // «original» (флаг -hd, «сразу видео») — служебное слово, людям его не
  // показываем: остаётся только формат.
  const ext = card.extension.toUpperCase();
  return q === "original" || !q ? ext : `${q} · ${ext}`;
}

export const CARD_VIDEO_ID = "video";

// Сервер Bot API не умеет карточки (sendRichMessage ответил 404) — до
// перезапуска шлём видео по-старому, не тратя на каждое неудачную попытку.
let cardsDisabled = false;

export function cardHtml(card: VideoCard, lang: Lang): string | null {
  const m = messages[lang];
  const parts = captionParts(lang);
  if (!parts) return null;
  const { head, extra } = splitTitle(card.title, card.description);
  const rows: [string, string][] = [];
  const no = numberValue(card.number, lang);
  if (no) rows.push([esc(m.cardNumber), `<a href="${esc(`${EXTENSION_PAGE_BASE}${sitePath(lang, "/stats")}`)}">${esc(no)}</a>`]);
  const platform = platformName(card.url);
  if (platform) rows.push([esc(m.cardPlatform), esc(platform)]);
  rows.push([esc(m.cardQuality), esc(qualityValue(card, lang))]);
  if (card.size) rows.push([esc(m.cardSize), esc(fmtSize(card.size, lang))]);
  rows.push([esc(parts.source), `<a href="${esc(card.url)}">${esc(shortUrl(card.url))}</a>`]);
  return [
    `<video src="tg://video?id=${CARD_VIDEO_ID}"></video>`,
    head ? `<p><b>${esc(clip(head, 200))}</b></p>` : "",
    extra ? `<p>${esc(clip(extra, 600))}</p>` : "",
    `<table bordered striped compact>\n${rows.map(([k, v]) => `<tr><td>${k}</td><td>${v}</td></tr>`).join("\n")}\n</table>`,
    `<p><i>${parts.rights.split("\n").map(esc).join("<br/>")}</i></p>`,
  ]
    .filter(Boolean)
    .join("\n");
}

// Кнопки под карточкой. Обычной клавиатурой, а не кнопками внутри HTML:
// локальный Bot API сервер бота (версия 10.2) кнопок в тексте ещё не знает.
// extra — кнопки, которые были под видео (MP3 в режиме «сразу видео»).
export function cardKeyboard(card: VideoCard, lang: Lang, extra?: InlineKeyboard): InlineKeyboard | undefined {
  const parts = captionParts(lang);
  if (!parts) return extra;
  const kb = new InlineKeyboard(extra?.inline_keyboard.length ? extra.inline_keyboard.map((row) => [...row]) : [[]]);
  if (extra?.inline_keyboard.length) kb.row();
  kb.url(parts.news, `https://t.me/${NEWS_CHANNEL.replace(/^@/, "")}`);
  if (card.shareUrl) {
    kb.url(parts.share, `https://t.me/share/url?url=${encodeURIComponent(card.shareUrl)}`);
    kb.row().copyText(messages[lang].copyLinkButton, card.shareUrl);
  }
  return kb;
}

// file_id видео из ответа Telegram — для кеша повторов (как у sendVideo).
export function richVideoFileId(o: unknown): string | undefined {
  if (!o || typeof o !== "object") return undefined;
  const rec = o as Record<string, unknown>;
  if (rec.type === "video" && rec.video && typeof (rec.video as { file_id?: unknown }).file_id === "string") {
    return (rec.video as { file_id: string }).file_id;
  }
  for (const v of Object.values(rec)) {
    const found = richVideoFileId(v);
    if (found) return found;
  }
  return undefined;
}

// Отправить карточку. null — Telegram её не принял (старый формат, слишком
// большой файл для карточки, нет прав): вызывающий шлёт видео по-старому.
// Сетевые и прочие сбои пробрасываем как есть — повторная отправка могла бы
// прислать человеку видео дважды.
export async function sendVideoCard(
  tg: Api,
  chatId: number,
  file: InputFile | string,
  card: VideoCard,
  lang: Lang,
  other: {
    dims?: { width?: number; height?: number; duration?: number };
    extraMarkup?: InlineKeyboard;
    reply?: object;
  } = {},
): Promise<{ fileId?: string } | null> {
  const html = cardHtml(card, lang);
  if (!html || cardsDisabled) return null;
  try {
    const sent = await tg.sendRichMessage(
      chatId,
      {
        html,
        media: [{ id: CARD_VIDEO_ID, media: { type: "video", media: file, supports_streaming: true, ...other.dims } }],
        ...(RTL.has(lang) ? { is_rtl: true } : {}),
      },
      { ...other.reply, reply_markup: cardKeyboard(card, lang, other.extraMarkup) },
    );
    const fileId = richVideoFileId(sent.rich_message);
    if (!fileId) console.error("Карточка отправлена, но file_id видео в ответе не найден — повтор пойдёт без кеша");
    return { fileId };
  } catch (e) {
    // Повторяем обычным видео только отказ именно карточки (400). Блокировка
    // бота (403), лимит (429) и прочее обычное видео не исправит — файл
    // заново не загружаем, ошибку отдаём как есть.
    if (e instanceof GrammyError && (e.error_code === 400 || e.error_code === 404)) {
      // 404 — сервер Bot API не знает sendRichMessage: дальше и не пробуем.
      if (e.error_code === 404 || /method not found/i.test(e.description)) cardsDisabled = true;
      console.error(`Карточка видео не принята (${e.error_code} ${e.description}), шлю обычным видео`);
      return null;
    }
    throw e;
  }
}

// Экран выбора качества карточкой (только личка): обложка, название,
// таблица (площадка, длительность, источник), «Выбери качество:» и пояснения
// (большие качества скрыты, канал, очередь). Кнопки — прежняя клавиатура.
export type ChoiceCard = {
  title: string;
  url: string;
  thumbnail?: string;
  duration?: string;
  // Хвост сообщения: пояснения, как в текстовом варианте (начинаются с "\n\n").
  notes: string;
};

function paragraphs(text: string): string {
  return text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => `<p>${p.split("\n").map(esc).join("<br/>")}</p>`)
    .join("\n");
}

// Последний абзац chooseQuality — «Выбери качество:» на языке человека.
function choosePrompt(lang: Lang): string {
  const text = messages[lang].chooseQuality("", "");
  return text.split(/\n{2,}/).pop()?.trim() ?? "";
}

export function choiceHtml(card: ChoiceCard, lang: Lang, withImage = true): string | null {
  const m = messages[lang];
  const parts = captionParts(lang);
  if (!parts) return null;
  const rows: [string, string][] = [];
  const platform = platformName(card.url);
  if (platform) rows.push([esc(m.cardPlatform), esc(platform)]);
  if (card.duration) rows.push([esc(m.cardDuration), esc(card.duration)]);
  rows.push([esc(parts.source), `<a href="${esc(card.url)}">${esc(shortUrl(card.url))}</a>`]);
  const image = withImage && card.thumbnail && /^https:\/\//.test(card.thumbnail) ? `<img src="${esc(card.thumbnail)}"/>` : "";
  return [
    image,
    card.title ? `<p><b>${esc(clip(card.title, 200))}</b></p>` : "",
    `<table bordered striped compact>\n${rows.map(([k, v]) => `<tr><td>${k}</td><td>${v}</td></tr>`).join("\n")}\n</table>`,
    paragraphs(`${choosePrompt(lang)}${card.notes}`),
  ]
    .filter(Boolean)
    .join("\n");
}

// Показать выбор карточкой вместо сообщения «Получаю информацию». false —
// Telegram карточку не принял (например, не смог загрузить обложку и без неё
// тоже) — вызывающий пишет выбор простым текстом, как раньше.
export async function editToChoiceCard(
  tg: Api,
  chatId: number,
  messageId: number,
  card: ChoiceCard,
  lang: Lang,
  keyboard: InlineKeyboard,
): Promise<boolean> {
  if (cardsDisabled) return false;
  for (const withImage of card.thumbnail ? [true, false] : [false]) {
    const html = choiceHtml(card, lang, withImage);
    if (!html) return false;
    try {
      await tg.editMessageText(chatId, messageId, { html, ...(RTL.has(lang) ? { is_rtl: true } : {}) }, { reply_markup: keyboard });
      return true;
    } catch (e) {
      if (!(e instanceof GrammyError) || (e.error_code !== 400 && e.error_code !== 404)) throw e;
      // Сообщения уже нет или его нельзя править — карточка тут ни при чём,
      // текстом тоже не выйдет: отдаём ошибку как есть.
      if (e.error_code === 404 || /method not found/i.test(e.description)) cardsDisabled = true;
      else if (/message to edit not found|MESSAGE_ID_INVALID|can't be edited/i.test(e.description)) throw e;
      // Без обложки пробуем, только если отказ похож на обложку.
      const imageProblem = withImage && /IMAGE|PHOTO|MEDIA|URL|WEBPAGE|FILE/i.test(e.description);
      console.error(`Выбор качества карточкой не принят (${e.error_code} ${e.description})${imageProblem ? ", пробую без обложки" : ""}`);
      if (cardsDisabled || !imageProblem) return false;
    }
  }
  return false;
}
