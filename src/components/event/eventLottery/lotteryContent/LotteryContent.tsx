"use client";
import { Flex } from "@chakra-ui/react";
import { LotteryPhases } from "@/components/event/eventLottery/lotteryContent/LotteryPhases";
import { ConnectEmbed } from "@thirdweb-dev/react";
import { LotteryTiles } from "@/components/event/eventLottery/lotteryContent/lotteryTiles/LotteryTiles";
import { useState } from "react";

export const LotteryContent = ({
  disabledPhases,
  startDate,
  showWalletConnect,
  lotteryData,
}: any) => {
  //hardcoded phase for tests
  // const [activePhase] = useState<IPhaseState | null>({
  //   idx: 1,
  //   phaseState: { isActive: true, isFinished: false, isCooldown: false },
  //   title: "TEST MODE",
  //   timestamp: 123,
  // });
  // const setActivePhase = () => {};
  const [activePhase, setActivePhase] = useState<IPhaseState | null>(null);
  const [phasesState, setPhasesState] = useState<IPhaseState[] | null>(null);

  return (
    <Flex
      flexDirection={"column"}
      w={"100%"}
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
      {showWalletConnect ? (
        <Flex justifyContent={"center"} w={"100%"}>
          <ConnectEmbed theme={"light"} />
        </Flex>
      ) : (
        <LotteryTiles
          lotteryData={lotteryData}
          activePhase={activePhase}
          phasesState={phasesState}
        />
      )}
    </Flex>
  );
};
