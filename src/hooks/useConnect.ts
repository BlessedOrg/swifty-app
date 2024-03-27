import {
  useConnect,
  useConnectionStatus,
  metamaskWallet,
  useAddress,
} from "@thirdweb-dev/react";

const metamaskConfig = metamaskWallet();

export const useConnectWallet = () => {
  const status = useConnectionStatus();
  const isConnected = !!(status === "connected");
  const connect = useConnect();
  const walletAddress = useAddress();
  const connectWallet = async () => {
    const wallet = await connect(metamaskConfig);
  };
  return {
    connectWallet,
    isConnected,
    walletAddress: walletAddress || "",
  };
};
