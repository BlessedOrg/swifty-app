import { ethers } from "ethers";
import { AutomateSDK, Task, TriggerType } from "@gelatonetwork/automate-sdk";
import { contractsInterfaces } from "./viem";
import { chainId, PrefixedHexString, rpcUrl } from "./web3Config";

const provider = new ethers.providers.JsonRpcProvider({
  skipFetchSetup: true,
  fetchOptions: {
    referrer: process.env.NEXT_PUBLIC_BASE_URL!,
  },
  url: rpcUrl,
});

const gelatoAutomate = new AutomateSDK(
  chainId,
  new ethers.Wallet(process.env.GELATO_SIGNER_PRIVATE_KEY as string, provider),
);

export const cancelGelatoTasks = async (onlyLocalhost: boolean = true) => {
  const tasks = await gelatoAutomate.getActiveTasks(process.env.GELATO_SIGNER_PUBLIC_KEY);
  const ids = tasks.map(t => t.taskId);
  console.log("🌍 All tasks count: ", ids.length);

  let filteredTasks: Task[];
  if (onlyLocalhost) {
    filteredTasks = tasks.filter(t => t.name.includes("___LOCALHOST"))
  } else {
    filteredTasks = tasks;
  }

  console.log("💥 Filtered tasks count: ", filteredTasks.length);
  console.log("🌳 Filtered tasks: ", filteredTasks);

  let taskId = 0;
  const cancelTask = async (id, deletedCounter) => {
    taskId = id;
    const deleted = await gelatoAutomate.cancelTask(taskId as any);
    await deleted.tx.wait(1);
    console.log(`✅ Deleted: ${deleted.taskId} (${deletedCounter}/${ids.length})`);
  };

  let deletedCounter = 1;
  for (const task of ids) {
    await cancelTask(task, deletedCounter);
    deletedCounter++;
  }
};

export const createGelatoTask = async (contractAddr: PrefixedHexString, contractName: string, saleId: string) => {
  const functionSignature = '_fulfillRandomness(uint256,uint256,bytes)';
  const functionSelector = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(functionSignature)).slice(0, 10);
  const abi = contractsInterfaces[contractName].abi;
  const contract = new ethers.Contract(contractAddr, abi, provider);

  const params = {
    name: `${saleId}_${contractName}_${new Date().toISOString().split(".")[0]}${process.env.DATABASE_URL!.includes("neon.tech") ? "" : "___LOCALHOST"}`,
    execAddress: contractAddr,
    execSelector: functionSelector,
    dedicatedMsgSender: true,
    web3FunctionHash: "QmVieGC8HszPJ16KRB57mrbJ8vCDr8GaYwseLAs2Cu9KcF", // hardcoded, got it from Gelato team member
    web3FunctionArgs: { consumerAddress: contractAddr },
    trigger: {
      type: TriggerType.EVENT,
      filter: {
        topics: [[contract.interface.getEventTopic("RequestedRandomness")]],
        address: contract.address,
      },
      blockConfirmations: 1,
    }
  }
  const task = await gelatoAutomate.createTask(params as any);
  const { taskId, tx } = task;
  await tx.wait();
  console.log(`📑 Gelato task for ${contractName}: https://app.gelato.network/functions/task/${taskId}:${chainId}`);
  return { taskId, tx }
};