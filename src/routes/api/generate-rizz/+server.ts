import type { RequestHandler } from "./$types";
import {
  unauthorizedResponse,
  unknownErrorResponse,
  unprocessableEntityResponse,
} from "$lib/server/utils/response.util";
import { ConversationGenerationService } from "$lib/server/services/conversation-generation.service";
import { type RelationshipContext } from "$lib/types";
import { json } from "@sveltejs/kit";

export const POST = (async ({ request, locals }) => {
  try {
    if (!locals.user) return unauthorizedResponse("Unauthorized");

    const body = (await request.json()) as {
      blobUrl: string;
      relationshipContext: RelationshipContext;
    };

    if (!body) return unprocessableEntityResponse("Request body is required");

    const { conversationId } = await new ConversationGenerationService({
      blobUrl: body.blobUrl,
      userId: locals.user.id,
      userEmail: locals.user.email,
      ...(body.relationshipContext && {
        relationshipContext: body.relationshipContext,
      }),
    }).initiateConversationGeneration();

    return json({ conversationId });
  } catch (error) {
    console.error("Generate Rizz endpoint error:", error);
    return unknownErrorResponse(error, "Generate Rizz failed");
  }
}) satisfies RequestHandler;
