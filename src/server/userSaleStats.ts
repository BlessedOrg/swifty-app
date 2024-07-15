"use server";
import { userSale } from "@/prisma/models";


export async function createOrUpdateUserSaleStats(body: UserSaleStats) {
  const { userId, ticketSaleId, saleId, ...rest } = body;
  const existingUserSale = await userSale.findFirst({
    where: {
        ticketSaleId,
      userId
    },
  });

  if (!existingUserSale) {
    return userSale.create({
      data: {
          ticketSaleId,
          userId,
        ...rest,
      },
    });
  } else {
    const updateData: any = { ...rest };

    const fieldsToIncrement = [
      "lotteryV1depositedAmount",
      "lotteryV2depositedAmount",
      "auctionV1depositedAmount",
      "auctionV2depositedAmount",
        "lotteryV2RollQuantity"
    ];

      fieldsToIncrement.forEach((field) => {
      if (rest[field] !== undefined) {
        updateData[field] = (existingUserSale[field] || 0) + rest[field];
      }
    });

    return userSale.update({
      where: {
        id: existingUserSale.id,
        userId,
        ticketSaleId
      },
      data: {
        ...updateData,
      },
    });
  }
}
