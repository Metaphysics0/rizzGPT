import type { PageServerLoad } from "./$types";
import { databaseService } from "$lib/server/services/database.service";

export const load = (async ({ setHeaders, locals }) => {
  // User is guaranteed to exist due to hook protection
  setHeaders({ "cache-control": "max-age=60" });

  const conversations = await databaseService.getConversationsForUser(
    locals.user!.id
  );

  return {
    conversations,
  };
}) satisfies PageServerLoad;
