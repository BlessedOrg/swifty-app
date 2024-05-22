import { Flex, Text, usePrefersReducedMotion } from "@chakra-ui/react";
import { LargeTile } from "../components/LargeTile";
import { LotteryStats } from "@/components/event/eventLottery/lotteryContent/lotteryViews/lotteryTiles/LotteryStats";
import { ILotteryView } from "@/components/event/eventLottery/lotteryContent/LotteryContent";
import { ILotteryV2 } from "@/hooks/sales/useLotteryV2";
import { SaleViewWrapper } from "@/components/event/eventLottery/lotteryContent/lotteryViews/phases/SaleViewWrapper";
import { shake } from "../../../../../../keyframes/keyframes";

export const Lottery2 = ({
  saleData,
  toggleFlipView,
  onRollNumber,
}: ILotteryView & ILotteryV2) => {
  const onGenerateNumberHandler = async () => {
    const res = await onRollNumber();
    console.log(res);
  };
const userFunds = saleData?.userFunds || 0
  const price = saleData?.price || 0
  const prefersReducedMotion = usePrefersReducedMotion();

  const animation =
    prefersReducedMotion ||
    !!saleData?.isWinner ||
    !saleData?.rollPrice ||
    (userFunds <= price)
      ? undefined
      : `${shake} infinite 750ms ease-in-out`;

  const disableRollButton =
    !!saleData?.isWinner ||
    !saleData?.rollPrice ||
    !saleData.userFunds ||
    (!!saleData.userFunds && saleData.userFunds <= saleData.price);
  return (
    <SaleViewWrapper
      toggleFlipView={toggleFlipView}
      saleData={saleData}
      id={"lotteryV2"}
    >
      <Flex gap={4} flexDirection={"column"} rounded={"24px"}>
        <Flex gap={4}>
          <LargeTile variant={"outline"}>
            <Text fontSize={"20px"}>Your lucky number</Text>
            <Text fontSize={"96px"}>{saleData?.myNumber}</Text>
            <Flex
              as={"button"}
              animation={animation}
              onClick={onGenerateNumberHandler}
              flexDirection={"column"}
              cursor={"pointer"}
              gap={2}
              rounded={"1rem"}
              p={4}
              bg={"#FFA500"}
              color={"#fff"}
              w={"100%"}
              textAlign={"center"}
              alignItems={"center"}
              disabled={disableRollButton}
              _disabled={{
                bg: "#ffa500bf",
                cursor: "no-drop",
              }}
            >
              <Text fontSize={"1.1rem"} fontWeight={"bold"}>
                {" "}
                Generate new number
              </Text>
              <Text fontSize={"14px"} fontWeight={"normal"}>
                Each submission costs {saleData?.rollPrice || 0} USDC
              </Text>
            </Flex>
          </LargeTile>
          <LargeTile variant={"solid"}>
            <Text fontSize={"20px"}>Target number</Text>
            <Text fontSize={"96px"}>{saleData?.randomNumber || 0}</Text>
          </LargeTile>
        </Flex>
        <LotteryStats lotteryData={saleData} />
      </Flex>
    </SaleViewWrapper>
  );
};
