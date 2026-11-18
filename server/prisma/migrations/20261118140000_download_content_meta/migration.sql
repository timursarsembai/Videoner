-- Автор и тема скачанного видео (lib/content-meta.ts).
ALTER TABLE "Download" ADD COLUMN "authorName" TEXT;
ALTER TABLE "Download" ADD COLUMN "authorId" TEXT;
ALTER TABLE "Download" ADD COLUMN "authorUrl" TEXT;
ALTER TABLE "Download" ADD COLUMN "category" TEXT;
ALTER TABLE "Download" ADD COLUMN "hashtags" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Прошлое — то, что видно без повторных запросов к площадкам.
-- Instagram: заголовок «Video by <ник>».
UPDATE "Download" SET
  "authorName" = substring("videoTitle" from '^(?:[Vv]ideo|[Pp]hoto|[Pp]ost|[Rr]eel) by ([A-Za-z0-9_.]{1,40})$'),
  "authorId"   = substring("videoTitle" from '^(?:[Vv]ideo|[Pp]hoto|[Pp]ost|[Rr]eel) by ([A-Za-z0-9_.]{1,40})$'),
  "authorUrl"  = 'https://www.instagram.com/' || substring("videoTitle" from '^(?:[Vv]ideo|[Pp]hoto|[Pp]ost|[Rr]eel) by ([A-Za-z0-9_.]{1,40})$') || '/'
WHERE "originalUrl" ~* 'instagram\.com'
  AND "videoTitle" ~ '^(?:[Vv]ideo|[Pp]hoto|[Pp]ost|[Rr]eel) by [A-Za-z0-9_.]{1,40}$';

-- TikTok: @ник в ссылке.
UPDATE "Download" SET
  "authorName" = substring("originalUrl" from 'tiktok\.com/@([A-Za-z0-9_.]{2,40})'),
  "authorId"   = substring("originalUrl" from 'tiktok\.com/@([A-Za-z0-9_.]{2,40})'),
  "authorUrl"  = 'https://www.tiktok.com/@' || substring("originalUrl" from 'tiktok\.com/@([A-Za-z0-9_.]{2,40})')
WHERE "originalUrl" ~* 'tiktok\.com/@[A-Za-z0-9_.]{2,40}';

-- Reddit: сабреддит из ссылки.
UPDATE "Download" SET "category" = 'r/' || lower(substring("originalUrl" from 'reddit\.com/r/([A-Za-z0-9_]{2,30})'))
WHERE "originalUrl" ~* 'reddit\.com/r/[A-Za-z0-9_]{2,30}';

-- Хэштеги из названия (до 15, без повторов).
UPDATE "Download" d SET "hashtags" = t.tags
FROM (
  SELECT id, (array_agg(DISTINCT lower(m[1])))[1:15] AS tags
  FROM "Download", regexp_matches("videoTitle", '#([^[:space:]#.,!?;:()"«»/]{2,50})', 'g') AS m
  WHERE "videoTitle" LIKE '%#%'
  GROUP BY id
) t
WHERE d.id = t.id;
