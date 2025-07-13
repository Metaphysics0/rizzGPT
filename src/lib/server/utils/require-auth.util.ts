import {
  kindeAuthClient,
  type SessionManager,
} from "@kinde-oss/kinde-auth-sveltekit";
import { json } from "@sveltejs/kit";
import type { KindeUser } from "../database/types";
import { DatabaseService } from "../services/database.service";
import { SubscriptionService } from "../services/subscription.service";
import { unknownErrorResponse } from "./api-response.util";

export async function requireAuth(request: Request) {
  try {
    const isAuthenticated = await kindeAuthClient.isAuthenticated(
      request as unknown as SessionManager
    );

    if (!isAuthenticated) {
      return {
        error: json(
          { error: "Authentication required. Please sign in to continue." },
          { status: 401 }
        ),
        user: null,
        dbUser: null,
      };
    }

    const kindeUser = await kindeAuthClient.getUser(
      request as unknown as SessionManager
    );

    // Sync user with database
    let dbUser = null;
    if (kindeUser) {
      try {
        const dbService = new DatabaseService();
        const subscriptionService = new SubscriptionService();

        // Upsert user in database
        dbUser = await dbService.upsertUserFromKinde(kindeUser as KindeUser);
        console.log("DB USER", dbUser);

        // Check if user has a subscription, if not create a free trial
        const existingSubscription =
          await subscriptionService.getUserSubscription(dbUser.id);
        console.log("EXISTING SUBSCRIPTION", existingSubscription);

        if (!existingSubscription) {
          console.log(`Creating free trial subscription for user ${dbUser.id}`);
          await subscriptionService.createFreeTrialSubscription(dbUser.id);
        }
      } catch (dbError) {
        console.error("Database user sync failed:", dbError);
      }
    }

    return {
      error: null,
      user: kindeUser,
      dbUser,
    };
  } catch (error) {
    console.error("Authentication check failed:", error);
    return {
      error: unknownErrorResponse(error, "Authentication check failed"),
      user: null,
      dbUser: null,
    };
  }
}
