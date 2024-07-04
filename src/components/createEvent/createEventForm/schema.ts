import { z } from "zod";

export const eventSchema = (isFree) => {
  const requiredBasedOnType = !isFree
    ? z.string({ required_error: "Required field." }).min(1, "Required field")
    : z.string().optional();

  const stringToNumberWithRequiredProps= (required) => z.preprocess(
    (val) => {
      const num = Number(val);
      return isNaN(num) ? NaN : num;
    },
    !!required ? z.number().min(1, "Value is required and cannot be negative.") : z.number().optional()
  )
    const stringToNumberOptional= z.preprocess(
        (val) => {
            const num = Number(val);
            return isNaN(num) ? NaN : num;
        },
       z.number().optional()
    )

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
    lotteryV1settings: isFree ? z.object({
        phaseDuration: stringToNumberOptional,
        ticketsAmount: stringToNumberOptional,
        enabled: isFree ? z.any().optional() : z.boolean().optional(),
    }): z.object({
      phaseDuration: stringToNumberOptional,
      ticketsAmount: stringToNumberOptional,
      enabled: isFree ? z.any().optional() : z.boolean().optional(),
    }).and(
        z.discriminatedUnion('enabled', [
            z.object({
                enabled: z.literal(true),
                phaseDuration: stringToNumberWithRequiredProps(true),
                ticketsAmount: stringToNumberWithRequiredProps(true),
            }),
            z.object({
                enabled: z.literal(false).optional(),
                phaseDuration: stringToNumberWithRequiredProps(false),
                ticketsAmount: stringToNumberWithRequiredProps(false),
            })
        ])
    ),
    lotteryV2settings: isFree ? z.object({
        phaseDuration: stringToNumberOptional,
        ticketsAmount: stringToNumberOptional,
        rollPrice: stringToNumberOptional,
        rollTolerance: stringToNumberOptional,
        enabled: z.boolean().optional(),
    }):z.object({
      phaseDuration: stringToNumberOptional,
      ticketsAmount: stringToNumberOptional,
      rollPrice: stringToNumberOptional,
      rollTolerance:stringToNumberOptional,
      enabled: z.boolean().optional(),
    }).and(
        z.discriminatedUnion('enabled', [
            z.object({
                enabled: z.literal(true),
                phaseDuration: stringToNumberWithRequiredProps(true),
                ticketsAmount: stringToNumberWithRequiredProps(true),
                rollPrice: stringToNumberWithRequiredProps(true),
                rollTolerance: z.number({ required_error: "Roll tolerance is required." }),
            }),
            z.object({
                enabled: z.literal(false).optional(),
                phaseDuration: stringToNumberWithRequiredProps(false),
                ticketsAmount: stringToNumberWithRequiredProps(false),
                rollPrice: stringToNumberWithRequiredProps(false),
                rollTolerance: z.number().optional(),
            })
        ])
    ),
    auctionV1settings: isFree ? z.object({
        priceIncrease: stringToNumberOptional,
        phaseDuration: stringToNumberOptional,
        ticketsAmount: stringToNumberOptional,
        enabled:  z.boolean().optional(),
    }) :z.object({
      priceIncrease: stringToNumberOptional,
      phaseDuration: stringToNumberOptional,
      ticketsAmount: stringToNumberOptional,
      enabled:  z.boolean().optional(),
    }).and(
        z.discriminatedUnion('enabled', [
            z.object({
                enabled: z.literal(true),
                phaseDuration: stringToNumberWithRequiredProps(true),
                ticketsAmount: stringToNumberWithRequiredProps(true),
                priceIncrease: stringToNumberWithRequiredProps(true),
            }),
            z.object({
                enabled: z.literal(false).optional(),
                phaseDuration: stringToNumberWithRequiredProps(false),
                ticketsAmount: stringToNumberWithRequiredProps(false),
                priceIncrease: stringToNumberWithRequiredProps(false),
            })
        ])
    ),
    auctionV2settings: isFree ? z.object({
        phaseDuration: stringToNumberOptional,
        ticketsAmount: stringToNumberOptional,
        enabled: z.boolean().optional(),
    }): z.object({
      phaseDuration: stringToNumberOptional,
      ticketsAmount: stringToNumberOptional,
      enabled: z.boolean().optional(),
    }).and(
        z.discriminatedUnion('enabled', [
            z.object({
                enabled: z.literal(true),
                phaseDuration: stringToNumberWithRequiredProps(true),
                ticketsAmount: stringToNumberWithRequiredProps(true),
            }),
            z.object({
                enabled: z.literal(false).optional(),
                phaseDuration: stringToNumberWithRequiredProps(false),
                ticketsAmount: stringToNumberWithRequiredProps(false),
            })
        ])
    ),
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
