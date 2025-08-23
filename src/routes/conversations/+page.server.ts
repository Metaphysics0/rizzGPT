import { DatabaseService } from "$lib/server/services/database.service";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load = (async ({ setHeaders, locals }) => {
  if (!locals.user) return redirect(302, "/auth/sign-in");

  setHeaders({ "cache-control": "max-age=60" });

  const conversations = await new DatabaseService().getConversationsForUser(
    locals.user.id
  );

  return {
    conversations,
  };
}) satisfies PageServerLoad;
