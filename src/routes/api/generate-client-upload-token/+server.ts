import { BlobStorageService } from "$lib/server/services/blob-storage.service";
import {
  unknownErrorResponse,
  unprocessableEntityResponse,
} from "$lib/server/utils/response.util";
import type { ClientFileUploadPayload } from "$lib/types";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const POST = (async ({ request }) => {
  try {
    const body = (await request.json()) as { payload: ClientFileUploadPayload };
    if (!body) return unprocessableEntityResponse("Request body is required");

    const response = await new BlobStorageService().generateClientToken(
      body.payload.pathname
    );

    return json(response);
  } catch (error) {
    console.error("Upload token endpoint error:", error);
    return unknownErrorResponse(error, "Upload token generation failed");
  }
}) satisfies RequestHandler;
