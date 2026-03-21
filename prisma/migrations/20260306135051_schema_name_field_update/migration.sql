/*
  Warnings:

  - The values [BANED] on the enum `UserStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `TutorProfile` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
ALTER TYPE "BookingStatus" ADD VALUE 'REJECTED';

-- AlterEnum
BEGIN;
CREATE TYPE "UserStatus_new" AS ENUM ('ACTIVE', 'BANNED');
ALTER TABLE "public"."user" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "user" ALTER COLUMN "status" TYPE "UserStatus_new" USING ("status"::text::"UserStatus_new");
ALTER TYPE "UserStatus" RENAME TO "UserStatus_old";
ALTER TYPE "UserStatus_new" RENAME TO "UserStatus";
DROP TYPE "public"."UserStatus_old";
ALTER TABLE "user" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';
COMMIT;

-- DropForeignKey
ALTER TABLE "TutorProfile" DROP CONSTRAINT "TutorProfile_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "TutorProfile" DROP CONSTRAINT "TutorProfile_userId_fkey";

-- DropForeignKey
ALTER TABLE "booking" DROP CONSTRAINT "booking_tutorId_fkey";

-- DropForeignKey
ALTER TABLE "review" DROP CONSTRAINT "review_tutorId_fkey";

-- AlterTable
ALTER TABLE "booking" ADD COLUMN     "endTime" TIMESTAMP(3),
ADD COLUMN     "startTime" TIMESTAMP(3);

-- DropTable
DROP TABLE "TutorProfile";

-- CreateTable
CREATE TABLE "tutor_profile" (
    "id" TEXT NOT NULL,
    "bio" TEXT,
    "hourlyRate" INTEGER NOT NULL,
    "experience" INTEGER NOT NULL,
    "averageRating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "categoryId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tutor_profile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tutor_profile_userId_key" ON "tutor_profile"("userId");

-- AddForeignKey
ALTER TABLE "tutor_profile" ADD CONSTRAINT "tutor_profile_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tutor_profile" ADD CONSTRAINT "tutor_profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking" ADD CONSTRAINT "booking_tutorId_fkey" FOREIGN KEY ("tutorId") REFERENCES "tutor_profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "review_tutorId_fkey" FOREIGN KEY ("tutorId") REFERENCES "tutor_profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
