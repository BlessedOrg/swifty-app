import { defineChain } from "viem";
import { defineChain as defineThirdwebChain } from "thirdweb/chains";

export const rpcUrl = process.env.NEXT_PUBLIC_JSON_RPC_URL || "define RPC URL env ";
export const chainId = Number(process.env.NEXT_PUBLIC_CHAIN_ID) || 0;
export const usdcContractAddress = process.env.NEXT_PUBLIC_USDC_CONTRACT_ADDR! as `0x${string}`;
export const usdcContractDecimals = Number(process.env.NEXT_PUBLIC_USDC_CONTRACT_DECIMALS! as string) ?? 6;

export const ethNativeCurrency = {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
}

const celestiaRaspberry = defineChain({
    id: chainId,
    name: "Op Celestia Raspberry",
    nativeCurrency: ethNativeCurrency,
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
    nativeCurrency: ethNativeCurrency,
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


export const activeChainForThirdweb = defineThirdwebChain({
    id: chainId,
    rpc: rpcUrl,
    nativeCurrency: ethNativeCurrency
});

export const activeChain = baseSepolia;

export type PrefixedHexString = `0x${string}`;

export const getExplorerUrl = (param: string): string => {
  if (param.length === 66) {
    return `${activeChain.blockExplorers.default.url}/tx/${param}`;
  } else if (param.length === 42) {
    return `${activeChain.blockExplorers.default.url}/address/${param}`;
  } else {
    throw new Error("Invalid input: must be a valid Ethereum address (40 signs) or transaction hash (64 signs)");
  }
};
