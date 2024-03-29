import { useEffect, useState } from "react";
import { CountdownTimeDelta } from "react-countdown";

export const usePhaseProgress = (
  DURATION_TIME_IN_MILISEC,
  COOLDOWN_TIME_IN_MILISEC,
) => {
  const [progress, setProgress] = useState<
    CountdownTimeDelta | { total: number }
  >({ total: DURATION_TIME_IN_MILISEC });
  const [percentageLeft, setPercentageLeft] = useState(100);

  useEffect(() => {
    const timeLeftInPercentage =
      ((DURATION_TIME_IN_MILISEC - progress.total) / DURATION_TIME_IN_MILISEC) *
      100;
    setPercentageLeft(100 - +timeLeftInPercentage);

    if (timeLeftInPercentage === 0) {
      const timeoutId = setTimeout(() => {
        setPercentageLeft(100);
      }, COOLDOWN_TIME_IN_MILISEC);

      return () => clearTimeout(timeoutId);
    }
  }, [progress]);
  return { percentageLeft, updateProgress: setProgress };
};
