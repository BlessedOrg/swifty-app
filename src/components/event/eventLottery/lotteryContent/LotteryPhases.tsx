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
}: IProps) => {
  const durationPerPhase = {
    0:
      MINUTE_IN_MILISEC * eventData.lotteryV1settings.phaseDuration ||
      MINUTE_IN_MILISEC * 2,
    1:
      MINUTE_IN_MILISEC * eventData.lotteryV2settings.phaseDuration ||
      MINUTE_IN_MILISEC * 2,
    2:
      MINUTE_IN_MILISEC * eventData.auctionV1settings.phaseDuration ||
      MINUTE_IN_MILISEC * eventData.lotteryV1settings.phaseDuration,
    3:
      MINUTE_IN_MILISEC * eventData.auctionV2settings.phaseDuration ||
      MINUTE_IN_MILISEC * 2,
  };
  const COOLDOWN_TIME_IN_MILISEC =
    eventData.cooldownTimeSeconds * SECOND_IN_MILISEC;
  const DURATION_TIME_IN_MILISEC =
    MINUTE_IN_MILISEC * durationPerPhase[activePhase?.idx] ||
    durationPerPhase[0];

  const { countStartDate, getPhaseState } = usePhases(
    durationPerPhase,
    COOLDOWN_TIME_IN_MILISEC,
  );
  const endDate =
    lotteryStartDate +
    (durationPerPhase[0] +
      durationPerPhase[1] +
      durationPerPhase[2] +
      durationPerPhase[3] +
      3 * COOLDOWN_TIME_IN_MILISEC);

  const { currentTime } = useCurrentTime(endDate, COOLDOWN_TIME_IN_MILISEC);

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
    timestamp: countStartDate(idx, lotteryStartDate).startDate,
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
          const { isFinished, isActive, isCooldown } = i.phaseState;

          const DURATION_TIME_IN_MILISEC = durationPerPhase[idx];
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
              disabledPhases || (activePhase?.idx < idx && !isSeller),
            DURATION_TIME_IN_MILISEC,
            COOLDOWN_TIME_IN_MILISEC,
            idx,
            isDifferentTabThenActiveSale:
              activePhase?.idx !== currentTabPhaseIdx &&
              i?.idx === currentTabPhaseIdx,
            isWindowExpanded,
            durationPerPhase,
          };
          return (
            <Tab
              isDisabled={activePhase?.idx < idx && !isSeller}
              _disabled={{ cursor: "no-drop" }}
              key={idx}
              px={{ base: 2, iwMid: 4 }}
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
        };
        return <LotteryPhaseButton key={idx} {...btnProps} />;
      })}
    </Flex>
  );
};
