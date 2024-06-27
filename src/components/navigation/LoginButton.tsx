"use client";
import { Text, Button, Flex } from "@chakra-ui/react";
import { shortenWalletAddress } from "@/utils/shortenWalletAddress";
import { RandomAvatar } from "@/components/profile/personalInformation/avatar/RandomAvatar";
import { ConnectButton } from "thirdweb/react";
import { generatePayload, isLoggedIn, login, logout } from "@/server/auth";
import { client } from "lib/client";
import { createWallet } from "thirdweb/wallets";
import { activeChain } from "Providers";
import { mutate as swrMutate } from "swr";
import { celestiaRaspberry } from "services/viem";
import { useUser } from "@/hooks/useUser";

export const supportedWallets = [createWallet("io.metamask")];

export const LoginButton = () => {
  const { walletAddress, isLoggedIn: isConnected, mutate, events } = useUser();
  return (
    <ConnectButton
      client={client}
      onConnect={async (wallet) => {
        console.log("Connected wallet: ", wallet);
        if (wallet.getChain()?.id !== process.env.NEXT_PUBLIC_CHAIN_ID) {
          //@ts-ignore
          await wallet.switchChain(celestiaRaspberry);
        }
      }}
      wallets={supportedWallets}
      auth={{
        isLoggedIn: async (address) => {
          console.log("Checking if logged in for: ", { address });
          const res = await isLoggedIn(address);
          console.log("Login status - ", res);
          await swrMutate("/api/user/getUserData", {}, { revalidate: true });
          await mutate();
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
      //@ts-ignore
      chains={[{ ...activeChain, id: 123420111 }]}
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
              isLoading={!walletAddress}
              minW={"120px"}
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
