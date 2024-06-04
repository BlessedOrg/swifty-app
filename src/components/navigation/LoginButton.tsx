"use client";
import { Button } from "@chakra-ui/react";
import { ConnectWallet, darkTheme } from "@thirdweb-dev/react";
import { useUser } from "@/hooks/useUser";
import { cutWalletAddress } from "@/utils/cutWalletAddress";

export const LoginButton = () => {
  const { walletAddress, isLoggedIn:isConnected } = useUser();
  return (
    <ConnectWallet
      className="connect_wallet"
      theme={darkTheme({
        colors: {
          primaryButtonBg: "rgba(151, 71, 255, 1)",
          primaryButtonText: "#000",
        },
      })}
      detailsBtn={() => {
        return (
          <Button
            fontWeight={"600"}
            bg={"transparent"}
            color={"#000"}
            px={"1.5rem"}
            py={"1.4rem"}
            border={"1px solid black"}
            rounded={"50px"}
            fontSize={{
              base: "0.8rem",
              lg: "1rem",
            }}
          >
            {isConnected ? cutWalletAddress(walletAddress) : "Log In"}
          </Button>
        );
      }}
    />
  );
};
