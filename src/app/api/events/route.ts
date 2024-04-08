import { ticketSale, user } from "@/prisma/models";
import { NextResponse } from "next/server";
import { CreateEvent } from "./createEvent";
import { getUser } from "../auth/[...thirdweb]/thirdwebAuth";

async function GetUserEvents(req: Request, res: Response) {
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

export { CreateEvent as POST, GetUserEvents as GET };
