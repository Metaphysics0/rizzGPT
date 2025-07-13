import { BlobStorageService } from "$lib/server/services/blob-storage.service";
import {
  unknownErrorResponse,
  unprocessableEntityResponse,
} from "$lib/server/utils/api-response.util";
import { requireAuth } from "$lib/server/utils/require-auth.util";
import type { ClientFileUploadPayload } from "$lib/types";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const POST = (async ({ request }) => {
  try {
    const authResult = await requireAuth(request);
    if (authResult.error) return authResult.error;

    const body = (await request.json()) as { payload: ClientFileUploadPayload };

    if (!body) return unprocessableEntityResponse("Request body is required");

    console.log(
      "Generating upload token for user",
      authResult.user.id,
      "for path",
      body.payload.pathname
    );

    const response = await new BlobStorageService().generateClientToken(
      body.payload.pathname
    );

    return json(response);
  } catch (error) {
    console.error("Upload token endpoint error:", error);
    return unknownErrorResponse(error, "Upload token generation failed");
  }
}) satisfies RequestHandler;
