-- CreateTable
CREATE TABLE "UserSale" (
    "id" TEXT NOT NULL,
    "lotteryV1Participant" BOOLEAN NOT NULL DEFAULT false,
    "lotteryV2Participant" BOOLEAN NOT NULL DEFAULT false,
    "auctionV1Participant" BOOLEAN NOT NULL DEFAULT false,
    "auctionV2Participant" BOOLEAN NOT NULL DEFAULT false,
    "ticketSaleId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "lotteryV1depositedAmount" DOUBLE PRECISION DEFAULT 0,
    "lotteryV2depositedAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "auctionV1depositedAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "auctionV2depositedAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "lotteryV2RollQuantity" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserSale_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserSale" ADD CONSTRAINT "UserSale_ticketSaleId_fkey" FOREIGN KEY ("ticketSaleId") REFERENCES "TicketSale"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSale" ADD CONSTRAINT "UserSale_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
