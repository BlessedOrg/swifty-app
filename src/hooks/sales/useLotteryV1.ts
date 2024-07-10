import { useCallback, useState } from "react";
import {
  getLotteryV1Data,
  readDepositedAmount,
  requestForEachMethod,
  windowEthereum,
} from "@/utils/contracts/contracts";
import { formatRandomNumberToFirstTwoDigit } from "@/utils/formatRandomNumber";
import { lotteryV1ContractFunctions } from "@/utils/contracts/salesContractFunctions";
import { useToast } from "@chakra-ui/react";
import { contractsInterfaces } from "../../services/viem";

export interface ILotteryV1 {
  saleData: ILotteryV1Data | null | undefined;
  getDepositedAmount: () => Promise<any>;
  readLotteryDataFromContract: () => Promise<any>;
  onLotteryEnd: () => Promise<any>;
  checkUserStatsInContractLv1: () => Promise<any>;
}

export const useLotteryV1 = (
  signer,
  activeAddress,
  updateLoadingState,
  updateTransactionLoadingState,
): ILotteryV1 => {
  const [userSaleData, setUserSaleData] = useState<IUserContractStats>({
    userFunds: 0,
    missingFunds: 0,
    isWinner: false,
  });
  const toast = useToast();
  const { endLottery } = lotteryV1ContractFunctions;
  const [saleData, setSaleData] = useState<ILotteryV1Data>({
    winners: [],
    users: [],
    lastWinner: 0,
    myNumber: 0,
    winningChance: 0,
    missingFunds: 0,
    price: 0,
    position: 0,
    userFunds: 0,
    vacancyTicket: 0,
    contractAddress: activeAddress,
    randomNumber: 0,
    isLotteryStarted: false,
    hasMinted: false,
    isOwner: false,
    isWinner: false,
    isDefaultState: true,
  });

  if (!windowEthereum) {
    console.log("🚨 useSales.tsx - [window.ethereum] !");
    return {
      saleData,
      getDepositedAmount: async () => {},
      readLotteryDataFromContract: async () => {},
      onLotteryEnd: async () => {},
      checkUserStatsInContractLv1: async () => {},
    };
  }

  const readLotteryDataFromContract = useCallback(async () => {
    saleData.isDefaultState = false;
    if (signer) {
      const currentAddress = signer.address;
      const res = await getLotteryV1Data(signer, activeAddress);
      if (res) {
        const findUserIndex =
          currentAddress &&
          res.users?.findIndex(
            (address) => address.toLowerCase() === currentAddress.toLowerCase(),
          );

        const payload = {
          ...res,
          contractAddress: activeAddress,
          myNumber: findUserIndex === -1 ? 0 : findUserIndex + 1,
          randomNumber: formatRandomNumberToFirstTwoDigit(
            res.randomNumber,
            res.vacancyTicket || 0,
          ),
          isOwner: res.sellerWalletAddress === currentAddress,
          isDefaultState: false,
        };
        setSaleData((prev) => ({
          ...prev,
          ...payload,
        }));
        console.log("1️⃣  LotteryV1 data: ", payload);
        return res;
      }
    } else {
      console.log("🚨 EventLottery.tsx - Signer is required to read data.");
    }
  }, [signer]);

  const onLotteryEnd = async () => {
    if (!!signer) {
      updateLoadingState(true);
      updateTransactionLoadingState({
        id: "endLottery",
        isLoading: true,
        name: "End Lottery V1",
      });
      const res = await endLottery(
        activeAddress,
        signer,
        [],
        toast,
        updateLoadingState,
        "LotteryV1",
      );
      if (res?.confirmation?.status === "success") {
        await readLotteryDataFromContract();
      }
      updateTransactionLoadingState({
        id: "endLottery",
        isLoading: false,
        isFinished: true,
        name: "End Lottery V1",
      });
      updateLoadingState(false);
      return res;
    } else return { error: "Singer doesn't exist" };
  };

  const getDepositedAmount = async () => {
    if (signer) {
      const amount = await readDepositedAmount(activeAddress, signer);
      setUserSaleData((prev) => ({ ...prev, userFunds: Number(amount) }));
    } else {
      console.log("🚨 EventLottery.tsx - Signer is required to read data.");
    }
  };
  const checkUserStatsInContract = async () => {
    const methods = [
      {
        key: "userFunds",
        value: "getDepositedAmount",
        type: "number",
        args: [signer.address],
      },
      { key: "isWinner", value: "isWinner", args: [signer.address] },
    ];
    const { userFunds, isWinner } = await requestForEachMethod(
      methods,
      activeAddress,
      contractsInterfaces.LotteryV1.abi,
    );
    const missingFunds = saleData.price - userFunds;

    setUserSaleData({
      userFunds,
      missingFunds,
      isWinner,
    });
  };

  return {
    saleData: { ...saleData, ...userSaleData },
    getDepositedAmount,
    readLotteryDataFromContract,
    onLotteryEnd,
    checkUserStatsInContractLv1: checkUserStatsInContract,
  };
};
