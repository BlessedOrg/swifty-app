import { Flex } from "@chakra-ui/react";
import { LotteryCooldownView } from "@/components/event/eventLottery/lotteryContent/LotteryCooldownView";
import { LotteryEndView } from "@/components/event/eventLottery/lotteryContent/LotteryEndView";
import { Auction1 } from "@/components/event/eventLottery/lotteryContent/lotteryViews/Auction1";
import { Auction2 } from "@/components/event/eventLottery/lotteryContent/lotteryViews/Auction2";
import { Lottery1 } from "@/components/event/eventLottery/lotteryContent/lotteryViews/Lottery1";
import { Lottery2 } from "@/components/event/eventLottery/lotteryContent/lotteryViews/Lottery2";
import { SidebarLotteryStats } from "@/components/event/eventLottery/lotteryContent/lotteryTiles/SidebarLotteryStats";

interface IProps {
  instruction?: string;
  lotteryData: any;
  activePhase: IPhaseState | null;
  phasesState?: IPhaseState[] | null;
}

export const LotteryTiles = ({
  lotteryData,
  activePhase,
  phasesState,
}: IProps) => {
  const showCooldown = activePhase?.phaseState?.isCooldown;
  const isLotteryEnd = !phasesState?.filter((i) => !i.phaseState.isFinished)
    ?.length;
  // const isLotteryEnd = false;

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
  return (
    <>
      {showCooldown ? (
        <LotteryCooldownView />
      ) : isLotteryEnd ? (
        <LotteryEndView />
      ) : (
        <Flex
          gap={4}
          justifyContent={"center"}
          alignItems={"center"}
          w={"100%"}
          maxW={"768px"}
        >
          <SidebarLotteryStats
            activePhase={activePhase}
            lotteryData={lotteryData}
          />
          {currentPhaseComponent}
        </Flex>
      )}
    </>
  );
};
