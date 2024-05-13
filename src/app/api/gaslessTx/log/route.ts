import { log } from "@/prisma/models";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, { params }) {
  try {
    const body = await req.json();
    const { gasSaved, userId, taskId } = body;

    const newLog = await log.create({
      data: {
        userId: userId,
        type: "gasSaved",
        payload: {
          type: "gaslessTx",
          gasSaved,
          gelatoTaskId: taskId
        }
      }
    });

    return NextResponse.json(
      { error: null, log: newLog },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: (error as any)?.message },
      { status: 400 },
    );
  }
}
