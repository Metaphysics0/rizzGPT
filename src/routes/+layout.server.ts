import type { RequestEvent } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";
import { actions } from "$lib/server/services/db-actions.service";

export const load: LayoutServerLoad = async ({ locals }: RequestEvent) => {
  if (!locals.user?.id) return { user: undefined };
  const user = await actions.getUserWithRelations(locals.user.id);

  return {
    user,
  };
};
