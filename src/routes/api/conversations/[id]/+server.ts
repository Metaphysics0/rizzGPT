import { requireAuth } from "$lib/server/auth";
import { DatabaseService } from "$lib/server/services/database.service";
import {
  unknownErrorResponse,
  userIsNotFoundErrorResponse,
} from "$lib/server/utils/api-response.util";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

// GET: Get a specific conversation by ID
export const GET = (async ({ params, request }) => {
  try {
    const authResult = await requireAuth(request);
    if (authResult.error || !authResult.dbUser) {
      return authResult.error || userIsNotFoundErrorResponse();
    }

    const { id } = params;
    if (!id) {
      return json({ error: "Conversation ID is required" }, { status: 400 });
    }

    const dbService = new DatabaseService();
    const conversation = await dbService.getConversationById(id);

    if (!conversation) {
      return json({ error: "Conversation not found" }, { status: 404 });
    }

    // Verify the conversation belongs to the authenticated user
    if (conversation.userId !== authResult.dbUser.id) {
      return json({ error: "Access denied" }, { status: 403 });
    }

    return json({
      success: true,
      conversation,
    });
  } catch (error) {
    console.error("Error fetching conversation:", error);
    return json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch conversation",
      },
      { status: 500 }
    );
  }
}) satisfies RequestHandler;

// PUT: Update a conversation
export const PUT = (async ({ params, request }) => {
  try {
    const authResult = await requireAuth(request);
    if (authResult.error || !authResult.dbUser) {
      return authResult.error || userIsNotFoundErrorResponse();
    }

    const { id } = params;
    if (!id) {
      return json({ error: "Conversation ID is required" }, { status: 400 });
    }

    const updates = await request.json();

    const dbService = new DatabaseService();

    // First, verify the conversation exists and belongs to the user
    const existingConversation = await dbService.getConversationById(id);
    if (!existingConversation) {
      return json({ error: "Conversation not found" }, { status: 404 });
    }

    if (existingConversation.userId !== authResult.dbUser.id) {
      return json({ error: "Access denied" }, { status: 403 });
    }

    // Update the conversation
    const updatedConversation = await dbService.updateConversation(id, updates);

    return json({
      success: true,
      conversation: updatedConversation,
    });
  } catch (error) {
    console.error("Error updating conversation:", error);
    return unknownErrorResponse(error, "Failed to update conversation");
  }
}) satisfies RequestHandler;

// DELETE: Delete a conversation
export const DELETE = (async ({ params, request }) => {
  try {
    const authResult = await requireAuth(request);
    if (authResult.error || !authResult.dbUser) {
      return authResult.error || userIsNotFoundErrorResponse();
    }

    const { id } = params;
    if (!id) {
      return json({ error: "Conversation ID is required" }, { status: 400 });
    }

    const dbService = new DatabaseService();

    // First, verify the conversation exists and belongs to the user
    const existingConversation = await dbService.getConversationById(id);
    if (!existingConversation) {
      return json({ error: "Conversation not found" }, { status: 404 });
    }

    if (existingConversation.userId !== authResult.dbUser.id) {
      return json({ error: "Access denied" }, { status: 403 });
    }

    // Delete the conversation
    const deleted = await dbService.deleteConversation(id);

    if (!deleted) {
      return json({ error: "Failed to delete conversation" }, { status: 500 });
    }

    return json({
      success: true,
      message: "Conversation deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting conversation:", error);
    return unknownErrorResponse(error, "Failed to delete conversation");
  }
}) satisfies RequestHandler;
