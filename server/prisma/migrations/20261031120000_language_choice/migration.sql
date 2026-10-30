-- Язык бота, выбранный вручную: у человека (/language) и у группы (/settings).
ALTER TABLE "BotUser" ADD COLUMN "language" TEXT;
ALTER TABLE "GroupSettings" ADD COLUMN "language" TEXT;
