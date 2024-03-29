import { Flex } from "@chakra-ui/react";

import { LotteryUsersTableView } from "@/components/event/eventLottery/lotteryContent/lotteryTiles/LotteryUsersTableView";

interface IProps {
  lotteryData?: any;
  activePhase?: IPhaseState | null;
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
