import { BlobStorageService } from "$lib/server/services/blob-storage.service";
import { GeminiService } from "$lib/server/services/gemini.service";
import {
  jsonSuccessResponse,
  unknownErrorResponse,
} from "$lib/server/utils/api-response.util";
import type { RizzGPTFormData } from "$lib/types";
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

    return jsonSuccessResponse(response);
  } catch (error) {
    return unknownErrorResponse(error, "Processing failed");
  }
}) satisfies RequestHandler;
