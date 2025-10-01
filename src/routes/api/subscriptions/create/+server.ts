import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { PaypalService } from "$lib/server/services/payments/paypal.service";
// import { PAYPAL_PLAN_ID, PAYPAL_PLAN_ID_DEV } from "$env/static/private";
const PAYPAL_PLAN_ID_DEV = "";
const PAYPAL_PLAN_ID = "";

export const POST: RequestHandler = async ({ request, locals }) => {
  try {
    if (!locals?.user) return json({ error: "Unauthorized" }, { status: 401 });

    const { email, name } = locals.user;

    console.log(`[SUBSCRIPTIONS] Creating subscription for user: ${email}`);

    const isDev = process.env.NODE_ENV === "development";
    const planId = isDev ? PAYPAL_PLAN_ID_DEV : PAYPAL_PLAN_ID;

    if (!planId) {
      console.error("[SUBSCRIPTIONS] PayPal plan ID not configured");
      return json(
        { error: "Subscription plan not configured" },
        { status: 500 }
      );
    }

    const paypalService = new PaypalService();
    const subscription = await paypalService.createSubscription({
      planId,
      email,
      name: name || "",
      returnUrl: `${request.headers.get("origin")}/api/subscriptions/success`,
      cancelUrl: `${request.headers.get("origin")}/subscriptions/cancelled`,
    });

    const approvalUrl = paypalService.getApprovalUrl(subscription);

    if (!approvalUrl) {
      console.error("[SUBSCRIPTIONS] No approval URL in PayPal response");
      return json({ error: "Failed to create subscription" }, { status: 500 });
    }

    console.log(
      `[SUBSCRIPTIONS] Subscription created: ${subscription.id}, redirecting to PayPal`
    );

    return json({
      success: true,
      subscriptionId: subscription.id,
      approvalUrl,
    });
  } catch (error) {
    console.error("[SUBSCRIPTIONS] Error creating subscription:", error);
    return json({ error: "Failed to create subscription" }, { status: 500 });
  }
};
