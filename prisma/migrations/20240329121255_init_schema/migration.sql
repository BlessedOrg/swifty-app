-- CreateEnum
CREATE TYPE "Stage" AS ENUM ('LOTTERY_V1', 'LOTTERY_V2', 'AUCTION_V1', 'AUCTION_V2');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT,
    "walletAddr" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Deposit" (
    "id" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "transactionId" TEXT NOT NULL,
    "walletAddress" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Deposit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Withdraw" (
    "id" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "transactionId" TEXT NOT NULL,
    "walletAddress" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Withdraw_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TicketMint" (
    "id" TEXT NOT NULL,
    "txHash" TEXT NOT NULL,
    "tokenId" TEXT NOT NULL,
    "contractAddr" TEXT NOT NULL,
    "walletAddress" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TicketMint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TicketSale" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "lotteryV1contractAddr" TEXT,
    "lotteryV2contractAddr" TEXT,
    "auctionV1contractAddr" TEXT,
    "auctionV2contractAddr" TEXT,
    "lotteryV1settings" JSONB,
    "lotteryV2settings" JSONB,
    "auctionV1settings" JSONB,
    "auctionV2settings" JSONB,
    "description" TEXT,
    "coverUrl" TEXT,
    "sellerId" TEXT NOT NULL,
    "startsAt" TIMESTAMP(3),
    "finishAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TicketSale_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SaleParticipant" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "ticketSaleId" TEXT NOT NULL,
    "randomNumber" INTEGER,
    "stage" "Stage" DEFAULT 'LOTTERY_V1',
    "winner" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SaleParticipant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Deposit" ADD CONSTRAINT "Deposit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Withdraw" ADD CONSTRAINT "Withdraw_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TicketMint" ADD CONSTRAINT "TicketMint_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TicketSale" ADD CONSTRAINT "TicketSale_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaleParticipant" ADD CONSTRAINT "SaleParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaleParticipant" ADD CONSTRAINT "SaleParticipant_ticketSaleId_fkey" FOREIGN KEY ("ticketSaleId") REFERENCES "TicketSale"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
