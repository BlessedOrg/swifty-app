import { z } from "zod";
import { ticketSale, user } from "@/prisma/models";
import { NextResponse } from "next/server";

const schema = z.object({
  title: z.string(),
  sellerEmail: z.string(),
  sellerWalletAddr: z.string().length(42),
  description: z.string().optional(),
  coverUrl: z.string().optional(),
  startsAt: z.string().datetime().optional(),
  finishAt: z.string().datetime().optional(),
});

export async function POST(req: Request, res: Response) {
  const body = await req.json();
  try {
    const parsedBody = schema.safeParse(body);

    if (!parsedBody.success) {
      return NextResponse.json(
        {
          error: parsedBody.error,
        },
        { status: 400 },
      );
    }

    const {
      title,
      sellerEmail,
      sellerWalletAddr,
      description,
      coverUrl,
      startsAt,
      finishAt,
    } = parsedBody.data;
    const seller = await user.upsert({
      where: {
        email: sellerEmail,
      },
      update: {},
      create: {
        email: sellerEmail,
        walletAddr: sellerWalletAddr,
      },
    });

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

    return NextResponse.json(
      { error: null, ticketSale: sale },
      { status: 200 },
    );
  } catch (error) {
    const errInstance = error as any;
    return NextResponse.json({ error: errInstance?.message }, { status: 400 });
  }
}
