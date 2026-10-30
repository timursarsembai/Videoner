import type { Context } from "grammy";
import { detectLang, isLang, type Lang } from "./i18n.js";
import { api } from "./helpers.js";
import { loadSettings } from "./settings-store.js";

// Язык ответов бота. По умолчанию — язык Telegram человека; его можно
// выбрать вручную (/language), а в группе админы могут задать один язык для
// всех (/settings). Выбор хранит сервер (BotUser.language,
// GroupSettings.language).
//
//   группа с языком  → язык группы;
//   иначе            → выбранный человеком, если выбирал;
//   иначе            → язык его Telegram.

const TTL_MS = 10 * 60_000;
// Сервер не ответил — недолго не спрашиваем снова, но и надолго «авто» не
// запоминаем.
const ERROR_TTL_MS = 60_000;
// Язык — не повод ждать: не ответил сервер быстро — отвечаем по Telegram.
const LOOKUP_TIMEOUT_MS = 2_000;
const chosen = new Map<number, { value: Lang | null; expiresAt: number }>();

export async function chosenLanguage(userId: number, now = Date.now()): Promise<Lang | null> {
  const hit = chosen.get(userId);
  if (hit && hit.expiresAt > now) return hit.value;
  try {
    const { language } = await api<{ language: string | null }>(`/bot-users/${userId}/language`, undefined, {
      timeoutMs: LOOKUP_TIMEOUT_MS,
    });
    const value = isLang(language) ? language : null;
    remember(userId, value, now + TTL_MS);
    return value;
  } catch (e: any) {
    console.error(`Язык ${userId}: не загрузился:`, e?.message ?? e);
    remember(userId, null, now + ERROR_TTL_MS);
    return null;
  }
}

export async function saveChosenLanguage(userId: number, lang: Lang | null) {
  await api(`/bot-users/${userId}/language`, { language: lang });
  remember(userId, lang, Date.now() + TTL_MS);
}

function remember(userId: number, value: Lang | null, expiresAt: number) {
  if (chosen.size > 50_000) chosen.clear();
  chosen.set(userId, { value, expiresAt });
}

// Язык самого человека — без учёта группы (личка, инлайн-режим, очередь).
export async function userLang(from: { id: number; language_code?: string } | undefined): Promise<Lang> {
  if (!from) return "en";
  return (await chosenLanguage(from.id)) ?? detectLang(from.language_code);
}

// Язык ответа в этом чате.
export async function langOf(ctx: Context): Promise<Lang> {
  const chat = ctx.chat;
  if (chat && (chat.type === "group" || chat.type === "supergroup")) {
    const { language } = await loadSettings(chat.id);
    if (isLang(language)) return language;
  }
  return userLang(ctx.from);
}
