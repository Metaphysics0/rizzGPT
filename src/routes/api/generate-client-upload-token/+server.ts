import { BlobStorageService } from "$lib/server/services/blob-storage.service";
import {
  jsonSuccessResponse,
  unknownErrorResponse,
  unprocessableEntityResponse,
} from "$lib/server/utils/api-response.util";
import { requireAuth } from "$lib/server/utils/require-auth.util";
import type { RequestHandler } from "./$types";

export const POST = (async ({ request }) => {
  try {
    const authResult = await requireAuth(request);
    if (authResult.error) return authResult.error;

    const body = (await request.json()) as {
      payload: { pathname: string; clientPayload: string; callbackUrl: string };
    };

    if (!body) return unprocessableEntityResponse("Request body is required");

    const response = await new BlobStorageService().generateClientToken(
      body.payload.pathname
    );

    return jsonSuccessResponse(response);
  } catch (error) {
    console.error("Upload token endpoint error:", error);
    return unknownErrorResponse(error, "Upload token generation failed");
  }
}) satisfies RequestHandler;
