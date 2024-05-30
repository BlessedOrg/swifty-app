export const usePhases = (durationPerPhase, COOLDOWN_TIME_IN_MILISEC) => {
  const countStartDate = (idx: number, lotteryStartDate) => {
    const startDatePerIdx = {
      0: 0,
      1: durationPerPhase[0],
      2: durationPerPhase[0] + durationPerPhase[1],
      3: durationPerPhase[0] + durationPerPhase[1] + durationPerPhase[2],
    };
    const startDate =
      idx > 3
        ? 0
        : lotteryStartDate +
          startDatePerIdx[idx] +
          idx * COOLDOWN_TIME_IN_MILISEC;

    const saleEndDate =
      lotteryStartDate +
      durationPerPhase[0] +
      durationPerPhase[1] +
      durationPerPhase[2] +
      durationPerPhase[3] +
      3 * COOLDOWN_TIME_IN_MILISEC;

    return { startDate, saleEndDate };
  };
  const getPhaseState = (idx: number, lotteryStartDate, currentTime) => {
    if (typeof idx !== "number")
      return { isActive: false, isFinished: false, isCooldown: false };
    const isStarted =
      new Date().getTime() >= new Date(lotteryStartDate).getTime();
    const { startDate, saleEndDate } = countStartDate(idx, lotteryStartDate);
    const { startDate: startDateForFuturePhase } = countStartDate(
      idx + 1,
      lotteryStartDate,
    );

    const isActive =
      currentTime >= startDate - COOLDOWN_TIME_IN_MILISEC &&
      currentTime <
        (startDateForFuturePhase || saleEndDate) - COOLDOWN_TIME_IN_MILISEC;

    return {
      isActive: isActive || (idx === 0 && !isStarted),
      isFinished:
        currentTime >=
        (startDateForFuturePhase || saleEndDate) - COOLDOWN_TIME_IN_MILISEC,
      isCooldown:
        (isActive &&
          currentTime >= startDate - COOLDOWN_TIME_IN_MILISEC &&
          currentTime < startDate) ||
        (idx === 0 && !isStarted),
    };
  };

  return { countStartDate, getPhaseState };
};
