-- Статьи блога, опубликованные ботом в канале новостей.
CREATE TABLE "ChannelPost" (
    "slug" TEXT NOT NULL,
    "messageId" INTEGER,
    "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChannelPost_pkey" PRIMARY KEY ("slug")
);
