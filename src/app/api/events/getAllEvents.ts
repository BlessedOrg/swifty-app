import { NextResponse } from "next/server";
import { ticketSale } from "@/prisma/models";

export async function getAllEvents(req: Request) {
  const { searchParams } = new URL(req.url);
  const categoryParam =
    (searchParams.get("what") as "event" | "conference" | "concert") || null;
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
  const locationParam = searchParams.get("where") as string;

  const locationFilter = !!locationParam
    ? ({
        eventLocation: {
          country: {
            contains: locationParam,
            mode: "insensitive",
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
  const tickets = await ticketSale.findMany({
    where: {
      ...filters,
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
