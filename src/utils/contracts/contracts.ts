import { ethers } from "ethers";
import { ERC2771Type, GelatoRelay } from "@gelatonetwork/relay-sdk";
import { contractsInterfaces, publicClient, userClient, waitForTransactionReceipt } from "services/viem";
import { calculateWinningProbability } from "@/utils/calculateWinningProbability";
import { fetcher } from "requests/requests";
import { auctionV1ContractFunctions } from "@/utils/contracts/salesContractFunctions";
import { extractTxErrorReason } from "@/utils/extractTxErrorReason";
import { PrefixedHexString, usdcContractDecimals } from "services/web3Config";

const sendGaslessTransaction = async (contractAddr, method, args, abi, signer, chainId, toast, callerId) => {
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
        user: signer.address,
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
                taskId,
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

const sendTransaction = async (contractAddr, method, args = [], abi, callerAddr, confirmations = 1) => {
  const { request } = await publicClient.simulateContract({
    account: callerAddr as PrefixedHexString,
    address: contractAddr as PrefixedHexString,
    abi,
    functionName: method,
    args,
  });

  const hash = await userClient.writeContract(request);
  console.log(`#️⃣ hash (${method}): `, hash);
  await waitForTransactionReceipt(hash, confirmations);
  return hash;
};

const readSmartContract = async (contractAddr, abi, method, args: any[] = []) => {
  return await publicClient.readContract({
    address: contractAddr,
    abi,
    functionName: method,
    args,
  });
};

const readDepositedAmount = async (contractAddr, signer) => {
  const res = await readSmartContract(
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
      [signer.address] as any,
  );
  return Number(res) / 10 ** usdcContractDecimals

};

const withdraw = async (contractAddr, signer) => {
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
      signer.address,
    );
  } catch (e: any) {
    return {
      error: extractTxErrorReason(e?.message || "Something went wrong"),
    };
  }
};

const approve = async (contractAddr, amount, signer) => {
  try {
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

    return await sendTransaction(
      usdcContract,
      "approve",
      [contractAddr, amount * 10 ** usdcContractDecimals] as any,
      contractsInterfaces["USDC"],
      (signer as any).address,
    );
  } catch (e: any) {
    return {
      error: extractTxErrorReason(e?.message || "Something went wrong"),
    };
  }
};

const deposit = async (contractAddr, amount, signer) => {
  try {
    return await sendTransaction(
      contractAddr,
      "deposit",
      [amount * 10 ** usdcContractDecimals] as any,
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
      signer.address,
    );
  } catch (e: any) {
    return {
      error: extractTxErrorReason(e?.message || "Something went wrong"),
    };
  }
};

const startLottery = async (contractAddr, signer) => {
  try {
    return await sendTransaction(
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
      signer.address,
    );
  } catch (e: any) {
    return {
      error: extractTxErrorReason(e?.message || "Something went wrong"),
    };
  }
};

const endLottery = async (contractAddr, signer) => {
  return await sendTransaction(
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
    signer.address,
  );
};

const sellerWithdraw = async (contractAddr, signer) => {
  return await sendTransaction(
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
    signer.address,
  );
};

const transferDeposits = async (
  contractAddr,
  signer,
  nextSaleData: { address: string; id: string } | null,
) => {
  const setSaleAddressMethodPerId = {
    lotteryV2: "setLotteryV1Addr",
    auctionV1: "setLotteryV2Addr",
    auctionV2: "setAuctionV1Addr",
  };
  const method = nextSaleData?.id
    ? setSaleAddressMethodPerId?.[nextSaleData?.id]
    : "";
  const setSaleAddress = await sendTransaction(
    nextSaleData?.address,
    method,
    [contractAddr] as any,
    [
      {
        name: method,
        outputs: [],
        inputs: [
          {
            internalType: "address",
            name: `_${nextSaleData?.id + "Addr"}`,
            type: "address",
          },
        ],
        stateMutability: "nonpayable",
        type: "function",
      },
    ],
    signer.address,
  );

  await waitForTransactionReceipt(setSaleAddress, 1);
  const methodName =
    nextSaleData?.id === "auctionV2"
      ? "transferNonWinnerBids"
      : "transferNonWinnerDeposits";

  return await sendTransaction(
    contractAddr,
    methodName,
    [nextSaleData?.address] as any,
    [
      {
        type: "function",
        name: methodName,
        inputs: [
          {
            name: nextSaleData?.id + "addr",
            type: "address",
            internalType: "address",
          },
        ],
        outputs: [],
        stateMutability: "nonpayable",
      },
    ],
    signer.address,
  );
};

