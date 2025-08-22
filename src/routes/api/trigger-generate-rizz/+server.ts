import {
  EdgeFunctionEndpoints,
  getServerSideEdgeFunctionUrl,
} from "$lib/constants/edge-function-endpoints.enum";
import type { ConversationGenerationRequest } from "$lib/server/services/conversation-generation.service";
import { ConversationGenerationService } from "$lib/server/services/conversation-generation.service";
import {
  jsonSuccessResponse,
  missingRequiredParametersErrorResponse,
  unknownErrorResponse,
} from "$lib/server/utils/api-response.util";
import type { RequestHandler } from "./$types";

export const POST = (async ({ request }) => {
  try {
    const { blobUrl, relationshipContext } = await request.json();
    if (!blobUrl) {
      return missingRequiredParametersErrorResponse(["blobUrl"]);
    }

    const backgroundJobUrl = getServerSideEdgeFunctionUrl(
      request,
      EdgeFunctionEndpoints.GENERATE_RIZZ
    );

    const conversationGenerationRequest: ConversationGenerationRequest = {
      blobUrl,
      relationshipContext,
    };

    const { conversationId } = await new ConversationGenerationService({
      conversationGenerationRequest,
      backgroundJobUrl,
    }).initiateConversationGeneration();

    return jsonSuccessResponse({ conversationId });
  } catch (error) {
    console.error("Trigger generate rizz endpoint error:", error);
    return unknownErrorResponse(
      error,
      "Failed to initiate conversation generation"
    );
  }
}) satisfies RequestHandler;
