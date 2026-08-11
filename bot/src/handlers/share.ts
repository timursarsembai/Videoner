import { Bot, InlineKeyboard } from "grammy";
import { detectLang, messages, type Lang } from "../i18n.js";

/**
 * Публикация ссылки в канал — ТОЛЬКО по явному действию пользователя.
 *
 * Автопубликация всего скачанного обсуждалась и отклонена: ссылки, которые
 * качают люди, это их история просмотров. При нынешних числах (8 пользователей,
 * 40 ссылок из 41 скачаны ровно одним человеком) публикация ссылки означала бы
 * публикацию того, что смотрел конкретный человек. Здесь публикуется только то,
 * что пользователь выбрал сам, и после отдельного подтверждения прав — без него
 * кнопка была бы обычным шарингом, а с ним это осознанное действие владельца
 * ссылки. Кто поделился, в канале не указывается.
 *
 * Канал не задан — кнопка не появляется вовсе, поведение бота прежнее.
 */

export const SHARE_CHANNEL = process.env.TELEGRAM_CHANNEL_ID ?? "";

type Pending = { url: string; title: string; createdAt: number };

// Ключ — chatId+messageId сообщения, на котором висит кнопка (это то самое
// служебное сообщение «Скачиваю…», которое мы не удаляем, а превращаем в
// предложение поделиться). Привязка к message_id, а не к чату — по той же
// причине, что и у sessions в download.ts: два скачивания подряд в одном чате
// не должны перетирать друг друга.
const pending = new Map<string, Pending>();
const PENDING_TTL_MS = 60 * 60 * 1000;

setInterval(() => {
  const cutoff = Date.now() - PENDING_TTL_MS;
  for (const [key, entry] of pending.entries()) {
    if (entry.createdAt < cutoff) pending.delete(key);
  }
}, 60_000);

function key(chatId: number, messageId: number): string {
  return `${chatId}:${messageId}`;
}

export function rememberShare(chatId: number, messageId: number, url: string, title: string) {
  pending.set(key(chatId, messageId), { url, title, createdAt: Date.now() });
}

export function shareOfferKeyboard(lang: Lang): InlineKeyboard {
  return new InlineKeyboard().text(messages[lang].shareButton, "share|ask");
}

export function registerShareHandlers(bot: Bot) {
  bot.callbackQuery(/^share\|/, async (ctx) => {
    const lang = detectLang(ctx.from?.language_code);
    const m = messages[lang];
    const chatId = ctx.chat?.id;
    const messageId = ctx.callbackQuery.message?.message_id;
    const action = ctx.callbackQuery.data.split("|")[1];

    if (!chatId || !messageId) {
      await ctx.answerCallbackQuery();
      return;
    }

    if (action === "no") {
      await ctx.answerCallbackQuery();
      pending.delete(key(chatId, messageId));
      await ctx.api.editMessageText(chatId, messageId, m.shareCancelled).catch(() => {});
      return;
    }

    const entry = pending.get(key(chatId, messageId));
    if (!entry) {
      await ctx.answerCallbackQuery({ text: m.shareExpired });
      return;
    }

    if (action === "ask") {
      await ctx.answerCallbackQuery();
      const kb = new InlineKeyboard()
        .text(m.shareConfirmYes, "share|yes")
        .text(m.shareConfirmNo, "share|no");
      await ctx.api
        .editMessageText(chatId, messageId, m.shareConfirm, { reply_markup: kb })
        .catch(() => {});
      return;
    }

    if (action !== "yes") {
      await ctx.answerCallbackQuery();
      return;
    }

    await ctx.answerCallbackQuery();
    try {
      // Кто поделился — в канал не уходит: публикуется ссылка, а не автор
      // действия. disable_web_page_preview не ставим, превью площадки здесь
      // и есть основное содержимое поста.
      await ctx.api.sendMessage(SHARE_CHANNEL, m.channelPost(entry.title, entry.url));
      pending.delete(key(chatId, messageId));
      await ctx.api.editMessageText(chatId, messageId, m.shareDone).catch(() => {});
    } catch (e: any) {
      console.error("Публикация в канал не удалась:", e?.message ?? e);
      await ctx.api.editMessageText(chatId, messageId, m.shareFailed).catch(() => {});
    }
  });
}
