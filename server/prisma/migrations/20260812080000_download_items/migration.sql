-- Пост из нескольких файлов (карусель Instagram, тред) перестаёт помещаться в
-- одну строку Download. Заводим отдельную таблицу под файлы.
--
-- Существующие поля Download НЕ трогаем: filename/downloadUrl/videoWidth и
-- прочие продолжают описывать ПЕРВЫЙ файл поста. Так весь код, рассчитанный на
-- одно скачивание = один файл (а таких мест три десятка), работает без правок,
-- а знать про остальные файлы нужно только тем, кто их показывает.
--
-- Старые записи остаются без строк в этой таблице: она заполняется только для
-- новых скачиваний, и потребители обязаны считать пустой список как «один файл,
-- он же в Download.filename».

-- CreateEnum
CREATE TYPE "DownloadItemKind" AS ENUM ('VIDEO', 'PHOTO', 'AUDIO');

-- CreateTable
CREATE TABLE "DownloadItem" (
    "id" TEXT NOT NULL,
    "downloadId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "filename" TEXT NOT NULL,
    "kind" "DownloadItemKind" NOT NULL DEFAULT 'VIDEO',
    "width" INTEGER,
    "height" INTEGER,
    "duration" INTEGER,
    "fileSize" BIGINT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DownloadItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DownloadItem_downloadId_idx" ON "DownloadItem"("downloadId");

-- CreateIndex
CREATE UNIQUE INDEX "DownloadItem_downloadId_position_key" ON "DownloadItem"("downloadId", "position");

-- AddForeignKey
-- ON DELETE CASCADE: файлы не переживают скачивание, к которому относятся.
ALTER TABLE "DownloadItem" ADD CONSTRAINT "DownloadItem_downloadId_fkey" FOREIGN KEY ("downloadId") REFERENCES "Download"("id") ON DELETE CASCADE ON UPDATE CASCADE;
