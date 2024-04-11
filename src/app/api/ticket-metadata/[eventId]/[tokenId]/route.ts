import { ticketSale } from "@/prisma/models";
import { type NextRequest } from 'next/server'

export async function GET(req: NextRequest, { params }: { params: { eventId: string, tokenId: string } }) {
  try {
    const { eventId, tokenId } = params;
  
    if(!eventId) {
      throw new Error('eventId is required')
    }
  
    const sale = await ticketSale.findUnique({
      where: {
        id: eventId,
      },
    });
  
    return Response.json({
      name: `${sale?.title} #${tokenId.replace(".json", "")}`,
      description: sale?.description,
      image: sale?.coverUrl,
      external_url: `https://blessed.fan/event/${eventId}`,
     });
  } catch (error) {
    return Response.json({ error: error?.message }, { status: 400 });
  }
}