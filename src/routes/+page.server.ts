import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load = (async ({ locals, setHeaders }) => {
  // Check if user is authenticated
  if (!locals.session || !locals.user) {
    throw redirect(302, "/");
  }

  setHeaders({ "cache-control": "max-age=60" });

  return {};
}) satisfies PageServerLoad;
