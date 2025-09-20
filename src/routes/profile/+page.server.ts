import type { PageServerLoad } from "./$types";
import { UsageService } from "$lib/server/services/usage.service";
import { getUserSubscriptionStatus } from "$lib/utils/subscription.util";

export const load: PageServerLoad = async ({ locals }) => {
  // User is guaranteed to exist due to hook protection
  if (!locals.user) {
    throw new Error("User not found");
  }

  const usageService = new UsageService();
  const [currentUsage, subscription] = await Promise.all([
    usageService.getUserUsage(locals.user.id),
    locals.user.email ? getUserSubscriptionStatus(locals.user.email) : null,
  ]);

  return {
    user: locals.user,
    currentUsage,
    subscription,
  };
};
