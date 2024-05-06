import { Flex, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import Countdown, { zeroPad } from "react-countdown";
import { LargeTile } from "@/components/event/eventLottery/lotteryContent/lotteryViews/components/LargeTile";
import { LightDescriptionCard } from "@/components/event/eventLottery/lotteryContent/lotteryViews/components/LightDescriptionCard";
import { LotteryStats } from "@/components/event/eventLottery/lotteryContent/lotteryViews/lotteryTiles/LotteryStats";
import { FlipButton } from "@/components/event/eventLottery/lotteryContent/lotteryViews/components/FlipButton";
import { ILotteryView } from "@/components/event/eventLottery/lotteryContent/LotteryContent";

export const Auction1 = ({ lotteryData, toggleFlipView }: ILotteryView) => {
  const [startDate] = useState(Date.now() + 10000);

  return (
    <Flex gap={4} justifyContent={"center"} w={"100%"} maxW={"768px"}>
      <Flex gap={4} flexDirection={"column"} rounded={"24px"}>
        <Flex gap={4}>
          <LargeTile variant={"solid"}>
            <Flex
              flexDirection={"column"}
              rounded={"8px"}
              alignItems={"center"}
              gap={1}
              px={"30px"}
              py={"10px"}
              color={"#000"}
            >
              <Text as={"span"}>Round 1/5</Text>{" "}
              <Countdown
                renderer={renderer}
                date={startDate}
                autoStart={true}
                zeroPadTime={2}
                zeroPadDays={2}
              >
                <Text>00:00</Text>
              </Countdown>
            </Flex>
            <Text fontSize={"96px"}>{lotteryData?.myNumber || 0}</Text>
            <Text>Vacancy ticket</Text>
          </LargeTile>
          <LargeTile variant={"outline"} gap={4}>
            <Text fontSize={"96px"}>{lotteryData.lastWinner}</Text>
            <Text fontSize={"20px"}>Number of eligible users</Text>

            <LightDescriptionCard fontSize={"14px"}>
              Number of eligible users {">"} vacancy tickets per round =
              selection via VRF
            </LightDescriptionCard>
          </LargeTile>
        </Flex>
        <LotteryStats lotteryData={lotteryData} />
      </Flex>
      <FlipButton onClick={toggleFlipView} />
    </Flex>
  );
};

const renderer = ({ minutes, seconds, completed }) => {
  if (completed) {
    return (
      <Text fontSize={"3rem"} fontWeight={"bold"}>
        00:00
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
