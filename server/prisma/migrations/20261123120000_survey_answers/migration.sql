CREATE TABLE "SurveyAnswer" (
    "botUserId" TEXT NOT NULL,
    "survey" TEXT NOT NULL,
    "choices" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "done" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "SurveyAnswer_pkey" PRIMARY KEY ("botUserId","survey")
);

ALTER TABLE "SurveyAnswer" ADD CONSTRAINT "SurveyAnswer_botUserId_fkey" FOREIGN KEY ("botUserId") REFERENCES "BotUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;
