import { log, LogType, ticketSale } from "@/prisma/models";
import { account, contractsInterfaces, publicClient, client, deployFactoryContract } from "services/viem";
import { NextResponse } from "next/server";
import { AutomateSDK, TriggerType } from "@gelatonetwork/automate-sdk";
import { ethers } from "ethers";
import { PrefixedHexString } from "ethereumjs-util";

const provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_JSON_RPC_URL);
const signer = new ethers.Wallet(process.env.GELATO_SIGNER_PRIVATE_KEY as string, provider);
const gelatoAutomate = new AutomateSDK(
  Number(process.env.NEXT_PUBLIC_CHAIN_ID),
  signer
);

const cancelGelatoTasks = async () => {
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

const getGelatoActiveTasks = async () => {
  const tasks = await gelatoAutomate.getActiveTasks(process.env.GELATO_SIGNER_PUBLIC_KEY);
  console.log("🔥 tasks: ", tasks)
  return tasks;
};

const createGelatoTask = async (contractAddr: PrefixedHexString, contractName: string, saleId: PrefixedHexString) => {
  const functionSignature = '_fulfillRandomness(uint256,uint256,bytes)';
  const functionSelector = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(functionSignature)).slice(0, 10);

  const abi = contractsInterfaces[contractName].abi;
  const contract = new ethers.Contract(contractAddr, abi, provider);

  const params = {
    name: `${saleId}_${contractAddr}_${contractName}_${new Date().toISOString().split(".")[0]}`,
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
    },
  }
  const { taskId, tx } = await gelatoAutomate.createTask(params as any);
  await tx.wait();
  return { taskId, tx }
};

const setBaseContracts = async (contractAddr, abi, nonce) => {
  const handleSmartContractCall = async () => {
    const setBaseContractsTx = await client.writeContract({
      address: contractAddr,
      functionName: "setBaseContracts",
      args: [
        "0xA69bA2a280287405907f70c637D8e6f1B278E613",
        "0xa61702B2FF81cE5a69425ADd5525985221397cc2",
        "0xC5a6F8f72f1c2036203F2e65D90e61EdfF1e8310",
        "0x7deC58c358A10851724Aa0bdd79A2794570e3BfA",
        "0x5CF63Ba8b947E4770D7030508B0753C8aB617fbc",
      ],
      abi,
      account,
      nonce: nonce,
    });
    console.log("⚾ setBaseContractsTx: ", setBaseContractsTx)
    await publicClient.waitForTransactionReceipt({
      hash: setBaseContractsTx,
      confirmations: 1,
    });
  };

  try {
    await handleSmartContractCall()
  } catch (error) {
    nonce++;
    console.log("🚨 Error while calling `setBaseContracts`: " + (error as any).message, ". \n🏗 ️Retrying...");
    await setBaseContracts(contractAddr, abi, nonce)
  }
};

const createSale = async (contractAddr, abi, nonce, sale) => {
  const handleSmartContractCall = async () => {
    const createSaleTx = await client.writeContract({
      address: contractAddr,
      functionName: "createSale",
      args: [
        sale.seller.walletAddr,
        process.env.NEXT_PUBLIC_GELATO_VRF_OPERATOR as string,
        sale.seller.walletAddr,
        `https://blessed.fan/api/events/${sale.id}/`,
      ],
      abi,
      account,
      nonce: nonce + 1
    });
    console.log("💸 createSaleTx: ", createSaleTx)
    await publicClient.waitForTransactionReceipt({
      hash: createSaleTx,
      confirmations: 1,
    });
  };

  try {
    await handleSmartContractCall()
  } catch (error) {
    nonce++;
    console.log("🚨 Error while calling `createSale`: " + (error as any).message, ". \n🏗 ️Retrying...");
    await createSale(contractAddr, abi, nonce, sale)
  }
};

