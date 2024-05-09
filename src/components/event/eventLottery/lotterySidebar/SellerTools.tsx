import { Button } from "@chakra-ui/react";

export const SellerTools = ({ activeSaleData, activePhase, functions }) => {
  const commonTools = (
    <>
      {activeSaleData?.isOwner && !activeSaleData?.isLotteryStarted && (
        <Button variant={"black"} onClick={functions.onLotteryStart}>
          Start lottery
        </Button>
      )}
    </>
  );
  const toolsPerPhase = {
    0: (
      <>
        {commonTools}
        {activeSaleData?.isOwner &&
          !activeSaleData?.winners?.length &&
          !!activeSaleData?.isLotteryStarted && (
            <Button variant={"black"} onClick={functions.onSelectWinners}>
              Select Winners
            </Button>
          )}
      </>
    ),
    1: <>commonTools</>,
    2: <>commonTools</>,
    3: <>commonTools</>,
  };

  return <>{toolsPerPhase[activePhase?.idx] || commonTools}</>;
};
