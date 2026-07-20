-- CreateEnum
CREATE TYPE "DownloadSource" AS ENUM ('BOT', 'WEB', 'API');

-- CreateEnum
CREATE TYPE "ErrorCategory" AS ENUM ('LOGIN_REQUIRED', 'UNSUPPORTED_PLATFORM', 'FORMAT_UNAVAILABLE', 'YOUTUBE_AUTH_REQUIRED', 'TIMEOUT', 'OTHER');

-- AlterTable
ALTER TABLE "Download" ADD COLUMN     "botUserId" TEXT,
ADD COLUMN     "errorCategory" "ErrorCategory",
ADD COLUMN     "fileSize" BIGINT,
ADD COLUMN     "isPaid" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "source" "DownloadSource" NOT NULL DEFAULT 'API',
ADD COLUMN     "starsAmount" INTEGER,
ADD COLUMN     "videoDuration" INTEGER,
ADD COLUMN     "videoTitle" TEXT;

-- CreateTable
CREATE TABLE "BotUser" (
    "id" TEXT NOT NULL,
    "telegramId" BIGINT NOT NULL,
    "username" TEXT,
    "firstName" TEXT,
    "languageCode" TEXT,
    "firstSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BotUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BotUser_telegramId_key" ON "BotUser"("telegramId");

-- CreateIndex
CREATE INDEX "BotUser_telegramId_idx" ON "BotUser"("telegramId");

-- CreateIndex
CREATE INDEX "Download_botUserId_idx" ON "Download"("botUserId");

-- CreateIndex
CREATE INDEX "Download_status_idx" ON "Download"("status");

-- CreateIndex
CREATE INDEX "Download_downloader_idx" ON "Download"("downloader");

-- CreateIndex
CREATE INDEX "Download_createdAt_idx" ON "Download"("createdAt");

-- AddForeignKey
ALTER TABLE "Download" ADD CONSTRAINT "Download_botUserId_fkey" FOREIGN KEY ("botUserId") REFERENCES "BotUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;
