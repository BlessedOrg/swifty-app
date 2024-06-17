"use client";
import { Text, Button, Flex } from "@chakra-ui/react";
import {
  ConnectWallet,
  MetaMaskWallet,
  Web3Button,
  darkTheme,
  metamaskWallet,
  useAddress,
  useConnect,
} from "@thirdweb-dev/react";
import { useUser } from "@/hooks/useUser";
import { shortenWalletAddress } from "@/utils/shortenWalletAddress";
import { RandomAvatar } from "@/components/profile/personalInformation/avatar/RandomAvatar";
import { ConnectButton } from "thirdweb/react";
import { generatePayload, isLoggedIn, login, logout } from "@/server/auth";
import { client } from "lib/client";
import { createWallet } from "thirdweb/wallets";
import { activeChain } from "Providers";

export const LoginButton = () => {
  const { walletAddress, isLoggedIn: isConnected } = useUser();
  const connect = useConnect();

  return (
    <ConnectButton
      client={client}
      onConnect={(wallet) => console.log("Connect wallet: ", wallet)}
      wallets={[createWallet("io.metamask")]}
      auth={{
        isLoggedIn: async (address) => {
          console.log("Checking if logged in for: ", { address });
          const res = await isLoggedIn(address);
          console.log("Login status - ", res);
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
      appMetadata={{
        name: "Blessed",
        url: process.env.NEXT_PUBLIC_BASE_URL!,
      }}
      connectButton={{
        label: "Login",
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

    //   <ConnectWallet
    //   className="connect_wallet"
    //   theme={darkTheme({
    //     colors: {
    //       primaryButtonBg: "rgba(151, 71, 255, 1)",
    //       primaryButtonText: "#000",
    //     },
    //   })}
    //   btnTitle={"Log in"}
    //   detailsBtn={() => {
    //     return (
    //       <Flex alignItems={"center"} p={1}>
    //         <Button
    //           fontWeight={"600"}
    //           bg={"transparent"}
    //           color={"#000"}
    //           px={"0"}
    //           border={"1px solid black"}
    //           rounded={"50px"}
    //           fontSize={{
    //             base: "0.8rem",
    //             lg: "1rem",
    //           }}
    //           display={"flex"}
    //           alignItems={"center"}
    //         >
    //           <Flex transform={"scale(0.92)"} transformOrigin={"right"}>
    //             <RandomAvatar
    //               username={
    //                 isConnected && walletAddress ? walletAddress : undefined
    //               }
    //               width={36}
    //               height={36}
    //               rounded
    //               lighter
    //             />
    //           </Flex>
    //           <Text pl={2} pr={3}>
    //             {isConnected ? shortenWalletAddress(walletAddress) : "Log In"}
    //           </Text>
    //         </Button>
    //       </Flex>
    //     );
    //   }}
    // />
  );
};
