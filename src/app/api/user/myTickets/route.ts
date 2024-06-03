import { NextResponse } from "next/server";
import { getUser } from "../../auth/[...thirdweb]/thirdwebAuth";
import { contractsInterfaces } from "services/viem";
import { ticketMint } from "@/prisma/models";
import { readSmartContract } from "@/utils/contracts/contracts";

export async function GET() {
  const data = await getUser();
  const userId = (data as any)?.data?.userId;

  let mints = await ticketMint.findMany({
    where: {
      userId: userId,
    },
    select: {
      id: true,
      contractAddr: true,
      walletAddress: true,
      tokenId: true
    }
  });

  const deletedMints: any = [];
  for (const mint of mints) {
    const onChainBalance = await readSmartContract(
      mint?.contractAddr,
      contractsInterfaces["NftTicket"].abi,
      "balanceOf",
      [mint?.walletAddress, mint?.tokenId] as any
    );

    if (Number(onChainBalance) === 0) {
      const deletedMint = await ticketMint.delete({
        where: {
          id: mint?.id
        }
      });
      deletedMints.push(deletedMint)
    }
  }

  mints = await ticketMint.findMany({
    where: {
      userId: userId,
    },
    include: {
      ticketSale: true
    }
  });

  return NextResponse.json(
    {
      mints,
      deletedMints
    },
    {
      status: 200,
    },
  );
}
