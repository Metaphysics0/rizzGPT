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

    // 3. Listen for job completion using Server-Sent Events
    return new Promise((resolve, reject) => {
      const eventSource = new EventSource(`/api/job-status-stream/${jobId}`);
      let isResolved = false;

      // Set up timeout (5 minutes max)
      const timeout = setTimeout(() => {
        if (!isResolved) {
          eventSource.close();
          reject(new Error("Processing timeout. Please try again."));
        }
      }, 5 * 60 * 1000); // 5 minutes

      // Handle status updates
      eventSource.addEventListener("status", (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log("Job status update:", data);

          if (data.status === "completed" && data.result) {
            isResolved = true;
            clearTimeout(timeout);
            eventSource.close();
            resolve(data.result);
          } else if (data.status === "failed" || data.status === "error") {
            isResolved = true;
            clearTimeout(timeout);
            eventSource.close();
            reject(new Error(data.error || "Processing failed"));
          }
          // If still processing, just wait for next update
        } catch (error) {
          console.error("Error parsing SSE data:", error);
        }
      });

      // Handle progress updates (optional - for future UI improvements)
      eventSource.addEventListener("progress", (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log("Job progress:", data);
          // Could emit this to a store for UI updates
        } catch (error) {
          console.error("Error parsing progress data:", error);
        }
      });

      // Handle connection close
      eventSource.addEventListener("close", (event) => {
        console.log("SSE connection closed by server");
        if (!isResolved) {
          clearTimeout(timeout);
          eventSource.close();
        }
      });

      // Handle errors
      eventSource.onerror = (error) => {
        console.error("SSE connection error:", error);
        if (!isResolved) {
          // Try fallback to polling once
          console.log("SSE failed, falling back to polling...");
          eventSource.close();
          clearTimeout(timeout);
          this.fallbackToPoll(jobId).then(resolve).catch(reject);
        }
      };

      // Handle heartbeat (keep connection alive)
      eventSource.addEventListener("heartbeat", (event) => {
        console.log("SSE heartbeat received");
      });
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

  /**
   * Fallback polling method when SSE fails
   */
  private async fallbackToPoll(jobId: string): Promise<GeneratedResponse> {
    console.log("Using fallback polling for job:", jobId);

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
}
