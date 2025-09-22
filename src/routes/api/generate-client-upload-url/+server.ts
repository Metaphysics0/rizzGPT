import { unknownErrorResponse } from "$lib/server/utils/response.util";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { backblazeStorageService } from "$lib/server/services/backblaze-storage.service";

export const GET = (async () => {
  try {
    const response = await backblazeStorageService.getClientUploadUrl();
    return json(response);
  } catch (error) {
    console.error("Upload token endpoint error:", error);
    return unknownErrorResponse(error, "Upload token generation failed");
  }
}) satisfies RequestHandler;
