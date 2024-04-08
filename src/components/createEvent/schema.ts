import { z } from "zod";

export const eventSchema = z.object({
  title: z.string(),
  sellerEmail: z.string(),
  sellerWalletAddr: z.string().length(42),
  description: z.string().optional(),
  coverUrl: z.string().optional(),
  startsAt: z.any().optional(),
  finishAt: z.any().optional(),
});
