import type { Subscription } from "$lib/server/database/schema";
import { SubscriptionService } from "$lib/server/services/subscription.service";

export async function getUserSubscriptionStatus(
  email: string
): Promise<Subscription | null> {
  try {
    const subscriptionService = new SubscriptionService();
    return subscriptionService.getActiveSubscription(email);
  } catch (error) {
    console.error("Error getting user subscription status", error);
    return null;
  }
}

export type SubscriptionTier = "trial" | "pro";
