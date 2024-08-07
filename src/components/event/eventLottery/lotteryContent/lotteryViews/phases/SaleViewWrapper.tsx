import { Flex, FlexProps } from "@chakra-ui/react";
import { FlipButton } from "@/components/event/eventLottery/lotteryContent/lotteryViews/components/FlipButton";
import { NotificationWinCard } from "@/components/event/eventLottery/notificationCards/NotificationWinCard";
import { useSaleNotifications } from "@/hooks/useSaleNotifications";
import { ReactNode } from "react";

interface IProps extends FlexProps {
  saleData?: any;
  children: ReactNode;
  toggleFlipView: () => void;
  withBorder?: boolean;
  id: string;
  hideFront?: boolean;
  withoutBreak?: boolean;
}

export const SaleViewWrapper = ({
  saleData,
  children,
  toggleFlipView,
  withBorder = true,
  id,
  hideFront,
  withoutBreak,
  ...rest
}: IProps) => {
  const { currentSaleState, onToggleNotificationCard } = useSaleNotifications(
    saleData,
    id
  );
  const { isNotificationHidden, showNotification } = currentSaleState || {};

  return (
    <Flex
      gap={4}
      justifyContent={"center"}
      w={"100%"}
      maxW={"848px"}
      bg={"#fff"}
      pos={"relative"}
      h={"100%"}
    >
      {/*{hideFront && (*/}
      {/*  <Flex*/}
      {/*    pos={"absolute"}*/}
      {/*    zIndex={1}*/}
      {/*    bg={"#FFF"}*/}
      {/*    w={"100%"}*/}
      {/*    h={"100%"}*/}
      {/*  ></Flex>*/}
      {/*)}*/}

      {withBorder ? (
        <Flex
          rounded={"8px"}
          border={"1px solid"}
          borderColor={"#1D1D1B"}
          pt={{ base: 2, iwMid: 4 }}
          px={{ base: 2, iwMid: 4 }}
          pb={{ base: 2, iwMid: 6 }}
          w={{ base: "fit-content", iw: "100%" }}
          {...rest}
        >
          {children}
        </Flex>
      ) : (
        <Flex rounded={"8px"} w={"100%"} pos={"relative"}>
          {children}
        </Flex>
      )}

      <Flex
        flexDirection={"column"}
        gap={6}
        display={{ base: "none", iwLg: "flex" }}
      >
        {!withoutBreak && <FlipButton onClick={toggleFlipView} />}

        {saleData && (
          <NotificationWinCard
            onHideNotification={onToggleNotificationCard}
            isCardHidden={isNotificationHidden}
            isAnimationShowed={showNotification}
          />
        )}
      </Flex>
    </Flex>
  );
};
