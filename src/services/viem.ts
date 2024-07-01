import { createWalletClient, createPublicClient, http, custom } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { default as LotteryV1 } from "services/contracts/LotteryV1.json";
import { default as LotteryV2 } from "services/contracts/LotteryV2.json";
import { default as AuctionV1 } from "services/contracts/AuctionV1.json";
import { default as AuctionV2 } from "services/contracts/AuctionV2.json";
import { default as NftTicket } from "services/contracts/NFTLotteryTicket.json";
import { default as BlessedFactory } from "services/contracts/BlessedFactory.json";
import { default as usdcAbi } from "services/contracts/usdcAbi.json";
import { defineChain } from "viem";
import { ethers } from "ethers";
import { NonceManager } from "@ethersproject/experimental";
import { optimismSepolia as optimismSepoliaChain, polygonAmoy } from "thirdweb/chains"
import { GelatoOpCelestia } from "@thirdweb-dev/chains";

export const contractsInterfaces = {
  ["LotteryV1"]: LotteryV1,
  ["LotteryV2"]: LotteryV2,
  ["AuctionV1"]: AuctionV1,
  ["AuctionV2"]: AuctionV2,
  ["NftTicket"]: NftTicket,
  ["BlessedFactory"]: BlessedFactory,
  ["USDC"]: usdcAbi,
};

export const celestiaRaspberry = defineChain({
  id: Number(process.env.NEXT_PUBLIC_CHAIN_ID!),
  name: "Op Celestia Raspberry",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.opcelestia-raspberry.gelato.digital"],
      webSocket: ["wss://ws.opcelestia-raspberry.gelato.digital"],
    },
  },
  blockExplorers: {
    default: {
      name: "Explorer",
      url: "https://opcelestia-raspberry.gelatoscout.com/",
    },
  },
});

export const optimismSepolia = {
  id: Number(process.env.NEXT_PUBLIC_CHAIN_ID!),
  name: "Optimism Sepolia",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    default: {
      http: ["https://optimism-sepolia.blockpi.network/v1/rpc/public"],
      webSocket: [""],
    },
  },
  blockExplorers: {
    default: {
      name: "Explorer",
      url: "https://sepolia-optimistic.etherscan.io",
    },
  },
}

export const amoy = {
  id: Number(process.env.NEXT_PUBLIC_CHAIN_ID!),
  name: "Amoy",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    default: {
      http: ["https://rpc-amoy.polygon.technology"],
      webSocket: [""],
    },
  },
  blockExplorers: {
    default: {
      name: "Explorer",
      url: "https://amoy.polygonscan.com",
    },
  },
}

const opCelestiaRaspberryForThirdWeb = {
  ...GelatoOpCelestia,
  rpc: ["https://rpc.opcelestia-raspberry.gelato.digital"],
};

if (!process.env.NEXT_PUBLIC_JSON_RPC_URL) {
  throw new Error("NEXT_PUBLIC_JSON_RPC_URL is required");
}

const selectedNetwork = amoy;
const selectedNetworkForThirdWeb = polygonAmoy;

const account = privateKeyToAccount(`0x${process.env.OPERATOR_PRIVATE_KEY}`);

const client = createWalletClient({
  chain: selectedNetwork,
  account,
  transport: http(process.env.NEXT_PUBLIC_JSON_RPC_URL),
});

const userClient = createWalletClient({
  chain: selectedNetwork,
  transport:
    typeof window !== "undefined" && window?.ethereum
      ? custom(window.ethereum)
      : http(process.env.NEXT_PUBLIC_JSON_RPC_URL),
});

const publicClient = createPublicClient({
  chain: selectedNetwork,
  transport: http(process.env.NEXT_PUBLIC_JSON_RPC_URL),
});

if (!process.env.OPERATOR_PRIVATE_KEY) {
  throw new Error("OPERATOR_PRIVATE_KEY is required");
}

const deployContract = async (contractName, args) => {
  const hash = await client.deployContract({
    abi: contractsInterfaces[contractName].abi,
    bytecode: contractsInterfaces[contractName].bytecode.object,
    args,
  });

  let contractAddr;

  const receipt = await publicClient.waitForTransactionReceipt({
    confirmations: 5,
    hash,
  });

  if (receipt?.contractAddress) {
    contractAddr = receipt.contractAddress;
  }

  return { hash, contractAddr };
};

const deployFactoryContract = async (nonce: number) => {
  let hash: any;
  let contractAddr: any;
  let gasPrice: any;

  try {
    hash = await client.deployContract({
      abi: BlessedFactory.abi,
      bytecode: BlessedFactory.bytecode.object as any,
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
      return await deployFactoryContract(nonce);
    } else {
      console.log("🚨 Error while deploying Factory contract: ", errorMessage);
    }
  }

  return { hash, contractAddr, gasPrice };
};

const fetchNonce = async (address: string | null = null) => {
  const provider = new ethers.providers.JsonRpcProvider({
    skipFetchSetup: true,
    fetchOptions: {
      referrer: process.env.NEXT_PUBLIC_BASE_URL!,
    },
    url: process.env.NEXT_PUBLIC_JSON_RPC_URL!,
  });
  const signer = provider.getSigner(account?.address);
  const nonceManager = new NonceManager(signer);

  const nonceFromManager = await nonceManager.getTransactionCount("latest");
  console.log("🔥 nonceFromManager: ", nonceFromManager);

  // const pendingNonce = await publicClient.getTransactionCount({
  //   address: address ?? account.address,
  //   blockTag: "pending",
  // });
  // const latestNonce = await publicClient.getTransactionCount({
  //   address: address ?? account.address,
  //   blockTag: "latest",
  // });
  // const finalizedNonce = await publicClient.getTransactionCount({
  //   address: address ?? account.address,
  //   blockTag: "finalized",
  // });
  // const earliestNonce = await publicClient.getTransactionCount({
  //   address: address ?? account.address,
  //   blockTag: "earliest",
  // });
  // const safeNonce = await publicClient.getTransactionCount({
  //   address: address ?? account.address,
  //   blockTag: "safe",
  // });
  // console.log({
  //   pendingNonce,
  //   latestNonce,
  //   finalizedNonce,
  //   earliestNonce,
  //   safeNonce,
  // });
  // const nonce = pendingNonce > safeNonce ? pendingNonce + 1 : safeNonce;
  // const finalNonce = nonceFromManager > nonce ? nonceFromManager : nonce;
  // console.log(`🥷 nonce for ${address ?? account.address} is ${finalNonce}`);
  // return finalNonce;
  return nonceFromManager;
};

const waitForTransactionReceipt = async (hash, confirmations = 1) => {
  return publicClient.waitForTransactionReceipt({
    hash,
    confirmations,
  });
};

export {
  selectedNetwork,
  selectedNetworkForThirdWeb,
  publicClient,
  client,
  account,
  deployContract,
  deployFactoryContract,
  fetchNonce,
  waitForTransactionReceipt,
  userClient,
};