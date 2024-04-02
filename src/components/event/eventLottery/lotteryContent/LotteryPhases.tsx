import { Flex } from "@chakra-ui/react";
import Countdown from "react-countdown";
import { createRef, useEffect, useRef } from "react";
import { LotteryPhaseButton } from "@/components/event/eventLottery/lotteryContent/LotteryPhaseButton";
import { usePhaseProgress } from "@/hooks/lottery/usePhaseProgress";
import { usePhases } from "@/hooks/lottery/usePhases";
import { useCurrentTime } from "@/hooks/lottery/useCurrentTime";

const MINUTE_IN_MILISEC = 60000;
const SECOND_IN_MILISEC = 1000;

const DURATION_TIME_IN_MIN = 0.25;
const DURATION_TIME_IN_MILISEC = MINUTE_IN_MILISEC * DURATION_TIME_IN_MIN;

const COOLDOWN_TIME_IN_SEC = 5;
const COOLDOWN_TIME_IN_MILISEC = COOLDOWN_TIME_IN_SEC * SECOND_IN_MILISEC;

export const LotteryPhases = ({
  startDate: lotteryStartDate,
  disabledPhases,
  setActivePhase,
  setPhasesState,
}) => {
  const { countStartDate, getPhaseState } = usePhases(
    DURATION_TIME_IN_MILISEC,
    COOLDOWN_TIME_IN_MILISEC,
  );
  const { currentTime } = useCurrentTime(
    countStartDate(3, lotteryStartDate),
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

  useEffect(() => {
    const currentPhase = lotteryPhases.find(
      (_, idx) => getPhaseState(idx, lotteryStartDate, currentTime).isActive,
    );
    if (!!currentPhase) {
      setActivePhase(currentPhase);
    } else {
      setActivePhase(null);
    }
    setPhasesState(lotteryPhases);
  }, [currentTime]);

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
          idx,
          setProgress: updateProgress,
        };
        return <LotteryPhaseButton key={idx} {...btnProps} />;
      })}
    </Flex>
  );
};
