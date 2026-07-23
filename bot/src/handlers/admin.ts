import { Bot } from "grammy";
import { api, ADMIN_TELEGRAM_ID } from "../helpers.js";

async function setUnlimitedFromCommand(ctx: any, isUnlimited: boolean) {
  if (!ADMIN_TELEGRAM_ID || ctx.from?.id !== ADMIN_TELEGRAM_ID) return;

  const arg = (ctx.match as string)?.trim();
  if (!arg) {
    await ctx.reply("Использование: /grant @username или /grant 123456789 (Telegram ID)");
    return;
  }

  const telegramId = /^\d+$/.test(arg) ? Number(arg) : undefined;
  const username = telegramId ? undefined : arg.replace(/^@/, "");

  try {
    const result = await api<{ telegramId: string; username: string | null }>(
      "/analytics/bot-users/grant",
      { telegramId, username, isUnlimited },
    );
    const label = result.username ? `@${result.username}` : result.telegramId;
    await ctx.reply(isUnlimited ? `Безлимитный доступ выдан: ${label}` : `Безлимитный доступ отозван: ${label}`);
  } catch (e: any) {
    await ctx.reply(`Ошибка: ${e.message}`);
  }
}

// Доступны только ADMIN_TELEGRAM_ID. Пользователь должен хотя бы раз написать боту
// (иначе для него ещё нет записи BotUser, к которой можно привязать флаг).
export function registerAdminHandlers(bot: Bot) {
  bot.command("grant", (ctx) => setUnlimitedFromCommand(ctx, true));
  bot.command("revoke", (ctx) => setUnlimitedFromCommand(ctx, false));
}
