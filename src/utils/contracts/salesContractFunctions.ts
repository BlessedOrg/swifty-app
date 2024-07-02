import { readSmartContract, sendTransaction } from "@/utils/contracts/contracts";
import { contractsInterfaces, waitForTransactionReceipt } from "../../services/viem";
import { extractTxErrorReason } from "@/utils/extractTxErrorReason";

const callTransaction = async (callback, method, toast, updateLoadingState) => {
  try {
    const txHash = await callback();
    console.log(txHash);
    updateLoadingState(true);
    const confirmation = await waitForTransactionReceipt(txHash, 2);

    if (confirmation?.status === "success") {
      toast({
        status: "success",
        title: `${method} successfully!`,
      });
    }
    if (confirmation?.status === "reverted") {
      toast({
        status: "error",
        title: `${method} went wrong!`,
      });
    }
    updateLoadingState(false);
    return { txHash, confirmation, error: null };
  } catch (e: any) {
    updateLoadingState(false);
    console.error(e);
    toast({
      status: "error",
      title: `${extractTxErrorReason(e?.message || "Something went wrong.")}`,
    });
    return {
      txHash: null,
      confirmation: null,
      error: `${extractTxErrorReason(e?.message || "Something went wrong.")}`,
      errorState: e,
    };
  }
};

const selectWinners = async (contractAddr, signer, toast, updateLoadingState) => {
  const callbackFn = async () =>
    sendTransaction(
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
      signer.address
    );
  return await callTransaction(
    callbackFn,
    "Select Winners",
    toast,
    updateLoadingState,
  );
};

const setRollPrice = async (contractAddr, signer, toast, updateLoadingState, rollPrice) => {
  const callbackFn = async () =>
    sendTransaction(
      contractAddr,
      "setRollPrice",
      [rollPrice * 10**6] as any,
      [
        {
          name: "setRollPrice",
          outputs: [],
          inputs: [
            {
              internalType: "uint256",
              name: "_rollPrice",
              type: "uint256",
            },
          ],
          stateMutability: "nonpayable",
          type: "function",
        },
      ],
      signer.address
    );
  return await callTransaction(
    callbackFn,
    "🎲Roll number",
    toast,
    updateLoadingState,
  );
};

const setRollTolerance = async (contractAddr, signer, toast, updateLoadingState, rollTolerance) => {
  const callbackFn = async () =>
    sendTransaction(
      contractAddr,
      "setRollTolerance",
      [rollTolerance] as any,
      [
        {
          name: "setRollTolerance",
          outputs: [],
          inputs: [
            {
              internalType: "uint256",
              name: "_tolerance",
              type: "uint256",
            },
          ],
          stateMutability: "nonpayable",
          type: "function",
        },
      ],
      signer.address
    );
  return await callTransaction(
    callbackFn,
    "🎲Roll number",
    toast,
    updateLoadingState,
  );
};
const rollNumber = async (contractAddr, signer, toast, updateLoadingState) => {
  const callbackFn = async () =>
    sendTransaction(
      contractAddr,
      "roll",
      [] as any,
      [
        {
          type: "function",
          name: "roll",
          inputs: [],
          outputs: [],
          stateMutability: "nonpayable",
        },
      ],
      signer.address
    );
  // let nonce = await fetchNonce();
  //
  // const res2 = await client.writeContract({
  //   address: contractAddr,
  //   abi: contractsInterfaces.LotteryV2.abi,
  //   args: [signer.address],
  //   functionName: "claimNumber",
  //   nonce,
  // });
  //
  // console.log("claim number - ", res2)
  return await callTransaction(
    callbackFn,
    "Roll number",
    toast,
    updateLoadingState,
  );
};

const setupNewRound = async (contractAddr, signer, args, toast, updateLoadingState) => {
  const callbackFn = async () =>
    sendTransaction(
      contractAddr,
      "setupNewRound",
      args,
      contractsInterfaces["AuctionV1"].abi,
      signer.address
    );
  return await callTransaction(
    callbackFn,
    "Setup new round",
    toast,
    updateLoadingState,
  );
};

const roundCounter = async (contractAddr) => {
  return (await readSmartContract(
    contractAddr,
    contractsInterfaces["AuctionV1"].abi,
    "roundCounter",
  )) as string[];
};

const finishAt = async (contractAddr) => {
  return (await readSmartContract(
    contractAddr,
    contractsInterfaces["AuctionV1"].abi,
    "finishAt",
  )) as string[];
};

const round = async (contractAddr, roundCounter) => {
  if (roundCounter < 0) return {};
  return (await readSmartContract(
    contractAddr,
    contractsInterfaces["AuctionV1"].abi,
    "rounds",
    [roundCounter] as any,
  )) as string[];
};

const checkIfCallerIsWinnerInLotteryV1 = async (contractAddr, callerAddr) => {
  return (await readSmartContract(
    contractAddr,
    contractsInterfaces["AuctionV1"].abi,
    "isWinner",
    [callerAddr] as any
  )) as string[];
};

const getUsersStatsAv2 = async (contractAddr) => {
  const res = (await readSmartContract(
    contractAddr,
    contractsInterfaces["AuctionV2"].abi,
    "getParticipants",
  )) as string[];

  const users = res || [];
  let usersWithStats: any[] = [];
  for (const user of users) {
    const res = await readSmartContract(
      contractAddr,
      contractsInterfaces["AuctionV2"].abi,
      "Deposits",
      [user] as any,
    );
    const formattedData = {
      amount: (Number(res?.[0]) / 10**6) || 0,
      timestamp: Number(res?.[1]) || 0,
      isWinner: Boolean(res?.[2]) || false,
      address: user,
    };
    usersWithStats.push(formattedData);
  }
  return usersWithStats;
};

const lotteryV1ContractFunctions = {
  selectWinners,
};

const lotteryV2ContractFunctions = {
  rollNumber,
  setRollPrice,
  setRollTolerance,
  checkIfCallerIsWinnerInLotteryV1,
};

const auctionV1ContractFunctions = {
  setupNewRound,
  getUsersStatsAv2,
  roundCounter,
  finishAt,
  round,
};

export {
  lotteryV1ContractFunctions,
  lotteryV2ContractFunctions,
  auctionV1ContractFunctions,
  callTransaction,
};
