import { DatabaseService } from "$lib/server/services/database.service";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load = (async ({ params, setHeaders }) => {
  setHeaders({ "cache-control": "max-age=120" });

  if (!params.id) throw error(400, "Conversation ID is required");

  const conversationId = params.id;
  const dbService = new DatabaseService();
  const conversation = await dbService.getConversationById(conversationId);

  if (!conversation) {
    throw error(404, "Conversation not found");
  }

  return {
    conversation,
  };
}) satisfies PageServerLoad;
