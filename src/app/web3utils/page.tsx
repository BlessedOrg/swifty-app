"use client";
import { Box, Button, Flex, FormControl, FormLabel, Input } from "@chakra-ui/react";
import { useState } from "react";
import { getNonce } from "../../services/viem";
import { fetcher } from "../../requests/requests";

export default function Web3UtilsPage() {
  const [walletAddr, setWalletAddr] = useState("0xb9449446c82b2f2A184D3bAD2C0faFc5F21eEB73");
  const [nonce, setNonce] = useState(0);

  const nonceChecker = async () => {
    const nonce = await getNonce();
    console.log("🦦 nonce: ", nonce)
    setNonce(nonce);
  };

  const saveMint = async () => {
    const res = await fetcher("/api/user/saveMint", {
      method: "POST",
      body: JSON.stringify({
        // email: enteredEmail,
        // userId,
      }),
    });

    console.log("🦦 res: ", res)
  };


  const getMyTickets = async () => {
    const res = await fetcher("/api/user/myTickets");
    console.log("🦦 res: ", res)
  };

  return (
    <>

      <Box>
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
      </Box>
      <Box>
        <Button onClick={saveMint}>
          Save Mint
        </Button>
      </Box>

      <Box>
        <Button onClick={getMyTickets}>
          get my tickets
        </Button>
      </Box>
    </>
  );
}
