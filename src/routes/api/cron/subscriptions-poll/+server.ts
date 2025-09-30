import { SubscriptionService } from "$lib/server/services/subscription.service";
import { CRON_SECRET } from "$env/static/private";
import type { RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ request }) => {
  try {
    console.log("[Cron] Starting subscription sync");
    verifyCronRequest(request);

    const result =
      await new SubscriptionService().syncSubscriptionsFromGumroad();

    if (!result.success) {
      console.error("[Cron] Sync failed:", result.error);
      return new Response(result.error || "Sync failed", { status: 500 });
    }

    const message = `Sync complete. Inserted: ${result.insertedCount}, Updated: ${result.updatedCount}`;
    console.log(`[Cron] ${message}`);

    return new Response(message, { status: 200 });
  } catch (error) {
    console.error("Cron - subscriptions-poll failed", error);
    if (error instanceof Response) return error;
    return new Response("Error", { status: 500 });
  }
};

function verifyCronRequest(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Basic ")) {
    throw new Response("Unauthorized", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="Cron"' },
    });
  }

  const base64Credentials = authHeader.slice(6);
  const credentials = atob(base64Credentials);
  const [username, password] = credentials.split(":");

  if (username !== "cron-job" || password !== CRON_SECRET) {
    throw new Response("Unauthorized", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="Cron"' },
    });
  }
}
