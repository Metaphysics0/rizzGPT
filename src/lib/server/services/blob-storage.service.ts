import { BLOB_READ_WRITE_TOKEN } from "$env/static/private";
import { generateClientTokenFromReadWriteToken } from "@vercel/blob/client";

export class BlobStorageService {
  constructor() {
    if (!BLOB_READ_WRITE_TOKEN) {
      throw new Error("BLOB_READ_WRITE_TOKEN is not set");
    }
  }

  private readonly ALLOWED_FILE_TYPES_FOR_CLIENT_UPLOAD = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "video/mp4",
    "video/quicktime",
    "video/x-msvideo",
  ];

  async generateClientToken(pathname: string) {
    if (!this.isFileTypeValidForClientUpload(pathname)) {
      throw new Error("Invalid file type");
    }

    const clientToken = await generateClientTokenFromReadWriteToken({
      token: BLOB_READ_WRITE_TOKEN,
      pathname,
    });

    return {
      type: "blob.generate-client-token",
      clientToken,
    };
  }

  async downloadFileFromBlob(blobUrl: string): Promise<File> {
    try {
      const fileResponse = await fetch(blobUrl);
      if (!fileResponse.ok) {
        throw new Error(
          `Failed to download file from blob: ${fileResponse.statusText}`
        );
      }

      const arrayBuffer = await fileResponse.arrayBuffer();
      const contentType =
        fileResponse.headers.get("content-type") || "image/jpeg";

      // Extract original filename from URL or use default
      const urlPath = new URL(blobUrl).pathname;
      const filename = urlPath.split("/").pop() || "uploaded-file";

      return new File([arrayBuffer], filename, {
        type: contentType,
      });
    } catch (error) {
      console.error("Failed to download file from blob:", error);
      throw new Error("Failed to download file from storage");
    }
  }

  private isFileTypeValidForClientUpload(pathname: string): boolean {
    const filename = pathname.split("/").pop() || "";
    const extension = filename.split(".").pop()?.toLowerCase() || "";
    const fileType = this.getContentTypeFromExtension(extension);
    return this.isFileTypeAllowed(fileType);
  }

  private isFileTypeAllowed(fileType: string): boolean {
    return this.ALLOWED_FILE_TYPES_FOR_CLIENT_UPLOAD.includes(fileType);
  }

  private getContentTypeFromExtension(extension: string): string {
    const typeMap: Record<string, string> = {
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      webp: "image/webp",
      mp4: "video/mp4",
      mov: "video/quicktime",
      avi: "video/x-msvideo",
    };

    return typeMap[extension] || "application/octet-stream";
  }
}
