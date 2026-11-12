-- AlterTable
ALTER TABLE "Download" ADD COLUMN "errorMessage" TEXT;

-- AlterTable
ALTER TABLE "LinkFailure" ADD COLUMN "url" TEXT,
ADD COLUMN "botUserId" TEXT,
ADD COLUMN "country" TEXT;

-- AddForeignKey
ALTER TABLE "LinkFailure" ADD CONSTRAINT "LinkFailure_botUserId_fkey" FOREIGN KEY ("botUserId") REFERENCES "BotUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;
