"use client";
import { Flex } from "@chakra-ui/react";
import { LotteryPhases } from "@/components/event/eventLottery/lotteryContent/LotteryPhases";
import { ConnectEmbed } from "@thirdweb-dev/react";
import { useEffect, useState } from "react";
import { Lottery1 } from "@/components/event/eventLottery/lotteryContent/lotteryViews/phases/Lottery1";
import { Lottery2 } from "@/components/event/eventLottery/lotteryContent/lotteryViews/phases/Lottery2";
import { Auction1 } from "@/components/event/eventLottery/lotteryContent/lotteryViews/phases/Auction1";
import { Auction2 } from "@/components/event/eventLottery/lotteryContent/lotteryViews/phases/auction2/Auction2";
import { SidebarLotteryStats } from "@/components/event/eventLottery/lotteryContent/lotteryViews/lotteryTiles/SidebarLotteryStats";
import { LotteryEndView } from "@/components/event/eventLottery/lotteryContent/lotteryViews/LotteryEndView";
import { LotteryCooldownView } from "@/components/event/eventLottery/lotteryContent/lotteryViews/cooldownView/LotteryCooldownView";
import FlippableCard from "@/components/flipCard/FlippableCard";
import { WithdrawView } from "@/components/event/eventLottery/lotteryContent/lotteryViews/WithdrawView";

interface IProps {
  disabledPhases?: boolean;
  startDate: number | Date;
  showWalletConnect: boolean;
  lotteryData: any;
  activePhase: IPhaseState | null;
  phasesState: IPhaseState[] | null;
  setActivePhase: any;
  setPhasesState: any;
  showWithdrawWindow: boolean;
  isLotteryEnded: boolean;
}
export const LotteryContent = ({
  disabledPhases,
  startDate,
  showWalletConnect,
  lotteryData,
  activePhase,
  phasesState,
  setActivePhase,
  setPhasesState,
  showWithdrawWindow,
  isLotteryEnded,
}: IProps) => {
  const commonProps = {
    activePhase,
    lotteryData,
  };
  const phaseViews = {
    0: <Lottery1 {...commonProps} />,
    1: <Lottery2 {...commonProps} />,
    2: <Auction1 {...commonProps} />,
    3: <Auction2 {...commonProps} />,
  };
  const currentPhaseComponent =
    typeof activePhase?.idx === "number" ? (
      phaseViews[activePhase.idx]
    ) : (
      <Lottery1 {...commonProps} />
    );

  const [showFront, setShowFront] = useState(true);

  useEffect(() => {
    if (!activePhase && !isLotteryEnded) {
      setShowFront(true);
    }
    if (!isLotteryEnded && activePhase) {
      if (activePhase?.phaseState?.isCooldown && showFront) {
        setShowFront(false);
      } else if (!activePhase?.phaseState?.isCooldown && !showFront) {
        setShowFront(true);
      }
    }

    if (isLotteryEnded) {
      setShowFront(false);
    }
  }, [activePhase, isLotteryEnded]);
  return (
    <Flex
      flexDirection={"column"}
      w={"100%"}
      h={"100%"}
      gap={10}
      bg={"#fff"}
      p={4}
      rounded={"8px"}
      alignItems={"center"}
    >
      <LotteryPhases
        disabledPhases={disabledPhases}
        startDate={startDate}
        setActivePhase={setActivePhase}
        setPhasesState={setPhasesState}
      />

      {!showWalletConnect && showWithdrawWindow && <WithdrawView />}
      {showWalletConnect && (
        <Flex justifyContent={"center"} w={"100%"}>
          <ConnectEmbed theme={"light"} />
        </Flex>
      )}
      {/*<Flex*/}
      {/*  gap={4}*/}
      {/*  justifyContent={"center"}*/}
      {/*  alignItems={"center"}*/}
      {/*  w={"100%"}*/}
      {/*  maxW={"768px"}*/}
      {/*>*/}
      {/*  <LotteryCooldownView />*/}
      {/*</Flex>*/}
      {!showWalletConnect && !showWithdrawWindow && (
        <FlippableCard
          gap={4}
          justifyContent={"center"}
          alignItems={"center"}
          w={"100%"}
          maxW={"768px"}
          showFront={showFront}
          front={
            <>
              {!isLotteryEnded && (
                <>
                  <SidebarLotteryStats
                    activePhase={activePhase}
                    lotteryData={lotteryData}
                  />
                  {currentPhaseComponent}
                </>
              )}
            </>
          }
          back={isLotteryEnded ? <LotteryEndView /> : <LotteryCooldownView />}
        />
      )}
    </Flex>
  );
};
