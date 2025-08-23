import type { RequestEvent } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }: RequestEvent) => {
  return {
    user: locals.user || null,
  };
};
