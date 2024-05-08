import { useEffect, useState } from "react";
import {
  deposit,
  getAuctionV2Data,
  getLotteriesDataWithoutAuctionV2,
  readDepositedAmount,
  readMinimumDepositAmount,
  startLottery,
  windowEthereum,
  withdraw,
  selectWinners,
} from "@/utilscontracts";
import { useSigner } from "@thirdweb-dev/react";
import { waitForTransactionReceipt } from "../services/viem";
import { useToast } from "@chakra-ui/react";
import { useUser } from "@/hooks/useUser";
import { cutWalletAddress } from "@/utilscutWalletAddress";
import { useConnectWallet } from "@/hooks/useConnect";

export interface ILotteryData {
  winners: string[] | null;
  users: string[] | null;
  tickets: number | null;
  lastWinner: number | null;
  myNumber: number | null;
  winningChance: number | null;
  missingFunds: number | null;
  price: number
  position: number | null;
  userFunds: number | null;
  targetNumber: number | null;
  vacancyTicket: number | null;
  contractAddress?: string;
  randomNumber: number;
  isOwner?: boolean;
  isLotteryStarted?: boolean;
}

export const useLottery = (addresses, activeAddress) => {
  const { walletAddress } = useConnectWallet();

  const signer = useSigner();
  const [isDepositLoading, setIsDepositLoading] = useState(false);
  const [isWithdrawLoading, setIsWithdrawLoading] = useState(false);
  const { address } = useUser();
  const toast = useToast();

  const [userData, setUserData] = useState({
    balance: 0,
    username: cutWalletAddress(address),
    avatar: "/images/profile.png",
  });

  const [lotteryData, setLotteryData] = useState<ILotteryData>({
    winners: [],
    users: [],
    tickets: 0,
    lastWinner: 0,
    myNumber: 0,
    winningChance: 0,
    missingFunds: 0,
    price: 0,
    position: 0,
    userFunds: 0,
    targetNumber: 0,
    vacancyTicket: 0,
    contractAddress: activeAddress,
    randomNumber: 0,
  });

  if (!!addresses.some((i) => !i.address) || !windowEthereum) {
    console.log(
      "🚨 useLottery.tsx - missing lotteryContractAddr or metamask [window.ethereum] !",
    );
    return {
      onDepositHandler: null,
      onWithdrawHandler: null,
      userData: userData,
      lotteryData: lotteryData,
      isDepositLoading: null,
      isWithdrawLoading: null,
    };
  }

  const readLotteryDataFromContract = async () => {
    if (signer) {
      const currentAddress = addresses.find((i) => i.address === activeAddress);
      const isAuctionV2 = currentAddress?.id === "auctionV2";
      let res;
      if (isAuctionV2) {
        res = await getAuctionV2Data(signer, activeAddress);
      } else {
        res = await getLotteriesDataWithoutAuctionV2(
          signer,
          activeAddress,
          currentAddress?.id,
        );
      }
      if (res) {
        const filteredUsersAddresses = removeDuplicatesUsers(res.users || []);
        const findUserIndex = filteredUsersAddresses.findIndex(
          (i) => i === walletAddress,
        );
        const payload = {
          ...res,
          users: filteredUsersAddresses,
          contractAddress: activeAddress,
          myNumber: findUserIndex === -1 ? 0 : findUserIndex + 1,
          randomNumber: formatNumber(res.randomNumber, res.vacancyTicket || 0),
          isOwner: res.sellerWalletAddress === walletAddress,
        };
        setLotteryData((prev) => ({
          ...prev,
          ...payload,
        }));
        console.log("🦦 Lottery data: ", payload);
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
      setUserData((prev) => ({
        ...prev /**/,
        balance: Number(amount),
      }));
    } else {
      console.log("🚨 EventLottery.tsx - Signer is required to read data.");
    }
  };

  useEffect(() => {
    if (!!signer && !!activeAddress) {
      readLotteryDataFromContract();
      getDepositedAmount();
    }
  }, [signer, activeAddress, walletAddress]);

  const onLotteryStart = async () => {
    try {
      const res = await startLottery(activeAddress, signer, toast);

      console.log("🚀 onLotteryStart TX - ", res);

      if (!!res) {
        const confirmation = await waitForTransactionReceipt(res, 3);

        if (confirmation?.status === "success") {
          await readLotteryDataFromContract();

          toast({
            status: "success",
            title: `Lottery started successfully!`,
          });
        }
      }
      return res;
    } catch (e) {
      console.error(e);
    }
  };
  const onSelectWinners = async () => {
    try {
      const res = await selectWinners(activeAddress, signer, toast);

      console.log("🚀 onSelectWinners TX - ", res);

      if (!!res) {
        const confirmation = await waitForTransactionReceipt(res, 3);

        if (confirmation?.status === "success") {
          await readLotteryDataFromContract();

          toast({
            status: "success",
            title: `Winners selected successfully!`,
          });
        }
      }
      return res;
    } catch (e) {
      console.error(e);
    }
  };
  const onWithdrawHandler = async () => {
    try {
      const res = await withdraw(activeAddress, signer, toast);
      if (!!res) {
        console.log("🦦 Withdraw hash: ", res);

        setIsWithdrawLoading(true);

        const confirmation = await waitForTransactionReceipt(res, 3);

        await getDepositedAmount();
        await readLotteryDataFromContract();

        if (confirmation?.status === "success") {
          setIsWithdrawLoading(false);
          toast({
            status: "success",
            title: `Withdraw Successfully!`,
          });
        }
      } else {
        toast({
          status: "error",
          title: `Something went wrong, try again later!`,
        });
      }
    } catch (e) {
      console.error(e);
      setIsWithdrawLoading(false);
    }
  };

  const onDepositHandler = async (amount) => {
    try {
      const minAmount = await readMinimumDepositAmount(activeAddress);

      if (Number(minAmount) > amount) {
        toast({
          status: "error",
          title: `Minimum amount of deposit if $${Number(minAmount)}`,
        });

        return;
      }

      console.log("🌳 minAmount: ", Number(minAmount));

      const depoHash = await deposit(activeAddress, amount, signer, toast);
      setIsDepositLoading(true);
      const confirmation = await waitForTransactionReceipt(depoHash, 3);
      console.log("Confirmation", confirmation);

      await getDepositedAmount();

      if (confirmation?.status === "success") {
        setIsDepositLoading(false);
        toast({
          status: "success",
          title: `Deposited Successfully!`,
        });
      }
      await readLotteryDataFromContract();
    } catch (e) {
      console.error(e);
      setIsDepositLoading(false);
    }
  };

  return {
    onDepositHandler,
    onWithdrawHandler,
    userData,
    lotteryData,
    isDepositLoading,
    isWithdrawLoading,
    onLotteryStart,
    onSelectWinners
  };
};

const removeDuplicatesUsers = (array: string[]): string[] => {
  return array.filter((item, index) => array.indexOf(item) === index);
};

function formatNumber(num: bigint | number, tickets: number) {
  return Number(num) % tickets;
}
