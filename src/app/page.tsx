import { Flex } from "@chakra-ui/react";

import { Metadata } from "next";
import { Events } from "@/components/events/Events";

export const metadata: Metadata = {
  title: "Events",
};

export default function Home() {
  return (
    <Flex flexDirection={"column"} gap={4}>
      <Events />
    </Flex>
  );
}
