import { unknownErrorResponse } from "$lib/server/utils/response.util";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { BackblazeStorageService } from "$lib/server/services/backblaze-storage.service";

export const GET = (async () => {
  try {
    const response = await new BackblazeStorageService().getClientUploadUrl();
    return json(response);
  } catch (error) {
    console.error("Upload token endpoint error:", error);
    return unknownErrorResponse(error, "Upload token generation failed");
  }
}) satisfies RequestHandler;
