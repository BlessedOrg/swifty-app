import { ticketSale } from "@/prisma/models";
import { NextResponse } from "next/server";
import { getUser } from "../../auth/[...thirdweb]/thirdwebAuth";

async function getUserEvents() {
  const loggedUser = await getUser();

  if (!loggedUser?.data?.["userId"]) {
    return NextResponse.json(
      {
        error: "User not logged in!",
        loggedUser,
      },
      {
        status: 401,
      },
    );
  } else {
    const tickets = await ticketSale.findMany({
      where: {
        seller: {
          id: loggedUser?.data?.["userId"],
        },
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
}

export { getUserEvents as GET };
