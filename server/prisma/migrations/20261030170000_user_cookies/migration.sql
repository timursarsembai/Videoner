-- AlterTable
ALTER TABLE "GroupSettings" ADD COLUMN "cookiesBy" TEXT NOT NULL DEFAULT 'admins';

-- CreateTable
CREATE TABLE "UserCookie" (
    "id" TEXT NOT NULL,
    "scope" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "ownerTelegramId" BIGINT NOT NULL,
    "ownerName" TEXT,
    "ownerLang" TEXT,
    "data" BYTEA NOT NULL,
    "failures" INTEGER NOT NULL DEFAULT 0,
    "invalidAt" TIMESTAMP(3),
    "lastUsedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserCookie_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CookieConnectCode" (
    "code" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "data" BYTEA NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CookieConnectCode_pkey" PRIMARY KEY ("code")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserCookie_scope_platform_ownerTelegramId_key" ON "UserCookie"("scope", "platform", "ownerTelegramId");

-- CreateIndex
CREATE INDEX "UserCookie_ownerTelegramId_idx" ON "UserCookie"("ownerTelegramId");

-- CreateIndex
CREATE INDEX "CookieConnectCode_expiresAt_idx" ON "CookieConnectCode"("expiresAt");
