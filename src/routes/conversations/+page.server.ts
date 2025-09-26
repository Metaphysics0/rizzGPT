import type { PageServerLoad } from "./$types";
import { actions } from "$lib/server/services/db-actions.service";

export const load = (async ({ setHeaders, locals }) => {
  // User is guaranteed to exist due to hook protection
  setHeaders({ "cache-control": "max-age=60" });

  const conversations = await actions.getConversationsForUser(locals.user!.id);

  return {
    conversations,
  };
}) satisfies PageServerLoad;
