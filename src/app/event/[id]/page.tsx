import { Flex } from "@chakra-ui/react";
import { Event } from "@/components/event/Event";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Event",
};

export default function EventPage() {
  return (
    <Flex justifyContent={"center"} w={"100%"}>
      <Event />
    </Flex>
  );
}
