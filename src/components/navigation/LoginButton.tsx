"use client";
import { Text, Button, Flex } from "@chakra-ui/react";
import { ConnectWallet, darkTheme } from "@thirdweb-dev/react";
import { useUser } from "@/hooks/useUser";
import { shortenWalletAddress } from "@/utils/shortenWalletAddress";
import { RandomAvatar } from "@/components/profile/personalInformation/avatar/RandomAvatar";

export const LoginButton = () => {
  const { walletAddress, isLoggedIn: isConnected } = useUser();
  return (
    <ConnectWallet
      className="connect_wallet"
      theme={darkTheme({
        colors: {
          primaryButtonBg: "rgba(151, 71, 255, 1)",
          primaryButtonText: "#000",
        },
      })}
      btnTitle={"Log in"}
      detailsBtn={() => {
        return (
          <Flex alignItems={"center"} p={1}>
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
              <Flex
                transform={"scale(0.92)"}
                transformOrigin={"right"}
              >
                <RandomAvatar
                  username={isConnected && walletAddress ? walletAddress : undefined}
                  width={36}
                  height={36}
                  rounded
                  lighter
                />
              </Flex>
              <Text pl={2} pr={3}>{isConnected ? shortenWalletAddress(walletAddress) : "Log In"}</Text>
            </Button>
          </Flex>
        );
      }}
    />
  );
};
