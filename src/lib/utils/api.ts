import type { GeneratedResponse, RizzGPTFormData } from "$lib/types";
import { upload } from "@vercel/blob/client";

export class ApiService {
  async generateRizz(
    formData: RizzGPTFormData,
    file: File
  ): Promise<GeneratedResponse> {
    // Generate unique job ID
    const jobId = crypto.randomUUID();

    // 1. Upload file using client upload with job processing triggered on completion
    const blob = await this.uploadFileClient(file, formData, jobId);

    // 2. Check if we're on localhost and trigger manual job processing if needed
    const isLocalhost =
      typeof window !== "undefined" &&
      (window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1" ||
        window.location.hostname.includes("localhost"));

    if (isLocalhost) {
      console.log("🔧 Localhost detected - manually triggering job processing");

      // Wait a moment for potential onUploadCompleted, then trigger manually
      await new Promise((resolve) => setTimeout(resolve, 1000));

      try {
        await this.triggerJobManually(blob.url, formData, jobId);
      } catch (error) {
        console.error("Failed to trigger job manually:", error);
        // Continue anyway, maybe onUploadCompleted worked
      }
    }

    // 3. Poll for job completion (processing starts automatically after upload)
    return new Promise((resolve, reject) => {
      let pollCount = 0;
      const maxPolls = 150; // 5 minutes max (2 second intervals)

      const poll = async () => {
        try {
          pollCount++;

          if (pollCount > maxPolls) {
            reject(new Error("Processing timeout. Please try again."));
            return;
          }

          const { status, result, error } = await this.checkJobStatus(jobId);

          if (status === "completed" && result) {
            resolve(result);
          } else if (status === "failed" || status === "error") {
            reject(new Error(error || "Processing failed"));
          } else {
            // Still processing, poll again
            setTimeout(poll, 2000);
          }
        } catch (error) {
          reject(error);
        }
      };

      // Start polling immediately
      poll();
    });
  }

  /**
   * Upload file using client-side upload with automatic job processing
   */
  private async uploadFileClient(
    file: File,
    formData: RizzGPTFormData,
    jobId: string
  ): Promise<any> {
    // Generate unique filename
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2);
    const extension = file.name.split(".").pop() || "bin";
    const pathname = `uploads/${timestamp}-${randomId}.${extension}`;

    // Upload directly to Vercel Blob with job processing payload
    const blob = await upload(pathname, file, {
      access: "public",
      handleUploadUrl: "/api/upload-token",
      clientPayload: JSON.stringify({ formData, jobId }),
    });

    console.log("File uploaded successfully:", blob.url);
    return blob;
  }

  /**
   * Manually trigger job processing (fallback for localhost development)
   */
  private async triggerJobManually(
    blobUrl: string,
    formData: RizzGPTFormData,
    jobId: string
  ): Promise<void> {
    const response = await fetch("/api/trigger-job", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ blobUrl, formData, jobId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to trigger job manually");
    }

    console.log("Job triggered manually successfully");
  }

  private async checkJobStatus(jobId: string): Promise<{
    status: "processing" | "completed" | "failed" | "error";
    result?: GeneratedResponse;
    error?: string;
    jobId: string;
    message?: string;
  }> {
    const response = await fetch(`/api/job-status/${jobId}`);
    if (!response.ok) {
      throw new Error("Failed to check job status");
    }
    return response.json();
  }
}
