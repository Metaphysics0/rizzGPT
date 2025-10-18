import { actions } from "$lib/server/services/db-actions.service";
import type { PageServerLoad } from "./$types";

export const load = (async ({ setHeaders, locals }) => {
  setHeaders({ "cache-control": "max-age=60" });

  const [ conversations, optimizations ] = await Promise.all([
    actions.getConversationsForUser(locals.user!.id),
    actions.getProfileOptimizationsForUser(locals.user!.id),
  ])

  return {
    conversations,
    optimizations,
  };
}) satisfies PageServerLoad;
