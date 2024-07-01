export const payloadFormat = (formData, coverUrl, updatedSpeakers, uploadedImagesGallery, isEditForm) => {
  const safeNumber = (value, defaultValue = 0) => value ? +value : defaultValue;

  return {
    ...formData,
    title: formData.title,
    subtitle: formData.subtitle,
    address: formData.address,
    category: formData?.category,
    coverUrl: coverUrl || "",
    speakers: updatedSpeakers || [],
    imagesGallery: uploadedImagesGallery || [],
    hosts: formData?.hosts?.length ? formData.hosts : [],
    ...isEditForm
      ? {
        userId: formData.userId,
        id: formData.id,
      }
      : {
        slider: formData?.slider || null,
        increaseValue: safeNumber(formData.increaseValue),
        cooldownTime: safeNumber(formData.cooldownTime, 5),
        price: safeNumber(formData.price),
        lotteryV1settings: {
          ticketsAmount: safeNumber(formData.lotteryV1settings.ticketsAmount),
          phaseDuration: safeNumber(formData.lotteryV1settings.phaseDuration),
          enabled: !!formData.lotteryV1settings?.enabled,
        },
        lotteryV2settings: {
          ticketsAmount: safeNumber(formData.lotteryV2settings.ticketsAmount),
          phaseDuration: safeNumber(formData.lotteryV2settings.phaseDuration),
          rollTolerance: safeNumber(formData.lotteryV2settings.rollTolerance),
          rollPrice: safeNumber(formData.lotteryV2settings.rollPrice),
          enabled: !!formData.lotteryV2settings?.enabled,
        },
        auctionV1settings: {
          ticketsAmount: safeNumber(formData.auctionV1settings.ticketsAmount),
          priceIncrease: safeNumber(formData.auctionV1settings?.priceIncrease),
          phaseDuration: safeNumber(formData.auctionV1settings.phaseDuration),
          enabled: !!formData.auctionV1settings?.enabled,
        },
        auctionV2settings: {
          ticketsAmount: safeNumber(formData.auctionV2settings.ticketsAmount),
          phaseDuration: safeNumber(formData.auctionV2settings.phaseDuration),
          enabled: !!formData.auctionV2settings?.enabled,
        },
      }
  };
};