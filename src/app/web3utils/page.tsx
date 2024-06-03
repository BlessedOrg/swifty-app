"use client";
import { Box, Button, Flex, FormControl, FormLabel, Input } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { getNonce, publicClient } from "../../services/viem";
import { fetcher } from "../../requests/requests";
import { parseAbiItem } from "viem";
import { sendTransaction } from "@/utils/contracts/contracts";

const contractABI = [
  {
    "type": "function",
    "name": "mint",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "tokenId",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "event",
    "name": "Incremented",
    "inputs": [
      {
        "name": "caller",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      },
      {
        "name": "tokenId",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  }
];

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

  useEffect(() => {
    const unwatch = publicClient.watchContractEvent({
      address: "0x8AaAc755F446CF8F7eC2A235FA89c90032a3926D",
      abi: contractABI,
      event: parseAbiItem("event Incremented(address caller, uint256 tokenId)"),
      // event: (tokenMintedEvent as any),
      onLogs: logs => {
        logs.forEach(log => {
          console.log({log});
          console.log(`Token minted for winner: ${log.args.winner}, tokenId: ${log.args.tokenId}`);
        });
      },
      onError: error => console.error('Error watching event:', error),
    });
  }, [])

  const increment = async () => {
    const unwatch = publicClient.watchContractEvent({
      address: "0x8AaAc755F446CF8F7eC2A235FA89c90032a3926D",
      abi: contractABI,
      event: parseAbiItem("event Incremented(address caller, uint256 tokenId)"),
      // event: (tokenMintedEvent as any),
      onLogs: logs => {
        logs.forEach(log => {
          console.log({log});
          console.log(`Token minted for winner: ${log.args.caller}, tokenId: ${log.args.tokenId}`);
        });
      },
      onError: error => console.error('Error watching event:', error),
    });

    const tx = await sendTransaction(
      "0x8AaAc755F446CF8F7eC2A235FA89c90032a3926D",
      "mint",
      [],
      contractABI,
      "0xb9449446c82b2f2A184D3bAD2C0faFc5F21eEB73"
    );
    
    unwatch();
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

        <Button onClick={increment}>
          Increment
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
