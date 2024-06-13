import { useEffect, useState } from "react";
import {
  getAuctionV2Data,
  readDepositedAmount,
  windowEthereum,
} from "@/utils/contracts/contracts";
import { useSigner } from "@thirdweb-dev/react";
import { useUser } from "@/hooks/useUser";

export interface IAuctionV2 {
  saleData: IAuctionV2Data | null;
  getDepositedAmount: () => Promise<any>;
  readLotteryDataFromContract: () => Promise<any>;
}

export const useAuctionV2 = (activeAddress): IAuctionV2 => {
  const { walletAddress } = useUser();
  const signer = useSigner();

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
      const currentAddress = await signer.getAddress();
      const res = await getAuctionV2Data(signer, activeAddress);

      if (res) {
        const findUserIndex = res.users?.findIndex((i) => i === currentAddress);
        const payload = {
          ...res,
          contractAddress: activeAddress,
          myNumber: findUserIndex === -1 ? 0 : findUserIndex + 1,
          isOwner: res.sellerWalletAddress === currentAddress,
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
