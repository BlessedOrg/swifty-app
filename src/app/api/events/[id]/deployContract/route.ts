import { z } from "zod";
import { ticketSale } from "../../../../../../prisma/models";
import { deployContract } from "../../../../../services/viem";
import { NextResponse } from "next/server";

const schema = z.object({
  contract: z.enum(["LotteryV1", "LotteryV2", "AuctionV1", "AuctionV2"]),
});

export async function POST(req: Request, res: Response) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
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

    const sale = await ticketSale.findUnique({
      where: {
        id: id as string,
      },
      include: {
        seller: true,
      },
    });
    if (!sale) {
      throw new Error(`sale not found`);
    }

    const { contract } = parsedBody.data;

    let updateAttrs = {};
    let deployedContract;

    switch (contract) {
      case "LotteryV1":
        if (sale?.lotteryV1contractAddr) {
          throw new Error(`${contract} already deployed`);
        }

        deployedContract = await deployContract(contract, [
          sale.seller.walletAddr,
          process.env.NEXT_PUBLIC_GELATO_VRF_OPERATOR,
        ]);

        updateAttrs = {
          lotteryV1contractAddr: deployedContract.contractAddr,
        };
        break;
      case "LotteryV2":
        if (sale?.lotteryV2contractAddr) {
          throw new Error(`${contract} already deployed`);
        }

        deployedContract = await deployContract(contract, [
          sale.seller.walletAddr,
          process.env.NEXT_PUBLIC_GELATO_VRF_OPERATOR,
        ]);

        updateAttrs = {
          lotteryV2contractAddr: deployedContract.contractAddr,
        };
        break;

      case "AuctionV1":
        if (sale?.auctionV1contractAddr) {
          throw new Error(`${contract} already deployed`);
        }

        deployedContract = await deployContract(contract, [
          sale.seller.walletAddr,
          process.env.NEXT_PUBLIC_GELATO_VRF_OPERATOR,
        ]);

        updateAttrs = {
          auctionV1contractAddr: deployedContract.contractAddr,
        };
        break;
      case "AuctionV2":
        if (sale?.auctionV2contractAddr) {
          throw new Error(`${contract} already deployed`);
        }

        deployedContract = await deployContract(contract, [
          sale.seller.walletAddr,
        ]);

        updateAttrs = {
          auctionV2contractAddr: deployedContract.contractAddr,
        };
        break;
    }

    await ticketSale.update({
      where: {
        id: sale.id,
      },
      data: updateAttrs,
    });

    return NextResponse.json(
      { error: null, contractAddr: deployedContract.contractAddr },
      { status: 200 },
    );
  } catch (error) {
    const errInstance = error as any;
    return NextResponse.json({ error: errInstance?.message }, { status: 400 });
  }
}
