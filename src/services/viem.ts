import { createWalletClient, createPublicClient, http, custom } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { default as LotteryV1 } from "services/contracts/LotteryV1.json";
import { default as LotteryV2 } from "services/contracts/LotteryV2.json";
import { default as AuctionV1 } from "services/contracts/AuctionV1.json";
import { default as AuctionV2 } from "services/contracts/AuctionV2.json";
import { default as NftTicket } from "services/contracts/NFTLotteryTicket.json";
import { default as BlessedFactory } from "services/contracts/BlessedFactory.json";
import { default as usdcAbi } from "services/contracts/usdcAbi.json";
import { ethers } from "ethers";
import { NonceManager } from "@ethersproject/experimental";
import { activeChain, rpcUrl } from "./web3Config";

export const contractsInterfaces = {
  ["LotteryV1"]: LotteryV1,
  ["LotteryV2"]: LotteryV2,
  ["AuctionV1"]: AuctionV1,
  ["AuctionV2"]: AuctionV2,
  ["NftTicket"]: NftTicket,
  ["BlessedFactory"]: BlessedFactory,
  ["USDC"]: usdcAbi,
};

if (!rpcUrl) {
  throw new Error("NEXT_PUBLIC_JSON_RPC_URL is required");
}

const account = privateKeyToAccount(`0x${process.env.OPERATOR_PRIVATE_KEY}`);

const client = createWalletClient({
  chain: activeChain,
  account,
  transport: http(rpcUrl),
});

const userClient = createWalletClient({
  chain: activeChain,
  transport:
    typeof window !== "undefined" && window?.ethereum
      ? custom(window.ethereum)
      : http(rpcUrl),
});

const publicClient = createPublicClient({
  chain: activeChain,
  transport: http(rpcUrl),
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
    url: rpcUrl!,
  });
  const signer = provider.getSigner(account?.address);
  const nonceManager = new NonceManager(signer);
  const nonceFromManager = await nonceManager.getTransactionCount("latest");
  console.log("🔥 nonceFromManager: ", nonceFromManager);
  return nonceFromManager;
};

const waitForTransactionReceipt = async (hash, confirmations = 1) => {
  return publicClient.waitForTransactionReceipt({
    hash,
    confirmations,
  });
};

export {
  publicClient,
  client,
  account,
  deployContract,
  deployFactoryContract,
  fetchNonce,
  waitForTransactionReceipt,
  userClient,
};