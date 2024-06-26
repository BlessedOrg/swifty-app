import { account, client, contractsInterfaces, fetchNonce, publicClient, waitForTransactionReceipt } from "../viem";
import { log, LogType } from "@/prisma/models";

let nonce;

const initializeNonce = async () => {
  nonce = await fetchNonce();
};

const incrementNonce = () => {
  nonce += 1;
};

const deployFactoryContract = async () => {
  let hash: any;
  let contractAddr: any;
  let gasPrice: any;

  try {
    hash = await client.deployContract({
      abi: contractsInterfaces["BlessedFactory"].abi,
      bytecode: contractsInterfaces["BlessedFactory"].bytecode.object as any,
      nonce,
    });
    console.log("🏭 deployFactoryContractTx: ", hash);
    const receipt = await publicClient.waitForTransactionReceipt({
      confirmations: 1,
      hash,
    });
    if (receipt?.contractAddress && receipt?.transactionHash) {
      contractAddr = receipt.contractAddress;
      gasPrice = Number(receipt?.gasUsed) * Number(receipt?.effectiveGasPrice);
    }
  } catch (error) {
    const errorMessage = `Details: ${
      (error as any).message.split("Details:")[1]
    }`;
    if (errorMessage.includes("nonce too low")) {
      nonce++;
      return await deployFactoryContract();
    } else {
      console.log("🚨 Error while deploying Factory contract: ", errorMessage);
    }
  }

  return { hash, contractAddr, gasPrice };
};

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

const writeContractWithNonceGuard = async (contractAddr, functionName, args, abi, sellerId) => {
  try {
    const txHash = await client.writeContract({
      address: contractAddr,
      functionName: functionName,
      args,
      abi,
      account,
      nonce,
    });
    console.log(`${emojiMapper(functionName)} ${functionName}TxHash: ${txHash} 📟 Nonce: ${nonce}`);
    return await waitForTransactionReceipt(txHash);
  } catch (error) {
    const errorMessage = `Details: ${(error as any).message.split("Details:")[1]}`;
    if (errorMessage.includes("nonce too low")) {
      // console.log(`🆘 incrementing nonce (currently ${nonce})!`);
      nonce++;
      return await writeContractWithNonceGuard(contractAddr, functionName, args, abi, sellerId);
    } else {
      await createErrorLog(sellerId, (error as any).message);
    }
  }
};

const setBaseContracts = async (contractAddr, abi, sellerId) => {
  return writeContractWithNonceGuard(
    contractAddr,
    "setBaseContracts",
    [
      "0xaf47D7Ccc7f9ccFaf25E86aC199e40a9Fa1Ae87f", // NFT
      "0xf9A5Cde4Af9709139AEd41b3D03335E82f8bA024", // LotteryV1
      "0xDedaAE5bd0b91E36d57ab44325cF5FE8C02f56cA", // LotteryV2
      "0x7EaA1DA6AC1Ba3a510F7538908fE9A1A3c09A6BA", // AuctionV1
      "0xF849a1Ba757faA92aeC2e0d883928536e130B295" // AuctionV2
    ],
    abi,
    sellerId
  );
};

const createSale = async (contractAddr, abi, sale, appOperatorAddress) => {
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
      _ticketPrice: (sale.priceCents / 100) * 10**6,
      _uri: `https://blessed.fan/api/ticket-metadata/${sale.id}/`,
      _usdcContractAddr: "0x39008557c498c7B620Ec9F882e556faD8ADBdCd5",
      _multisigWalletAddress: process.env.MULTISIG_WALLET_ADDRESS as string,
      _name: "NFT Ticket",
      _symbol: "TCKT"
    }],
    abi,
    sale.seller.id
  );
};

const requestRandomNumber = async (contractAddr, abi, sellerId) => {
  return writeContractWithNonceGuard(
    contractAddr,
    "requestRandomness",
    [],
    abi,
    sellerId
  );
};

const setSeller = async (contractAddr, abi, seller) => {
  return writeContractWithNonceGuard(
    contractAddr,
    "setSeller",
    [seller.walletAddr],
    abi,
    seller?.id
  );
};

const setRollTolerance = async (contractAddr, abi, seller, tolerance) => {
  return writeContractWithNonceGuard(
    contractAddr,
    "setRollTolerance",
    [tolerance],
    abi,
    seller?.id
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
  deployFactoryContract,
  requestRandomNumber,
  createSale,
  setSeller,
  setBaseContracts,
  setRollTolerance,
  createErrorLog,
  initializeNonce,
  incrementNonce
}