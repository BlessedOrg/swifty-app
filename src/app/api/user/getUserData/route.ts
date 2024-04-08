import { NextResponse } from "next/server";
import { getUser } from "../../auth/[...thirdweb]/thirdwebAuth";

export async function GET() {
  const data = await getUser();
  return NextResponse.json(
    {
      data,
    },
    {
      status: 200,
    },
  );
}
