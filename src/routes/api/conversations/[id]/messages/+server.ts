import { DatabaseService } from "$lib/server/services/database.service";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

const db = new DatabaseService();

// GET - Get all messages for a conversation
export const GET: RequestHandler = async ({ params }) => {
  try {
    const conversationId = params.id;

    if (!conversationId) {
      return json({ error: "Conversation ID is required" }, { status: 400 });
    }

    const conversationWithMessages = await db.getConversationWithMessages(
      conversationId
    );

    if (!conversationWithMessages) {
      return json({ error: "Conversation not found" }, { status: 404 });
    }

    return json({
      conversation: {
        id: conversationWithMessages.id,
        userId: conversationWithMessages.userId,
        rizzResponses: conversationWithMessages.rizzResponses,
        rizzResponseDescription:
          conversationWithMessages.rizzResponseDescription,
        initialUploadedConversationBlobUrl:
          conversationWithMessages.initialUploadedConversationBlobUrl,
        matchContext: conversationWithMessages.matchContext,
        matchName: conversationWithMessages.matchName,
        status: conversationWithMessages.status,
        createdAt: conversationWithMessages.createdAt,
        updatedAt: conversationWithMessages.updatedAt,
      },
      messages: conversationWithMessages.messages,
    });
  } catch (error) {
    console.error("Error fetching conversation messages:", error);
    return json({ error: "Internal server error" }, { status: 500 });
  }
};

// POST - Add a new message to the conversation
export const POST: RequestHandler = async ({ params, request }) => {
  try {
    const conversationId = params.id;

    if (!conversationId) {
      return json({ error: "Conversation ID is required" }, { status: 400 });
    }

    const { role, content } = await request.json();

    if (!role || !content) {
      return json({ error: "Role and content are required" }, { status: 400 });
    }

    if (role !== "user" && role !== "assistant") {
      return json(
        { error: "Role must be 'user' or 'assistant'" },
        { status: 400 }
      );
    }

    // Verify conversation exists
    const conversation = await db.getConversationById(conversationId);
    if (!conversation) {
      return json({ error: "Conversation not found" }, { status: 404 });
    }

    // Get the next message order
    const messageOrder = await db.getNextMessageOrder(conversationId);

    // Add the message
    const newMessage = await db.addMessageToConversation({
      conversationId,
      role,
      content,
      messageOrder,
    });

    // Update conversation status to 'refining' if it's the first user message
    if (role === "user" && conversation.status === "initial") {
      await db.updateConversationStatus(conversationId, "refining");
    }

    return json({ message: newMessage }, { status: 201 });
  } catch (error) {
    console.error("Error adding message to conversation:", error);
    return json({ error: "Internal server error" }, { status: 500 });
  }
};
