import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { SubscriptionService } from "$lib/server/services/subscription.service";

export const POST: RequestHandler = async ({ request, locals }) => {
  try {
    if (!locals?.user) {
      return json({ error: "Unauthorized" }, { status: 401 });
    }

    const { newPlanId } = await request.json();

    if (!newPlanId) {
      return json({ error: "newPlanId is required" }, { status: 400 });
    }

    const origin = request.headers.get("origin") || "";
    const subscriptionService = new SubscriptionService();

    const { approvalUrl, subscriptionId } =
      await subscriptionService.reviseSubscription({
        userId: locals.user.id,
        newPlanId,
        returnUrl: `${origin}/api/subscriptions/revise/approve`,
        cancelUrl: `${origin}/pricing?revision=cancelled`,
      });

    console.log(
      `[SUBSCRIPTIONS] Revision initiated for ${locals.user.email} -> plan ${newPlanId}`
    );

    return json({
      success: true,
      approvalUrl,
      subscriptionId,
      newPlanId,
    });
  } catch (error) {
    console.error("[SUBSCRIPTIONS] Revision failed:", error);

    return json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to revise subscription",
      },
      { status: 500 }
    );
  }
};
