import { isRedirect, redirect } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { SubscriptionService } from "$lib/server/services/subscription.service";

export const GET: RequestHandler = async ({ url, locals }) => {
  try {
    if (!locals.user) {
      console.error("[SUBSCRIPTIONS] No user session");
      throw redirect(303, "/signin?error=unauthorized");
    }

    const subscriptionId = url.searchParams.get("subscription_id");
    const newPlanId = url.searchParams.get("new_plan_id");

    if (!subscriptionId || !newPlanId) {
      console.error("[SUBSCRIPTIONS] Missing required params");
      throw redirect(303, "/pricing?error=invalid_revision_params");
    }

    const subscriptionService = new SubscriptionService();

    await subscriptionService.handleRevisionApproval({
      subscriptionId,
      newPlanId,
    });

    console.log(
      `[SUBSCRIPTIONS] Revision approved for ${locals.user.email} -> plan ${newPlanId}`
    );

    throw redirect(303, "/pricing?revision=success");
  } catch (error) {
    if (isRedirect(error)) throw error;

    console.error("[SUBSCRIPTIONS] Revision approval failed:", error);
    throw redirect(303, "/pricing?error=revision_failed");
  }
};
