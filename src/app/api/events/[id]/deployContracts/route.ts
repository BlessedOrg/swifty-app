export const maxDuration = 300;
import { log, LogType, ticketSale } from "@/prisma/models";
import { createErrorLog, deployFactoryContract, createSale, incrementNonce, initializeNonce, setBaseContracts, requestRandomNumber, setSeller, setRollTolerance } from "services/contracts/deploy";
import { getExplorerUrl, PrefixedHexString } from "services/web3Config";
import { account, contractsInterfaces, publicClient } from "services/viem";
import { createGelatoTask } from "services/gelato";
import { NextResponse } from "next/server";

export async function GET(req, { params: { id } }) {
  console.time("📜 Deploying Smart Contracts...");
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

    if (!sale) throw new Error(`sale not found`);
    if (sale?.lotteryV1contractAddr) throw new Error(`LotteryV1 already deployed`);
    if (sale?.lotteryV2contractAddr) throw new Error(`LotteryV2 already deployed`);
    if (sale?.auctionV1contractAddr) throw new Error(`AuctionV1 already deployed`);
    if (sale?.auctionV2contractAddr) throw new Error(`AuctionV2 already deployed`);

    let updateAttrs = {};
    const abi = contractsInterfaces["BlessedFactory"].abi;
    await initializeNonce();

    const deployedContract = await deployFactoryContract();
    incrementNonce();
    const baseContractsReceipt = await setBaseContracts(deployedContract?.contractAddr, abi, sellerId);
    incrementNonce();
    const createSaleReceipt = await createSale(deployedContract?.contractAddr, abi, sale, account.address);
    incrementNonce();

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
    const lotteryV1NftAddress = await publicClient.readContract({
      address: lotteryV1Address as PrefixedHexString,
      abi: contractsInterfaces["LotteryV1"].abi,
      functionName: "nftContractAddr",
    });

    const lotteryV2Address = await publicClient.readContract({
      address: deployedContract.contractAddr,
      abi,
      functionName: 'sales',
      args: [Number(currentIndex) - 1, 1]
    });
    const lotteryV2NftAddress = await publicClient.readContract({
      address: lotteryV2Address as PrefixedHexString,
      abi: contractsInterfaces["LotteryV2"].abi,
      functionName: "nftContractAddr",
    });

    const auctionV1Address = await publicClient.readContract({
      address: deployedContract.contractAddr,
      abi,
      functionName: 'sales',
      args: [Number(currentIndex) - 1, 2]
    });
    const auctionV1NftAddress = await publicClient.readContract({
      address: auctionV1Address as PrefixedHexString,
      abi: contractsInterfaces["AuctionV1"].abi,
      functionName: "nftContractAddr",
    });

    const auctionV2Address = await publicClient.readContract({
      address: deployedContract.contractAddr,
      abi,
      functionName: 'sales',
      args: [Number(currentIndex) - 1, 3]
    });
    const auctionV2NftAddress = await publicClient.readContract({
      address: auctionV2Address as PrefixedHexString,
      abi: contractsInterfaces["AuctionV2"].abi,
      functionName: "nftContractAddr",
    });

    const addresses: any[] = [
      lotteryV1Address,
      lotteryV1NftAddress,
      lotteryV2Address,
      lotteryV2NftAddress,
      auctionV1Address,
      auctionV1NftAddress,
      auctionV2Address,
      auctionV2NftAddress
    ];
    if (addresses.includes("0x0000000000000000000000000000000000000000")) {
      throw new Error(`There was a problem with deploying contracts. Contact the admin for details. Sale ID: ${sale?.id}`)
    }

    console.log({
      lotteryV1Address: getExplorerUrl({ address: lotteryV1Address as string }),
      lotteryV1NftAddress: getExplorerUrl({ address: lotteryV1NftAddress as string }),
      lotteryV2Address: getExplorerUrl({ address: lotteryV2Address as string }),
      lotteryV2NftAddress: getExplorerUrl({ address: lotteryV2NftAddress as string }),
      auctionV1Address: getExplorerUrl({ address: auctionV1Address as string }),
      auctionV1NftAddress: getExplorerUrl({ address: auctionV1NftAddress as string }),
      auctionV2Address: getExplorerUrl({ address: auctionV2Address as string }),
      auctionV2NftAddress: getExplorerUrl({ address: auctionV2NftAddress as string }),
    });

    let lotteryV1Task: any;
    let lotteryV2Task: any;

    let auctionV1Task: any;
    if (lotteryV1Address) lotteryV1Task = await createGelatoTask(lotteryV1Address as any, "LotteryV1", sale.id);
    if (lotteryV2Address) lotteryV2Task = await createGelatoTask(lotteryV2Address as any, "LotteryV2", sale.id);
    if (auctionV1Address) auctionV1Task = await createGelatoTask(auctionV1Address as any, "AuctionV1", sale.id);

    let l1RandomNumberReceipt: any = null;
    let l1SetSellerReceipt: any = null;
    let l2RandomNumberReceipt: any = null;
    let l2SetSellerReceipt: any = null;
    let a1RandomNumberReceipt: any = null;
    let a1SetSellerReceipt: any = null;

    if (lotteryV1Address) {
      // l1RandomNumberReceipt = await requestRandomNumber(lotteryV1Address, contractsInterfaces["LotteryV1"].abi, sellerId);
      // incrementNonce();
      l1SetSellerReceipt = await setSeller(lotteryV1Address, contractsInterfaces["LotteryV1"].abi, sale.seller);
      incrementNonce();
    }

    if (lotteryV2Address) {
      l2RandomNumberReceipt = await requestRandomNumber(lotteryV2Address, contractsInterfaces["LotteryV2"].abi, sellerId);
      incrementNonce();
      l2SetSellerReceipt = await setSeller(lotteryV2Address, contractsInterfaces["LotteryV2"].abi, sale.seller);
      incrementNonce();
    }

    if (auctionV1Address) {
      // a1RandomNumberReceipt = await requestRandomNumber(auctionV1Address, contractsInterfaces["AuctionV1"].abi, sellerId);
      // incrementNonce();
      a1SetSellerReceipt = await setSeller(auctionV1Address, contractsInterfaces["AuctionV1"].abi, sale.seller);
      incrementNonce();
    }

    updateAttrs = {
      lotteryV1contractAddr: lotteryV1Address,
      lotteryV2contractAddr: lotteryV2Address,
      auctionV1contractAddr: auctionV1Address,
      auctionV2contractAddr: auctionV2Address,
      lotteryV1nftAddr: lotteryV1NftAddress,
      lotteryV2nftAddr: lotteryV2NftAddress,
      auctionV1nftAddr: auctionV1NftAddress,
      auctionV2nftAddr: auctionV2NftAddress,
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

    const totalGasSaved =
      deployedContract.gasPrice +
      Number(baseContractsReceipt.gasUsed) * Number(baseContractsReceipt.effectiveGasPrice) +
      Number(createSaleReceipt.gasUsed) * Number(createSaleReceipt.effectiveGasPrice) +
      (lotteryV1Address
          ? (
            // Number(l1RandomNumberReceipt?.gasUsed) * Number(l1RandomNumberReceipt?.effectiveGasPrice) +
            Number(l1SetSellerReceipt?.gasUsed) * Number(l1SetSellerReceipt?.effectiveGasPrice)
          )
          : 0
      )
      +
      (lotteryV2Address
          ? (
            Number(l2RandomNumberReceipt?.gasUsed) * Number(l2RandomNumberReceipt?.effectiveGasPrice) +
            Number(l2SetSellerReceipt?.gasUsed) * Number(l2SetSellerReceipt?.effectiveGasPrice)
          )
          : 0
      )
      +
      (auctionV1Address
          ? (
            // Number(a1RandomNumberReceipt?.gasUsed) * Number(a1RandomNumberReceipt?.effectiveGasPrice) +
            Number(a1SetSellerReceipt?.gasUsed) * Number(a1SetSellerReceipt?.effectiveGasPrice)
          )
          : 0
      );

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


    return NextResponse.json(
      {
        error: null,
        eventId: newTicketSale?.id,
        contractAddr: deployedContract.contractAddr,
        lotteryV1contractAddr: lotteryV1Address,
        lotteryV2contractAddr: lotteryV2Address,
        auctionV1contractAddr: auctionV1Address,
        auctionV2contractAddr: auctionV2Address,
        l1RandomNumberHash: (l1RandomNumberReceipt as any)?.transactionHash ?? null,
        l1SetSellerHash: (l1SetSellerReceipt as any)?.transactionHash ?? null,
        l2RandomNumberHash: (l2RandomNumberReceipt as any)?.transactionHash ?? null,
        l2SetSellerHash: (l2SetSellerReceipt as any)?.transactionHash ?? null,
        a1RandomNumberHash: (a1RandomNumberReceipt as any)?.transactionHash ?? null,
        a1SetSellerHash: (a1SetSellerReceipt as any)?.transactionHash ?? null,
      },
      { status: 200 },

    );
  } catch (error) {
    console.log("🚨 Error while deploying Smart Contracts: ", (error as any).message)
    if (sellerId) {
      await createErrorLog(sellerId, (error as any).message);
    }
    return NextResponse.json({ error: (error as any)?.message }, { status: 400 });
  } finally {
    console.timeEnd("📜 Deploying Smart Contracts...");
  }
}
