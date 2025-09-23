import type { RequestEvent } from "@sveltejs/kit";
import { databaseService } from "$lib/server/services/database.service";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ locals }: RequestEvent) => {
  if (!locals.user?.id) return { user: undefined };

  const userWithRelations = await databaseService.getUserWithRelations(
    locals.user.id
  );

  return {
    user: userWithRelations,
  };
};
