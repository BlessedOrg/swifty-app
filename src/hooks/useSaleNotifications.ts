import { useEffect, useState } from "react";
import delay from "delay";
import { useUser } from "./useUser";

type keys = "lotteryV1" | "lotteryV2" | "auctionV1" | "auctionV2";

interface Sale {
  isConfettiShowed?: boolean;
  showConfetti?: boolean;
  showNotification?: boolean;
  isNotificationHidden?: boolean;
}

export const useSaleNotifications = (
  saleData:
    | ILotteryV1Data
    | ILotteryV2Data
    | IAuctionV1Data
    | IAuctionV2Data
    | null
    | undefined,
  currentViewId,
) => {
  const {isLoggedIn} = useUser()
  const [salesState, setSalesState] = useState({
    lotteryV1: {
      isConfettiShowed: false,
      showConfetti: false,
      showNotification: false,
      isNotificationHidden: false,
    },
    lotteryV2: {
      isConfettiShowed: false,
      showConfetti: false,
      showNotification: false,
      isNotificationHidden: false,
    },
    auctionV1: {
      isConfettiShowed: false,
      showConfetti: false,
      showNotification: false,
      isNotificationHidden: false,
    },
    auctionV2: {
      isConfettiShowed: false,
      showConfetti: false,
      showNotification: false,
      isNotificationHidden: false,
    },
    placeholder: {
      isConfettiShowed: false,
      showConfetti: false,
      showNotification: false,
      isNotificationHidden: false,
    },
  });
  const currentSaleState = salesState[currentViewId] || salesState.placeholder;

  const updateSaleState = (newData: Sale, key: keys) => {
    const payload = { ...salesState[key], ...newData };

    setSalesState((prev) => {
      prev[key] = payload;
      return prev;
    });
  };

  const activeConfetti = async () => {
    updateSaleState(
      { showConfetti: true, showNotification: true },
      currentViewId,
    );
    await delay(6000);
    updateSaleState(
      { showConfetti: false, isConfettiShowed: true },
      currentViewId,
    );
  };
  useEffect(() => {
    if (
      currentViewId &&
      saleData?.isWinner &&
      !currentSaleState.isConfettiShowed &&
      !currentSaleState.showNotification &&isLoggedIn
    ) {
      activeConfetti();
    } else if (
      (currentSaleState?.isConfettiShowed ||
        currentSaleState?.showNotification) &&
      !saleData?.isWinner
    ) {
      updateSaleState(
        {
          isNotificationHidden: false,
          isConfettiShowed: false,
          showNotification: false,
          showConfetti: false,
        },
        currentViewId,
      );
    }
  }, [saleData, isLoggedIn]);

  const onHideNotificationCard = () => {
    updateSaleState(
      { isNotificationHidden: true, showNotification: false },
      currentViewId,
    );
  };
  return {
    isNotificationCardHidden: false,
    isAnimationTriggered: false,
    onToggleNotificationCard: onHideNotificationCard,
    currentSaleState: salesState[currentViewId] as Sale,
  };
};
