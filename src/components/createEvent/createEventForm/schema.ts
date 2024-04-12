import { z } from "zod";

export const eventSchema = z.object({
  title: z.string(),
  sellerEmail: z.string(),
  sellerWalletAddr: z.string().length(42),
  description: z.string().optional(),
  coverUrl: z.string().optional(),
  startsAt: z.any().optional(),
  finishAt: z.any().optional(),
  location: z.object({
    label: z.string(),
    value: z.object({
      label: z.string(),
      x: z.number(),
      y: z.number(),
    }),
  }),
});
