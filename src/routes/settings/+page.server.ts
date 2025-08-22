import { DatabaseService } from "$lib/server/services/database.service";
import type { PageServerLoad } from "./$types";

export const load = (async ({ setHeaders }) => {
  setHeaders({ "cache-control": "max-age=60" });

  const dbService = new DatabaseService();

  const recentConversations = await dbService.getConversationsForUser(5);

  return {
    recentConversations,
  };
}) satisfies PageServerLoad;
