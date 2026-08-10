-- Сервис становится полностью бесплатным: подписок, оплаты через Telegram
-- Stars и платного HD-качества больше нет. Поля удаляются, а не остаются
-- пустовать: иначе через полгода никто не вспомнит, живые они или мёртвые.
--
-- Данные не теряются: на момент миграции ни одной подписки не оформлялось,
-- платных скачиваний ноль, starsAmount везде NULL (проверено 10.08.2026).
--
-- isUnlimited НЕ трогаем: это ручной админский грант через /grant, к деньгам
-- он отношения не имеет и остаётся.

-- AlterTable
ALTER TABLE "Download" DROP COLUMN "isPaid",
                       DROP COLUMN "starsAmount";

-- AlterTable
ALTER TABLE "BotUser" DROP COLUMN "subscriptionUntil",
                      DROP COLUMN "subscriptionKind";

-- DropEnum
DROP TYPE "SubscriptionKind";
