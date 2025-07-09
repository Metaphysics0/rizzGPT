import { BlobStorageService } from "$lib/server/services/blob-storage.service";
import { GeminiService } from "$lib/server/services/gemini.service";
import type { RizzGPTFormData } from "$lib/types";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const POST = (async ({ request }) => {
  try {
    const { blobUrl, formData } = (await request.json()) as {
      blobUrl: string;
      formData: RizzGPTFormData;
    };

    const file = await new BlobStorageService().downloadFileFromBlob(blobUrl);
    const response = await new GeminiService().generateRizz({
      rizzGPTFormData: formData,
      file,
    });

    return json({
      success: true,
      data: response,
    });
  } catch (error) {
    return json({
      success: false,
      error: error instanceof Error ? error.message : "Processing failed",
    });
  }
}) satisfies RequestHandler;
