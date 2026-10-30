-- CreateTable
CREATE TABLE "GroupSettings" (
    "chatId" BIGINT NOT NULL,
    "deleteLinks" BOOLEAN NOT NULL DEFAULT false,
    "caption" TEXT NOT NULL DEFAULT 'full',
    "quality" TEXT NOT NULL DEFAULT 'standard',
    "longVideos" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GroupSettings_pkey" PRIMARY KEY ("chatId")
);
