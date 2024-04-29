export const maxDuration = 300;
import { createGelatoTask } from "services/gelato";
import { log, LogType, ticketSale } from "@/prisma/models";
import { account, client, contractsInterfaces, deployFactoryContract, publicClient, getNonce, waitForTransactionReceipt } from "services/viem";
import { NextResponse } from "next/server";

const requestRandomNumber = async (contractAddr, abi, nonce, sellerId) => {
  try {
    const requestRandomnessTx = await client.writeContract({
      address: contractAddr,
      functionName: "requestRandomness",
      args: [],
      abi,
      account,
      nonce,
    });
    console.log("🎲 requestRandomnessTx: ", requestRandomnessTx)
    await waitForTransactionReceipt(requestRandomnessTx);
  } catch (error) {
    const errorMessage = `Details: ${(error as any).message.split("Details:")[1]}`;
    nonce++;
    console.log("🚨 Error while calling `requestRandomness`: " + errorMessage);
    if (errorMessage.includes("nonce too low")) {
      console.log("🏗 ️Retrying...");
      await requestRandomNumber(contractAddr, abi, nonce, sellerId)
    } else {
      await createErrorLog(sellerId, (error as any).message);
    }
  }
};

const setBaseContracts = async (contractAddr, abi, nonce, sellerId) => {
  try {
    const setBaseContractsTx = await client.writeContract({
      address: contractAddr,
      functionName: "setBaseContracts",
      args: [
        "0xA69bA2a280287405907f70c637D8e6f1B278E613", // NFT
        "0x90399E7a859D12a58A3F5452e81845737A006e6d", // Lottery V1 but accepting struct
        "0x7A5f8bd336c57Fe5D4EE04167055B7cA5d4aa06f", // LotteryV2 but accepting struct
        "0xAEE619dCF727e5ca92568ca0bE8220096957FEca", // AuctionV1 but accepting struct
        "0xc0033864B203287F5fa1E8a46a76BB4B9955b143" // AuctionV2 but accepting struct
      ],
      abi,
      account,
      nonce,
    });
    console.log("⚾ setBaseContractsTx: ", setBaseContractsTx)
    await waitForTransactionReceipt(setBaseContractsTx);
  } catch (error) {
    const errorMessage = `Details: ${(error as any).message.split("Details:")[1]}`;
    nonce++;
    console.log("🚨 Error while calling `setBaseContracts`: " + errorMessage);
    if (errorMessage.includes("nonce too low")) {
      console.log("🏗 ️Retrying...");
      return await setBaseContracts(contractAddr, abi, nonce, sellerId)
    } else {
      await createErrorLog(sellerId, (error as any).message);
    }
  }
};

const createSale = async (contractAddr, abi, nonce, sale) => {
  try {
    const createSaleTx = await client.writeContract({
      address: contractAddr,
      functionName: "createSale",
      args: [{
        _seller: sale.seller.walletAddr,
        _operator: process.env.NEXT_PUBLIC_GELATO_VRF_OPERATOR as string,
        _owner: sale.seller.walletAddr,
        _lotteryV1TicketAmount: sale.lotteryV1settings.ticketsAmount,
        _lotteryV2TicketAmount: sale.lotteryV2settings.ticketsAmount,
        _auctionV1TicketAmount: sale.auctionV1settings.ticketsAmount,
        _auctionV2TicketAmount: sale.auctionV2settings.ticketsAmount,
        _ticketPrice: sale.priceCents / 100,
        _finishAt: new Date(sale.finishAt).getTime(),
        _uri: `https://blessed.fan/api/events/${sale.id}/`,
        _usdcContractAddr: "0x710f52775af7aa8328efe25ad0c596feae063620",
        _multisigWalletAddress: process.env.MULTISIG_WALLET_ADDRESS as string
      }],
      abi,
      account,
      nonce
    });
    console.log("💸 createSaleTx: ", createSaleTx)
    await waitForTransactionReceipt(createSaleTx);
  } catch (error) {
    const errorMessage = `Details: ${(error as any).message.split("Details:")[1]}`;
    nonce++;
    console.log("🚨 Error while calling `createSale`: " + errorMessage);
    if (errorMessage.includes("nonce too low")) {
      console.log("🏗 ️Retrying...");
      return await createSale(contractAddr, abi, nonce, sale)
    } else {
      await createErrorLog(sale.seller.id, (error as any).message);
    }
  }
};

const createErrorLog = async (userId, payload) => {
  await log.create({
    data: {
      userId,
      type: LogType["ticketSaleCreationFailure"],
      payload
    }
  })
};

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

    await setBaseContracts(deployedContract?.contractAddr, abi, nonce, sellerId);
    await createSale(deployedContract?.contractAddr, abi, nonce, sale);

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
    if (lotteryV1Address) {
      lotteryV1Task = await createGelatoTask(lotteryV1Address as any, "LotteryV1", sale.id);
      // await createGelatoTask(lotteryV1Address as any, "LotteryV1", sale?.id , true);
    }
    if (lotteryV2Address) {
      lotteryV2Task = await createGelatoTask(lotteryV2Address as any, "LotteryV2", sale.id);
      // await createGelatoTask(lotteryV2Address as any, "LotteryV2", sale?.id , true);

    }
    if (auctionV1Address) {
      auctionV1Task = await createGelatoTask(auctionV1Address as any, "AuctionV1", sale.id);
      // await createGelatoTask(auctionV1Address as any, "AuctionV1", sale?.id , true);
    }

    // await requestRandomNumber(lotteryV1Address, contractsInterfaces["LotteryV1"].abi, nonce, sellerId);
    // await requestRandomNumber(lotteryV2Address, contractsInterfaces["LotteryV2"].abi, nonce, sellerId);
    // await requestRandomNumber(auctionV1Address, contractsInterfaces["AuctionV1"].abi, nonce, sellerId);

    updateAttrs = {
      lotteryV1contractAddr: lotteryV1Address,
      lotteryV2contractAddr: lotteryV2Address,
      auctionV1contractAddr: auctionV1Address,
      auctionV2contractAddr: auctionV2Address,
      lotteryV1settings: {
        ...sale.lotteryV1settings as any,
        taskId: lotteryV1Task?.taskId,
        hash: lotteryV1Task?.tx.hash
      },
      lotteryV2settings: {
        ...sale.lotteryV2settings as any,
        taskId: lotteryV2Task?.taskId,
        hash: lotteryV2Task?.tx.hash
      },
      auctionV1settings: {
        ...sale.auctionV1settings as any,
        taskId: auctionV1Task?.taskId,
        hash: auctionV1Task?.tx.hash
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
      auctionV1contractAddr: auctionV1Address
    });

    return NextResponse.json(
      {
        error: null,
        contractAddr: deployedContract.contractAddr,
        lotteryV1contractAddr: lotteryV1Address,
        lotteryV2contractAddr: lotteryV2Address,
        auctionV1contractAddr: auctionV1Address,
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
