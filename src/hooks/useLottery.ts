import { useEffect, useState } from "react";
import {
  deposit,
  getLotteryV1Data,
  readDepositedAmount,
  readMinimumDepositAmount,
  withdraw,
} from "@/utilscontracts";
import { useSigner } from "@thirdweb-dev/react";
import { waitForTransactionReceipt } from "../services/viem";
import { useToast } from "@chakra-ui/react";
import { useUser } from "@/hooks/useUser";
import { cutWalletAddress } from "@/utilscutWalletAddress";

export const useLottery = (lotteryContractAddr) => {
  const [isDepositLoading, setIsDepositLoading] = useState(false);
  const [isWithdrawLoading, setIsWithdrawLoading] = useState(false);
  const { address } = useUser();
  const toast = useToast();

  const [userData, setUserData] = useState({
    balance: 0,
    username: cutWalletAddress(address),
    avatar: "/images/profile.png",
  });
  const [lotteryData, setLotteryData] = useState({
    winners: 0,
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
  });

  if (!lotteryContractAddr) {
    console.log(
      "🚨 useLottery.tsx - lotteryContractAddr is required to read lottery data!",
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

  const signer = useSigner();

  const readLotteryDataFromContract = async () => {
    if (signer) {
      const res = await getLotteryV1Data(signer, lotteryContractAddr);

      console.log("🦦 Lottery data: ", res);

      if (res) {
        setLotteryData((prev) => ({
          ...prev,
          ...res,
          users: res.users.length,
        }));
      }
    } else {
      console.log("🚨 EventLottery.tsx - Signer is required to read data.");
    }
  };

  const getDepositedAmount = async () => {
    const amount = await readDepositedAmount(lotteryContractAddr, signer);

    setUserData((prev) => ({
      ...prev /**/,
      balance: Number(amount),
    }));
  };

  useEffect(() => {
    if (!!lotteryContractAddr && !!signer && !lotteryData?.vacancyTicket) {
      readLotteryDataFromContract();
      getDepositedAmount();
    }
  }, [lotteryContractAddr, signer]);

  const onWithdrawHandler = async () => {
    try {
      const res = await withdraw(lotteryContractAddr, signer, toast);
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
      const minAmount = await readMinimumDepositAmount(lotteryContractAddr);

      if (Number(minAmount) > amount) {
        toast({
          status: "error",
          title: `Minimum amount of deposit if $${Number(minAmount)}`,
        });

        return;
      }

      console.log("🌳 minAmount: ", Number(minAmount));

      const depoHash = await deposit(
        lotteryContractAddr,
        amount,
        signer,
        toast,
      );
      setIsDepositLoading(true);
      const confirmation = await waitForTransactionReceipt(depoHash, 1);
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
  };
};
