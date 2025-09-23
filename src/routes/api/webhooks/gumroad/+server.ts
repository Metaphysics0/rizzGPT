import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import {
  SubscriptionService,
  type GumroadWebhookPayload,
} from "$lib/server/services/subscription.service";

export const POST: RequestHandler = async ({ request }) => {
  try {
    console.log("[GUMROAD] Incoming gumroad ping webhook");

    const contentType = request.headers.get("content-type");

    if (!contentType?.includes("application/x-www-form-urlencoded")) {
      return json({ error: "Invalid content type" }, { status: 400 });
    }

    const formData = await request.formData();
    const webhookData: GumroadWebhookPayload = Object.fromEntries(
      formData.entries()
    ) as any;

    console.log(
      `[GUMROAD] webhook received, data: ${JSON.stringify(webhookData)}`
    );
    if (webhookData.test) {
      return json({ success: true }, { status: 200 });
    }

    if (!webhookData.sale_id || !webhookData.email || !webhookData.product_id) {
      return json({ error: "Missing required webhook data" }, { status: 400 });
    }

    const subscriptionService = new SubscriptionService();
    await subscriptionService.createOrUpdateSubscription(webhookData);

    console.log(
      `[GUMROAD] Successfully processed GumRoad webhook for sale: ${webhookData.sale_id}, email: ${webhookData.email}`
    );

    return json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("[GUMROAD] Error processing GumRoad webhook:", error);
    return json({ error: "Internal server error" }, { status: 500 });
  }
};

export const GET: RequestHandler = async ({ request }) => {
  console.log("[GUMROAD] WEBHOOK GET REQUEST");
  return json({ success: true }, { status: 200 });
};
