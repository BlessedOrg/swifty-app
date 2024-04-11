/*
  Warnings:

  - Added the required column `gasWeiPrice` to the `Deposit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gasWeiPrice` to the `TicketMint` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gasWeiPrice` to the `Withdraw` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "LogType" AS ENUM ('mintSuccess', 'mintFailure', 'withdrawSuccess', 'withdrawFailure', 'depositSuccess', 'depositFailure', 'userRegistrationSuccess', 'userRegistrationFailure', 'ticketSaleCreationSuccess', 'ticketSaleCreationFailure');

-- AlterTable
ALTER TABLE "Deposit" ADD COLUMN     "gasWeiPrice" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "TicketMint" ADD COLUMN     "gasWeiPrice" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Withdraw" ADD COLUMN     "gasWeiPrice" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Log" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "LogType" NOT NULL,
    "payload" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Address" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "street1stLine" TEXT NOT NULL,
    "street2ndLine" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "countryCode" TEXT NOT NULL,
    "phoneNumber" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Log" ADD CONSTRAINT "Log_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
