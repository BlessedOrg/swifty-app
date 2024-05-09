import { useEffect, useState } from "react";

export const useCurrentTime = (endDate, COOLDOWN_TIME_IN_MILISEC) => {
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(Date.now());
      if (Date.now() > endDate + COOLDOWN_TIME_IN_MILISEC + 1000) {
        clearInterval(intervalId);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return { currentTime };
};
