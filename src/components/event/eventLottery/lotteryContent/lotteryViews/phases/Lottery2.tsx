import { Flex, Text } from "@chakra-ui/react";
import { LargeTile } from "../components/LargeTile";
import { LotteryStats } from "@/components/event/eventLottery/lotteryContent/lotteryViews/lotteryTiles/LotteryStats";
import { ILotteryView } from "@/components/event/eventLottery/lotteryContent/LotteryContent";
import { FlipButton } from "@/components/event/eventLottery/lotteryContent/lotteryViews/components/FlipButton";

interface IProps extends ILotteryView {
  saleData: ILotteryV2Data | undefined | null
}
export const Lottery2 = ({ saleData, toggleFlipView }: IProps) => {
  const onGenerateNumberHandler = () => {};
  return (
    <Flex gap={4} justifyContent={"center"} w={"100%"} maxW={"768px"}>
      <Flex gap={4} flexDirection={"column"} rounded={"24px"}>
        <Flex gap={4}>
          <LargeTile variant={"outline"}>
            <Text fontSize={"20px"}>Your lucky number</Text>
            <Text fontSize={"96px"}>{saleData?.myNumber}</Text>
            <Flex
              flexDirection={"column"}
              gap={2}
              rounded={"1rem"}
              p={4}
              bg={"#FFA500"}
              color={"#fff"}
              w={"100%"}
            >
              <Text fontSize={"1.1rem"} fontWeight={"bold"}>
                {" "}
                Generate new number
              </Text>
              <Text fontSize={"14px"} fontWeight={"normal"}>
                Each submission costs 1 USDC
              </Text>
            </Flex>
          </LargeTile>
          <LargeTile variant={"solid"}>
            <Text fontSize={"20px"}>Target number</Text>
            <Text fontSize={"96px"}>{ 0}</Text>
          </LargeTile>
        </Flex>
        <LotteryStats lotteryData={saleData} />
      </Flex>
      <FlipButton onClick={toggleFlipView} />
    </Flex>
  );
};
