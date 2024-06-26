import { Button } from "@chakra-ui/react";
import isTimestampInFuture from "@/utils/isTimestampInFuture";

export const SellerTools = ({ activeSaleData, currentViewId, functions }) => {
  const isRoundInAuctionV1Live = isTimestampInFuture(
    activeSaleData?.lastRound?.finishAt
  );

  const commonTools = (
    <>
      {activeSaleData?.lotteryState === "NOT_STARTED" && (
        <Button
          variant={"black"}
          onClick={functions.onLotteryStart}
          isDisabled={activeSaleData?.isLotteryStarted}
          h={"40px"}
        >
          Start lottery
        </Button>
      )}
      {/* {currentViewId !== "auctionV2" && (
        <Button
          variant={"black"}
          onClick={functions.onTransferDepositsHandler}
          h={"40px"}
          fontSize={"0.9rem"}
        >
          Transfer deposits
        </Button>
      )} */}
      <Button
        variant={"black"}
        onClick={functions.onSellerWithdrawFundsHandler}
        h={"40px"}
        fontSize={"0.9rem"}
      >
        Withdraw funds
      </Button>
      {currentViewId !== "lotteryV2" && (
        <Button
          variant={"black"}
          onClick={functions.onSelectWinners}
          isDisabled={
            !!activeSaleData?.winners?.length &&
            !activeSaleData?.isLotteryStarted &&
            !activeSaleData?.vacancyTicket
          }
          h={"40px"}
        >
          Select Winners
        </Button>
      )}
    </>
  );

  const toolsPerPhase = {
    lotteryV1: <>{commonTools}</>,
    lotteryV2: (
      <>
        <Button variant={"black"} onClick={functions.onSetRollPrice} h={"40px"}>
          Set Roll Price
        </Button>
        <Button
          variant={"black"}
          onClick={functions.onToggleRoleToleranceModal}
          h={"40px"}
        >
          Set Roll Tolerance
        </Button>
        {commonTools}
      </>
    ),
    auctionV1: (
      <>
        {currentViewId !== "auctionV2" && (
          <Button
            variant={"black"}
            onClick={functions.onTransferDepositsHandler}
            h={"40px"}
            fontSize={"0.9rem"}
          >
            Transfer deposits
          </Button>
        )}
        <Button
          variant={"black"}
          onClick={functions.onSellerWithdrawFundsHandler}
          h={"40px"}
          fontSize={"0.9rem"}
        >
          Withdraw funds
        </Button>
        <Button
          variant={"black"}
          onClick={functions.onSetupNewRound}
          isDisabled={
            isRoundInAuctionV1Live ||
            (activeSaleData?.roundCounter > 0 &&
              !activeSaleData?.lastRound?.winnersSelected)
          }
          h={"40px"}
        >
          New round
        </Button>
        {!isRoundInAuctionV1Live &&
          activeSaleData?.roundCounter > 0 &&
          activeSaleData?.lastRound?.isFinished &&
          !activeSaleData?.lastRound?.winnersSelected && (
            <Button
              variant={"black"}
              onClick={functions.onSelectWinners}
              h={"40px"}
            >
              Select winners
            </Button>
          )}
      </>
    ),
    auctionV2: <>{commonTools}</>,
  };

  return <>{toolsPerPhase[currentViewId] || commonTools}</>;
};
