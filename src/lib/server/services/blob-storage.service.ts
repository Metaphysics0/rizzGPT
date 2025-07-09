import { BLOB_READ_WRITE_TOKEN } from "$env/static/private";
import { list, put } from "@vercel/blob";
import { generateClientTokenFromReadWriteToken } from "@vercel/blob/client";
import type { JobResult, JobStatus } from "../types";

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

  /**
   * Stores job processing result in blob storage
   */
  async storeJobResult(jobId: string, result: JobResult): Promise<string> {
    try {
      const resultBlob = await put(
        `results/${jobId}.json`,
        JSON.stringify(result),
        {
          access: "public",
          token: BLOB_READ_WRITE_TOKEN,
        }
      );

      console.log(`Job ${jobId} result stored at: ${resultBlob.url}`);
      return resultBlob.url;
    } catch (error) {
      console.error(`Failed to store result for job ${jobId}:`, error);
      throw new Error("Failed to store job result");
    }
  }

  /**
   * Retrieves job processing result from blob storage
   * Note: Vercel Blob automatically adds hashes to filenames, so we search by prefix
   */
  async getJobResult(jobId: string): Promise<JobStatus> {
    try {
      const { blobs } = await list({
        prefix: `results/${jobId}`,
        limit: 1,
        token: BLOB_READ_WRITE_TOKEN,
      });

      const resultBlob = blobs[0];

      if (!resultBlob) {
        console.log(`No result blob found for job ${jobId}, still processing`);
        return {
          status: "processing",
          jobId,
          message: "Job is still being processed...",
        };
      }

      console.log(`Found result blob for job ${jobId}: ${resultBlob.url}`);

      // Fetch the result from the blob
      const response = await fetch(resultBlob.url);

      if (!response.ok) {
        throw new Error(`Failed to fetch result: ${response.statusText}`);
      }

      const result: JobResult = await response.json();
      console.log(`Job ${jobId} result:`, result);

      if (result.success) {
        return {
          status: "completed",
          result: result.data,
          jobId,
          processedAt: result.processedAt,
        };
      }

      return {
        status: "failed",
        error: result.error,
        jobId,
        processedAt: result.processedAt,
      };
    } catch (error) {
      console.log(`Job ${jobId} result not ready:`, error);
      return {
        status: "processing",
        jobId,
        message: "Job is still being processed...",
      };
    }
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
