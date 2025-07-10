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
    const user = await kindeAuthClient.getUser(
      request as unknown as SessionManager
    );

    const token = await kindeAuthClient.getToken(
      request as unknown as SessionManager
    );

    return {
      isAuthenticated,
      token,
      user,
    };
  } else {
    return {
      isAuthenticated,
      token: null,
      user: null,
    };
  }
}
