"use client";
import { Flex, Text } from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { DepositModal } from "@/components/event/eventLottery/modals/DepositModal";
import { LotterySidebar } from "@/components/event/eventLottery/lotterySidebar/LotterySidebar";
import { LotteryContent } from "@/components/event/eventLottery/lotteryContent/LotteryContent";
import { useConnectWallet } from "@/hooks/useConnect";
import FlippableCard from "@/components/flipCard/FlippableCard";
import { useSales } from "@/hooks/sales/useSales";
import { LoadingModal } from "@/components/ui/LoadingModal";
import { LotteryCountdown } from "@/components/event/eventLottery/LotteryCountdown";
import { cutWalletAddress } from "@/utils/cutWalletAddress";
import { ILotteryV1 } from "@/hooks/sales/useLotteryV1";
import { ILotteryV2 } from "@/hooks/sales/useLotteryV2";
import { IAuctionV2 } from "@/hooks/sales/useAuctionV2";
import { IAuctionV1 } from "@/hooks/sales/useAuctionV1";
import { SellerTools } from "@/components/event/eventLottery/lotterySidebar/SellerTools";
import { SetRollPriceModal } from "@/components/event/eventLottery/modals/SetRollPriceModal";
import { SetupNewRoundModal } from "@/components/event/eventLottery/modals/SetupNewRoundModal";
import { SetRollToleranceModal } from "@/components/event/eventLottery/modals/SetRollToleranceModal";
import Confetti from "react-confetti";
import confetti from "react-confetti/src/Confetti";
import {useSaleNotifications} from "@/hooks/useSaleNotifications";

