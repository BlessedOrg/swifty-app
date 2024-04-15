import axios from "axios";
import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const BUCKET_NAME = "creatorshub";
const REGION = "eu-central-1";
const s3 = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY as string,
  }
});

export async function uploadBrowserFilesToS3(files: File[]) {
  return await Promise.all(
    files.map(async (file, index) => {
      const { name: fileName, type: fileType, size: fileSize } = file;
      const uploadKey = `events/${Date.now()}/${index+1}/${fileName}`;

      if (uploadKey.startsWith("/")) {
        throw new Error("Upload url must not start with '/'");
      }

      const response = await fetch("/api/s3", {
        method: "POST",
        body: JSON.stringify({ key: uploadKey, fileType: file.type }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const { uploadUrl } = await response.json();

      await axios.put(uploadUrl, file, {
        headers: {
          "Content-Type": file.type,
        }
      });

      const fileUrlResponse = await fetch(`/api/s3?key=${uploadKey}`);
      const { fileUrl } = await fileUrlResponse.json();
      const [uploadedFileUrl] = fileUrl.split("?");

      return {
        fileName,
        fileSize,
        fileType,
        uploadedFileUrl,
        uploadedFileKey: uploadKey,
        preview: uploadedFileUrl,
        type: "eventImage",
        key: uploadKey,
      };
    })
  );
}

export const getPublicUrl = async (key, attachmentMode = false) => {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    ResponseContentDisposition: attachmentMode ? "attachment" : "inline"
  });
  return await getSignedUrl(s3, command, { expiresIn: 3600 });
};

export const getUploadUrl = async ({ fileType, key, acl = "private" }) => {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    ContentType: fileType,
    ACL: "public-read",
  });
  return await getSignedUrl(s3, command, { expiresIn: 3600 });
};