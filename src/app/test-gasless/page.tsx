"use client";
import { Flex, Button } from "@chakra-ui/react";
import { useAddress } from "@thirdweb-dev/react";
import { TestGasless } from "@/components/test/TestGasless";
import { useUser } from "@/hooks/useUser";
export default function TestPage() {
  const data = useUser();
  const sellerWalletAddr = useAddress();
  console.log(data);
  const createEventHandler = async () => {
    const res = await fetch("/api/events", {
      method: "POST",
      body: JSON.stringify({
        title: "test",
        sellerEmail: "filip@licenserocks.de",
        sellerWalletAddr,
        description: "test",
        coverUrl: "",
        startsAt: new Date(1712572158),
        finishAt: new Date(1712575758),
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log(res);
  };

  const deployHandler = async () => {
    const id = "cluqr4tnw00022vgbdf1qpmx4";

    const res = await fetch(`/api/events/${id}/deployContract`, {
      method: "POST",
      body: JSON.stringify({
        contract: "LotteryV1",
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log(res);
  };
  return (
    <Flex
      my={10}
      justifyContent={"center"}
      flexDirection={"column"}
      alignItems={"center"}
      gap={2}
    >
      <TestGasless />

      <Button onClick={createEventHandler}>Create event</Button>
      <Button onClick={deployHandler}>Deploy lottery</Button>
    </Flex>
  );
}
