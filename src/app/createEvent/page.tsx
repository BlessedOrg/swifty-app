import { Flex } from "@chakra-ui/react";
import { CreateEvent } from "@/components/createEvent/CreateEvent";
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
    >
      <CreateEvent />
    </Flex>
  );
}
