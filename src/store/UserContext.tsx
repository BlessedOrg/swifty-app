import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import useSWR from "swr";
import { fetcher } from "../requests/requests";
import {
  useActiveAccount,
  useActiveWallet,
} from "thirdweb/react";
import { deleteCookie, getCookies, setCookie } from "cookies-next";
import { logout } from "@/server/auth";
const UserContext = createContext<any | undefined>(undefined);

interface IProps {
  children: ReactNode;
}
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

const UserContextProvider = ({ children }: IProps) => {
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

  const isLoggedIn =
    !userData?.error &&
    !!activeAccount?.address &&
    connectedAddress === walletAddress;

  const mutate = async () => {
    // console.log("🔄🙋‍♂️ Mutate user data in useUser hook");
    await mutateUserData();
  };

  useEffect(() => {
    if (walletAddress !== connectedAddress) {
      mutate();
    }
  }, [connectedAddress]);
  useEffect(() => {
    if (walletAddress !== activeAccount?.address && !!activeAccount?.address) {
      setCookie("active_wallet", activeAccount.address);
    }
  }, [activeAccount]);

  useEffect(() => {
    if (!activeAccount && !userData?.error && !isLoading) {
      console.log("Logout cause of disconnect");
      logout(walletAddress);
      const allCookies = getCookies() || {};
      Object.keys(allCookies)
        .filter((key) => key.includes("jwt"))
        .map((i) => {
          console.log("🍪 Deleted Cookie: ", i);
          deleteCookie(i);
        });
      mutate();
    }
  }, [activeAccount]);

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
    return (
      <UserContext.Provider value={{ ...defaultState, mutateUserData }}>
        {children}
      </UserContext.Provider>
    );
  }

  return (
    <UserContext.Provider
      value={{
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
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
const useUserContext = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUserContext must be used inside UserContextProvider");
  }
  return context;
};

export { UserContextProvider, useUserContext };
