export const maxDuration = 300;
import { log, LogType, ticketSale } from "@/prisma/models";
import { createErrorLog, deployFactoryContract, createSale, incrementNonce, initializeNonce, setBaseContracts, requestRandomNumber, setSeller, setRollTolerance, waitForRandomNumber } from "services/contracts/deploy";
import { getExplorerUrl, PrefixedHexString } from "services/web3Config";
import { account, contractsInterfaces, publicClient } from "services/viem";
import { createGelatoTask } from "services/gelato";
import { NextResponse } from "next/server";

export async function GET(req, { params: { id } }) {
  console.time("📜 Deploying Smart Contracts...");
  let sale: any;
  let factoryContractDeployHash = null;
  let setBaseContractsHash = null;
  let createSaleHash = null;
  let lotteryV1GelatoTaskHash = null;
  let lotteryV2GelatoTaskHash = null;
  let auctionV1GelatoTaskHash = null;
  let lotteryV2RandomNumberHash = null;
  let lotteryV2SetSellerHash = null;
  let factoryContractAddr = null;
  let factoryContractCurrentIndex: number | unknown = null;
  let lotteryV1Address: string | unknown = null;
  let lotteryV1GelatoTaskId: any = null;
  let lotteryV2Address: string | unknown = null;
  let lotteryV2GelatoTaskId: any = null;
  let auctionV1Address: string | unknown = null;
  let auctionV1GelatoTaskId: any = null;
  let auctionV2Address: string | unknown = null;
  let lotteryV1NftAddress: string | unknown = null;
  let lotteryV2NftAddress: string | unknown = null;
  let auctionV1NftAddress: string | unknown = null;
  let auctionV2NftAddress: string | unknown = null;

  let updateAttrs = {};
  let usable = false;
  let errorMessage: string | null = null;

  try {
    sale = await ticketSale.findUnique({
      where: {
        id: id as string,
      },
      include: {
        seller: true,
      },
    });

    if (!sale) throw new Error(`sale not found`);
    if (sale?.lotteryV1contractAddr) throw new Error(`LotteryV1 already deployed`);
    if (sale?.lotteryV2contractAddr) throw new Error(`LotteryV2 already deployed`);
    if (sale?.auctionV1contractAddr) throw new Error(`AuctionV1 already deployed`);
    if (sale?.auctionV2contractAddr) throw new Error(`AuctionV2 already deployed`);

    const abi = contractsInterfaces["BlessedFactory"].abi;
    await initializeNonce();

    const deployedContract = await deployFactoryContract();
    factoryContractDeployHash = deployedContract?.hash;
    factoryContractAddr = deployedContract?.contractAddr;
    incrementNonce();
    const baseContractsReceipt = await setBaseContracts(factoryContractAddr, abi, sale.id);
    setBaseContractsHash = baseContractsReceipt.transactionHash;
    incrementNonce();
    const createSaleReceipt = await createSale(deployedContract?.contractAddr, abi, sale, account.address);
    createSaleHash = createSaleReceipt?.transactionHash;
    incrementNonce();

    factoryContractCurrentIndex = await publicClient.readContract({
      address: deployedContract.contractAddr,
      abi,
      functionName: "currentIndex",
      args: []
    });

    lotteryV1Address = await publicClient.readContract({
      address: deployedContract.contractAddr,
      abi,
      functionName: "sales",
      args: [Number(factoryContractCurrentIndex) - 1, 0]
    });
    lotteryV1NftAddress = await publicClient.readContract({
      address: lotteryV1Address as PrefixedHexString,
      abi: contractsInterfaces["LotteryV1"].abi,
      functionName: "nftContractAddr",
    });

    lotteryV2Address = await publicClient.readContract({
      address: deployedContract.contractAddr,
      abi,
      functionName: "sales",
      args: [Number(factoryContractCurrentIndex) - 1, 1]
    });
    lotteryV2NftAddress = await publicClient.readContract({
      address: lotteryV2Address as PrefixedHexString,
      abi: contractsInterfaces["LotteryV2"].abi,
      functionName: "nftContractAddr",
    });

    auctionV1Address = await publicClient.readContract({
      address: deployedContract.contractAddr,
      abi,
      functionName: "sales",
      args: [Number(factoryContractCurrentIndex) - 1, 2]
    });
    auctionV1NftAddress = await publicClient.readContract({
      address: auctionV1Address as PrefixedHexString,
      abi: contractsInterfaces["AuctionV1"].abi,
      functionName: "nftContractAddr",
    });

    auctionV2Address = await publicClient.readContract({
      address: deployedContract.contractAddr,
      abi,
      functionName: "sales",
      args: [Number(factoryContractCurrentIndex) - 1, 3]
    });
    auctionV2NftAddress = await publicClient.readContract({
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

    if (lotteryV1Address) {
      lotteryV1GelatoTaskId = await createGelatoTask(lotteryV1Address as any, "LotteryV1", sale.id);
      lotteryV1GelatoTaskHash = lotteryV1GelatoTaskId?.tx?.hash;
      incrementNonce();
    }
    if (lotteryV2Address) {
      lotteryV2GelatoTaskId = await createGelatoTask(lotteryV2Address as any, "LotteryV2", sale.id);
      lotteryV2GelatoTaskHash = lotteryV2GelatoTaskId?.tx?.hash;
      incrementNonce();
    }
    if (auctionV1Address) {
      auctionV1GelatoTaskId = await createGelatoTask(auctionV1Address as any, "AuctionV1", sale.id);
      auctionV1GelatoTaskHash = auctionV1GelatoTaskId?.tx?.hash;
      incrementNonce();
    }

    let l2RandomNumberReceipt: any = null;
    let l2SetSellerReceipt: any = null;

    if (lotteryV2Address) {
      l2RandomNumberReceipt = await requestRandomNumber(lotteryV2Address, contractsInterfaces["LotteryV2"].abi, sale.id);
      lotteryV2RandomNumberHash = l2RandomNumberReceipt?.transactionHash;
      incrementNonce();
      await waitForRandomNumber(lotteryV2Address);
      l2SetSellerReceipt = await setSeller(lotteryV2Address, contractsInterfaces["LotteryV2"].abi, sale.seller);
      lotteryV2SetSellerHash = l2SetSellerReceipt?.transactionHash;
      incrementNonce();
    }

    const totalGasSaved =
      deployedContract.gasPrice +
      Number(baseContractsReceipt.gasUsed) * Number(baseContractsReceipt.effectiveGasPrice) +
      Number(createSaleReceipt.gasUsed) * Number(createSaleReceipt.effectiveGasPrice) +
      (lotteryV2Address
          ? (
            Number(l2RandomNumberReceipt?.gasUsed) * Number(l2RandomNumberReceipt?.effectiveGasPrice) +
            Number(l2SetSellerReceipt?.gasUsed) * Number(l2SetSellerReceipt?.effectiveGasPrice)
          )
          : 0
      );

    await log.create({
      data: {
        userId: sale.seller.id,
        type: LogType["ticketSaleCreationSuccess"],
        payload: {
          saleId: sale.id
        }
      },
    });

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

    console.log({
      saleId: sale.id,
      factoryContractDeployHash,
      setBaseContractsHash,
      createSaleHash,
      lotteryV1GelatoTaskHash,
      lotteryV2GelatoTaskHash,
      auctionV1GelatoTaskHash,
      lotteryV2RandomNumberHash,
      lotteryV2SetSellerHash,
    });
  } catch (error: any) {
    console.log("🚨 Error while deploying Smart Contracts: ", (error as any).message)
    if (sale?.id) {
      await createErrorLog(sale.seller.id, (error as any).message);
    }
    errorMessage = error.message as any;
  } finally {
    const checks: any = {
      factoryContractDeployHash,
      setBaseContractsHash,
      createSaleHash,
      lotteryV1GelatoTaskHash,
      lotteryV2GelatoTaskHash,
      auctionV1GelatoTaskHash,
      lotteryV2RandomNumberHash,
      lotteryV2SetSellerHash,
    }
    const addresses = [
      lotteryV1Address,
      lotteryV2Address,
      auctionV1Address,
      auctionV2Address,
      lotteryV1NftAddress,
      lotteryV2NftAddress,
      auctionV1NftAddress,
      auctionV2NftAddress,
      lotteryV1GelatoTaskId,
      lotteryV2GelatoTaskId,
      auctionV1GelatoTaskId,
      factoryContractAddr,
      factoryContractCurrentIndex,
    ]
    usable = !([...Array.from(checks), ...addresses].includes(null));
    updateAttrs = {
      lotteryV1contractAddr: lotteryV1Address as string,
      lotteryV2contractAddr: lotteryV2Address as string,
      auctionV1contractAddr: auctionV1Address as string,
      auctionV2contractAddr: auctionV2Address as string,
      lotteryV1nftAddr: lotteryV1NftAddress as string,
      lotteryV2nftAddr: lotteryV2NftAddress as string,
      auctionV1nftAddr: auctionV1NftAddress as string,
      auctionV2nftAddr: auctionV2NftAddress as string,
      lotteryV1settings: {
        ...sale.lotteryV1settings as any,
        gelatoTaskId: lotteryV1GelatoTaskId?.taskId,
      },
      lotteryV2settings: {
        ...sale.lotteryV2settings as any,
        gelatoTaskId: lotteryV2GelatoTaskId?.taskId,
      },
      auctionV1settings: {
        ...sale.auctionV1settings as any,
        gelatoTaskId: auctionV1GelatoTaskId?.taskId,
      },
      factoryContractAddr,
      factoryContractCurrentIndex: Number(factoryContractCurrentIndex),
      checks,
      usable
    };
    await ticketSale.update({
      where: {
        id: sale.id,
      },
      data: updateAttrs,
    });
    console.timeEnd("📜 Deploying Smart Contracts...");
  }

  return NextResponse.json(
    {
      error: errorMessage,
      eventId: sale?.id,
      factoryContractAddr,
      lotteryV1Address,
      lotteryV2Address,
      auctionV1Address,
      auctionV2Address,
      lotteryV2RandomNumberHash,
      lotteryV2SetSellerHash,
      lotteryV1NftAddress,
      lotteryV2NftAddress,
      auctionV1NftAddress,
      auctionV2NftAddress,
    },
    { status: usable ? 200 : 400 },
  );
}
