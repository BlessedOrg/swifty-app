import { Button, Flex, Input, Select, useToast } from "@chakra-ui/react";
import { useState } from "react";
import { fetcher } from "../../../requests/requests";

export const DeployContract = ({ mutateEvents }) => {
  const toast = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [eventId, setEventId] = useState<string>("");
  const [selectedPhase, setSelectedPhase] = useState<string>("LotteryV1");

  const onDeployHandler = async () => {
    setIsLoading(true);

    const res = await fetcher(`/api/events/${eventId}/deployContract`, {
      method: "POST",
      body: JSON.stringify({
        contract: selectedPhase,
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
        <option value="LotteryV1nft">LotteryV1nft</option>
        <option value="LotteryV2nft">LotteryV2nft</option>
        <option value="AuctionV1nft">AuctionV1nft</option>
        <option value="AuctionV2nft">AuctionV2nft</option>
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
