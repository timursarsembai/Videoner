-- Подписка пользователя бота на канал новостей (ChannelMembershipService).
ALTER TABLE "BotUser" ADD COLUMN "inChannel" BOOLEAN;
ALTER TABLE "BotUser" ADD COLUMN "inChannelCheckedAt" TIMESTAMP(3);
