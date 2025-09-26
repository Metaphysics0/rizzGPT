import { userStore } from "$lib/stores/user.svelte";
import { mediaCache } from "$lib/stores/image-preview.svelte";
import { triggerClientFileUpload } from "./client-file-upload.util";

export type UploadedFile = {
  name: string;
  type: string;
  uploadedAt: number;
  size: number;
  url: Promise<string>;
  fileName: string; // the server filename
};

export class FileUploadHandler {
  private onFileUploaded: (fileName: string) => void;
  private onFileUploadError: (error: string) => void;

  constructor(options: {
    onFileUploaded: (fileName: string) => void;
    onFileUploadError: (error: string) => void;
  }) {
    this.onFileUploaded = options.onFileUploaded;
    this.onFileUploadError = options.onFileUploadError;
  }

  async uploadFile(file: File): Promise<UploadedFile> {
    if (!userStore.user) {
      throw new Error("User not authenticated");
    }

    const previewUrl = URL.createObjectURL(file);
    const isVideo = file.type.startsWith("video/");

    const uploadPromise = this.performUpload(file, previewUrl, isVideo);

    const uploadedFile: UploadedFile = {
      name: file.name,
      type: file.type,
      uploadedAt: Date.now(),
      size: file.size,
      fileName: "", // will be set after upload
      url: uploadPromise.then((result) => result.previewUrl),
    };

    // Set fileName after upload completes
    uploadPromise
      .then((result) => {
        uploadedFile.fileName = result.fileName;
      })
      .catch(() => {
        // Error already handled in performUpload
      });

    return uploadedFile;
  }

  private async performUpload(
    file: File,
    previewUrl: string,
    isVideo: boolean
  ): Promise<{ previewUrl: string; fileName: string }> {
    try {
      if (!userStore.user) {
        throw new Error("No user, unable to perform upload");
      }
      const fileName = await triggerClientFileUpload(file, userStore.user.id);

      // Cache the uploaded media
      mediaCache.set(fileName, previewUrl, isVideo);

      // Notify about successful upload
      this.onFileUploaded(fileName);

      // Return both the preview URL and server fileName
      return { previewUrl, fileName };
    } catch (error) {
      console.error("Failed to upload file:", error);
      URL.revokeObjectURL(previewUrl);
      this.onFileUploadError?.(
        error instanceof Error ? error.message : "Upload failed"
      );
      throw error;
    }
  }

  static revokeObjectURL(url: string) {
    URL.revokeObjectURL(url);
  }
}
