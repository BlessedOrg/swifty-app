"use client";
import { Flex } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { DepositModal } from "@/components/event/modals/DepositModal";
import { MintTicketModal } from "@/components/event/modals/MintTicketModal";
import { LotterySidebar } from "@/components/event/eventLottery/LotterySidebar";
import { LotteryCountdown } from "@/components/event/eventLottery/LotteryCountdown";
import { LotteryContent } from "@/components/event/eventLottery/lotteryContent/LotteryContent";
import { useConnectWallet } from "@/hooks/useConnect";
import FlippableCard from "@/components/flipCard/FlippableCard";

export const EventLottery = ({ activePhase, startDate, phasesState, updateActivePhase, updatePhaseState }) => {
  const { isConnected } = useConnectWallet();
  const [showWalletConnect, setShowWalletConnect] = useState(false);
  const [showWithdrawView, setShowWithdrawView] = useState(false);
  const [isLotteryActive, setIsLotteryActive] = useState(false);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isMintModalOpen, setIsMintModalOpen] = useState(false);

  const onToggleMintModalHandler = () => {
    setIsMintModalOpen((prev) => !prev);
  };
  const onToggleWindowViewHandler = () => {
    setShowWithdrawView((prev) => !prev);
  };
  const onToggleDepositViewHandler = () => {
    if (!isLotteryActive && !isConnected) {
      setShowWalletConnect(true);
    }
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

  // dummy operations
  const [dummyUserData, setDummyUserData] = useState({
    balance: 0,
    username: "Username",
    avatar: "/images/profile.png",
  });

  const onDepositHandler = (amount) => {
    setDummyUserData((prev) => ({
      ...prev,
      balance: prev.balance + amount,
    }));
  };

  const lotteryData = {
    winners: 1,
    users: 1758,
    tickets: 99,
    lastWinner: 17,
    myNumber: 12,
    winningChance: 5.6,
    missingFunds: 20,
    price: 120,
    position: 77,
    userFunds: dummyUserData.balance,
    targetNumber: 29,
    vacancyTicket: 12,
  };

  const [showFront, setShowFront] = useState(true);

  useEffect(() => {
    if (isLotteryActive) {
      setShowFront(true);
    } else {
      setShowFront(false);
    }
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
        userData={dummyUserData}
        lotteryData={lotteryData}
        isConnected={isConnected}
        onDepositHandler={onDepositHandler}
        withdrawEnabled={isWithdrawEnabled}
        mintEnabled={false}
        depositEnabled={true}
        activePhase={activePhase}
        isLotteryEnded={isLotteryEnded}
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
            lotteryData={lotteryData}
            phasesState={phasesState}
            activePhase={activePhase}
            setActivePhase={updateActivePhase}
            setPhasesState={updatePhaseState}
            showWithdrawWindow={showWithdrawView && isWithdrawEnabled}
            isLotteryEnded={isLotteryEnded}
          />
        }
        back={
          <LotteryCountdown
            startDate={startDate}
            onLotteryStart={onLotteryStart}
          />
        }
      />

      {/*Modals*/}
      <DepositModal
        isOpen={isDepositModalOpen}
        onClose={onToggleDepositViewHandler}
        onDepositHandler={onDepositHandler}
        defaultValue={dummyUserData.balance}
      />
      <MintTicketModal
        isOpen={isMintModalOpen}
        onClose={onToggleMintModalHandler}
      />
    </Flex>
  );
};
