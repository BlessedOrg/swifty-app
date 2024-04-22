export const payloadFormat = (
  data,
  coverUrl,
  updatedSpeakers,
  uploadedImagesGallery,
) => {
  const payload = {
    ...data,
    category: data?.category || "event",
    increaseValue: !!data.increaseValue ? +data.increaseValue : 0,
    cooldownTime: !!data.cooldownTime ? +data.cooldownTime : 5,
    price: !!data.price ? +data.price : 0,
    priceIncrease: !!data.priceIncrease ? +data.priceIncrease : 0,
    lotteryV1settings: {
      ticketsAmount: !!data.ticketsAmount ? +data.ticketsAmount : 0,
      phaseDuration: !!data.lotteryV1settings.phaseDuration
        ? +data.lotteryV1settings.phaseDuration
        : 30,
    },
    lotteryV2settings: {
      ticketsAmount: !!data.ticketsAmount ? +data.ticketsAmount : 0,
      phaseDuration: !!data.lotteryV2settings.phaseDuration
        ? +data.lotteryV2settings.phaseDuration
        : 30,
    },
    auctionV1settings: {
      ticketsAmount: !!data.ticketsAmount ? +data.ticketsAmount : 0,
      phaseDuration: !!data.auctionV1settings.phaseDuration
        ? +data.auctionV1settings.phaseDuration
        : 30,
    },
    auctionV2settings: {
      ticketsAmount: !!data.ticketsAmount ? +data.ticketsAmount : 0,
      phaseDuration: !!data.auctionV2settings.phaseDuration
        ? +data.auctionV2settings.phaseDuration
        : 30,
    },
    coverUrl: coverUrl || "",
    speakers: updatedSpeakers || [],
    hosts: !!data?.hosts?.length ? data.hosts : [],
    imagesGallery: uploadedImagesGallery || [],
  };
  return payload;
};
