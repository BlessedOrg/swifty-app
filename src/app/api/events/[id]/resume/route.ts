import { log, LogType, ticketSale } from "@/prisma/models";
import { createErrorLog, createSale, deployFactoryContract, incrementNonce, initializeNonce, requestRandomNumber, setBaseContracts, setSeller, waitForRandomNumber } from "services/contracts/deploy";
import { PrefixedHexString } from "services/web3Config";
import { account, contractsInterfaces, publicClient } from "services/viem";
import { cancelGelatoTasks, createGelatoTask } from "services/gelato";
import { NextResponse } from "next/server";

export const maxDuration = 300;

export async function GET(req, { params: { id } }) {
  await cancelGelatoTasks();
  console.time("📜 Resuming Smart Contracts...");
  let sale: any;
  let factoryContractDeployHash = null;
  let setBaseContractsHash = null;
  let createSaleHash = null;
  let lotteryV1GelatoTaskHash: string | null = null;
  let lotteryV2GelatoTaskHash: string | null = null;
  let auctionV1GelatoTaskHash: string | null = null;
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

  let deployedContract;
  try {
    sale = await ticketSale.findUnique({
      where: {
        id: id as string,
      },
      include: {
        seller: true,
      },
    });
    
    console.log("🔥 sale: ", sale.seller.id)

    console.log("🤡 sale.checks: ", sale.checks)

    factoryContractDeployHash = sale?.checks?.factoryContractDeployHash || null;
    setBaseContractsHash = sale?.checks?.setBaseContractsHash || null;
    createSaleHash = sale?.checks?.createSaleHash || null;
    lotteryV1GelatoTaskHash = sale?.checks?.lotteryV1GelatoTaskHash || null;
    lotteryV2GelatoTaskHash = sale?.checks?.lotteryV2GelatoTaskHash || null;
    auctionV1GelatoTaskHash = sale?.checks?.auctionV1GelatoTaskHash || null;
    lotteryV2RandomNumberHash = sale?.checks?.lotteryV2RandomNumberHash || null;
    lotteryV2SetSellerHash = sale?.checks?.lotteryV2SetSellerHash || null;
    factoryContractAddr = sale?.factoryContractAddr || null;
    console.log("🌳 factoryContractAddr: ", factoryContractAddr)
    factoryContractCurrentIndex = sale?.factoryContractCurrentIndex || null;
    lotteryV1Address = sale?.lotteryV1contractAddr || null;
    lotteryV1GelatoTaskId = sale?.lotteryV1settings?.gelatoTaskId || null;
    lotteryV2Address = sale?.lotteryV2contractAddr || null;
    lotteryV2GelatoTaskId = sale?.lotteryV2settings?.gelatoTaskId || null;
    auctionV1Address = sale?.auctionV1contractAddr || null;
    auctionV1GelatoTaskId = sale?.auctionV1settings?.gelatoTaskId || null;
    auctionV2Address = sale?.auctionV2contractAddr || null;
    lotteryV1NftAddress = sale?.lotteryV1nftAddr || null;
    lotteryV2NftAddress = sale?.lotteryV2nftAddr || null;
    auctionV1NftAddress = sale?.auctionV1nftAddr || null;
    auctionV2NftAddress = sale?.auctionV2nftAddr || null;
    //
    // console.log({
    //   factoryContractAddr,
    //   factoryContractCurrentIndex,
    //   lotteryV1Address,
    //   lotteryV2Address,
    //   auctionV1Address,
    //   auctionV2Address,
    //   lotteryV1NftAddress,
    //   lotteryV2NftAddress,
    //   auctionV1NftAddress,
    //   auctionV2NftAddress,
    // });


    console.log("🐥 sale?.checks?.factoryContractDeployHash: ", sale?.checks?.factoryContractDeployHash)
    console.log("🐥 sale?.checks?.setBaseContractsHash: ", sale?.checks?.setBaseContractsHash)
    console.log("🐥 sale?.checks?.createSaleHash: ", sale?.checks?.createSaleHash)
    console.log("🐥 sale?.checks?.auctionV1GelatoTaskHash: ", sale?.checks?.auctionV1GelatoTaskHash)
    console.log("🐥 sale?.checks?.lotteryV1GelatoTaskHash: ", sale?.checks?.lotteryV1GelatoTaskHash)
    console.log("🐥 sale?.checks?.lotteryV2GelatoTaskHash: ", sale?.checks?.lotteryV2GelatoTaskHash)
    console.log("🐥 sale?.checks?.lotteryV2RandomNumberHash: ", sale?.checks?.lotteryV2RandomNumberHash)
    console.log("🐥 sale?.checks?.lotteryV2SetSellerHash: ", sale?.checks?.lotteryV2SetSellerHash)

    // if (!sale?.checks?.factoryContractDeployHash) {
    //   console.log("🔥 NO FACTORY: ", )
    // }
    //
    // if (!sale?.checks?.createSaleHash) {
    //   console.log("🔥 NO CREATE SALE: ",)
    // }


    // return;
    await initializeNonce();
    const abi = contractsInterfaces["BlessedFactory"].abi;
    let totalGasSaved = 0;

    if (!sale?.checks?.factoryContractDeployHash) {
      console.log("❌ NO factoryContractDeployHash: ", sale?.checks?.factoryContractDeployHash)
      deployedContract = await deployFactoryContract();
      console.log("🦦 deployedContract: ", deployedContract)
      console.log("🦦 deployedContract?.contractAddr: ", deployedContract?.contractAddr)
      if (deployedContract.gasPrice) totalGasSaved += deployedContract.gasPrice;
      if (deployedContract?.hash) factoryContractDeployHash = deployedContract?.hash;
      if (deployedContract?.contractAddr) factoryContractAddr = deployedContract?.contractAddr;
      incrementNonce();
    }

    console.log("🌳 factoryContractAddr: ", factoryContractAddr)

    if (!sale?.checks?.setBaseContractsHash) {
      console.log("❌ NO setBaseContractsHash: ", sale?.checks?.setBaseContractsHash)
      const baseContractsReceipt = await setBaseContracts(factoryContractAddr, abi, sale.id);
      totalGasSaved += Number(baseContractsReceipt?.gasUsed) * Number(baseContractsReceipt?.effectiveGasPrice);
      if (baseContractsReceipt?.transactionHash) setBaseContractsHash = baseContractsReceipt?.transactionHash;
      incrementNonce();
    }

    if (!sale?.checks?.createSaleHash) {
      console.log("❌ NO createSaleHash: ", sale?.checks?.createSaleHash)
      const createSaleReceipt = await createSale(factoryContractAddr, abi, sale, account.address);
      totalGasSaved += Number(createSaleReceipt?.gasUsed) * Number(createSaleReceipt?.effectiveGasPrice)
      if (createSaleReceipt?.transactionHash) createSaleHash = createSaleReceipt?.transactionHash;
      incrementNonce();

      factoryContractCurrentIndex = await publicClient.readContract({
        address: factoryContractAddr!,
        abi,
        functionName: "currentIndex",
        args: [],
      });

      lotteryV1Address = await publicClient.readContract({
        address: factoryContractAddr!,
        abi,
        functionName: "sales",
        args: [Number(factoryContractCurrentIndex) - 1, 0],
      });
      lotteryV1NftAddress = await publicClient.readContract({
        address: lotteryV1Address as PrefixedHexString,
        abi: contractsInterfaces["LotteryV1"].abi,
        functionName: "nftContractAddr",
      });

      lotteryV2Address = await publicClient.readContract({
        address: factoryContractAddr!,
        abi,
        functionName: "sales",
        args: [Number(factoryContractCurrentIndex) - 1, 1],
      });
      lotteryV2NftAddress = await publicClient.readContract({
        address: lotteryV2Address as PrefixedHexString,
        abi: contractsInterfaces["LotteryV2"].abi,
        functionName: "nftContractAddr",
      });

      auctionV1Address = await publicClient.readContract({
        address: factoryContractAddr!,
        abi,
        functionName: "sales",
        args: [Number(factoryContractCurrentIndex) - 1, 2],
      });
      auctionV1NftAddress = await publicClient.readContract({
        address: auctionV1Address as PrefixedHexString,
        abi: contractsInterfaces["AuctionV1"].abi,
        functionName: "nftContractAddr",
      });

      auctionV2Address = await publicClient.readContract({
        address: factoryContractAddr!,
        abi,
        functionName: "sales",
        args: [Number(factoryContractCurrentIndex) - 1, 3],
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
        auctionV2NftAddress,
      ];
      if (addresses.includes("0x0000000000000000000000000000000000000000")) {
        throw new Error(`There was a problem with deploying contracts. Contact the admin for details. Sale ID: ${sale?.id}`);
      }
    }

    if (!sale?.checks?.auctionV1GelatoTaskHash) {
      console.log("❌ NO auctionV1GelatoTaskHash: ", sale?.checks?.auctionV1GelatoTaskHash)
      const task = await createGelatoTask(lotteryV1Address as any, "AuctionV1", sale.id);
      if (task) {
        auctionV1GelatoTaskId = task?.taskId
        auctionV1GelatoTaskHash = task?.tx?.hash;
      }
      incrementNonce();
    }

    if (!sale?.checks?.lotteryV1GelatoTaskHash) {
      console.log("❌ NO lotteryV1GelatoTaskHash: ", sale?.checks?.lotteryV1GelatoTaskHash)
      const task = await createGelatoTask(lotteryV2Address as any, "LotteryV1", sale.id);
      console.log("🐮 task (outside): ", task)
      if (task) {
        lotteryV1GelatoTaskId = task?.taskId
        lotteryV1GelatoTaskHash = task?.tx?.hash;
      }
      incrementNonce();
    }

    if (!sale?.checks?.lotteryV2GelatoTaskHash) {
      console.log("❌ NO lotteryV2GelatoTaskHash: ", sale?.checks?.lotteryV2GelatoTaskHash)
      const task = await createGelatoTask(auctionV1Address as any, "LotteryV2", sale.id);
      if (task) {
        lotteryV2GelatoTaskId = task?.taskId
        lotteryV2GelatoTaskHash = task?.tx?.hash;
      }
      incrementNonce();
    }

    if (!sale?.checks?.lotteryV2RandomNumberHash) {
      console.log("❌ NO lotteryV2RandomNumberHash: ", sale?.checks?.lotteryV2RandomNumberHash)
      const l2RandomNumberReceipt = await requestRandomNumber(lotteryV2Address, contractsInterfaces["LotteryV2"].abi, sale.id);
      totalGasSaved += Number(l2RandomNumberReceipt?.gasUsed) * Number(l2RandomNumberReceipt?.effectiveGasPrice);
      if (l2RandomNumberReceipt?.transactionHash) lotteryV2RandomNumberHash = l2RandomNumberReceipt?.transactionHash;
      incrementNonce();
      await waitForRandomNumber(lotteryV2Address);
    }
    
    if (!sale?.checks?.lotteryV2SetSellerHash) {
      console.log("❌ NO lotteryV2SetSellerHash: ", sale?.checks?.lotteryV2SetSellerHash)
      const l2SetSellerReceipt = await setSeller(lotteryV2Address, contractsInterfaces["LotteryV2"].abi, sale.seller);
      totalGasSaved += Number(l2SetSellerReceipt?.gasUsed) * Number(l2SetSellerReceipt?.effectiveGasPrice);
      if (l2SetSellerReceipt?.transactionHash) lotteryV2SetSellerHash = l2SetSellerReceipt?.transactionHash;
      incrementNonce();
    }
    
    await log.create({
      data: {
        userId: sale.seller.id,
        type: LogType["ticketSaleCreationSuccess"],
        payload: {
          saleId: sale.id,
        },
      },
    });

    if (totalGasSaved > 0) {
      await log.create({
        data: {
          userId: sale?.seller?.id,
          type: "gasSaved",
          payload: {
            type: "saleCreation",
            gasSaved: totalGasSaved,
            saleId: sale.id,
          },
        },
      });
    }

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
    console.log("🚨 Error while resuming Smart Contracts: ", (error as any).message);
        console.log("🦦 sale.seller.id: ", sale.seller.id)
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
    console.log("🐬 checks: ", checks)
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
    ];
    
    console.log("🌳 Object.values(checks): ", Object.values(checks))
    console.log("🌳 addresses: ", addresses)
    usable = !([...Object.values(checks), ...addresses].includes(null));
    console.log("🦦 usable: ", usable)
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
        ...lotteryV1GelatoTaskId?.taskId && { gelatoTaskId: lotteryV1GelatoTaskId?.taskId },
      },
      lotteryV2settings: {
        ...sale.lotteryV2settings as any,
        ...lotteryV2GelatoTaskId?.taskId && { gelatoTaskId: lotteryV2GelatoTaskId?.taskId },
      },
      auctionV1settings: {
        ...sale.auctionV1settings as any,
        ...auctionV1GelatoTaskId?.taskId && { gelatoTaskId: auctionV1GelatoTaskId?.taskId },
      },
      factoryContractAddr,
      factoryContractCurrentIndex: Number(factoryContractCurrentIndex),
      checks,
      usable
    };
    console.log("🌳 updateAttrs: ", updateAttrs)
    console.log(`💽 UPDATING RECORD!`)
    await ticketSale.update({
      where: {
        id: sale.id,
      },
      data: updateAttrs,
    });
    console.timeEnd("📜 Resuming Smart Contracts...");
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
