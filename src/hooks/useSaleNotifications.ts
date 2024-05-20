import { useEffect, useState } from "react";

export const useSaleNotifications = (
  saleData:
    | ILotteryV1Data
    | ILotteryV2Data
    | IAuctionV1Data
    | IAuctionV2Data
    | null
    | undefined,
) => {
  const [isAnimationTriggered, setIsAnimationTriggered] = useState(false);
  const [isNotificationCardHidden, setIsNotificationCardHidden] =
    useState(false);

  const onToggleNotificationCard = () => {
    setIsNotificationCardHidden((prev) => !prev);
  };

  useEffect(() => {
    if (saleData && !isNotificationCardHidden && !saleData?.isWinner) {
      setIsAnimationTriggered(false);
      setIsNotificationCardHidden(true);
    }
    if (saleData && saleData?.isWinner && !isNotificationCardHidden) {
      setIsAnimationTriggered(true);
      setIsNotificationCardHidden(false);
    }
  }, [saleData]);

  return {
    isNotificationCardHidden,
    isAnimationTriggered,
    onToggleNotificationCard,
  };
};
