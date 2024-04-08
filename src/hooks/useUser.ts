import useSWR from "swr";
import { swrFetcher } from "../requests/requests";

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

  return {
    address,
    ...data,
    isLoading,
    isVerified: !!data?.email,
    mutate,
  };
};
