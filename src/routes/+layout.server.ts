import type { RequestEvent } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { getUserSubscriptionStatus } from "$lib/utils/subscription.util";
import type { Subscription } from "$lib/server/database/schema";

export const load: PageServerLoad = async ({ locals }: RequestEvent) => {
  let subscriptionStatus = {
    hasActiveSubscription: false,
    subscriptions: [] as Subscription[],
  };

  if (locals.user?.email) {
    subscriptionStatus = await getUserSubscriptionStatus(locals.user.email);
  }

  return {
    user: locals.user,
    subscription: subscriptionStatus,
  };
};
