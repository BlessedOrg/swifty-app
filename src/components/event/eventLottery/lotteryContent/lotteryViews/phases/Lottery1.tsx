import { Flex, Text } from "@chakra-ui/react";
import { LargeTile } from "../components/LargeTile";
import { LightDescriptionCard } from "@/components/event/eventLottery/lotteryContent/lotteryViews/components/LightDescriptionCard";
import { LotteryStats } from "@/components/event/eventLottery/lotteryContent/lotteryViews/lotteryTiles/LotteryStats";
import { ILotteryView } from "@/components/event/eventLottery/lotteryContent/LotteryContent";
import {ILotteryV1} from "@/hooks/sales/useLotteryV1";
import {SaleViewWrapper} from "@/components/event/eventLottery/lotteryContent/lotteryViews/phases/SaleViewWrapper";

export const Lottery1 = ({ saleData, toggleFlipView }: ILotteryView & ILotteryV1) => {

  return (
    <SaleViewWrapper toggleFlipView={toggleFlipView} saleData={saleData} id={'lotteryV1'}>
      <Flex gap={4} flexDirection={"column"} w={{base: "100%", iwLg: "unset"}}>
        <Flex gap={4}>
          <LargeTile variant={"outline"}>
            <Text fontSize={{base: "11px", iwMid:"20px"}}>Your lucky number</Text>
            <Text fontSize={{base: "36px", iwMid:"96px"}}>{saleData?.myNumber}</Text>
            <LightDescriptionCard>
              Your position in the eligible user array
            </LightDescriptionCard>
          </LargeTile>
          <LargeTile variant={"solid"}>
            <Text fontSize={{base: "11px", iwMid:"20px"}}>Current random shuffled winner number</Text>
            <Text fontSize={{base: "36px", iwMid:"96px"}}>{saleData?.lastWinner}</Text>
            <LightDescriptionCard >
              {saleData?.randomNumber} is the number used to select the winner
              number
            </LightDescriptionCard>
          </LargeTile>
        </Flex>
        <LotteryStats lotteryData={saleData} />
      </Flex>

    </SaleViewWrapper>
  );
};



