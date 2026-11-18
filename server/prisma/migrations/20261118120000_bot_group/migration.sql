-- Группы, куда добавлен бот (BotGroupService, дашборд «Группы»).
CREATE TABLE "BotGroup" (
    "chatId" BIGINT NOT NULL,
    "title" TEXT,
    "username" TEXT,
    "type" TEXT,
    "addedById" BIGINT,
    "addedAt" TIMESTAMP(3),
    "removedAt" TIMESTAMP(3),
    "members" INTEGER,
    "membersAt" TIMESTAMP(3),
    "downloads" INTEGER NOT NULL DEFAULT 0,
    "lastLinkAt" TIMESTAMP(3),
    "lastDownloadAt" TIMESTAMP(3),
    "migratedTo" BIGINT,
    "firstSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BotGroup_pkey" PRIMARY KEY ("chatId")
);
