import { Flex } from "@chakra-ui/react";

import { LotteryUsersTableView } from "@/components/event/eventLottery/lotteryContent/lotteryViews/phases/auction2/LotteryUsersTableView";
import { ILotteryView } from "@/components/event/eventLottery/lotteryContent/LotteryContent";
import { IAuctionV2 } from "@/hooks/sales/useAuctionV2";
import { SaleViewWrapper } from "@/components/event/eventLottery/lotteryContent/lotteryViews/phases/SaleViewWrapper";

export const Auction2 = ({
  saleData,
  toggleFlipView,
}: ILotteryView & IAuctionV2) => {
  const participants = saleData?.participantsStats;
  return (
    <SaleViewWrapper toggleFlipView={toggleFlipView} saleData={saleData} id={'auctionV2'} w={"100%"} p={{base: "unset", iwMid:2}}>
      <Flex
        w={"100%"}
        border={{base: "none", iwMid: "1px solid"}}
        borderColor={"#E7E7E7"}
        rounded={{base: "7px", iwMid: "24px"}}
      >
        <LotteryUsersTableView participants={participants} />
      </Flex>
    </SaleViewWrapper>
  );
};
