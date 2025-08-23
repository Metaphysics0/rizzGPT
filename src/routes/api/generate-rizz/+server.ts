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
    if (!blobUrl) return missingRequiredParametersErrorResponse(["blobUrl"]);

    const { conversationId } = await new ConversationGenerationService({
      blobUrl,
      relationshipContext,
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
