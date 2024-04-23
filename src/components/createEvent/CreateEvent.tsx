"use client";
import { Button, Flex, Input, Spinner, Text, useToast } from "@chakra-ui/react";
import { CreateEventForm } from "@/components/createEvent/createEventForm/CreateEventForm";
import { useState } from "react";
import { useUser } from "@/hooks/useUser";
import useSWR from "swr";
import { swrFetcher } from "../../requests/requests";

export const CreateEvent = () => {
  const toast = useToast();
  const [enteredEmail, setEnteredEmail] = useState("");
  const { data: ticketsData, mutate } = useSWR("/api/events", swrFetcher);
  const [isLoading, setIsLoading] = useState(false);
  const {
    address,
    email,
    isVerified,
    userId,
    mutate: mutateUserData,
    isLoading: isUserDataLoading,
  } = useUser();

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

  if (isUserDataLoading) {
    return <Spinner />;
  }

  return (
    <Flex flexDirection={"column"} gap={4} w={"100%"}>
      <Flex my={8} flexDirection={"column"} gap={4} alignItems={"center"}>
        {isVerified ||
          (address && (
            <Text fontWeight={"bold"} fontSize={"1.5rem"}>
              {isVerified
                ? "Fill out the form"
                : "Enter your email to continue"}
            </Text>
          ))}
        {isVerified && (
          <Flex
            bg={"#F4F5F7"}
            maxW={"1150px"}
            p={4}
            pb={8}
            rounded={"10px"}
            w={"100%"}
            justifyContent={"center"}
          >
            <CreateEventForm address={address} email={email} />
          </Flex>
        )}
        {!isVerified && !!address && (
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
        {!isVerified && !address && <Text>Sign in to create events</Text>}
      </Flex>
    </Flex>
  );
};
