import { Flex } from "@chakra-ui/react";

import { Metadata } from "next";
import { Events } from "@/components/events/Events";
import { LimitedWidthWrapper } from "@/components/limitedWidthWrapper/LimitedWidthWrapper";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Events",
};

export default function Home() {
  return (
    <Flex flexDirection={"column"} gap={4} px={4} alignItems={"center"}>
      <LimitedWidthWrapper size={"xl"}>
        <Suspense>
          <Events />
        </Suspense>
      </LimitedWidthWrapper>
    </Flex>
  );
}
