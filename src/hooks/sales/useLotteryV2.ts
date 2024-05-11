import { useEffect, useState } from "react";
import {
  getLotteryV2Data,
  readDepositedAmount,
  windowEthereum,
} from "@/utils/contracts/contracts";
import { useSigner } from "@thirdweb-dev/react";
import { useConnectWallet } from "@/hooks/useConnect";
import { formatRandomNumber } from "@/utils/formatRandomNumber";
import { lotteryV2ContractFunctions } from "@/utils/contracts/salesContractFunctions";
import { useToast } from "@chakra-ui/react";

export interface ILotteryV2 {
  saleData: ILotteryV2Data | null;
  onRollNumber: () => Promise<any>;
  getDepositedAmount: () => Promise<any>;
  readLotteryDataFromContract: () => Promise<any>;
  onSetRollPrice: (price: number) => Promise<any>;
}

export const useLotteryV2 = (
  activeAddress,
  updateLoadingState,
  updateTransactionLoadingState
): ILotteryV2 => {
  const { walletAddress } = useConnectWallet();
  const signer = useSigner();
  const { rollNumber, setRollPrice } = lotteryV2ContractFunctions;
  const toast = useToast();

  const [saleData, setSaleData] = useState<ILotteryV2Data | any>({
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
  });

  if (!windowEthereum) {
    console.log("🚨 useSales.tsx - [window.ethereum] !");
    return {
      saleData,
      getDepositedAmount: async () => {},
      readLotteryDataFromContract: async () => {},
      onRollNumber: async () => {},
      onSetRollPrice: async () => {},
    };
  }

  const readLotteryDataFromContract = async () => {
    if (signer) {
      const res = await getLotteryV2Data(signer, activeAddress);
      if (res) {
        const payload = {
          ...res,
          contractAddress: activeAddress,
          myNumber: formatRandomNumber(
            res.rolledNumbers,
            res.vacancyTicket || 0,
          ),
          randomNumber: formatRandomNumber(
            res.randomNumber,
            res.vacancyTicket || 0,
          ),
          isOwner: res.sellerWalletAddress === walletAddress,
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
  const onRollNumber = async () => {
    if (!!signer) {
      const res = await rollNumber(
        activeAddress,
        signer,
        toast,
          updateLoadingState,
      );
      if (res?.confirmation?.status === "success") {
        await readLotteryDataFromContract();
      }
      return res;
    } else return { error: "Singer doesn't exist" };
  };

  const getDepositedAmount = async () => {
    if (signer) {
      const amount = await readDepositedAmount(activeAddress, signer);
      console.log("Deposited amount : ", amount);
    } else {
      console.log("🚨 EventLottery.tsx - Signer is required to read data.");
    }
  };

  useEffect(() => {
    if (!!signer && !!activeAddress) {
      readLotteryDataFromContract();
      getDepositedAmount();
    }
  }, [signer, walletAddress]);

  return {
    saleData,
    getDepositedAmount,
    readLotteryDataFromContract,
    onRollNumber,
    onSetRollPrice,
  };
};
