"use client";
import { Box, Button, Flex, FormControl, FormLabel, Input } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { contractsInterfaces, fetchNonce } from "../../services/viem";
import { fetcher } from "../../requests/requests";
import { ethers } from "ethers";
import { readSmartContract } from "@/utils/contracts/contracts";

const PrivateToPublicKey = () => {
  const [privateKey, setPrivateKey] = useState("");
  const [publicKey, setPublicKey] = useState("");

  const handlePrivateKeyChange = (event) => {
    setPrivateKey(event.target.value);
  };

  const derivePublicKey = () => {
    try {
      const wallet = new ethers.Wallet(privateKey);
      setPublicKey(wallet.address);
    } catch (error) {
      setPublicKey("Invalid private key");
    }
  };

  return (
    <div>
      <h2>Private to Public Key Converter</h2>
      <input
        type="text"
        value={privateKey}
        onChange={handlePrivateKeyChange}
        placeholder="Enter private key"
      />
      <button onClick={derivePublicKey}>Get Public Key</button>
      {publicKey && <p>Public Key: {publicKey}</p>}
    </div>
  );
};

export default function Web3UtilsPage() {
  const [walletAddr, setWalletAddr] = useState("0xb9449446c82b2f2A184D3bAD2C0faFc5F21eEB73");
  const [nonce, setNonce] = useState(0);

  const nonceChecker = async () => {
    const nonce = await fetchNonce();
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

  const readTheOwnerOfContract = async () => {
    const owner = await readSmartContract(
      "0xc9F26C15e9f4fc9fC3a0983086144058A3C9C4E3",
      contractsInterfaces["LotteryV1"].abi,
      "owner"
    );
    console.log("🦦 owner: ", owner)
  };

  useEffect(() => {
    readTheOwnerOfContract();
  }, [])

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

      <Box>
        <PrivateToPublicKey />
      </Box>
    </>
  );
}
