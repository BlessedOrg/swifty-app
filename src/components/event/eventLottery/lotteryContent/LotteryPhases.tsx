import { Flex, Tab } from "@chakra-ui/react";
import Countdown from "react-countdown";
import { createRef, useEffect, useRef } from "react";
import { LotteryPhaseButton } from "@/components/event/eventLottery/lotteryContent/LotteryPhaseButton";
import { usePhases } from "@/hooks/sales/phases/usePhases";
import { useCurrentTime } from "@/hooks/sales/phases/useCurrentTime";

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
}: IProps) => {
  const durationPerPhase = {
    0:
      !!eventData.lotteryV1settings?.enabled &&
      !!eventData.lotteryV1settings.phaseDuration
        ? MINUTE_IN_MILISEC * eventData.lotteryV1settings.phaseDuration
        : 0,
    1:
      !!eventData.lotteryV2settings?.enabled &&
      !!eventData.lotteryV2settings.phaseDuration
        ? MINUTE_IN_MILISEC * eventData.lotteryV2settings.phaseDuration
        : 0,
    2:
      !!eventData.auctionV1settings?.enabled &&
      !!eventData.auctionV1settings.phaseDuration
        ? MINUTE_IN_MILISEC * eventData.auctionV1settings.phaseDuration
        : 0,
    3:
      !!eventData.auctionV2settings?.enabled &&
      !!eventData.auctionV2settings.phaseDuration
        ? MINUTE_IN_MILISEC * eventData.auctionV2settings.phaseDuration
        : 0,
  };
  const activePhasesCount = Object.values(durationPerPhase).filter(
    (i) => i
  ).length;
  const sumOfDurations = Object.values(durationPerPhase).reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );
  const COOLDOWN_TIME_IN_MILISEC =
    eventData.cooldownTimeSeconds * SECOND_IN_MILISEC;

  const { countStartDate, getPhaseState } = usePhases(
    durationPerPhase,
    COOLDOWN_TIME_IN_MILISEC,
    activePhasesCount,
    sumOfDurations
  );

  const endDate =
    lotteryStartDate +
    (sumOfDurations + (activePhasesCount - 1 || 0) * COOLDOWN_TIME_IN_MILISEC);

  const { currentTime } = useCurrentTime(endDate, COOLDOWN_TIME_IN_MILISEC);

  const lotteryPhases = [
    {
      title: "Royale Arena",
      id: 0,
      enabled: eventData.lotteryV1settings?.enabled,
    },
    {
      title: "Click Clacks",
      id: 1,
      enabled: eventData.lotteryV2settings?.enabled,
    },
    {
      title: "Fair Bids",
      id: 2,
      enabled: eventData.auctionV1settings?.enabled,
    },
    {
      title: "Battle Royale",
      id: 3,
      enabled: eventData.auctionV2settings?.enabled,
    },
  ]
    .filter((i) => i?.enabled)
    .map((i, idx) => ({
      title: i.title,
      timestamp: countStartDate(idx, lotteryStartDate).startDate,
      phaseState: getPhaseState(idx, lotteryStartDate, currentTime),
      idx: i.id,
      enabled: !!i?.enabled,
    }));

  const countdownRefs = useRef<Countdown[] | any>(
    Array.from({ length: lotteryPhases.length }, (_) => createRef())
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
      (_, idx) => getPhaseState(idx, lotteryStartDate, currentTime).isActive
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
        {lotteryPhases.map((i, idx) => {
          const { isFinished, isActive, isCooldown } = i.phaseState;

          const DURATION_TIME_IN_MILISEC = durationPerPhase[i.idx];
          const startDate = i.timestamp + DURATION_TIME_IN_MILISEC;

          const btnProps = {
            isCooldown,
            isActive,
            isFinished,
            startDate,
            lotteryStartDate,
            countdownRefs,
            title: i.title,
            disabledPhases:
              disabledPhases || (activePhase?.idx < i.idx && !isSeller),
            DURATION_TIME_IN_MILISEC,
            COOLDOWN_TIME_IN_MILISEC,
            idx: i.idx,
            isDifferentTabThenActiveSale:
              activePhase?.idx !== currentTabPhaseIdx &&
              i?.idx === currentTabPhaseIdx,
            isWindowExpanded,
            durationPerPhase,
            isFirstPhase: idx === 0,
          };
          return (
            <Tab
              isDisabled={activePhase?.idx < i.idx && !isSeller}
              _disabled={{ cursor: "no-drop" }}
              key={idx}
              px={{ base: 2, iwMid: 4 }}
              onClick={() => onTabChange(i.idx)}
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

        const DURATION_TIME_IN_MILISEC = durationPerPhase[i.idx];
        const startDate = i.timestamp + DURATION_TIME_IN_MILISEC;

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
          idx: i.idx,
          isDifferentTabThenActiveSale: false,
          isWindowExpanded,
          durationPerPhase,
          isFirstPhase: idx === 0,
        };
        return <LotteryPhaseButton key={idx} {...btnProps} />;
      })}
    </Flex>
  );
};
