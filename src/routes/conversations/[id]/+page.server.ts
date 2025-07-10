import { DatabaseService } from "$lib/server/services/database.service";
import { requireAuth } from "$lib/server/utils/require-auth.util";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load = (async ({ params, request }) => {
  const authResult = await requireAuth(request);
  if (authResult.error) {
    throw error(401, "Authentication required");
  }

  if (!authResult.dbUser) {
    throw error(401, "User not found");
  }

  if (!params.id) {
    throw error(400, "Conversation ID is required");
  }

  const conversationId = params.id;
  const dbService = new DatabaseService();

  const conversation = await dbService.getConversationById(conversationId);

  if (!conversation || conversation.userId !== authResult.dbUser.id) {
    throw error(404, "Conversation not found");
  }

  return {
    conversation,
    user: authResult.user,
    isAuthenticated: true,
  };
}) satisfies PageServerLoad;
