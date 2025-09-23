import { GumroadService } from "$lib/server/services/payments/gumroad.service";
import type { RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ request }) => {
  const subscribersResponse =
    await new GumroadService().getAllActiveSubscribers();
  if (!subscribersResponse || !subscribersResponse.success) {
    return new Response("Subscribers response failed");
  }

  for (const subscriber of subscribersResponse.subscribers) {
  }

  return new Response("Hello from Vercel!");
};
