import type { GeneratedResponse, RizzGPTFormData } from "$lib/types";
import { upload } from "@vercel/blob/client";

export class ApiService {
  async generateRizz(
    formData: RizzGPTFormData,
    file: File
  ): Promise<GeneratedResponse> {
    const jobId = crypto.randomUUID();
    const blob = await this.uploadFileClient(file, formData, jobId);
    const response = await fetch("/api/edge-functions/generate-rizz", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ blobUrl: blob.url, formData }),
    });
    const { data } = await response.json();

    return data;
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

    const blob = await upload(pathname, file, {
      access: "public",
      handleUploadUrl: "/api/upload-token",
      clientPayload: JSON.stringify({ formData }),
    });

    console.log("File uploaded successfully:", blob.url);
    return blob;
  }
}
