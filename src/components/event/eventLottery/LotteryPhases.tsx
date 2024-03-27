import { Bell, Check } from "lucide-react";
import { Button, Flex, Text } from "@chakra-ui/react";
import Countdown from "react-countdown";
import { useEffect, useRef, useState } from "react";

export const LotteryPhases = ({
  startDates,
  percentageLeft,
  setProgress,
  disabledPhases,
  DURATION_TIME_IN_MILISEC,
  COOLDOWN_TIME_IN_MILISEC,
}) => {
  const countdownRef = useRef<Countdown>(null);
  const [currentTime, setCurrentTime] = useState(Date.now());

  const [activePhase, setActivePhase] = useState<number | null>(null);
  const [endedPhases, setEndedPhases] = useState<number[] | null>(null);
  const onCountdownStart = () => {
    countdownRef?.current?.start();
  };
  const lotteryPhases = [
    {
      title: "Lottery 1",
      timestamp: startDates[0],
    },
    {
      title: "Lottery 2",
      timestamp: startDates[1],
    },
    {
      title: "Auction 1",
      timestamp: startDates[2],
    },
    {
      title: "Auction 2",
      timestamp: startDates[3],
    },
  ];

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(Date.now());
      if (
        Date.now() >
        lotteryPhases[3].timestamp + COOLDOWN_TIME_IN_MILISEC + 1000
      ) {
        clearInterval(intervalId);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const findCurrent = lotteryPhases.find((i, idx) => {
      const endTime = i.timestamp;
      if (
        currentTime <= endTime &&
        endTime - currentTime < DURATION_TIME_IN_MILISEC
      ) {
        setActivePhase(idx);
        return true;
      } else return false;
    });
    if (!findCurrent) {
      setActivePhase(null);
    }
    const findEnded = lotteryPhases
      .filter((i, idx) => currentTime > i.timestamp)
      .map((i, idx) => idx);
    setEndedPhases(findEnded);

    console.log(findCurrent, findEnded);
  }, [currentTime]);
  return (
    <Flex gap={3} justifyContent={"space-between"} maxW={"768px"}>
      {lotteryPhases.map((i, idx) => {
        const endTime = i.timestamp;
        const isActive = disabledPhases
          ? false
          : currentTime <= endTime &&
            endTime - currentTime < DURATION_TIME_IN_MILISEC;

        const isFinished = disabledPhases ? false : currentTime > endTime;
        const bgColor = isFinished ? "#EEEEEE" : isActive ? "#154F51" : "#fff";
        const color = isActive ? "#fff" : "#ACABAB";
        const fontWeight = isActive ? "bold" : "500";

        const buttonIcon = isFinished ? (
          <Check strokeWidth={5} />
        ) : !isActive ? (
          <Bell strokeWidth={2} />
        ) : undefined;

        return (
          <Button
            isDisabled={disabledPhases}
            key={idx}
            leftIcon={buttonIcon}
            bg={bgColor}
            fontWeight={fontWeight}
            color={color}
            fontSize={"1rem"}
            px={"24px"}
            py={3.5}
            h={"auto"}
            pos={"relative"}
            w={"180px"}
            border={"1px solid"}
            borderColor={"#D3D3D3"}
            rounded={"8px"}
            overflow={"hidden"}
            _hover={{}}
            _active={{}}
          >
            {isActive && (
              <Flex
                bg={"linear-gradient(180deg, #22C55E 0%, #37AE99 100%)"}
                pos={"absolute"}
                top={0}
                left={0}
                w={`${percentageLeft}%`}
                h={"100%"}
                transition={"all 150ms"}
              />
            )}
            <Flex gap={1} alignItems={"center"} pos={"relative"} zIndex={2}>
              {isActive && (
                <Countdown
                  ref={countdownRef}
                  date={i.timestamp}
                  renderer={renderer}
                  onStart={(e) => {
                    setProgress(e);
                  }}
                  onTick={(e) => {
                    console.log(e);
                    setProgress(e);
                  }}
                  onComplete={() => {
                    setProgress({ total: 100 });
                  }}
                  autoStart={true}
                >
                  <></>
                </Countdown>
              )}
              {i.title}
            </Flex>
          </Button>
        );
      })}
    </Flex>
  );
};

const renderer = ({ minutes, seconds, completed }) => {
  if (completed) {
    return null;
  } else {
    return (
      <Text style={{ fontVariantNumeric: "tabular-nums" }}>
        {minutes}:{seconds}
      </Text>
    );
  }
};
