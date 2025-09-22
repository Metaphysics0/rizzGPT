import { BackblazeStorageService } from "$lib/server/services/backblaze-storage.service";

export async function downloadFileFromFilename(fileName: string): Promise<File> {
  try {
    const backblazeService = new BackblazeStorageService();
    const signedUrl = await backblazeService.getSignedDownloadUrl(fileName);

    const fileResponse = await fetch(signedUrl);
    if (!fileResponse.ok) {
      throw new Error(
        `Failed to download file: ${fileResponse.statusText}`
      );
    }

    const arrayBuffer = await fileResponse.arrayBuffer();
    const contentType =
      fileResponse.headers.get("content-type") || "image/jpeg";

    // Extract original filename from fileName or use default
    const filename = fileName.split("/").pop() || "uploaded-file";

    return new File([arrayBuffer], filename, { type: contentType });
  } catch (error) {
    console.error("Failed to download file from storage:", error);
    throw new Error("Failed to download file from storage");
  }
}

// Keep legacy function for backward compatibility during migration
export async function downloadFileFromUrl(blobUrl: string): Promise<File> {
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
