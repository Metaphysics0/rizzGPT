import { type Handler, sessionHooks } from "@kinde-oss/kinde-auth-sveltekit";

export const handle: Handler = async ({ event, resolve }) => {
  // Set up Kinde session hooks
  sessionHooks({ event });

  // Suppress well-known Chrome DevTools requests
  if (
    event.url.pathname.startsWith(
      "/.well-known/appspecific/com.chrome.devtools"
    )
  ) {
    return new Response(null, { status: 204 }); // Return empty response with 204 No Content
  }

  return await resolve(event);
};
