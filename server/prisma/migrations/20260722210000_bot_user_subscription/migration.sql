CREATE TYPE "SubscriptionKind" AS ENUM ('MONTHLY', 'YEARLY');

ALTER TABLE "BotUser"
  ADD COLUMN "subscriptionUntil" TIMESTAMP(3),
  ADD COLUMN "subscriptionKind" "SubscriptionKind";
