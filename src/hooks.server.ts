import { type Handle } from "@sveltejs/kit";
import { svelteKitHandler } from "better-auth/svelte-kit";
import { building } from "$app/environment";
import { auth } from "$lib/server/auth";

export const handle: Handle = async ({ event, resolve }) => {
  if (isChromeDevToolsRequest(event.url)) {
    return new Response(null, { status: 204 });
  }

  return svelteKitHandler({ event, resolve, auth, building });
};

function isChromeDevToolsRequest(url: URL) {
  return url.pathname.startsWith(
    "/.well-known/appspecific/com.chrome.devtools"
  );
}
