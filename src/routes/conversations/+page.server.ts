import { DatabaseService } from "$lib/server/services/database.service";
import type { PageServerLoad } from "./$types";

export const load = (async ({ locals, setHeaders }) => {
  setHeaders({ "cache-control": "max-age=60" });

  const conversations = await new DatabaseService().getConversationsForUser(
    locals.dbUser!.id
  );

  return {
    user: locals.user!,
    isAuthenticated: true,
    conversations,
  };
}) satisfies PageServerLoad;
