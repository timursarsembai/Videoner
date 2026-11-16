-- Подключал аккаунт кодом из расширения (см. schema.prisma, BotUser.extensionLinkedAt).
ALTER TABLE "BotUser" ADD COLUMN "extensionLinkedAt" TIMESTAMP(3);
