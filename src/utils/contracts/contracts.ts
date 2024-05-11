import { ethers } from "ethers";
import { ERC2771Type, GelatoRelay } from "@gelatonetwork/relay-sdk";
import {
  publicClient,
  userClient,
  waitForTransactionReceipt,
} from "../../services/viem";
import { PrefixedHexString } from "ethereumjs-util";
import { default as usdcAbi } from "../../services/contracts/usdcAbi.json";
import { default as lotteryV1Abi } from "../../services/contracts/LotteryV1.json";
import { default as lotteryV2Abi } from "../../services/contracts/LotteryV2.json";
import { default as auctionV1Abi } from "../../services/contracts/AuctionV1.json";
import { default as auctionV2Abi } from "../../services/contracts/AuctionV2.json";
import { calculateWinningProbability } from "@/utils/calculateWinningProbability";

const sendGaslessTransaction = async (
  contractAddr,
  method,
  args,
  abi,
  signer,
  chainId,
  toast,
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
        const { taskState, transactionHash, lastCheckMessage } =
          responseJson.task;

        console.log("😆 responseJson.task: ", responseJson.task);

        if (["ExecSuccess", "ExecReverted", "Cancelled"].includes(taskState)) {
          clearInterval(statusQueryInterval);

          if (taskState === "ExecSuccess") {
            toast({
              title: "Transaction sent successfully!",
              status: "success",
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
    const res = await sendTransaction(
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

    return res;
  } catch (err) {
    console.error(err);
  }
};
const deposit = async (contractAddr, amount, signer, toast, updateTransactionLoadingState) => {
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

  const balance = await readSmartContract(usdcContract, usdcAbi, "balanceOf", [
    signer._address,
  ] as any);

  console.log("🐮 balance: ", balance);
  console.log("🦦 usdcContract: ", usdcContract);
  updateTransactionLoadingState({id: "approve", name: "USDC Approve", isLoading: true})
  const hash = await sendTransaction(
    usdcContract,
    "approve",
    [contractAddr, amount] as any,
    usdcAbi,
    signer._address,
    toast,
  );

  console.log("🦦 hash: ", hash);
  console.log("🦦 amount: ", amount);

  await waitForTransactionReceipt(hash, 3);
  updateTransactionLoadingState({id: "approve", name: "USDC Approve", isLoading: false, isFinished: true})

  try {
    updateTransactionLoadingState({id: "deposit", name: "USDC Deposit", isLoading: true, isFinished: false})

    const txHash = await sendTransaction(
      contractAddr,
      "deposit",
      [amount] as any,
      [
        {
          type: "function",
          name: "deposit",
          inputs: [
            { name: "amount", type: "uint256", internalType: "uint256" },
          ],
          outputs: [],
          stateMutability: "payable",
        },
      ],
      signer._address,
      toast,
    );

    return txHash;
  } catch (e) {
    console.log(e);
    return { error: "Deposit went wrong, please try again.", txHash: null };
  }
};
const startLottery = async (contractAddr, signer, toast) => {
  const txHash = await sendTransaction(
    contractAddr,
    "startLottery",
    [] as any,
    [
      {
        type: "function",
        name: "startLottery",
        inputs: [],
        outputs: [],
        stateMutability: "nonpayable",
      },
    ],
    signer._address,
    toast,
  );

  return txHash;
};
const endLottery = async (contractAddr, signer, toast) => {
  const txHash = await sendTransaction(
    contractAddr,
    "endLottery",
    [] as any,
    [
      {
        type: "function",
        name: "endLottery",
        inputs: [],
        outputs: [],
        stateMutability: "nonpayable",
      },
    ],
    signer._address,
    toast,
  );

  return txHash;
};

const sellerWithdraw = async (contractAddr, signer, toast) => {
  const txHash = await sendTransaction(
    contractAddr,
    "sellerWithdraw",
    [] as any,
    [
      {
        type: "function",
        name: "sellerWithdraw",
        inputs: [],
        outputs: [],
        stateMutability: "nonpayable",
      },
    ],
    signer._address,
    toast,
  );

  return txHash;
};
const transferDeposits = async (
  contractAddr,
  signer,
  toast,
  nextSaleData: {address: string, id: string} | null,
) => {
  const txHash = await sendTransaction(
    contractAddr,
    "transferNonWinnerDeposits",
    [nextSaleData?.address] as any,
    [
      {
        "type": "function",
        "name": "transferNonWinnerDeposits",
        "inputs": [
          {
            "name": nextSaleData?.id+"addr",
            "type": "address",
            "internalType": "address"
          }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
      },
    ],
    signer._address,
    toast,
  );

  return txHash;
};
const mint = async (contractAddr, signer, toast) => {
  const txHash = await sendTransaction(
    contractAddr,
    "mintMyNFT",
    [] as any,
    [
      {
        type: "function",
        name: "mintMyNFT",
        inputs: [],
        outputs: [],
        stateMutability: "nonpayable",
      },
    ],
    signer._address,
    toast,
  );

  return txHash;
};

// Read lotteries data
interface IMethod {
  key: string;
  value: string;
  args?: any[];
  type?: string;
}

const commonMethods = (signer) => [
  { key: "tickets", value: "numberOfTickets", type: "number" },
  {
    key: "userFunds",
    value: "getDepositedAmount",
    type: "number",
    args: [signer._address],
  },
  { key: "price", value: "minimumDepositAmount", type: "number" },
  { key: "winners", value: "getWinners" },
  { key: "vacancyTicket", value: "numberOfTickets", type: "number" },
  { key: "isLotteryStarted", value: "lotteryState", type: "boolean" },
  { key: "sellerWalletAddress", value: "seller" },
  {
    key: "hasMinted",
    value: "hasMinted",
    type: "boolean",
    args: [signer._address],
  },
];
const requestForEachMethod = async (methods, contractAddr, abi) => {
  let result: any = {};
  for (const method of methods) {
    const res = await readSmartContract(
      contractAddr,
      abi,
      method.value,
      (method?.args as never[]) || [],
    );
    if (method?.type === "number") {
      result[method.key] = Number(res);
    } else if (method?.type === "boolean") {
      result[method.key] = Boolean(res);
    } else {
      result[method.key] = res;
    }
  }

  return result;
};
const getLotteryV1Data = async (signer, contractAddr) => {
  const methods = [
    ...commonMethods(signer),
    { key: "users", value: "getParticipants" },
    { key: "randomNumber", value: "randomNumber" },
    { key: "isWinner", value: "isWinner", args: [signer._address] },
  ] as IMethod[];
  let result: any = await requestForEachMethod(
    methods,
    contractAddr,
    lotteryV1Abi.abi,
  );

  result["winningChance"] = calculateWinningProbability(
    result.vacancyTicket,
    result.users,
  );
  result["users"] = result?.users?.filter(
    (item, index) => result?.users?.indexOf(item) === index,
  );
  result["missingFunds"] =
    result.price - result.userFunds <= 0 ? 0 : result.price - result.userFunds;
  return result;
};
const getLotteryV2Data = async (signer, contractAddr) => {
  const methods = [
    ...commonMethods(signer),
    { key: "rollPrice", value: "rollPrice", type: "number" },
    { key: "rollTolerance", value: "rollTolerance", type: "number" },
    { key: "rolledNumbers", value: "rolledNumbers", args: [signer._address] },
    { key: "users", value: "getParticipants" },
    { key: "randomNumber", value: "randomNumber" },
  ] as IMethod[];
  let result: any = await requestForEachMethod(
    methods,
    contractAddr,
    lotteryV2Abi.abi,
  );

  result["missingFunds"] =
    result.price - result.userFunds <= 0 ? 0 : result.price - result.userFunds;
  result["winningChance"] = calculateWinningProbability(
    result.vacancyTicket,
    result.users,
  );
  result["users"] = result?.users?.filter(
    (item, index) => result?.users?.indexOf(item) === index,
  );
  return result;
};
const getAuctionV1Data = async (signer, contractAddr) => {
  const methods = [
    ...commonMethods(signer),
    {
      key: "prevRoundTicketsAmount",
      value: "prevRoundTicketsAmount",
      type: "number",
    },
    { key: "prevRoundDeposits", value: "prevRoundDeposits", type: "number" },
    { key: "users", value: "getParticipants" },
  ] as IMethod[];
  let result: any = await requestForEachMethod(
    methods,
    contractAddr,
    auctionV1Abi.abi,
  );

  result["missingFunds"] =
    result.price - result.userFunds <= 0 ? 0 : result.price - result.userFunds;
  result["winningChance"] = calculateWinningProbability(
    result.vacancyTicket,
    result.users,
  );
  result["users"] = result?.users?.filter(
    (item, index) => result?.users?.indexOf(item) === index,
  );
  return result;
};
const getAuctionV2Data = async (signer, contractAddr) => {
  const methods = [
    ...commonMethods(signer),
    { key: "userDeposits", value: "deposits", args: [signer._address] },
    { key: "isParticipant", value: "isParticipant", args: [signer._address] },
    { key: "initialPrice", value: "initialPrice", type: "number" },
  ] as IMethod[];

  let result: any = await requestForEachMethod(
    methods,
    contractAddr,
    auctionV2Abi.abi,
  );

  result["missingFunds"] =
    result.price - result.userFunds <= 0 ? 0 : result.price - result.userFunds;
  result["winningChance"] = 20;
  result["missingFunds"] =
    result.price - result.userFunds <= 0 ? 0 : result.price - result.userFunds;
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
  getAuctionV2Data,
  getLotteryV2Data,
  getLotteryV1Data,
  getAuctionV1Data,
  windowEthereum,
  startLottery,
  readSmartContract,
  mint,
  endLottery,
  transferDeposits,
  sellerWithdraw,
};
