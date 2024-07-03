import { Button, ButtonProps, Flex, Text } from "@chakra-ui/react";
import isTimestampInFuture from "@/utils/isTimestampInFuture";

export const SellerTools = ({ activeSaleData, currentViewId, functions }) => {
  const isRoundInAuctionV1Live = isTimestampInFuture(
    activeSaleData?.lastRound?.finishAt,
  );

  const commonTools = (
    <>
      <SellerButton
        onClick={functions.onLotteryStart}
        isDisabled={activeSaleData?.lotteryState !== "NOT_STARTED"}
        label={"Start Lottery"}
        index={1}
      />
      {(currentViewId === "lotteryV1" || currentViewId === "lotteryV2") && (
        <SellerButton
          onClick={
            currentViewId === "lotteryV2"
              ? functions.onLotteryEnd
              : functions.endLv1
          }
          isDisabled={activeSaleData?.lotteryState !== "ACTIVE"}
          label={"End Lottery"}
          index={2}
        />
      )}

      {currentViewId !== "lotteryV2" && (
        <SellerButton
          onClick={functions.onSelectWinners}
          isDisabled={activeSaleData?.lotteryState !== "ENDED" || !!activeSaleData?.winners}
          label={"Select Winners"}
          index={
            currentViewId !== "auctionV1" && currentViewId !== "lotteryV1"
              ? 2
              : 3
          }
        />
      )}
      <SellerButton
        onClick={functions.onSellerWithdrawFundsHandler}
        isDisabled={!activeSaleData?.winners?.length}
        label={"Withdraw funds"}
        index={
          currentViewId !== "auctionV1" && currentViewId !== "lotteryV1" ? 3 : 4
        }
      />
    </>
  );

  const toolsPerPhase = {
    lotteryV1: <>{commonTools}</>,
    lotteryV2: commonTools,
    auctionV1: (
      <>
        <SellerButton
          onClick={functions.onSetupNewRound}
          isDisabled={false}
          label={"New round"}
          index={1}
        />
          {currentViewId === "auctionV1" &&
            <SellerButton
              onClick={functions.endAv1}
              isDisabled={activeSaleData?.lotteryState !== "ACTIVE"}
              label={"End Round"}
              index={2}
            />}
        <SellerButton
          onClick={functions.onSelectWinners}
          isDisabled={
            !isRoundInAuctionV1Live &&
            activeSaleData?.roundCounter > 0 &&
            activeSaleData?.lastRound?.isFinished &&
            !activeSaleData?.lastRound?.winnersSelected
          }
          label={"Select winners"}
          index={3}
        />
      </>
    ),
    auctionV2: commonTools,
  };

  return <>{toolsPerPhase[currentViewId] || commonTools}</>;
};

interface ISellerButton extends ButtonProps {
  onClick: () => void;
  isDisabled?: boolean;
  label: string;
  index?: number;
}
const SellerButton = ({ onClick, isDisabled, label, index }: ISellerButton) => {
  return (
    <Flex alignItems={"center"} gap={1}>
      <Button
        variant={"black"}
        onClick={onClick}
        isDisabled={isDisabled}
        h={"40px"}
      >
        {index}{". "}
        {label}
      </Button>
    </Flex>
  );
};
