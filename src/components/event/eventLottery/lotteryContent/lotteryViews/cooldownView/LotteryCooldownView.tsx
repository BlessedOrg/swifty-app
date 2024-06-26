import { CooldownCard } from "@/components/event/eventLottery/lotteryContent/lotteryViews/cooldownView/CooldownCard";
import FlippableCard from "@/components/flipCard/FlippableCard";
import { useState } from "react";
import { LotterySlider } from "@/components/event/eventLottery/lotteryContent/lotteryViews/lotterySlider/LotterySlider";

export const LotteryCooldownView = ({
  eventData,
  isLotteryActive,
  activePhase,
  currentTabId,
  withdrawView,
}: {
  eventData: IEvent;
  isLotteryActive: boolean;
  activePhase: any;
  currentTabId: string;
  withdrawView?: boolean;
}) => {
  const [showFront, setShowFront] = useState(true);

  const toggleColdownAndSliderView = () => {
    setShowFront((prev) => !prev);
  };

  return (
    <FlippableCard
      gap={4}
      justifyContent={"center"}
      alignItems={"center"}
      w={"100%"}
      maxW={"856px"}
      showFront={showFront}
      front={
        <CooldownCard
          toggleFlipView={toggleColdownAndSliderView}
          isLotteryActive={isLotteryActive}
          activePhase={activePhase}
          cooldownTimeInSec={eventData.cooldownTimeSeconds}
          currentTabId={currentTabId}
        />
      }
      back={
        <LotterySlider
          eventData={eventData}
          toggleFlipView={toggleColdownAndSliderView}
          currentTabId={currentTabId}
        />
      }
    />
  );
};