const mint = async (contractAddr, signer) => {
  try {
    return await sendTransaction(
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
      signer.address,
      3,
    );
  } catch (e) {
    return {
      error: extractTxErrorReason(
        (e as any)?.message || "Something went wrong",
      ),
    };
  }
};

interface IMethod {
  key: string;
  value: string;
  args?: any[];
  type?: string;
}

const commonMethods = (signer) => [
  { key: "tickets", value: "numberOfTickets", type: "number" },
  { key: "isWinner", value: "isWinner", args: [signer.address] },
  { key: "price", value: "ticketPrice", type: "number" },
  { key: "winners", value: "getWinners" },
  { key: "vacancyTicket", value: "numberOfTickets", type: "number" },
  { key: "isLotteryStarted", value: "lotteryState", type: "lotteryState" },
  { key: "lotteryState", value: "lotteryState", type: "lotteryStateEnum" },
  { key: "sellerWalletAddress", value: "seller" },
  { key: "hasMinted", value: "hasMinted", type: "boolean", args: [signer.address] },
];

const lotteryStateKeys = {
  0: "NOT_STARTED",
  1: "ACTIVE",
  2: "ENDED",
};
const requestForEachMethod = async (methods, contractAddr, abi) => {
  let result: any = {};
  for (const method of methods) {
    const res = (await readSmartContract(
      contractAddr,
      abi,
      method.value,
      (method?.args as never[]) || [],
    )) as number | string;
    if (method?.type === "number") {
      result[method.key] = Number(res);
    } else if (method?.type === "boolean") {
      result[method.key] = Boolean(res);
    } else if (method?.type === "lotteryState") {
      result[method.key] = res === 0 || res === 2 ? false : true;
    } else if (method?.type === "lotteryStateEnum") {
      result[method.key] = lotteryStateKeys[res] || "ENDED";
    } else {
      result[method.key] = res;
    }
    if (["getDepositedAmount", "ticketPrice", "initialPrice", "rollPrice"].includes(method.value)) {
      result[method.key] = Number(res) / 10 ** usdcContractDecimals;
    }
  }

  return result;
};

const getLotteryV1Data = async (signer, contractAddr) => {
  const methods = [
    ...commonMethods(signer),
    { key: "randomNumber", value: "randomNumber" },
    { key: "userFunds", value: "getDepositedAmount", type: "number", args: [signer.address] },
    { key: "users", value: "getParticipants" },
  ] as IMethod[];
  let result: any = await requestForEachMethod(methods, contractAddr, contractsInterfaces["LotteryV1"].abi);

  result["winningChance"] = calculateWinningProbability(result.vacancyTicket, result.users);
  result["users"] = result?.users?.filter((item, index) => result?.users?.indexOf(item) === index);
  result["missingFunds"] = result.price - result.userFunds <= 0 ? 0 : result.price - result.userFunds;
  return result;
};

const getLotteryV2Data = async (signer, contractAddr) => {
  const methods = [
    ...commonMethods(signer),
    { key: "rollPrice", value: "rollPrice", type: "number" },
    { key: "rollTolerance", value: "rollTolerance", type: "number" },
    { key: "rolledNumbers", value: "rolledNumbers", args: [signer.address] },
    { key: "randomNumber", value: "randomNumber" },
    { key: "userFunds", value: "getDepositedAmount", type: "number", args: [signer.address] },
    { key: "users", value: "getParticipants" },
  ] as IMethod[];
  let result: any = await requestForEachMethod(methods, contractAddr, contractsInterfaces["LotteryV2"].abi);

  result["missingFunds"] = result.price - result.userFunds <= 0 ? 0 : result.price - result.userFunds;
  result["winningChance"] = calculateWinningProbability(result.vacancyTicket, result.users);
  result["users"] = result?.users?.filter((item, index) => result?.users?.indexOf(item) === index,);
  return result;
};

