import { useEffect, useState } from "react";
import { getLotteryV1Data, readDepositedAmount, windowEthereum } from "@/utils/contracts/contracts";
import { useSigner } from "@thirdweb-dev/react";
import { useToast } from "@chakra-ui/react";
import {formatRandomNumberToFirstTwoDigit} from "@/utils/formatRandomNumber";
import {useUser} from "@/hooks/useUser";

export interface ILotteryV1 {
  saleData: ILotteryV1Data | null | undefined;
  getDepositedAmount: () => Promise<any>;
  readLotteryDataFromContract: () => Promise<any>;
}

export const useLotteryV1 = (activeAddress): ILotteryV1 => {
  const { walletAddress } = useUser();
  const signer = useSigner();
  const toast = useToast();

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
  });

  if (!windowEthereum) {
    console.log("🚨 useSales.tsx - [window.ethereum] !");
    return {
      saleData,
      getDepositedAmount: async () => {},
      readLotteryDataFromContract: async () => {},
    };
  }

  const readLotteryDataFromContract = async () => {
    if (signer) {
      const res = await getLotteryV1Data(signer, activeAddress);
      if (res) {
        const findUserIndex = res.users?.findIndex((i) => i === walletAddress);
        const payload = {
          ...res,
          contractAddress: activeAddress,
          myNumber: findUserIndex === -1 ? 0 : findUserIndex + 1,
          randomNumber: formatRandomNumberToFirstTwoDigit(
              res.randomNumber,
              res.vacancyTicket || 0,
          ),
          isOwner: res.sellerWalletAddress === walletAddress,
        };
        setSaleData((prev) => ({
          ...prev,
          ...payload,
        }));
        console.log("1️⃣ LotteryV1 data: ", payload);
        return res;
      }
    } else {
      console.log("🚨 EventLottery.tsx - Signer is required to read data.");
    }
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
  };
};
