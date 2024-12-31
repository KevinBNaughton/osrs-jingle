/*
  Warnings:

  - You are about to drop the `GuessCounter` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "GuessCounter";

-- CreateTable
CREATE TABLE "GuessCount" (
    "song" TEXT NOT NULL,
    "success" BIGINT NOT NULL DEFAULT 0,
    "failure" BIGINT NOT NULL DEFAULT 0,

    CONSTRAINT "GuessCount_pkey" PRIMARY KEY ("song")
);
