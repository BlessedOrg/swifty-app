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
  ['NftTicket']: NftTicket
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

const deployFactoryContract = async () => {
  const contract = BlessedFactory;

  const hash = await client.deployContract({
    abi: contract.abi,
    bytecode: contract.bytecode.object as any,
  })

  let contractAddr: any;

  const receipt = await publicClient.waitForTransactionReceipt({
    confirmations: 5,
    hash
  })

  if (receipt?.contractAddress) {
    contractAddr = receipt.contractAddress
  }

  return { hash, contractAddr, abi: contract.abi };
}

export { publicClient, userClient, client, account, deployContract, deployFactoryContract  }
