import { DatabaseService } from "$lib/server/services/database.service";
import { requireAuth } from "$lib/server/utils/require-auth.util";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load = (async ({ request }) => {
  const authResult = await requireAuth(request);

  if (authResult.error) throw error(401, "Authentication required");
  if (!authResult.dbUser) throw error(401, "User not found");

  const conversations = await new DatabaseService().getConversationsForUser(
    authResult.dbUser.id
  );

  return {
    user: authResult.user,
    isAuthenticated: true,
    conversations,
  };
}) satisfies PageServerLoad;
