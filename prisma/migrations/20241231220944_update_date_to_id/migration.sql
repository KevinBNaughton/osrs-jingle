/*
  Warnings:

  - The primary key for the `DailyChallenge` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `DailyChallenge` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "DailyChallenge" DROP CONSTRAINT "DailyChallenge_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "DailyChallenge_pkey" PRIMARY KEY ("date");
