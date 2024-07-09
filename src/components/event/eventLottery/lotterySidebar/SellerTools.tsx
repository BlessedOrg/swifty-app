import { Button, ButtonProps, Flex } from "@chakra-ui/react";

export const SellerTools = ({
  activeSaleData,
  currentViewId,
  functions,
}) => {
  const isLotteryStateEnded = activeSaleData?.lotteryState === "ENDED";
  const toolsAndConditions = {
    lotteryV1: [
      {
        disabled: activeSaleData?.lotteryState !== "NOT_STARTED",
        tool: "Start Lottery",
        onClick: functions.onLotteryStart,
      },
      {
        disabled: activeSaleData?.lotteryState !== "ACTIVE",
        tool: "End Lottery",
        onClick: functions.endLv1,
      },
      {
        disabled:
          !Number(activeSaleData?.randomNumber) ||
          !!activeSaleData?.winners.length,
        tool: "Select Winners",
        onClick: functions.onSelectWinners,
      },
      {
        disabled:
          activeSaleData?.lotteryState !== "ENDED" ||
          !activeSaleData?.winners?.length,
        tool: "Withdraw funds",
        onClick: functions.onSellerWithdrawFundsHandler,
      },
    ],
    lotteryV2: [
      {
        disabled: activeSaleData?.lotteryState !== "NOT_STARTED",
        tool: "Start Lottery",
        onClick: functions.onLotteryStart,
      },
      {
        disabled: activeSaleData?.lotteryState !== "ACTIVE",
        tool: "End Lottery",
        onClick: functions.onLotteryEnd,
      },
      {
        disabled: activeSaleData?.lotteryState !== "ENDED",
        tool: "Withdraw funds",
        onClick: functions.onSellerWithdrawFundsHandler,
      },
    ],
    auctionV1: [
      {
        disabled:
          (!activeSaleData?.lastRound?.lotteryFinished ||
            !activeSaleData?.lastRound?.winnersSelected ||
            isLotteryStateEnded) && activeSaleData?.lotteryState !== "NOT_STARTED",
        tool: "New round",
        onClick: functions.onSetupNewRound,
      },
      {
        disabled:
          activeSaleData?.lotteryState !== "ACTIVE" ||
            activeSaleData?.lastRound?.lotteryFinished ||
          isLotteryStateEnded,
        tool: "End Round",
        onClick: functions.endAv1,
      },
      {
        disabled:
          !activeSaleData.lastRound?.randomNumber ||
            activeSaleData.lastRound?.winnersSelected ||
          isLotteryStateEnded,
        tool: "Select winners",
        onClick: functions.onSelectWinners,
      },
      {
        disabled: activeSaleData?.lotteryState !== "ENDED",
        tool: "Withdraw funds",
        onClick: functions.onSellerWithdrawFundsHandler || isLotteryStateEnded,
      },
    ],
    auctionV2: [
      {
        disabled: activeSaleData?.lotteryState !== "NOT_STARTED",
        tool: "Start Lottery",
        onClick: functions.onLotteryStart,
      },
      {
        disabled: activeSaleData?.lotteryState !== "ACTIVE",
        tool: "End Lottery",
        onClick: functions.onLotteryEnd,
      },
      {
        disabled: activeSaleData?.lotteryState !== "ENDED",
        tool: "Withdraw funds",
        onClick: functions.onSellerWithdrawFundsHandler,
      },
    ],
  };

  return (
    <>
      {!!toolsAndConditions?.[currentViewId]?.length
        ? toolsAndConditions?.[currentViewId]?.map((sellerTool, idx) => {
            const { tool, onClick, disabled } = sellerTool;
            return (
              <SellerButton
                label={tool}
                onClick={onClick}
                isDisabled={disabled}
                index={idx + 1}
              />
            );
          })
        : toolsAndConditions?.["lotteryV1"]?.map((sellerTool, idx) => {
            const { tool, onClick, disabled } = sellerTool;
            return (
              <SellerButton
                label={tool}
                onClick={onClick}
                isDisabled={disabled}
                index={idx + 1}
              />
            );
          })}
    </>
  );
};

interface ISellerButton extends ButtonProps {
  onClick: () => void;
  isDisabled?: boolean;
  label: string;
  index?: number;
}
const SellerButton = ({ onClick, isDisabled, label, index }: ISellerButton) => {
  return (
    <Flex alignItems={"center"} gap={1} w={"100%"}>
      <Button
        variant={"black"}
        onClick={onClick}
        isDisabled={isDisabled}
        h={"40px"}
        w={"100%"}
      >
        {index}
        {". "}
        {label}
      </Button>
    </Flex>
  );
};
