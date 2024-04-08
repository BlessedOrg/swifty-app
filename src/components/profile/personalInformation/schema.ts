import { z } from "zod";

export const schema = (defaultValues: any) =>
  z.object({
    description: z.string(),
    name: z.string(),
    twitterUrl: z.string(),
    locationValue: z.string(),
    country: z.object({
      label: z.string(),
      value: z.string(),
    }),
    discordHandler: z.string(),
    githubUrl: z.string(),
    email: z.string(),
    newsletterAgreement: z.boolean(),
    username: z.string(),
    websiteUrl: z
      .string()
      .url(
        "Please add a valid URL in the following format https://website.com (watch empty space!)",
      ),
  });
