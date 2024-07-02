import { Flex, Tab, Text } from "@chakra-ui/react";
import Countdown from "react-countdown";
import { createRef, useEffect, useRef } from "react";
import { LotteryPhaseButton } from "@/components/event/eventLottery/lotteryContent/LotteryPhaseButton";
import { usePhases } from "@/hooks/sales/phases/usePhases";
import { useCurrentTime } from "@/hooks/sales/phases/useCurrentTime";
import { ILotteryV1 } from "@/hooks/sales/useLotteryV1";
import { ILotteryV2 } from "@/hooks/sales/useLotteryV2";
import { IAuctionV1 } from "@/hooks/sales/useAuctionV1";
import { IAuctionV2 } from "@/hooks/sales/useAuctionV2";
import { saleIdPerIdx } from "@/components/event/eventLottery/EventLottery";

const MINUTE_IN_MILISEC = 60000;
const SECOND_IN_MILISEC = 1000;

interface IProps {
  startDate: any;
  disabledPhases: any;
  setActivePhase: any;
  setPhasesState: any;
  activePhase: any;
  phasesState: any;
  eventData: any;
  singleTiles?: boolean;
  isSeller?: boolean;
  currentTabPhaseIdx?: number;
  isWindowExpanded?: boolean;
  onTabChange: (e: number) => void;
  salesData?: ISaleData;
}

