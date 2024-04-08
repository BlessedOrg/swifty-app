import { Button, Flex, Input, Select, useToast } from "@chakra-ui/react";
import { useState } from "react";
import { swrFetcher } from "../../../requests/requests";

export const DeployContract = ({ mutateEvents }) => {
  const toast = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [eventId, setEventId] = useState<string>("");
  const [selectedPhase, setSelectedPhase] = useState<string>("LotteryV1");

  const onDeployHandler = async () => {
    setIsLoading(true);
    const id = "cluqr4tnw00022vgbdf1qpmx4";

    const res = await swrFetcher(`/api/events/${id}/deployContract`, {
      method: "POST",
      body: JSON.stringify({
        contract: "LotteryV1",
      }),
      headers: {
        "Content-Type": "application/json",
      },
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
      await mutateEvents();
      toast({
        title: "Deploy Success!",
        description: "Check events table to get contract address.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    }
    setIsLoading(false);
  };
  return (
    <Flex flexDirection={"column"} maxW={"400px"} gap={4}>
      <Select
        value={selectedPhase}
        onChange={(e) => {
          setSelectedPhase(e.target.value);
        }}
      >
        <option value="LotteryV1">LotteryV1</option>
        <option value="LotteryV2">LotteryV2</option>
        <option value="AuctionV1">AuctionV1</option>
        <option value="AuctionV2">AuctionV2</option>
      </Select>
      <Input
        type={"text"}
        placeholder={"Event ID"}
        onChange={(e) => setEventId(e.target.value)}
        value={eventId}
      />
      <Button
        isLoading={isLoading}
        isDisabled={eventId?.length < 6}
        onClick={onDeployHandler}
      >
        Deploy
      </Button>
    </Flex>
  );
};
