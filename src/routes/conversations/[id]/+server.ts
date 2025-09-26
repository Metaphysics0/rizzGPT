import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { actions } from "$lib/server/services/db-actions.service";

export const DELETE: RequestHandler = async ({ params }) => {
  const conversationId = params.id;

  if (!conversationId) {
    throw error(400, "Conversation ID is required");
  }

  try {
    await actions.deleteConversation(conversationId);
    return json({ success: true });
  } catch (err) {
    console.error("Error deleting conversation:", err);
    throw error(500, "Failed to delete conversation");
  }
};
