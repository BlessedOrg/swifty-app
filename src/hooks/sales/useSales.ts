import { useEffect, useState } from "react";
import { approve, deposit, endLottery, mint, readSmartContract, selectWinners, sellerWithdraw, startLottery, transferDeposits, windowEthereum, withdraw } from "@/utils/contracts/contracts";
import { useActiveAccount } from "thirdweb/react";
import { contractsInterfaces, publicClient, waitForTransactionReceipt } from "services/viem";
import { useToast } from "@chakra-ui/react";
import { ILotteryV1, useLotteryV1 } from "@/hooks/sales/useLotteryV1";
import { ILotteryV2, useLotteryV2 } from "@/hooks/sales/useLotteryV2";
import { IAuctionV1, useAuctionV1 } from "@/hooks/sales/useAuctionV1";
import { IAuctionV2, useAuctionV2 } from "@/hooks/sales/useAuctionV2";
import { stringToCamelCase } from "@/utils/stringToCamelCase";
import { fetcher } from "requests/requests";
import getMatchingKey from "@/utils/getMatchingKeyByValue";
import capitalizeFirstLetter from "@/utils/capitalizeFirstLetter";
import { mutate } from "swr";
import { useUserContext } from "@/store/UserContext";
import { getExplorerUrl, PrefixedHexString } from "services/web3Config";
import { shortenAddress } from "thirdweb/utils";
import { Account } from "thirdweb/wallets";
import { createLogArgs } from "@/utils/logger";

