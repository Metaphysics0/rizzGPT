import type { RizzGPTFormData } from "$lib/types";

/**
 * Service for invoking Edge Functions for background processing
 */
export class EdgeFunctionInvokerService {
  private readonly baseUrl: string;

  constructor() {
    // Use environment variable or default to localhost for development
    this.baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:5173";
  }

  /**
   * Invokes the background job processing Edge Function
   */
  async invokeBackgroundJob(
    jobId: string,
    blobUrl: string,
    formData: RizzGPTFormData
  ): Promise<{
    success: boolean;
    jobId: string;
    message?: string;
    error?: string;
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/api/process-job`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Include authorization headers if needed
          ...(process.env.VERCEL_INTERNAL_TOKEN && {
            Authorization: `Bearer ${process.env.VERCEL_INTERNAL_TOKEN}`,
          }),
        },
        body: JSON.stringify({
          jobId,
          blobUrl,
          formData,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP ${response.status}: ${response.statusText}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error(`Failed to invoke edge function for job ${jobId}:`, error);
      throw new Error(
        error instanceof Error
          ? error.message
          : "Failed to invoke background processing"
      );
    }
  }

  /**
   * Directly triggers background processing without waiting for response
   * Useful for fire-and-forget scenarios
   */
  async triggerBackgroundJobAsync(
    jobId: string,
    blobUrl: string,
    formData: RizzGPTFormData
  ): Promise<void> {
    // Fire and forget - don't wait for the response
    fetch(`${this.baseUrl}/api/process-job`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.VERCEL_INTERNAL_TOKEN && {
          Authorization: `Bearer ${process.env.VERCEL_INTERNAL_TOKEN}`,
        }),
      },
      body: JSON.stringify({
        jobId,
        blobUrl,
        formData,
      }),
    }).catch((error) => {
      console.error(
        `Background job invocation failed for job ${jobId}:`,
        error
      );
    });
  }

  /**
   * Alternative method using direct service invocation (development only)
   * This bypasses HTTP and calls the service directly
   */
  async invokeJobDirectly(
    jobId: string,
    blobUrl: string,
    formData: RizzGPTFormData
  ): Promise<void> {
    // Only use in development environment
    if (process.env.NODE_ENV !== "development") {
      throw new Error(
        "Direct invocation is only available in development mode"
      );
    }

    const { JobProcessingService } = await import("./job-processing.service");
    const jobService = new JobProcessingService();

    try {
      await jobService.processJobSafe(jobId, blobUrl, formData);
    } catch (error) {
      console.error(`Direct job processing failed for job ${jobId}:`, error);
      throw error;
    }
  }
}
