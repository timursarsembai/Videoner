-- AlterTable
ALTER TABLE "BotUser" ADD COLUMN "blockedAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "BotBlockEvent" (
    "id" TEXT NOT NULL,
    "botUserId" TEXT NOT NULL,
    "blocked" BOOLEAN NOT NULL,
    "source" TEXT NOT NULL,
    "at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BotBlockEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BotBlockEvent_at_idx" ON "BotBlockEvent"("at");

-- AddForeignKey
ALTER TABLE "BotBlockEvent" ADD CONSTRAINT "BotBlockEvent_botUserId_fkey" FOREIGN KEY ("botUserId") REFERENCES "BotUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;
