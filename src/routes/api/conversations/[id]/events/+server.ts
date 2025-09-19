import { databaseService } from "$lib/server/services/database.service";
import { ServerSentEventsService } from "$lib/server/services/server-sent-events.service";
import {
  jsonErrorResponse,
  unknownErrorResponse,
} from "$lib/server/utils/response.util";
import type { RequestHandler } from "./$types";

interface ConversationEventData {
  id: string;
  status: string;
  rizzResponses: string[];
  rizzResponseDescription: string;
  matchName: string;
  updatedAt: Date;
}

export const GET = (async ({ request, params }) => {
  try {
    if (!params.id) {
      return jsonErrorResponse("Conversation ID is required", 400);
    }

    const conversationId = params.id!;

    const conversation = await databaseService.getConversationById(
      conversationId
    );
    if (!conversation) {
      return jsonErrorResponse("Conversation not found", 404);
    }

    const initialData: ConversationEventData = {
      id: conversation.id,
      status: conversation.status || "processing",
      rizzResponses: conversation.rizzResponses,
      rizzResponseDescription: conversation.rizzResponseDescription,
      matchName: conversation.matchName,
      updatedAt: conversation.updatedAt,
    };

    const dataFetcher = async (): Promise<ConversationEventData | null> => {
      const updatedConversation = await databaseService.getConversationById(
        conversationId
      );
      if (!updatedConversation) return null;

      return {
        id: updatedConversation.id,
        status: updatedConversation.status || "processing",
        rizzResponses: updatedConversation.rizzResponses,
        rizzResponseDescription: updatedConversation.rizzResponseDescription,
        matchName: updatedConversation.matchName,
        updatedAt: updatedConversation.updatedAt,
      };
    };

    const sseService = new ServerSentEventsService();
    return sseService.createEventStreamWithCleanup(
      initialData,
      dataFetcher,
      request.signal,
      {
        pollIntervalMs: 2000,
        closeOnCondition: (data) => data.status === "completed",
      }
    );
  } catch (error) {
    console.error("SSE endpoint error:", error);
    return unknownErrorResponse(error, "SSE endpoint error");
  }
}) satisfies RequestHandler;
