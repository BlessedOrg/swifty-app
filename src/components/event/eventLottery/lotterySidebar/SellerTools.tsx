import { Button } from "@chakra-ui/react";

export const SellerTools = ({ activeSaleData, currentViewId, functions }) => {
  const commonTools = (
    <>
      <Button
        variant={"black"}
        onClick={functions.onLotteryStart}
        isDisabled={activeSaleData?.isLotteryStarted}
        h={"40px"}
      >
        Start lottery
      </Button>
      <Button
        variant={"black"}
        onClick={functions.onLotteryEnd}
        isDisabled={!activeSaleData?.isLotteryStarted}
        h={"40px"}
      >
        End lottery
      </Button>
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
      {currentViewId !== "lotteryV2" &&
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
      }
    </>
  );
  const toolsPerPhase = {
    lotteryV1: <>{commonTools}</>,
    lotteryV2: (
      <>
        <Button variant={"black"} onClick={functions.onSetRollPrice} h={"40px"}>
          Set Roll Price
        </Button>
        {commonTools}
      </>
    ),
    auctionV1: <>{commonTools}</>,
    auctionV2: <>{commonTools}</>,
  };

  return <>{toolsPerPhase[currentViewId] || commonTools}</>;
};
