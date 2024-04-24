export const getDefaultValues = (
  address,
  email,
  isEditForm,
  createdEventDefaultValues,
  userId,
) => {
  const defaultValues = isEditForm
    ? {
        ...createdEventDefaultValues,
        startsAt: new Date(`${createdEventDefaultValues?.startsAt}`),
        finishAt: new Date(`${createdEventDefaultValues?.finishAt}`),
        address: createdEventDefaultValues?.eventLocation,
        timezone: createdEventDefaultValues?.timezoneIdentifier,
        imagesGallery: createdEventDefaultValues?.imagesGallery || [],
        userId,
        speakers: createdEventDefaultValues?.speakers?.map((i) => ({
          speakerId: i.id,
          ...i,
        })),
        description: createdEventDefaultValues?.description || "",
      }
    : ({
        sellerWalletAddr: address,
        sellerEmail: email,
        startsAt: new Date(),
        finishAt: new Date(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        type: "paid",
        category: "event",
        description: "",
      } as any);

  return defaultValues;
};
