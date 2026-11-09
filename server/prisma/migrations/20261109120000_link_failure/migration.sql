-- CreateTable
CREATE TABLE "LinkFailure" (
    "id" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "source" "DownloadSource" NOT NULL,
    "errorCategory" "ErrorCategory" NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LinkFailure_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LinkFailure_createdAt_idx" ON "LinkFailure"("createdAt");
