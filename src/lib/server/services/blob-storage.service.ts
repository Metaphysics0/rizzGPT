import { BLOB_READ_WRITE_TOKEN } from "$env/static/private";
import { generateClientTokenFromReadWriteToken } from "@vercel/blob/client";

export class BlobStorageService {
  constructor() {
    if (!BLOB_READ_WRITE_TOKEN) {
      throw new Error("BLOB_READ_WRITE_TOKEN is not set");
    }
  }

  readonly ALLOWED_CONTENT_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "video/mp4",
    "video/quicktime",
    "video/x-msvideo",
  ];

  readonly fileExtensionToContentTypeMap: Record<string, string> = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    webp: "image/webp",
    mp4: "video/mp4",
    mov: "video/quicktime",
    avi: "video/x-msvideo",
  };

  async generateClientToken(pathname: string) {
    this.ensureFileTypeIsValidForClientUpload(pathname);

    const clientToken = await generateClientTokenFromReadWriteToken({
      token: BLOB_READ_WRITE_TOKEN,
      pathname,
    });

    return {
      type: "blob.generate-client-token",
      clientToken,
    };
  }

  async downloadFileFromBlobUrl(blobUrl: string): Promise<File> {
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

      return new File([arrayBuffer], filename, { type: contentType });
    } catch (error) {
      console.error("Failed to download file from blob:", error);
      throw new Error("Failed to download file from storage");
    }
  }

  private ensureFileTypeIsValidForClientUpload(pathname: string): void {
    const filename = pathname.split("/").pop() || "";
    const extension = filename.split(".").pop()?.toLowerCase() || "";
    const contentType = this.getContentTypeFromFileExtension(extension);
    if (!this.isContentTypeAllowed(contentType)) {
      throw new Error(
        `Invalid content type. Recieved ${contentType} but allowed ${this.ALLOWED_CONTENT_TYPES.join(
          ", "
        )}`
      );
    }
  }

  private isContentTypeAllowed(contentType: string): boolean {
    return this.ALLOWED_CONTENT_TYPES.includes(contentType);
  }

  private getContentTypeFromFileExtension(extension: string): string {
    return (
      this.fileExtensionToContentTypeMap[extension] ||
      "application/octet-stream"
    );
  }
}
