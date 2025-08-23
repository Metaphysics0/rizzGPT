import type { PageServerLoad } from "./$types";

export const load = (async ({ locals, setHeaders }) => {
  setHeaders({ "cache-control": "max-age=60" });

  return {};
}) satisfies PageServerLoad;
