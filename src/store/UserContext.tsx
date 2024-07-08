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
  changeLoginProcessingState: (i: boolean) => void;
  tickets: any
  isLoginProcessing: boolean;
}
const defaultState = {
  walletAddress: null,
  walletType: null,
  events: null,
  isLoading: false,
  isLoginProcessing: false,
  isVerified: false,
  email: null,
  userId: null,
  isLoggedIn: false,
  connectWallet: async () => {},
  mutate: async () => {},
  tickets: null
} as UserHook;

const UserContext = createContext<UserHook | undefined>(undefined);

const UserContextProvider = ({ children }: IProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoginProcessing, setIsLoginProcessing] = useState(false);
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

  const changeLoginProcessingState = (value: boolean) => {
    setIsLoginProcessing(value);
  }
  const {
    data: userData,
    isLoading: isUserDataLoading,
    mutate: mutateUserData,
  } = useSWR("/api/user/getUserData", fetcher);

  const { data, isLoading: ticketLoading, mutate: mutateTickets } = useSWR(
      isLoggedIn ? "/api/user/myTickets" : null,
      fetcher,
  );
  const tickets = data?.mints || [];

  const isLoading = isUserDataLoading || isLoginLoading;
  const { walletAddress, email, events, id } = userData?.data || {};

  const mutate = async () => {
    // console.log("🔄🙋‍♂️ Mutate user data in useUser hook");
    await mutateUserData();
    await mutateTickets()
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

  if (!isLoggedIn) {
    return (
      <UserContext.Provider
        value={{
          ...defaultState,
          mutate: mutateUserData,
          toggleLoginLoadingState,
          isLoading,
          changeLoginProcessingState,
          isLoginProcessing
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
        changeLoginProcessingState,
        isLoginProcessing,
        tickets
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
