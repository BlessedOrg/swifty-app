import { NextResponse } from "next/server";
import { ticketSale, eventLocation } from "@/prisma/models";
import { z } from "zod";

const schema = z.object({
  id: z.string().min(1, "Field is required!"),
  title: z.string().min(3, "Title is required!"),
  subtitle: z.string().optional(),
  userId: z.string(),
  description: z.string().optional(),
  coverUrl: z.string().optional(),
  imagesGallery: z.array(z.string()).optional(),
  address: z.object(
    {
      id: z.string().min(1, "Field is required!"),
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
  hosts: z.any().optional(),
  speakers: z
    .array(
      z.object({
        avatarUrl: z.string().optional(),
        name: z.string(),
        description: z.string().optional(),
      }),
    )
    .optional(),
  category: z.enum(["concert", "conference", "event"]),
});

export async function UpdateEvent(req: Request, res: Response) {
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
      id,
      title,
      description,
      coverUrl,
      address,
      category,
      speakers,
      hosts,
      subtitle,
      imagesGallery,
      userId,
    } = parsedBody.data;

    const findEvent = await ticketSale.findUnique({
      where: {
        id,
      },
    });

    if (findEvent?.sellerId !== userId) {
      return NextResponse.json({ error: "Not authorized!" }, { status: 401 });
    }

    await eventLocation.update({
      where: {
        id: address.id,
      },
      data: address,
    });
    const sale = await ticketSale.update({
      where: {
        id,
      },
      data: {
        title,
        subtitle,
        description,
        coverUrl,
        category,
        hosts,
        speakers: {
          connectOrCreate: speakers?.map((speaker) => {
            return {
              where: {
                name: speaker.name,
              },
              create: {
                name: speaker.name,
                description: speaker?.description || "",
                avatarUrl: speaker?.avatarUrl || "",
              },
            };
          }),
        },
        imagesGallery,
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
