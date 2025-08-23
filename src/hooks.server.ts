import { type Handle } from "@sveltejs/kit";
import { svelteKitHandler } from "better-auth/svelte-kit";
import { building } from "$app/environment";
import { auth } from "$lib/server/auth";

export const handle: Handle = async ({ event, resolve }) => {
  if (isChromeDevToolsRequest(event.url)) {
    return new Response(null, { status: 204 });
  }

  try {
    const session = await auth.api.getSession({
      headers: event.request.headers,
    });

    // Make session and user available on server
    if (session) {
      event.locals.session = session.session;
      event.locals.user = session.user;
    }

    return svelteKitHandler({ event, resolve, auth, building });
  } catch (error) {
    console.error("Error in handle", error);
    return new Response(null, { status: 500 });
  }
};

function isChromeDevToolsRequest(url: URL) {
  return url.pathname.startsWith(
    "/.well-known/appspecific/com.chrome.devtools"
  );
}
