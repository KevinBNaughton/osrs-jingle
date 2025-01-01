/*
  Warnings:

  - You are about to drop the `GuessCount` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "GuessCount";

-- CreateTable
CREATE TABLE "Song" (
    "song" TEXT NOT NULL,
    "success_count" BIGINT NOT NULL DEFAULT 0,
    "failure_count" BIGINT NOT NULL DEFAULT 0,

    CONSTRAINT "Song_pkey" PRIMARY KEY ("song")
);
