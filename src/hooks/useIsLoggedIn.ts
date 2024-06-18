import { isLoggedIn } from "@/server/auth";
import { useEffect, useState } from "react";

export const useIsLoggedIn = (connectedAddress) => {
  const [isLoggedInState, setIsLoggedInState] = useState(false);

  const checkIsLoggedIn = async (address) => {
    const res = await isLoggedIn(address);
    setIsLoggedInState(res);
  };

  useEffect(() => {
    let intervalId;

    const startInterval = () => {
      intervalId = setInterval(() => {
        checkIsLoggedIn(connectedAddress);
        console.log("🔄🧑‍🎄 Interval from useLoggedIn", isLoggedInState)
      }, 5000);
    };

    if (connectedAddress) {
      checkIsLoggedIn(connectedAddress);

      if (!isLoggedInState) {
        startInterval();
      }
    }
    if(isLoggedInState){
      clearInterval(intervalId)
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [connectedAddress, isLoggedInState]);

  return isLoggedInState;
};
