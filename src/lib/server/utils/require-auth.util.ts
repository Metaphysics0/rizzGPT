import {
  kindeAuthClient,
  type SessionManager,
} from "@kinde-oss/kinde-auth-sveltekit";
import { json } from "@sveltejs/kit";
import type { KindeUser } from "../database/types";
import { DatabaseService } from "../services/database.service";
import { unknownErrorResponse } from "./api-response.util";

/**
 * Check if the request is authenticated and return user info if valid
 * Also syncs user data with the database
 */
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
        dbUser = await dbService.upsertUserFromKinde(kindeUser as KindeUser);
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
