import { ethers } from "ethers";
import { ERC2771Type, GelatoRelay } from "@gelatonetwork/relay-sdk";
import { contractsInterfaces, publicClient, userClient } from "../services/viem";
import { PrefixedHexString } from "ethereumjs-util";
import { calculateWinningProbability } from "@/utilscalculateWinningProbability";
import { fetcher } from "../requests/requests";

const sendGaslessTransaction = async (
  contractAddr,
  method,
  args,
  abi,
  signer,
  chainId,
  toast,
  callerId
) => {
  const sendTransaction = async () => {
    if (!chainId || !signer || !method) return;

    try {
      const relay = new GelatoRelay();
      const contract = new ethers.Contract(contractAddr, abi, signer);
      const { data } = await contract.populateTransaction[method](...args);

      if (!data) return;

      const request = {
        chainId: chainId,
        target: contractAddr,
        data: data,
        user: signer._address,
      };

      const { struct, signature } = await relay.getSignatureDataERC2771(
        request,
        signer,
        ERC2771Type.SponsoredCall,
      );

      const res = await fetch("/api/gaslessTx", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          signature,
          struct,
        }),
      }).then((res) => res.json());

      if (res.taskId) {
        await checkTaskState(res.taskId);
      }
    } catch (error) {
      console.error(
        "🚨 Error while sending gasless TX: ",
        (error as any).message,
      );
      toast({
        title: "Transaction failed.",
        status: "error",
      });
    }
  };

  const checkTaskState = async (taskId) => {
    const intervalDuration = 1500; // Interval duration in milliseconds
    const statusQueryInterval = setInterval(async () => {
      try {
        const url = `https://relay.gelato.digital/tasks/status/${taskId}`;
        const response = await fetch(url);
        const responseJson = await response.json();
        const { taskState, effectiveGasPrice, gasUsed } = responseJson.task;

        if (["ExecSuccess", "ExecReverted", "Cancelled"].includes(taskState)) {
          clearInterval(statusQueryInterval);

          if (taskState === "ExecSuccess") {
            toast({
              title: "Transaction sent successfully!",
              status: "success",
            });
            await fetcher("api/gaslessTx/log", {
              method: "POST",
              body: JSON.stringify({
                gasSaved: effectiveGasPrice * gasUsed,
                userId: callerId,
                taskId
              }),
            });
          } else {
            toast({
              title: "Transaction failed.",
              status: "error",
            });
          }
        }
      } catch (error) {
        console.error(
          "🚨 Error while checking gasless TX: ",
          (error as any).message,
        );
        clearInterval(statusQueryInterval);
        toast({
          title: "Transaction checking failed.",
          status: "error",
        });
      }
    }, intervalDuration);
  };

  sendTransaction();
};

const sendTransaction = async (
  contractAddr,
  method,
  args = [],
  abi,
  callerAddr,
  toast,
) => {
  const { request } = await publicClient.simulateContract({
    account: callerAddr as PrefixedHexString,
    address: contractAddr as PrefixedHexString,
    abi,
    functionName: method,
    args,
  });

  const hash = await userClient.writeContract(request);
  console.log(`#️⃣ hash (${method}): `, hash);
  // const receipt = await waitForTransactionReceipt(hash, 1);
  toast({
    title: `${method} successfully queued!`,
    status: "success",
  });

  return hash;
};

const readSmartContract = async (contractAddr, abi, method, args = []) => {
  return await publicClient.readContract({
    address: contractAddr,
    abi,
    functionName: method,
    args,
  });
};

const readMinimumDepositAmount = async (contractAddr) => {
  return readSmartContract(
    contractAddr,
    [
      {
        type: "function",
        name: "minimumDepositAmount",
        inputs: [],
        outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
        stateMutability: "view",
      },
    ],
    "minimumDepositAmount",
  );
};

const readDepositedAmount = async (contractAddr, signer) => {
  const balance = await readSmartContract(
    contractAddr,
    [
      {
        type: "function",
        name: "getDepositedAmount",
        inputs: [
          {
            name: "participant",
            type: "address",
            internalType: "address",
          },
        ],
        outputs: [
          {
            name: "",
            type: "uint256",
            internalType: "uint256",
          },
        ],
        stateMutability: "view",
      },
    ],
    "getDepositedAmount",
    [signer._address] as any,
  );

  return balance;
};

