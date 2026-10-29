import { Bot } from "grammy";
import { api } from "../helpers.js";

/**
 * Учёт тех, кто заблокировал бота, — для статистики в дашборде.
 *
 * Telegram сам присылает боту my_chat_member, когда человек в личке его
 * блокирует (статус kicked) или разблокирует (member). Списка заблокировавших
 * у Telegram не попросить, поэтому без этих сообщений истории не будет.
 * Группы и каналы сюда не относятся — только личные чаты.
 */
export function registerBlockedHandlers(bot: Bot) {
  bot.on("my_chat_member", (ctx) => {
    if (ctx.chat.type !== "private") return;
    const status = ctx.myChatMember.new_chat_member.status;
    if (status !== "kicked" && status !== "member") return;
    // Не ждём: статистика не должна задерживать обработку других обновлений.
    api("/bot-users/blocked", { telegramId: ctx.myChatMember.from.id, blocked: status === "kicked" }).catch((e) =>
      console.error("Не удалось записать блокировку бота:", e?.message ?? e),
    );
  });
}
