import useSWR from "swr";
import { swrFetcher } from "../requests/requests";

export const useUser = () => {
  const { data: userData } = useSWR("/api/user/getUserData", swrFetcher);

  const { address, data } = userData?.data || {};

  return {
    address,
    ...data,
  };
};
