import type { PageServerLoad } from "./$types";
import { getUserSubscriptionStatus } from "$lib/utils/subscription.util";

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user) throw new Error("User not found");

  const subscription = await getUserSubscriptionStatus(locals.user.email);

  return {
    subscription,
  };
};
