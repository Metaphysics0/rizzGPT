import { requireAuth } from "$lib/server/auth";
import { DatabaseService } from "$lib/server/services/database.service";
import {
  unknownErrorResponse,
  userIsNotFoundErrorResponse,
} from "$lib/server/utils/api-response.util";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

// GET: Get all conversations for the authenticated user
export const GET = (async ({ request }) => {
  try {
    const authResult = await requireAuth(request);
    if (authResult.error || !authResult.dbUser) {
      return authResult.error || userIsNotFoundErrorResponse();
    }

    const dbService = new DatabaseService();
    const conversations = await dbService.getConversationsForUser(
      authResult.dbUser.id
    );

    return json({
      success: true,
      conversations,
    });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch conversations",
      },
      { status: 500 }
    );
  }
}) satisfies RequestHandler;

// POST: Create a new conversation
export const POST = (async ({ request }) => {
  try {
    const authResult = await requireAuth(request);
    if (authResult.error || !authResult.dbUser) {
      return authResult.error || userIsNotFoundErrorResponse();
    }

    const {
      rizzResponses,
      rizzResponseDescription,
      uploadedConversationBlobUrl,
      matchContext,
      matchName,
    } = await request.json();

    // Validate required fields
    if (
      !rizzResponses ||
      !rizzResponseDescription ||
      !uploadedConversationBlobUrl ||
      !matchContext ||
      !matchName
    ) {
      return json({ error: "Missing required fields" }, { status: 400 });
    }

    const dbService = new DatabaseService();
    const conversation = await dbService.createConversation({
      userId: authResult.dbUser.id,
      rizzResponses,
      rizzResponseDescription,
      uploadedConversationBlobUrl,
      matchContext,
      matchName,
    });

    return json({ success: true, conversation });
  } catch (error) {
    console.error("Error creating conversation:", error);
    return unknownErrorResponse(error, "Failed to create conversation");
  }
}) satisfies RequestHandler;
