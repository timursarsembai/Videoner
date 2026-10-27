-- CreateTable
CREATE TABLE "UserActivityDay" (
    "botUserId" TEXT NOT NULL,
    "day" DATE NOT NULL,

    CONSTRAINT "UserActivityDay_pkey" PRIMARY KEY ("botUserId","day")
);

-- CreateIndex
CREATE INDEX "UserActivityDay_day_idx" ON "UserActivityDay"("day");

-- AddForeignKey
ALTER TABLE "UserActivityDay" ADD CONSTRAINT "UserActivityDay_botUserId_fkey" FOREIGN KEY ("botUserId") REFERENCES "BotUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Восстановление истории. Точного журнала активности до этой миграции нет,
-- поэтому берём всё, что сохранилось: дни скачиваний, день первого и
-- последнего визита, день входа на сайт. Сегодняшний MAU по этим данным
-- совпадает с карточкой (она считается по lastSeenAt), а прошлые дни
-- получаются чуть ниже настоящих: дни, когда человек только присылал ссылку и
-- ничего не скачал, нигде не записаны. Время в базе хранится в UTC.
INSERT INTO "UserActivityDay" ("botUserId", "day")
SELECT "botUserId", "createdAt"::date FROM "Download" WHERE "botUserId" IS NOT NULL
UNION
SELECT "id", "firstSeenAt"::date FROM "BotUser"
UNION
SELECT "id", "lastSeenAt"::date FROM "BotUser"
UNION
SELECT "id", "lastWebLoginAt"::date FROM "BotUser" WHERE "lastWebLoginAt" IS NOT NULL
ON CONFLICT DO NOTHING;
