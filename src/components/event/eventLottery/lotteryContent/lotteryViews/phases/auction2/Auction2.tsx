import { Flex } from "@chakra-ui/react";

import { LotteryUsersTableView } from "@/components/event/eventLottery/lotteryContent/lotteryViews/phases/auction2/LotteryUsersTableView";
import {ILotteryView} from "@/components/event/eventLottery/lotteryContent/LotteryContent";
import {IAuctionV2} from "@/hooks/sales/useAuctionV2";

interface IProps {
  usersData?: any
}
export const Auction2 = ({ usersData }: ILotteryView & IAuctionV2 & IProps) => {
  return (
    <Flex
      w={"100%"}
      border="1px solid"
      borderColor={"#E7E7E7"}
      rounded={"24px"}
    >
      <LotteryUsersTableView />
    </Flex>
  );
};
