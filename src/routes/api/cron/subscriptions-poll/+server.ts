import { SubscriptionService } from "$lib/server/services/subscription.service";
import type { RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async () => {
  console.log("[Cron] Starting subscription sync");

  const subscriptionService = new SubscriptionService();
  const result = await subscriptionService.syncSubscriptionsFromGumroad();

  if (!result.success) {
    console.error("[Cron] Sync failed:", result.error);
    return new Response(result.error || "Sync failed", { status: 500 });
  }

  const message = `Sync complete. Inserted: ${result.inserted}, Updated: ${result.updated}`;
  console.log(`[Cron] ${message}`);

  return new Response(message, { status: 200 });
};
