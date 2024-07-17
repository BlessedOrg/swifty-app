/*
  Warnings:

  - You are about to drop the column `walletAddress` on the `Deposit` table. All the data in the column will be lost.
  - Added the required column `phaseId` to the `Deposit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ticketSaleId` to the `Deposit` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `gasWeiPrice` on the `Deposit` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "PhaseId" AS ENUM ('lotteryV1', 'lotteryV2', 'auctionV1', 'auctionV2');

-- AlterTable
ALTER TABLE "Deposit" DROP COLUMN "walletAddress",
ADD COLUMN     "phaseId" "PhaseId" NOT NULL,
ADD COLUMN     "ticketSaleId" TEXT NOT NULL,
DROP COLUMN "gasWeiPrice",
ADD COLUMN     "gasWeiPrice" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Roll" (
    "id" TEXT NOT NULL,
    "ticketSaleId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "gasWeiPrice" INTEGER NOT NULL,
    "transactionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Roll_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Deposit" ADD CONSTRAINT "Deposit_ticketSaleId_fkey" FOREIGN KEY ("ticketSaleId") REFERENCES "TicketSale"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Roll" ADD CONSTRAINT "Roll_ticketSaleId_fkey" FOREIGN KEY ("ticketSaleId") REFERENCES "TicketSale"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Roll" ADD CONSTRAINT "Roll_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
