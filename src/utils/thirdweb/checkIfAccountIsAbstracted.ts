import { client } from "lib/client";
import { getContract, readContract} from "thirdweb"
import {sepolia} from "thirdweb/chains"
export const checkIfAccountIsAbstracted = async (address: string) => {
  const contractABI: any[] = [
    {
      "inputs":[],
      "name":"getAllAccounts",
      "outputs":[{"internalType":"address[]","name":"","type":"address[]"}],
      "stateMutability":"view",
      "type":"function"
    },
  ];
  const contract = getContract({
    client: client,
    chain: sepolia,
    abi: contractABI,
    address: process.env.THIRDWEB_FACTORY_ADDRESS as string,
  });
  const abstractedAccounts = await readContract({
    contract,
    method: "getAllAccounts"
  })

  return !!abstractedAccounts.includes(address);
};
