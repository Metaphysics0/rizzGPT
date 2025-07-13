import { SubscriptionService } from "$lib/server/services/subscription.service";
import {
  jsonSuccessResponse,
  unknownErrorResponse,
} from "$lib/server/utils/api-response.util";
import type { RequestHandler } from "./$types";

export const GET = (async ({ locals }) => {
  try {
    const dbUser = locals.dbUser!;

    const subscriptionService = new SubscriptionService();
    const subscription = await subscriptionService.getUserSubscription(
      dbUser.id
    );
    const usageStats = await subscriptionService.getUsageStats(dbUser.id);
    const canGenerate = await subscriptionService.canGenerateConversation(
      dbUser.id
    );

    return jsonSuccessResponse({
      subscription: subscription
        ? {
            id: subscription.id,
            planName: subscription.planName,
            status: subscription.status,
            isActive: subscription.isActive,
            trialEndsAt: subscription.trialEndsAt,
            currentPeriodEnd: subscription.currentPeriodEnd,
            billingCycle: subscription.billingCycle,
          }
        : null,
      usage: usageStats,
      canGenerate: canGenerate.allowed,
      limitReason: canGenerate.reason,
    });
  } catch (error) {
    console.error("Get subscription status error:", error);
    return unknownErrorResponse(error, "Failed to get subscription status");
  }
}) satisfies RequestHandler;
