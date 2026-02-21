/*
  Warnings:

  - You are about to alter the column `hourlyRate` on the `TutorProfile` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.

*/
-- AlterTable
ALTER TABLE "TutorProfile" ALTER COLUMN "hourlyRate" SET DATA TYPE INTEGER;
