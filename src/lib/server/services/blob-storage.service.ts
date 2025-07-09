import { BLOB_READ_WRITE_TOKEN } from "$env/static/private";
import { list, put } from "@vercel/blob";
import { type HandleUploadBody, handleUpload } from "@vercel/blob/client";
import type {
  FileValidation,
  JobResult,
  JobStatus,
  UploadResult,
} from "../types";
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from "../types";

export class BlobStorageService {
  constructor() {
    if (!BLOB_READ_WRITE_TOKEN) {
      throw new Error("BLOB_READ_WRITE_TOKEN is not set");
    }
  }

  /**
   * Uploads a file to Vercel Blob storage
   */
  async uploadFile(file: File): Promise<UploadResult> {
    try {
      // Validate file
      const validation = this.validateFile(file);
      if (!validation.isValid) {
        throw new Error(validation.error);
      }

      // Generate unique filename
      const uniqueFilename = this.generateUniqueFilename(file.name);

      // Upload to blob storage
      const blob = await put(uniqueFilename, file, {
        access: "public",
        token: BLOB_READ_WRITE_TOKEN,
      });

      return {
        url: blob.url,
        filename: file.name,
        size: file.size,
        uploadedAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Blob upload error:", error);
      throw new Error(error instanceof Error ? error.message : "Upload failed");
    }
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

  /**
   * Downloads a file from blob storage and converts it to File object
   */
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

  private validateFile(file: File): FileValidation {
    if (file.size > MAX_FILE_SIZE) {
      return {
        isValid: false,
        error: `File too large. Maximum size is ${
          MAX_FILE_SIZE / 1024 / 1024
        }MB.`,
      };
    }

    if (!this.isFileTypeAllowed(file.type)) {
      return {
        isValid: false,
        error: "Invalid file type. Only images and videos are allowed.",
      };
    }

    return { isValid: true };
  }

  private isFileTypeAllowed(fileType: string): boolean {
    return ALLOWED_FILE_TYPES.includes(
      fileType as (typeof ALLOWED_FILE_TYPES)[number]
    );
  }

  /**
   * Handles client upload requests - generates tokens and processes completed uploads
   */
  async handleClientUpload(
    request: Request,
    body: HandleUploadBody,
    onUploadCompleted?: (body: {
      blob: any;
      tokenPayload?: string;
    }) => Promise<void>
  ) {
    return handleUpload({
      body,
      request,
      token: BLOB_READ_WRITE_TOKEN,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        // Extract filename from pathname for validation
        const filename = pathname.split("/").pop() || "";
        const extension = filename.split(".").pop()?.toLowerCase() || "";
        const fileType = this.getContentTypeFromExtension(extension);

        if (!this.isFileTypeAllowed(fileType)) {
          throw new Error("Invalid file type");
        }

        return {
          addRandomSuffix: true,
          allowedContentTypes: [...ALLOWED_FILE_TYPES],
          maximumSizeInBytes: MAX_FILE_SIZE,
          tokenPayload: clientPayload || "",
        };
      },
      onUploadCompleted: onUploadCompleted || (async () => {}),
    });
  }

  /**
   * Gets content type from file extension
   */
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

  /**
   * Generates a unique filename for uploads
   */
  private generateUniqueFilename(originalFilename: string): string {
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2);
    const extension = originalFilename.split(".").pop() || "bin";
    return `uploads/${timestamp}-${randomId}.${extension}`;
  }
}
