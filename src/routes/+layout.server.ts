import {
  kindeAuthClient,
  type SessionManager,
} from "@kinde-oss/kinde-auth-sveltekit";
import type { RequestEvent } from "@sveltejs/kit";

export async function load({ request }: RequestEvent) {
  const isAuthenticated = await kindeAuthClient.isAuthenticated(
    request as unknown as SessionManager
  );

  if (isAuthenticated) {
    // Get user profile data when authenticated
    const user = await kindeAuthClient.getUser(
      request as unknown as SessionManager
    );

    return {
      isAuthenticated,
      user,
    };
  } else {
    return {
      isAuthenticated,
      user: null,
    };
  }
}
