import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import useSWR from "swr";
import { fetcher } from "../requests/requests";
import { useActiveAccount, useActiveWallet } from "thirdweb/react";
import { setCookie } from "cookies-next";

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
  toggleLoginLoadingState: (i: boolean) => void;
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

const UserContext = createContext<UserHook | undefined>(undefined);

const UserContextProvider = ({ children }: IProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [ethereum, setEthereum] = useState<any>(null);
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const activeAccount = useActiveAccount();
  const wallet = useActiveWallet();

  const connectedAddress = activeAccount?.address;

  const connectWallet = async () => {
    //TODO add fn here
  };
  const toggleLoginLoadingState = (value: boolean) => {
    setIsLoginLoading(value);
  };

  const {
    data: userData,
    isLoading: isUserDataLoading,
    mutate: mutateUserData,
  } = useSWR("/api/user/getUserData", fetcher);
  const isLoading = isUserDataLoading || isLoginLoading;
  const { walletAddress, email, events, id } = userData?.data || {};

  const mutate = async () => {
    // console.log("🔄🙋‍♂️ Mutate user data in useUser hook");
    await mutateUserData();
  };

  useEffect(() => {
    if (
      !userData?.error &&
      !!activeAccount?.address &&
      connectedAddress === walletAddress
    ) {
      setIsLoggedIn(true);
    } else if (isLoggedIn) {
      setIsLoggedIn(false);
    }
  }, [userData, connectedAddress]);

  useEffect(() => {
    if(!!connectedAddress){
      console.log(`Active account changed to ${connectedAddress}`)
      setCookie("active_wallet", connectedAddress);
      mutate();
    }
  }, [activeAccount]);

  useEffect(() => {
    if (window?.ethereum) {
      setEthereum(window.ethereum);
    }
  }, []);

  useEffect(() => {
    if (ethereum) {
      window?.ethereum.on("chainChanged", () => {
        window.location.reload();
      });
    }
  }, [ethereum]);

  // useEffect(() => {
  //   // console.log(activeAccount)
  //   // if (!activeAccount && !userData?.error && !isLoading) {
  //   //   console.log("Logout cause of disconnect in metamask");
  //   //   logout(walletAddress);
  //   //   const allCookies = getCookies() || {};
  //   //   Object.keys(allCookies)
  //   //     .filter((key) => key.includes("jwt"))
  //   //     .map((i) => {
  //   //       console.log("🍪 Deleted Cookie: ", i);
  //   //       deleteCookie(i);
  //   //     });
  //   //   mutate();
  //   // }
  // }, [activeAccount]);

  if (!isLoggedIn) {
    return (
      <UserContext.Provider
        value={{
          ...defaultState,
          mutate: mutateUserData,
          toggleLoginLoadingState,
        }}
      >
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
        toggleLoginLoadingState,
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
