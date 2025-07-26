import {
  type SubscriptionPlan,
  SubscriptionService,
} from "$lib/server/services/subscription.service";
import {
  jsonErrorResponse,
  jsonSuccessResponse,
  missingRequiredParametersErrorResponse,
  unknownErrorResponse,
} from "$lib/server/utils/api-response.util";
import type { RequestHandler } from "./$types";

export const POST = (async ({ request, locals }) => {
  try {
    const dbUser = locals.dbUser!;

    const { planName } = await request.json();

    if (!planName) {
      return missingRequiredParametersErrorResponse(["planName"]);
    }

    const subscriptionService = new SubscriptionService();

    const planConfig = subscriptionService.getPlanConfig(
      planName as SubscriptionPlan
    );
    if (!planConfig) {
      return jsonErrorResponse("Invalid plan name", 400);
    }

    // Update subscription
    await subscriptionService.updateSubscriptionPlan(
      dbUser.id,
      planName as SubscriptionPlan
    );

    // Get updated subscription status
    const subscription = await subscriptionService.getUserSubscription(
      dbUser.id
    );
    const usageStats = await subscriptionService.getUsageStats(dbUser.id);

    return jsonSuccessResponse({
      message: "Subscription upgraded successfully",
      subscription: subscription
        ? {
            id: subscription.id,
            planName: subscription.planName,
            status: subscription.status,
            isActive: subscription.isActive,
            currentPeriodEnd: subscription.currentPeriodEnd,
            billingCycle: subscription.billingCycle,
          }
        : null,
      usage: usageStats,
    });
  } catch (error) {
    console.error("Upgrade subscription error:", error);
    return unknownErrorResponse(error, "Failed to upgrade subscription");
  }
}) satisfies RequestHandler;
