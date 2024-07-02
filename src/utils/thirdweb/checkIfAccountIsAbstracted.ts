import { client } from "lib/client";
import { getContract, readContract } from "thirdweb";
import { activeChainForThirdweb } from "services/web3Config";

export const checkIfAccountIsAbstracted = async (address: string) => {
  try {
    const contractABI: any[] = [
      {
        "inputs": [],
        "name": "getAllAccounts",
        "outputs": [{ "internalType": "address[]", "name": "", "type": "address[]" }],
        "stateMutability": "view",
        "type": "function",
      },
    ];
    const contract = getContract({
      client: client,
      chain: activeChainForThirdweb,
      abi: contractABI,
      address: process.env.THIRDWEB_FACTORY_ADDRESS as string,
    });
    const abstractedAccounts = await readContract({
      contract,
      method: "getAllAccounts",
    });

    return abstractedAccounts?.includes(address);
  } catch (error: any) {
    console.log("🚨 Error while checking if Account is Abstracted: ", error.message);
    return false;
  }
};
