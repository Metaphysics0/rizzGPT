import { EdgeFunctionEndpoints } from "$lib/constants/edge-function-endpoints.enum";
import type { ConversationGenerationRequest } from "$lib/server/services/conversation-generation.service";
import { ConversationGenerationService } from "$lib/server/services/conversation-generation.service";
import {
  jsonErrorResponse,
  jsonSuccessResponse,
  missingRequiredParametersErrorResponse,
  unknownErrorResponse,
} from "$lib/server/utils/api-response.util";
import { requireAuth } from "$lib/server/utils/require-auth.util";
import type { RequestHandler } from "./$types";

export const POST = (async ({ request }) => {
  try {
    const authResult = await requireAuth(request);
    if (authResult.error) return authResult.error;

    if (!authResult.dbUser) {
      return jsonErrorResponse("User not found in database", 401);
    }

    const { blobUrl, relationshipContext } = await request.json();
    if (!blobUrl || !relationshipContext) {
      return missingRequiredParametersErrorResponse([
        "blobUrl",
        "relationshipContext",
      ]);
    }

    const conversationRequest: ConversationGenerationRequest = {
      userId: authResult.dbUser.id,
      blobUrl,
      relationshipContext,
    };

    const conversationService = new ConversationGenerationService();
    const generateRizzUrl =
      new URL(request.url).origin + EdgeFunctionEndpoints.GENERATE_RIZZ;
    console.log("url", generateRizzUrl);

    const result = await conversationService.initiateConversationGeneration(
      conversationRequest,
      generateRizzUrl
    );

    return jsonSuccessResponse(result);
  } catch (error) {
    console.error("Trigger generate rizz endpoint error:", error);
    return unknownErrorResponse(
      error,
      "Failed to initiate conversation generation"
    );
  }
}) satisfies RequestHandler;
