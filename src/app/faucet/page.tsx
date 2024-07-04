"use client";
import {
  Box,
  Button,
  Card,
  Flex,
  Heading,
  Text,
  useToast,
} from "@chakra-ui/react";
import { claimFakeUSDC } from "@/server/faucet";
import { useUserContext } from "@/store/UserContext";
import { readSmartContract } from "@/utils/contracts/contracts";
import { usdcContractAddress } from "../../services/web3Config";
import { contractsInterfaces, publicClient } from "../../services/viem";
import { useEffect, useState } from "react";

export default function FaucetPage() {
  const toast = useToast();
  const [userBalance, setUserBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { walletAddress } = useUserContext();

  const readUSDCBalance = async () => {
    const balance = await readSmartContract(
      usdcContractAddress,
      contractsInterfaces.USDC,
      "balanceOf",
      [walletAddress],
    );
    const formattedBalance = formatTokenAmount(balance);
    setUserBalance(+formattedBalance);
  };

  const claimTestUSDC = async () => {
    setIsLoading(true);
    try {
      const txHash = await claimFakeUSDC(walletAddress);

      const result = await publicClient.waitForTransactionReceipt({
        hash: txHash,
        confirmations: 2,
      });

      await readUSDCBalance();
      if (result.status === "success") {
        toast({
          title: "100 TEST USDC claimed",
          status: "success",
        });
      } else {
        toast({
          title: "Something went wrong, try again later",
          status: "error",
        });
      }
    } catch (e) {
      console.log(e);
      toast({
        title: "Something went wrong, try again later",
        status: "error",
      });
    }
    setIsLoading(false);
  };

  function formatTokenAmount(amount, decimals = 6) {
    const formattedNumber = Number(amount) / Math.pow(10, decimals);
    return Number(formattedNumber.toFixed(decimals)).toFixed(2);
  }


  const addTokenToWallet = async () => {
    const tokenAddress = usdcContractAddress;
    const tokenSymbol = "TEST";
    const tokenDecimals = 6;

    try {
      const wasAdded = await window?.ethereum
          .request({
            method: "wallet_watchAsset",
            params: {
              type: "ERC20",
              options: {
                address: tokenAddress,
                symbol: tokenSymbol,
                decimals: tokenDecimals,
              },
            },
          });

      if (wasAdded) {
        toast({
          title: "Token successfully added to your wallet",
          status: "success",
        });
      } else {
      }
    } catch (error) {
      const errInstance: any = error
      toast({
        title: errInstance?.message ? errInstance.message : "Something went wrong",
        status: "error",
      });
    }
  }

  useEffect(() => {
    readUSDCBalance();
  });
  return (
    <Box w={"100%"} display={"grid"} placeItems={"center"}>
      <Card
        py={"4rem"}
        px={"20px"}
        mt={{ base: "3rem", lg: "10rem" }}
        display={"flex"}
        maxW={"700px"}
        flexDirection={"column"}
        justifyContent={"center"}
        alignItems={"center"}
        mb={10}
        gap={4}
      >
        <Box
          width={"100%"}
          px={6}
          display={"flex"}
          flexDirection={"column"}
          gap={2}
        >
          <Heading>Blessed - TEST USDC Faucet</Heading>
          <Flex flexDirection={"column"} mt={4} gap={2}>
            <Text> 1. Add TEST USDC to your wallet</Text>
            <Button colorScheme={"blue"} onClick={addTokenToWallet}>Add USDC to my wallet</Button>

            <Text mt={4}> 2. Claim TEST USDC</Text>
            <Button
              colorScheme={"green"}
              onClick={claimTestUSDC}
              isDisabled={userBalance >= 100}
              isLoading={isLoading}
            >
              Claim
            </Button>
          </Flex>
          <Text mt={4} fontWeight={"bold"}>
            Current Balance: {userBalance} TEST USDC
          </Text>
          {userBalance >= 100 && <Text mt={6} fontSize={'0.8rem'}>* Claim only possible if balance is less then 100.</Text>}
        </Box>
      </Card>
    </Box>
  );
}
