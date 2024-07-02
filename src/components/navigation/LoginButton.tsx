"use client";
import { Text, Button, Flex } from "@chakra-ui/react";
import { shortenWalletAddress } from "@/utils/shortenWalletAddress";
import { RandomAvatar } from "@/components/profile/personalInformation/avatar/RandomAvatar";
import {
  ConnectButton,
  ConnectButton_connectButtonOptions,
} from "thirdweb/react";
import { generatePayload, isLoggedIn, login, logout } from "@/server/auth";
import { client } from "lib/client";
import { createWallet } from "thirdweb/wallets";
import {activeUsingChain, chainId, thirdwebActiveUsingChain} from "services/web3Config";
import { useUserContext } from "@/store/UserContext";

export const supportedWallets = [createWallet("io.metamask")];

interface ILoginButtonProps {
  connectButton?: ConnectButton_connectButtonOptions;
}

export const LoginButton = ({ connectButton }: ILoginButtonProps) => {
  const {
    walletAddress,
    isLoggedIn: isConnected,
    mutate,
    toggleLoginLoadingState,
  } = useUserContext();
  return (
    <ConnectButton
      client={client}
      onConnect={async (wallet) => {
        console.log("Connected wallet: ", wallet);
        if (
          wallet.getChain()?.id !== chainId
        ) {
          //@ts-ignore
          await wallet.switchChain(activeUsingChain);
        }
      }}
      wallets={supportedWallets}
      auth={{
        isLoggedIn: async (address) => {
          console.log("Checking if logged in for: ", { address });
          const res = await isLoggedIn(address);
          console.log("Login status - ", res);
          await mutate();
          return res;
        },
        doLogin: async (params) => {
          toggleLoginLoadingState(true);
          console.log("Do Login with params - ", params);
          await login(params);
          toggleLoginLoadingState(false);
        },
        getLoginPayload: async ({ address }) => generatePayload({ address }),
        doLogout: async () => {
          console.log("logging out!");
          await logout(walletAddress);
        },
      }}
      //@ts-ignore
      chain={thirdwebActiveUsingChain}
      //@ts-ignore
      chains={[thirdwebActiveUsingChain]}
      onDisconnect={async () => {
        console.log("Disconnect from button");
        await logout(walletAddress);
      }}
      appMetadata={{
        url: process.env.NEXT_PUBLIC_BASE_URL!,
        name: "Blessed",
      }}
      connectButton={
        connectButton
          ? connectButton
          : {
              label: "Log in",
              style: {
                background: "transparent",
                border: "1px solid #000",
                borderRadius: "1.5rem",
                fontWeight: "bold",
              },
            }
      }
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
