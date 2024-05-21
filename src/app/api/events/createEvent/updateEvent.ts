import { NextResponse } from "next/server";
import { eventLocation, speaker as speakerModel, ticketSale } from "@/prisma/models";
import { z } from "zod";
import { revalidatePath } from "next/cache";

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
        speakerId: z.string().optional(),
        avatarUrl: z.string().optional(),
        name: z.string(),
        url: z.string().optional(),
        company: z.string().optional(),
        position: z.string().optional(),
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

    const eventData = await ticketSale.findUnique({
      where: {
        id,
      },
      select: {
        speakers: true,
      },
    });
    const speakersToCreate = speakers?.filter((s) => !s?.speakerId) || [];
    const speakersToUpdate = speakers?.filter((s) => !!s?.speakerId) || [];

    const speakersToDelete = () => {
      const speakersIds = eventData?.speakers
        ?.filter(
          (itemA) => !speakers?.some((itemB) => itemB.speakerId === itemA.id),
        )
        ?.map((i) => i.id);
      return speakersIds;
    };

    const deletedSpeakers = await speakerModel.deleteMany({
      where: {
        id: {
          in: speakersToDelete(),
        },
      },
    });

    const createNewSpeakers = async () => {
      let createdSpeakers: any[] = [];
      for (const speaker of speakersToCreate) {
        delete speaker.speakerId;
        const data = await speakerModel.create({
          data: speaker,
        });
        createdSpeakers.push(data);
      }
      return createdSpeakers;
    };

    const updateSpeakers = async () => {
      let updatedSpeakers: any[] = [];
      for (const speaker of speakersToUpdate) {
        const { speakerId, ...rest } = speaker;
        const data = await speakerModel.update({
          where: {
            id: speakerId,
          },
          data: rest,
        });
        updatedSpeakers.push(data);
      }
      return updatedSpeakers;
    };

    await updateSpeakers();
    const createdSpeakers = await createNewSpeakers();

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
        imagesGallery,
        speakers: {
          connect: createdSpeakers,
        },
      },
    });

    revalidatePath(req.url);

    return NextResponse.json(
      { error: null, ticketSale: sale, deletedSpeakers },
      { status: 200 },
    );
  } catch (error) {
    const errInstance = error as any;
    return NextResponse.json({ error: errInstance?.message }, { status: 400 });
  }
}
