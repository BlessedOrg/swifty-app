import { useEffect, useState } from "react";
import {
  deposit,
  readMinimumDepositAmount,
  startLottery,
  windowEthereum,
  withdraw,
  mint,
  endLottery,
  transferDeposits,
  sellerWithdraw,
  selectWinners
} from "@/utils/contracts/contracts";
import { useSigner } from "@thirdweb-dev/react";
import { waitForTransactionReceipt } from "../../services/viem";
import { useToast } from "@chakra-ui/react";
import { useLotteryV1 } from "@/hooks/sales/useLotteryV1";
import { useAuctionV1 } from "@/hooks/sales/useAuctionV1";
import { useAuctionV2 } from "@/hooks/sales/useAuctionV2";
import { useLotteryV2 } from "@/hooks/sales/useLotteryV2";
import { stringToCamelCase } from "@/utils/stringToCamelCase";

export const useSales = (
  salesAddresses,
  activeAddress,
  nextSaleData: { id: string; address: string } | null,
  currentTabSaleContractAddress: string,
  isFinished,
) => {
  const [isTransactionLoading, setIsTransactionLoading] = useState(false);
  const [transactionLoadingState, setTransactionLoadingState] = useState<
    {
      id: string;
      isLoading: boolean;
      isFinished?: boolean;
      name: string;
      isError?: boolean;
    }[]
  >([]);
  const updateLoadingState = (value: boolean) => {
    setIsTransactionLoading(value);
  };
  const updateTransactionLoadingState = (incomingState: {
    id: string;
    isLoading: boolean;
    isFinished?: boolean;
    name: string;
    isError?: boolean;
  }) => {
    const { name, id, isLoading, isFinished, isError } = incomingState || {};

    setTransactionLoadingState((prevState) => {
      const index = prevState.findIndex((state) => state.id === id);
      if (index !== -1) {
        const updatedState = [...prevState];
        updatedState[index] = {
          ...updatedState[index],
          isLoading,
          isFinished,
          name,
          isError,
        };
        return updatedState;
      } else {
        return [...prevState, { id, isLoading, isFinished, name, isError }];
      }
    });
  };
  const clearLoadingState = () => {
    setTransactionLoadingState([]);
  };

  useEffect(() => {
    if (!isTransactionLoading && !!transactionLoadingState.length) {
      clearLoadingState();
    }
  }, [transactionLoadingState]);
  const lotteryV1Data = useLotteryV1(
    salesAddresses.lotteryV1,
  );
  const lotteryV2Data = useLotteryV2(
    salesAddresses.lotteryV2,
    updateLoadingState,
    updateTransactionLoadingState,
  );
  const auctionV1Data = useAuctionV1(salesAddresses.auctionV1);
  const auctionV2Data = useAuctionV2(salesAddresses.auctionV2);

  const signer = useSigner();
  const toast = useToast();

  const salesRefetcher = {
    [salesAddresses.lotteryV1]: lotteryV1Data.readLotteryDataFromContract,
    [salesAddresses.lotteryV2]: lotteryV2Data.readLotteryDataFromContract,
    [salesAddresses.auctionV1]: auctionV1Data.readLotteryDataFromContract,
    [salesAddresses.auctionV2]: auctionV2Data.readLotteryDataFromContract,
  };

  const readLotteryDataFromContract = async (address?: string) => {
    if (!!address) {
      await salesRefetcher[address]();
    } else if (salesRefetcher[activeAddress]) {
      await salesRefetcher[activeAddress]();
    }
  };

  if (!windowEthereum) {
    console.log("🚨 useSales.tsx - [window.ethereum] !");
    return {
      onDepositHandler: null,
      onWithdrawHandler: null,
      onSelectWinners: null,
      isTransactionLoading: null,
      salesData: {
        lotteryV1: { ...lotteryV1Data },
        lotteryV2: { ...lotteryV2Data },
        auctionV1: { ...auctionV1Data },
        auctionV2: { ...auctionV2Data },
      },
    };
  }

  //sale refetcher
  useEffect(() => {
    if(!!signer){
      const interval = setInterval(() => {
        if (isFinished) {
          clearInterval(interval);
        } else {
          readLotteryDataFromContract(activeAddress);
        }
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [isFinished, signer, activeAddress]);

  const callWriteContractFunction = async (callback, methodName) => {
    const method = stringToCamelCase(methodName);
    try {
      setIsTransactionLoading(true);
      updateTransactionLoadingState({
        id: method,
        name: methodName,
        isLoading: true,
        isFinished: false,
      });

      const resTxHash = await callback(activeAddress, signer, toast);

      console.log(`🚀 ${methodName} TX - `, resTxHash);

      if (!!resTxHash?.error) {
        toast({
          status: "error",
          title: `${resTxHash?.error}`,
        });
        setIsTransactionLoading(false);
        clearLoadingState();
        return;
      }
      if (!!resTxHash) {
        const confirmation = await waitForTransactionReceipt(resTxHash, 1);

        if (confirmation?.status === "success") {
          await readLotteryDataFromContract();
          updateTransactionLoadingState({
            id: method,
            name: methodName,
            isLoading: false,
            isFinished: true,
          });

          toast({
            status: "success",
            title: `${methodName} successfully!`,
          });
          setIsTransactionLoading(false);

          return { resTxHash, confirmation };
        } else {
          toast({
            status: "error",
            title: `${methodName} went wrong!`,
          });
          updateTransactionLoadingState({
            id: method,
            name: methodName,
            isLoading: false,
            isFinished: true,
            isError: true,
          });
          setIsTransactionLoading(false);

          return { resTxHash, confirmation };
        }
      }
    } catch (e) {
      clearLoadingState();
      setIsTransactionLoading(false);
      console.error(e);
    }
  };

  const onMint = async () => {
    if (!currentTabSaleContractAddress) {
      console.log(
        "🚨 useSales.tsx - currentTabSaleContractAddress is required to mint!",
      );
      return;
    }
    const callbackFn = async () =>
      mint(currentTabSaleContractAddress, signer, toast);
    await callWriteContractFunction(callbackFn, "Mint ticket ");
  };
  const onLotteryStart = async () => {
    const callbackFn = async () => startLottery(activeAddress, signer, toast);
    await callWriteContractFunction(callbackFn, "Lottery start");
  };
  const onLotteryEnd = async () => {
    const callbackFn = async () => endLottery(activeAddress, signer, toast);
    await callWriteContractFunction(callbackFn, "Lottery end ");
  };
  const onWithdrawHandler = async () => {
    const callbackFn = async () => withdraw(activeAddress, signer, toast);
    await callWriteContractFunction(callbackFn, "Withdraw funds ");
  };
  const onTransferDepositsHandler = async () => {
    //TODO call at first set up for next sale address
    const callbackFn = async () =>
      transferDeposits(activeAddress, signer, toast, nextSaleData);
    await callWriteContractFunction(callbackFn, "Transfer deposits ");
  };
  const onSellerWithdrawFundsHandler = async () => {
    const callbackFn = async () => sellerWithdraw(activeAddress, signer, toast);
    await callWriteContractFunction(callbackFn, "Seller withdraw ");
  };
  const onDepositHandler = async (amount) => {
    const minAmount = await readMinimumDepositAmount(activeAddress);

    if (Number(minAmount) > amount) {
      toast({
        status: "error",
        title: `Minimum amount of deposit if $${Number(minAmount)}`,
      });

      return;
    }
    console.log("🌳 minAmount: ", Number(minAmount));
    const callbackFn = async () =>
      deposit(
        activeAddress,
        amount,
        signer,
        toast,
        updateTransactionLoadingState,
      );
    await callWriteContractFunction(callbackFn, "USDC Deposit");
    clearLoadingState();
  };
  const onSelectWinners = async () => {
    const callbackFn = async () => selectWinners(
        activeAddress,
        signer,
        toast,
    );

    await callWriteContractFunction(callbackFn, "Select Winners");

  };
  return {
    onDepositHandler,
    onWithdrawHandler,
    onLotteryStart,
    onMint,
    onLotteryEnd,
    isTransactionLoading,
    onTransferDepositsHandler,
    onSellerWithdrawFundsHandler,
    transactionLoadingState,
    onSelectWinners,
    salesData: {
      lotteryV1: { ...lotteryV1Data },
      lotteryV2: { ...lotteryV2Data },
      auctionV1: { ...auctionV1Data },
      auctionV2: { ...auctionV2Data },
    },
  };
};
