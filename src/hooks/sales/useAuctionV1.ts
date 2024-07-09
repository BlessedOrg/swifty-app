import { useEffect, useState } from "react";
import {checkIsUserWinner, getAuctionV1Data, readDepositedAmount, windowEthereum} from "@/utils/contracts/contracts";
import { auctionV1ContractFunctions } from "@/utils/contracts/salesContractFunctions";
import { useToast } from "@chakra-ui/react";
import isTimestampInFuture from "@/utils/isTimestampInFuture";
import { useActiveAccount } from "thirdweb/react";
import { useUserContext } from "@/store/UserContext";
import {shortenAddress} from "thirdweb/utils";

export interface IAuctionV1 {
  saleData: IAuctionV1Data | null;
  getDepositedAmount: () => Promise<any>;
  readLotteryDataFromContract: () => Promise<any>;
  onSetupNewRound: () => Promise<any>;
  onLotteryEnd: () => Promise<any>;
  checkIsUserWinnerAndUpdateStateAv1: () => Promise<any>;
}

export const useAuctionV1 = (
  activeAddress,
  updateLoadingState,
  updateTransactionLoadingState
): IAuctionV1 => {
  const { walletAddress, isLoggedIn } = useUserContext();
  const activeAccount = useActiveAccount();
  const signer = {...activeAccount, address: isLoggedIn ? activeAccount?.address : "0x0000000000000000000000000000000000000000"}
  const { setupNewRound, round, endLottery } = auctionV1ContractFunctions;
  const toast = useToast();

  const [saleData, setSaleData] = useState<IAuctionV1Data | any>({
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
    roundCounter: 0,
    roundFinishTimestamp: 0,
    lastRound: null,
    isDefaultState: true,
  });

  if (!windowEthereum) {
    console.log("🚨 useSales.tsx - no [window.ethereum]!");
    return {
      saleData,
      getDepositedAmount: async () => {},
      readLotteryDataFromContract: async () => {},
      onSetupNewRound: async () => {},
      onLotteryEnd: async () => {},
      checkIsUserWinnerAndUpdateStateAv1: async () => {}
    };
  }

  const readLotteryDataFromContract = async () => {
    saleData.isDefaultState = false;
    if (signer) {
      const currentAddress = signer.address;
      const res = await getAuctionV1Data(signer, activeAddress);
      // const bigIntString = res.randomNumber.toString();
      // const slicedRandomNumber = Number(bigIntString.substring(0, 14));
      const currentRoundArray = await round(
        `${activeAddress}`,
        res.roundCounter - 1
      );
      const isZeroRounds = Object.entries(currentRoundArray).length === 0;

      const currentRound = {
        index: isZeroRounds ? null : Number(currentRoundArray[0]),
        finishAt: isZeroRounds ? null : (Number(currentRoundArray[1]) * 1000),
        isFinished: isZeroRounds ? null : !isTimestampInFuture(Number(currentRoundArray[1])* 1000),
        numberOfTickets: isZeroRounds ? null : Number(currentRoundArray[2]),
        randomNumber: isZeroRounds ? null : Number(currentRoundArray[3]),
        lotteryStarted: isZeroRounds ? null : currentRoundArray[4],
        lotteryFinished: isZeroRounds ? null : currentRoundArray[5],
        winnersSelected: isZeroRounds ? null : currentRoundArray[6],
      };

      if (res) {
        const findUserIndex = res.users?.findIndex((i) => i === currentAddress);
        const payload = {
          ...res,
          contractAddress: activeAddress,
          vacancyTicket: res?.totalNumberOfTickets,
          myNumber: findUserIndex === -1 ? 0 : findUserIndex + 1,
          randomNumber: currentRound?.randomNumber || 0,
          isOwner: res.sellerWalletAddress === currentAddress,
          lastRound: currentRound,
          isDefaultState: false
        };
        setSaleData((prev) => ({
          ...prev,
          ...payload,
        }));
        console.log("3️⃣ AuctionV1 data: ", payload);
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

  const onSetupNewRound = async (finishAt, numberOfTickets) => {
    console.log(numberOfTickets, saleData.vacancyTicket);
    console.log(saleData.vacancyTicket - numberOfTickets <= 0);
    if (!!signer) {
      updateLoadingState(true);
      updateTransactionLoadingState({
        id: "setupNewRound",
        isLoading: true,
        name: "Setup new round",
      });
      const res = await setupNewRound(
        activeAddress,
        signer,
        [finishAt, numberOfTickets],
        toast,
        updateLoadingState
      );
      if (res?.confirmation?.status === "success") {
        await readLotteryDataFromContract();
      }
      updateTransactionLoadingState({
        id: "setupNewRound",
        isLoading: false,
        isFinished: true,
        name: "Setup new round",
      });
      updateLoadingState(false);
      return res;
    } else return { error: "Singer doesn't exist" };
  };

  const onLotteryEnd= async () => {
    if (!!signer) {
      updateLoadingState(true);
      updateTransactionLoadingState({
        id: "endLottery",
        isLoading: true,
        name: "End Auction V1",
      });
      const res = await endLottery(
          activeAddress,
          signer,
          [],
          toast,
          updateLoadingState,
          "AuctionV1"
      );
      if (res?.confirmation?.status === "success") {
        await readLotteryDataFromContract();
      }
      updateTransactionLoadingState({
        id: "endLottery",
        isLoading: false,
        isFinished: true,
        name: "End Auction V1",
      });
      updateLoadingState(false);
      return res;
    } else return { error: "Singer doesn't exist" };
  };
  const checkIsUserWinnerAndUpdateState = async () => {
    saleData.isWinner = await checkIsUserWinner(signer, activeAddress)
  }


  return <IAuctionV1>{
    saleData,
    getDepositedAmount,
    readLotteryDataFromContract,
    onSetupNewRound,
    onLotteryEnd,
    checkIsUserWinnerAndUpdateStateAv1: checkIsUserWinnerAndUpdateState
  };
};
