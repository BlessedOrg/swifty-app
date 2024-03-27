import { Button } from "@chakra-ui/react";
import { useSetIsWalletModalOpen } from "@thirdweb-dev/react";
import { useConnectWallet } from "@/hooks/useConnect";

export const LoginButton = () => {
  const { walletAddress, isConnected } = useConnectWallet();
  const setIsWalletModalOpen = useSetIsWalletModalOpen();

  function openModal() {
    setIsWalletModalOpen(true);
  }

  return (
    <Button
      fontWeight={"600"}
      bg={"rgba(151, 71, 255, 1)"}
      color={"#fff"}
      px={"1.5rem"}
      py={"1rem"}
      rounded={"8px"}
      onClick={openModal}
      fontSize={{
        base: "0.8rem",
        lg: "1rem",
      }}
    >
      {isConnected
        ? `${walletAddress.toString().substring(0, 6)}...${walletAddress
            .toString()
            .slice(-4)}`
        : "Login"}
    </Button>
  );
};
