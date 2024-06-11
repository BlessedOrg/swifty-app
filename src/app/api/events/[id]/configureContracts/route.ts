export const maxDuration = 300;
import { log, ticketSale } from "@/prisma/models";
import { createErrorLog, incrementNonce, initializeNonce, requestRandomNumber, setRollTolerance, setSeller } from "services/contracts/deploy";
import { contractsInterfaces } from "services/viem";
import { NextResponse } from "next/server";

export async function GET(req, { params: { id } }) {
  console.time("📜 Configuring Smart Contracts...");
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

    await initializeNonce();

    const l1RandomNumberReceipt = await requestRandomNumber(sale?.lotteryV1contractAddr, contractsInterfaces["LotteryV1"].abi, sellerId);
    incrementNonce();
    const l1SetSellerReceipt = await setSeller(sale?.lotteryV1contractAddr, contractsInterfaces["LotteryV1"].abi, sale.seller);
    incrementNonce();

    const l2RandomNumberReceipt = await requestRandomNumber(sale?.lotteryV2contractAddr, contractsInterfaces["LotteryV2"].abi, sellerId);
    incrementNonce();
    const l2SetRollToleranceReceipt = await setRollTolerance(sale?.lotteryV2contractAddr, contractsInterfaces["LotteryV2"].abi, sale.seller, (sale as any)?.lotteryV2settings?.rollTolerance ?? 50);
    incrementNonce();
    const l2SetSellerReceipt = await setSeller(sale?.lotteryV2contractAddr, contractsInterfaces["LotteryV2"].abi, sale.seller);
    incrementNonce();

    const a1RandomNumberReceipt = await requestRandomNumber(sale?.auctionV1contractAddr, contractsInterfaces["AuctionV1"].abi, sellerId);
    incrementNonce();
    const a1SetSellerReceipt = await setSeller(sale?.auctionV1contractAddr, contractsInterfaces["AuctionV1"].abi, sale.seller);
    incrementNonce();

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
        status: 200 },
    );
  } catch (error) {
    console.log("🚨 Error while deploying Smart Contracts: ", (error as any).message)
    if (sellerId) {
      await createErrorLog(sellerId, (error as any).message);
    }
    return NextResponse.json({ error: (error as any)?.message }, { status: 400 });
  }
}
