import {Bell, Check, Clover} from "lucide-react";
import { Button, Flex, Text } from "@chakra-ui/react";
import Countdown, { zeroPad } from "react-countdown";
import { useEffect, useState } from "react";
import {RiAuctionLine} from 'react-icons/ri';
export const LotteryPhaseButton = ({
  isActive,
  isFinished,
  isCooldown,
  percentageLeft,
  startDate,
  countdownRefs,
  setProgress,
  title,
  disabledPhases,
  COOLDOWN_TIME_IN_MILISEC,
  idx,
  isDifferentTabThenActiveSale
}) => {

  const [cooldownStartTime, setCooldownStartTime] = useState(null);
  const [isDOM, setIsDOM] = useState(false);
  const bgColor = isCooldown
    ? "rgba(135, 206, 235, 1)"
    : !!isDifferentTabThenActiveSale
      ? "#5F5F5F"
      : isFinished ? "#D3D3D3" : isActive
        ? "#06F881"
        : "#fff";
  const color =
      !!isDifferentTabThenActiveSale
          ? "#06F881" :!isFinished && !isActive ? "#5F5F5F" : isActive ? "#000" : "#000";
  const fontWeight = isActive ? "bold" : "500";

  const iconPerPhase = {
    0: <Clover />,
    1: <Clover />,
    2: <RiAuctionLine fontSize={24}/>,
    3: <RiAuctionLine fontSize={24}/>,
  }
  const buttonIcon = isFinished ? (
    <Check strokeWidth={5} />
  ) : !isActive ? (
      iconPerPhase?.[idx]
  ) : undefined;
  useEffect(() => {
    if (isCooldown && isActive && !cooldownStartTime) {
      setCooldownStartTime(new Date().getTime() + COOLDOWN_TIME_IN_MILISEC);
    }
  }, [isCooldown, isActive]);
  useEffect(() => {
    setIsDOM(true);
  }, [isDOM]);
  return (
    <>
      {isDOM ? (
        <Button
          isDisabled={disabledPhases}
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
          height={"54px"}
          _hover={{}}
          _active={{}}
        >
          {isActive ? (
            <Flex
              bg={isCooldown ? "rgba(135, 206, 235, 1)" : `#D3D3D3`}
              pos={"absolute"}
              top={0}
              left={0}
              w={`${isActive && isCooldown ? 100 : 100 - percentageLeft}%`}
              h={"100%"}
              transition={"all 150ms"}
            />
          ) : null}
          <Flex gap={1} alignItems={"center"} pos={"relative"} zIndex={2}>
            {isActive && !isCooldown ? (
              <>
                <Countdown
                  ref={(ref: any) => (countdownRefs.current[idx] = ref)}
                  date={startDate}
                  renderer={renderer}
                  onStart={(e) => {
                    setProgress(e);
                  }}
                  onTick={(e) => {
                    // console.log(e);
                    setProgress(e);
                  }}
                  onComplete={() => {
                    setProgress({ total: 100 });
                  }}
                  zeroPadTime={2}
                >
                  <></>
                </Countdown>
                {title}
              </>
            ) : isCooldown && isActive && cooldownStartTime ? (
              <Flex gap={2} alignItems={"center"}>
                <Countdown
                  ref={(ref: any) => (countdownRefs.current[idx] = ref)}
                  date={cooldownStartTime}
                  renderer={renderer}
                  onStart={(e) => {
                    setProgress(e);
                  }}
                  onTick={(e) => {
                    setProgress(e);
                  }}
                  onComplete={() => {
                    setProgress({ total: 100 });
                  }}
                  zeroPadTime={2}
                >
                  <></>
                </Countdown>
                <Flex flexDirection={"column"} textAlign={"left"}>
                  <Text fontWeight={"bold"}>Cooldown</Text>
                  <Text fontWeight={400}>{title}</Text>
                </Flex>
              </Flex>
            ) : (
              title
            )}
          </Flex>
        </Button>
      ) : null}
    </>
  );
};

const renderer = ({ minutes, seconds, completed, fontSize = "1rem" }) => {
  if (completed) {
    return "";
  } else {
    return (
      <Text style={{ fontVariantNumeric: "tabular-nums" }} fontSize={fontSize}>
        {zeroPad(minutes)}:{zeroPad(seconds)}
      </Text>
    );
  }
};
