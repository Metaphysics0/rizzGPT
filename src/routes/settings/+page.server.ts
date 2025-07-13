import { DatabaseService } from "$lib/server/services/database.service";
import { SubscriptionService } from "$lib/server/services/subscription.service";
import type { PageServerLoad } from "./$types";

export const load = (async ({ locals, setHeaders }) => {
  setHeaders({ "cache-control": "max-age=60" });

  const dbService = new DatabaseService();
  const subscriptionService = new SubscriptionService();

  // Get user's subscription and usage data
  const [subscription, usageStats, allConversations] = await Promise.all([
    subscriptionService.getUserSubscription(locals.dbUser!.id),
    subscriptionService.getUsageStats(locals.dbUser!.id),
    dbService.getConversationsForUser(locals.dbUser!.id),
  ]);

  // Get recent 5 conversations for settings display
  const recentConversations = allConversations.slice(0, 5);

  return {
    user: locals.user!,
    dbUser: locals.dbUser!,
    isAuthenticated: true,
    subscription,
    usageStats,
    recentConversations,
  };
}) satisfies PageServerLoad;
