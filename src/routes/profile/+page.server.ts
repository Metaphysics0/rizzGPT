import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
  // User is guaranteed to exist due to hook protection
  return {
    user: locals.user
  };
};
