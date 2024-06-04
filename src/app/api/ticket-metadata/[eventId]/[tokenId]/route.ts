import { ticketSale } from "@/prisma/models";
import { type NextRequest } from 'next/server'
import getMatchingKey from "@/utils/getMatchingKeyByValue";

const baseUrl = "https://blessed.fan";

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
      include: {
        ticketMints: {
          where: {
            tokenId
          }
        }
      }
    });
    
    const phase = getMatchingKey(
      {
        LotteryV1: sale?.lotteryV1nftAddr,
        LotteryV2: sale?.lotteryV2nftAddr,
        AuctionV1: sale?.auctionV1nftAddr,
        AuctionV2: sale?.auctionV2nftAddr
      },
      (sale as any)?.ticketMints[0]?.contractAddr
    );

    // 🚧 Temporary solution with MS tickets.
    const imagePath = phase?.includes("Lottery") ? "images/cover-personalized-ticket.png" : "images/cover-auctions.png";

    // 🚧 We can as well read here from the Smart Contract the name and the symbol if needed
  
    return Response.json({
      name: `${sale?.title} #${tokenId.replace(".json", "")}`,
      description: sale?.description,
      image: `${baseUrl}/${imagePath}`,
      external_url: `${baseUrl}/event/${eventId}`,
     });
  } catch (error) {
    return Response.json({ error: (error as Error)?.message }, { status: 400 });
  }
}