import { requireAuth } from "$lib/server/utils/require-auth.util";
import { type Handler, sessionHooks } from "@kinde-oss/kinde-auth-sveltekit";
import { json } from "@sveltejs/kit";

export const handle: Handler = async ({ event, resolve }) => {
  sessionHooks({ event });

  if (isChromeDevToolsRequest(event.url)) {
    return new Response(null, { status: 204 });
  }

  const authResult = await requireAuth(event.request);
  if (isAuthRequired(event.url.pathname)) {
    if (authResult.error) return authResult.error;
    if (!authResult.dbUser) {
      return json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  event.locals.user = authResult.user;
  event.locals.dbUser = authResult.dbUser;
  event.locals.isAuthenticated = !authResult.error && !!authResult.dbUser;

  return await resolve(event);
};

function isChromeDevToolsRequest(url: URL) {
  return url.pathname.startsWith(
    "/.well-known/appspecific/com.chrome.devtools"
  );
}

function isAuthRequired(pathname: string): boolean {
  const protectedApiRoutes = [
    "/api/conversations/",
    "/api/trigger-generate-rizz",
    "/api/generate-client-upload-token",
    "/api/subscription/",
  ];

  const protectedPageRoutes = ["/conversations"];

  return [...protectedApiRoutes, ...protectedPageRoutes].some((route) =>
    pathname.startsWith(route)
  );
}
