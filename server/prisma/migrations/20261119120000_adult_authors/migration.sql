CREATE TABLE "AdultAuthor" (
    "platform" TEXT NOT NULL,
    "nick" TEXT NOT NULL,
    "hits" INTEGER NOT NULL DEFAULT 1,
    "firstAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AdultAuthor_pkey" PRIMARY KEY ("platform","nick")
);

-- Прошлые отказы 18+ на X: ник берём из ссылки x.com/<ник>/status/<номер>.
INSERT INTO "AdultAuthor" ("platform", "nick", "hits", "firstAt", "lastAt")
SELECT 'twitter', nick, count(*)::int, min("createdAt"), max("createdAt")
FROM (
  SELECT lower(substring(url from '(?:x|twitter)\.com/([A-Za-z0-9_]{1,15})/status')) AS nick, "createdAt"
  FROM "LinkFailure"
  WHERE "errorCategory" = 'ADULT_CONTENT' AND platform = 'twitter' AND url IS NOT NULL
) f
WHERE nick IS NOT NULL AND nick NOT IN ('i', 'home', 'intent', 'search', 'explore', 'hashtag', 'share', 'settings', 'messages', 'notifications')
GROUP BY nick
ON CONFLICT DO NOTHING;
