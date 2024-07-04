"use server";

import { privateKeyToAccount } from "viem/accounts";
import { createWalletClient, http } from "viem";
import {activeChain, rpcUrl, usdcContractAddress} from "../services/web3Config";
import {contractsInterfaces} from "../services/viem";

const faucetOperatorPrivateKey = process.env
  .FAUCET_OPERATOR_PRIVATE_KEY! as string;

export async function claimFakeUSDC(recipientAddress){
  const account = privateKeyToAccount(`0x${faucetOperatorPrivateKey}`);
  const client = createWalletClient({
    chain: activeChain,
    account,
    transport: http(rpcUrl),
  });

  return await client.writeContract({
    abi: contractsInterfaces.USDC,
    functionName: "transfer",
    args: [recipientAddress, 100000000],
    address: usdcContractAddress
  });
}
