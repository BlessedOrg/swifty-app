"use client";
import { Flex } from "@chakra-ui/react";
import { CountdownTimeDelta } from "react-countdown";
import { useEffect, useState } from "react";
import { LotteryPhases } from "@/components/event/eventLottery/LotteryPhases";

const MINUTE_IN_MILISEC = 60000;
const SECOND_IN_MILISEC = 1000;

const DURATION_TIME_IN_MIN = 0.05;
const DURATION_TIME_IN_MILISEC = MINUTE_IN_MILISEC * DURATION_TIME_IN_MIN;

const COOLDOWN_TIME_IN_SEC = 2;
const COOLDOWN_TIME_IN_MILISEC = COOLDOWN_TIME_IN_SEC * SECOND_IN_MILISEC;
export const LotteryContent = ({ children, disabledPhases }: any) => {
  const [currentTime, setCurrentTime] = useState(
    Date.now() + SECOND_IN_MILISEC * 2,
  );

  const activeTime = currentTime + DURATION_TIME_IN_MILISEC;

  const startDates = {
    0: activeTime,
    1: activeTime + DURATION_TIME_IN_MILISEC + COOLDOWN_TIME_IN_MILISEC,
    2: activeTime + (DURATION_TIME_IN_MILISEC + COOLDOWN_TIME_IN_MILISEC) * 2,
    3: activeTime + (DURATION_TIME_IN_MILISEC + COOLDOWN_TIME_IN_MILISEC) * 3,
  };

  const [progress, setProgress] = useState<
    CountdownTimeDelta | { total: number }
  >({ total: DURATION_TIME_IN_MILISEC });
  const [percentageLeft, setPercentageLeft] = useState(100);

  useEffect(() => {
    const timeLeftInPercentage =
      ((DURATION_TIME_IN_MILISEC - progress.total) / DURATION_TIME_IN_MILISEC) *
      100;
    setPercentageLeft(100 - +timeLeftInPercentage);
    // console.log(DURATION_TIME_IN_MILISEC + " - " + progress.total);
    // console.log(100 - +timeLeftInPercentage + " - " + timeLeftInPercentage);
    if (timeLeftInPercentage === 0) {
      const timeoutId = setTimeout(() => {
        setPercentageLeft(100);
      }, COOLDOWN_TIME_IN_MILISEC);

      return () => clearTimeout(timeoutId);
    }
  }, [progress]);

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
        setProgress={setProgress}
        percentageLeft={percentageLeft}
        startDates={startDates}
        DURATION_TIME_IN_MILISEC={DURATION_TIME_IN_MILISEC}
        COOLDOWN_TIME_IN_MILISEC={COOLDOWN_TIME_IN_MILISEC}
      />
      {children}
    </Flex>
  );
};
