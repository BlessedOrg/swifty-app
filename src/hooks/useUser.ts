import useSWR from "swr";
import { swrFetcher } from "../requests/requests";
import { useWallet } from "@thirdweb-dev/react";

export const useUser = () => {
  const { data: userData } = useSWR("/api/user/getUserData", swrFetcher);

  const { address, data } = userData?.data || {};
  
  const wallet = useWallet();
  
  return {
    address,
    walletType: wallet?.walletId,
    ...data,
  };
};
