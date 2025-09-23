import type { RequestEvent } from "@sveltejs/kit";
import { getUserSubscriptionStatus } from "$lib/utils/subscription.util";
import type { Subscription } from "$lib/server/database/schema";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ locals }: RequestEvent) => {
  let activeSubscription: Subscription | undefined = undefined;
  if (locals.user?.email) {
    const sub = await getUserSubscriptionStatus(locals.user.email);
    activeSubscription = sub || undefined;
  }

  console.log("LOCALS USER", locals);

  return {
    user: locals.user
      ? {
          ...locals.user,
          subscription: activeSubscription,
        }
      : null,
  };
};
