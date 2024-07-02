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
    } as any);
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
    } as any);
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
      "0x5f0AB9E7Ce90C552871f80c60eD5FdF353A5FF18", // NFT 2.0 ⛓️ Base Sepolia
      "0x43808FC3037b88CB186FC4BF327B28b48F1Ec015", // LotteryV1 2.0 ⛓️ Base Sepolia
      "0xa59a824F09dc0Bd56Bf23ED0dB90065D9ed3376d", // LotteryV2 2.0 ⛓️ Base Sepolia
      "0x7ac0045A8CAaA8b98E511b0Ab15fd9C16D1C81D3", // AuctionV1 2.0 ⛓️ Base Sepolia
      "0x22Fb378E458f528777774dc7CBFA383BE8C7Ba89" // AuctionV2 2.0 ⛓️ Base Sepolia
      // "0x7D38230c43E503dB1bab1ba887893718EC5bE238", // NFT 2.0 ⛓️ Amoy
      // "0xFeAb2cBB94Ad76C586511d7e83562dd64f57280a", // LotteryV1 2.0 ⛓️ Amoy
      // "0x2A411Bc11bFc845e89e4266C468950aeecd91226", // LotteryV2 2.0 ⛓️ Amoy
      // "0x29044Dc6800151Ac5D3E2b0aE5689977B7b1003D", // AuctionV1 2.0 ⛓️ Amoy
      // "0x878fEA13c4906Abe86278064a79BF0c13a6ac8a6" // AuctionV2 2.0 ⛓️ Amoy
      // "0x7D38230c43E503dB1bab1ba887893718EC5bE238", // NFT ⛓️ OP Sepolia
      // "0x5BEd76D155eF4682369a9A9159cF5677433AdA05", // LotteryV1 ⛓️ OP Sepolia
      // "0x5f0AB9E7Ce90C552871f80c60eD5FdF353A5FF18", // LotteryV2 ⛓️ OP Sepolia
      // "0x43808FC3037b88CB186FC4BF327B28b48F1Ec015", // AuctionV1 ⛓️ OP Sepolia
      // "0xa59a824F09dc0Bd56Bf23ED0dB90065D9ed3376d" // AuctionV2 ⛓️ OP Sepolia
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
    _ticketPrice: (sale.priceCents / 100) * 10**6,
    _uri: `https://blessed.fan/api/ticket-metadata/${sale.id}/`,
    _usdcContractAddr: process.env.NEXT_PUBLIC_USDC_CONTRACT_ADDR,
    _multisigWalletAddress: process.env.MULTISIG_WALLET_ADDRESS as string,
    _name: "NFT Ticket",
    _symbol: "TCKT",
    _lotteryV2RollPrice: sale.lotteryV2settings.rollPrice ?? 0,
    _lotteryV2RollTolerance: sale.lotteryV2settings.rollTolerance,
    _auctionV1PriceIncreaseStep: sale.auctionV1settings.priceIncrease
  }
  console.log("🌳 args: ", args)
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