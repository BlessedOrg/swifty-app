import { useEffect, useState } from "react";
import { approve, deposit, endLottery, mint, readSmartContract, selectWinners, sellerWithdraw, startLottery, transferDeposits, windowEthereum, withdraw } from "@/utils/contracts/contracts";
import { useSigner } from "@thirdweb-dev/react";
import { contractsInterfaces, publicClient, waitForTransactionReceipt } from "../../services/viem";
import { useToast } from "@chakra-ui/react";
import { ILotteryV1, useLotteryV1 } from "@/hooks/sales/useLotteryV1";
import { ILotteryV2, useLotteryV2 } from "@/hooks/sales/useLotteryV2";
import { IAuctionV1, useAuctionV1 } from "@/hooks/sales/useAuctionV1";
import { IAuctionV2, useAuctionV2 } from "@/hooks/sales/useAuctionV2";
import { stringToCamelCase } from "@/utils/stringToCamelCase";
import { fetcher } from "../../requests/requests";
import getMatchingKey from "@/utils/getMatchingKeyByValue";
import capitalizeFirstLetter from "@/utils/capitalizeFirstLetter";
import { mutate } from "swr";

export const useSales = (
  salesAddresses,
  activeAddress,
  nextSaleData: { id: string; address: string } | null,
  eventId
) => {
  const [isTransactionLoading, setIsTransactionLoading] = useState(false);
  const [transactionLoadingState, setTransactionLoadingState] = useState<{
    id: string;
    isLoading: boolean;
    isFinished?: boolean;
    name: string;
    isError?: boolean;
  }[]>([]);
  const signer = useSigner();
  const toast = useToast();

  const updateLoadingState = (value: boolean) => setIsTransactionLoading(value);

  const updateTransactionLoadingState = (incomingState) => {
    const updateState = (state) => {
      const { name, id, isLoading, isFinished, isError } = state;

      setTransactionLoadingState((prevState) => {
        const index = prevState.findIndex((prevState) => prevState.id === id);
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

    if (Array.isArray(incomingState)) {
      incomingState.forEach(updateState);
    } else {
      updateState(incomingState);
    }
  };

  const clearLoadingState = () => setTransactionLoadingState([]);

  useEffect(() => {
    if (!isTransactionLoading && !!transactionLoadingState.length) {
      clearLoadingState();
    }
  }, [transactionLoadingState]);

  const lotteryV1Data = useLotteryV1(salesAddresses.lotteryV1);
  const lotteryV2Data = useLotteryV2(salesAddresses.lotteryV2, updateLoadingState, updateTransactionLoadingState);
  const auctionV1Data = useAuctionV1(salesAddresses.auctionV1, updateLoadingState, updateTransactionLoadingState);
  const auctionV2Data = useAuctionV2(salesAddresses.auctionV2);


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
    console.log("🚨 useSales.tsx - ![window.ethereum]");
    return {
      onDepositHandler: null,
      onWithdrawHandler: null,
      isTransactionLoading: null,
      salesData: {
          lotteryV1: { ...lotteryV1Data } as ILotteryV1,
          lotteryV2: { ...lotteryV2Data } as ILotteryV2,
          auctionV1: { ...auctionV1Data } as IAuctionV1,
          auctionV2: { ...auctionV2Data } as IAuctionV2,
      },
    };
  }

  //sale refetcher
  useEffect(() => {
    if(!!signer){
      const interval = setInterval(() => {
        readLotteryDataFromContract(activeAddress);
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [signer, activeAddress]);

  const callWriteContractFunction = async (callback, methodName, manageLoadingState = true) => {
    const method = stringToCamelCase(methodName);
    try {
      setIsTransactionLoading(true);
      manageLoadingState && updateTransactionLoadingState({
        id: method,
        name: methodName,
        isLoading: true,
        isFinished: false,
      });

      const resTxHash = await callback(activeAddress, signer);

      console.log(`📟 ${methodName} TX - `, resTxHash);

      if (!!resTxHash?.error) {
        toast({
          status: "error",
          title: `Error reason: ${resTxHash?.error}`,
        });
        setIsTransactionLoading(false);
        clearLoadingState();
        return {
          error: resTxHash?.error
        };
      }
      if (!!resTxHash) {
        const confirmation = await waitForTransactionReceipt(resTxHash, 1);

        if (confirmation?.status === "success") {
          await readLotteryDataFromContract();
          manageLoadingState && updateTransactionLoadingState({
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
          manageLoadingState && updateTransactionLoadingState({
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
    const phase = capitalizeFirstLetter(getMatchingKey(salesAddresses, activeAddress));
    
    const nftAddr = await readSmartContract(
      activeAddress,
      contractsInterfaces[phase].abi,
      "nftContractAddr",
    );

    let mintedTokenId;
    let winnerAddr;

    const unwatch = publicClient.watchContractEvent({
      address: nftAddr as string,
      eventName: "TransferSingle",
      abi: contractsInterfaces["NftTicket"].abi,
      pollingInterval: 500,
      onLogs: logs => {
        logs.forEach(log => {
          if ((log as any).args.to === (signer as any)?._address) {
            mintedTokenId = (log as any).args.id ?? 0;
            winnerAddr = (log as any).args.to;
          }
        });
      },
      onError: error => console.error("🚨 Error watching event: ", error),
    });

    const callbackFn = async () => mint(activeAddress, signer);
    const res = await callWriteContractFunction(callbackFn, "Mint ticket");

    if (res?.confirmation?.status === "success") {
      await fetcher("/api/user/saveMint", {
        method: "POST",
        body: JSON.stringify({
          txHash: res?.resTxHash,
          tokenId: Number(mintedTokenId),
          contractAddr: nftAddr,
          gasWeiPrice: Number(res?.confirmation?.gasUsed) * Number(res?.confirmation?.effectiveGasPrice),
          winnerAddr,
          eventId
        }),
      });
      await mutate("/api/user/myTickets");
      console.log(`🪙 Minted token ID #${mintedTokenId} on Contract: ${nftAddr}`);
    }

    unwatch();
  };

  const onLotteryStart = async () => {
    const callbackFn = async () => startLottery(activeAddress, signer);
    await callWriteContractFunction(callbackFn, "Start Lottery");
  };

  const onLotteryEnd = async () => {
    const callbackFn = async () => endLottery(activeAddress, signer);
    await callWriteContractFunction(callbackFn, "End Lottery");
  };

  const onWithdrawHandler = async () => {
    const callbackFn = async () => withdraw(activeAddress, signer);
    await callWriteContractFunction(callbackFn, "Withdraw funds");
  };

  const onTransferDepositsHandler = async () => {
    const callbackFn = async () => transferDeposits(activeAddress, signer, nextSaleData);
    await callWriteContractFunction(callbackFn, "Transfer deposits");
  };

  const onSellerWithdrawFundsHandler = async () => {
    const callbackFn = async () => sellerWithdraw(activeAddress, signer);
    await callWriteContractFunction(callbackFn, "Seller withdraw");
  };

  const onDepositHandler = async (amount: number) => {
    updateTransactionLoadingState([
      {
        id: "approve",
        name: "Approve USDC",
        isLoading: true,
        isFinished: false,
      },
      {
        id: "usdcDeposit",
        name: "Deposit USDC",
        isLoading: false,
        isFinished: false,
      }
    ]);

    const approveCallbackFn = async () => approve(activeAddress, amount, signer);
    const approveValue = await callWriteContractFunction(approveCallbackFn, "USDC Approve", false);

    if (approveValue?.error) {
      return;
    }

    updateTransactionLoadingState([
      {
        id: "approve",
        name: "USDC Approve",
        isLoading: false,
        isFinished: true,
      },
      {
        id: "usdcDeposit",
        name: "USDC Deposit",
        isLoading: true,
        isFinished: false,
      }
    ]);

    const depositCallbackFn = async () => deposit(activeAddress, amount, signer);
    await callWriteContractFunction(depositCallbackFn, "USDC Deposit", false);

    updateLoadingState(false)
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
      lotteryV1: { ...lotteryV1Data } as ILotteryV1,
      lotteryV2: { ...lotteryV2Data } as ILotteryV2,
      auctionV1: { ...auctionV1Data } as IAuctionV1,
      auctionV2: { ...auctionV2Data } as IAuctionV2,
    },
  };
};
