import { Flex } from "@chakra-ui/react";
import { FlipButton } from "@/components/event/eventLottery/lotteryContent/lotteryViews/components/FlipButton";
import { NotificationWinCard } from "@/components/event/eventLottery/notificationCards/NotificationWinCard";
import { useSaleNotifications } from "@/hooks/useSaleNotifications";

export const SaleViewWrapper = ({ saleData, children, toggleFlipView }) => {
  const {
    isNotificationCardHidden,
    isAnimationTriggered,
    onToggleNotificationCard,
  } = useSaleNotifications(saleData);

  return (
    <Flex gap={4} justifyContent={"center"} w={"100%"} maxW={"848px"} >
      {children}
      <Flex flexDirection={"column"} gap={6} >
        <FlipButton onClick={toggleFlipView} />

        <NotificationWinCard
          onHideNotification={onToggleNotificationCard}
          isCardHidden={isNotificationCardHidden}
          isAnimationShowed={isAnimationTriggered}
        />
      </Flex>
    </Flex>
  );
};
