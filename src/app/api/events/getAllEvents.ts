import { NextResponse } from "next/server";
import { ticketSale } from "@/prisma/models";
import { getUser } from "@/server/auth";

export async function getAllEvents(req: Request) {
  const { searchParams } = new URL(req.url);
  const categoryParam = (searchParams.get("what") as "event" | "conference" | "concert") || null;
  const speakerParam = searchParams.get("who");
  const dateParams = searchParams.getAll("when");

  const dateFilter = !!dateParams?.length
    ? {
        startsAt: {
          lte: new Date(dateParams?.[1] || ""),
          gte: new Date(dateParams?.[0] || ""),
        },
      }
    : {};

  const speakerFilter = !!speakerParam
    ? {
        speakers: {
          some: {
            id: speakerParam,
          },
        },
      }
    : {};
  const locationParam = searchParams.getAll("where") as string[];

  const locationFilter = !!locationParam.length
    ? ({
        eventLocation: {
          city: {
            in: locationParam,
          },
        },
      } as any)
    : {};

  const isCategoryValid =
    categoryParam === "event" ||
    categoryParam === "conference" ||
    categoryParam === "concert";
  const categoryFilter =
    !!categoryParam && isCategoryValid
      ? {
          category: categoryParam,
        }
      : {};
  const filters = {
    ...categoryFilter,
    ...speakerFilter,
    ...locationFilter,
    ...dateFilter,
  };

  const data = await getUser();
  const userId = (data as any)?.id;

  const tickets = await ticketSale.findMany({
    where: {
      // ...filters
      AND: [
        {
          OR: [
            { usable: true },
            ...(userId ? [{ seller: { id: userId } }] : [])
          ]
        },
        { ...filters }
      ]
    },
    include: {
      eventLocation: true,
      speakers: true,
    },
  });

  return NextResponse.json(
    {
      error: null,
      tickets,
    },
    { status: 200 },
  );
}
