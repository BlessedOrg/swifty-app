"use client";
import { Flex } from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { DepositModal } from "@/components/event/modals/DepositModal";
import { MintTicketModal } from "@/components/event/modals/MintTicketModal";
import { LotterySidebar } from "@/components/event/eventLottery/lotterySidebar/LotterySidebar";
import { LotteryContent } from "@/components/event/eventLottery/lotteryContent/LotteryContent";
import { useConnectWallet } from "@/hooks/useConnect";
import FlippableCard from "@/components/flipCard/FlippableCard";
import { useSales } from "@/hooks/sales/useSales";
import { LoadingModal } from "@/components/ui/LoadingModal";
import { LotteryCountdown } from "@/components/event/eventLottery/LotteryCountdown";
import { cutWalletAddress } from "@/utilscutWalletAddress";

export const EventLottery = ({
  activePhase,
  startDate,
  phasesState,
  updateActivePhase,
  updatePhaseState,
  eventData,
}) => {
  const getLotteryAddressPerActivePhase = {
    0: eventData?.lotteryV1contractAddr,
    1: eventData?.lotteryV2contractAddr,
    2: eventData?.auctionV1contractAddr,
    3: eventData?.auctionV2contractAddr,
  };
  const salePerIdx = {
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

  const {
    onDepositHandler,
    onWithdrawHandler,
    isDepositLoading,
    isWithdrawLoading,
    salesData,
    onLotteryStart: startLotteryHandler,
  } = useSales(lotteryAddresses, activeLotteryAddress);

  const { isConnected, walletAddress } = useConnectWallet();
  const [showWalletConnect, setShowWalletConnect] = useState(false);
  const [showWithdrawView, setShowWithdrawView] = useState(false);
  const [isLotteryActive, setIsLotteryActive] = useState(false);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isMintModalOpen, setIsMintModalOpen] = useState(false);

  const activeSaleData =
    salesData?.[salePerIdx[activePhase?.idx]]?.saleData || null;

  const userData = {
    balance: 0,
    username: cutWalletAddress(walletAddress) || "User",
    avatar: "/images/profile.png",
  };

  const onToggleMintModalHandler = () => {
    setIsMintModalOpen((prev) => !prev);
  };
  const onToggleWindowViewHandler = () => {
    setShowWithdrawView((prev) => !prev);
  };
  const onToggleDepositViewHandler = () => {
    setIsDepositModalOpen((prev) => !prev);
  };
  const onLotteryStart = () => {
    setIsLotteryActive(true);
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
  const isLotteryEnded = !phasesState?.filter((i) => !i.phaseState.isFinished)
    ?.length;
  // const isLotteryEnded = false;

  return (
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
        onToggleMintModalHandler={onToggleMintModalHandler}
        onToggleWithdrawViewHandler={onToggleWindowViewHandler}
        userData={userData}
        activeSaleData={activeSaleData}
        isConnected={isConnected}
        onWithdrawHandler={onWithdrawHandler}
        withdrawEnabled={isWithdrawEnabled || isLotteryEnded}
        mintEnabled={false}
        depositEnabled={true}
        activePhase={activePhase}
        isLotteryEnded={isLotteryEnded}
        sellerFunctions={{
          onLotteryStart: activeSaleData?.onLotteryStart,
          onSelectWinners: salesData?.lotteryV1.onSelectWinners,
        }}
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
        isOpen={isDepositLoading || isWithdrawLoading}
        onClose={() => {}}
        title={"Transaction is pending"}
        description={
          <>
            Please do not close this window. <br /> Transaction is pending.
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
      />
      <MintTicketModal
        isOpen={isMintModalOpen}
        onClose={onToggleMintModalHandler}
      />
    </Flex>
  );
};
