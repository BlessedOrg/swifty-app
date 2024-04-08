"use client";
import { Flex } from "@chakra-ui/react";
import { TestGasless } from "@/components/test/TestGasless";
export default function TestPage() {
  return (
    <Flex
      my={10}
      justifyContent={"center"}
      flexDirection={"column"}
      alignItems={"center"}
      gap={2}
    >
      <TestGasless />
    </Flex>
  );
}
