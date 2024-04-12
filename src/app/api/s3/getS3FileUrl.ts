import { NextRequest, NextResponse } from "next/server";
import { getPublicUrl } from "services/uploadImagesToS3";

export async function getS3FileUrl(req: NextRequest) {
  const key = req.nextUrl.searchParams.get("key");
  const fileUrl = await getPublicUrl(key);
  return NextResponse.json(
    { fileUrl },
    { status: 200 },
  );
}
