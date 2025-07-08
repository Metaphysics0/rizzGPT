import type { GeneratedResponse, RizzGPTFormData } from "$lib/types";

// Blob Storage Service Types
export interface UploadResult {
  url: string;
  filename: string;
  size: number;
  uploadedAt: string;
}

export interface JobResult {
  success: boolean;
  data?: GeneratedResponse;
  error?: string;
  processedAt: string;
}

export interface JobStatus {
  status: "processing" | "completed" | "failed" | "error";
  result?: GeneratedResponse;
  error?: string;
  jobId: string;
  message?: string;
  processedAt?: string;
}

// File validation types
export interface FileValidation {
  isValid: boolean;
  error?: string;
}

export const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "video/mp4",
  "video/quicktime",
  "video/x-msvideo",
] as const;

export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
