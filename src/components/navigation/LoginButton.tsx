"use client";
import { Text, Button, Flex } from "@chakra-ui/react";
import { useUser } from "@/hooks/useUser";
import { shortenWalletAddress } from "@/utils/shortenWalletAddress";
import { RandomAvatar } from "@/components/profile/personalInformation/avatar/RandomAvatar";
import { ConnectButton } from "thirdweb/react";
import { generatePayload, isLoggedIn, login, logout } from "@/server/auth";
import { client } from "lib/client";
import { createWallet } from "thirdweb/wallets";
import { activeChain } from "Providers";
import { mutate as swrMutate } from "swr";

export const LoginButton = () => {
  const { walletAddress, isLoggedIn: isConnected } = useUser();
  console.log(process.env.NEXT_PUBLIC_BASE_URL);
  return (
    <ConnectButton
      client={client}
      onConnect={async (wallet) => {
        console.log("Connected wallet: ", wallet);
      }}
      wallets={[createWallet("io.metamask")]}
      auth={{
        isLoggedIn: async (address) => {
          console.log("Checking if logged in for: ", { address });
          const res = await isLoggedIn(address);
          console.log("Login status - ", res);
          await swrMutate("/api/user/getUserData", {}, { revalidate: true });
          return res;
        },
        doLogin: async (params) => {
          console.log("Do Login with params - ", params);
          await login(params);
        },
        getLoginPayload: async ({ address }) => generatePayload({ address }),
        doLogout: async () => {
          console.log("logging out!");
          await logout(walletAddress);
        },
      }}
      //@ts-ignore
      chain={{ ...activeChain, id: 123420111 }}
      onDisconnect={async () => {
        console.log("Disconnec from button");
        await logout(walletAddress);
      }}
      appMetadata={{
        url: process.env.NEXT_PUBLIC_BASE_URL!,
        name: "Blessed",
      }}
      connectButton={{
        label: "Log in",
        style: {
          background: "transparent",
          border: "1px solid #000",
          borderRadius: "1.5rem",
          fontWeight: "bold",
        },
      }}
      switchButton={{
        style: {
          color: "#fff",
          background: "#e23c3c",
          fontWeight: "bold",
        },
      }}
      detailsButton={{
        render() {
          return (
            <Button
              fontWeight={"600"}
              bg={"transparent"}
              color={"#000"}
              px={"0"}
              border={"1px solid black"}
              rounded={"50px"}
              fontSize={{
                base: "0.8rem",
                lg: "1rem",
              }}
              display={"flex"}
              alignItems={"center"}
            >
              <Flex transform={"scale(0.92)"} transformOrigin={"right"}>
                <RandomAvatar
                  username={
                    isConnected && walletAddress ? walletAddress : undefined
                  }
                  width={36}
                  height={36}
                  rounded
                  lighter
                />
              </Flex>
              <Text pl={2} pr={3}>
                {shortenWalletAddress(walletAddress)}
              </Text>
            </Button>
          );
        },
      }}
    />
  );
};
