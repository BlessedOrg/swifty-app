import { NextResponse } from "next/server";
import { contractsInterfaces } from "services/viem";
import { ticketMint } from "@/prisma/models";
import { readSmartContract } from "@/utils/contracts/contracts";
import { fetcher } from "requests/requests";
import { getUser } from "@/server/auth";

export async function GET() {
  try {
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
    console.log("🦦 userId: ", userId)

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

    console.log("🦦 mints: ", mints)

    const deletedMints: any = [];
    for (const mint of mints) {
      console.log("🦦 mint (loop): ", mint)
      const onChainBalance = await readSmartContract(
        mint?.contractAddr,
        contractsInterfaces["NftTicket"].abi,
        "balanceOf",
        [mint?.walletAddress, mint?.tokenId] as any
      );
      console.log("🦦 onChainBalance (loop): ", onChainBalance)

      if (Number(onChainBalance) === 0) {
        const deletedMint = await ticketMint.delete({
          where: {
            id: mint?.id,
          },
        });
        console.log("🦦 deletedMint (loop): ", deletedMint)
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

    console.log("🦦 mints: ", mints)

    const updateMintData = async () => {
      let updatedMints: any = [];
      for (const mint of mints) {
        console.log("🦦 mint (updateMintData loop): ", mint)
        const metadata = await fetcher(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/ticket-metadata/${mint.ticketSale.id}/${mint.tokenId}`
        );
        updatedMints.push({ ...mint, metadata });
      }
      return updatedMints;
    };

    const mintsWithNftMetadata = await updateMintData();
    console.log("🦦 mintsWithNftMetadata: ", mintsWithNftMetadata)

    return NextResponse.json(
      {
        mints: mintsWithNftMetadata,
        deletedMints,
      },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    console.log("🚨 Error on endpoint myTickets:", error.message);
    return NextResponse.json(
      { error: error.message },
      {
        status: 400,
      }
    );
  }
}
