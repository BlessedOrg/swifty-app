import { account, client, waitForTransactionReceipt } from "../viem";
import { log, LogType } from "@/prisma/models";

const emojiMapper = (functionName: string) => {
  switch (functionName) {
    case "setBaseContracts":
      return "⚾"
    case "createSale":
      return "💸"
    case "requestRandomness":
      return "🎲"
    case "setSeller":
      return "🛒"
    case "setRollTolerance":
      return "🍀"
    default:
      return "🪙"
  }
}

const writeContractWithNonceGuard = async (contractAddr, functionName, args, abi, nonce, sellerId) => {
  try {
    const txHash = await client.writeContract({
      address: contractAddr,
      functionName: functionName,
      args,
      abi,
      account,
      nonce,
    });
    console.log(`${emojiMapper(functionName)} ${functionName}TxHash: ${txHash}`);
    return await waitForTransactionReceipt(txHash);
  } catch (error) {
    const errorMessage = `Details: ${(error as any).message.split("Details:")[1]}`;
    if (errorMessage.includes("nonce too low")) {
      console.log(`🆘 incrementing nonce (currently ${nonce})!`);
      nonce++;
      return await writeContractWithNonceGuard(contractAddr, functionName, args, abi, nonce, sellerId);
    } else {
      await createErrorLog(sellerId, (error as any).message);
    }
  }
};

const setBaseContracts = async (contractAddr, abi, nonce, sellerId) => {
  return writeContractWithNonceGuard(
    contractAddr,
    "setBaseContracts",
    [
      "0x6AE2F47d30aA5d4b4dF65E0665ffAa2e477E59DC", // NFT
      "0x3e9F519974fBaBd4a221BD0651e4B37075A079fC", // LotteryV1
      "0x5096F13e5f9Beb1765e216A5AAC5c34443f58a92", // LotteryV2
      "0x005291e0a160Ff16832bEC7506d1736D2F1890c5", // AuctionV1
      "0x370b51842c267304b176168cf8A68283A8fFB16f" // AuctionV2
    ],
    abi,
    nonce,
    sellerId
  );
};

const createSale = async (contractAddr, abi, nonce, sale, appOperatorAddress) => {
  return writeContractWithNonceGuard(
    contractAddr,
    "createSale",
    [{
      _seller: sale.seller.walletAddr,
      _gelatoVrfOperator: process.env.NEXT_PUBLIC_GELATO_VRF_OPERATOR as string,
      _blessedOperator: appOperatorAddress as string,
      _owner: sale.seller.walletAddr,
      _lotteryV1TicketAmount: sale.lotteryV1settings.ticketsAmount,
      _lotteryV2TicketAmount: sale.lotteryV2settings.ticketsAmount,
      _auctionV1TicketAmount: sale.auctionV1settings.ticketsAmount,
      _auctionV2TicketAmount: sale.auctionV2settings.ticketsAmount,
      _ticketPrice: sale.priceCents / 100,
      _uri: `https://blessed.fan/api/events/${sale.id}/`,
      _usdcContractAddr: "0x39008557c498c7B620Ec9F882e556faD8ADBdCd5",
      _multisigWalletAddress: process.env.MULTISIG_WALLET_ADDRESS as string,
      _name: "NFT Ticket",
      _symbol: "TCKT"
    }],
    abi,
    nonce,
    sale.seller.id
  );
};

const requestRandomNumber = async (contractAddr, abi, nonce, sellerId) => {
  return writeContractWithNonceGuard(
    contractAddr,
    "requestRandomness",
    [],
    abi,
    nonce,
    sellerId
  );
};

const setSeller = async (contractAddr, abi, nonce, seller) => {
  return writeContractWithNonceGuard(
    contractAddr,
    "setSeller",
    [seller.walletAddr],
    abi,
    nonce,
    seller.id
  );
};

const setRollTolerance = async (contractAddr, abi, nonce, seller, tolerance) => {
  return writeContractWithNonceGuard(
    contractAddr,
    "setRollTolerance",
    [tolerance],
    abi,
    nonce,
    seller.id
  );
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