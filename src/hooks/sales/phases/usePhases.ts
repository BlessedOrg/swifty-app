export const usePhases = (
  durationPerPhase,
  COOLDOWN_TIME_IN_MILISEC,
  activePhasesCount,
  sumOfDurations
) => {
  const countStartDate = (idx: number, lotteryStartDate) => {
      const timeForPhase = (index) => durationPerPhase[index] || 0;
  
      const startDatePerIdx = {
        0: 0,
        1: timeForPhase(0),
        2: timeForPhase(0) + timeForPhase(1),
        3: timeForPhase(0) + timeForPhase(1) + timeForPhase(2),
      };
  
      const startDate = idx > 3 ? 0 : lotteryStartDate + startDatePerIdx[idx] + (idx * COOLDOWN_TIME_IN_MILISEC);
  
      const saleEndDate = lotteryStartDate + sumOfDurations + ((activePhasesCount - 1) * COOLDOWN_TIME_IN_MILISEC);
  
      return { startDate, saleEndDate };
  };
  const getPhaseState = (
    idx: number,
    lotteryStartDate,
    currentTime,
    isLast
  ) => {
    if (typeof idx !== "number")
      return { isActive: false, isFinished: false, isCooldown: false };
    const isStarted =
      new Date().getTime() >= new Date(lotteryStartDate).getTime();
    const { startDate, saleEndDate } = countStartDate(idx, lotteryStartDate);
    const { startDate: startDateForFuturePhase } = countStartDate(
      idx + 1,
      lotteryStartDate
    );

    const isActive =
      currentTime >= startDate - COOLDOWN_TIME_IN_MILISEC &&
      currentTime <
        (isLast
          ? saleEndDate
          : startDateForFuturePhase - COOLDOWN_TIME_IN_MILISEC);

    const state = {
      isActive: isActive || (idx === 0 && !isStarted),
      isFinished: isLast
        ? currentTime >= saleEndDate
        : currentTime >= startDateForFuturePhase - COOLDOWN_TIME_IN_MILISEC,
      isCooldown:
        (isActive &&
          currentTime >= startDate - COOLDOWN_TIME_IN_MILISEC &&
          currentTime < startDate) ||
        (idx === 0 && !isStarted),
    };

    return state;
  };

  return { countStartDate, getPhaseState };
};
