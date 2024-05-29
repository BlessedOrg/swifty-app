export const getDefaultValues = (
  address,
  email,
  isEditForm,
  createdEventDefaultValues,
  userId,
) => {
  const {
    startsAt,
    finishAt,
    eventLocation,
    timezoneIdentifier,
    imagesGallery,
    speakers,
    description,
    subtitle,
    saleStart,
  } = (createdEventDefaultValues || {}) as IEvent;
  const defaultValues = isEditForm
    ? {
        ...createdEventDefaultValues,
        startsAt: new Date(`${startsAt}`),
        finishAt: new Date(`${finishAt}`),
        saleStart: new Date(`${saleStart}`),
        address: eventLocation,
        timezone: timezoneIdentifier,
        imagesGallery: imagesGallery || [],
        userId,
        speakers: speakers?.map((i) => ({
          speakerId: i.id,
          name: i.name || "",
          company: i.company || "",
          position: i.position || "",
          avatarUrl: i.avatarUrl || "",
          url: i.url || "",
        })),
        description: description || "",
        subtitle: subtitle || "",
      }
    : ({
        sellerWalletAddr: address,
        sellerEmail: email,
        startsAt: new Date(),
        finishAt: new Date(),
        saleStart: new Date(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        type: "paid",
        category: "event",
        description: "",
      } as any);

  return defaultValues;
};
