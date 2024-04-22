"use client";
import { CreateEventForm } from "@/components/createEvent/createEventForm/CreateEventForm";
import { useUser } from "@/hooks/useUser";
import { Flex, Spinner, Text } from "@chakra-ui/react";

export const EventEdit = ({ eventData }: { eventData: IEvent | null }) => {
  const { address, email, userId, isLoading } = useUser();

  if (isLoading) {
    return (
      <Flex w={"100%"} justifyContent={"center"}>
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
        />
      </Flex>
    );
  }
  if (eventData?.sellerId !== userId) {
    return <Text>You are not allowed to edit this event.</Text>;
  }

  return (
    <Flex flexDirection={"column"} gap={6} w={"100%"} alignItems={"center"}>
      <Text fontWeight={500}>You can edit basic event informations.</Text>

      <Flex
        bg={"#F4F5F7"}
        maxW={"850px"}
        p={4}
        pb={8}
        rounded={"10px"}
        w={"100%"}
        justifyContent={"center"}
      >
        <CreateEventForm
          email={email}
          address={address}
          isEditForm={true}
          defaultValues={eventData}
          userId={userId}
        />
      </Flex>
    </Flex>
  );
};
