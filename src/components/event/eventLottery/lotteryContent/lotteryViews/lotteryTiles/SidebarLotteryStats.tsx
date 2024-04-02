import { Flex } from "@chakra-ui/react";
import { SidebarTileCard } from "@/components/event/eventLottery/lotteryContent/lotteryViews/lotteryTiles/SidebarTileCard";

interface IProps {
  lotteryData: any;
  activePhase: IPhaseState | null;
}
export const SidebarLotteryStats = ({ lotteryData, activePhase }: IProps) => {
  const winnersTile = {
    title: "Winners 📣",
    value: lotteryData.winners,
  };
  const addFundsTile = {
    title: "Add",
    value: `${lotteryData.missingFunds}$`,
    variant: "animated",
  };
  const priceTile = {
    title: "Price",
    value: `${lotteryData.price}$`,
    variant: "green",
  };

  const positionTile = {
    title: "Position",
    value: lotteryData.position,
    variant: "green",
  };

  const firstTilePerPhase = {
    0: winnersTile,
    1: winnersTile,
    2: lotteryData.userFunds >= lotteryData.price ? priceTile : addFundsTile,
    3: positionTile,
  };

  const customFirstTile =
    typeof activePhase?.idx === "number"
      ? firstTilePerPhase?.[activePhase?.idx]
      : winnersTile;
  const statsTiles = [
    customFirstTile,
    {
      title: "Users 🤩",
      value: lotteryData.users,
    },
    {
      title: "Tickets 🎟️",
      value: lotteryData.tickets,
    },
  ];
  return (
    <Flex flexDirection={"column"} gap={4} h={"100%"}>
      {statsTiles.map((statTile, idx) => (
        <SidebarTileCard key={idx} statTile={statTile} />
      ))}
    </Flex>
  );
};
