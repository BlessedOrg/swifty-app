import useSWR from "swr";
import { fetcher } from "../requests/requests";
import { useEffect } from "react";
import { useIsLoggedIn } from "./useIsLoggedIn";
import { useActiveAccount, useActiveWallet } from "thirdweb/react";

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
  const activeAccount = useActiveAccount();
  const wallet = useActiveWallet();

  const connectedAddress = activeAccount?.address;

  const isLoggedIn = useIsLoggedIn(connectedAddress);

  const connectWallet = async () => {
    //TODO add fn here
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

  if (!isLoggedIn)
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

  const { walletAddress, email, events, id } = userData?.data || {};

  return {
    walletAddress,
    walletType: wallet?.id,
    events: events || 0,
    isLoading,
    email: email,
    userId: id,
    isVerified: !!email,
    mutate,
    isLoggedIn,
    connectWallet,
  };
};
