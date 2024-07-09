import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/server/auth";

export async function GET(req: NextRequest) {
  try {
    const userData = await getUser();
    return NextResponse.json({ data: userData }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { data: null, error: error.message },
      { status: error.message.includes("Not authorized") ? 401 : 400 }
    );
  }
}
