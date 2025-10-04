import type { PageServerLoad } from "./$types";
import { UsageService } from "$lib/server/services/usage.service";
import { SubscriptionService } from "$lib/server/services/subscription.service";

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals?.user) {
    throw new Error("Unauthorized");
  }

  const usageService = new UsageService();
  const subscriptionService = new SubscriptionService();

  const usageCount = await usageService.getUserUsageCount(locals.user.id);
  console.log("USAGE", usageCount);

  const subscription = await subscriptionService.getActiveSubscription(
    locals.user.email
  );

  return {
    usageCount,
    subscription,
  };
};
