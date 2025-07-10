import {
  kindeAuthClient,
  type SessionManager,
} from "@kinde-oss/kinde-auth-sveltekit";
import type { RequestEvent } from "@sveltejs/kit";

export async function load({ request }: RequestEvent) {
  const isAuthenticated = await kindeAuthClient.isAuthenticated(
    request as unknown as SessionManager
  );

  if (!isAuthenticated) {
    return { isAuthenticated, user: null };
  }

  return {
    isAuthenticated,
    user: await kindeAuthClient.getUser(request as unknown as SessionManager),
  };
}
