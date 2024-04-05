import { z } from "zod";
import { ticketSale, user } from "../../../prisma/models";
import type { NextApiRequest, NextApiResponse } from 'next';

const schema = z.object({
  title: z.string(),
  sellerEmail: z.string(),
  sellerWalletAddr: z.string().length(42),
  description: z.string().optional(), 
  coverUrl: z.string().optional(),
  startsAt: z.string().datetime().optional(),
  finishAt: z.string().datetime().optional(),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const parsedBody = schema.safeParse(req.body);

    if (!parsedBody.success) {
      return res.status(400).json({
        error: parsedBody.error,
      });
    }

    const { title, sellerEmail, sellerWalletAddr, description, coverUrl, startsAt, finishAt } = parsedBody.data;
    const seller = await user.upsert({
      where: {
        email: sellerEmail,
      },
      update: {},
      create: {
        email: sellerEmail,
        walletAddr: sellerWalletAddr,
      },
    })

    const sale = await ticketSale.create({
      data: {
        title,
        sellerId: seller.id,
        description,
        coverUrl,
        startsAt,
        finishAt,
      },
    });
    
    
    return res.status(200).json({ error: null, ticketSale: sale })
  } catch (error) {
    return res.status(400).json({ error: error?.message })
  }
}