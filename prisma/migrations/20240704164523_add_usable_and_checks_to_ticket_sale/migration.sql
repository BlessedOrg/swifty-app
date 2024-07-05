-- AlterTable
ALTER TABLE "TicketSale" ADD COLUMN     "checks" JSONB,
ADD COLUMN     "usable" BOOLEAN NOT NULL DEFAULT false;
