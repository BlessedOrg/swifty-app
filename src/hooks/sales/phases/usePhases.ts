export const usePhases = (
  durationPerPhase,
  COOLDOWN_TIME_IN_MILISEC,
  activePhasesCount,
  sumOfDurations
) => {
  const countStartDate = (idx: number, lotteryStartDate) => {
    const timeFor0 =
      durationPerPhase[0] ||
      durationPerPhase[1] ||
      durationPerPhase[2] ||
      durationPerPhase[3];
    const timeFor1 =
      durationPerPhase[1] || durationPerPhase[2] || durationPerPhase[3];
    const timeFor2 = durationPerPhase[2] || durationPerPhase[3];
    const startDatePerIdx = {
      0: 0,
      1: timeFor0,
      2: timeFor0 + timeFor1,
      3: timeFor0 + timeFor1 + timeFor2,
    };

    const startDate =
      idx > 3
        ? 0
        : lotteryStartDate +
          startDatePerIdx[idx] +
          (durationPerPhase[idx] === 0 ? 0 : idx * COOLDOWN_TIME_IN_MILISEC);

    const saleEndDate =
      lotteryStartDate +
      sumOfDurations +
      (activePhasesCount - 1 || 0) * COOLDOWN_TIME_IN_MILISEC;

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
      lotteryStartDate
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
