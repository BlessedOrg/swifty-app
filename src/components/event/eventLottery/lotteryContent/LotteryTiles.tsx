import { Flex, keyframes, Text } from "@chakra-ui/react";
import { useState } from "react";

interface IProps {
  addFundsWarning?: boolean;
  instruction?: string;
  lotteryData: any;
}
export const LotteryTiles = ({
  lotteryData,
  addFundsWarning,
  instruction,
}: IProps) => {
  const statsTiles = [
    // {
    //   title: "Winners 📣",
    //   value: lotteryData.winners,
    // },
    {
      title: "Users 🤩",
      value: lotteryData.users,
    },
    {
      title: "Tickets 🎟️",
      value: lotteryData.tickets,
    },
  ];

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

  return (
    <Flex gap={4} justifyContent={"center"} alignItems={"center"}>
      <Flex flexDirection={"column"} gap={4}>
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
          <Text fontSize={"20px"}>Add</Text>
          <Text fontSize={"40px"}>20$</Text>
        </Flex>

        {statsTiles.map((stat, idx) => (
          <Flex
            w={"130px"}
            h={"140px"}
            justifyContent={"center"}
            alignItems={"center"}
            bg={"#EEEEEE"}
            rounded={"8px"}
            color={"#000"}
            key={stat.title}
            flexDirection={"column"}
            gap={2}
            fontWeight={"bold"}
          >
            <Text fontSize={"20px"}>{stat.title}</Text>
            <Text fontSize={"40px"}>{stat.value}</Text>
          </Flex>
        ))}
      </Flex>

      <Flex gap={4} w={"100%"} flexDirection={"column"}>
        <Flex gap={4}>
          <Flex
            w={"300px"}
            h={"300px"}
            bg={"linear-gradient(180deg, #22C55E 0%, #37AE99 100%)"}
            rounded={"1.5rem"}
            flexDirection={"column"}
            alignItems={"center"}
            textAlign={"center"}
            fontWeight={"bold"}
            justifyContent={"center"}
          >
            <Text fontSize={"96px"}>{lotteryData.lastWinner}</Text>
            <Text fontSize={"20px"}>Last winner</Text>
          </Flex>

          <Flex
            w={"300px"}
            h={"300px"}
            border={"1px solid"}
            borderColor={"#22C55E"}
            rounded={"1.5rem"}
            flexDirection={"column"}
            alignItems={"center"}
            textAlign={"center"}
            fontWeight={"bold"}
            justifyContent={"center"}
          >
            <Text
              fontSize={"96px"}
              bg={"linear-gradient(180deg, #22C55E 0%, #37AE99 100%)"}
              backgroundClip={"text"}
            >
              {lotteryData.myNumber}
            </Text>
            <Text
              bg={"linear-gradient(180deg, #22C55E 0%, #37AE99 100%)"}
              backgroundClip={"text"}
              fontSize={"20px"}
            >
              Your number
            </Text>
          </Flex>
        </Flex>
        <Flex gap={4}>
          <Flex
            w={"300px"}
            h={"120px"}
            bg={"linear-gradient(180deg, #666 0%, #000 100%)"}
            rounded={"8px"}
            justifyContent={"center"}
            alignItems={"center"}
            gap={4}
            p={"30px"}
          >
            <Text fontSize={"40px"} as={"span"}>
              {lotteryData.winningChance}%
            </Text>{" "}
            <Text>Winning chance</Text>
          </Flex>
          <Flex
            w={"300px"}
            h={"120px"}
            bg={"linear-gradient(180deg, #666 0%, #000 100%)"}
            rounded={"8px"}
            textAlign={"center"}
            justifyContent={"center"}
            alignItems={"center"}
            p={"30px"}
          >
            {instruction
              ? instruction
              : "Your number is generated at the beginning of the round and does not change"}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};
