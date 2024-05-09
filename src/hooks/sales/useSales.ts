import { useEffect, useState } from "react";
import {
  deposit,
  readMinimumDepositAmount,
  startLottery,
  windowEthereum,
  withdraw,
} from "@/utilscontracts";
import { useSigner } from "@thirdweb-dev/react";
import { waitForTransactionReceipt } from "../../services/viem";
import { useToast } from "@chakra-ui/react";
import { useConnectWallet } from "@/hooks/useConnect";
import {useLotteryV1} from "@/hooks/sales/useLotteryV1";
import {useAuctionV1} from "@/hooks/sales/useAuctionV1";
import {useAuctionV2} from "@/hooks/sales/useAuctionV2";
import {useLotteryV2} from "@/hooks/sales/useLotteryV2";

export interface ICommonSaleData {
  userFunds: number | null;
  vacancyTicket: number | null;
  price: number
  winners: string[] | null;
  isLotteryStarted?: boolean;
  isOwner?: boolean;
  missingFunds: number | null;

}
export const useSales = (salesAddresses, activeAddress) => {
  const [isLoading, setIsLoading] = useState(false);
  const lotteryV1Data = useLotteryV1(salesAddresses.lotteryV1, false)
  const lotteryV2Data = useLotteryV2(salesAddresses.lotteryV2, false)
  const auctionV1Data = useAuctionV1(salesAddresses.auctionV1, false)
  const auctionV2Data = useAuctionV2(salesAddresses.auctionV2, false)

  const { walletAddress } = useConnectWallet();

  const signer = useSigner();
  const [isDepositLoading, setIsDepositLoading] = useState(false);
  const [isWithdrawLoading, setIsWithdrawLoading] = useState(false);
  const toast = useToast();


  const salesRefetcher = {
    [salesAddresses.lotteryV1]: lotteryV1Data.readLotteryDataFromContract,
    [salesAddresses.lotteryV2]: lotteryV2Data.readLotteryDataFromContract,
        [salesAddresses.auctionV1]: auctionV1Data.readLotteryDataFromContract,
      [salesAddresses.auctionV2]: auctionV2Data.readLotteryDataFromContract

  }

  const readLotteryDataFromContract = async () => {

    if(salesRefetcher[activeAddress]){
      await salesRefetcher[activeAddress]
    }
  }

  if (!windowEthereum) {
    console.log(
        "🚨 useSales.tsx - [window.ethereum] !",
    );
    return {
      onDepositHandler: null,
      onWithdrawHandler: null,
      isDepositLoading: null,
      isWithdrawLoading: null,
    };
  }



  useEffect(() => {
    if (!!signer && !!activeAddress) {

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
  const onWithdrawHandler = async () => {
    try {
      const res = await withdraw(activeAddress, signer, toast);
      if (!!res) {
        console.log("🦦 Withdraw hash: ", res);

        setIsWithdrawLoading(true);

        const confirmation = await waitForTransactionReceipt(res, 3);

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
    isDepositLoading,
    isWithdrawLoading,
    onLotteryStart,
    isLoading,
    salesData: {
      "lotteryV1": {...lotteryV1Data},
      "lotteryV2": {...lotteryV2Data},
      "auctionV1": {...auctionV1Data},
      "auctionV2": {...auctionV2Data},
    }
  };
};

