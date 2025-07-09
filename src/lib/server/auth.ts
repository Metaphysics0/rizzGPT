import {
  kindeAuthClient,
  type SessionManager,
} from "@kinde-oss/kinde-auth-sveltekit";
import { json } from "@sveltejs/kit";

/**
 * Check if the request is authenticated and return user info if valid
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
      };
    }

    const user = await kindeAuthClient.getUser(
      request as unknown as SessionManager
    );

    return {
      error: null,
      user,
    };
  } catch (error) {
    console.error("Authentication check failed:", error);
    return {
      error: json({ error: "Authentication check failed" }, { status: 500 }),
      user: null,
    };
  }
}
