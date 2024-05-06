import { Flex, Text } from "@chakra-ui/react";

interface IProps {
  lotteryData: any;
}
export const LotteryStats = ({ lotteryData }: IProps) => {
  return (
    <Flex gap={4} color={"#000"}>
      <Flex gap={6} justifyContent={"space-around"} w={"300px"}>
        <Flex flexDirection={"column"} gap={1} fontWeight={"bold"}>
          <Text>Winners</Text>
          <Text fontSize={"40px"}>{lotteryData?.winners?.length}</Text>
        </Flex>
        <Flex flexDirection={"column"} gap={1} fontWeight={"bold"}>
          <Text>Tickets</Text>
          <Text fontSize={"40px"}>{lotteryData?.vacancyTicket}</Text>
        </Flex>
      </Flex>
      <Flex gap={6} justifyContent={"space-around"} w={"300px"}>
        <Flex flexDirection={"column"} gap={1} fontWeight={"bold"}>
          <Text>Winning chance</Text>
          <Text fontSize={"40px"}>{lotteryData?.winningChance}%</Text>
        </Flex>
        <Flex flexDirection={"column"} gap={1} fontWeight={"bold"}>
          <Text>Users</Text>
          <Text fontSize={"40px"}>{lotteryData?.users}</Text>
        </Flex>
      </Flex>
    </Flex>
  );
};
