import { Flex, Text } from "@chakra-ui/react";

export const NotificationWinCard = ({ onHideNotification, isAnimationShowed, isCardHidden }) => {
  return (
    <Flex
      cursor={"pointer"}
      onClick={onHideNotification}
      transition={"all 250ms"}
      w={"calc(100% + 44px)"}
      style={{
        transform: `translateX(${isAnimationShowed && !isCardHidden ? 0 : 100}%)`,
        opacity: `${isAnimationShowed && !isCardHidden ? 100 : 0}%`
      }}
      flexDirection={"column"}
      gap={2}
      bg={"#6157FF"}
      color={"#fff"}
      roundedTopLeft={"8px"}
      roundedBottomLeft={"8px"}
      textAlign={"center"}
      p={2}
    >
      <Text fontWeight={"bold"}>You won!</Text>
      <Text>You can mint your ticket now</Text>
    </Flex>
  );
};