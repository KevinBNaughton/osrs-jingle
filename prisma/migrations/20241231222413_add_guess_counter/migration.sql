-- DropIndex
DROP INDEX "DailyChallenge_date_key";

-- CreateTable
CREATE TABLE "GuessCounter" (
    "song" TEXT NOT NULL,
    "success" BIGINT NOT NULL DEFAULT 0,
    "failure" BIGINT NOT NULL DEFAULT 0,

    CONSTRAINT "GuessCounter_pkey" PRIMARY KEY ("song")
);
