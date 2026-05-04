/*
  Warnings:

  - You are about to drop the column `version` on the `booking` table. All the data in the column will be lost.
  - You are about to drop the column `version` on the `tutor_profile` table. All the data in the column will be lost.
  - Made the column `startTime` on table `booking` required. This step will fail if there are existing NULL values in that column.
  - Made the column `endTime` on table `booking` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `updatedAt` to the `category` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "tutor_profile_categoryId_userId_idx";

-- AlterTable
ALTER TABLE "booking" DROP COLUMN "version",
ALTER COLUMN "startTime" SET NOT NULL,
ALTER COLUMN "endTime" SET NOT NULL;

-- AlterTable
ALTER TABLE "category" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "tutor_profile" DROP COLUMN "version",
ADD COLUMN     "availableFrom" TEXT,
ADD COLUMN     "availableTo" TEXT;

-- CreateIndex
CREATE INDEX "booking_tutorId_date_idx" ON "booking"("tutorId", "date");

-- CreateIndex
CREATE INDEX "category_name_idx" ON "category"("name");

-- CreateIndex
CREATE INDEX "tutor_profile_categoryId_isDeleted_idx" ON "tutor_profile"("categoryId", "isDeleted");
