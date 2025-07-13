import { requireAuth } from "$lib/server/utils/require-auth.util";
import { type Handler, sessionHooks } from "@kinde-oss/kinde-auth-sveltekit";
import { json } from "@sveltejs/kit";

export const handle: Handler = async ({ event, resolve }) => {
  sessionHooks({ event });

  if (isChromeDevToolsRequest(event.url)) {
    return new Response(null, { status: 204 });
  }

  // Check if route requires authentication
  const requiresAuth = shouldRequireAuth(event.url.pathname);

  if (requiresAuth) {
    const authResult = await requireAuth(event.request);
    if (authResult.error) return authResult.error;
    if (!authResult.dbUser) {
      return json({ error: "Unauthorized" }, { status: 401 });
    }

    // Set authentication data in event.locals for use in routes
    event.locals.user = authResult.user;
    event.locals.dbUser = authResult.dbUser;
    event.locals.isAuthenticated = true;
  } else {
    // For non-protected routes, still check auth status but don't require it
    const authResult = await requireAuth(event.request);
    event.locals.user = authResult.user;
    event.locals.dbUser = authResult.dbUser;
    event.locals.isAuthenticated = !authResult.error && !!authResult.dbUser;
  }

  return await resolve(event);
};

function isChromeDevToolsRequest(url: URL) {
  return url.pathname.startsWith(
    "/.well-known/appspecific/com.chrome.devtools"
  );
}

/**
 * Determines if a route requires authentication
 */
function shouldRequireAuth(pathname: string): boolean {
  // Protected API routes
  const protectedApiRoutes = [
    "/api/conversations/",
    "/api/trigger-generate-rizz",
    "/api/generate-client-upload-token",
  ];

  // Protected page routes
  const protectedPageRoutes = ["/conversations"];

  // Check API routes
  for (const route of protectedApiRoutes) {
    if (pathname.startsWith(route)) {
      return true;
    }
  }

  // Check page routes
  for (const route of protectedPageRoutes) {
    if (pathname.startsWith(route)) {
      return true;
    }
  }

  return false;
}
