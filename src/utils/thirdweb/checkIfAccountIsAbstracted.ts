import { ThirdwebSDK } from "@thirdweb-dev/sdk";

export const checkIfAccountIsAbstracted = async (address: string) => {
  const sdk = new ThirdwebSDK('sepolia');
  const contractABI = [
    {
      "inputs":[],
      "name":"getAllAccounts",
      "outputs":[{"internalType":"address[]","name":"","type":"address[]"}],
      "stateMutability":"view",
      "type":"function"
    },
  ];
  const contract = await sdk.getContract(process.env.THIRDWEB_FACTORY_ADDRESS as string, contractABI);
  const result = await contract.call('getAllAccounts');
  return !!result.includes(address);
};
