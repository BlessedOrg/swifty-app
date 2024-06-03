export const countEndDateForWholeSale = (eventData: IEvent) => {
  const endDate =
    new Date(eventData?.saleStart).getTime() +
    eventData.lotteryV1settings.phaseDuration * 60000 +
    eventData.lotteryV2settings.phaseDuration * 60000 +
    ((eventData.auctionV1settings.phaseDuration || 30) * 60000) +
    eventData.auctionV2settings.phaseDuration * 60000 +
    3 * (eventData.cooldownTimeSeconds * 1000);

  return new Date(endDate);
};