const dummySignerAddress = "0x0000000000000000000000000000000000000000";
export const useSales = (
  salesAddresses,
  activeAddress,
  nextSaleData: { id: string; address: string } | null,
  eventId,
) => {
  const [readingInitalContractsState, setReadingInitalContractsState] = useState(false);
  const { userId, walletAddress, isLoggedIn, differentAccounts } = useUserContext();
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
  const activeAccount = useActiveAccount();
  const signer = {
    ...activeAccount,
    address: isLoggedIn ? activeAccount?.address : dummySignerAddress,
  } as Account;
  const signerIsNotDummy = signer.address !== dummySignerAddress;
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

  const clearLoadingState = () => {
    setIsTransactionLoading(false);
    setTransactionLoadingState([]);
  };

  useEffect(() => {
    if (!isTransactionLoading && !!transactionLoadingState.length) {
      clearLoadingState();
    }
  }, [transactionLoadingState]);

  const lotteryV1Data = useLotteryV1(
    signer,
    salesAddresses.lotteryV1,
    updateLoadingState,
    updateTransactionLoadingState,
  );
  const lotteryV2Data = useLotteryV2(
    signer,
    salesAddresses.lotteryV2,
    updateLoadingState,
    updateTransactionLoadingState,
  );
  const auctionV1Data = useAuctionV1(
    signer,
    salesAddresses.auctionV1,
    updateLoadingState,
    updateTransactionLoadingState,
  );
  const auctionV2Data = useAuctionV2(
    signer,
    salesAddresses.auctionV2
  );

  const lotteriesData = [
    lotteryV1Data,
    lotteryV2Data,
    auctionV1Data,
    auctionV2Data,
  ];
  const someContractsAreNotDefined = lotteriesData?.some(
    (lottery) => lottery.saleData?.isDefaultState,
  );
  const salesRefetcher = {
    [salesAddresses.lotteryV1]: lotteryV1Data,
    [salesAddresses.lotteryV2]: lotteryV2Data,
    [salesAddresses.auctionV1]: auctionV1Data,
    [salesAddresses.auctionV2]: auctionV2Data,
  };
  const readLotteryDataFromContract = async (address?: string) => {
    if (!!address) {
      await salesRefetcher[address].readLotteryDataFromContract();
    } else if (salesRefetcher[activeAddress]) {
      await salesRefetcher[activeAddress].readLotteryDataFromContract();
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

  useEffect(() => {
    if (signer) {
      const interval = setInterval(() => {
        console.log(
          ...createLogArgs("🔄🔄 Refetching sales data...", {
            color: "violet",
            bg: "black",
            bold: true,
          }),
        );
        readLotteryDataFromContract(activeAddress);
      }, 2500);

      return () => {
        clearInterval(interval);
      };
    }
  }, [signer, differentAccounts]);

  const refetchCurrentSaleUserStats = async(address) => {
    await salesRefetcher[address].checkUserStatsInContract()
  }
  useEffect(() => {
    if (signer && !!activeAddress ) {
      const interval2 = setInterval(() => {
        refetchCurrentSaleUserStats(activeAddress);
      }, 1500);

      return () => {
        clearInterval(interval2);
      };
    }
  }, [signer, activeAddress]);

  const readInitialContractsState = async () => {
    setReadingInitalContractsState(true);
    console.log(
      ...createLogArgs(
        `👑 Checking user start for each sale in contract.. for address: ${shortenAddress(signer.address!)}`,
        { color: "cornflowerblue", bg: "black" },
      ),
    );
    lotteryV1Data.checkUserStatsInContract();
    lotteryV2Data.checkUserStatsInContract();
    auctionV1Data.checkUserStatsInContract();
    auctionV2Data.checkUserStatsInContract();
  };
  useEffect(() => {
    if (
      (differentAccounts && signerIsNotDummy) ||
      (someContractsAreNotDefined &&
        signerIsNotDummy &&
        !readingInitalContractsState)
    ) {
      readInitialContractsState();
    }
  }, [differentAccounts, signer]);

  useEffect(() => {
    if (signerIsNotDummy && someContractsAreNotDefined) {
      const timer = setTimeout(() => {
        console.log(
          ...createLogArgs(
            "📖 (Initial Call) Read data from all contracts and setup each sale state..",
            { color: "white", bg: "purple" },
          ),
        );
        lotteryV1Data.readLotteryDataFromContract();
        lotteryV2Data.readLotteryDataFromContract();
        auctionV1Data.readLotteryDataFromContract();
        auctionV2Data.readLotteryDataFromContract();
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [signer]);

  const callWriteContractFunction = async (
    callback,
    methodName,
    manageLoadingState = true,
  ) => {
    const method = stringToCamelCase(methodName);
    try {
      setIsTransactionLoading(true);
      manageLoadingState &&
        updateTransactionLoadingState({
          id: method,
          name: methodName,
          isLoading: true,
          isFinished: false,
        });

      const resTxHash = await callback(activeAddress, signer);

      console.log(
        ...createLogArgs(
          `📟 ${methodName} TX - ${getExplorerUrl({ hash: resTxHash })}`,
          { color: "white", bg: "black" },
        ),
      );

      if (!!resTxHash?.error) {
        toast({
          status: "error",
          title: `Error reason: ${resTxHash?.error}`,
        });
        clearLoadingState();
        return {
          error: resTxHash?.error,
        };
      }
      if (!!resTxHash) {
        const confirmation = await waitForTransactionReceipt(resTxHash, 1);

        if (confirmation?.status === "success") {
          await readLotteryDataFromContract();
          manageLoadingState &&
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
          manageLoadingState &&
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
    } catch (error: any) {
      clearLoadingState();
      console.log(
        `🚨 Error while calling function ${methodName}: `,
        error.message,
      );
    }
  };

  const onMint = async () => {
    const phase = capitalizeFirstLetter(
      getMatchingKey(salesAddresses, activeAddress),
    );

    const nftAddr = await readSmartContract(
      activeAddress,
      contractsInterfaces[phase].abi,
      "nftContractAddr",
    );

    let mintedTokenId;
    let winnerAddr;

    const unwatch = publicClient.watchContractEvent({
      address: nftAddr as PrefixedHexString,
      eventName: "TransferSingle",
      abi: contractsInterfaces["NftTicket"].abi,
      pollingInterval: 500,
      onLogs: (logs) => {
        console.log(logs);
        logs.forEach((log) => {
          if ((log as any).args.to === (signer as any)?.address) {
            mintedTokenId = (log as any).args.id ?? 0;
            winnerAddr = (log as any).args.to;
          }
        });
      },
      onError: (error) => console.error("🚨 Error watching event: ", error),
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
          gasWeiPrice:
            Number(res?.confirmation?.gasUsed) *
            Number(res?.confirmation?.effectiveGasPrice),
          winnerAddr: `${winnerAddr}`.includes("0x")
            ? winnerAddr
            : walletAddress,
          eventId,
          id: userId,
        }),
      });
      await mutate("/api/user/myTickets");
      console.log(
        `🪙 Minted token ID #${mintedTokenId} on Contract: ${nftAddr}`,
      );
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
    const callbackFn = async () =>
      transferDeposits(activeAddress, signer, nextSaleData);
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
      },
    ]);

    const approveCallbackFn = async () =>
      approve(activeAddress, amount, signer);
    const approveValue = await callWriteContractFunction(
      approveCallbackFn,
      "USDC Approve",
      false,
    );

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
      },
    ]);

    const depositCallbackFn = async () =>
      deposit(activeAddress, amount, signer);
    await callWriteContractFunction(depositCallbackFn, "USDC Deposit", false);
    await salesRefetcher[activeAddress].checkUserStatsInContract()
    updateLoadingState(false);
    clearLoadingState();
    return {status: "ok"}
  };

  const onSelectWinners = async () => {
    const callbackFn = async () => selectWinners(activeAddress, signer, toast);

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
