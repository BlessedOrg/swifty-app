-- DropForeignKey
ALTER TABLE "TicketSale" DROP CONSTRAINT "TicketSale_eventLocationId_fkey";

-- AddForeignKey
ALTER TABLE "TicketSale" ADD CONSTRAINT "TicketSale_eventLocationId_fkey" FOREIGN KEY ("eventLocationId") REFERENCES "EventLocation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
