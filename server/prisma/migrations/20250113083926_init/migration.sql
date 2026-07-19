-- CreateEnum
CREATE TYPE "DownloadStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "Downloaders" AS ENUM ('YOUTUBE');

-- CreateTable
CREATE TABLE "Download" (
    "id" SERIAL NOT NULL,
    "videoUrl" TEXT NOT NULL,
    "status" "DownloadStatus" NOT NULL DEFAULT 'PENDING',
    "filePath" TEXT,
    "downloader" "Downloaders" NOT NULL DEFAULT 'YOUTUBE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Download_pkey" PRIMARY KEY ("id")
);
