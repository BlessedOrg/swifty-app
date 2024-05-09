import { Flex, Text } from "@chakra-ui/react";
import { LargeTile } from "../components/LargeTile";
import { LightDescriptionCard } from "@/components/event/eventLottery/lotteryContent/lotteryViews/components/LightDescriptionCard";
import { LotteryStats } from "@/components/event/eventLottery/lotteryContent/lotteryViews/lotteryTiles/LotteryStats";
import { FlipButton } from "@/components/event/eventLottery/lotteryContent/lotteryViews/components/FlipButton";
import { ILotteryView } from "@/components/event/eventLottery/lotteryContent/LotteryContent";

interface IProps extends ILotteryView {
  saleData: ILotteryV1Data | undefined | null
}
export const Lottery1 = ({ saleData, toggleFlipView }: IProps) => {

  return (
    <Flex gap={4} justifyContent={"center"} w={"100%"} maxW={"768px"}>
      <Flex gap={4} flexDirection={"column"} rounded={"24px"}>
        <Flex gap={4}>
          <LargeTile variant={"outline"}>
            <Text fontSize={"20px"}>Your lucky number</Text>
            <Text fontSize={"96px"}>{saleData?.myNumber}</Text>
            <LightDescriptionCard>
              Your position in the eligible user array
            </LightDescriptionCard>
          </LargeTile>
          <LargeTile variant={"solid"}>
            <Text fontSize={"20px"}>Current random shuffled winner number</Text>
            <Text fontSize={"96px"}>{saleData?.lastWinner}</Text>
            <LightDescriptionCard>
              {saleData?.randomNumber} is the number used to select the winner
              number
            </LightDescriptionCard>
          </LargeTile>
        </Flex>
        <LotteryStats lotteryData={saleData} />
      </Flex>
      <FlipButton onClick={toggleFlipView} />
    </Flex>
  );
};



