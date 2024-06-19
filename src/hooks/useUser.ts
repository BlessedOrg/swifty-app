import useSWR from "swr";
import { fetcher } from "../requests/requests";
import { useEffect } from "react";
import { useActiveAccount, useActiveWallet } from "thirdweb/react";
import { logout } from "@/server/auth";
import {deleteCookie, getCookies} from 'cookies-next'

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

  const isLoggedIn = !userData?.error && !!activeAccount?.address && connectedAddress === walletAddress;

  const mutate = async () => {
    console.log("🔄🙋‍♂️ Mutate user data in useUser hook");
    await mutateUserData();
  };

  useEffect(() => {
    if (walletAddress !== connectedAddress) {
      mutate();
    }
  }, [connectedAddress]);

  useEffect(()=> {
    if(!activeAccount && !userData?.error && !isLoading){
      console.log("Logout cause of disconnect")
      logout(walletAddress)
      const allCookies = getCookies() || {}
      Object.keys(allCookies).filter(key => key.includes('jwt')).map(i => 
       {
        console.log("🍪 Deleted Cookie: ", i)
        deleteCookie(i)
       })
      mutate()
    }
  },[activeAccount])

//   useEffect(() => {
//     if(window.ethereum) {
//       window.ethereum.on('accountsChanged', (a) => {
//         console.log(a)
//         console.log("accountsChanged")
//         // window.location.reload();
//       })
//       window.ethereum.on('disconnect', (a) => {
//         console.log(a)
//         console.log("disconnect")
//         // window.location.reload();
//       })
//   }
// })

  if (!isLoggedIn) {
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
