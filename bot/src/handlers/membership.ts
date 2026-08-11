import { Bot, Context, InlineKeyboard } from "grammy";
import { detectLang, messages, type Lang } from "../i18n.js";
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

/** Отвечает приглашением подписаться. true — доступ закрыт, вызывающий прекращает работу. */
export async function blockUnlessSubscribed(ctx: Context, lang: Lang): Promise<boolean> {
  if (await isChannelMember(ctx, ctx.from?.id)) return false;
  const m = messages[lang];
  await ctx.reply(m.subscribeRequired(SHARE_CHANNEL), {
    reply_markup: subscribeKeyboard(lang),
  });
  return true;
}

export function registerMembershipHandlers(bot: Bot) {
  bot.callbackQuery("sub|check", async (ctx) => {
    const lang = detectLang(ctx.from?.language_code);
    const m = messages[lang];
    if (await isChannelMember(ctx, ctx.from?.id)) {
      await ctx.answerCallbackQuery();
      await ctx.editMessageText(m.subscribeThanks).catch(() => {});
    } else {
      await ctx.answerCallbackQuery({ text: m.subscribeStillMissing, show_alert: true });
    }
  });
}
