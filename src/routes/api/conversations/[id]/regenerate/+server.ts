import { ConversationRegenerationService } from "$lib/server/services/conversation-regeneration.service";
import {
  jsonErrorResponse,
  jsonSuccessResponse,
  unknownErrorResponse,
} from "$lib/server/utils/response.util";
import type { RequestHandler } from "./$types";

export const POST = (async ({ params, locals }) => {
  try {
    if (!params.id) {
      return jsonErrorResponse("Conversation ID is required", 400);
    }

    const user = locals.user;
    if (!user) return jsonErrorResponse("Unauthorized", 401);

    const conversationId = params.id;
    const regenerationService = new ConversationRegenerationService();

    const result = await regenerationService.regenerateRizzResponses({
      conversationId,
      userId: user.id,
    });

    return jsonSuccessResponse({
      message: "Responses regenerated successfully",
      data: result,
    });
  } catch (error) {
    console.error("Regeneration endpoint error:", error);

    if (error instanceof Error) {
      if (error.message === "Conversation not found") {
        return jsonErrorResponse("Conversation not found", 404);
      }
      if (error.message === "Unauthorized") {
        return jsonErrorResponse("Unauthorized", 403);
      }
      if (error.message.includes("only available for")) {
        return jsonErrorResponse(error.message, 400);
      }

      return jsonErrorResponse(error.message, 500);
    }

    return unknownErrorResponse(error, "Regeneration endpoint error");
  }
}) satisfies RequestHandler;
