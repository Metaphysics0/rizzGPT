import { isEdgeFunctionEndpoint } from "$lib/constants/edge-function-endpoints.enum";
import { requireAuth } from "$lib/server/auth";
import { QstashService } from "$lib/server/services/qstash.service";
import {
  jsonErrorResponse,
  jsonSuccessResponse,
  unknownErrorResponse,
} from "$lib/server/utils/api-response.util";
import type { RequestHandler } from "./$types";

export const POST = (async ({ request }) => {
  try {
    const authResult = await requireAuth(request);
    if (authResult.error) return authResult.error;

    if (!authResult.dbUser) {
      return jsonErrorResponse("User not found in database", 401);
    }

    const { messageBody, url } = await request.json();
    if (!isEdgeFunctionEndpoint(url)) return jsonErrorResponse("Invalid URL");

    await new QstashService().publishWithAuth({
      url,
      body: messageBody,
      userId: authResult.dbUser.id,
    });

    return jsonSuccessResponse({});
  } catch (error) {
    console.error("Trigger endpoint error:", error);
    return unknownErrorResponse(error, "Trigger endpoint error");
  }
}) satisfies RequestHandler;
