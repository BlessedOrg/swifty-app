import useSWR from "swr";
import { fetcher } from "../requests/requests";
import { useWallet } from "@thirdweb-dev/react";

interface UserHook {
  address: string;
  email: string | null;
  isVerified: boolean;
  isLoading: boolean;
  userId: string;
  events?: number;
  mutate: () => Promise<any>;
}
export const useUser = (): UserHook => {
  const {
    data: userData,
    isLoading,
    mutate,
  } = useSWR("/api/user/getUserData", fetcher);

  const { address, data } = userData?.data || {};

  const wallet = useWallet();
  return {
    address,
    walletType: wallet?.walletId,
    ...data,
    events: data?.events || null,
    isLoading,
    isVerified: !!data?.email,
    mutate,
  };
};
