export const maxDuration = 300;
import { log, LogType, ticketSale } from "@/prisma/models";
import { createErrorLog, createSale, requestRandomNumber, setBaseContracts, setSeller } from "services/contracts/deploy";
import { account, contractsInterfaces, deployFactoryContract, publicClient, getNonce, waitForTransactionReceipt } from "services/viem";
import { createGelatoTask } from "services/gelato";
import { NextResponse } from "next/server";

export async function GET(req, { params: { id } }) {
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

    if (sale?.lotteryV1contractAddr) {
      throw new Error(`LotteryV1 already deployed`);
    }
    if (sale?.lotteryV2contractAddr) {
      throw new Error(`LotteryV2 already deployed`);
    }
    if (sale?.auctionV1contractAddr) {
      throw new Error(`AuctionV1 already deployed`);
    }
    if (sale?.auctionV2contractAddr) {
      throw new Error(`AuctionV2 already deployed`);
    }

    let updateAttrs = {};
    let nonce = await getNonce();
    const deployedContract = await deployFactoryContract(nonce);
    const abi = contractsInterfaces["BlessedFactory"].abi;

    const baseContractsReceipt = await setBaseContracts(deployedContract?.contractAddr, abi, nonce, sellerId);
    const createSaleReceipt = await createSale(deployedContract?.contractAddr, abi, nonce, sale, account.address);

    const currentIndex: any = await publicClient.readContract({
      address: deployedContract.contractAddr,
      abi,
      functionName: 'currentIndex',
      args: []
    });

    const lotteryV1Address = await publicClient.readContract({
      address: deployedContract.contractAddr,
      abi,
      functionName: 'sales',
      args: [Number(currentIndex) - 1, 0]
    });
    const lotteryV2Address = await publicClient.readContract({
      address: deployedContract.contractAddr,
      abi,
      functionName: 'sales',
      args: [Number(currentIndex) - 1, 1]
    });
    const auctionV1Address = await publicClient.readContract({
      address: deployedContract.contractAddr,
      abi,
      functionName: 'sales',
      args: [Number(currentIndex) - 1, 2]
    });
    const auctionV2Address = await publicClient.readContract({
      address: deployedContract.contractAddr,
      abi,
      functionName: 'sales',
      args: [Number(currentIndex) - 1, 3]
    });

    const addresses: any[] = [
      lotteryV1Address,
      lotteryV2Address,
      auctionV1Address,
      auctionV2Address
    ];
    if (addresses.includes("0x0000000000000000000000000000000000000000")) {
      throw new Error(`There was a problem with deploying contracts. Contact the admin for details. Sale ID: ${sale.id}`)
    }

    let lotteryV1Task: any;
    let lotteryV2Task: any;
    let auctionV1Task: any;
    if (lotteryV1Address) lotteryV1Task = await createGelatoTask(lotteryV1Address as any, "LotteryV1", sale.id);
    if (lotteryV2Address) lotteryV2Task = await createGelatoTask(lotteryV2Address as any, "LotteryV2", sale.id);
    if (auctionV1Address) auctionV1Task = await createGelatoTask(auctionV1Address as any, "AuctionV1", sale.id);

    const l1RandomNumberReceipt = await requestRandomNumber(lotteryV1Address, contractsInterfaces["LotteryV1"].abi, nonce, sellerId);
    const l1SetSellerReceipt = await setSeller(lotteryV1Address, contractsInterfaces["LotteryV1"].abi, nonce, sale.seller);

    const l2RandomNumberReceipt = await requestRandomNumber(lotteryV2Address, contractsInterfaces["LotteryV2"].abi, nonce, sellerId);
    const l2SetSellerReceipt = await setSeller(lotteryV2Address, contractsInterfaces["LotteryV2"].abi, nonce, sale.seller);

    const a1RandomNumberReceipt = await requestRandomNumber(auctionV1Address, contractsInterfaces["AuctionV1"].abi, nonce, sellerId);
    const a1SetSellerReceipt = await setSeller(auctionV1Address, contractsInterfaces["AuctionV1"].abi, nonce, sale.seller);

    updateAttrs = {
      lotteryV1contractAddr: lotteryV1Address,
      lotteryV2contractAddr: lotteryV2Address,
      auctionV1contractAddr: auctionV1Address,
      auctionV2contractAddr: auctionV2Address,
      lotteryV1settings: {
        ...sale.lotteryV1settings as any,
        gelatoTaskId: lotteryV1Task?.taskId,
        gelatoTaskHash: lotteryV1Task?.tx.hash
      },
      lotteryV2settings: {
        ...sale.lotteryV2settings as any,
        gelatoTaskId: lotteryV2Task?.taskId,
        gelatoTaskHash: lotteryV2Task?.tx.hash
      },
      auctionV1settings: {
        ...sale.auctionV1settings as any,
        gelatoTaskId: auctionV1Task?.taskId,
        gelatoTaskHash: auctionV1Task?.tx.hash
      },
      factoryContractAddr: deployedContract.contractAddr,
      factoryContractCurrentIndex: Number(currentIndex),
    };

    const newTicketSale = await ticketSale.update({
      where: {
        id: sale.id,
      },
      data: updateAttrs,
    });

    if (newTicketSale) {
      await log.create({
        data: {
          userId: sale.seller.id,
          type: LogType["ticketSaleCreationSuccess"],
          payload: {
            ...updateAttrs
          }
        },
      })
    }

    console.log({
      contractAddr: deployedContract.contractAddr,
      lotteryV1contractAddr: lotteryV1Address,
      lotteryV2contractAddr: lotteryV2Address,
      auctionV1contractAddr: auctionV1Address,
      auctionV2contractAddr: auctionV2Address
    });

    const totalGasSaved =
      deployedContract.gasPrice +
      Number(baseContractsReceipt.gasUsed) * Number(baseContractsReceipt.effectiveGasPrice) +
      Number(createSaleReceipt.gasUsed) * Number(createSaleReceipt.effectiveGasPrice) +
      Number(l1RandomNumberReceipt.gasUsed) * Number(l1RandomNumberReceipt.effectiveGasPrice) +
      Number(l1SetSellerReceipt.gasUsed) * Number(l1SetSellerReceipt.effectiveGasPrice) +
      Number(l2RandomNumberReceipt.gasUsed) * Number(l2RandomNumberReceipt.effectiveGasPrice) +
      Number(l2SetSellerReceipt.gasUsed) * Number(l2SetSellerReceipt.effectiveGasPrice) +
      Number(a1RandomNumberReceipt.gasUsed) * Number(a1RandomNumberReceipt.effectiveGasPrice) +
      Number(a1SetSellerReceipt.gasUsed) * Number(a1SetSellerReceipt.effectiveGasPrice);

    const gasSavedLog = await log.create({
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

    return NextResponse.json(
      {
        error: null,
        contractAddr: deployedContract.contractAddr,
        lotteryV1contractAddr: lotteryV1Address,
        lotteryV2contractAddr: lotteryV2Address,
        auctionV1contractAddr: auctionV1Address,
        auctionV2contractAddr: auctionV2Address
      },
      { status: 200 },
    );
  } catch (error) {
    console.log("🚨 Error while deploying Smart Contracts: ", (error as any).message)
    if (sellerId) {
      await createErrorLog(sellerId, (error as any).message);
    }
    return NextResponse.json({ error: (error as any)?.message }, { status: 400 });
  }
}
