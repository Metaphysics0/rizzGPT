import { isRedirect, redirect } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { PaypalService } from "$lib/server/services/payments/paypal.service";
import { SubscriptionService } from "$lib/server/services/subscription.service";

export const GET: RequestHandler = async ({ url, locals }) => {
  try {
    if (!locals.user) {
      console.error("[SUBSCRIPTIONS] No user session found");
      throw redirect(303, "/signin?error=unauthorized");
    }

    // Get subscription ID from query params (PayPal sends this as subscription_id or token)
    const subscriptionId =
      url.searchParams.get("subscription_id") || url.searchParams.get("token");

    if (!subscriptionId) {
      console.error("[SUBSCRIPTIONS] No subscription ID in callback");
      throw redirect(303, "/?error=no_subscription_id");
    }

    console.log(
      `[SUBSCRIPTIONS] Processing successful subscription: ${subscriptionId}`
    );

    const subscription = await new PaypalService().getSubscription(
      subscriptionId
    );

    console.log(`[SUBSCRIPTIONS] Subscription status: ${subscription.status}`);

    await new SubscriptionService().syncFromPayPalWebhook(subscription);

    console.log(
      `[SUBSCRIPTIONS] Subscription synced to database for ${locals.user.email}`
    );

    // Redirect to success page or dashboard
    throw redirect(303, "/?subscription=success");
  } catch (error) {
    if (isRedirect(error)) throw error;

    console.error("[SUBSCRIPTIONS] Error processing subscription:", error);

    throw redirect(303, "/?error=subscription_failed");
  }
};
