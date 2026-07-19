/*
  Warnings:

  - The primary key for the `Download` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `filename` to the `Download` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Download" DROP CONSTRAINT "Download_pkey",
ADD COLUMN     "filename" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Download_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Download_id_seq";
