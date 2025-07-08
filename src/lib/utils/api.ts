import type { GeneratedResponse, RizzGPTFormData } from "$lib/types";

export const api = {
  async uploadFile(
    file: File
  ): Promise<{ url: string; filename: string; size: number }> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Upload failed");
    }

    return response.json();
  },

  async submitProcessingJob(
    blobUrl: string,
    formData: RizzGPTFormData
  ): Promise<{ jobId: string }> {
    const jobId = crypto.randomUUID();

    // Trigger background processing using Edge Function
    const response = await fetch("/api/process-job", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ blobUrl, formData, jobId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || "Failed to start background processing"
      );
    }

    return { jobId };
  },

  async checkJobStatus(jobId: string): Promise<{
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
  },

  async generateRizz(
    formData: RizzGPTFormData,
    file: File
  ): Promise<GeneratedResponse> {
    // 1. Upload file to blob storage
    const { url: blobUrl } = await this.uploadFile(file);

    // 2. Submit processing job
    const { jobId } = await this.submitProcessingJob(blobUrl, formData);

    // 3. Poll for completion
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
  },
};
