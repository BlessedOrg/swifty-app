import { NextResponse } from "next/server";
import { ticketSale, user, eventLocation } from "@/prisma/models";
import { z } from "zod";

const schema = z.object({
  title: z.string().min(3, "Title is required!"),
  subtitle: z.string().optional(),
  sellerEmail: z.string(),
  sellerWalletAddr: z.string().length(42),
  description: z.string().optional(),
  coverUrl: z.string().optional(),
  imagesGallery: z.array(z.string()).optional(),
  startsAt: z.any({ required_error: "Start date is required!" }),
  finishAt: z.any({ required_error: "Finish date is required!" }),
  timezone: z.string().optional(),
  address: z.object(
    {
      country: z.string().min(1, "Field is required!"),
      city: z.string().min(1, "Field is required!"),
      countryCode: z.string().min(1, "Field is required!"),
      postalCode: z.string().min(1, "Field is required!"),
      street1stLine: z.string().min(1, "Field is required!"),
      street2ndLine: z.string().optional(),
      locationDetails: z.string().optional(),
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
  price: z.number().optional(),
  cooldownTime: z.number().optional(),
  lotteryV1settings: z
    .object({
      phaseDuration: z.number().optional(),
      ticketsAmount: z.number().optional(),
      slider: z.any().optional(),
    })
    .optional(),
  lotteryV2settings: z
    .object({
      phaseDuration: z.number().optional(),
      ticketsAmount: z.number().optional(),
      slider: z.any().optional(),
    })
    .optional(),
  auctionV1settings: z
    .object({
      phaseDuration: z.number().optional(),
      ticketsAmount: z.number().optional(),
      slider: z.any().optional(),
      priceIncrease: z.number().optional(),
    })
    .optional(),
  auctionV2settings: z
    .object({
      phaseDuration: z.number().optional(),
      ticketsAmount: z.number().optional(),
      slider: z.any().optional(),
    })
    .optional(),
  type: z.enum(["free", "paid"]),
  hosts: z.any().optional(),
  speakers: z
    .array(
      z.object({
        avatarUrl: z.string().optional(),
        name: z.string(),
        url: z.string().optional(),
        company: z.string().optional(),
        position: z.string().optional(),
      }),
    )
    .optional(),
  category: z.enum(["concert", "conference", "event"]),
  slider: z.any().optional(),
});

export async function CreateEvent(req: Request, res: Response) {
  const body = await req.json();
  try {
    const parsedBody = schema.safeParse(body);

    if (!parsedBody.success) {
      return NextResponse.json(
        {
          error: parsedBody.error,
        },
        { status: 400 },
      );
    }

    const {
      title,
      sellerEmail,
      sellerWalletAddr,
      description,
      coverUrl,
      startsAt,
      finishAt,
      address,
      lotteryV2settings,
      lotteryV1settings,
      auctionV2settings,
      auctionV1settings,
      cooldownTime,
      type,
      timezone,
      category,
      speakers,
      hosts,
      price,
      subtitle,
      imagesGallery,
      slider,
    } = parsedBody.data;
    const seller = await user.upsert({
      where: {
        email: sellerEmail,
      },
      update: {},
      create: {
        email: sellerEmail,
        walletAddr: sellerWalletAddr,
      },
    });

    const createdLocation = await eventLocation.create({
      data: address,
    });
    const sale = await ticketSale.create({
      data: {
        title,
        subtitle,
        sellerId: seller.id,
        priceCents: typeof price === "number" ? price * 100 : null,
        description,
        coverUrl,
        startsAt,
        finishAt,
        lotteryV2settings,
        lotteryV1settings,
        auctionV2settings,
        auctionV1settings,
        cooldownTimeSeconds:
          typeof cooldownTime === "number" ? cooldownTime * 60 : null,
        type,
        timezoneIdentifier: timezone,
        category,
        hosts,
        speakers: {
          create: speakers?.map((speaker) => {
            return {
              name: speaker.name,
              url: speaker?.url || "",
              company: speaker?.company || "",
              position: speaker?.position || "",
              avatarUrl: speaker?.avatarUrl || "",
            };
          }),
        },
        eventLocationId: createdLocation.id,
        imagesGallery,
        sliderSettings: slider,
      },
    });

    return NextResponse.json(
      { error: null, ticketSale: sale },
      { status: 200 },
    );
  } catch (error) {
    const errInstance = error as any;
    return NextResponse.json({ error: errInstance?.message }, { status: 400 });
  }
}
