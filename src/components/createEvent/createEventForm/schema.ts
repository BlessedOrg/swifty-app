import { z } from "zod";

export const eventSchema = (isFree) => {
  const requiredBasedOnType = !isFree
    ? z.string({ required_error: "Required field." }).min(1, "Required field!")
    : z.string().optional();
  return z.object({
    title: z.string().min(3, "Title is required!"),
    sellerEmail: z.string(),
    sellerWalletAddr: z.string().length(42),
    description: z.string().optional(),
    coverUrl: z.string().optional(),
    startsAt: z.any({ required_error: "Start date is required!" }),
    finishAt: z.any({ required_error: "Finish date is required!" }),
    timezone: z.string().optional(),
    location: z.object(
      {
        label: z.string(),
        value: z.object({
          label: z.string(),
          x: z.number(),
          y: z.number(),
        }),
      },
      { required_error: "Location is required." },
    ),
    locationDetails: z.string().optional(),
    price: requiredBasedOnType,
    priceIncrease: z.string().optional(),
    cooldownTime: z.string().optional(),
    lotteryV1settings: z.object({
      phaseDuration: z.string().optional(),
      ticketsAmount: requiredBasedOnType,
    }),
    lotteryV2settings: z.object({
      phaseDuration: z.string().optional(),
      ticketsAmount: requiredBasedOnType,
    }),
    auctionV1settings: z.object({
      phaseDuration: z.string().optional(),
      ticketsAmount: requiredBasedOnType,
    }),
    auctionV2settings: z.object({
      phaseDuration: z.string().optional(),
      ticketsAmount: requiredBasedOnType,
    }),
    type: z.enum(["free", "paid"]),
  });
};
