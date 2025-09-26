import type { RequestEvent } from "@sveltejs/kit";
import { actions } from "$lib/server/services/db-actions.service";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ locals }: RequestEvent) => {
  if (!locals.user?.id) return { user: undefined };

  const userWithRelations = await actions.getUserWithRelations(locals.user.id);

  return {
    user: userWithRelations,
  };
};
