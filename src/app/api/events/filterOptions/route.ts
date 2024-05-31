import { NextResponse } from "next/server";
import { eventLocation, speaker } from "@/prisma/models";
import { revalidatePath } from "next/cache";

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  try {
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

    const speakers = await speaker.findMany();
    const availableSpeakers = speakers.map((speaker) => {
      return {
        label: speaker?.name,
        value: speaker.id,
        avatarUrl: speaker?.avatarUrl || null,
      };
    });

    const uniqueSpeakers = availableSpeakers.filter(
      (speaker, index, self) =>
        index === self.findIndex((s) => s.value === speaker.value),
    );
    revalidatePath(req.url);
    return NextResponse.json(
      {
        error: null,
        availableSpeakers: uniqueSpeakers,
        eventsByContinent,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: (error as any)?.message },
      { status: 400 },
    );
  }
}
