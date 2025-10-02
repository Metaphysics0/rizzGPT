import type { RequestEvent } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";
import { getPlans } from "$lib/server/utils/plans.util";

export const load: LayoutServerLoad = async ({ locals }: RequestEvent) => {
  return {
    user: locals.user,
    plans: getPlans(),
  };
};
