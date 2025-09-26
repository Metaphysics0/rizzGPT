import { type Handle } from "@sveltejs/kit";
import { svelteKitHandler } from "better-auth/svelte-kit";
import { building } from "$app/environment";
import { auth } from "$lib/server/auth";

export const handle: Handle = async ({ event, resolve }) => {
  try {
    if (isChromeDevToolsRequest(event.url)) {
      return new Response(null, { status: 204 });
    }

    const session = await auth.api.getSession({
      headers: event.request.headers,
    });

    if (doesPathnameRequireSignedInUser(event.url.pathname) && !session) {
      return new Response(null, {
        status: 302,
        headers: { Location: "/sign-in" },
      });
    }

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

function doesPathnameRequireSignedInUser(pathname: string) {
  const publicRoutes = ["/api/cron", "/api/webhooks", "/api/auth"];
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return false;
  }

  const protectedRoutes = [
    "/profile",
    "/conversations",
    "/settings",
    "/response-generator",
    "/optimizer",
    "/api",
  ];
  return protectedRoutes.some((route) => pathname.startsWith(route));
}
