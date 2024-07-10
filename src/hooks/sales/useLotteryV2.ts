import { useState } from "react";
import {
  getLotteryV2Data,
  readDepositedAmount,
  requestForEachMethod,
  windowEthereum,
} from "@/utils/contracts/contracts";
import { formatRandomNumberToFirstTwoDigit } from "@/utils/formatRandomNumber";
import { lotteryV2ContractFunctions } from "@/utils/contracts/salesContractFunctions";
import { useToast } from "@chakra-ui/react";
import { contractsInterfaces } from "../../services/viem";

export interface ILotteryV2 {
  saleData: ILotteryV2Data | null;
  onRollNumber: () => Promise<any>;
  getDepositedAmount: () => Promise<any>;
  readLotteryDataFromContract: () => Promise<any>;
  onSetRollPrice: (price: number) => Promise<any>;
  onSetRollTolerance: (tolerance: number) => Promise<any>;
  checkUserStatsInContract: () => Promise<any>;
}
export const useLotteryV2 = (
  signer,
  activeAddress,
  updateLoadingState,
  updateTransactionLoadingState,
): ILotteryV2 => {
  const [userSaleData, setUserSaleData] = useState<IUserContractStats>({
    userFunds: 0,
    missingFunds: 0,
    isWinner: false,
  });
  const { rollNumber, setRollPrice, setRollTolerance } =
    lotteryV2ContractFunctions;
  const toast = useToast();

  const [saleData, setSaleData] = useState<ILotteryV2Data>({
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
    isDefaultState: true,
    rollTolerance: 0,
    isWinner: false,
    hasMinted: false,
    rolledNumbers: [],
    rollPrice: 0,
  });

  if (!windowEthereum) {
    console.log("🚨 useSales.tsx - [window.ethereum] !");
    return {
      saleData,
      getDepositedAmount: async () => {},
      readLotteryDataFromContract: async () => {},
      onRollNumber: async () => {},
      onSetRollPrice: async () => {},
      onSetRollTolerance: async () => {},
      checkUserStatsInContract: async () => {},
    };
  }

  const readLotteryDataFromContract = async () => {
    if (signer) {
      saleData.isDefaultState = false;
      const currentAddress = signer.address;
      const res = await getLotteryV2Data(signer, activeAddress);
      if (res) {
        const payload = {
          ...res,
          contractAddress: activeAddress,
          myNumber: formatRandomNumberToFirstTwoDigit(
            res.rolledNumbers[0],
            res.vacancyTicket || 0,
          ),
          isRolling: res.rolledNumbers[1],
          randomNumber: formatRandomNumberToFirstTwoDigit(
            res.randomNumber,
            res.vacancyTicket || 0,
          ),
          wholeRandomNumber: res.randomNumber,
          isOwner: res.sellerWalletAddress === currentAddress,
          isDefaultState: false,
        };
        setSaleData((prev) => ({
          ...prev,
          ...payload,
        }));
        console.log("2️⃣ LotteryV2 data: ", payload);
        return res;
      }
    } else {
      console.log("🚨 EventLottery.tsx - Signer is required to read data.");
    }
  };

  const onSetRollPrice = async (price) => {
    if (!!signer) {
      const res = await setRollPrice(
        activeAddress,
        signer,
        toast,
        updateLoadingState,
        price,
      );
      if (res?.confirmation?.status === "success") {
        await readLotteryDataFromContract();
      }
      return res;
    } else return { error: "Singer doesn't exist" };
  };

  const onSetRollTolerance = async (tolerance) => {
    if (!!signer) {
      const res = await setRollTolerance(
        activeAddress,
        signer,
        toast,
        updateLoadingState,
        tolerance,
      );
      if (res?.confirmation?.status === "success") {
        await readLotteryDataFromContract();
      }
      return res;
    } else return { error: "Singer doesn't exist" };
  };

  const onRollNumber = async () => {
    if (!!signer) {
      updateTransactionLoadingState({
        id: "rollNumber",
        isLoading: true,
        name: "Roll number",
      });
      const res = await rollNumber(
        activeAddress,
        signer,
        toast,
        updateLoadingState,
      );
      if (res?.confirmation?.status === "success") {
        await readLotteryDataFromContract();
      }
      updateTransactionLoadingState({
        id: "rollNumber",
        isLoading: false,
        isFinished: true,
        name: "Roll number",
      });
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
    onRollNumber,
    onSetRollPrice,
    onSetRollTolerance,
    checkUserStatsInContract,
  };
};
