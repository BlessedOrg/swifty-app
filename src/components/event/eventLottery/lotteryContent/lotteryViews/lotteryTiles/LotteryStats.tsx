import { Flex, Text } from "@chakra-ui/react";

interface IProps {
  lotteryData: any;
}
export const LotteryStats = ({ lotteryData }: IProps) => {
  return (
    <Flex gap={4} color={"#000"} justifyContent={{base: "space-around", iwMid: "inherit"}}>
      <Flex gap={{base: 2, iwMid: 6}} justifyContent={"space-around"} w={{base: "auto", iwMid: "300px"}}>
        <Flex flexDirection={"column"} gap={1} fontWeight={"bold"}>
          <Text fontSize={{base: "14px", iwMid: "1rem"}}>Winners</Text>
          <Text fontSize={{base: "20px", iwMid: "40px"}}>{lotteryData?.winners?.length}</Text>
        </Flex>
        <Flex flexDirection={"column"} gap={1} fontWeight={"bold"}>
          <Text fontSize={{base: "14px", iwMid: "1rem"}}>Tickets</Text>
          <Text fontSize={{base: "20px", iwMid: "40px"}}>{lotteryData?.vacancyTicket}</Text>
        </Flex>
      </Flex>
      <Flex gap={{base: 2, iwMid: 6}}  justifyContent={"space-around"} w={{base: "auto", iwMid: "300px"}}>
        <Flex flexDirection={"column"} gap={1} fontWeight={"bold"}>
          <Text fontSize={{base: "14px", iwMid: "1rem"}}>Win chance</Text>
          <Text fontSize={{base: "20px", iwMid: "40px"}}>{lotteryData?.winningChance}%</Text>
        </Flex>
        <Flex flexDirection={"column"} gap={1} fontWeight={"bold"}>
          <Text fontSize={{base: "14px", iwMid: "1rem"}}>Users</Text>
          <Text fontSize={{base: "20px", iwMid: "40px"}}>{lotteryData?.users?.length || 0}</Text>
        </Flex>
      </Flex>
    </Flex>
  );
};