export async function GET(req, { params }) {
  let sellerId;
  try {
    const latestNonce = await publicClient.getTransactionCount({
      address: account.address,
      blockTag: "latest"
    });
    const safeNonce = await publicClient.getTransactionCount({
      address: account.address,
      blockTag: "safe"
    });
    const finalizedNonce = await publicClient.getTransactionCount({
      address: account.address,
      blockTag: "finalized"
    });
    const pendingNonce = await publicClient.getTransactionCount({
      address: account.address,
      blockTag: "pending"
    });
    const earliestNonce = await publicClient.getTransactionCount({
      address: account.address,
      blockTag: "earliest"
    });

    let nonce = pendingNonce > safeNonce ? pendingNonce + 1 : safeNonce;
    console.log({latestNonce,safeNonce,finalizedNonce, pendingNonce, earliestNonce});
    console.log("🐮 nonce: ", nonce)

    const { id } = params;
    const sale = await ticketSale.findUnique({
      where: {
        id: id as string,
      },
      include: {
        seller: true,
      },
    });
    sellerId = sale?.seller?.id;

    console.log("🐮 sale: ", sale)

    if (!sale) {
      throw new Error(`sale not found`);
    }

    if (sale?.lotteryV1contractAddr) {
      throw new Error(`LotteryV1 already deployed`);
    }
    if (sale?.lotteryV2contractAddr) {
      throw new Error(`LotteryV2 already deployed`);
    }
    if (sale?.auctionV1contractAddr) {
      throw new Error(`AuctionV1 already deployed`);
    }
    if (sale?.auctionV2contractAddr) {
      throw new Error(`AuctionV2 already deployed`);
    }

    let updateAttrs = {};
    let deployedContract: { contractAddr: any; hash?: `0x${string}`; abi: any[] };
    deployedContract = await deployFactoryContract();
    const abi = deployedContract?.abi;

    await setBaseContracts(deployedContract?.contractAddr, abi, nonce);
    await createSale(deployedContract?.contractAddr, abi, nonce, sale);

    const currentIndex: any = await publicClient.readContract({
      address: deployedContract.contractAddr,
      abi,
      functionName: 'currentIndex',
      args: []
    });

    const lotteryV1Address = await publicClient.readContract({
      address: deployedContract.contractAddr,
      abi,
      functionName: 'sales',
      args: [Number(currentIndex) - 1, 0]
    });
    const lotteryV2Address = await publicClient.readContract({
      address: deployedContract.contractAddr,
      abi,
      functionName: 'sales',
      args: [Number(currentIndex) - 1, 1]
    });
    const auctionV1Address = await publicClient.readContract({
      address: deployedContract.contractAddr,
      abi,
      functionName: 'sales',
      args: [Number(currentIndex) - 1, 2]
    });
    const auctionV2Address = await publicClient.readContract({
      address: deployedContract.contractAddr,
      abi,
      functionName: 'sales',
      args: [Number(currentIndex) - 1, 3]
    });

    const addresses: any[] = [lotteryV1Address, lotteryV2Address, auctionV1Address, auctionV2Address];
    if (addresses.includes("0x0000000000000000000000000000000000000000")) {
      throw new Error(`There was a problem with deploying contracts. Contact the admin for details. Sale ID: ${sale.id}`)
    }

    let lotteryV1Task: any;
    let lotteryV2Task: any;
    let auctionV1Task: any;
    if (lotteryV1Address) lotteryV1Task = await createGelatoTask(lotteryV1Address as any, "LotteryV1", sale.id);
    if (lotteryV2Address) lotteryV2Task = await createGelatoTask(lotteryV2Address as any, "LotteryV2", sale.id);
    if (auctionV1Address) auctionV1Task = await createGelatoTask(auctionV1Address as any, "AuctionV1", sale.id);

    updateAttrs = {
      lotteryV1contractAddr: lotteryV1Address,
      lotteryV2contractAddr: lotteryV2Address,
      auctionV1contractAddr: auctionV1Address,
      auctionV2contractAddr: auctionV2Address,
      lotteryV1settings: {
        ...sale.lotteryV1settings as any,
        taskId: lotteryV1Task.taskId,
        hash: lotteryV1Task.tx.hash
      },
      lotteryV2settings: {
        ...sale.lotteryV2settings as any,
        taskId: lotteryV2Task.taskId,
        hash: lotteryV2Task.tx.hash
      },
      auctionV1settings: {
        ...sale.auctionV1settings as any,
        taskId: auctionV1Task.taskId,
        hash: auctionV1Task.tx.hash
      },
      factoryContractAddr: deployedContract.contractAddr,
      factoryContractCurrentIndex: Number(currentIndex),
    };

    const newTicketSale = await ticketSale.update({
      where: {
        id: sale.id,
      },
      data: updateAttrs,
    });

    if (newTicketSale) {
      await log.create({
        data: {
          userId: sale.seller.id,
          type: LogType["ticketSaleCreationSuccess"],
          payload: {
            ...updateAttrs
          }
        },
      })
    }

    console.log({
      contractAddr: deployedContract.contractAddr,
      lotteryV1contractAddr: lotteryV1Address,
      lotteryV2contractAddr: lotteryV2Address,
      auctionV1contractAddr: auctionV1Address
    });

    return NextResponse.json(
      {
        error: null,
        contractAddr: deployedContract.contractAddr,
        lotteryV1contractAddr: lotteryV1Address,
        lotteryV2contractAddr: lotteryV2Address,
        auctionV1contractAddr: auctionV1Address,
      },
      { status: 200 },
    );
  } catch (error) {
    console.log("🚨 Error while deploying Smart Contracts: ", (error as any).message)
    if (sellerId) {
      await log.create({
        data: {
          userId: sellerId,
          type: LogType["ticketSaleCreationFailure"],
          payload: {
            ...(error as any).message
          }
        },
      })
    }
    return NextResponse.json({ error: (error as any)?.message }, { status: 400 });
  }
}
