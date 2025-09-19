import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { databaseService } from "$lib/server/services/database.service";

export const load = (async ({ setHeaders, locals }) => {
  if (!locals.user) return redirect(302, "/sign-in");

  setHeaders({ "cache-control": "max-age=60" });

  const conversations = await databaseService.getConversationsForUser(
    locals.user.id
  );

  return {
    conversations,
  };
}) satisfies PageServerLoad;
