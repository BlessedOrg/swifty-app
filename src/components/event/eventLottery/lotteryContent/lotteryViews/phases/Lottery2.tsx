import { Flex, Text, Tooltip, usePrefersReducedMotion } from "@chakra-ui/react";
import { LargeTile } from "../components/LargeTile";
import { LotteryStats } from "@/components/event/eventLottery/lotteryContent/lotteryViews/lotteryTiles/LotteryStats";
import { ILotteryView } from "@/components/event/eventLottery/lotteryContent/LotteryContent";
import { ILotteryV2 } from "@/hooks/sales/useLotteryV2";
import { SaleViewWrapper } from "@/components/event/eventLottery/lotteryContent/lotteryViews/phases/SaleViewWrapper";
import { shake } from "../../../../../../keyframes/keyframes";
import { LoadingDots } from "@/components/ui/LoadingDots";
import { useState } from "react";

export const Lottery2 = ({
  saleData,
  toggleFlipView,
  onRollNumber,
    hideFront
}: ILotteryView & ILotteryV2) => {
  const [isNumberRolling, setIsNumberRolling] = useState(false);

  const onGenerateNumberHandler = async () => {
    setIsNumberRolling(true);
    const res = await onRollNumber();
    console.log("Roll number res, Lottery2.tsx - ", res);
    setIsNumberRolling(false);
  };
  const userFunds = saleData?.userFunds || 0;
  const price = saleData?.price || 0;
  const prefersReducedMotion = usePrefersReducedMotion();

  const animation =
    prefersReducedMotion ||
    !!saleData?.isWinner ||
    !saleData?.rollPrice ||
    isNumberRolling ||
    userFunds <= price
      ? undefined
      : `${shake} infinite 750ms ease-in-out`;

  const depositRequired =
    !!saleData?.userFunds && saleData?.userFunds <= saleData?.price;
  const disableRollButton =
    !!saleData?.isWinner ||
    !saleData?.rollPrice ||
    !saleData.userFunds ||
    depositRequired;
  return (
    <SaleViewWrapper
      toggleFlipView={toggleFlipView}
      saleData={saleData}
      id={"lotteryV2"}
      hideFront={hideFront}
    >
      <Flex
        gap={4}
        flexDirection={"column"}
        w={{ base: "100%", iwMid: "unset" }}
      >
        <Flex gap={4}>
          <LargeTile variant={"outline"}>
            <Text fontSize={{ base: "11px", iwMid: "20px" }}>
              Your lucky number
            </Text>
            <Text fontSize={{ base: "36px", iwMid: "96px" }}>
              {saleData?.myNumber}
            </Text>
            <Tooltip
              placement={"top-start"}
              label={
                !saleData?.isLotteryStarted
                  ? "Lottery is not started yet."
                  : (saleData?.userFunds || 0) <= saleData?.price
                    ? "You need to deposit more funds."
                    : null
              }
            >
              <Flex
                as={"button"}
                animation={animation}
                onClick={onGenerateNumberHandler}
                flexDirection={"column"}
                cursor={"pointer"}
                gap={{ base: 1, iwMid: 2 }}
                rounded={{ base: "4px", iwMid: "1rem" }}
                p={{ base: 1, iwMid: 4 }}
                bg={"#FFA500"}
                color={"#fff"}
                w={"100%"}
                textAlign={"center"}
                alignItems={"center"}
                disabled={disableRollButton || isNumberRolling}
                _disabled={{
                  bg: "#ffa500bf",
                  cursor: "no-drop",
                }}
              >
                {isNumberRolling && (
                  <>
                    <Text
                      fontWeight={"bold"}
                      fontSize={{ base: "12px", iwMid: "1rem" }}
                    >
                      Generating new number
                    </Text>
                    <LoadingDots color={"#fff"} />
                  </>
                )}
                {!isNumberRolling && (
                  <>
                    <Text
                      fontSize={{ base: "12px", iwMid: "1.1rem" }}
                      fontWeight={"bold"}
                    >
                      {" "}
                      Generate new number
                    </Text>
                    <Text
                      fontSize={{ base: "10px", iwMid: "1.1rem" }}
                      fontWeight={"normal"}
                    >
                      Each submission costs {saleData?.rollPrice || 0} USDC
                    </Text>
                  </>
                )}
              </Flex>
            </Tooltip>
          </LargeTile>
          <LargeTile variant={"solid"}>
            <Text fontSize={{ base: "11px", iwMid: "20px" }}>
              Target number
            </Text>
            <Text fontSize={{ base: "36px", iwMid: "96px" }}>
              {saleData?.randomNumber || 0}
            </Text>
          </LargeTile>
        </Flex>
        <LotteryStats lotteryData={saleData} />
      </Flex>
    </SaleViewWrapper>
  );
};
