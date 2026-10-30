import { Bot, Context, InlineKeyboard } from "grammy";
import { messages, type Lang } from "../i18n.js";
import { langOf } from "../language.js";
import { ADMIN_TELEGRAM_ID } from "../helpers.js";
import { SHARE_CHANNEL } from "./share.js";

/**
 * Подписка на канал как условие скачивания.
 *
 * Проверяем в двух точках: когда человек прислал ссылку (чтобы не гонять
 * сервер и не показывать выбор качества тому, кто всё равно не сможет
 * скачать) и в момент самого скачивания (между этими шагами можно успеть
 * отписаться).
 *
 * Канал не задан — условия нет вовсе, бот работает как раньше.
 */

const ALLOWED = new Set(["member", "administrator", "creator"]);

export function membershipRequired(): boolean {
  return Boolean(SHARE_CHANNEL);
}

export async function isChannelMember(ctx: Context, userId?: number): Promise<boolean> {
  if (!membershipRequired() || !userId) return true;
  // Админ не должен зависеть от состояния канала и доступности API —
  // тот же принцип, что и в getQuotaInfo.
  if (ADMIN_TELEGRAM_ID && userId === ADMIN_TELEGRAM_ID) return true;
  try {
    const member = await ctx.api.getChatMember(SHARE_CHANNEL, userId);
    return ALLOWED.has(member.status);
  } catch (e: any) {
    // Открытый отказ: если проверить не удалось (Telegram недоступен, бота
    // сняли с админов), НЕ запрещаем скачивание. Сломанная проверка не должна
    // превращаться в неработающий бот — ровно как с проверкой лимита.
    console.error("Проверка подписки не удалась:", e?.message ?? e);
    return true;
  }
}

function channelUrl(): string {
  return SHARE_CHANNEL.startsWith("@")
    ? `https://t.me/${SHARE_CHANNEL.slice(1)}`
    : "https://t.me/";
}

export function subscribeKeyboard(lang: Lang): InlineKeyboard {
  const m = messages[lang];
  return new InlineKeyboard()
    .url(m.openChannelButton, channelUrl())
    .row()
    .text(m.checkSubscriptionButton, "sub|check");
}

// Ссылки, с которыми человек упёрся в подписку: после «Я подписался»
// продолжаем с ними, а не просим прислать заново. Особенно важно для тех, кто
// пришёл по ссылке-приглашению (invite.ts) — ссылку они не присылали сами и
// повторить её не смогут. Хранится в памяти: после перезапуска бота человек
// просто пришлёт ссылку ещё раз, как и раньше.
//
// Ключ — чат и человек, как у очереди ссылок (LinkQueues.key): ссылку из
// группы нельзя продолжать в личке. Повторный отказ ссылки не затирает, а
// добавляет к уже отложенным; очередь сама отсечёт дубли и лишнее.
const PENDING_TTL_MS = 60 * 60_000;
const pendingLinks = new Map<string, { urls: string[]; expiresAt: number }>();

const pendingKey = (chatId: number, userId: number) => `${chatId}:${userId}`;

function rememberPendingLinks(key: string, urls: string[]) {
  const now = Date.now();
  for (const [k, entry] of pendingLinks) {
    if (entry.expiresAt < now) pendingLinks.delete(k);
  }
  const previous = pendingLinks.get(key)?.urls ?? [];
  pendingLinks.set(key, { urls: [...new Set([...previous, ...urls])], expiresAt: now + PENDING_TTL_MS });
}

function takePendingLinks(key: string): string[] {
  const entry = pendingLinks.get(key);
  pendingLinks.delete(key);
  return entry && entry.expiresAt >= Date.now() ? entry.urls : [];
}

/** Отвечает приглашением подписаться. true — доступ закрыт, вызывающий прекращает работу. */
export async function blockUnlessSubscribed(ctx: Context, lang: Lang, urls: string[] = []): Promise<boolean> {
  if (await isChannelMember(ctx, ctx.from?.id)) return false;
  if (ctx.from && ctx.chat && urls.length) rememberPendingLinks(pendingKey(ctx.chat.id, ctx.from.id), urls);
  const m = messages[lang];
  await ctx.reply(m.subscribeRequired(SHARE_CHANNEL), {
    reply_markup: subscribeKeyboard(lang),
  });
  return true;
}

// resumeLinks — handleLinks из download.ts. Передаётся параметром, а не
// импортом: download.ts сам импортирует этот модуль.
export function registerMembershipHandlers(
  bot: Bot,
  resumeLinks: (ctx: Context, urls: string[]) => Promise<void>,
) {
  bot.callbackQuery("sub|check", async (ctx) => {
    const lang = await langOf(ctx);
    const m = messages[lang];
    if (await isChannelMember(ctx, ctx.from?.id)) {
      await ctx.answerCallbackQuery();
      const urls = ctx.chat ? takePendingLinks(pendingKey(ctx.chat.id, ctx.from.id)) : [];
      await ctx.editMessageText(urls.length ? m.subscribeThanksResuming : m.subscribeThanks).catch(() => {});
      if (urls.length) await resumeLinks(ctx, urls);
    } else {
      await ctx.answerCallbackQuery({ text: m.subscribeStillMissing, show_alert: true });
    }
  });
}
