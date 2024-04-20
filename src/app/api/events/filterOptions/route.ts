import { NextResponse } from "next/server";
import { ticketSale } from "@/prisma/models";

export async function GET(req: Request) {
  const tickets = await ticketSale.findMany({
    include: {
      eventLocation: true,
      speakers: true,
    },
  });

  const availableLocations = tickets.map((ticket) => ({
    label: `${ticket?.eventLocation?.country}`,
    value: `${ticket?.eventLocation?.countryCode}`,
  }));
  const uniqueLocations = availableLocations.filter(
    (country, index, self) =>
      index === self.findIndex((c) => c.label === country.label),
  );
  const availableSpeakers = tickets.flatMap((ticket) => {
    const speakers =
      ticket?.speakers?.map((speaker) => ({
        label: speaker?.name,
        value: speaker.id,
        avatarUrl: speaker?.avatarUrl || null,
      })) || [];

    return speakers;
  });

  const uniqueSpeakers = availableSpeakers.filter(
    (speaker, index, self) =>
      index === self.findIndex((s) => s.value === speaker.value),
  );
  const response = {
    availableLocations: uniqueLocations,
    availableSpeakers: uniqueSpeakers,
  };
  return NextResponse.json(
    {
      error: null,
      ...response,
    },
    { status: 200 },
  );
}
