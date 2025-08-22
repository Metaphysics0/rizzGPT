import { DatabaseService } from "$lib/server/services/database.service";
import type { PageServerLoad } from "./$types";

export const load = (async ({ setHeaders }) => {
  setHeaders({ "cache-control": "max-age=60" });

  const conversations = await new DatabaseService().getConversationsForUser();

  return {
    conversations,
  };
}) satisfies PageServerLoad;
