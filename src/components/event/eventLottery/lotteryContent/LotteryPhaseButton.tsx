import { Bell, Check } from "lucide-react";
import { Button, Flex, Text } from "@chakra-ui/react";
import Countdown from "react-countdown";

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
  DURATION_TIME_IN_MILISEC,
  idx,
}) => {
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
          bg={`${
            isActive && isCooldown
              ? "linear-gradient(180deg, #18a14b 0%, #2c9380 100%)"
              : "linear-gradient(180deg, #22C55E 0%, #37AE99 100%)"
          }`}
          pos={"absolute"}
          top={0}
          left={0}
          w={`${isActive && isCooldown ? 100 : percentageLeft}%`}
          h={"100%"}
          transition={"all 150ms"}
        />
      )}
      <Flex gap={1} alignItems={"center"} pos={"relative"} zIndex={2}>
        {isActive && !isCooldown && (
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
          >
            <></>
          </Countdown>
        )}
        {isActive &&
          isCooldown &&
          millisecondsToMinutesAndSeconds(DURATION_TIME_IN_MILISEC)}
        {title}
      </Flex>
    </Button>
  );
};

const renderer = ({ minutes, seconds, completed }) => {
  if (completed) {
    return "";
  } else {
    return (
      <Text style={{ fontVariantNumeric: "tabular-nums" }}>
        {minutes}:{seconds}
      </Text>
    );
  }
};
function millisecondsToMinutesAndSeconds(milliseconds) {
  const totalSeconds = Math.floor(milliseconds / 1000);

  const minutes = Math.floor(totalSeconds / 60);

  const seconds = totalSeconds % 60;

  const formattedTime = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

  return `${formattedTime} `;
}
