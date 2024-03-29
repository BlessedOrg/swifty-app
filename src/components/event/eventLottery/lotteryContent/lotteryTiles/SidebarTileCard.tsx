import { Flex, keyframes, Text } from "@chakra-ui/react";

export const SidebarTileCard = ({ statTile }) => {
  const pulse = keyframes`
    0% {
      background-color: rgba(255, 153, 0, 1); 
      transform: scale(1);
    }
    50% {
      background-color: rgba(255, 153, 0, 0.6); 
      transform: scale(1.05);
    }
    100% {
      background-color: rgba(255, 153, 0, 1); 
      transform: scale(1);
    }
`;
  const variant = statTile.variant || "normal";
  const variants = {
    animated: (
      <Flex
        w={"130px"}
        h={"140px"}
        justifyContent={"center"}
        alignItems={"center"}
        bg={"#ff9900"}
        rounded={"8px"}
        color={"#fff"}
        flexDirection={"column"}
        gap={2}
        fontWeight={"bold"}
        animation={`${pulse} 2s infinite`}
        transition="background-color 0.3s"
      >
        <Text fontSize={"20px"}>{statTile.title}</Text>
        <Text fontSize={"40px"}>{statTile.value}</Text>
      </Flex>
    ),
    green: (
      <Flex
        w={"130px"}
        h={"140px"}
        justifyContent={"center"}
        alignItems={"center"}
        bg={"linear-gradient(180deg, #22C55E 0%, #37AE99 100%)"}
        rounded={"8px"}
        color={"#fff"}
        key={statTile.title}
        flexDirection={"column"}
        gap={2}
        fontWeight={"bold"}
      >
        <Text fontSize={"20px"}>{statTile.title}</Text>
        <Text fontSize={"40px"}>{statTile.value}</Text>
      </Flex>
    ),
    normal: (
      <Flex
        w={"130px"}
        h={"140px"}
        justifyContent={"center"}
        alignItems={"center"}
        bg={"#EEEEEE"}
        rounded={"8px"}
        color={"#000"}
        key={statTile.title}
        flexDirection={"column"}
        gap={2}
        fontWeight={"bold"}
      >
        <Text fontSize={"20px"}>{statTile.title}</Text>
        <Text fontSize={"40px"}>{statTile.value}</Text>
      </Flex>
    ),
  };
  return variants[variant];
};
