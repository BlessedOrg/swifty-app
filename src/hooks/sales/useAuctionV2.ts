import { useState } from "react";
import {
  getAuctionV2Data,
  readDepositedAmount,
  requestForEachMethod,
  windowEthereum,
} from "@/utils/contracts/contracts";
import { contractsInterfaces } from "../../services/viem";

export interface IAuctionV2 {
  saleData: IAuctionV2Data | null;
  getDepositedAmount: () => Promise<any>;
  readLotteryDataFromContract: () => Promise<any>;
  checkUserStatsInContract: () => Promise<any>;
}

export const useAuctionV2 = (signer, activeAddress): IAuctionV2 => {
  const [userFunds, setUserFunds] = useState(0)
  const [missingFunds, setMissingFunds] = useState(0)
  const [isWinner, setIsWinner] = useState(false)

  const [saleData, setSaleData] = useState<IAuctionV2Data | any>({
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
    isDefaultState: true,
  });

  if (!windowEthereum) {
    console.log("🚨 useSales.tsx - [window.ethereum] !");
    return {
      saleData,
      getDepositedAmount: async () => {},
      readLotteryDataFromContract: async () => {},
      checkUserStatsInContract: async () => {},
    };
  }

  const readLotteryDataFromContract = async () => {
    saleData.isDefaultState = false;
    if (signer) {
      const currentAddress = signer.address;
      const res = await getAuctionV2Data(signer, activeAddress);

      if (res) {
        const findUserIndex = res.users?.findIndex((i) => i === currentAddress);
        const payload = {
          ...res,
          contractAddress: activeAddress,
          myNumber: findUserIndex === -1 ? 0 : findUserIndex + 1,
          isOwner: res.sellerWalletAddress === currentAddress,
          isDefaultState: false,
        };
        setSaleData((prev) => ({
          ...prev,
          ...payload,
        }));
        console.log("4️⃣ AuctionV2 data: ", payload);
        return res;
      }
    } else {
      console.log("🚨 EventLottery.tsx - Signer is required to read data.");
    }
  };

  const getDepositedAmount = async () => {
    if (signer) {
      const amount = await readDepositedAmount(activeAddress, signer);
      setUserFunds(Number(amount));
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

    setUserFunds(userFunds);
    setMissingFunds(missingFunds);
    setIsWinner(isWinner);
  };

  return {
    saleData: {
      ...saleData,
      userFunds,
      missingFunds,
      isWinner
    },
    getDepositedAmount,
    readLotteryDataFromContract,
    checkUserStatsInContract,
  };
};
