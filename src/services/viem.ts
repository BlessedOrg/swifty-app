import { createWalletClient, createPublicClient, http, custom } from "viem";
import { privateKeyToAccount } from 'viem/accounts';
import { default as LotteryV1 } from './contracts/LotteryV1.json';
import { default as LotteryV2 } from './contracts/LotteryV2.json';
import { default as AuctionV1 } from './contracts/AuctionV1.json';
import { default as AuctionV2 } from './contracts/AuctionV2.json';
import { default as NftTicket } from './contracts/NFTLotteryTicket.json';
import { default as BlessedFactory } from './contracts/BlessedFactory.json';
import { defineChain } from 'viem';

export const contractsInterfaces = {
  ['LotteryV1']: LotteryV1,
  ['LotteryV2']: LotteryV2,
  ['AuctionV1']: AuctionV1,
  ['AuctionV2']: AuctionV2,
  ['NftTicket']: NftTicket,
  ['BlessedFactory']: BlessedFactory,
}

export const celestiaRaspberry = defineChain({
  id: 123420111,
  name: 'Op Celestia Raspberry',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.opcelestia-raspberry.gelato.digital'],
      webSocket: ['wss://ws.opcelestia-raspberry.gelato.digital'],
    },
  },
  blockExplorers: {
    default: { name: 'Explorer', url: 'https://opcelestia-raspberry.gelatoscout.com/' },
  },
})

if(!process.env.NEXT_PUBLIC_JSON_RPC_URL) {
  throw new Error('NEXT_PUBLIC_JSON_RPC_URL is required')
}

const account = privateKeyToAccount(`0x${process.env.OPERATOR_PRIVATE_KEY}`)
 
const client = createWalletClient({
  chain: celestiaRaspberry,
  account,
  transport: http(process.env.NEXT_PUBLIC_JSON_RPC_URL)
})

const userClient = createWalletClient({
  chain: celestiaRaspberry,
  transport: typeof window !== "undefined" ? custom(window.ethereum) : http(process.env.NEXT_PUBLIC_JSON_RPC_URL)
})

const publicClient = createPublicClient({ 
  chain: celestiaRaspberry,
  transport: http(process.env.NEXT_PUBLIC_JSON_RPC_URL)
})

if(!process.env.OPERATOR_PRIVATE_KEY) {
  throw new Error('OPERATOR_PRIVATE_KEY is required')
}

const deployContract = async (contractName, args) => {
  const hash = await client.deployContract({
    abi: contractsInterfaces[contractName].abi,
    bytecode: contractsInterfaces[contractName].bytecode.object,
    args
  })

  let contractAddr;

  const receipt = await publicClient.waitForTransactionReceipt({ 
    confirmations: 5, 
    hash 
  })

  if(receipt?.contractAddress) {
    contractAddr = receipt.contractAddress
  }

  return { hash, contractAddr };
}

const deployFactoryContract = async (nonce) => {
  let hash: any;
  let contractAddr: any;

  try {
    hash = await client.deployContract({
      abi: BlessedFactory.abi,
      bytecode: BlessedFactory.bytecode.object as any,
      nonce
    });
    console.log("🏭 deployFactoryContractTx: ", hash)
    const receipt = await publicClient.waitForTransactionReceipt({
      confirmations: 1,
      hash
    });
    if (receipt?.contractAddress && receipt?.transactionHash) {
      contractAddr = receipt.contractAddress;
    }
    nonce++;
  } catch (error) {
    const errorMessage = `Details: ${(error as any).message.split("Details:")[1]}`;
    console.log("🚨 Error while deploying Factory contract: ", errorMessage);
    if (errorMessage.includes("nonce too low")) {
      console.log(`💽 Retrying...`)
      nonce++;
      return await deployFactoryContract(nonce)
    }
  }

  return { hash, contractAddr }
}

const getNonce = async () => {
  const pendingNonce = await publicClient.getTransactionCount({
    address: account.address,
    blockTag: "pending"
  });
  const latestNonce = await publicClient.getTransactionCount({
    address: account.address,
    blockTag: "latest"
  });
  return pendingNonce > latestNonce ? pendingNonce + 1 : latestNonce;
};

const waitForTransactionReceipt = async (hash, confirmations = 1) => {
  await publicClient.waitForTransactionReceipt({
    hash,
    confirmations,
  });
};

export { publicClient, userClient, client, account, deployContract, deployFactoryContract, getNonce, waitForTransactionReceipt }
