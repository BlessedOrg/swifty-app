import { useEffect, useState } from "react";
import {
  checkIsUserWinner,
  getAuctionV2Data,
  readDepositedAmount,
  windowEthereum,
} from "@/utils/contracts/contracts";
import { useActiveAccount } from "thirdweb/react";
import {useUserContext} from "@/store/UserContext";

export interface IAuctionV2 {
  saleData: IAuctionV2Data | null;
  getDepositedAmount: () => Promise<any>;
  readLotteryDataFromContract: () => Promise<any>;
}

export const useAuctionV2 = (activeAddress): IAuctionV2 => {
  const { walletAddress, isLoggedIn } = useUserContext();
  const activeAccount = useActiveAccount();
  const signer = {...activeAccount, address: isLoggedIn ? activeAccount?.address : "0x0000000000000000000000000000000000000000"}

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
    };
  }

  const readLotteryDataFromContract = async () => {
    saleData.isDefaultState = false;
    if (signer) {
      const currentAddress = signer.address
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
      console.log("Deposited amount : ", amount);
    } else {
      console.log("🚨 EventLottery.tsx - Signer is required to read data.");
    }
  };
  const checkIsUserWinnerAndUpdateState = async () => {
    saleData.isWinner = await checkIsUserWinner(signer, activeAddress)
  }
  useEffect(() => {
    if (!!signer && !!activeAddress && signer?.address !==walletAddress && signer.address !== "0x0000000000000000000000000000000000000000" ) {
      checkIsUserWinnerAndUpdateState()
    }
  }, [signer]);
  useEffect(() => {
    if (!!signer && !!activeAddress && saleData?.isDefaultState) {
      readLotteryDataFromContract();
    }
  }, [signer]);

  return {
    saleData,
    getDepositedAmount,
    readLotteryDataFromContract,
  };
};
