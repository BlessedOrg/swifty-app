import { ticketSale } from "@/prisma/models";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getUser } from "@/server/auth";

export const dynamic = "force-dynamic";

async function getUserEvents(req: Request) {
  const loggedUser: any = await getUser();

  console.log(loggedUser);
  if (!loggedUser?.data?.["id"]) {
    return NextResponse.json(
      {
        error: "User not logged in!",
        loggedUser,
      },
      {
        status: 401,
      }
    );
  } else {
    const tickets = await ticketSale.findMany({
      where: {
        seller: {
          id: loggedUser?.data?.["id"],
        },
      },
      include: {
        eventLocation: true,
        speakers: true,
      },
    });
    revalidatePath(req.url);
    return NextResponse.json(
      {
        error: null,
        tickets,
      },
      { status: 200 }
    );
  }
}

export { getUserEvents as GET };
