export const usePhases = (
  DURATION_TIME_IN_MILISEC,
  COOLDOWN_TIME_IN_MILISEC,
) => {
  const countStartDate = (idx: number, lotteryStartDate) => {
    const startDate = lotteryStartDate + DURATION_TIME_IN_MILISEC;
    return (
      idx * DURATION_TIME_IN_MILISEC +
      startDate +
      idx * COOLDOWN_TIME_IN_MILISEC
    );
  };
  const getPhaseState = (idx: number, lotteryStartDate, currentTime) => {
    if (typeof idx !== "number")
      return { isActive: false, isFinished: false, isCooldown: false };
    const isStarted = new Date().getTime() >= new Date(lotteryStartDate).getTime()
    const startDate = countStartDate(idx, lotteryStartDate);
    const isActive =
      currentTime <= startDate &&
      startDate - currentTime <=
        DURATION_TIME_IN_MILISEC + COOLDOWN_TIME_IN_MILISEC;

    return {
      isActive: isActive || idx === 0 && !isStarted,
      isFinished: currentTime > startDate,
      isCooldown:
        isActive && startDate - currentTime > DURATION_TIME_IN_MILISEC || idx === 0 && !isStarted,
    };
  };

  return { countStartDate, getPhaseState };
};
