import { createWalletClient, createPublicClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { default as LotteryV1 } from './contracts/LotteryV1.json';

import { defineChain } from 'viem'
 
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

const publicClient = createPublicClient({ 
  chain: celestiaRaspberry,
  transport: http(process.env.NEXT_PUBLIC_JSON_RPC_URL)
})

if(!process.env.OPERATOR_PRIVATE_KEY) {
  throw new Error('OPERATOR_PRIVATE_KEY is required')
}


const deployContract = async (contractName, args) => {
  const contract = {
    ['LotteryV1']: LotteryV1,
  }

  const hash = await client.deployContract({
    abi: contract[contractName].abi,
    bytecode: contract[contractName].bytecode.object,
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

export { publicClient, client, account, deployContract }