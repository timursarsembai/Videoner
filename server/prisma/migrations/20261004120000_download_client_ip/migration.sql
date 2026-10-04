-- AlterTable
ALTER TABLE "Download" ADD COLUMN     "clientIpHash" TEXT;

-- CreateIndex
CREATE INDEX "Download_clientIpHash_idx" ON "Download"("clientIpHash");
