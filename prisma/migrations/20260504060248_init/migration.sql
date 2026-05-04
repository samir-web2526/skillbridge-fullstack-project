-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'REJECTED');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('STUDENT', 'TUTOR', 'ADMIN');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'BANNED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAID', 'FAILED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('STRIPE', 'SSLCOMMERZ', 'AMARPAY', 'CASH');

-- CreateTable
CREATE TABLE "booking" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "startTime" TIMESTAMP(3),
    "endTime" TIMESTAMP(3),
    "status" "BookingStatus" NOT NULL DEFAULT 'PENDING',
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "version" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tutorId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment" (
    "id" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'BDT',
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "transactionId" TEXT NOT NULL,
    "paymentGateway" TEXT,
    "paymentMethod" "PaymentMethod",
    "gatewayResponse" JSONB,
    "bookingId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "review" (
    "id" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "tutorId" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tutor_profile" (
    "id" TEXT NOT NULL,
    "bio" TEXT,
    "hourlyRate" DECIMAL(10,2) NOT NULL,
    "experience" INTEGER NOT NULL,
    "averageRating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "version" INTEGER NOT NULL DEFAULT 0,
    "categoryId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tutor_profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "role" "Role" NOT NULL DEFAULT 'STUDENT',
    "image" TEXT,
    "phone" TEXT,
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "booking_userId_tutorId_status_idx" ON "booking"("userId", "tutorId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "category_name_key" ON "category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "payment_transactionId_key" ON "payment"("transactionId");

-- CreateIndex
CREATE UNIQUE INDEX "payment_bookingId_key" ON "payment"("bookingId");

-- CreateIndex
CREATE INDEX "payment_transactionId_status_idx" ON "payment"("transactionId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "review_bookingId_key" ON "review"("bookingId");

-- CreateIndex
CREATE UNIQUE INDEX "tutor_profile_userId_key" ON "tutor_profile"("userId");

-- CreateIndex
CREATE INDEX "tutor_profile_categoryId_userId_idx" ON "tutor_profile"("categoryId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE INDEX "user_email_role_idx" ON "user"("email", "role");

-- AddForeignKey
ALTER TABLE "booking" ADD CONSTRAINT "booking_tutorId_fkey" FOREIGN KEY ("tutorId") REFERENCES "tutor_profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking" ADD CONSTRAINT "booking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "booking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "review_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "booking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "review_tutorId_fkey" FOREIGN KEY ("tutorId") REFERENCES "tutor_profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tutor_profile" ADD CONSTRAINT "tutor_profile_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tutor_profile" ADD CONSTRAINT "tutor_profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
