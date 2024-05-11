"use client";
import { Button } from "@chakra-ui/react";
import { ConnectWallet, darkTheme } from "@thirdweb-dev/react";
import { useConnectWallet } from "@/hooks/useConnect";
import { cutWalletAddress } from "@/utils/cutWalletAddress";
export const LoginButton = () => {
  const { walletAddress, isConnected } = useConnectWallet();

  return (
    <ConnectWallet
      theme={darkTheme({
        colors: {
          primaryButtonBg: "rgba(151, 71, 255, 1)",
          primaryButtonText: "#ffffff",
        },
      })}
      detailsBtn={() => {
        return (
          <Button
            fontWeight={"600"}
            bg={"rgba(151, 71, 255, 1)"}
            color={"#fff"}
            px={"1.5rem"}
            py={"1rem"}
            rounded={"8px"}
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
