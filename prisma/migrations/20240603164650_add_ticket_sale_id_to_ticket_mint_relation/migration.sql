/*
  Warnings:

  - Added the required column `ticketSaleId` to the `TicketMint` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TicketMint" ADD COLUMN     "ticketSaleId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "TicketMint" ADD CONSTRAINT "TicketMint_ticketSaleId_fkey" FOREIGN KEY ("ticketSaleId") REFERENCES "TicketSale"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
