import { useEffect, useState } from "react";
import { deposit, getAuctionV2Data, getLotteriesDataWithoutAuctionV2, readDepositedAmount, readMinimumDepositAmount, windowEthereum, withdraw } from "@/utilscontracts";
import { useSigner } from "@thirdweb-dev/react";
import { waitForTransactionReceipt } from "../services/viem";
import { useToast } from "@chakra-ui/react";
import { useUser } from "@/hooks/useUser";
import { cutWalletAddress } from "@/utilscutWalletAddress";

export interface ILotteryData {
  winners: string[] | null;
  users: number | null;
  tickets: number | null;
  lastWinner: number | null;
  myNumber: number | null;
  winningChance: number | null;
  missingFunds: number | null;
  price: number | null;
  position: number | null;
  userFunds: number | null;
  targetNumber: number | null;
  vacancyTicket: number | null;
  contractAddress?: string
}

export const useLottery = (addresses, activeAddress) => {
  const signer = useSigner();
  const [isDepositLoading, setIsDepositLoading] = useState(false);
  const [isWithdrawLoading, setIsWithdrawLoading] = useState(false);
  const {address} = useUser();
  const toast = useToast();

  const [userData, setUserData] = useState({
    balance: 0,
    username: cutWalletAddress(address),
    avatar: "/images/profile.png",
  });

  const [lotteryData, setLotteryData] = useState<ILotteryData>({
    winners: [],
    users: 0,
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
    contractAddress: activeAddress
  });

  if (!!addresses.some(i => !i.address) || !windowEthereum) {
    console.log("🚨 useLottery.tsx - missing lotteryContractAddr or metamask [window.ethereum] !",);
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
      const currentAddress = addresses.find(i => i.address === activeAddress)
      const isAuctionV2 = currentAddress?.id === "auctionV2";
      let data: any;
      if (isAuctionV2) {
        data = await getAuctionV2Data(signer, activeAddress)
      } else {
        data = await getLotteriesDataWithoutAuctionV2(signer, activeAddress, currentAddress?.id)
        console.log("🌳 data (auctionV1): ", data)
      }
      if (data) {
        const payload = {
          ...data,
          users: data?.users?.length,
          randomNumber: Number(data?.randomNumber) % data?.tickets ?? Number(data?.randomNumber),
          contractAddress: activeAddress,
        }
        setLotteryData((prev) => ({
          ...prev,
          ...payload
        }));
        console.log("🦦 Lottery data: ", payload);
        return data
      }
    } else {
      console.log("🚨 EventLottery.tsx - Signer is required to read data.");
    }
  };

  const getDepositedAmount = async () => {
    if (signer) {
      const amount = await readDepositedAmount(activeAddress, signer);
      console.log("Deposited amount : ", amount)
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
  }, [signer, activeAddress]);

  const onWithdrawHandler = async () => {
    try {
      const res = await withdraw(activeAddress, signer, toast);
      if (!!res) {
        console.log("🦦 Withdraw hash: ", res);

        setIsWithdrawLoading(true);

        const confirmation = await waitForTransactionReceipt(res, 1);

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
          title: `Minimum amount of deposit is $${Number(minAmount)}`,
        });

        return;
      }

      console.log("🌳 minAmount: ", Number(minAmount));

      const depoHash = await deposit(activeAddress, amount, signer, toast);
      setIsDepositLoading(true);
      const confirmation = await waitForTransactionReceipt(depoHash, 1);
      console.log("🧾 Confirmation", confirmation);

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
  };
};
