export const payloadFormat = (
  formData,
  coverUrl,
  updatedSpeakers,
  uploadedImagesGallery,
  isEditForm,
) => {
  return {
    ...formData,
    title: formData.title,
    subtitle: formData.subtitle,
    address: formData.address,
    category: formData?.category,
    coverUrl: coverUrl || "",
    speakers: updatedSpeakers || [],
    imagesGallery: uploadedImagesGallery || [],
    hosts: !!formData?.hosts?.length ? formData.hosts : [],

    ...(isEditForm
      ? {
          userId: formData.userId,
          id: formData.id,
        }
      : {
          slider: formData?.slider || null,
          increaseValue: !!formData.increaseValue ? +formData.increaseValue : 0,
          cooldownTime: !!formData.cooldownTime ? +formData.cooldownTime : 5,
          price: !!formData.price ? +formData.price : 0,
          lotteryV1settings: {
            ticketsAmount: !!formData.lotteryV1settings.ticketsAmount
              ? +formData.lotteryV1settings.ticketsAmount
              : 0,
            phaseDuration: !!formData.lotteryV1settings.phaseDuration
              ? +formData.lotteryV1settings.phaseDuration
              : 30,
          },
          lotteryV2settings: {
            ticketsAmount: !!formData.lotteryV2settings.ticketsAmount
              ? +formData.lotteryV2settings.ticketsAmount
              : 0,
            phaseDuration: !!formData.lotteryV2settings.phaseDuration
              ? +formData.lotteryV2settings.phaseDuration
              : 30,
            rollTolerance: !!formData.lotteryV2settings.rollTolerance
              ? +formData.lotteryV2settings.rollTolerance
              : 50,
          },
          auctionV1settings: {
            ticketsAmount: !!formData.auctionV1settings.ticketsAmount
              ? +formData.auctionV1settings.ticketsAmount
              : 0,
            priceIncrease: !!formData?.auctionV1settings?.priceIncrease ? +formData.auctionV1settings?.priceIncrease  : 0,
            phaseDuration: !!formData.lotteryV2settings.phaseDuration
                ? +formData.lotteryV2settings.phaseDuration
                : 30,
          },
          auctionV2settings: {
            ticketsAmount: !!formData.auctionV2settings.ticketsAmount
              ? +formData.auctionV2settings.ticketsAmount
              : 0,
            phaseDuration: !!formData.auctionV2settings.phaseDuration
              ? +formData.auctionV2settings.phaseDuration
              : 30,
          },
        }),
  };
};
