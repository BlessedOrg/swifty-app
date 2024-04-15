import { NextRequest, NextResponse } from "next/server";
import { getUploadUrl } from "services/uploadImagesToS3";

export async function UploadImageToS3(req: NextRequest) {
  const body = await req.json();
  const { key, fileType } = body;

  const uploadUrl = await getUploadUrl({
    fileType,
    key
  });

  return NextResponse.json(
    {  uploadUrl, uploadKey: key },
    { status: 200 },
  );
}
