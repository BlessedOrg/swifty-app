import { Flex, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Countdown from "react-countdown";
import { LargeTile } from "@/components/event/eventLottery/lotteryContent/lotteryViews/components/LargeTile";
import { LightDescriptionCard } from "@/components/event/eventLottery/lotteryContent/lotteryViews/components/LightDescriptionCard";
import { LotteryStats } from "@/components/event/eventLottery/lotteryContent/lotteryViews/lotteryTiles/LotteryStats";
import { SaleViewWrapper } from "@/components/event/eventLottery/lotteryContent/lotteryViews/phases/SaleViewWrapper";
import isTimestampInFuture from "@/utils/isTimestampInFuture";

export const Auction1 = ({ saleData, toggleFlipView }) => {
  const roundFinishAt = saleData?.lastRound?.finishAt;
  const [startDate, setStartDate] = useState(new Date().getTime());

  useEffect(() => {
    if (typeof roundFinishAt === "number" && isTimestampInFuture(roundFinishAt)) {
      setStartDate(roundFinishAt);
    }
  }, [roundFinishAt]);

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
                key={startDate}
                renderer={renderer}
                date={startDate}
                autoStart={true}
                zeroPadTime={2}
                zeroPadDays={2}
              >
                <Text>00:00</Text>
              </Countdown>
            </Flex>
            <Text fontSize={"96px"}>{saleData?.lastRound?.numberOfTickets || 0}</Text>
            <Text>Tickets in round</Text>
          </LargeTile>
          <LargeTile variant={"outline"} gap={4}>
            <Text fontSize={"96px"}>{saleData?.users?.length}</Text>
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
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </Text>
    );
  }
};
