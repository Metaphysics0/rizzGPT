import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { actions } from "$lib/server/services/db-actions.service";

export const DELETE: RequestHandler = async ({ params }) => {
  const optimizationId = params.id;

  if (!optimizationId) {
    throw error(400, "Optimization ID is required");
  }

  try {
    await actions.deleteProfileOptimization(optimizationId);
    return json({ success: true });
  } catch (err) {
    console.error("Error deleting profile optimization:", err);
    throw error(500, "Failed to delete profile optimization");
  }
};
