import { NextResponse } from "next/server";
import { contractsInterfaces } from "services/viem";
import { ticketMint } from "@/prisma/models";
import { readSmartContract } from "@/utils/contracts/contracts";
import { fetcher } from "../../../../requests/requests";
import { getUser } from "@/server/auth";

export async function GET() {
  const data = await getUser();

  if (data?.error) {
    return NextResponse.json(
      {
        error: data.error,
      },
      {
        status: 500,
      }
    );
  }
  const userId = (data as any)?.data?.id;

  let mints = (await ticketMint.findMany({
    where: {
      userId: userId,
    },
    select: {
      id: true,
      contractAddr: true,
      walletAddress: true,
      tokenId: true,
    },
  })) as any;

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
          id: mint?.id,
        },
      });
      deletedMints.push(deletedMint);
    }
  }

  mints = await ticketMint.findMany({
    where: {
      userId: userId,
    },
    include: {
      ticketSale: true,
    },
  });

  const updateMintData = async () => {
    let updatedMints: any = [];
    for (const mint of mints) {
      const metadata = await fetcher(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/ticket-metadata/${mint.ticketSale.id}/${mint.tokenId}`
      );
      updatedMints.push({ ...mint, metadata });
    }
    return updatedMints;
  };

  const mintsWithNftMetadata = await updateMintData();

  return NextResponse.json(
    {
      mints: mintsWithNftMetadata,
      deletedMints,
    },
    {
      status: 200,
    }
  );
}
