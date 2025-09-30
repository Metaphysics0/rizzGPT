import { type Handle } from "@sveltejs/kit";
import { svelteKitHandler } from "better-auth/svelte-kit";
import { building } from "$app/environment";
import { auth } from "$lib/server/auth";
import { paraglideMiddleware } from "./lib/paraglide/server";
import { sequence } from "@sveltejs/kit/hooks";
import { actions } from "$lib/server/services/db-actions.service";

const handleCsrf: Handle = async ({ event, resolve }) => {
  const forbidden =
    event.request.method === "POST" &&
    event.request.headers.get("origin") !== event.url.origin &&
    !isWebhookRoute(event.url.pathname);

  if (forbidden) {
    return new Response("Cross-site POST form submissions are forbidden", {
      status: 403,
    });
  }

  return resolve(event);
};

function isWebhookRoute(pathname: string): boolean {
  const webhookRoutes = ["/api/webhooks", "/api/cron"];
  return webhookRoutes.some((route) => pathname.startsWith(route));
}

const handleAuth: Handle = async ({ event, resolve }) => {
  try {
    if (isChromeDevToolsRequest(event.url)) {
      return new Response(null, { status: 204 });
    }

    const session = await auth.api.getSession({
      headers: event.request.headers,
    });

    const eventPathname = event.url.pathname;
    if (doesPathnameRequireSignedInUser(eventPathname) && !session) {
      return new Response(null, {
        status: 302,
        headers: { Location: "/sign-in" },
      });
    }

    // Make session and user available on server
    if (session) {
      event.locals.session = session.session;
      const dbUser = await actions.getUserWithRelations(session.user.id);
      event.locals.user = dbUser;

      if (
        doesPathnameRequirePaidUser(eventPathname) &&
        !dbUser?.hasActiveSubscription
      ) {
        return new Response(null, {
          status: 302,
          headers: { Location: "/upgrade" },
        });
      }
    }

    return svelteKitHandler({ event, resolve, auth, building });
  } catch (error) {
    console.error("Error in handle", error);
    return new Response(null, { status: 500 });
  }
};

const handleParaglide: Handle = ({ event, resolve }) =>
  paraglideMiddleware(
    event.request,
    ({ request: localizedRequest, locale }) => {
      event.request = localizedRequest;
      return resolve(event, {
        transformPageChunk: ({ html }) => {
          return html.replace("%lang%", locale);
        },
      });
    }
  );

function isChromeDevToolsRequest(url: URL) {
  return url.pathname.startsWith(
    "/.well-known/appspecific/com.chrome.devtools"
  );
}

function doesPathnameRequireSignedInUser(pathname: string) {
  const publicRoutes = ["/api/cron", "/api/webhooks", "/api/auth"];
  if (publicRoutes.some((route) => pathname.startsWith(route))) return false;

  const protectedRoutes = [
    "/profile",
    "/conversations",
    "/settings",
    "/response-helper",
    "/first-move-generator",
    "/api",
  ];
  return protectedRoutes.some((route) => pathname.startsWith(route));
}

function doesPathnameRequirePaidUser(pathname: string) {
  const premiumRoutes = ["/conversations", "/profile", "/ai-profile-optimizer"];
  return premiumRoutes.some((route) => pathname.startsWith(route));
}

export const handle: Handle = sequence(handleCsrf, handleParaglide, handleAuth);
