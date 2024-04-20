import { z } from "zod";

export const addressSchema = (isStateRequired) =>
  z.object({
    country: z.string().min(1, "Field is required!"),
    city: z.string().min(1, "Field is required!"),
    postalCode: z.string().min(1, "Field is required!"),
    street1stLine: z.string().min(1, "Field is required!"),
    street2ndLine: z.string().optional(),
    locationDetails: z.string().optional(),
    countryCode: z.string().min(1, "Field is required!"),
    stateCode: isStateRequired
      ? z.string().min(1, "Field is required!")
      : z.string().optional(),
  });
