-- Страна посетителя сайта и расширения (код ISO 3166-1 alpha-2 от Cloudflare).
ALTER TABLE "Download" ADD COLUMN "country" TEXT;
