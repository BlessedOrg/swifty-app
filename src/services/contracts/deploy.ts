import { account, client, contractsInterfaces, fetchNonce, publicClient, waitForTransactionReceipt } from "../viem";
import { log, LogType } from "@/prisma/models";
import { getExplorerUrl, usdcContractDecimals } from "../web3Config";

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
    console.log("🦦 !!!nonce: ", nonce)
    hash = await client.deployContract({
      abi: contractsInterfaces["BlessedFactory"].abi,
      bytecode: contractsInterfaces["BlessedFactory"].bytecode.object as any,
      nonce,
    } as any);
    console.log("🏭 deployFactoryContractTx: ", getExplorerUrl(hash));
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
    const hash = await client.writeContract({
      address: contractAddr,
      functionName: functionName,
      args,
      abi,
      account,
      nonce,
    } as any);
    console.log(`${emojiMapper(functionName)} ${functionName}TxHash: ${getExplorerUrl(hash)} 📟 Nonce: ${nonce}`);
    return await waitForTransactionReceipt(hash);
  } catch (error) {
    const errorMessage = `Details: ${(error as any).message.split("Details:")[1]}`;
    console.log(`🚨 Error while calling ${functionName}: `, errorMessage);
    if (errorMessage.includes("nonce too low")) {
      console.log(`🆘 incrementing nonce (currently ${nonce})!`);
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
      "0x5f0AB9E7Ce90C552871f80c60eD5FdF353A5FF18", // NFTTicket ⛓️ Base Sepolia
      "0xCBb35796f7432137b654D086DdA35f54669b3717", // LotteryV1 ⛓️ Base Sepolia
      "0x5184a5d8444785bd3DcC0216C1c8acc3C2BB437F", // LotteryV2 ⛓️ Base Sepolia
      "0x35b7c490EFDDA782eC65467a9841E11E68cB00b1", // AuctionV1 ⛓️ Base Sepolia
      "0xc99727543a2d5Ff93e5D4587cf89B46092b36383", // AuctionV2 ⛓️ Base Sepolia
    ],
    abi,
    sellerId
  );
};


const createSale = async (contractAddr, abi, sale, appOperatorAddress) => {
  const args = {
    _seller: sale.seller.walletAddr,
    _gelatoVrfOperator: process.env.NEXT_PUBLIC_GELATO_VRF_OPERATOR as string,
    _blessedOperator: appOperatorAddress as string,
    _owner: sale.seller.walletAddr,
    _lotteryV1TicketAmount: sale.lotteryV1settings.ticketsAmount,
    _lotteryV2TicketAmount: sale.lotteryV2settings.ticketsAmount,
    _auctionV1TicketAmount: sale.auctionV1settings.ticketsAmount,
    _auctionV2TicketAmount: sale.auctionV2settings.ticketsAmount,
    _ticketPrice: (sale.priceCents / 100) * 10**usdcContractDecimals,
    _uri: `https://blessed.fan/api/ticket-metadata/${sale.id}/`,
    _usdcContractAddr: process.env.NEXT_PUBLIC_USDC_CONTRACT_ADDR,
    _multisigWalletAddress: process.env.MULTISIG_WALLET_ADDRESS as string,
    _name: "NFT Ticket",
    _symbol: "TCKT",
    _lotteryV2RollPrice: sale.lotteryV2settings.rollPrice ?? 0,
    _lotteryV2RollTolerance: sale.lotteryV2settings.rollTolerance,
    _auctionV1PriceIncreaseStep: sale.auctionV1settings.priceIncrease
  }
  return writeContractWithNonceGuard(
    contractAddr,
    "createSale",
    [args],
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

async function waitForRandomNumber(contractAddr) {
  return new Promise((resolve, reject) => {
    const intervalId = setInterval(async () => {
      try {
        const randomNumber = await publicClient.readContract({
          address: contractAddr,
          abi: contractsInterfaces["LotteryV2"].abi,
          functionName: "randomNumber",
          args: []
        });

        console.log("🎲 Random Number:", Number(randomNumber));

        if (Number(randomNumber) > 0) {
          clearInterval(intervalId);
          resolve(randomNumber);
        }
      } catch (error: any) {
        console.error("🚨 Error reading contract: ", error.message);
        clearInterval(intervalId);
        reject(error);
      }
    }, 5000);
  });
}

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
  nonce,
  deployFactoryContract,
  requestRandomNumber,
  createSale,
  setSeller,
  waitForRandomNumber,
  setBaseContracts,
  setRollTolerance,
  createErrorLog,
  initializeNonce,
  incrementNonce
}