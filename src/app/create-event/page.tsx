"use client";
import {
  Flex,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Text,
  Input,
  Button,
  useToast,
} from "@chakra-ui/react";
import { CreateEventForm } from "@/components/createEvent/CreateEventForm";
import useSWR from "swr";
import { swrFetcher } from "../../requests/requests";
import { EventsTable } from "@/components/createEvent/eventsTable/EventsTable";
import { DeployContract } from "@/components/createEvent/deployContract/DeployContract";
import { useUser } from "@/hooks/useUser";
import { useState } from "react";
export default function CreateEventPage() {
  const toast = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const {
    address,
    email,
    isVerified,
    userId,
    mutate: mutateUserData,
  } = useUser();
  const [enteredEmail, setEnteredEmail] = useState("");
  const { data: ticketsData, mutate } = useSWR("/api/events", swrFetcher);

  const tickets = ticketsData?.tickets || [];

  const emailSaveHandler = async () => {
    setIsLoading(true);

    const res = await swrFetcher("/api/user/emailUpdate", {
      method: "POST",
      body: JSON.stringify({
        email: enteredEmail,
        userId,
      }),
    });

    if (res?.error) {
      toast({
        title: "Something went wrong!",
        description: res.error,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } else {
      await mutateUserData();
      toast({
        title: "Email added successfully!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    }
    setIsLoading(false);
  };
  return (
    <Flex
      my={10}
      justifyContent={"center"}
      flexDirection={"column"}
      alignItems={"center"}
      gap={2}
    >
      <Tabs w={"full"}>
        <TabList>
          <Tab>Create Event</Tab>
          <Tab isDisabled={!isVerified}>Events</Tab>
          <Tab isDisabled={!isVerified}>Deploy contract</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <Flex my={8} flexDirection={"column"} gap={4} maxW={"400px"}>
              <Text fontWeight={"bold"} fontSize={"1.5rem"}>
                {isVerified
                  ? "Fill out the form"
                  : "Enter your email to continue"}
              </Text>
              {isVerified && (
                <CreateEventForm address={address} email={email} />
              )}
              {!isVerified && (
                <Flex flexDirection={"column"} gap={2}>
                  <Input
                    value={enteredEmail}
                    type={"email"}
                    placeholder={"Email"}
                    onChange={(e) => setEnteredEmail(e.target.value)}
                  />
                  <Button isLoading={isLoading} onClick={emailSaveHandler}>
                    Save
                  </Button>
                </Flex>
              )}
            </Flex>
          </TabPanel>
          <TabPanel>
            <EventsTable data={tickets} />
          </TabPanel>
          <TabPanel>
            <DeployContract mutateEvents={mutate} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  );
}
