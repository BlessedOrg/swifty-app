import { Flex, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { LargeTile } from "../components/LargeTile";
import { InstructionTile } from "@/components/event/eventLottery/lotteryContent/lotteryViews/components/InstructionTile";
import Countdown, { zeroPad } from "react-countdown";
import { Slider } from "@/components/slider/Slider";

interface IProps {
  lotteryData: any;
  activePhase: IPhaseState | null;
}

export const Auction1 = ({ lotteryData, activePhase }: IProps) => {
  const [startDate] = useState(Date.now() + 10000);

  return (
    <Flex
      gap={4}
      justifyContent={"center"}
      alignItems={"center"}
      w={"100%"}
      maxW={"768px"}
    >
      <Flex gap={4} w={"100%"} flexDirection={"column"} rounded={"24px"}>
        <Flex overflow={"hidden"} h={"300px"} w={"100%"} maxW={"622px"}>
          {activePhase?.phaseState.isActive &&
            !activePhase?.phaseState.isCooldown && (
              <Slider slider={[1, 2, 3]} />
            )}
        </Flex>

        <Flex gap={4}>
          <Flex
            flexDirection={"column"}
            w={"300px"}
            h={"120px"}
            bg={
              "linear-gradient(180deg, #22C55E 0%, #37AE99 100%), linear-gradient(180deg, #9977D4 0%, #6337AE 100%), linear-gradient(180deg, #666 0%, #000 100%)"
            }
            rounded={"8px"}
            alignItems={"center"}
            gap={1}
            px={"30px"}
            py={"10px"}
            color={"#fff"}
            style={{
              boxShadow:
                "0px 2px 4px 0px rgba(99, 55, 174, 0.25) inset, 0px 4px 6px -1px rgba(99, 55, 174, 0.25), 0px 4px 6px -1px rgba(99, 55, 174, 0.25)",
            }}
          >
            <Text as={"span"}>1st Round</Text>{" "}
            <Countdown
              renderer={renderer}
              date={startDate}
              autoStart={true}
              zeroPadTime={2}
              zeroPadDays={2}
            >
              <Text>Cooldown</Text>
            </Countdown>
          </Flex>
          <InstructionTile
            activePhase={activePhase}
            lotteryData={lotteryData}
          />
        </Flex>
      </Flex>
    </Flex>
  );
};

const renderer = ({ minutes, seconds, completed }) => {
  if (completed) {
    return (
      <Text fontSize={"1.5rem"} fontWeight={"bold"}>
        Cooldown...
      </Text>
    );
  } else {
    return (
      <Text
        style={{ fontVariantNumeric: "tabular-nums" }}
        fontSize={"3rem"}
        fontWeight={"bold"}
      >
        {zeroPad(minutes)}:{zeroPad(seconds)}
      </Text>
    );
  }
};
