import { Flex } from "@chakra-ui/react";
import { FlipButton } from "@/components/event/eventLottery/lotteryContent/lotteryViews/components/FlipButton";
import { NotificationWinCard } from "@/components/event/eventLottery/notificationCards/NotificationWinCard";
import { useSaleNotifications } from "@/hooks/useSaleNotifications";
import {ReactNode} from "react";

export const SaleViewWrapper = ({ saleData, children, toggleFlipView, withBorder=true}: {saleData?: any, children: ReactNode, toggleFlipView: ()=> void, withBorder?:boolean}) => {
  const {
    isNotificationCardHidden,
    isAnimationTriggered,
    onToggleNotificationCard,
  } = useSaleNotifications(saleData);

  return (
    <Flex gap={4} justifyContent={"center"} w={"100%"} maxW={"848px"} >
        {withBorder ? <Flex rounded={"8px"} border={'1px solid'} borderColor={"#1D1D1B"} pt={4} px={4} pb={6} w={'100%'} h={'100%'} >
            {children}
        </Flex>: <Flex rounded={"8px"} w={'100%'} h={'100%'} >
            {children}
        </Flex>}

      <Flex flexDirection={"column"} gap={6} >
        <FlipButton onClick={toggleFlipView} />

        {saleData && <NotificationWinCard
            onHideNotification={onToggleNotificationCard}
            isCardHidden={isNotificationCardHidden}
            isAnimationShowed={isAnimationTriggered}
        />}
      </Flex>
    </Flex>
  );
};
