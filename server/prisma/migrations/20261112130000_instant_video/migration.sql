-- Режим «сразу видео» в личке бота (/settings).
ALTER TABLE "BotUser" ADD COLUMN "instantVideo" BOOLEAN NOT NULL DEFAULT false;
