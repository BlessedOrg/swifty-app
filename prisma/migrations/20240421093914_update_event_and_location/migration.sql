-- AlterTable
ALTER TABLE "EventLocation" ADD COLUMN     "cityLatitude" TEXT,
ADD COLUMN     "cityLongitude" TEXT,
ADD COLUMN     "continent" TEXT,
ADD COLUMN     "countryFlag" TEXT,
ADD COLUMN     "countryLatitude" TEXT,
ADD COLUMN     "countryLongitude" TEXT,
ADD COLUMN     "stateCode" TEXT;

-- AlterTable
ALTER TABLE "TicketSale" ADD COLUMN     "subtitle" TEXT;
