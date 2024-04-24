import { z } from "zod";

export const eventSchema = (isFree) => {
  const requiredBasedOnType = !isFree
    ? z.string({ required_error: "Required field." }).min(1, "Required field!")
    : z.string().optional();
  return z.object({
    title: z.string().min(3, "Title is required!"),
    subtitle: z.string().optional(),
    sellerEmail: z.string(),
    sellerWalletAddr: z.string().length(42),
    description: z.string().optional(),
    coverUrl: z.string().optional(),
    startsAt: z.any({ required_error: "Start date is required!" }),
    finishAt: z.any({ required_error: "Finish date is required!" }),
    timezone: z.string().optional(),
    address: z.object(
      {
        country: z.string().min(1, "Field is required!"),
        city: z.string().min(1, "Field is required!"),
        postalCode: z.string().min(1, "Field is required!"),
        street1stLine: z.string().min(1, "Field is required!"),
        street2ndLine: z.string().optional(),
        locationDetails: z.string().optional(),
        countryCode: z.string().min(1, "Field is required!"),
        stateCode: z.string().optional(),
        continent: z.string().optional(),
        countryFlag: z.string().optional(),
        countryLatitude: z.string().optional(),
        countryLongitude: z.string().optional(),
        cityLatitude: z.string().optional(),
        cityLongitude: z.string().optional(),
      },
      { required_error: "Missing location fields." },
    ),
    price: requiredBasedOnType,
    priceIncrease: z.string().optional(),
    cooldownTime: z.string().optional(),
    lotteryV1settings: z.object({
      phaseDuration: z.string().optional(),
      ticketsAmount: requiredBasedOnType,
    }),
    lotteryV2settings: z.object({
      phaseDuration: z.string().optional(),
      ticketsAmount: requiredBasedOnType,
    }),
    auctionV1settings: z.object({
      phaseDuration: z.string().optional(),
      ticketsAmount: requiredBasedOnType,
    }),
    auctionV2settings: z.object({
      phaseDuration: z.string().optional(),
      ticketsAmount: requiredBasedOnType,
    }),
    type: z.enum(["free", "paid"]),
    hosts: z.any().optional(),
    speakers: z
      .array(
        z.object({
          avatarUrl: z.any().optional(),
          name: z.string().optional(),
          url: z.string().optional(),
          company: z.string().optional(),
          position: z.string().optional(),
        }),
      )
      .optional(),
    category: z.enum(["concert", "conference", "event"]).optional(),
  });
};

export const eventEditSchema = () => {
  return z.object({
    id: z.string(),
    userId: z.string(),
    title: z.string().min(3, "Title is required!"),
    subtitle: z.string().optional(),
    description: z.string().optional(),
    coverUrl: z.string().optional(),
    address: z.object(
      {
        id: z.string(),
        country: z.string().min(1, "Field is required!"),
        city: z.string().min(1, "Field is required!"),
        postalCode: z.string().min(1, "Field is required!"),
        street1stLine: z.string().min(1, "Field is required!"),
        street2ndLine: z.string().optional(),
        locationDetails: z.string().optional(),
        countryCode: z.string().min(1, "Field is required!"),
        stateCode: z.string().optional(),
        continent: z.string().optional(),
        countryFlag: z.string().optional(),
        countryLatitude: z.string().optional(),
        countryLongitude: z.string().optional(),
        cityLatitude: z.string().optional(),
        cityLongitude: z.string().optional(),
      },
      { required_error: "Missing location fields." },
    ),

    hosts: z.any().optional(),
    speakers: z
      .array(
        z.object({
          speakerId: z.string().optional(),
          avatarUrl: z.any().optional(),
          name: z.string().optional(),
          url: z.string().optional(),
          company: z.string().optional(),
          position: z.string().optional(),
        }),
      )
      .optional(),
    category: z.enum(["concert", "conference", "event"]).optional(),
  });
};
