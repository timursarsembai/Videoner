import { stripFlags } from "./flags.js";
// Режим для групп: чистая часть, без Telegram и сервера (проверяется
// group.test.ts). Сетевая часть — handlers/group.ts.
//
// В группе бот видит все сообщения подряд, и большинство ссылок там — не на
// видео: новости, документы, профили. Отвечать на каждую ошибкой нельзя —
// это спам в чужом чате. Поэтому заранее отбираем ссылки только с площадок,
// которые умеет сервер (список — как в server/src/validate/url.ts), а что
// сервер всё же не разобрал, бот пропускает молча.

export const VIDEO_HOSTS = [
  "youtube.com",
  "youtu.be",
  "tiktok.com",
  "instagram.com",
  "facebook.com",
  "fb.watch",
  "twitter.com",
  "x.com",
  "vimeo.com",
  "vk.com",
  "vk.ru",
  "vkvideo.ru",
  "rutube.ru",
  "ok.ru",
  "pinterest.com",
  "pin.it",
  "threads.net",
  "threads.com",
];

export function isVideoHostUrl(url: string): boolean {
  let host: string;
  try {
    host = new URL(url).hostname.toLowerCase();
  } catch {
    return false;
  }
  return VIDEO_HOSTS.some((h) => host === h || host.endsWith(`.${h}`));
}

// Сколько ссылок из одного сообщения берём. Больше — скорее подборка, чем
// просьба скачать, и бот завалил бы чат файлами.
export const GROUP_LINKS_PER_MESSAGE = 3;

// Качество без выбора: в группе кнопок нет. 720p — как в инлайн-режиме;
// тяжелее предела Telegram не берём. Пост из одних фотографий — фото и
// видео-слайдшоу из них одним альбомом ("gallery"), а если снимок один —
// просто фото ("original").
//
// max — лучшее из того, что влезает: сервер присылает качества от лучшего к
// худшему, поэтому это первое подходящее.
export function pickGroupQuality(
  available: string[],
  sizes: Record<string, number>,
  fileLimit: number,
  mode: "standard" | "max" = "standard",
): string | null {
  if (available.includes("gallery")) return "gallery";
  if (available.includes("original")) return "original";
  const fits = available.filter((q) => !(sizes[q] > fileLimit));
  if (!fits.length) return null;
  if (mode === "max") {
    // Размер известен — берём лучшее из того, что точно влезает. Не известен
    // ни у одного — не выше 1080p: иначе бот мог бы скачать 4K и только потом
    // узнать, что Telegram такой файл не примет.
    const known = fits.find((q) => sizes[q] !== undefined);
    if (known) return known;
    return fits.find((q) => !(parseInt(q, 10) > 1080)) ?? fits[fits.length - 1];
  }
  return fits.find((q) => q === "720p") ?? fits[0];
}

// Лимит скачиваний на группу за скользящий час. Суточный лимит считается по
// людям, но в активном чате их много, и без общего потолка одна группа могла
// бы съесть трафик YouTube за всех.
export class GroupLimiter {
  private hits = new Map<number, number[]>();

  constructor(
    private readonly limit: number,
    private readonly windowMs = 60 * 60_000,
  ) {}

  // true — можно качать (попытка засчитана), false — потолок достигнут.
  take(chatId: number, now = Date.now()): boolean {
    const fresh = (this.hits.get(chatId) ?? []).filter((t) => now - t < this.windowMs);
    if (fresh.length >= this.limit) {
      this.hits.set(chatId, fresh);
      return false;
    }
    fresh.push(now);
    this.hits.set(chatId, fresh);
    return true;
  }
}

// Настройки группы (/settings, только админы). Хранит сервер (GroupSettings),
// значения те же.
export type CaptionStyle = "full" | "short" | "none";
export type QualityMode = "standard" | "max";
export type GroupSettings = {
  deleteLinks: boolean;
  caption: CaptionStyle;
  quality: QualityMode;
  longVideos: boolean;
  // Кто может подключать к группе свой вход на площадках (handlers/accounts.ts).
  cookiesBy: "admins" | "all";
  // Язык ответов в группе; null — каждому на его языке (language.ts).
  language: string | null;
};

export const DEFAULT_GROUP_SETTINGS: GroupSettings = {
  deleteLinks: false,
  caption: "full",
  quality: "standard",
  longVideos: false,
  cookiesBy: "admins",
  language: null,
};

// Кнопка подписи перебирает варианты по кругу — так все настройки помещаются
// в одно сообщение, по кнопке на каждую.
const CAPTION_ORDER: CaptionStyle[] = ["full", "short", "none"];
export function nextCaption(current: CaptionStyle): CaptionStyle {
  return CAPTION_ORDER[(CAPTION_ORDER.indexOf(current) + 1) % CAPTION_ORDER.length];
}

// Удалять можно, только если в сообщении нет ничего, кроме ссылок: подпись
// или вопрос к ссылке — часть разговора, их удалять нельзя.
export function onlyLinks(text: string, urls: string[]): boolean {
  // Флаги («-audio», «-hd») — не текст: это часть просьбы скачать.
  let rest = stripFlags(text);
  // Сначала длинные: иначе ссылка-префикс другой оставила бы её хвост текстом.
  for (const url of [...urls].sort((a, b) => b.length - a.length)) rest = rest.split(url).join(" ");
  // Хвостовая пунктуация, которую extractUrls срезал с адреса, — тоже не текст.
  return rest.replace(/[\s.,;:!?()[\]{}«»"'<>]+/g, "") === "";
}

// Настройки читаются на каждую ссылку в группе — держим их в памяти, чтобы
// не спрашивать сервер каждый раз. Меняет их только этот же процесс бота
// (/settings), и он же сразу обновляет кеш, поэтому срок жизни может быть
// долгим: он нужен лишь на случай правки настроек мимо бота.
export class SettingsCache {
  private entries = new Map<number, { value: GroupSettings; expiresAt: number }>();

  constructor(private readonly ttlMs = 10 * 60_000) {}

  get(chatId: number, now = Date.now()): GroupSettings | undefined {
    const entry = this.entries.get(chatId);
    if (!entry || entry.expiresAt <= now) return undefined;
    return entry.value;
  }

  set(chatId: number, value: GroupSettings, now = Date.now()) {
    this.entries.set(chatId, { value, expiresAt: now + this.ttlMs });
  }
}
