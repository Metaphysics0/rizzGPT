import { actions } from "$lib/server/services/db-actions.service";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load = (async ({ params, setHeaders }) => {
  setHeaders({ "cache-control": "max-age=120" });
  if (!params.id) throw error(400, "Optimization ID is required");

  const optimization = await actions.getProfileOptimizationById(params.id);

  if (!optimization) throw error(404, "Optimization not found");

  return {
    optimization,
  };
}) satisfies PageServerLoad;
