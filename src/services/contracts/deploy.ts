import { account, client, waitForTransactionReceipt } from "../viem";
import { log, LogType } from "@/prisma/models";

const setBaseContracts = async (contractAddr, abi, nonce, sellerId) => {
  try {
    const setBaseContractsTx = await client.writeContract({
      address: contractAddr,
      functionName: "setBaseContracts",
      args: [
        "0xA46c913c6aF7fbA3FE3e47f80b7282d455D038Ec", // NFT
        "0xC0444D8AcE8e36D80ea5966F52Fd9351CAf3EEDb", // LotteryV1
        "0x8A727925A0bF9625d403F3f86d8Bdd17e694fF7d", // LotteryV2
        "0x73D45742b8015846dA99290A918D030436219A00", // AuctionV1
        "0x370b51842c267304b176168cf8A68283A8fFB16f" // AuctionV2
      ],
      abi,
      account,
      nonce,
    });
    console.log("⚾ setBaseContractsTx: ", setBaseContractsTx)
    return await waitForTransactionReceipt(setBaseContractsTx);
  } catch (error) {
    const errorMessage = `Details: ${(error as any).message.split("Details:")[1]}`;
    if (errorMessage.includes("nonce too low")) {
      nonce++;
      return await setBaseContracts(contractAddr, abi, nonce, sellerId)
    } else {
      await createErrorLog(sellerId, (error as any).message);
    }
  }
};

const createSale = async (contractAddr, abi, nonce, sale, appOperatorAddress) => {
  try {
    const createSaleTx = await client.writeContract({
      address: contractAddr,
      functionName: "createSale",
      args: [{
        _seller: sale.seller.walletAddr,
        _gelatoVrfOperator: process.env.NEXT_PUBLIC_GELATO_VRF_OPERATOR as string,
        _blessedOperator: appOperatorAddress as string,
        _owner: sale.seller.walletAddr,
        _lotteryV1TicketAmount: sale.lotteryV1settings.ticketsAmount,
        _lotteryV2TicketAmount: sale.lotteryV2settings.ticketsAmount,
        _auctionV1TicketAmount: sale.auctionV1settings.ticketsAmount,
        _auctionV2TicketAmount: sale.auctionV2settings.ticketsAmount,
        _ticketPrice: sale.priceCents / 100,
        _uri: `https://blessed.fan/api/ticket-metadata/${sale.id}/`,
        _usdcContractAddr: "0x39008557c498c7B620Ec9F882e556faD8ADBdCd5",
        _multisigWalletAddress: process.env.MULTISIG_WALLET_ADDRESS as string,
        _name: "NFT Ticket",
        _symbol: "TCKT"
      }],
      abi,
      account,
      nonce
    });
    console.log("💸 createSaleTx: ", createSaleTx)
    return await waitForTransactionReceipt(createSaleTx);
  } catch (error) {
    const errorMessage = `Details: ${(error as any).message.split("Details:")[1]}`;
    if (errorMessage.includes("nonce too low")) {
      nonce++;
      return await createSale(contractAddr, abi, nonce, sale, appOperatorAddress)
    } else {
      await createErrorLog(sale.seller.id, (error as any).message);
    }
  }
};

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
    return await waitForTransactionReceipt(requestRandomnessTx);
  } catch (error) {
    const errorMessage = `Details: ${(error as any).message.split("Details:")[1]}`;
    if (errorMessage.includes("nonce too low")) {
      nonce++;
      return await requestRandomNumber(contractAddr, abi, nonce, sellerId)
    } else {
      await createErrorLog(sellerId, (error as any).message);
    }
  }
};

const setSeller = async (contractAddr, abi, nonce, seller) => {
  try {
    const setSellerTx = await client.writeContract({
      address: contractAddr,
      functionName: "setSeller",
      args: [seller.walletAddr],
      abi,
      account,
      nonce,
    });
    console.log("🛒 setSellerTx: ", setSellerTx)
    return await waitForTransactionReceipt(setSellerTx);
  } catch (error) {
    const errorMessage = `Details: ${(error as any).message.split("Details:")[1]}`;
    if (errorMessage.includes("nonce too low")) {
      nonce++;
      return await setSeller(contractAddr, abi, nonce, seller)
    } else {
      await createErrorLog(seller.id, (error as any).message);
    }
  }
};

const setRollTolerance = async (contractAddr, abi, nonce, seller, tolerance) => {
  try {
    const setRollToleranceTx = await client.writeContract({
      address: contractAddr,
      functionName: "setRollTolerance",
      args: [tolerance],
      abi,
      account,
      nonce,
    });
    console.log("🍀 setRollToleranceTx: ", setRollToleranceTx)
    return await waitForTransactionReceipt(setRollToleranceTx);
  } catch (error) {
    const errorMessage = `Details: ${(error as any).message.split("Details:")[1]}`;
    if (errorMessage.includes("nonce too low")) {
      nonce++;
      return await setRollTolerance(contractAddr, abi, nonce, seller, tolerance)
    } else {
      await createErrorLog(seller.id, (error as any).message);
    }
  }
};

const createErrorLog = async (userId, payload) => {
  await log.create({
    data: {
      userId,
      type: LogType["ticketSaleCreationFailure"],
      payload: {
        payload
      }
    }
  })
};

export {
  requestRandomNumber,
  createSale,
  setSeller,
  setBaseContracts,
  setRollTolerance,
  createErrorLog
}