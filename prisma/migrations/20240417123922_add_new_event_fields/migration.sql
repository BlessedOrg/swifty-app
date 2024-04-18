/*
  Warnings:

  - Added the required column `country` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `category` to the `TicketSale` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "EventCategory" AS ENUM ('concert', 'conference', 'event');

-- CreateEnum
CREATE TYPE "TicketType" AS ENUM ('free', 'paid');

-- AlterTable
ALTER TABLE "Address" ADD COLUMN     "country" TEXT NOT NULL,
ALTER COLUMN "street1stLine" DROP NOT NULL,
ALTER COLUMN "street2ndLine" DROP NOT NULL,
ALTER COLUMN "postalCode" DROP NOT NULL,
ALTER COLUMN "countryCode" DROP NOT NULL,
ALTER COLUMN "phoneNumber" DROP NOT NULL;

-- AlterTable
ALTER TABLE "TicketSale" ADD COLUMN     "category" "EventCategory" NOT NULL,
ADD COLUMN     "cooldownTime" INTEGER,
ADD COLUMN     "eventLocationId" TEXT,
ADD COLUMN     "hosts" JSONB,
ADD COLUMN     "price" INTEGER,
ADD COLUMN     "priceIncrease" INTEGER,
ADD COLUMN     "timezone" TEXT,
ADD COLUMN     "type" "TicketType";

-- CreateTable
CREATE TABLE "Speaker" (
    "id" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Speaker_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventLocation" (
    "id" TEXT NOT NULL,
    "street1stLine" TEXT,
    "street2ndLine" TEXT,
    "postalCode" TEXT,
    "city" TEXT NOT NULL,
    "countryCode" TEXT,
    "country" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "locationDetails" TEXT,

    CONSTRAINT "EventLocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_SpeakerToTicketSale" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Speaker_name_key" ON "Speaker"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_SpeakerToTicketSale_AB_unique" ON "_SpeakerToTicketSale"("A", "B");

-- CreateIndex
CREATE INDEX "_SpeakerToTicketSale_B_index" ON "_SpeakerToTicketSale"("B");

-- AddForeignKey
ALTER TABLE "TicketSale" ADD CONSTRAINT "TicketSale_eventLocationId_fkey" FOREIGN KEY ("eventLocationId") REFERENCES "EventLocation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SpeakerToTicketSale" ADD CONSTRAINT "_SpeakerToTicketSale_A_fkey" FOREIGN KEY ("A") REFERENCES "Speaker"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SpeakerToTicketSale" ADD CONSTRAINT "_SpeakerToTicketSale_B_fkey" FOREIGN KEY ("B") REFERENCES "TicketSale"("id") ON DELETE CASCADE ON UPDATE CASCADE;
