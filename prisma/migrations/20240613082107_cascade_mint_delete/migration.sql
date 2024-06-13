-- DropForeignKey
ALTER TABLE "TicketMint" DROP CONSTRAINT "TicketMint_ticketSaleId_fkey";

-- AddForeignKey
ALTER TABLE "TicketMint" ADD CONSTRAINT "TicketMint_ticketSaleId_fkey" FOREIGN KEY ("ticketSaleId") REFERENCES "TicketSale"("id") ON DELETE CASCADE ON UPDATE CASCADE;
