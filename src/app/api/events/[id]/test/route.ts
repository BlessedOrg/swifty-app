export const maxDuration = 300;
import { log, ticketSale } from "@/prisma/models";
import { createErrorLog, requestRandomNumber, setRollTolerance, setSeller } from "services/contracts/deploy";
import { contractsInterfaces, getNonce } from "services/viem";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function GET(req, { params: { id } }) {
  console.time("📜 Configuring Smart Contracts...");
  // revalidatePath(req.url);
  let sellerId;
  try {
    const sale = await ticketSale.findUnique({
      where: {
        id: id as string,
      },
      include: {
        seller: true,
      },
    });
    sellerId = sale?.seller?.id;

    if (!sale) {
      throw new Error(`sale not found`);
    }

    let nonce = await getNonce();

    const l1RandomNumberReceipt = await requestRandomNumber(sale?.lotteryV1contractAddr, contractsInterfaces["LotteryV1"].abi, nonce, sellerId);
    nonce++;
    const l1SetSellerReceipt = await setSeller(sale?.lotteryV1contractAddr, contractsInterfaces["LotteryV1"].abi, nonce, sale.seller);
    nonce++;

    const l2RandomNumberReceipt = await requestRandomNumber(sale?.lotteryV2contractAddr, contractsInterfaces["LotteryV2"].abi, nonce, sellerId);
    nonce++;
    const l2SetRollToleranceReceipt = await setRollTolerance(sale?.lotteryV2contractAddr, contractsInterfaces["LotteryV2"].abi, nonce, sale.seller, (sale as any)?.lotteryV2settings?.rollTolerance ?? 50);
    nonce++;
    const l2SetSellerReceipt = await setSeller(sale?.lotteryV2contractAddr, contractsInterfaces["LotteryV2"].abi, nonce, sale.seller);
    nonce++;

    const a1RandomNumberReceipt = await requestRandomNumber(sale?.auctionV1contractAddr, contractsInterfaces["AuctionV1"].abi, nonce, sellerId);
    nonce++;
    const a1SetSellerReceipt = await setSeller(sale?.auctionV1contractAddr, contractsInterfaces["AuctionV1"].abi, nonce, sale.seller);
    nonce++;

    const totalGasSaved =
      Number(l1RandomNumberReceipt.gasUsed) * Number(l1RandomNumberReceipt.effectiveGasPrice) +
      Number(l1SetSellerReceipt.gasUsed) * Number(l1SetSellerReceipt.effectiveGasPrice) +
      Number(l2RandomNumberReceipt.gasUsed) * Number(l2RandomNumberReceipt.effectiveGasPrice) +
      Number(l2SetSellerReceipt.gasUsed) * Number(l2SetSellerReceipt.effectiveGasPrice) +
      Number(l2SetRollToleranceReceipt.gasUsed) * Number(l2SetRollToleranceReceipt.effectiveGasPrice) +
      Number(a1RandomNumberReceipt.gasUsed) * Number(a1RandomNumberReceipt.effectiveGasPrice) +
      Number(a1SetSellerReceipt.gasUsed) * Number(a1SetSellerReceipt.effectiveGasPrice);

    await log.create({
      data: {
        userId: sale?.seller?.id,
        type: "gasSaved",
        payload: {
          type: "saleCreation",
          gasSaved: totalGasSaved,
          saleId: sale.id
        }
      }
    });

    console.timeEnd("📜 Configuring Smart Contracts...");
    return NextResponse.json(
      {
        error: null,
        l1RandomNumberHash: l1RandomNumberReceipt.transactionHash,
        l1SetSellerHash: l1SetSellerReceipt.transactionHash,
        l2RandomNumberHash: l2RandomNumberReceipt.transactionHash,
        l2SetSellerHash: l2SetSellerReceipt.transactionHash,
        l2SetRollToleranceHash: l2SetRollToleranceReceipt.transactionHash,
        a1RandomNumberHash: a1RandomNumberReceipt.transactionHash,
        a1SetSellerHash: a1SetSellerReceipt.transactionHash,
      },
      {
        status: 200,
        // headers: {
        //   "Cache-Control": "no-store",
        // },
      },
    );
  } catch (error) {
    console.log("🚨 Error while deploying Smart Contracts: ", (error as any).message)
    if (sellerId) {
      await createErrorLog(sellerId, (error as any).message);
    }
    return NextResponse.json({ error: (error as any)?.message }, { status: 400 });
  }
}

export const dynamic = "force-dynamic";
const revalidate = 0;
