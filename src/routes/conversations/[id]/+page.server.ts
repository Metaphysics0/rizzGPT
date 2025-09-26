import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { actions } from "$lib/server/services/db-actions.service";

export const load = (async ({ params, setHeaders }) => {
  setHeaders({ "cache-control": "max-age=120" });
  const conversationId = params.id;

  if (!conversationId) throw error(400, "Conversation ID is required");

  const conversation = await actions.getConversationById(conversationId);

  if (!conversation) {
    throw error(404, "Conversation not found");
  }

  return {
    conversation,
  };
}) satisfies PageServerLoad;
