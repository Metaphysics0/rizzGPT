import {
  kindeAuthClient,
  type SessionManager,
} from "@kinde-oss/kinde-auth-sveltekit";
import type { RequestEvent } from "@sveltejs/kit";

export async function load({ request }: RequestEvent) {
  const isAuthenticated = await kindeAuthClient.isAuthenticated(
    request as unknown as SessionManager
  ); // Boolean: true or false
  if (isAuthenticated) {
    // Need to implement, e.g: call an api, etc...
  } else {
    // Need to implement, e.g: redirect user to sign in, etc..
  }

  return {
    isAuthenticated,
  };
}
