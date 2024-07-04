import { Flex } from "@chakra-ui/react";
import { CreateEventTest } from "@/components/createEvent/CreateEventTest";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Event",
};
export default function CreateEventPage() {
  return (
    <Flex
      my={10}
      justifyContent={"center"}
      flexDirection={"column"}
      alignItems={"center"}
      gap={2}
      px={8}
    >
      <CreateEventTest />
    </Flex>
  );
}
