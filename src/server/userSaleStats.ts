"use server";
import { deposit, roll } from "@/prisma/models";

export async function saveUserDeposit(body: {
  amount: number;
  phaseId: "lotteryV1" | "lotteryV2" | "auctionV1" | "auctionV2";
  gasWeiPrice: number;
  transactionId: string;
  userId: string;
  ticketSaleId: string;
}) {
  const { userId, ticketSaleId, ...rest } = body;
  return deposit.create({
    data: {
      ...rest,
      user: {
        connect: {
          id: userId,
        },
      },
      ticketSale: {
        connect: {
          id: ticketSaleId,
        },
      },
    },
  });
}
export async function saveUserRoll(body: {
  gasWeiPrice: number;
  transactionId: string;
  userId: string;
  ticketSaleId: string;
}) {
  const { userId, ticketSaleId, ...rest } = body;
  return roll.create({
    data: {
      ...rest,
      user: {
        connect: {
          id: userId,
        },
      },
      ticketSale: {
        connect: {
          id: ticketSaleId,
        },
      },
    },
  });
}
