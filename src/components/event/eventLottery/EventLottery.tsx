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
import { useLottery } from "@/hooks/useLottery";
import { LoadingModal } from "@/components/ui/LoadingModal";

export const EventLottery = ({
  activePhase,
  startDate,
  phasesState,
  updateActivePhase,
  updatePhaseState,
  eventData,
}) => {
  const {
    onDepositHandler,
    onWithdrawHandler,
    isDepositLoading,
    isWithdrawLoading,
    userData,
    lotteryData,
  } = useLottery(eventData?.lotteryV1contractAddr);
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
        lotteryData={lotteryData}
        isConnected={isConnected}
        onWithdrawHandler={onWithdrawHandler}
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
            activePhase={activePhase}
            setActivePhase={updateActivePhase}
            setPhasesState={updatePhaseState}
            showWithdrawWindow={showWithdrawView && isWithdrawEnabled}
            isLotteryEnded={isLotteryEnded}
            eventData={eventData}
            phasesState={phasesState}
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
