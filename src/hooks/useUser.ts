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
const defaultState = {
  walletAddress: null,
  walletType: null,
  events: null,
  isLoading: false,
  isVerified: false,
  email: null,
  userId: null,
  isLoggedIn: false,
  connectWallet: async () => {},
  mutate: async () => {},
} as UserHook;
export const useUser = (): UserHook => {
  const activeAccount = useActiveAccount();
  const wallet = useActiveWallet();

  const connectedAddress = activeAccount?.address;

  const connectWallet = async () => {
    //TODO add fn here
  };

  const {
    data: userData,
    isLoading,
    mutate: mutateUserData,
  } = useSWR("/api/user/getUserData", fetcher);
  const { walletAddress, email, events, id } = userData?.data || {};
  const error = !!userData?.error

  const isLoggedIn = useIsLoggedIn(connectedAddress)
  const mutate = async () => {
    console.log("🔄🙋‍♂️ Mutate user data in useUser hook");
    await mutateUserData();
  };
  useEffect(() => {
    if (isLoggedIn || walletAddress !== connectedAddress) {
      mutate();
    }
  }, [connectedAddress, isLoggedIn, userData]);

  if (!isLoggedIn || error) {
    return { ...defaultState, mutate: mutateUserData };
  }

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
