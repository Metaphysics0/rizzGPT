import { list, put } from "@vercel/blob";
import type {
  FileValidation,
  JobResult,
  JobStatus,
  UploadResult,
} from "../types";
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from "../types";

export class BlobStorageService {
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
        { access: "public" }
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
   */
  async getJobResult(jobId: string): Promise<JobStatus> {
    try {
      // List blobs to find our result file
      const { blobs } = await list({
        prefix: `results/${jobId}.json`,
        limit: 1,
      });

      if (blobs.length === 0) {
        // Job result not found, still processing
        return {
          status: "processing",
          jobId,
          message: "Job is still being processed...",
        };
      }

      // Fetch the result from the blob
      const resultUrl = blobs[0].url;
      const response = await fetch(resultUrl);

      if (!response.ok) {
        throw new Error(`Failed to fetch result: ${response.statusText}`);
      }

      const result: JobResult = await response.json();

      if (result.success) {
        return {
          status: "completed",
          result: result.data,
          jobId,
          processedAt: result.processedAt,
        };
      } else {
        return {
          status: "failed",
          error: result.error,
          jobId,
          processedAt: result.processedAt,
        };
      }
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

  /**
   * Validates a file before upload
   */
  private validateFile(file: File): FileValidation {
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return {
        isValid: false,
        error: `File too large. Maximum size is ${
          MAX_FILE_SIZE / 1024 / 1024
        }MB.`,
      };
    }

    // Check file type
    if (!ALLOWED_FILE_TYPES.includes(file.type as any)) {
      return {
        isValid: false,
        error: "Invalid file type. Only images and videos are allowed.",
      };
    }

    return { isValid: true };
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