const getAuctionV1Data = async (signer, contractAddr, roundIndex=0) => {
  const methods = [
    ...commonMethods(signer),
    { key: "prevRoundTicketsAmount", value: "prevRoundTicketsAmount", type: "number" },
    { key: "totalNumberOfTickets", value: "totalNumberOfTickets", type: "number" },
    { key: "numberOfTickets", value: "numberOfTickets", type: "number" },
    { key: "roundCounter", value: "roundCounter", type: "number" },
    { key: "currentPrice", value: "ticketPrice", type: "number" },
    { key: "prevRoundDeposits", value: "prevRoundDeposits", type: "number" },
    { key: "userFunds", value: "getDepositedAmount", type: "number", args: [signer.address] },
    { key: "users", value: "getParticipants", args: [] },
  ] as IMethod[];
  let result: any = await requestForEachMethod(methods, contractAddr, contractsInterfaces["AuctionV1"].abi);

  function calculateWinningChance() {
    const totalTickets = result?.numberOfTickets;
    const ticketsForParticipant = Math.floor(result?.userFunds / result?.currentPrice,);
    const winningChance = ticketsForParticipant / totalTickets;
    if (totalTickets >= result?.eligibleParticipants) {
      return 1;
    } else if (winningChance === Infinity) {
      return 1;
    } else if (result?.userFunds === 0) {
      return 0;
    } else {
      return winningChance;
    }
  }

  result["missingFunds"] = result.price - result.userFunds <= 0 ? 0 : result.price - result.userFunds;
  result["winningChance"] = Math.round(calculateWinningChance() * 100);
  result["users"] = result?.users?.filter((item, index) => result?.users?.indexOf(item) === index);
  return result;
};
const getAuctionV2Data = async (signer, contractAddr) => {
  const methods = [
    ...commonMethods(signer),
    { key: "userDeposits", value: "deposits", args: [signer.address] },
    { key: "isParticipant", value: "isParticipant", args: [signer.address] },
    { key: "initialPrice", value: "initialPrice", type: "number" },
    { key: "userFunds", value: "getDepositedAmount", type: "number", args: [signer.address] },
    { key: "users", value: "getParticipants" },
  ] as IMethod[];

  let result: any = await requestForEachMethod(
    methods,
    contractAddr,
    contractsInterfaces["AuctionV2"].abi,
  );

  const participantsStats = await auctionV1ContractFunctions.getUsersStatsAv2(contractAddr);
  result["missingFunds"] = result.price - result.userFunds <= 0 ? 0 : result.price - result.userFunds;
  result["winningChance"] = 20;
  result["missingFunds"] = result.price - result.userFunds <= 0 ? 0 : result.price - result.userFunds;
  result["userDeposits"] = {
    amount: Number(result?.userDeposits?.[0]) / 10 ** usdcContractDecimals || 0,
    timestamp: Number(result?.userDeposits?.[1]) || 0,
    isWinner: Boolean(result?.userDeposits?.[2]) || false,
  };
  result["participantsStats"] = participantsStats;
  return result;
};

const selectWinners = async (contractAddr, signer, toast) => {
  return await sendTransaction(
    contractAddr,
    "selectWinners",
    [] as any,
    [
      {
        type: "function",
        name: "selectWinners",
        inputs: [],
        outputs: [],
        stateMutability: "nonpayable",
      },
    ],
    signer.address,
  );
};

const windowEthereum = typeof window !== "undefined" && window?.ethereum;

export {
  sendGaslessTransaction,
  sendTransaction,
  approve,
  deposit,
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
  selectWinners,
  requestForEachMethod
};