const withdraw = async (contractAddr, signer, toast) => {
  console.log("🐬 contractAddr: ", contractAddr);
  console.log("🐥 signer._address: ", signer._address);

  try {
    return await sendTransaction(
      contractAddr,
      "buyerWithdraw",
      [],
      [
        {
          type: "function",
          name: "buyerWithdraw",
          inputs: [],
          outputs: [],
          stateMutability: "nonpayable",
        },
      ],
      signer._address,
      toast,
    );
  } catch (err) {
    console.error(err);
  }
};
const deposit = async (contractAddr, amount, signer, toast) => {
  console.log("🐬 contractAddr: ", contractAddr);
  console.log("🐥 signer._address: ", signer._address);
  const usdcContract = await readSmartContract(
    contractAddr,
    [
      {
        type: "function",
        name: "usdcContractAddr",
        inputs: [],
        outputs: [{ name: "", type: "address", internalType: "address" }],
        stateMutability: "view",
      },
    ],
    "usdcContractAddr",
  );

  const balance = await readSmartContract(usdcContract, contractsInterfaces["USDC"], "balanceOf", [
    signer._address,
  ] as any);

  console.log("🐮 balance: ", balance);

  console.log("🦦 usdcContract: ", usdcContract);

  const hash = await sendTransaction(
    usdcContract,
    "approve",
    [contractAddr, amount] as any,
    contractsInterfaces["USDC"],
    signer._address,
    toast,
  );

  console.log("🦦 hash: ", hash);

  console.log("🦦 amount: ", amount);

  return await sendTransaction(
    contractAddr,
    "deposit",
    [amount] as any,
    [
      {
        type: "function",
        name: "deposit",
        inputs: [{ name: "amount", type: "uint256", internalType: "uint256" }],
        outputs: [],
        stateMutability: "payable",
      },
    ],
    signer._address,
    toast,
  );
};
const startLottery = async (contractAddr,  signer, toast) => {
  return await sendTransaction(
    contractAddr,
    "startLottery",
    [] as any,
    [
      {
        "type": "function",
        "name": "startLottery",
        "inputs": [],
        "outputs": [],
        "stateMutability": "nonpayable"
      },
    ],
    signer._address,
    toast,
  );
}

const selectWinners = async (contractAddr,  signer, toast) => {
  return await sendTransaction(
    contractAddr,
    "selectWinners",
    [] as any,
    [
      {
        "type": "function",
        "name": "selectWinners",
        "inputs": [],
        "outputs": [],
        "stateMutability": "nonpayable"
      }
    ],
    signer._address,
    toast,
  );
}
// Read lotteries data
const getAuctionV2Data = async (signer, contractAddr) => {
  const methods = [
    { key: "tickets", value: "numberOfTickets", type: "number" },
    { key: "isLotteryStarted", value: "lotteryState", type: "boolean" },
    { key: "winners", value: "getWinners" },
    {
      key: "userFunds",
      value: "getDepositedAmount",
      type: "number",
      args: [signer._address],
    },
    { key: "price", value: "minimumDepositAmount", type: "number" },
    { key: "isWinner", value: "isWinner", args: [signer._address] },
  ];

  let result: any = {};

  console.log("📖 Reading data from: ", contractAddr);
  for (const method of methods) {
    const res = await readSmartContract(
      contractAddr,
      contractsInterfaces["AuctionV2"].abi,
      method.value,
      (method?.args as never[]) || [],
    );
    if (method?.type === "number") {
      result[method.key] = Number(res);
    } else if(method?.type === "boolean"){
      result[method.key] = Boolean(res);

    }else {
      result[method.key] = res;
    }
  }

  result["winningChance"] = 20;
  result["missingFunds"] =
    result.price - result.userFunds <= 0 ? 0 : result.price - result.userFunds;
  return result;
};

const getLotteriesDataWithoutAuctionV2 = async (signer, contractAddr, id) => {
  const abiPerId = {
    "lotteryV1": contractsInterfaces["LotteryV1"].abi,
    "lotteryV2": contractsInterfaces["LotteryV2"].abi,
    "auctionV1": contractsInterfaces["AuctionV1"].abi
  }
  const methods = [
    { key: "users", value: "getParticipants" },
    { key: "vacancyTicket", value: "numberOfTickets", type: "number" },
    { key: "isLotteryStarted", value: "lotteryState", type: "boolean" },
    { key: "winners", value: "getWinners" },
    { key: "randomNumber", value: "randomNumber" },
    {
      key: "userFunds",
      value: "getDepositedAmount",
      type: "number",
      args: [signer._address],
    },
    { key: "price", value: "minimumDepositAmount", type: "number" },
    { key: "isWinner", value: "isWinner", args: [signer._address] },
    {key: "sellerWalletAddress", value: "seller"}
  ];

  let result: any = {};
  console.log("📖 Reading data from: ", contractAddr);
  for (const method of methods) {
    const res = await readSmartContract(
      contractAddr,
      abiPerId[id],
      method.value,
      (method?.args as never[]) || [],
    );
    if (method?.type === "number") {
      result[method.key] = Number(res);
    } else if(method?.type === "boolean"){
      result[method.key] = Boolean(res);
    } else {
      result[method.key] = res;
    }
  }

  result["winningChance"] = calculateWinningProbability(result.vacancyTicket, result.users);
  result["missingFunds"] = result.price - result.userFunds <= 0 ? 0 : result.price - result.userFunds;
  return result;
};

const windowEthereum = typeof window !== "undefined" && window?.ethereum;

export {
  sendGaslessTransaction,
  sendTransaction,
  deposit,
  readMinimumDepositAmount,
  readDepositedAmount,
  withdraw,
  getLotteriesDataWithoutAuctionV2,
  getAuctionV2Data,
  windowEthereum,
  startLottery,
  selectWinners
};


