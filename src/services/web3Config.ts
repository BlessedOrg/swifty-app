import {defineChain} from "viem";
import { defineChain as defineThirdwebChain} from "thirdweb/chains";

export const rpcUrl = process.env.NEXT_PUBLIC_JSON_RPC_URL! || "define rpc url env ";
export const chainId = Number(process.env.NEXT_PUBLIC_CHAIN_ID!) || 0;

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

const thirdwebActiveChain = defineThirdwebChain({
    id: chainId,
    rpc: rpcUrl,
    nativeCurrency: {
        name: "Ether",
        symbol: "ETH",
        decimals: 18,
    },
});

export const activeUsingChain = celestiaRaspberry;

export const thirdwebActiveUsingChain = thirdwebActiveChain;

