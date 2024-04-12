"use client";
import { EventLottery } from "@/components/event/eventLottery/EventLottery";
import { Flex } from "@chakra-ui/react";
export default function EnrollPage() {
  return (
    <Flex alignItems={"center"} w={"100%"} flexDirection={"column"}>
      <Flex maxW={"1210px"} w={"100%"}>
        <EventLottery />
      </Flex>
    </Flex>
  );
}
