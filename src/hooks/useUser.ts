import useSWR from "swr";
import { fetcher } from "../requests/requests";
import {
  metamaskWallet,
  useConnect,
  useSigner,
  useWallet,
} from "@thirdweb-dev/react";
import { useUser as useThirdwebUser, useAddress } from "@thirdweb-dev/react";
import { useEffect } from "react";

interface UserHook {
  walletAddress: string | null;
  email: string | null;
  isVerified: boolean;
  isLoading: boolean;
  userId: string | null;
  events?: number | null;
  mutate: () => Promise<any>;
  walletType: any;
  isLoggedIn: boolean;
  connectWallet: () => Promise<any>;
}
export const useUser = (): UserHook => {
  const signer = useSigner();
  const { isLoggedIn, user } = useThirdwebUser();
  const connectedAddress = useAddress();
  const metamaskConfig = metamaskWallet();
  const connect = useConnect();
  const connectWallet = async () => {
    const wallet = await connect(metamaskConfig);
  };

  const {
    data: userData,
    isLoading,
    mutate,
  } = useSWR("/api/user/getUserData", fetcher);

  useEffect(() => {
    if (
      isLoggedIn &&
      userData?.data &&
      userData?.data?.address !== connectedAddress
    ) {
      mutate();
    }
  }, [connectedAddress]);

  if (!isLoggedIn || !signer)
    return {
      walletAddress: null,
      walletType: null,
      events: null,
      isLoading: false,
      isVerified: false,
      email: null,
      userId: null,
      isLoggedIn: false,
      connectWallet,
      mutate,
    };

  const { address, data } = userData?.data || {};

  const wallet = useWallet();
  return {
    walletAddress: address,
    walletType: wallet?.walletId,
    ...data,
    events: data?.events || 0,
    isLoading,
    isVerified: !!data?.email,
    mutate,
    isLoggedIn,
    connectWallet,
  };
};
