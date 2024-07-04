import { defineChain } from "viem";
import { defineChain as defineThirdwebChain } from "thirdweb/chains";

export const rpcUrl = process.env.NEXT_PUBLIC_JSON_RPC_URL || "define RPC URL env ";
export const chainId = Number(process.env.NEXT_PUBLIC_CHAIN_ID) || 0;
export const usdcContractAddress = process.env.NEXT_PUBLIC_USDC_CONTRACT_ADDR! as `0x${string}`

export const nativeCurrency = {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
}

const celestiaRaspberry = defineChain({
    id: chainId,
    name: "Op Celestia Raspberry",
    nativeCurrency: {
        decimals: 18,
        name: "Ether",
        symbol: "ETH",
    },
    rpcUrls: {
        default: {
            http: [rpcUrl],
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

const baseSepolia = {
    id: chainId,
    name: "Base Sepolia",
    nativeCurrency,
    rpcUrls: {
        default: {
            http: [rpcUrl],
            webSocket: [""],
        },
    },
    blockExplorers: {
        default: {
            name: "Explorer",
            url: "https://sepolia.basescan.org",
        },
    },
}

export type PrefixedHexString = `0x${string}`;

export const activeChainForThirdweb = defineThirdwebChain({
    id: chainId,
    rpc: rpcUrl,
    nativeCurrency: {
        name: "Ether",
        symbol: "ETH",
        decimals: 18,
    },
});

export const activeChain = baseSepolia;

type ExplorerUrlParams = | { hash: string; address?: never } | { address: string; hash?: never };

export const getExplorerUrl = ({ hash, address }: ExplorerUrlParams) => {
  if (hash) return `${activeChain.blockExplorers.default.url}/tx/${hash}`;
  if (address) return `${activeChain.blockExplorers.default.url}/address/${address}`;
}
