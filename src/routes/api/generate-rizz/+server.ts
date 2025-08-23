import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import {
  unknownErrorResponse,
  unprocessableEntityResponse,
} from "$lib/server/utils/response.util";
import { ConversationGenerationService } from "$lib/server/services/conversation-generation.service";
import { RelationshipContextSchema } from "$lib/types";

export const POST = (async ({ request }) => {
  try {
    const body = (await request.json()) as {
      blobUrl: string;
      relationshipContext: string;
    };
    if (!body) return unprocessableEntityResponse("Request body is required");

    const { conversationId } = await new ConversationGenerationService({
      blobUrl: body.blobUrl,
      ...(body.relationshipContext && {
        relationshipContext: RelationshipContextSchema.parse(
          JSON.parse(body.relationshipContext)
        ),
      }),
    }).initiateConversationGeneration();

    return json({ conversationId });
  } catch (error) {
    console.error("Generate Rizz endpoint error:", error);
    return unknownErrorResponse(error, "Generate Rizz failed");
  }
}) satisfies RequestHandler;
