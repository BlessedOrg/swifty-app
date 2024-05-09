import { Flex } from "@chakra-ui/react";

import { LotteryUsersTableView } from "@/components/event/eventLottery/lotteryContent/lotteryViews/phases/auction2/LotteryUsersTableView";
import {ILotteryView} from "@/components/event/eventLottery/lotteryContent/LotteryContent";

interface IProps extends ILotteryView {
  saleData: IAuctionV2Data | undefined | null
  usersData?: any;
}

export const Auction2 = ({ usersData }: IProps) => {
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