export const LotteryPhases = ({
  startDate: lotteryStartDate,
  disabledPhases,
  setActivePhase,
  setPhasesState,
  activePhase,
  phasesState,
  eventData,
  singleTiles,
  isSeller,
  currentTabPhaseIdx,
  isWindowExpanded,
  onTabChange,
  salesData,
}: IProps) => {
  const settings = [
    eventData.lotteryV1settings,
    eventData.lotteryV2settings,
    eventData.auctionV1settings,
    eventData.auctionV2settings,
  ];

  const enabledPhases = settings.filter(
    (i) => !!i?.enabled && i.phaseDuration !== 0,
  );
  const durationPerPhase: { [key: number]: number } = enabledPhases.reduce(
    (acc, phase, index) => {
      acc[index] = MINUTE_IN_MILISEC * phase.phaseDuration;
      return acc;
    },
    {},
  );
  const activePhasesCount = Object.values(durationPerPhase).filter(
    (i) => i,
  ).length;
  const sumOfDurations = Object.values(durationPerPhase).reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0,
  );
  const COOLDOWN_TIME_IN_MILISEC =
    eventData.cooldownTimeSeconds * SECOND_IN_MILISEC;

  const { countStartDate, getPhaseState } = usePhases(
    durationPerPhase,
    COOLDOWN_TIME_IN_MILISEC,
    activePhasesCount,
    sumOfDurations,
  );

  const endDate =
    lotteryStartDate +
    (sumOfDurations + (activePhasesCount - 1 || 0) * COOLDOWN_TIME_IN_MILISEC);

  const { currentTime } = useCurrentTime(endDate, COOLDOWN_TIME_IN_MILISEC);

  const phases = [
    {
      title: "Royale Arena",
      idx: 0,
      enabled: eventData.lotteryV1settings?.enabled,
    },
    {
      title: "Click Clacks",
      idx: 1,
      enabled: eventData.lotteryV2settings?.enabled,
    },
    {
      title: "Fair Bids",
      idx: 2,
      enabled: eventData.auctionV1settings?.enabled,
    },
    {
      title: "Battle Royale",
      idx: 3,
      enabled: eventData.auctionV2settings?.enabled,
    },
  ].filter((i) => i?.enabled);

  const lotteryPhases = phases.map((item, idx) => ({
    title: item.title,
    timestamp: countStartDate(idx, lotteryStartDate).startDate,
    timestamp1: countStartDate(idx, lotteryStartDate).saleEndDate,
    phaseState: getPhaseState(
      idx,
      lotteryStartDate,
      currentTime,
      idx === phases.length - 1,
    ),
    idx: idx,
    enabled: !!item?.enabled,
  }));

  const countdownRefs = useRef<Countdown[] | any>(
    Array.from({ length: lotteryPhases.length }, (_) => createRef()),
  );

  const checkIsPhasesUpdateNeeded = (phases) => {
    if (!phasesState) {
      return true;
    }
    for (let i = 0; i < phases.length; i++) {
      const phase1 = phases[i];
      const phase2 = phasesState[i];

      if (
        phase1.phaseState.isActive !== phase2.phaseState.isActive ||
        phase1.phaseState.isFinished !== phase2.phaseState.isFinished ||
        phase1.phaseState.isCooldown !== phase2.phaseState.isCooldown
      ) {
        return true;
      }
    }
    return false;
  };

  const checkIsCurrentPhaseChanged = (currentPhase) => {
    if (
      currentPhase?.phaseState?.isActive !==
        activePhase?.phaseState?.isActive ||
      currentPhase?.phaseState?.isFinished !==
        activePhase?.phaseState?.isFinished ||
      currentPhase?.phaseState?.isCooldown !==
        activePhase?.phaseState?.isCooldown ||
      currentPhase?.idx !== activePhase?.idx
    ) {
      return true;
    }
    return false;
  };

  useEffect(() => {
    const currentPhase = lotteryPhases.find(
      (_, idx) =>
        getPhaseState(
          idx,
          lotteryStartDate,
          currentTime,
          idx === phases.length - 1,
        ).isActive,
    );
    if (!!currentPhase && checkIsCurrentPhaseChanged(currentPhase)) {
      setActivePhase(currentPhase);
    } else if (!currentPhase && activePhase) {
      setActivePhase(null);
    }
    if (checkIsPhasesUpdateNeeded(lotteryPhases)) {
      setPhasesState(lotteryPhases);
    }
  }, [currentTime]);

  if (singleTiles) {
    return (
      <>
        {lotteryPhases.map((item, idx) => {
          const { isFinished, isActive, isCooldown } = item.phaseState;

          const DURATION_TIME_IN_MILISEC = durationPerPhase[idx];
          const startDate = item.timestamp + DURATION_TIME_IN_MILISEC;
          const isWinner = salesData?.[saleIdPerIdx[idx]]?.saleData?.isWinner;

          const btnProps = {
            isCooldown,
            isActive,
            isFinished,
            startDate,
            lotteryStartDate,
            countdownRefs,
            title: item.title,
            disabledPhases:
              disabledPhases || (activePhase?.idx < idx && !isSeller),
            DURATION_TIME_IN_MILISEC,
            COOLDOWN_TIME_IN_MILISEC,
            idx,
            isDifferentTabThenActiveSale:
              activePhase?.idx !== currentTabPhaseIdx &&
              idx === currentTabPhaseIdx,
            isWindowExpanded,
            durationPerPhase,
            isFirstPhase: idx === 0,
            isWinner,
          };
          return (
            <Tab
              isDisabled={activePhase?.idx < idx && !isSeller}
              _disabled={{ cursor: "no-drop" }}
              key={idx}
              px={{ base: 2, iwMid: 4 }}
              onClick={() => onTabChange(idx)}
            >
              <LotteryPhaseButton {...btnProps} />
            </Tab>
          );
        })}
      </>
    );
  }
  return (
    <Flex gap={3} justifyContent={"space-between"} maxW={"768px"}>
      {lotteryPhases.map((i, idx) => {
        const { isFinished, isActive, isCooldown } = i.phaseState;

        const DURATION_TIME_IN_MILISEC = durationPerPhase[idx];
        const startDate = i.timestamp + DURATION_TIME_IN_MILISEC;
        const isWinner = salesData?.[saleIdPerIdx[idx]]?.saleData?.isWinner;
        const btnProps = {
          isCooldown,
          isActive,
          isFinished,
          startDate,
          countdownRefs,
          title: i.title,
          disabledPhases,
          lotteryStartDate,
          DURATION_TIME_IN_MILISEC,
          COOLDOWN_TIME_IN_MILISEC,
          idx,
          isDifferentTabThenActiveSale: false,
          isWindowExpanded,
          durationPerPhase,
          isFirstPhase: idx === 0,
          isWinner,
        };
        return <LotteryPhaseButton key={idx} {...btnProps} />;
      })}
    </Flex>
  );
};
