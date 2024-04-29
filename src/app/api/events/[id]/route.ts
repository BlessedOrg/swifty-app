import { NextResponse } from "next/server";
import { ticketSale } from "@/prisma/models";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

export async function GET(req: Request, { params }) {
  const { id } = params;

  if (!id) {
    return NextResponse.json(
      {
        error: "Provide correct ID",
      },
      { status: 400 },
    );
  }

  const ticket = await ticketSale.findUnique({
    where: { id },
    include: {
      eventLocation: true,
      speakers: true,
    },
  });

  revalidatePath(req.url);

  return NextResponse.json(
    {
      error: null,
      event: ticket,
    },
    { status: 200 },
  );
}
