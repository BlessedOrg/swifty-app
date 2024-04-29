import { ethers } from "ethers";
import { AutomateSDK, TriggerType } from "@gelatonetwork/automate-sdk";
import { PrefixedHexString } from "ethereumjs-util";
import { contractsInterfaces } from "./viem";

const provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_JSON_RPC_URL);
const signer = new ethers.Wallet(process.env.GELATO_SIGNER_PRIVATE_KEY as string, provider);
const gelatoAutomate = new AutomateSDK(
  Number(process.env.NEXT_PUBLIC_CHAIN_ID),
  signer
);

export const getGelatoActiveTasks = async () => {
  const tasks = await gelatoAutomate.getActiveTasks(process.env.GELATO_SIGNER_PUBLIC_KEY);
  console.log("🔥 tasks: ", tasks)
  return tasks;
};

export const cancelGelatoTasks = async () => {
  const tasks = await getGelatoActiveTasks();
  const ids = tasks.map(t => t.taskId)
    .filter(t => t !== "0xcc02c1f984a1b386e1a7ad28c00f8c7fa5291cab789d37a974fa8790c794a151")
    .filter(t => t !== "0xa3d219db70e49b003eb58b90053dfbf3b4372f9bacc831e76351fd01555fe016")
    .filter(t => t !== "0xe7ccb1066bf8c97621468927b7755bfd702676ae5a6e34e56a32d736cd61b3dc")
  console.log("🐮 ids: ", ids.length)

  let taskId = 0;
  const cancelTask = async (id) => {
    taskId = id;
    const deleted = await gelatoAutomate.cancelTask(taskId as any);
    await deleted.tx.wait(2);
    console.log("✅ Deleted: ", deleted.taskId)
  };

  for (const task of ids) {
    try {
      await cancelTask(task);
    } catch (error) {
      await cancelTask(taskId);
    }
  }
};

export const createGelatoTask = async (contractAddr: PrefixedHexString, contractName: string, saleId: PrefixedHexString, singleExec: boolean | undefined = false) => {
  const functionSignature = '_fulfillRandomness(uint256,uint256,bytes)';
  const functionSelector = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(functionSignature)).slice(0, 10);

  const abi = contractsInterfaces[contractName].abi;
  const contract = new ethers.Contract(contractAddr, abi, provider);

  const params = {
    name: `${saleId}_${contractName}_${new Date().toISOString().split(".")[0]}${singleExec ? "_singleExec" : ""}`,
    execAddress: contractAddr,
    execSelector: functionSelector,
    dedicatedMsgSender: true,
    web3FunctionHash: "QmVieGC8HszPJ16KRB57mrbJ8vCDr8GaYwseLAs2Cu9KcF", // hardcoded, got it from Gelato team member
    web3FunctionArgs: { consumerAddress: contractAddr },
    ...singleExec
      ? { singleExec: true }
      : {
        trigger: {
          type: TriggerType.EVENT,
          filter: {
            topics: [[contract.interface.getEventTopic("RequestedRandomness")]],
            address: contract.address,
          },
          blockConfirmations: 1,
        },
      },
  }
  const { taskId, tx } = await gelatoAutomate.createTask(params as any);
  await tx.wait();
  return { taskId, tx }
};