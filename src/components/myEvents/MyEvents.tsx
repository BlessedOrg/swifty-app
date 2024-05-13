"use client";
import { EventsGrid } from "@/components/events/eventGrid/EventsGrid";
import { useUser } from "@/hooks/useUser";
import useSWR from "swr";
import { fetcher } from "../../requests/requests";
import { Flex, Spinner, Text } from "@chakra-ui/react";
import { HeartCrack } from "lucide-react";

export const MyEvents = () => {
  const { userId } = useUser();

  const { data: eventsData, isLoading } = useSWR("/api/events", fetcher);
  const events = eventsData?.tickets
    ? eventsData?.tickets.filter((e) => e.sellerId === userId)
    : [];
  return (
    <Flex flexDirection={"column"} gap={6} w={"100%"}>
      {isLoading && (
        <Flex w={"100%"} justifyContent={"center"}>
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="xl"
          />
        </Flex>
      )}
      {!events?.length && !isLoading && (
        <Flex
          my={6}
          justifyContent={"center"}
          textAlign={"center"}
          gap={2}
          alignItems={"center"}
          color={"#afaaaa"}
          fontSize={"1.2rem"}
        >
          <Text fontWeight={"bold"}>No results</Text>
          <HeartCrack />
        </Flex>
      )}
      <EventsGrid events={events} editingView={true} />
    </Flex>
  );
};
