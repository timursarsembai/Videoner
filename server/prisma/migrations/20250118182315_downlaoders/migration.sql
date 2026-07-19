-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Downloaders" ADD VALUE 'FACEBOOK';
ALTER TYPE "Downloaders" ADD VALUE 'INSTAGRAM';
ALTER TYPE "Downloaders" ADD VALUE 'TIKTOK';
ALTER TYPE "Downloaders" ADD VALUE 'TWITTER';
