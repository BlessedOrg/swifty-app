import { Flex } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { DepositModal } from "@/components/event/modals/DepositModal";
import { MintTicketModal } from "@/components/event/modals/MintTicketModal";
import { LotterySidebar } from "@/components/event/eventLottery/LotterySidebar";
import { LotteryCountdown } from "@/components/event/eventLottery/LotteryCountdown";
import { LotteryContent } from "@/components/event/eventLottery/lotteryContent/LotteryContent";
import { useConnectWallet } from "@/hooks/useConnect";
import FlippableCard from "@/components/flipCard/FlippableCard";

export const EventLottery = ({}) => {
  const { isConnected } = useConnectWallet();
  const [startDate] = useState(new Date().getTime() + 5000);
  const [showWalletConnect, setShowWalletConnect] = useState(false);
  const [isLotteryActive, setIsLotteryActive] = useState(false);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isMintModalOpen, setIsMintModalOpen] = useState(false);

  const onToggleMintModalHandler = () => {
    setIsMintModalOpen((prev) => !prev);
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
    myNumber: Math.floor(Math.random() * 100),
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
        onToggleDepositModalHandler={onToggleDepositViewHandler}
        onToggleMintModalHandler={onToggleMintModalHandler}
        userData={dummyUserData}
        isConnected={isConnected}
        onDepositHandler={onDepositHandler}
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
