import { type Handler, sessionHooks } from "@kinde-oss/kinde-auth-sveltekit";

export const handle: Handler = async ({ event, resolve }) => {
  sessionHooks({ event });
  if (isChromeDevToolsRequest(event.url)) {
    return new Response(null, { status: 204 });
  }

  return await resolve(event);
};

function isChromeDevToolsRequest(url: URL) {
  return url.pathname.startsWith(
    "/.well-known/appspecific/com.chrome.devtools"
  );
}
