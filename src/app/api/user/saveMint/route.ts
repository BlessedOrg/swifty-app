import { NextResponse } from "next/server";
import { getUser } from "../../auth/[...thirdweb]/thirdwebAuth";
import { ticketMint } from "@/prisma/models";
import { z } from "zod";

const schema = z.object({
  txHash: z.string(),
  tokenId: z.number(),
  contractAddr: z.string(),
  gasWeiPrice: z.number(),
  winnerAddr: z.string(),
  eventId: z.string()
})

export async function POST(req: Request) {
  const body = await req.json();
  const parsedBody = schema.safeParse(body);

  if (!parsedBody.success) {
    return NextResponse.json(
      {
        error: parsedBody.error,
      },
      { status: 400 },
    );
  }

  const data = await getUser();

  const mint = await ticketMint.create({
    data: {
      txHash: parsedBody.data.txHash,
      tokenId: String(parsedBody.data.tokenId),
      contractAddr: parsedBody.data.contractAddr,
      gasWeiPrice: String(parsedBody.data.gasWeiPrice),
      walletAddress: (data as any)?.data?.address,
      userId: (data as any)?.data?.userId,
      ticketSaleId: parsedBody.data.eventId
    }
  });

  return NextResponse.json(
    {
      mint,
    },
    {
      status: 200,
    },
  );
}
