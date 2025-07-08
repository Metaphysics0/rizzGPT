import type { RizzGPTFormData } from "$lib/types";
import type { JobResult } from "../types";
import { BlobStorageService } from "./blob-storage.service";
import { GeminiService } from "./gemini.service";

export class JobProcessingService {
  private blobService: BlobStorageService;
  private geminiService: GeminiService;

  constructor() {
    this.blobService = new BlobStorageService();
    this.geminiService = new GeminiService();
  }

  /**
   * Processes a job with the given parameters
   */
  async processJob(
    jobId: string,
    blobUrl: string,
    formData: RizzGPTFormData
  ): Promise<void> {
    console.log(`Starting job ${jobId} processing for blob: ${blobUrl}`);

    try {
      // Download file from blob storage
      const file = await this.blobService.downloadFileFromBlob(blobUrl);

      // Process with Gemini
      const response = await this.geminiService.generateRizz({
        rizzGPTFormData: formData,
        file,
      });

      // Store successful result
      const successResult: JobResult = {
        success: true,
        data: response,
        processedAt: new Date().toISOString(),
      };

      await this.blobService.storeJobResult(jobId, successResult);
      console.log(`Job ${jobId} completed successfully`);
    } catch (error) {
      console.error(`Job ${jobId} processing failed:`, error);

      // Store error result
      const errorResult: JobResult = {
        success: false,
        error: error instanceof Error ? error.message : "Processing failed",
        processedAt: new Date().toISOString(),
      };

      try {
        await this.blobService.storeJobResult(jobId, errorResult);
        console.log(`Job ${jobId} error stored`);
      } catch (storeError) {
        console.error(`Failed to store error for job ${jobId}:`, storeError);
        // Re-throw the original error since we couldn't even store the error result
        throw error;
      }
    }
  }

  /**
   * Validates job parameters before processing
   */
  private validateJobParams(
    jobId: string,
    blobUrl: string,
    formData: RizzGPTFormData
  ): void {
    if (!jobId?.trim()) {
      throw new Error("Job ID is required");
    }

    if (!blobUrl?.trim()) {
      throw new Error("Blob URL is required");
    }

    if (!formData) {
      throw new Error("Form data is required");
    }

    // Validate URL format
    try {
      new URL(blobUrl);
    } catch {
      throw new Error("Invalid blob URL format");
    }
  }

  /**
   * Processes a job with validation
   */
  async processJobSafe(
    jobId: string,
    blobUrl: string,
    formData: RizzGPTFormData
  ): Promise<void> {
    // Validate parameters
    this.validateJobParams(jobId, blobUrl, formData);

    // Process the job
    await this.processJob(jobId, blobUrl, formData);
  }
}
