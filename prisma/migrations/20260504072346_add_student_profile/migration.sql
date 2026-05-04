/*
  Warnings:

  - You are about to drop the column `subject` on the `student_profile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "student_profile" DROP COLUMN "subject",
ADD COLUMN     "group" TEXT;
