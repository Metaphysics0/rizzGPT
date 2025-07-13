import {
  kindeAuthClient,
  type SessionManager,
} from "@kinde-oss/kinde-auth-sveltekit";
import type { KindeUser } from "../database/types";
import { DatabaseService } from "../services/database.service";
import { SubscriptionService } from "../services/subscription.service";
import { jsonErrorResponse, unknownErrorResponse } from "./api-response.util";

export async function requireAuth(request: Request) {
  try {
    const isAuthenticated = await kindeAuthClient.isAuthenticated(
      request as unknown as SessionManager
    );
    if (!isAuthenticated) return unauthenticatedResponse();

    const kindeUser = await kindeAuthClient.getUser(
      request as unknown as SessionManager
    );

    const dbUser = await syncUserWithDatabase(kindeUser);

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

async function syncUserWithDatabase(kindeUser?: KindeUser) {
  if (!kindeUser) return null;

  try {
    const dbService = new DatabaseService();
    const subscriptionService = new SubscriptionService();

    const dbUser = await dbService.findOrCreateUserFromKinde(kindeUser);
    const existingSubscription = await subscriptionService.getUserSubscription(
      dbUser.id
    );

    if (!existingSubscription) {
      console.log(`Creating free trial subscription for user ${dbUser.id}`);
      await subscriptionService.createFreeTrialSubscription(dbUser.id);
    }

    return dbUser;
  } catch (error) {
    console.error("Database user sync failed:", error);
    return null;
  }
}

function unauthenticatedResponse() {
  return {
    error: jsonErrorResponse(
      "Authentication required. Please sign in to continue.",
      401
    ),
    user: null,
    dbUser: null,
  };
}
