import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { PaypalService } from "$lib/server/services/payments/paypal.service";
import { SubscriptionService } from "$lib/server/services/subscription.service";
import type { PayPalWebhookEvent } from "$lib/server/services/payments/paypal.types";

export const POST: RequestHandler = async ({ request }) => {
  try {
    console.log("[PAYPAL] Incoming PayPal webhook");

    // Get raw body for signature verification
    const rawBody = await request.text();
    const webhookEvent: PayPalWebhookEvent = JSON.parse(rawBody);

    console.log(
      "[PAYPAL] Incoming request headers",
      JSON.stringify(request.headers)
    );

    const paypalService = new PaypalService();
    const headers = {
      "paypal-transmission-id":
        request.headers.get("paypal-transmission-id") || "",
      "paypal-transmission-time":
        request.headers.get("paypal-transmission-time") || "",
      "paypal-transmission-sig":
        request.headers.get("paypal-transmission-sig") || "",
      "paypal-cert-url": request.headers.get("paypal-cert-url") || "",
      "paypal-auth-algo": request.headers.get("paypal-auth-algo") || "",
    };

    const isValid = await paypalService.verifyWebhookSignature(
      headers,
      rawBody
    );

    if (!isValid) {
      console.error("[PAYPAL] Webhook signature verification failed");
      return json({ error: "Invalid webhook signature" }, { status: 401 });
    }

    console.log(
      `[PAYPAL] Webhook verified - Event: ${webhookEvent.event_type}, ID: ${webhookEvent.id}`
    );

    const subscriptionService = new SubscriptionService();

    switch (webhookEvent.event_type) {
      case "BILLING.SUBSCRIPTION.ACTIVATED":
      case "BILLING.SUBSCRIPTION.UPDATED":
      case "BILLING.SUBSCRIPTION.CANCELLED":
      case "BILLING.SUBSCRIPTION.EXPIRED":
      case "BILLING.SUBSCRIPTION.SUSPENDED":
        await subscriptionService.syncFromPayPalWebhook(webhookEvent.resource);
        break;

      case "PAYMENT.SALE.COMPLETED":
        console.log("[PAYPAL] Payment completed - renewing subscription");
        // For recurring payments, fetch the latest subscription data
        const subscriptionId = webhookEvent.resource.billing_agreement_id;
        if (subscriptionId) {
          const subscription = await paypalService.getSubscription(
            subscriptionId
          );
          await subscriptionService.syncFromPayPalWebhook(subscription);
        }
        break;

      case "BILLING.SUBSCRIPTION.PAYMENT.FAILED":
        console.log("[PAYPAL] Subscription payment failed");
        // You might want to handle payment failures differently
        // For now, we'll just log it
        break;

      default:
        console.log(
          `[PAYPAL] Unhandled event type: ${webhookEvent.event_type}`
        );
    }

    console.log(
      `[PAYPAL] Successfully processed webhook: ${webhookEvent.event_type}`
    );

    return json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("[PAYPAL] Error processing webhook:", error);
    return json({ error: "Internal server error" }, { status: 500 });
  }
};

export const GET: RequestHandler = async () => {
  console.log("[PAYPAL] GET request to webhook endpoint");
  return json({ message: "PayPal webhook endpoint" }, { status: 200 });
};
