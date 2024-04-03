import * as yup from "yup";

export const schema = (defaultValues: any) =>
  yup.object().shape({
    description: yup.string(),
    name: yup.string(),
    twitterUrl: yup.string(),
    locationValue: yup.string(),
    country: yup.object().shape({
      label: yup.string(),
      value: yup.string(),
    }),
    discordHandler: yup.string(),
    githubUrl: yup.string(),
    email: yup.string(),
    newsletterAgreement: yup.boolean(),

    username: yup.string(),
    websiteUrl: yup
      .string()
      .url(
        "Please add a valid URL in the following format https://website.com (watch empty space!)",
      ),
  });
