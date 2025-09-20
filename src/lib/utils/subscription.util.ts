import type { Subscription } from "$lib/server/database/schema";
import { SubscriptionService } from "$lib/server/services/subscription.service";

export interface UserSubscriptionStatus {
  hasActiveSubscription: boolean;
  subscriptions: Subscription[];
}

export async function getUserSubscriptionStatus(
  email: string
): Promise<UserSubscriptionStatus> {
  const subscriptionService = new SubscriptionService();

  const [hasActiveSubscription, subscriptions] = await Promise.all([
    subscriptionService.getActiveSubscription(email),
    subscriptionService.getUserSubscriptions(email),
  ]);

  return {
    hasActiveSubscription,
    subscriptions,
  };
}

export type SubscriptionTier = "trial" | "pro";
