"use client";
import { Button, Flex, FormControl, FormLabel, Input } from "@chakra-ui/react";
import { useState } from "react";
import { publicClient } from "../../services/viem";

export default function Web3UtilsPage() {

  const [walletAddr, setWalletAddr] = useState("");
  const [nonce, setNonce] = useState(0);

  const nonceChecker = async () => {
    const pendingNonce = await publicClient.getTransactionCount({
      address: walletAddr,
      blockTag: "pending",
    });
    const latestNonce = await publicClient.getTransactionCount({
      address: walletAddr,
      blockTag: "latest",
    });
    const finalizedNonce = await publicClient.getTransactionCount({
      address: walletAddr,
      blockTag: "finalized",
    });
    const earliestNonce = await publicClient.getTransactionCount({
      address: walletAddr,
      blockTag: "earliest",
    });
    const safeNonce = await publicClient.getTransactionCount({
      address: walletAddr,
      blockTag: "safe",
    });
    console.log({
      pendingNonce,
      latestNonce,
      finalizedNonce,
      earliestNonce,
      safeNonce,
    });
    setNonce(pendingNonce > latestNonce ? pendingNonce + 1 : latestNonce);
  };

  return (
    <Flex
      my={10}
      justifyContent={"center"}
      flexDirection={"column"}
      alignItems={"center"}
      gap={2}
      px={8}
    >
      <h1>Nonce checker</h1>
      <FormControl>
        <FormLabel htmlFor="name">{"Name"}</FormLabel>
        <Input
          mb="0"
          placeholder={"Name"}
          type="text"
          onChange={e => setWalletAddr(e.target.value)}
        />
      </FormControl>

      <h3>{nonce}</h3>

      <Button onClick={nonceChecker}>
        Check Nonce
      </Button>
    </Flex>
  );
}
