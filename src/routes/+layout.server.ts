import type { RequestEvent } from "@sveltejs/kit";

export async function load({ locals }: RequestEvent) {
  return {
    isAuthenticated: locals.isAuthenticated,
    user: locals.user,
  };
}
