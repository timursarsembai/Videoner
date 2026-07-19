/*
  Warnings:

  - You are about to drop the column `expiresAt` on the `Download` table. All the data in the column will be lost.
  - You are about to drop the column `filePath` on the `Download` table. All the data in the column will be lost.
  - You are about to drop the column `videoUrl` on the `Download` table. All the data in the column will be lost.
  - Added the required column `originalUrl` to the `Download` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "DownloadStatus" ADD VALUE 'DOWNLOADING';
ALTER TYPE "DownloadStatus" ADD VALUE 'CONVERTING';

-- AlterTable
ALTER TABLE "Download" DROP COLUMN "expiresAt",
DROP COLUMN "filePath",
DROP COLUMN "videoUrl",
ADD COLUMN     "downloadUrl" TEXT,
ADD COLUMN     "originalUrl" TEXT NOT NULL;
