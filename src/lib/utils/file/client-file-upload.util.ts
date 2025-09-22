// import { BLOB_READ_WRITE_TOKEN } from "$env/static/private";
import { upload } from "@vercel/blob/client";

export async function triggerClientFileUpload(file: File): Promise<string> {
  const timestamp = Date.now();
  const randomId = Math.random().toString(36).substring(2);
  const extension = file.name.split(".").pop() || "bin";
  const pathname = `uploads/${timestamp}-${randomId}.${extension}`;

  const blob = await upload(pathname, file, {
    access: "public",
    handleUploadUrl: "/api/generate-client-upload-token",
    clientPayload: "",
  });
  return blob.url;
}
