import { Flex } from "@chakra-ui/react";

import { useEffect, useState } from "react";
import { DepositModal } from "@/components/event/modals/DepositModal";
import { MintTicketModal } from "@/components/event/modals/MintTicketModal";
import { LotterySidebar } from "@/components/event/eventLottery/LotterySidebar";
import { LotteryCountdown } from "@/components/event/eventLottery/LotteryCountdown";
import { LotteryContent } from "@/components/event/eventLottery/LotteryContent";
import { ConnectEmbed } from "@thirdweb-dev/react";
import { useConnectWallet } from "@/hooks/useConnect";
import { LotteryTiles } from "@/components/event/eventLottery/lotteryContent/LotteryTiles";

export const EventLottery = ({}) => {
  const { isConnected } = useConnectWallet();
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

  const currentTime = new Date().getTime();
  const timeForward = currentTime + 4 * 1000;

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

      {isLotteryActive || showWalletConnect ? (
        <LotteryContent disabledPhases={false}>
          {showWalletConnect && !isConnected ? (
            <Flex justifyContent={"center"} w={"100%"}>
              <ConnectEmbed theme={"light"} />
            </Flex>
          ) : (
            <LotteryTiles lotteryData={lotteryData} />
          )}
        </LotteryContent>
      ) : (
        !showWalletConnect && (
          <LotteryCountdown
            startDate={timeForward}
            onLotteryStart={onLotteryStart}
          />
        )
      )}

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

const lotteryData = {
  winners: 1,
  users: 1758,
  tickets: 99,
  lastWinner: 17,
  myNumber: 1758,
  winningChance: 5.6,
};
