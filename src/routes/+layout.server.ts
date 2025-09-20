import type { RequestEvent } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { getUserSubscriptionStatus } from "$lib/utils/subscription.util";
import type { Subscription } from "$lib/server/database/schema";

export const load: PageServerLoad = async ({ locals }: RequestEvent) => {
  let activeSubscription: Subscription | null = null;
  if (locals.user?.email) {
    activeSubscription = await getUserSubscriptionStatus(locals.user.email);
  }

  return {
    user: {
      ...locals.user,
      subscription: activeSubscription,
    },
  };
};
