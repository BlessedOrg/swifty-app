import { NextResponse } from "next/server";
import { ticketSale, eventLocation } from "@/prisma/models";

export async function GET(req: Request) {
  const tickets = await ticketSale.findMany({
    include: {
      eventLocation: true,
      speakers: true,
    },
  });
  const getEventsByContinent = async () => {
    const continents = await eventLocation.findMany({
      distinct: ["continent"],
      select: {
        continent: true,
      },
    });

    const eventsByContinent: any = [];
    const addressesAll = await eventLocation.findMany({
      select: {
        country: true,
        countryCode: true,
        stateCode: true,
        city: true,
        continent: true,
        countryFlag: true,
      },
    });

    for (const continent of continents) {
      const addresses = addressesAll.filter(
        (item) => item.continent === continent.continent,
      );

      const addressesWithCount = addresses.map((address) => {
        const count = addresses.filter((a) => a.city === address.city).length;
        return { ...address, count };
      });
      const uniqueAddresses = addressesWithCount.filter(
        (address, index, self) =>
          index === self.findIndex((c) => c.city === address.city),
      );

      eventsByContinent.push({
        continent: continent.continent,
        addresses: uniqueAddresses,
        count: addresses.length,
      });
    }

    return eventsByContinent.sort((a, b) =>
      a.continent.localeCompare(b.continent),
    );
  };

  const eventsByContinent = await getEventsByContinent();

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
    availableSpeakers: uniqueSpeakers,
    eventsByContinent,
  };
  return NextResponse.json(
    {
      error: null,
      ...response,
    },
    { status: 200 },
  );
}
