-- AlterTable
ALTER TABLE "Download" ADD COLUMN     "cacheKey" TEXT,
ADD COLUMN     "telegramFileId" TEXT,
ADD COLUMN     "fromCache" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "Download_cacheKey_idx" ON "Download"("cacheKey");
