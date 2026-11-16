-- Подсказки после скачивания в боте (см. schema.prisma, PromoShow).
CREATE TABLE "PromoShow" (
    "id" TEXT NOT NULL,
    "botUserId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "shownAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PromoShow_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "PromoShow_botUserId_key_key" ON "PromoShow"("botUserId", "key");
CREATE INDEX "PromoShow_shownAt_idx" ON "PromoShow"("shownAt");

ALTER TABLE "PromoShow" ADD CONSTRAINT "PromoShow_botUserId_fkey" FOREIGN KEY ("botUserId") REFERENCES "BotUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;
