import { z } from "zod";

export const eventSchema = (isFree) => {
  const requiredBasedOnType = !isFree
    ? z.string({ required_error: "Required field." }).min(1, "Required field")
    : z.string().optional();

  // const ticketsAmount = !isFree
  //   ? z.preprocess(
  //     (val) => {
  //       const num = Number(val);
  //       return isNaN(num) ? NaN : num;
  //     },
  //     z.number({ required_error: "Required field." }).min(1, "The number must be at least 1")
  //   )
  //   : z.string().optional();
  const ticketsAmount = z.preprocess(
    (val) => {
      const num = Number(val);
      return isNaN(num) ? NaN : num;
    },
    z.number().optional()
  )
  // const sliderSchema = z.object({
  //     type: z.enum(["sponsorship", "ama"])
  // })
  return z.object({
    title: z.string().min(3, "Title is required"),
    subtitle: z.string().optional(),
    sellerEmail: z.string(),
    sellerWalletAddr: z.string().length(42),
    description: z.string().optional(),
    coverUrl: z.string().optional(),
    startsAt: z.any({ required_error: "Start date is required" }),
    finishAt: z.any({ required_error: "Finish date is required" }),
    saleStart: z.any({ required_error: "Finish date is required" }),
    timezone: z.string().optional(),
    address: z.object(
      {
        country: z.string().min(1, "Field is required"),
        city: z.string().min(1, "Field is required"),
        postalCode: z.string().min(1, "Field is required"),
        street1stLine: z.string().min(1, "Field is required"),
        street2ndLine: z.string().optional(),
        locationDetails: z.string().optional(),
        countryCode: z.string().min(1, "Field is required"),
        stateCode: z.string().optional(),
        continent: z.string().optional(),
        countryFlag: z.string().optional(),
        countryLatitude: z.string().optional(),
        countryLongitude: z.string().optional(),
        cityLatitude: z.string().optional(),
        cityLongitude: z.string().optional(),
      },
      { required_error: "Missing location fields." }
    ),
    price: requiredBasedOnType,
    cooldownTime: z.string().optional(),
    lotteryV1settings: z.object({
      phaseDuration: ticketsAmount,
      ticketsAmount,
      enabled: isFree ? z.any().optional() : z.boolean().optional(),
    }),
    lotteryV2settings: z.object({
      phaseDuration: ticketsAmount,
      ticketsAmount,
      rollPrice: z.string().min(0, "Roll price cannot be negative"),
      rollTolerance: z.number().optional(),
        // ? z.any()
        // : z
        //     .number()
        //     .min(1, "Min. value should be 1")
        //     .max(99, "Max. value should be 99"),
      enabled: z.boolean().optional(),
    }),
    auctionV1settings: z.object({
      priceIncrease: z.string().optional(),
      phaseDuration: ticketsAmount,
      ticketsAmount,
      enabled:  z.boolean().optional(),
    }),
    auctionV2settings: z.object({
      phaseDuration: ticketsAmount,
      ticketsAmount,
      enabled: z.boolean().optional(),
    }),
    slider: z.any().optional(),
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
        })
      )
      .optional(),
    category: z.enum(["concert", "conference", "event"]).optional(),
  });
};

export const eventEditSchema = () => {
  return z.object({
    id: z.string(),
    userId: z.string(),
    title: z.string().min(3, "Title is required"),
    subtitle: z.string().optional(),
    description: z.string().optional(),
    coverUrl: z.string().optional(),
    address: z.object(
      {
        id: z.string(),
        country: z.string().min(1, "Field is required"),
        city: z.string().min(1, "Field is required"),
        postalCode: z.string().min(1, "Field is required"),
        street1stLine: z.string().min(1, "Field is required"),
        street2ndLine: z.string().optional(),
        locationDetails: z.string().optional(),
        countryCode: z.string().min(1, "Field is required"),
        stateCode: z.string().optional(),
        continent: z.string().optional(),
        countryFlag: z.string().optional(),
        countryLatitude: z.string().optional(),
        countryLongitude: z.string().optional(),
        cityLatitude: z.string().optional(),
        cityLongitude: z.string().optional(),
      },
      { required_error: "Missing location fields." }
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
        })
      )
      .optional(),
    category: z.enum(["concert", "conference", "event"]).optional(),
  });
};

// RN: 91550141269674
// R: 56669138975414
// T: 71999999999999
/// 10 >= 2 && 56 + 71 >= 91 && 56 - 71 <= 91
//  randomNumber + rollTolerance >= rolledNumbers[_participant]
// && randomNumber - rollTolerance <= rolledNumbers[_participant]
