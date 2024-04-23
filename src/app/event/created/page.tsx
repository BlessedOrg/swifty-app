import { Metadata } from "next";
import { Flex } from "@chakra-ui/react";
import { LimitedWidthWrapper } from "@/components/limitedWidthWrapper/LimitedWidthWrapper";
import { MyEvents } from "@/components/myEvents/MyEvents";

export const metadata: Metadata = {
  title: "My Events",
};

export default function MyEventsPage() {
  return (
    <Flex
      my={10}
      justifyContent={"center"}
      flexDirection={"column"}
      alignItems={"center"}
      gap={2}
      px={8}
    >
      <LimitedWidthWrapper size={"xl"}>
        <MyEvents />
      </LimitedWidthWrapper>
    </Flex>
  );
}
