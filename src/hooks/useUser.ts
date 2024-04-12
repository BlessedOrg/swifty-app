import useSWR from "swr";
import { swrFetcher } from "../requests/requests";
import { useWallet } from "@thirdweb-dev/react";

interface UserHook {
  address: string;
  email: string | null;
  isVerified: boolean;
  isLoading: boolean;
  userId: string;
  mutate: () => Promise<any>;
}
export const useUser = (): UserHook => {
  const {
    data: userData,
    isLoading,
    mutate,
  } = useSWR("/api/user/getUserData", swrFetcher);

  const { address, data } = userData?.data || {};
  
  const wallet = useWallet();
  
  return {
    address,
    walletType: wallet?.walletId,
    ...data,
    isLoading,
    isVerified: !!data?.email,
    mutate,
  };
};
