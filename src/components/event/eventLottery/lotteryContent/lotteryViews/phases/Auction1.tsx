import { Flex, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import Countdown, { zeroPad } from "react-countdown";
import { LargeTile } from "@/components/event/eventLottery/lotteryContent/lotteryViews/components/LargeTile";
import { LightDescriptionCard } from "@/components/event/eventLottery/lotteryContent/lotteryViews/components/LightDescriptionCard";
import { LotteryStats } from "@/components/event/eventLottery/lotteryContent/lotteryViews/lotteryTiles/LotteryStats";
import {ILotteryView} from "@/components/event/eventLottery/lotteryContent/LotteryContent";
import {IAuctionV1} from "@/hooks/sales/useAuctionV1";
import {SaleViewWrapper} from "@/components/event/eventLottery/lotteryContent/lotteryViews/phases/SaleViewWrapper";
import isTimestampInFuture from "@/utils/isTimestampInFuture";


export const Auction1 = ({ saleData, toggleFlipView }: ILotteryView & IAuctionV1) => {
  console.log("🐬 saleData: ", saleData)
  const [startDate] = useState(() => {
    if (typeof saleData?.lastRound?.finishAt === "number" && isTimestampInFuture(new Date(saleData?.lastRound?.finishAt))) {
      return new Date(saleData?.lastRound?.finishAt);
    } else {
      return new Date();
    }
  });

  return (
    <SaleViewWrapper toggleFlipView={toggleFlipView} saleData={saleData}>
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
              <Text as={"span"}>Round {saleData?.roundCounter}</Text>{" "}
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
            <Text fontSize={"96px"}>{saleData?.vacancyTicket || 0}</Text>
            <Text>Vacancy ticket</Text>
          </LargeTile>
          <LargeTile variant={"outline"} gap={4}>
            <Text fontSize={"96px"}>{saleData?.lastWinner}</Text>
            <Text fontSize={"20px"}>Number of eligible users</Text>

            <LightDescriptionCard fontSize={"14px"}>
              Number of eligible users {">"} vacancy tickets per round =
              selection via VRF
            </LightDescriptionCard>
          </LargeTile>
        </Flex>
        <LotteryStats lotteryData={saleData} />
      </Flex>
    </SaleViewWrapper>
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
