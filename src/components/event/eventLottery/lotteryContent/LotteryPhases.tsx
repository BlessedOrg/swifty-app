import { Flex, Tab } from "@chakra-ui/react";
import Countdown from "react-countdown";
import { createRef, useEffect, useRef } from "react";
import { LotteryPhaseButton } from "@/components/event/eventLottery/lotteryContent/LotteryPhaseButton";
import { usePhaseProgress } from "@/hooks/sales/phases/usePhaseProgress";
import { usePhases } from "@/hooks/sales/phases/usePhases";
import { useCurrentTime } from "@/hooks/sales/phases/useCurrentTime";

const MINUTE_IN_MILISEC = 60000;
const SECOND_IN_MILISEC = 1000;

const DUMMY_DURATION_TIME_MIN = 0.1;
const DUMMY_COOLDOWN_TIME_SEC = 15;

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
  isWindowExpanded
}: IProps) => {
  const durationPerPhase = {
    0: eventData.lotteryV1settings.phaseDuration,
    1: eventData.lotteryV2settings.phaseDuration,
    2: eventData.auctionV1settings.phaseDuration,
    3: eventData.auctionV2settings.phaseDuration,
  };

  //TODO fix phase auto change when is operating on api data
  // const COOLDOWN_TIME_IN_MILISEC =
  //   eventData.cooldownTimeSeconds * SECOND_IN_MILISEC;
  // const DURATION_TIME_IN_MILISEC =
  //   MINUTE_IN_MILISEC * durationPerPhase[activePhase?.idx] || MINUTE_IN_MILISEC*10;

  const COOLDOWN_TIME_IN_MILISEC = DUMMY_COOLDOWN_TIME_SEC * SECOND_IN_MILISEC;
  const DURATION_TIME_IN_MILISEC = MINUTE_IN_MILISEC * DUMMY_DURATION_TIME_MIN;
  const { countStartDate, getPhaseState } = usePhases(
    DURATION_TIME_IN_MILISEC,
    COOLDOWN_TIME_IN_MILISEC,
  );
  const { currentTime } = useCurrentTime(
    lotteryStartDate +
      (4 * DURATION_TIME_IN_MILISEC + 3 * COOLDOWN_TIME_IN_MILISEC),
    COOLDOWN_TIME_IN_MILISEC,
  );

  const { percentageLeft, updateProgress } = usePhaseProgress(
    DURATION_TIME_IN_MILISEC,
    COOLDOWN_TIME_IN_MILISEC,
  );

  const lotteryPhases = [
    {
      title: "Lottery 1",
      id: 0,
    },
    {
      title: "Lottery 2",
      id: 1,
    },
    {
      title: "Auction 1",
      id: 2,
    },
    {
      title: "Auction 2",
      id: 3,
    },
  ].map((i, idx) => ({
    title: i.title,
    timestamp: countStartDate(idx, lotteryStartDate),
    phaseState: getPhaseState(idx, lotteryStartDate, currentTime),
    idx: i.id,
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
      (_, idx) => getPhaseState(idx, lotteryStartDate, currentTime).isActive,
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
          const startDate = i.timestamp;
          const { isFinished, isActive, isCooldown } = i.phaseState;

          const btnProps = {
            isCooldown,
            isActive,
            isFinished,
            startDate,
            percentageLeft,
            countdownRefs,
            title: i.title,
            disabledPhases:
              disabledPhases || (activePhase?.idx < idx && !isSeller),
            DURATION_TIME_IN_MILISEC,
            COOLDOWN_TIME_IN_MILISEC,
            idx,
            setProgress: updateProgress,
            isDifferentTabThenActiveSale: activePhase?.idx !== currentTabPhaseIdx && i?.idx === currentTabPhaseIdx,
            isWindowExpanded
          };
          return (
            <Tab
              isDisabled={activePhase?.idx < idx && !isSeller}
              _disabled={{ cursor: "no-drop" }}
              key={idx}
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
        const startDate = i.timestamp;
        const { isFinished, isActive, isCooldown } = i.phaseState;

        const btnProps = {
          isCooldown,
          isActive,
          isFinished,
          startDate,
          percentageLeft,
          countdownRefs,
          title: i.title,
          disabledPhases,
          DURATION_TIME_IN_MILISEC,
          COOLDOWN_TIME_IN_MILISEC,
          idx,
          setProgress: updateProgress,
          isDifferentTabThenActiveSale: false,
          isWindowExpanded
        };
        return <LotteryPhaseButton key={idx} {...btnProps} />;
      })}
    </Flex>
  );
};
