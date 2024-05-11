import { sendTransaction } from "@/utils/contracts/contracts";
import { waitForTransactionReceipt } from "../../services/viem";

const callTransaction = async (callback, method, toast, updateLoadingState) => {
  try {
    const txHash = await callback();
    console.log(txHash)
    updateLoadingState(true);
    const confirmation = await waitForTransactionReceipt(txHash, 3);

    if (confirmation?.status === "success") {
      toast({
        status: "success",
        title: `${method} successfully!`,
      });
    }
    updateLoadingState(false);
    return { txHash, confirmation, error: null };
  } catch (e) {
    updateLoadingState(false);
    console.error(e);
    toast({
      status: "error",
      title: `${method} went wrong! Please try again`,
    });
    return {
      txHash: null,
      confirmation: null,
      error: "Something went wrong",
      errorState: e,
    };
  }
};

const selectWinners = async (contractAddr, signer, toast, updateLoadingState) => {
  const callbackFn = async() => sendTransaction(
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
    signer._address,
    toast,
  );
  const res = await callTransaction(
      callbackFn,
      "Select Winners",
      toast,
      updateLoadingState,
  );
  return res;
};
const setRollPrice = async (
  contractAddr,
  signer,
  toast,
  updateLoadingState,
  rollPrice,
) => {
  const callbackFn = async () =>
    sendTransaction(
      contractAddr,
      "setRollPrice",
      [rollPrice] as any,
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
      signer._address,
      toast,
    );
  const res = await callTransaction(
    callbackFn,
    "🎲Roll number",
    toast,
    updateLoadingState,
  );
  return res;
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
      signer._address,
      toast,
    );
  const res = await callTransaction(
    callbackFn,
    "🎲Roll number",
    toast,
    updateLoadingState,
  );

  return res;
};
const lotteryV1ContractFunctions = {
  selectWinners,
};
const lotteryV2ContractFunctions = {
  rollNumber,
  setRollPrice,
};
export {
  lotteryV1ContractFunctions,
  lotteryV2ContractFunctions,
  callTransaction,
};
