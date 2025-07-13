import {
  EdgeFunctionEndpoints,
  getServerSideEdgeFunctionUrl,
} from "$lib/constants/edge-function-endpoints.enum";
import type { ConversationGenerationRequest } from "$lib/server/services/conversation-generation.service";
import { ConversationGenerationService } from "$lib/server/services/conversation-generation.service";
import { SubscriptionService } from "$lib/server/services/subscription.service";
import {
  jsonErrorResponse,
  jsonSuccessResponse,
  missingRequiredParametersErrorResponse,
  unknownErrorResponse,
} from "$lib/server/utils/api-response.util";
import type { RequestHandler } from "./$types";

export const POST = (async ({ request, locals }) => {
  try {
    const dbUser = locals.dbUser!;

    const { blobUrl, relationshipContext } = await request.json();
    if (!blobUrl) {
      return missingRequiredParametersErrorResponse(["blobUrl"]);
    }

    const subscriptionService = new SubscriptionService();
    const canGenerate = await subscriptionService.canGenerateConversation(
      dbUser.id
    );

    if (!canGenerate.allowed) {
      return jsonErrorResponse(
        canGenerate.reason || "Unable to generate conversation",
        canGenerate.reason === "Usage limit reached" ? 403 : 402
      );
    }

    const backgroundJobUrl = getServerSideEdgeFunctionUrl(
      request,
      EdgeFunctionEndpoints.GENERATE_RIZZ
    );

    const conversationGenerationRequest: ConversationGenerationRequest = {
      userId: dbUser.id,
      blobUrl,
      relationshipContext,
    };

    const result = await new ConversationGenerationService({
      conversationGenerationRequest,
      backgroundJobUrl,
    }).initiateConversationGeneration();

    // Increment usage count after successful conversation creation
    await subscriptionService.incrementConversationUsage(
      dbUser.id,
      result.conversationId
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
