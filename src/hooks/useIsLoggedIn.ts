import { isLoggedIn } from "@/server/auth";
import { useEffect, useState } from "react";

export const useIsLoggedIn = (connectedAddress) => {
  const [isLoggedInState, setIsLoggedInState] = useState(false);
  const checkIsLoggedIn = async (address) => {
    const res = await isLoggedIn(address);
    setIsLoggedInState(res);
  };

  useEffect(() => {
    if (connectedAddress) {
      checkIsLoggedIn(connectedAddress);
    }
  }, [connectedAddress]);
  return isLoggedInState;
};