type ISale = ILotteryV1 | ILotteryV2 | IAuctionV1 | IAuctionV2 | null;
export const EventLottery = ({
  activePhase,
  startDate,
  phasesState,
  updateActivePhase,
  updatePhaseState,
  eventData,
  isWindowExpanded,
}) => {
  // const isLotteryEnded = !phasesState?.filter(i => !i.phaseState.isFinished)?.length;
  const isLotteryEnded = false;
  const getLotteryAddressPerActivePhase = {
    0: eventData?.lotteryV1contractAddr,
    1: eventData?.lotteryV2contractAddr,
    2: eventData?.auctionV1contractAddr,
    3: eventData?.auctionV2contractAddr,
  };
  const saleIdPerIdx = {
    0: "lotteryV1",
    1: "lotteryV2",
    2: "auctionV1",
    3: "auctionV2",
  };
  const activeLotteryAddress = useMemo(
    () => getLotteryAddressPerActivePhase?.[activePhase?.idx] || "",
    [activePhase?.idx],
  );
  const lotteryAddresses = {
    lotteryV1: eventData.lotteryV1contractAddr,
    lotteryV2: eventData.lotteryV2contractAddr,
    auctionV1: eventData.auctionV1contractAddr,
    auctionV2: eventData.auctionV2contractAddr,
  };

  const [currentViewId, setCurrentViewId] = useState<string>("lotteryV1");

  const currentTabSaleContractAddress = lotteryAddresses?.[currentViewId] || null;

  const nextSaleData = getNextAddressInfo(
    lotteryAddresses[currentViewId],
    lotteryAddresses,
  );

  const {
    onDepositHandler,
    onWithdrawHandler,
    salesData,
    onMint,
    isTransactionLoading,
    onLotteryEnd,
    onTransferDepositsHandler,
    onLotteryStart: startLotteryHandler,
    onSellerWithdrawFundsHandler,
    transactionLoadingState,
    onSelectWinners,
  } = useSales(
    lotteryAddresses,
    currentTabSaleContractAddress,
    nextSaleData,
    currentTabSaleContractAddress,
    isLotteryEnded,
      currentViewId
  );

  const { isConnected, walletAddress } = useConnectWallet();
  const [showWalletConnect, setShowWalletConnect] = useState(false);
  const [isLotteryActive, setIsLotteryActive] = useState(false);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isNewRoundModalOpen, setIsNewRoundModalOpen] = useState(false);
  const [isSetRollPriceModalOpen, setIsSetRollPriceModalOpen] = useState(false);
  const [isRollToleranceModalOpen, setIsRollToleranceModalOpen] = useState(false);
  const activeSaleData = (salesData?.[saleIdPerIdx[activePhase?.idx]] || null) as ISale;
  const currentTabSaleData = (salesData?.[currentViewId] || null) as ISale;

  const userData = {
    balance: 0,
    username: cutWalletAddress(walletAddress) || "User",
    avatar: "/images/profile.png",
    walletAddress,
  };

  const onToggleDepositViewHandler = () => {
    setIsDepositModalOpen((prev) => !prev);
  };
  const onLotteryStart = () => {
    setIsLotteryActive(true);
  };
  const onToggleSetRollPriceModal = () => {
    setIsSetRollPriceModalOpen((prev) => !prev);
  };
  const onToggleSetNewRoundModal = () => {
    setIsNewRoundModalOpen((prev) => !prev);
  };
  const updateCurrentViewId = (id: number) => {
    const idName = saleIdPerIdx[id];
    setCurrentViewId(idName);
  };
  const onToggleRoleToleranceModal = () => {
    setIsRollToleranceModalOpen((prev) => !prev);
  };
  useEffect(() => {
    if (isConnected && showWalletConnect) {
      setShowWalletConnect(false);
    }
    if (!isConnected && isLotteryActive) {
      setShowWalletConnect(true);
    }
  }, [isConnected, isLotteryActive]);

  const [showFront, setShowFront] = useState(true);

  useEffect(() => {
    setShowFront(isLotteryActive);
  }, [isLotteryActive]);

  const isWithdrawEnabled =
    isLotteryActive && !!activePhase?.phaseState?.isCooldown;

  const isMintEnabled =
    !currentTabSaleData?.saleData?.hasMinted &&
    !!currentTabSaleData?.saleData?.isWinner;

  const isSeller = !!salesData?.lotteryV1?.saleData?.isOwner;
  const isDepositEnabled =
    !isLotteryEnded && !currentTabSaleData?.saleData?.isWinner;

  const {currentSaleState} = useSaleNotifications(currentTabSaleData?.saleData,  currentViewId )
  return (
    <Flex
      justifyContent={"center"}
      width="100%"
      maxW={isSeller ? "1400px" : "1200px"}
      gap={isSeller ? 4 : 0}
      my={isWindowExpanded ? 10 : 0}
      h={isWindowExpanded ? "650px" : 0}
      overflow={"hidden"}
      transition={"all 350ms"}
      pos={"relative"}
    >
      {currentSaleState?.showConfetti && <Confetti width={1200} height={650} tweenDuration={5000} />}
      <Flex
        p={"8px"}
        bg={"#EEEEEE"}
        w={"100%"}
        color={"#fff"}
        rounded={"8px"}
        gap={4}
      >
        <LotterySidebar
          onToggleDepositViewHandler={onToggleDepositViewHandler}
          userData={userData}
          activeSaleData={currentTabSaleData?.saleData}
          isConnected={isConnected}
          onWithdrawHandler={onWithdrawHandler}
          withdrawEnabled={isWithdrawEnabled}
          mintEnabled={isMintEnabled}
          depositEnabled={isDepositEnabled}
          isLotteryEnded={isLotteryEnded}
          onMint={onMint}
          currentSelectedTabId={currentViewId}
        />

        <FlippableCard
          flexDirection={"column"}
          w={"100%"}
          gap={10}
          rounded={"8px"}
          alignItems={"center"}
          h={"100%"}
          showFront={showFront}
          front={
            <LotteryContent
              disabledPhases={false}
              startDate={startDate}
              showWalletConnect={Boolean(showWalletConnect && !isConnected)}
              salesData={salesData}
              activePhase={activePhase}
              setActivePhase={updateActivePhase}
              setPhasesState={updatePhaseState}
              isLotteryEnded={isLotteryEnded}
              eventData={eventData}
              phasesState={phasesState}
              isLotteryActive={isLotteryActive}
              updateCurrentViewId={updateCurrentViewId}
              isSeller={isSeller}
              isDepositModalOpen={isDepositModalOpen}
              isWindowExpanded={isWindowExpanded}
              currentTabId={currentViewId}
            />
          }
          back={
            <LotteryCountdown
              startDate={startDate}
              onLotteryStart={onLotteryStart}
            />
          }
        />
        <LoadingModal
          transactionLoadingState={transactionLoadingState}
          isOpen={isTransactionLoading}
          onClose={() => {}}
          title={"Transaction is pending"}
          description={
            <>
              Please do not close this window. <br /> Transactions are pending.
            </>
          }
        />
        {/*Modals*/}
        <DepositModal
          isOpen={isDepositModalOpen}
          onClose={onToggleDepositViewHandler}
          onDepositHandler={onDepositHandler}
          defaultValue={userData?.balance}
          eventData={eventData}
          currentTabSaleData={currentTabSaleData?.saleData}
          currentTabId={currentViewId}
          userData={userData}
        />
        <SetRollPriceModal
          isOpen={isSetRollPriceModalOpen}
          onClose={onToggleSetRollPriceModal}
          onSetRollPrice={salesData?.lotteryV2.onSetRollPrice}
        />

        <SetRollToleranceModal
          isOpen={isRollToleranceModalOpen}
          onClose={onToggleRoleToleranceModal}
          onSetRollTolerance={salesData?.lotteryV2.onSetRollTolerance}
        />
        <SetupNewRoundModal
          isOpen={isNewRoundModalOpen}
          onClose={() => setIsNewRoundModalOpen(false)}
          onSetupNewRound={salesData?.auctionV1.onSetupNewRound}
        />
      </Flex>
      {isSeller && (
        <Flex flexDirection={"column"} gap={4}>
          <Text fontWeight={"bold"} textAlign={"center"}>
            Seller tools
          </Text>
          <SellerTools
            functions={{
              onLotteryStart: startLotteryHandler,
              onSelectWinners: onSelectWinners,
              onLotteryEnd,
              onTransferDepositsHandler,
              onSellerWithdrawFundsHandler,
              onSetRollPrice: onToggleSetRollPriceModal,
              onSetupNewRound: onToggleSetNewRoundModal,
              onToggleRoleToleranceModal,
            }}
            currentViewId={currentViewId}
            activeSaleData={currentTabSaleData?.saleData}
          />
        </Flex>
      )}
    </Flex>
  );
};

function getNextAddressInfo(currentAddress: string, lotteryAddresses): { id: string; address: string } | null {
  const keys = Object.keys(lotteryAddresses);
  const currentIndex = keys.findIndex(
    (key) => lotteryAddresses[key] === currentAddress,
  );
  if (currentIndex === -1 || currentIndex === keys.length - 1) {
    return null;
  } else {
    const nextKey = keys[currentIndex + 1];
    const nextAddress = lotteryAddresses[nextKey];
    return { address: nextAddress, id: nextKey };
  }
}
